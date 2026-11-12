// Builds the home-page image feed from content/feed.json.
//
// content/feed.json is the list of photos in the order they appear on the page. You normally
// don't edit it by hand: the CMS at /admin does (upload, reorder, captions).
//
// For every photo this plugin reads the real pixel size, works out the left/right cascade, and
// writes the <figure> markup into index.html where the <!-- FEED_ITEMS --> comment is. It runs
// every time the site is built (and in `npm run dev`), so new or reordered photos space
// themselves correctly whatever their shape.
//
// Captions: on phones they always show under the photo, left-aligned with the same side margins
// as the rest of the page (a photo with no caption shows nothing). On desktop they are centred
// and appear when you hover over the photo.
import fs from 'node:fs'
import path from 'node:path'
import { imageSize } from 'image-size'

const MARKER = '<!-- FEED_ITEMS -->'
const DATA_FILE = 'content/feed.json'

// ---- Cascade settings -------------------------------------------------------------------
// Distances are fractions of the feed's width (the CSS `cqw` unit), so spacing scales with
// the window. Change these to loosen or tighten the whole feed.
const LEFT_WIDTH = 0.44 //   share of the feed width taken by a left-column photo
const RIGHT_WIDTH = 0.56 //  ...and by a right-column photo
const FIRST_OFFSET = 0.47 // how far down the 2nd photo starts
const STEP = 0.72 //         each photo starts at least this far down the one before it (0–1)
const GAP = 0.26 //          minimum white space between two photos in the same column
const CAPTION = 0.022 //     room the hover caption takes under each photo
// -----------------------------------------------------------------------------------------

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Pixel size of an image file, correcting for camera rotation. */
function readSize(file) {
  const { width, height, orientation } = imageSize(fs.readFileSync(file))
  if (!width || !height) throw new Error('could not read image size')
  return orientation >= 5 ? { width: height, height: width } : { width, height }
}

/** Alternate left/right and return each photo's side and its `--mt` (see index.html). */
function layout(photos) {
  const tops = []
  const heights = []
  return photos.map((p, i) => {
    const side = i % 2 === 0 ? 'left' : 'right'
    const colWidth = side === 'left' ? LEFT_WIDTH : RIGHT_WIDTH
    heights.push((colWidth * p.height) / p.width)

    let top
    if (i === 0) top = 0
    else if (i === 1) top = FIRST_OFFSET
    else {
      const clearSameColumn = tops[i - 2] + heights[i - 2] + GAP
      const steppedDown = tops[i - 1] + STEP * heights[i - 1]
      top = Math.max(clearSameColumn, steppedDown)
    }
    tops.push(top)

    // margin-top relative to the bottom of the previous figure (its photo + caption room)
    const mt = i === 0 ? 0 : top - (tops[i - 1] + heights[i - 1] + CAPTION)
    return { side, mt }
  })
}

function figure(p, side, mt, first) {
  const style = first ? '' : ` style="--mt:${(mt * 100).toFixed(2)}cqw"`
  return `        <figure class="group feed-item feed-${side}"${style}>
          <img src="${esc(p.src)}" alt="" width="${p.width}" height="${p.height}" class="block h-auto w-full" loading="lazy" onerror="this.style.display='none'" />
          <figcaption class="mt-3 block pl-[17px] pr-[40px] text-left text-[11px] font-medium leading-[14px] text-stone-500 transition-opacity duration-200 empty:hidden sm:empty:block sm:pl-0 sm:pr-0 sm:text-center sm:opacity-0 sm:group-hover:opacity-100">${esc(p.caption)}</figcaption>
        </figure>
`
}

export default function feed() {
  let root = process.cwd()
  const dataPath = () => path.resolve(root, DATA_FILE)

  function render() {
    let data
    try {
      data = JSON.parse(fs.readFileSync(dataPath(), 'utf-8'))
    } catch (err) {
      throw new Error(`Could not read ${DATA_FILE}: ${err.message}`)
    }

    const publicDir = path.resolve(root, 'public')
    const photos = []
    for (const item of data.images ?? []) {
      const src = String(item?.image ?? '')
      if (!src) continue
      const file = path.resolve(publicDir, '.' + (src.startsWith('/') ? src : '/' + src))
      if (!file.startsWith(publicDir + path.sep) || !fs.existsSync(file)) {
        console.warn(`[feed] skipping "${src}": file not found in public/`)
        continue
      }
      try {
        photos.push({ src, caption: item.caption ?? '', ...readSize(file) })
      } catch (err) {
        console.warn(`[feed] skipping "${src}": ${err.message}`)
      }
    }

    return layout(photos)
      .map((l, i) => figure(photos[i], l.side, l.mt, i === 0))
      .join('')
  }

  return {
    name: 'studio-hobi-feed',
    configResolved(config) {
      root = config.root
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.includes(MARKER) ? html.replace(MARKER, render().trimEnd()) : html
      },
    },
    configureServer(server) {
      server.watcher.add(dataPath())
      server.watcher.on('change', (file) => {
        if (path.resolve(file) === dataPath()) server.ws.send({ type: 'full-reload' })
      })
    },
  }
}

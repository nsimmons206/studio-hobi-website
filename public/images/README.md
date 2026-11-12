# Project images

Photos for the home-page feed live in this folder.

## Adding, reordering and captioning photos

Use the content manager at **https://studiohobi.com/admin/** (see `public/admin/config.yml`).
It uploads the photo into this folder, shrinks it to a web-friendly size, and saves the order
and captions in `content/feed.json`. The site then rebuilds on its own.

## By hand (optional)

You can also drop an image in this folder and add a line to `content/feed.json`:

```json
{ "image": "/images/my-photo.jpg", "caption": "Optional caption." }
```

The order of that list is the order on the page, and the photos alternate left and right on
desktop. Spacing is worked out automatically from each photo's shape (see `plugins/feed.js`).
Keep photos under about 2000 px on the long side so the page stays fast.

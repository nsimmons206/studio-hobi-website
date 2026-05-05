# Project images

Drop the eight Studio Hobi photos in this folder, named `01.jpg` through `08.jpg`.

## Visual order on the page

| File      | Column | Position    | Aspect ratio (w × h) | Figma source                                      |
|-----------|--------|-------------|----------------------|---------------------------------------------------|
| `01.jpg`  | Left   | 1st (top)   | 579 × 862 (~2:3)     | "Screenshot 2025-12-18 at 5.29.35 PM 1" (stool)   |
| `02.jpg`  | Right  | 1st         | 738 × 570 (~4:3)     | "hero_2-2048x 1" (workshop wide)                  |
| `03.jpg`  | Left   | 2nd         | 579 × 892 (~2:3)     | "IMG_3184 1" (windows)                            |
| `04.jpg`  | Right  | 2nd         | 738 × 1011 (~3:4)    | "IMG_2307 1" (chest / table)                      |
| `05.jpg`  | Left   | 3rd         | 579 × 797 (~3:4)     | "IMG_2534 1" (kitchen cabinets)                   |
| `06.jpg`  | Right  | 3rd         | 738 × 648 (~7:6)     | "0E36287C-…" (kitchen interior)                   |
| `07.jpg`  | Left   | 4th         | 579 × 743 (~3:4)     | "DCDA5A6D-…" (wooden bench wide)                  |
| `08.jpg`  | Right  | 4th         | 738 × 1096 (~2:3)    | "IMG_2565 1" (wooden bench close)                 |

Don't worry about matching the exact pixel dimensions — the layout uses CSS aspect ratios. Just keep each photo's *aspect ratio* close to the column it's in (vertical for left, varied for right) and they'll look right. Lightly cropping in Figma export is fine.

## Exporting from Figma

For each image in the Figma file:

1. Click the image layer in Figma.
2. In the right sidebar, scroll to **Export**.
3. Click **+** to add an export setting if there isn't one. Set:
   - Format: **JPG** (smaller file size; PNG only if you need transparency)
   - Suffix: leave blank
   - Scale: **2x** (this gives crisp results on retina displays)
4. Click **Export [layer name]**.
5. Rename the exported file to match the table above (`01.jpg`, `02.jpg`, …).
6. Drop it in this folder.

## Optimizing file size (optional but recommended)

Photos can be large. Before adding them, consider compressing them through:

- **TinyJPG** (https://tinyjpg.com) — drag-and-drop browser tool, lossless-feeling compression
- **ImageOptim** (Mac app, https://imageoptim.com) — desktop, batch, free

A reasonable target is **under 300 KB per image**; under 150 KB is even better and won't hurt visual quality at typical screen sizes.

## Adding more images later

If you want to add a 9th, 10th, … image, just:

1. Drop the new file here as `09.jpg`, `10.jpg`, etc.
2. In `index.html`, copy one of the existing `<figure>` blocks and update the `aspect-[…]` value and `src` to match.

The columns automatically grow longer as you add more figures.

from PIL import Image
from pathlib import Path

source = Path("public/pngframes")
output = Path("public/croppedframes")

output.mkdir(exist_ok=True)

for i in range(1, 65):

    filename = source / f"frame-{i:03d}.png"
    image = Image.open(filename).convert("RGB")

    width, height = image.size
    pixels = image.load()

    top = None
    bottom = None

    for y in range(height):
        bright_pixels = 0

        for x in range(0, width, 8):
            r, g, b = pixels[x, y]

            if r > 35 and (r + g + b) > 70:
                bright_pixels += 1

        if bright_pixels > width // 40:
            top = y
            break

    for y in range(height - 1, -1, -1):
        bright_pixels = 0

        for x in range(0, width, 8):
            r, g, b = pixels[x, y]

            if r > 35 and (r + g + b) > 70:
                bright_pixels += 1

        if bright_pixels > width // 40:
            bottom = y
            break

    if top is None:
        top = int(height * 0.25)

    if bottom is None:
        bottom = int(height * 0.75)

    padding = 25

    top = max(0, top - padding)
    bottom = min(height, bottom + padding)

    cropped = image.crop((0, top, width, bottom))

    cropped.save(
        output / f"frame-{i:03d}.png",
        optimize=True
    )

    print(f"Created frame {i}/64")

print()
print("DONE - 64 cropped frames created.")
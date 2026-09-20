from pathlib import Path
import sys

from PIL import Image


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        raise ValueError("Image has no visible pixels")
    return bbox


def recolor_dark_pixels_white(image: Image.Image) -> Image.Image:
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue, alpha = pixels[x, y]
            if alpha > 0 and max(red, green, blue) - min(red, green, blue) < 80:
                pixels[x, y] = (255, 255, 255, alpha)
    return image


def main() -> None:
    if len(sys.argv) != 4:
        raise SystemExit(
            "Usage: build-brand-assets.py <original-logo> <enhanced-logo> <output-dir>"
        )

    original_path = Path(sys.argv[1])
    enhanced_path = Path(sys.argv[2])
    output_dir = Path(sys.argv[3])
    output_dir.mkdir(parents=True, exist_ok=True)

    original = Image.open(original_path).convert("RGBA")
    enhanced = Image.open(enhanced_path).convert("RGBA")

    # Isolate the regenerated emblem from the left side of the enhanced artwork.
    emblem_region = enhanced.crop((0, 0, min(610, enhanced.width), enhanced.height))
    emblem = emblem_region.crop(alpha_bbox(emblem_region))
    emblem.thumbnail((220, 220), Image.Resampling.LANCZOS)

    emblem_square = Image.new("RGBA", (236, 236), (0, 0, 0, 0))
    emblem_square.alpha_composite(
        emblem,
        ((emblem_square.width - emblem.width) // 2, (emblem_square.height - emblem.height) // 2),
    )

    # Preserve the exact original wordmark and subtitle, only improving contrast.
    wordmark_region = original.crop((58, 0, original.width, original.height))
    wordmark = wordmark_region.crop(alpha_bbox(wordmark_region))
    wordmark = recolor_dark_pixels_white(wordmark)
    scale = 168 / wordmark.height
    wordmark = wordmark.resize(
        (round(wordmark.width * scale), 168), Image.Resampling.LANCZOS
    )
    wordmark = recolor_dark_pixels_white(wordmark)

    gap = 24
    canvas = Image.new(
        "RGBA", (emblem_square.width + gap + wordmark.width, 236), (0, 0, 0, 0)
    )
    canvas.alpha_composite(emblem_square, (0, 0))
    canvas.alpha_composite(wordmark, (emblem_square.width + gap, 34))
    canvas.save(output_dir / "logo-enhanced.png", optimize=True)

    favicon = emblem_square.resize((512, 512), Image.Resampling.LANCZOS)
    favicon.save(output_dir / "favicon.png", optimize=True)
    favicon.save(
        output_dir / "favicon.ico",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
    )


if __name__ == "__main__":
    main()

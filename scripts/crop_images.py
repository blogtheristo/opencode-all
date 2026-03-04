import os
import sys

from PIL import Image, ImageChops

# Disable DecompressionBombWarning just in case
Image.MAX_IMAGE_PIXELS = None


def crop_white_border(filepath):
    try:
        img = Image.open(filepath)

        # Convert to RGB to reliably detect white background
        # This handles RGBA by ignoring alpha for the white check
        # (Transparent pixels will be different from White, so they are kept)
        # (White opaque pixels will match White, so they are cropped)
        rgb_img = img.convert("RGB")

        bg = Image.new("RGB", img.size, (255, 255, 255))
        diff = ImageChops.difference(rgb_img, bg)

        # Get bounding box of non-white pixels
        bbox = diff.getbbox()

        if bbox:
            # Crop the ORIGINAL image
            cropped_img = img.crop(bbox)
            cropped_img.save(filepath)
            print(f"Cropped: {filepath} (New size: {cropped_img.size})")
        else:
            print(f"No cropping needed or empty: {filepath}")

    except Exception as e:
        print(f"Error cropping {filepath}: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python crop_images.py <directory>")
        sys.exit(1)

    target_dir = sys.argv[1]
    if not os.path.exists(target_dir):
        print(f"Directory not found: {target_dir}")
        sys.exit(1)

    print(f"Processing images in {target_dir}...")
    for filename in os.listdir(target_dir):
        if filename.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
            crop_white_border(os.path.join(target_dir, filename))

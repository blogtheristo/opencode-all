import os

from PIL import Image, ImageDraw, ImageFont


def create_logo():
    # Settings
    text = "OneLifetime.World"
    color = "#1e3a8a"  # Indigo-900 (Dark Blue - High Contrast)
    bg_color = (255, 255, 255, 0)  # Transparent

    # Increased size for better readability
    font_size = 80
    padding = 20

    # Create a dummy image to calculate text size
    dummy_img = Image.new("RGBA", (1, 1), bg_color)
    draw = ImageDraw.Draw(dummy_img)

    # Load a font - bold if possible for readability
    try:
        font = ImageFont.truetype("arialbd.ttf", font_size)  # Arial Bold
    except OSError:
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except OSError:
            font = ImageFont.load_default()

    # Calculate size
    bbox = draw.textbbox((0, 0), text, font=font)
    width = bbox[2] - bbox[0] + (padding * 2)
    height = bbox[3] - bbox[1] + (padding * 2)

    # Create real image
    img = Image.new("RGBA", (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    # Draw text
    draw.text((padding, padding), text, font=font, fill=color)

    # Save
    output_dir = "sites/onelifetime-world/static/images"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    output_path = os.path.join(output_dir, "brand_logo.png")
    img.save(output_path)
    print(f"✅ Logo created at: {output_path}")


if __name__ == "__main__":
    create_logo()

import os

from PIL import Image, ImageDraw, ImageFont


def create_dws_iq_logo():
    # Settings
    text = "DWS IQ"
    # Create a brain/node icon + text
    width = 200
    height = 60
    bg_color = (255, 255, 255, 0)
    primary_color = "#4f46e5"  # Indigo-600

    img = Image.new("RGBA", (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    # Draw simple hex/brain icon
    # Hexagon points
    cx, cy = 30, 30
    r = 20
    # Draw a circle for now as "Brain" node
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=primary_color)

    # Draw Text
    try:
        font = ImageFont.truetype("arial.ttf", 36)
    except OSError:
        font = ImageFont.load_default()

    draw.text((60, 10), text, font=font, fill="#1e1b4b")  # Indigo-950

    # Save
    output_dir = "sites/onelifetime-world/static/images"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    output_path = os.path.join(output_dir, "dws_iq_logo.png")
    img.save(output_path)
    print(f"✅ DWS IQ Logo created at: {output_path}")


if __name__ == "__main__":
    create_dws_iq_logo()

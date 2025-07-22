from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

# --- Settings ---
FAVICON_SIZE = 64  # Will be resized to 32x32 and 16x16 for .ico
OG_WIDTH, OG_HEIGHT = 1200, 630
OG_FILENAME = 'public/og-thumbnail.png'
FAVICON_FILENAME = 'public/favicon.ico'

# Colors and theme
BG_COLOR = (36, 36, 36)  # #242424
ACCENT_COLOR = (0, 255, 164)  # Neon green
TEXT_COLOR = (255, 255, 255)
SHADOW_COLOR = (0, 0, 0, 128)

# --- Favicon Generation ---
def generate_favicon():
    img = Image.new('RGBA', (FAVICON_SIZE, FAVICON_SIZE), BG_COLOR)
    draw = ImageDraw.Draw(img)
    # Draw a glowing circle
    glow_radius = FAVICON_SIZE // 2 - 4
    draw.ellipse([
        (FAVICON_SIZE//2 - glow_radius, FAVICON_SIZE//2 - glow_radius),
        (FAVICON_SIZE//2 + glow_radius, FAVICON_SIZE//2 + glow_radius)
    ], fill=ACCENT_COLOR)
    # Draw initials (AK)
    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", FAVICON_SIZE//2)
    except:
        font = ImageFont.load_default()
    text = "AK"
    bbox = font.getbbox(text)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((FAVICON_SIZE-w)//2, (FAVICON_SIZE-h)//2), text, fill=BG_COLOR, font=font)
    # Save as .ico (multiple sizes)
    img_32 = img.resize((32, 32), Image.LANCZOS)
    img_16 = img.resize((16, 16), Image.LANCZOS)
    img.save(FAVICON_FILENAME, format='ICO', sizes=[(64,64),(32,32),(16,16)])
    print(f"Favicon saved to {FAVICON_FILENAME}")

# --- Open Graph Thumbnail Generation ---
def generate_og_thumbnail():
    img = Image.new('RGB', (OG_WIDTH, OG_HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    # Glowing border
    border = 16
    for i in range(8):
        draw.rectangle([
            border-i, border-i, OG_WIDTH-border+i, OG_HEIGHT-border+i
        ], outline=(0,255,164, max(0, 128-16*i)))
    # Large initials or logo
    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", 180)
    except:
        font = ImageFont.load_default()
    initials = "Aneesh\nKrishna"
    # Calculate multiline text size
    lines = initials.split('\n')
    line_heights = [font.getbbox(line)[3] - font.getbbox(line)[1] for line in lines]
    max_width = max([font.getbbox(line)[2] - font.getbbox(line)[0] for line in lines])
    total_height = sum(line_heights) + (len(lines)-1)*20
    w, h = max_width, total_height
    y = (OG_HEIGHT - h)//2 - 40
    for i, line in enumerate(lines):
        lw = font.getbbox(line)[2] - font.getbbox(line)[0]
        draw.text(((OG_WIDTH-lw)//2, y), line, fill=ACCENT_COLOR, font=font, align="center")
        y += line_heights[i] + 20
    # Tagline
    try:
        tagline_font = ImageFont.truetype("DejaVuSans-Bold.ttf", 48)
    except:
        tagline_font = ImageFont.load_default()
    tagline = "Software Engineer | Blockchain | Games"
    bbox = tagline_font.getbbox(tagline)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((OG_WIDTH-tw)//2, OG_HEIGHT//2+h//2+20), tagline, fill=TEXT_COLOR, font=tagline_font)
    # Glow effect
    blurred = img.filter(ImageFilter.GaussianBlur(4))
    img = Image.blend(blurred, img, 0.7)
    # Overlay again for sharpness
    draw = ImageDraw.Draw(img)
    y = (OG_HEIGHT - h)//2 - 40
    for i, line in enumerate(lines):
        lw = font.getbbox(line)[2] - font.getbbox(line)[0]
        draw.text(((OG_WIDTH-lw)//2, y), line, fill=ACCENT_COLOR, font=font, align="center")
        y += line_heights[i] + 20
    bbox = tagline_font.getbbox(tagline)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((OG_WIDTH-tw)//2, OG_HEIGHT//2+h//2+20), tagline, fill=TEXT_COLOR, font=tagline_font)
    # Save
    img.save(OG_FILENAME)
    print(f"Open Graph thumbnail saved to {OG_FILENAME}")

if __name__ == "__main__":
    os.makedirs('public', exist_ok=True)
    generate_favicon()
    generate_og_thumbnail()
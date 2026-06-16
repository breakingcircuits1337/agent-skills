#!/usr/bin/env python3
"""
canvas_starter.py — Canvas Design Skill: Ready-to-run scaffold.

INSTRUCTIONS FOR THE SUBAGENT:
1. Copy this file to /tmp/canvas_output.py
2. Fill in ONLY the `draw_canvas(img, draw, W, H)` function with your art.
3. Change OUTPUT_PATH if the user specified a path.
4. Run: python3 /tmp/canvas_output.py
5. Report the output path to the user.

DO NOT rewrite the setup, progress, or font infrastructure — it already works.
DO NOT download fonts — use load_font() with filenames from FONTS_DIR.
"""

import os, sys, math, datetime, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ─── Progress logging (mandatory — write before every major step) ──────────────
PROGRESS_LOG = "/tmp/canvas-design-progress.log"

def progress(msg):
    ts = datetime.datetime.now().strftime("%H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    with open(PROGRESS_LOG, "a") as f:
        f.write(line + "\n")

progress("canvas_starter.py: scaffold initializing")

# ─── Paths ─────────────────────────────────────────────────────────────────────
SKILL_DIR  = os.path.dirname(os.path.abspath(__file__))
FONTS_DIR  = os.path.join(SKILL_DIR, "canvas-fonts")
OUTPUT_PATH = "/tmp/canvas-output.png"   # ← CHANGE THIS to the user's requested path

# ─── Font loader (bundled fonts only — NO internet downloads) ──────────────────
#
# Available filenames (pick from these):
#   JetBrainsMono-Regular.ttf / JetBrainsMono-Bold.ttf
#   GeistMono-Regular.ttf     / GeistMono-Bold.ttf
#   IBMPlexMono-Regular.ttf   / IBMPlexMono-Bold.ttf
#   WorkSans-Regular.ttf      / WorkSans-Bold.ttf
#   BricolageGrotesque-Regular.ttf / BricolageGrotesque-Bold.ttf
#   Outfit-Regular.ttf        / Outfit-Bold.ttf
#   InstrumentSans-Regular.ttf / InstrumentSans-Bold.ttf
#   Gloock-Regular.ttf
#   Lora-Regular.ttf          / Lora-Bold.ttf
#   CrimsonPro-Regular.ttf    / CrimsonPro-Bold.ttf
#   DMMono-Regular.ttf
#   PoiretOne-Regular.ttf
#   Italiana-Regular.ttf
#   NationalPark-Regular.ttf  / NationalPark-Bold.ttf
#   Jura-Light.ttf            / Jura-Medium.ttf
#   RedHatMono-Regular.ttf    / RedHatMono-Bold.ttf
#   YoungSerif-Regular.ttf
#   BigShoulders-Regular.ttf  / BigShoulders-Bold.ttf
#   ArsenalSC-Regular.ttf
#   EricaOne-Regular.ttf
#   Boldonse-Regular.ttf
#   NothingYouCouldDo-Regular.ttf
#
def load_font(filename, size):
    path = os.path.join(FONTS_DIR, filename)
    try:
        return ImageFont.truetype(path, size)
    except Exception as e:
        progress(f"Font load failed ({filename}): {e} — using default")
        return ImageFont.load_default()

# ─── Canvas size ───────────────────────────────────────────────────────────────
W, H = 1440, 900   # ← CHANGE THIS to the user's requested size

# ─── Helper: draw centered text ────────────────────────────────────────────────
def draw_centered_text(draw, text, font, y, color, W):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, y), text, font=font, fill=color)

# ─── Helper: draw text with bbox safety check ─────────────────────────────────
def safe_text(draw, xy, text, font, fill, max_width=None):
    """Draw text only if it fits within max_width (defaults to no clip)."""
    if max_width:
        bbox = draw.textbbox((0, 0), text, font=font)
        if (bbox[2] - bbox[0]) > max_width:
            return  # skip rather than overflow
    draw.text(xy, text, font=font, fill=fill)

# ─── Helper: interpolate two RGB colors ────────────────────────────────────────
def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))

# ─── Helper: draw a horizontal gradient band ───────────────────────────────────
def gradient_rect(draw, x0, y0, x1, y1, c1, c2, steps=200):
    for i in range(steps):
        t  = i / steps
        x  = int(x0 + (x1 - x0) * t)
        nx = int(x0 + (x1 - x0) * (i + 1) / steps)
        draw.rectangle([x, y0, nx, y1], fill=lerp_color(c1, c2, t))

# ─── Helper: draw a vertical gradient band ─────────────────────────────────────
def gradient_rect_v(draw, x0, y0, x1, y1, c1, c2, steps=200):
    for i in range(steps):
        t  = i / steps
        y  = int(y0 + (y1 - y0) * t)
        ny = int(y0 + (y1 - y0) * (i + 1) / steps)
        draw.rectangle([x0, y, x1, ny], fill=lerp_color(c1, c2, t))

# ─── Helper: draw a circle ─────────────────────────────────────────────────────
def circle(draw, cx, cy, r, fill=None, outline=None, width=1):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill, outline=outline, width=width)

# ─── Helper: polygon from center + radius + n_sides ───────────────────────────
def regular_polygon_points(cx, cy, r, n, rotation=0):
    pts = []
    for i in range(n):
        a = math.radians(rotation + i * 360 / n)
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


# ══════════════════════════════════════════════════════════════════════════════
# ▶▶  FILL IN THIS FUNCTION — everything else is done for you  ◀◀
# ══════════════════════════════════════════════════════════════════════════════

def draw_canvas(img: Image.Image, draw: ImageDraw.Draw, W: int, H: int):
    """
    Paint the design philosophy onto the canvas.

    Guidelines:
    - This function is called once with a blank (or pre-filled BG) canvas.
    - Write progress("Step 3/4: Drawing canvas — [element]") before each major section.
    - Use load_font(filename, size) for all text. Never download fonts.
    - Keep all elements inside the canvas boundaries (add margins ≥ 40px).
    - Art is 90% visual, 10% text. Minimal typography.
    - After drawing, the runner below saves the file — do not call img.save() here.
    """
    # ── Background ────────────────────────────────────────────────────────────
    progress("Step 3/4: Drawing canvas — background")
    BG = (10, 13, 22)
    draw.rectangle([0, 0, W, H], fill=BG)

    # ── Example: a single centered circle (replace with your art) ─────────────
    progress("Step 3/4: Drawing canvas — primary form")
    circle(draw, W // 2, H // 2, 200, outline=(66, 133, 244), width=2)

    # ── Typography (minimal) ──────────────────────────────────────────────────
    progress("Step 3/4: Drawing canvas — typography")
    font_title = load_font("PoiretOne-Regular.ttf", 28)
    draw_centered_text(draw, "CANVAS", font_title, H - 80, (180, 190, 210), W)


# ══════════════════════════════════════════════════════════════════════════════
#  Runner — do not modify below this line
# ══════════════════════════════════════════════════════════════════════════════

def main():
    progress("Step 1/4: Writing design philosophy .md — (handled in philosophy step)")
    progress(f"Step 2/4: Setting up canvas — size {W}x{H}, loading fonts")

    img  = Image.new("RGB", (W, H), (0, 0, 0))
    draw = ImageDraw.Draw(img)

    try:
        draw_canvas(img, draw, W, H)
    except Exception as e:
        progress(f"ERROR — draw_canvas failed: {e}, attempting recovery")
        # Recovery: blank BG + error label
        draw.rectangle([0, 0, W, H], fill=(10, 13, 22))
        try:
            f = load_font("GeistMono-Regular.ttf", 18)
            draw.text((40, 40), f"render error: {e}", font=f, fill=(234, 67, 53))
        except Exception:
            pass

    progress(f"Step 4/4: Saving output to {OUTPUT_PATH}")
    os.makedirs(os.path.dirname(OUTPUT_PATH) if os.path.dirname(OUTPUT_PATH) else ".", exist_ok=True)
    img.save(OUTPUT_PATH, "PNG", optimize=True)
    progress(f"DONE — output saved to {OUTPUT_PATH}")
    print(f"\nOutput: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()

"""K4BT overlay: mark geometrical pine envelopes on the already-rendered K4BS frame.

No resampling, rerender, silhouette claims, source edits or visual art PASS.
Run with /usr/bin/python3 (system python3-pil).
"""
import hashlib
import json
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

argv = sys.argv[1:]
def opt(key):
    return Path(argv[argv.index(key) + 1]).resolve()

src = opt("--image")
report = opt("--audit")
out = opt("--out")
ORIGINAL_SHA256 = "be95187ce5fba724547a0333bcca261b8c300ee0bb9316edd23cfc18ca85ba3f"
assert hashlib.sha256(src.read_bytes()).hexdigest() == ORIGINAL_SHA256
data = json.loads(report.read_text(encoding="utf-8"))
assert data["originK4BSNativeBlendSHA256"] == "156e56ce373b731f1f0c8f96278a11977ac93d491973c2e8ef796ec1ea7795de"
assert data["renderPerformed"] is False and data["blendFileWritten"] is False
assert data["formalArtAccepted"] == data["formalSlope2DNAMetres"] == 0
assert len(data["treeInstances"]) == 8
im = Image.open(src).convert("RGB")
assert list(im.size) == data["imageSizePixels"] == [1280, 800]
pen = ImageDraw.Draw(im)
for idx, tree in enumerate(data["treeInstances"]):
    bounds = tree["clippedProjectedEnvelopePixels"]
    if not tree["intersectsFrameByBoundingEnvelope"]:
        continue
    x0, y0, x1, y1 = bounds
    if x1 <= x0 or y1 <= y0:
        continue
    pen.rectangle((x0, y0, x1, y1), outline=(255, 216, 50), width=3)
    label = "TREE %02d / BBOX %.1f%%" % (idx + 1, tree["clippedEnvelopeAreaPercentOfFrame"])
    tx = max(2, min(1060, x0))
    ty = max(38, min(770, y0 - 18))
    pen.rectangle((tx, ty, tx + 205, ty + 17), fill=(0, 0, 0))
    pen.text((tx + 3, ty + 2), label, fill=(255, 255, 255))
pen.rectangle((0, 0, 1280, 38), fill=(0, 0, 0))
pen.text((12, 9), "K4BT / K4BS SAME CHASE / NATIVE TREE PROJECTION ENVELOPES (NOT RENDERED PIXEL MASK)", fill=(255, 255, 255))
pen.rectangle((0, 772, 1280, 800), fill=(0, 0, 0))
pen.text((12, 778), "BBox not silhouette; alpha / occlusion / visibility NOT measured. ART REJECT. NOT GAME.", fill=(255, 255, 255))
out.parent.mkdir(parents=True, exist_ok=True)
im.save(out)
print("K4BT_NATIVE_GEOMETRY_BBOX_OVERLAY_CREATED", out)

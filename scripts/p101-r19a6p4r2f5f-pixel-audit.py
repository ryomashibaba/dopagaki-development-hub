"""R2F5-E: read-only true PNG compare with source-matched R2F5-D.
Pixel differences demonstrate change, NEVER independent ART or hazard pass.
"""
import json,hashlib
from pathlib import Path
from PIL import Image, ImageChops
root=Path("r19-evidence")
report={"schema":"dopagaki.r2f5f-original-native-vs-e-pixel-comparison-v1",
        "sourceNativeTick":1921,"resolution":[1013,698],"diffThreshold":36,
        "ART":"HOLD","B51Raster":"NOT_VERIFIED","humanUse":"NOT_VERIFIED",
        "comparisons":[]}
for mode in ("ultra","control"):
    d=root/"r19a6p4r2f5e"/("R19_A6P4R2F5E_"+mode+"_BLENDER_1921_TRUE_SOURCE_WEBGL2.png")
    e=root/"r19a6p4r2f5f"/("R19_A6P4R2F5F_"+mode+"_BLENDER_1921_TRUE_SOURCE_WEBGL2.png")
    ea=json.loads((root/"r19a6p4r2f5f"/"R19A6P4R2F5F_REAL_12_NATIVE_WEBGL2_REPORT.json").read_text())
    found=next(x for x in ea["comparisons"] if x["mode"]==mode)
    assert hashlib.sha256(e.read_bytes()).hexdigest()==found["editedSHA256"]
    a,b=Image.open(d).convert("RGB"),Image.open(e).convert("RGB")
    assert a.size==b.size==(1013,698)
    diff=ImageChops.difference(a,b)
    thresholds={}
    for name,(x0,y0,x1,y1) in {
        "whole":(0,0,1013,698),
        "leftCivic":(0,200,370,480),
        "roadMid":(355,290,825,620)
    }.items():
        colors=list(diff.crop((x0,y0,x1,y1)).getdata())
        thresholds[name]=round(100*sum(max(p)>36 for p in colors)/len(colors),5)
    report["comparisons"].append({"mode":mode,"R2F5E_SHA256":hashlib.sha256(d.read_bytes()).hexdigest(),
        "R2F5F_SHA256":found["editedSHA256"],"differencePercent":thresholds})
output=root/"r19a6p4r2f5f"/"R2F5F_VS_E_TRUE_SOURCE_PIXELS_RESEARCH_ONLY.json"
output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n")
print("R2F5F_REAL_SOURCE_PIXELS_ART_UNREVIEWED",json.dumps(report))

#!/usr/bin/env python3
"""Independent real native 240Hz original Road5 K4AS vs K4AT image audit."""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw

TIMES={"ultra":[11320,11341,11369],"control":[11259,11278,11307]}
SRC="af076d67492a677d2235e4730aef8cdf4808e106"


def check(value,code):
    if not value: raise AssertionError("K4AT_"+code)


def readpng(root,entry):
    f=entry["file"]
    check(Path(f).name==f and f.endswith(".png"),"FILE_PATH")
    raw=(root/f).read_bytes()
    check(len(raw)==entry["bytes"],"PNG_BYTES")
    check(hashlib.sha256(raw).hexdigest()==entry["sha256"],"PNG_SHA")
    with Image.open(root/f) as im:
        check(im.format=="PNG","NOT_TRUE_PNG")
        rgb=im.convert("RGB")
        check(rgb.width>=800 and rgb.height>=500,"SMALL_CANVAS")
        return rgb


def changes(a,b,threshold=9):
    check(a.size==b.size,"FRAME_SIZE")
    hist=ImageChops.difference(a,b).convert("L").histogram()
    return sum(hist[threshold:])


def audit(root):
    record=json.loads((root/"K4AT_TRUE_NATIVE_ART_AB.json").read_text())
    check(record["schema"]=="dopagaki.K4AT.genuine-original-Road5-canyon-AB/1","SCHEMA")
    check(record["sourceBlob"]==SRC and record["originalPhysicsHz"]==240,"SOURCE_NATIVE")
    check(record["realRoadCount"]==7 and record["originalB51"]==28,"SOURCE_ROAD_HAZARD")
    check(record["actualChromiumWebGL2"] is True,"NOT_WEBGL2")
    check(record["errors"]==[] and len(record["sessions"])==4,"SESSIONS")
    check(len(record["comparisons"])==6,"MISSING_SIX_CAMERAS")
    check(record["formalArtAccepted"]==record["slope2DNAMetres"]==0,"FALSE_PROMOTION")
    check(all(record[x]=="HOLD" for x in ("HUMAN","SAT","CCD","FPS","RELEASE","MERGE")),"GATES")
    check(record["ART"]=="NOT_TESTED_HOLD","ART_GUARD")
    roles={(r["mode"],r["variant"]):r for r in record["sessions"]}
    check(set(roles)=={(m,v) for m in TIMES for v in ("material-base","civic-canyon")},
          "BAD_VARIANTS")
    comparisons={}
    for item in record["comparisons"]:
        k=item["mode"],item["tick"]
        check(k not in comparisons and k[0] in TIMES and k[1] in TIMES[k[0]],"BAD_TICK")
        check(item["sourceNativePoseIdentical"] is True and item["ART"]=="NOT_TESTED_HOLD",
             "NATIVE_POSE_OR_ART")
        base=readpng(root,item["k4as"])
        art=readpng(root,item["k4at"])
        check(item["differenceIsActualArtPixels"] ==
              (item["k4as"]["sha256"]!=item["k4at"]["sha256"]),"SOURCE_DIFF_FLAG")
        total=base.width*base.height
        pixels=changes(base,art)
        comparisons[k]=(base,art)
        item["changedOver9LumaPixels"]=pixels
        item["changedFraction"]=round(pixels/total,6)
    check(set(comparisons)=={(m,t) for m in TIMES for t in TIMES[m]},"MISSING_TICKS")
    check(sum(item["changedOver9LumaPixels"]>=2000
              for item in record["comparisons"])>=2,
          "NO_VISIBLE_SCULPTURE_SOURCE_CAMERA")
    # Honest canvas bitmap atlas. No retouching or color enhancement permitted.
    width,height=610,418
    atlas=Image.new("RGB",(width*2,height*6),(15,17,20))
    draw=ImageDraw.Draw(atlas)
    for i,k in enumerate([(m,t) for m,arr in TIMES.items() for t in arr]):
        for j,im in enumerate(comparisons[k]):
            pic=im.copy();pic.thumbnail((width-8,height-32))
            atlas.paste(pic,(j*width+4,i*height+28))
            label="K4AS ORIGINAL MATERIALS" if j==0 else "K4AT NEW CIVIC CANYON"
            draw.text((j*width+7,i*height+5),f"{k[0]} {k[1]} | {label}",
                      fill=(235,235,226))
    atlas.save(root/"K4AT_GENUINE_CAMERA_12_AB_ATLAS.png")
    return {"schema":"dopagaki.K4AT.independent-source-camera-12-PNG/1",
       "sourceBlob":SRC,"nativeCameraAB":6,"verifiedNativePNGs":12,
       "perFrame":[{key:entry[key] for key in ("mode","tick","changedOver9LumaPixels","changedFraction")}
                   for entry in record["comparisons"]],
       "verdict":"SOURCE_SCREEN_ART_PIXELS_MEASURED_ART_HOLD",
       "cameraAndPhysics":"ORIGINAL_NATIVE_VERIFIED_BY_SESSION",
       "ART":"NOT_TESTED_HOLD","formalArtAccepted":0,"slope2DNAMetres":0,
       "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
       "visualBeauty":"REQUIRES_HUMAN_REVIEW_FROM_ACTUAL_PNG",
       "humanReadabilityAt200Mps":"UNKNOWN","sourceB51OcclusionSafety":"NOT_TESTED"}

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--root",type=Path,default=Path("r19-evidence/k4at"))
    args=parser.parse_args()
    result=audit(args.root)
    (args.root/"K4AT_INDEPENDENT_SOURCE_ART_REVIEW.json").write_text(
        json.dumps(result,indent=2,ensure_ascii=False)+"\n")
    print(result["verdict"])

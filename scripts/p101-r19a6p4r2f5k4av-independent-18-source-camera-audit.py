#!/usr/bin/env python3
"""K4AV: 18 ORIGINAL native camera PNGs, 3-way SOURCE-only ART review.

This fails closed if the sky/palette changes but authored new architecture is
not visible in genuine Road5 source frames. It NEVER certifies visual beauty.
"""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw

SOURCE="af076d67492a677d2235e4730aef8cdf4808e106"
TIMES={"ultra":(11320,11341,11369),"control":(11259,11278,11307)}
ROLES=("k4au-base","k4av-sky-only","k4av-full")

def must(ok,why):
    if not ok:
        raise AssertionError("K4AV_"+why)

def image(root,obj):
    name=obj.get("file")
    must(isinstance(name,str) and name==Path(name).name and
         name.endswith(".png"),"BAD_SOURCE_FILENAME")
    raw=(root/name).read_bytes()
    must(obj["bytes"]==len(raw),"RAW_PNG_BYTES_MISMATCH")
    must(obj["sha256"]==hashlib.sha256(raw).hexdigest(),"RAW_PNG_SHA_MISMATCH")
    with Image.open(root/name) as x:
        must(x.format=="PNG","ORIGINAL_NOT_PNG")
        rgb=x.convert("RGB")
        must(rgb.width>=800 and rgb.height>=500,"ORIGINAL_CAMERA_FRAME_TOO_SMALL")
        return rgb

def luma_changed(a,b):
    must(a.size==b.size,"INCONSISTENT_ORIGINAL_FRAMEBUFFERS")
    h=ImageChops.difference(a,b).convert("L").histogram()
    return sum(h[9:])

def run(root):
    src=json.loads((root/"K4AV_TRUE_NATIVE_THREE_WAY_ART.json").read_text())
    must(src.get("schema")=="dopagaki.K4AV.genuine-original-Road5-three-way-full-frame/1",
         "SOURCE_SCHEMA")
    must(src.get("sourceBlob")==SOURCE and src.get("originalPhysicsHz")==240,
         "ORIGINAL_SOURCE_BLOB_NATIVE_HZ")
    must(src.get("realRoadCount")==7 and src.get("originalB51")==28,
         "SOURCE_ROAD_OBSTACLE_COUNT")
    must(src.get("nativeCamera") is True and src.get("actualChromiumWebGL2") is True,
         "NOT_ORIGINAL_CAMERA_WEBGL2")
    must(src.get("errors")==[] and len(src.get("sessions",[]))==6,
         "SESSION_ERRORS_OR_MISSING_ROLE")
    must(src.get("formalArtAccepted")==src.get("slope2DNAMetres")==0,
         "ART_ILLEGAL_PROMOTION")
    must(src.get("ART")=="NOT_TESTED_HOLD" and all(src.get(k)=="HOLD" for k in
         ("HUMAN","SAT","CCD","FPS","RELEASE","MERGE")),"SAFETY_GATES")
    roles={(x["mode"],x["variant"]):x for x in src["sessions"]}
    must(set(roles)=={(m,v) for m in TIMES for v in ROLES},"MISSING_THREE_WAY_ROLE")
    for (mode,variant),session in roles.items():
        must(session.get("errors")==[] and session.get("pageErrors")==[]
             and [f["tick"] for f in session["frames"]]==list(TIMES[mode]),
             "INCOMPLETE_SOURCE_CAMERA_SESSION")
        must(all(f["state"]["road"]=="p93-PRISM_CREST-01" for f in session["frames"]),
             "NOT_GENUINE_ROAD5")
    comp=src.get("comparisons",[])
    must(len(comp)==6,"NO_SIX_PAIRED_NATIVE_CAMERAS")
    frame_map={}
    measured=[]
    for row in comp:
        mode,tick=row["mode"],row["tick"]
        must(mode in TIMES and tick in TIMES[mode] and
             (mode,tick) not in frame_map,"INVALID_NATIVE_CAMERA_TICK")
        must(row["sourceNativePoseIdentical"] is True and row["ART"]=="NOT_TESTED_HOLD",
             "CAMERA_MISMATCH_OR_FALSE_ART_PASS")
        base=image(root,row["originalK4AU"])
        atmosphere=image(root,row["newAtmosphereRoadOnly"])
        architecture=image(root,row["newCivicArchitecture"])
        area=base.width*base.height
        bg=luma_changed(base,atmosphere)
        real=luma_changed(atmosphere,architecture)
        must(row["broadArtRGBChanged"]==
             (row["originalK4AU"]["sha256"]!=row["newCivicArchitecture"]["sha256"]),
             "BROAD_RGB_HASH_MISMATCH")
        must(row["actualArchitectureRGBChanged"]==
             (row["newAtmosphereRoadOnly"]["sha256"]!=row["newCivicArchitecture"]["sha256"]),
             "ARCHITECTURE_RGB_HASH_MISMATCH")
        # Separate true buildings from a sky-only artistic false positive.
        measured.append({"mode":mode,"tick":tick,
            "atmosphereAndPaintPixelChange":bg,
            "architecturePixelChangeFromSkyOnly":real,
            "architectureChangedFraction":round(real/area,6),
            "actualHumanArtQuality":"NOT_CERTIFIED",
            "hazardObscuration":"NOT_CERTIFIED"})
        frame_map[(mode,tick)]=(base,atmosphere,architecture)
    must(set(frame_map)=={(m,t) for m,ts in TIMES.items() for t in ts},
         "SOURCE_CAMERA_TICKS_NOT_COMPLETE")
    must(sum(x["architecturePixelChangeFromSkyOnly"]>=1500
             for x in measured)>=2,
         "NO_GENUINE_CIVIC_ARCHITECTURE_VISIBLE_IN_SOURCE_CAMERA")
    # Honest unretouched comparison frames, no color grading or digital assets
    # outside the genuine Chromium RGB PNGs.
    w,h=465,320
    sheet=Image.new("RGB",(w*3,h*6),(16,21,28))
    draw=ImageDraw.Draw(sheet)
    for i,key in enumerate([(m,t) for m,ts in TIMES.items() for t in ts]):
        for j,(label,im) in enumerate(zip(
            ("K4AU ORIGINAL","K4AV NEW SKY + ROAD","K4AV FULL CITY"),frame_map[key])):
            pic=im.copy()
            pic.thumbnail((w-8,h-30))
            sheet.paste(pic,(j*w+4,i*h+26))
            draw.text((j*w+9,i*h+6),
                      f"{key[0]} {key[1]} | {label}",fill=(236,235,226))
    sheet.save(root/"K4AV_AUTHENTIC_NATIVE_18_THREE_WAY_ATLAS.png")
    return {
      "schema":"dopagaki.K4AV.independent-18-native-original-camera-art/1",
      "originalBlob":SOURCE,"nativeHz":240,
      "realOriginalB48Roads":7,"realOriginalB51MovingObstacles":28,
      "cameraTriplets":6,"verifiedRealPNGs":18,
      "measurements":measured,
      "technicalResult":"SOURCE_B48_B51_NATIVE_RGB_AND_ART_PIXEL_DIFFERENCE_ONLY",
      "humanVisualQuality":"REQUIRES_DIRECT_IMAGE_REVIEW",
      "realTimeHorizonLegibility":"UNKNOWN",
      "sourceB51Safety":"NOT_TESTED",
      "formalArtAccepted":0,"slope2DNAMetres":0,"ART":"NOT_TESTED_HOLD",
      "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD",
      "FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
    }

if __name__=="__main__":
    p=argparse.ArgumentParser()
    p.add_argument("--root",type=Path,default=Path("r19-evidence/k4av"))
    args=p.parse_args()
    result=run(args.root)
    (args.root/"K4AV_INDEPENDENT_REAL_SCREEN_PIXEL_AUDIT.json").write_text(
      json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(result["technicalResult"])

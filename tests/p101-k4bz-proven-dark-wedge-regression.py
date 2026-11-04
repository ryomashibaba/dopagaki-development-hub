#!/usr/bin/env python3
"""K4BZ immutable research screenshot regression, NOT a game/ART gate.

No fresh Blender, no remote assets, no screenshot fabrication. Compares
the exact K4BY A3 genuine CHASE frame with K4BZ R2 true Blender A/B.
Validates the experiment's engineering cause: hiding exactly the one
non-game research Road5-raycast PBR overlay removes six local dark pixels
while preserving six unaffected control pixels.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
DIR=ROOT/"docs"/"research-evidence"
ORIGINAL=DIR/"k4by"/"K4BY_ONE_SAME_CHASE_TRUE_PBR_RACE_ROAD_CIVIC_HARBOR_NOT_GAME.png"
CORRECTED=DIR/"k4bz"/"K4BZ_SAME_CHASE_SINGLE_RAYCAST_PROXY_HIDDEN_REAL_AB_NOT_GAME.png"
AUDIT=DIR/"k4bz"/"K4BZ_ONE_OBJECT_ABLATION_AUTHENTIC_NATIVE_AUDIT.json"
ORIGINAL_AUDIT=DIR/"k4by"/"K4BY_GENUINE_PBR_HARBOR_NATIVE_ART_AUDIT.json"

ORIGINAL_SHA="ad46b5377fd9d144c7ab94b428df52d5f97cb7675fe44c3d14389b7858c925f7"
CORRECTED_SHA="d82a367f49623a8ed2a75a4540ba8a6de07f976a51d49f4dbb20673243576df7"
NATIVE_SHA="162a7baaf7594b36a134457bee817bd7dcf0ef1b3e581419d6561efa92e45382"
PARENT_NATIVE_SHA="f0d3d7a27e5fbf599447b0e784b71684ff634b071d283f8b59bdaf06a179d4e4"
ORIGINAL_ROAD_SHA="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"

def digest(p:Path)->str:
    return hashlib.sha256(p.read_bytes()).hexdigest()

def value(pix:tuple[int,int,int])->float:
    return sum(pix)/3

def run()->dict:
    assert all(p.is_file() for p in (ORIGINAL,CORRECTED,AUDIT,ORIGINAL_AUDIT))
    assert digest(ORIGINAL)==ORIGINAL_SHA
    assert digest(CORRECTED)==CORRECTED_SHA
    before_meta=json.loads(ORIGINAL_AUDIT.read_text(encoding="utf-8"))
    a=json.loads(AUDIT.read_text(encoding="utf-8"))

    assert before_meta["files"][ORIGINAL.name]["sha256"]==ORIGINAL_SHA
    assert before_meta["files"][ORIGINAL.name]["bytes"]==ORIGINAL.stat().st_size
    assert before_meta["files"]["K4BY_TRUE_CC0_ROAD_OCCUPIED_HARBOR_EDITABLE_NATIVE_ART_HOLD.blend"]["sha256"]==PARENT_NATIVE_SHA
    assert a["canonicalParentBlenderSHA256"]==PARENT_NATIVE_SHA
    assert a["canonicalRoad5VertexFaceSHA256"]==ORIGINAL_ROAD_SHA
    assert a["canonicalOriginalGameBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
    assert a["onlyRenderVisibilityEdited"]==[
        "K4BY | actual source raycast 1m road surface | NO GAME COLLIDER"
    ]
    assert a["sourceRigSixCameraUnchanged"]
    assert a["researchChaseUnchanged"]
    assert a["originalNineTreesMatricesUnchanged"]
    assert a["allLightsIdentical"]
    assert a["physicalOriginalRoad5Unchanged"]
    assert a["existingPhotographicAlternateRoadRemainsVisible"]
    assert a["originalK4BYRoadRibbonHiddenRenderOnly"]
    assert a["newGameColliders"]==0
    assert a["gameSourceEdited"] is False
    assert a["formalArtAccepted"]==0
    assert a["formalSlope2DNAMetres"]==0
    assert a["ART"]=="UNJUDGED_HOLD"
    assert all(a[k]=="HOLD" for k in ("SAT","CCD","FPS","HUMAN","RELEASE","MERGE"))
    assert a["files"][CORRECTED.name]["sha256"]==CORRECTED_SHA
    assert a["files"][CORRECTED.name]["bytes"]==CORRECTED.stat().st_size
    assert a["files"]["K4BZ_ONE_OBJECT_DISABLED_PROVEN_ROAD_CROSSFADE_EDITABLE_DCC_HOLD.blend"]["sha256"]==NATIVE_SHA

    experiment=a["pixelControlledExperiment"]
    assert experiment["sourceOriginalPNG_SHA256"]==ORIGINAL_SHA
    assert experiment["imageSameCameraSame768x480"] is True
    pairs=experiment["targetPixelContrasts"]
    assert len(pairs)==6
    expected_positions=[
       ((292,300),(317,300)),((280,330),(310,330)),
       ((267,360),(310,360)),((250,400),(295,400)),
       ((235,440),(280,440)),((225,470),(270,470)),
    ]
    with Image.open(ORIGINAL) as before_file, Image.open(CORRECTED) as after_file:
        before=before_file.convert("RGB")
        after=after_file.convert("RGB")
    assert before.size==after.size==(768,480)
    records=[]
    for (dark,control),item in zip(expected_positions,pairs):
        assert tuple(item["darkPixel"])==dark and tuple(item["controlPixel"])==control
        prev_dark=before.getpixel(dark)
        next_dark=after.getpixel(dark)
        prev_control=before.getpixel(control)
        next_control=after.getpixel(control)
        assert list(prev_dark)==item["oldDarkRGB"]
        assert list(next_dark)==item["afterHideDarkRGB"]
        assert list(prev_control)==item["oldControlRGB"]
        assert list(next_control)==item["afterHideControlRGB"]
        pre_contrast=value(prev_control)-value(prev_dark)
        post_contrast=value(next_control)-value(next_dark)
        lightening=value(next_dark)-value(prev_dark)
        unaffected_control=abs(value(next_control)-value(prev_control))
        # Narrow test for this documented defect, NOT a quality
        # threshold, adoption gate, visual merit rating or FPS proof.
        assert pre_contrast>=25,("not original known shadow-like artifact",dark,pre_contrast)
        assert abs(post_contrast)<=5,("black seam recurred at known pixel",dark,post_contrast)
        assert lightening>=25,("known dark wedge not removed",dark,lightening)
        assert unaffected_control<=3,("control drifted",control,unaffected_control)
        assert abs(pre_contrast-item["oldContrast"])<.002
        assert abs(post_contrast-item["afterHideContrast"])<.002
        records.append({"darkPixel":dark,"controlPixel":control,
                        "beforeContrast":round(pre_contrast,3),
                        "afterContrast":round(post_contrast,3),
                        "darkLightening":round(lightening,3)})
    assert abs(sum(r["beforeContrast"]-r["afterContrast"] for r in records)/6-
               experiment["averageContrastDropNotArtScore"])<.002
    print(json.dumps({"status":"K4BZ_KNOWN_WEDGE_PIXEL_REGRESSION_PASS",
                      "source":"genuine 768x480 native Blender only",
                      "detection":"all 6 exact dark pixels now match local road controls",
                      "originalGameChanged":False,
                      "art":"REJECT | not a worldwide quality test",
                      "checks":records},ensure_ascii=False,indent=2))
    return {"checkedPairs":len(records),"oldGameSourceUnchanged":True}

if __name__=="__main__":
    run()

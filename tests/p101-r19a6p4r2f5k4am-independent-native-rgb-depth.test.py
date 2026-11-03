#!/usr/bin/env python3
"""K4AM synthetic proof-shape positive and adversarial negatives. NOT a GPU run."""
import copy
import hashlib
import json
import runpy
import tempfile
from pathlib import Path

from PIL import Image

m = runpy.run_path(str(Path(__file__).resolve().parents[1] /
    "scripts/p101-r19a6p4r2f5k4am-independent-nine-rgb-depth-audit.py"))
SRC = m["SRC"]
N = m["N"]
PENDING = m["PENDING"]
sha = m["sha"]
verify = m["verify"]

def fixture(root):
    image = root/"SYNTHETIC_ONLY.png"
    Image.new("RGB", (1013, 698), (5, 15, 25)).save(image)
    png = image.read_bytes()
    filesha = sha(png)
    original = [100]*N
    far = [101]+[100]*(N-1)
    def depth(xs, draws):
        return {"method":"ORIGINAL_GPU_MESH_RGBA8_DEPTH24_REPLAY",
                "nonlinearDepth":True,"sampleCount":N,"originalDraws":draws,
                "sha256":sha(json.dumps(xs,separators=(",",":")).encode()),
                "samples":xs}
    report = {
        "originalSourceBlob":SRC,"pinnedK4AIRawSHA256":m["AISHA"],
        "original240HzPhysics":True,"actualLive240fpsClaim":False,
        "purpose":"FILL_ONLY_K4AK_NINE_MISSING_SOURCE_RGB_TICKS",
        "gpuRemovedGroup":"B51_BODY_ALL_28",
        "perTickSingleObstacleAttribution":"UNKNOWN_EXCEPT_K4AG_TICK11280",
        "newModels":0,"newColliders":0,"officialARTAccepted":0,
        "slope2DNAMetres":0,"sourceCandidatesCreated":0,
        "physicsChanged":False,"cameraChanged":False,
        "ART":"NOT_TESTED_HOLD","errors":[],"sessions":[],
        "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD",
        "RELEASE":"HOLD","MERGE":"HOLD"
    }
    ai = {"originalSourceBlob":SRC,"sessions":[]}
    seq = 0
    for mode in ("ultra","control"):
        poses = []
        for t in range(10680,11401):
            poses.append({"nativeTick":t,"originalStatus":"running",
                 "originalRoad":"p93-PRISM_CREST-01",
                 "originalSourceBallCenter":[0,1,2],
                 "originalSourceCameraEye":[3,4,5],
                 "originalSourceCameraFront":[0,0,1]})
        ai["sessions"].append({"mode":mode,
            "continuousNative240Hz":{"records":poses}})
        session = {"mode":mode,"missingTicks":PENDING[mode],"errors":[],
             "trueOriginalWebGLContext":{"webgl2":True,
                "preserveDrawingBuffer":False},"frames":[]}
        for tick in PENDING[mode]:
            metas = []
            for suffix in ("ORIGINAL_SOURCE","WITHOUT_B51_GROUP","RESTORED_SOURCE"):
                file = "K4AM_%s_%s_%s.png" % (mode,tick,suffix)
                (root/file).write_bytes(png)
                metas.append({"file":file,"bytes":len(png),"sha256":filesha})
            source = {"tick":tick,"paused":tick,
                "road":"p93-PRISM_CREST-01","status":"running",
                "sourceB51":28,"camera":"ball-lock-unfiltered-heading",
                "effectiveMask":"none","xyz":[0,1,2],"eye":[3,4,5],
                "front":[0,0,1],"audit":{"sourceBlob":SRC,
                  "originalSceneA5R19A3OverlayRendered":False}}
            frame = {
                "tick":tick,"source":source,"k4aiNativeTickPoseMatch":True,
                "groupMaskNotSingleB51Id":True,"sourceColorCandidateArtAB":"NOT_CAPTURED",
                "ART":"NOT_TESTED_HOLD","gpuReadbackSeq":[seq+1,seq+2,seq+3],
                "sourcePNG":metas[0],"groupHiddenPNG":metas[1],"restoredPNG":metas[2],
                "chapterHUD":{"id":"chapterHud","className":"chapter",
                    "position":"absolute","pointerEvents":"none",
                    "text":"VI / PRISM SKY CREST +95m",
                    "rect":[360,20,654,73]},
                "nativeGPU":{"original":depth(original.copy(),72),
                  "allB51GroupHidden":depth(far.copy(),44),
                  "restored":depth(original.copy(),72),
                  "maskedFartherDepthSamples":1,"nearerDepthSamples":0,
                  "originalRestoredAll11176":True}}
            session["frames"].append(frame)
            seq+=3
        report["sessions"].append(session)
    return ai,report


def reject(label, ai, record, root):
    try:
        verify(ai,record,root)
    except (ValueError, AssertionError):
        print("K4AM_SYNTHETIC_NEGATIVE_REJECT",label)
        return
    raise AssertionError("K4AM_FALSE_ACCEPT_"+label)


def main():
    with tempfile.TemporaryDirectory() as d:
        base = Path(d)
        ai,r = fixture(base)
        ok = verify(ai,r,base)
        assert ok["sourceNativeTicks"]==9 and ok["realSourcePNGProofs"]==27
        assert ok["inRenderDepthReadbackRequests"]==27
        assert ok["sumB51GroupMaskedFartherDepthSamplesAcrossNineSnapshots"]==9
        print("K4AM_SYNTHETIC_NINE_TICKS_27_PNG_GPU_POSITIVE_PASS")
        mut = copy.deepcopy(r);mut["officialARTAccepted"]=1
        reject("FAKE_ART_PASS",ai,mut,base)
        mut = copy.deepcopy(r);mut["sessions"][0]["frames"].pop()
        reject("MISSING_TICK",ai,mut,base)
        mut = copy.deepcopy(r);mut["sessions"][1]["frames"][0]["gpuReadbackSeq"][0]=1
        reject("DUPLICATED_GPU_SEQ",ai,mut,base)
        mut = copy.deepcopy(r);mut["sessions"][0]["frames"][0]["nativeGPU"]["allB51GroupHidden"]["samples"][0]=50
        reject("B51_MASK_CREATED_NEARER_DEPTH",ai,mut,base)
        mut = copy.deepcopy(r);mut["sessions"][0]["frames"][0]["nativeGPU"]["original"]["samples"][0]=88
        reject("GPU_RAW_SAMPLES_SHA_TAMPER",ai,mut,base)
        mut = copy.deepcopy(r);mut["sessions"][1]["frames"][0]["nativeGPU"]["restored"]["samples"][0]=120
        reject("DEPTH_RESTORATION_TAMPER",ai,mut,base)
        mut = copy.deepcopy(r);mut["sessions"][0]["frames"][0]["groupMaskNotSingleB51Id"]=False
        reject("FALSE_SINGLE_OBSTACLE_ID",ai,mut,base)
        mut = copy.deepcopy(r);mut["sessions"][0]["frames"][0]["source"]["xyz"][0]=9
        reject("FALSE_SOURCE_BALL_POSE",ai,mut,base)
        bad = base/"K4AM_ultra_11326_ORIGINAL_SOURCE.png"
        bad.write_bytes(b"TAMPERED PNG")
        reject("ORIGINAL_RGB_PNG_TAMPER",ai,r,base)
    print("K4AM_9_SYNTHETIC_NEGATIVES_PASS_GENUINE_CHROMIUM_NOT_TESTED")


if __name__=="__main__":
    main()

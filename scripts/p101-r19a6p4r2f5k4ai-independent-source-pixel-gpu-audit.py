"""K4AH independent immutable-source + GPU depth + original screenshot audit.
The separate Node audit must verify original function OBB math.
"""
import argparse,hashlib,json,runpy,math
from pathlib import Path
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
K4Z_SHA="da69e5d9283f6a8fc5190cc9fefd4e8476114eedfb218fe2eb802bbecfcddb6c"
K4AF_RAW_SHA="016c28bf4fafa50748d8083496a81a5d66732540c0c3b50e863a7c39cfaddf26"
K4AF_AUDIT_SHA="028f72fa8b40b450cb106e1484be488467c7dbcc4b9e69769cb2fa88a9aeec24"
TICKS=[10680,10800,10920,11040,11160,11280,11400]
def read_exact(p,sha):
    buf=Path(p).read_bytes()
    assert hashlib.sha256(buf).hexdigest()==sha,("SOURCE_PROVENANCE_SHA_CHANGED",str(p))
    return json.loads(buf)
def compare_samples(a,b):
    assert a["available"] is b["available"] is True
    assert a["method"]==b["method"]=="ORIGINAL_GPU_MESH_RGBA8_DEPTH24_REPLAY"
    assert a["width"]==b["width"]==1013 and a["height"]==b["height"]==698
    assert a["stride"]==b["stride"]==8
    assert a["originalDraws"]==b["originalDraws"]
    assert a["nonlinearDepth"] is b["nonlinearDepth"] is True
    assert a["originalVertexShader"] is b["originalVertexShader"] is True
    assert a["perObjectIDs"] is b["perObjectIDs"] is False
    assert a["physicalSafetyVerified"] is b["physicalSafetyVerified"] is False
    assert len(a["samples"])==len(b["samples"])==11176
    assert all(type(x) is int and 0<=x<=16777215 for x in a["samples"])
    assert a["samples"]==b["samples"]
    return a["samples"]
def main():
    ap=argparse.ArgumentParser()
    for k in ("k4z","k4af","k4ah"):ap.add_argument("--"+k,required=True)
    x=ap.parse_args()
    z=Path(x.k4z);parent=Path(x.k4af);new=Path(x.k4ah)
    reference=read_exact(z/"K4Z_ORIGINAL_SOURCE_DENSE_7ROAD_CAMERA.json",K4Z_SHA)
    old=read_exact(parent/"K4AF_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json",K4AF_RAW_SHA)
    verified=read_exact(parent/"K4AF_INDEPENDENT_GENUINE_SOURCE_GPU_AUDIT.json",K4AF_AUDIT_SHA)
    study=json.loads((new/"K4AI_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json").read_text())
    assert reference["sourceBlob"]==old["originalSourceBlob"]==study["originalSourceBlob"]==SRC
    assert study["Hz"]==reference["Hz"]==240 and study["B48"]==7 and study["B51"]==28
    assert study["errors"]==old["errors"]==[]
    assert study["physicsChanged"] is study["cameraChanged"] is False
    assert study["originalSourceGameChanged"] is False
    assert study["newModels"]==study["newColliders"]==0
    assert study["officialARTAccepted"]==study["slope2DNAMetres"]==0
    assert study["ART"]=="NOT_TESTED_HOLD" and study["RELEASE"]==study["MERGE"]=="HOLD"
    assert verified["synchronousInRenderDepthMasksAvailable"]==84
    assert verified["sourceGPUrestorationCount"]==14
    assert len(study["sessions"])==2
    img_tools=runpy.run_path("scripts/p101-r19a6p4r2f5k4ad-independent-rgba-depth-audit.py")
    img=img_tools["img"];compare_png=img_tools["source_png_equals_outside_css"]
    original_count=0
    for session in reference["sessions"]:
        assert len(session["frames"])==41
        for f in session["frames"]:
            data=(z/f["file"]).read_bytes()
            assert hashlib.sha256(data).hexdigest()==f["sha256"] and len(data)==f["bytes"]
            original_count+=1
    assert original_count==82
    cases=[]
    for mode in ("ultra","control"):
        cur=next(q for q in study["sessions"] if q["mode"]==mode)
        old_s=next(q for q in old["sessions"] if q["mode"]==mode)
        ref_s=next(q for q in reference["sessions"] if q["mode"]==mode)
        assert cur["errors"]==[]
        assert len(cur["frames"])==len(cur["masks"])==len(cur["restored"])==7
        assert [q["tick"] for q in cur["frames"]]==TICKS
        assert [q["tick"] for q in cur["restored"]]==TICKS
        assert [q["tick"] for q in cur["masks"]]==TICKS
        assert cur["trueOriginalWebGLContext"]["webgl2"] is True
        assert cur["trueOriginalWebGLContext"]["preserveDrawingBuffer"] is False
        for frame,mask,rest in zip(cur["frames"],cur["masks"],cur["restored"]):
            tick=frame["tick"]
            geom=frame["geometry"]
            original=next(q for q in ref_s["frames"] if q["tick"]==tick)
            parent_frame=next(q for q in old_s["frames"] if q["tick"]==tick)
            parent_mask=next(q for q in old_s["masks"]
                if q["tick"]==tick and q["mask"]=="without-B51-bodies")
            assert frame["source"]["tick"]==frame["source"]["paused"]==tick
            assert frame["source"]["road"]==original["state"]["road"]=="p93-PRISM_CREST-01"
            assert frame["source"]["sourceB51"]==28
            assert frame["source"]["effectiveMask"]=="none"
            assert frame["captureProof"]["seq"]==geom["requestSeq"]
            assert frame["captureProof"]["tick"]==geom["nativeTick"]==tick
            assert geom["sourceBlob"]==SRC
            assert geom["sourceMask"]=="none" and geom["sourceB51Count"]==28
            assert geom["obstacleDescriptor"]["id"]=="p95-hazard-12"
            assert geom["originalMovingObstaclePose"]["id"]=="p95-hazard-12"
            assert geom["originalGameModified"] is geom["collisionChanged"] is False
            assert geom["ART"]=="NOT_TESTED_HOLD"
            assert abs(geom["poseTimeSeconds"]-tick/240)<1e-5
            assert abs(geom["sourceTimeSeconds"]-tick/240)<1e-5
            assert len(geom["ballPosition"])==len(geom["camera"]["eye"])==3
            assert all(math.isfinite(z) for z in geom["ballPosition"]+geom["camera"]["eye"])
            assert geom["ballRadius"]>0
            assert len(geom["originalMovingObstaclePose"]["center"])==3
            assert geom["obstacleDescriptor"]["type"]=="piston"
            assert geom["obstacleDescriptor"]["size"]==[8,3,7.5]
            assert geom["obstacleDescriptor"]["motion"]["stroke"]==8
            assert geom["obstacleDescriptor"]["collision"]["mode"]=="push"
            aimg=img(z/original["file"],original["sha256"],original["bytes"])
            bimg=img(new/frame["originalPNG"]["file"],
                frame["originalPNG"]["sha256"],frame["originalPNG"]["bytes"])
            pix=compare_png(aimg,bimg,frame["chapterHUD"])
            assert pix["native3DOrNonHUDPixelsChanged"]==0
            native=compare_samples(frame["synchronousRenderDepth"],
                parent_frame["synchronousRenderDepth"])
            assert mask["mask"]=="without-B51-bodies" and mask["tick"]==tick
            assert mask["sourceSameBallCameraAnd240HzTick"] is True
            masked=compare_samples(mask["synchronousDepth"],parent_mask["synchronousDepth"])
            farther=sum(b>a for a,b in zip(native,masked))
            nearer=sum(b<a for a,b in zip(native,masked))
            assert nearer==0
            recovered=compare_samples(rest["depth"],frame["synchronousRenderDepth"])
            assert recovered==native
            restored_img=img(new/rest["screenshot"]["file"],
                rest["screenshot"]["sha256"],rest["screenshot"]["bytes"])
            assert compare_png(bimg,restored_img,frame["chapterHUD"])[
                "native3DOrNonHUDPixelsChanged"]==0
            cases.append({"mode":mode,"tick":tick,"seconds":tick/240,
                "genuineK4ZNativeSourcePixelMatched":True,
                "genuineK4AFBaselineGPUdepthMatched":True,
                "genuineK4AFB51GroupDepthMatched":True,
                "nativeDepthRestoredAll11176":True,
                "native3DImageRestored":True,
                "B51GroupDepthFartherSamples":farther,
                "B51GroupDepthNearerSamples":nearer,
                "originalGeometrySeq":geom["requestSeq"],
                "sourcePoseTime":geom["poseTimeSeconds"],
                "signedBallToOBBMeters":geom["signedBallSurfaceToOBBMeters"],
                "signedEyeToOBBMeters":geom["signedCameraEyePointToOBBMeters"],
                "eyeToCenterMeters":geom["eyeToOBBCenterMeters"],
                "eyeForwardProjectionMeters":geom["eyeToOBBCenterProjection"]["forward"],
                "cameraEyeInsideOBB":geom["cameraEyeInsideOBB"],
                "ballInsideOBB":geom["ballInsideOBB"]})
    assert len(cases)==14
    assert [q["B51GroupDepthFartherSamples"] for q in cases if q["tick"]==11280]==[53,5972]
    summary={
      "schema":"dopagaki.K4AI.source-verified-geometry-and-gpu/1",
      "decision":"SOURCE_GPU_IMAGE_14_OF_14_AND_B51_OBB_READBACK_VERIFIED_GEOMETRY_MATH_PENDING",
      "originalSourceBlob":SRC,"sourceK4Z82PNGSHAverified":82,
      "originalRoad5Frames":14,"originalGPUFrameDepthMatchedK4AF":14,
      "originalB51GroupMaskDepthMatchedK4AF":14,
      "originalRestoreDepthMatched":14,
      "sourceB51TargetId":"p95-hazard-12","originalSourceOBBFunction":"movingObstaclePose",
      "originalSourceBallSeparationFunction":"sphereBoxSeparation",
      "sourceTimeHz":240,"newModels":0,"newColliders":0,
      "ART":"NOT_TESTED_HOLD","RELEASE":"HOLD","MERGE":"HOLD",
      "officialARTAccepted":0,"slope2DNAMetres":0,"results":cases}
    (new/"K4AI_INDEPENDENT_SOURCE_GPU_GEOMETRY_AUDIT.json").write_text(
        json.dumps(summary,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
    print("K4AI_K4Z_82_TRUE_SOURCE_PNG_SHA_AND_14_NATIVE_PIXEL_MATCH_PASS")
    print("K4AI_K4AF_14_DEPTH_PLUS_14_MASK_PLUS_14_RESTORATION_EXACT_PASS")
    print("K4AI_OBB_GEOMETRY_SOURCE_EVIDENCE_14_CAPTURED__MATH_AUDIT_NEXT")
    print("K4AI_ART_COLLISION_RELEASE_HOLD")
if __name__=="__main__":main()

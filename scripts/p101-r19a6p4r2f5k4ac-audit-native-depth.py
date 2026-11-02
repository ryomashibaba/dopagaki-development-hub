"""K4AC independent image/depth probe audit. Zero ART/gameplay/safety claims.

An unavailable GPU depth readback MUST remain HOLD, even if CI succeeds.
Never treat subtractive draw-layer difference as exact per-object segmentation.
"""
import argparse,hashlib,json
from pathlib import Path
import numpy as np
from PIL import Image

SRC="af076d67492a677d2235e4730aef8cdf4808e106"
TICKS=(10680,10800,10920,11040,11160,11280,11400)
MODES=("ultra","control")
MASKS=("without-epic","without-mega","without-frames",
       "without-B48-and-fixtures-visuals","without-B51-bodies","without-road-optics")
CSS_ROI=(200,418,810,590)
def sha(b):return hashlib.sha256(b).hexdigest()
def image(path):
    raw=path.read_bytes()
    rgb=np.asarray(Image.open(path).convert("RGB"),dtype=np.uint8)
    assert rgb.shape==(698,1013,3),str((path,rgb.shape))
    return raw,rgb
def pixel_audit(original,new):
    mask=np.ones((698,1013),dtype=bool)
    x0,y0,x1,y1=CSS_ROI
    mask[y0:y1,x0:x1]=False
    differing=np.any(original!=new,axis=2)
    outside=int(np.count_nonzero(differing & mask))
    inside=int(np.count_nonzero(differing & ~mask))
    assert outside==0,("SOURCE_3D_PIXEL_DRIFT_OUTSIDE_P74_CSS_HUD",outside)
    return {"pixelIdenticalOutsideNativeCSSROI":True,
      "outsideRoiPixelsCompared":int(np.count_nonzero(mask)),
      "sourceOutsideCSSPixelsChanged":outside,
      "animatedCssRoiPixelsChanged":inside}
def depth_diff(original,masked):
    a=original.get("samples",[])
    b=masked.get("samples",[])
    assert original["available"] and masked["available"]
    assert (original["width"],original["height"],original["stride"])==(
        masked["width"],masked["height"],masked["stride"])
    assert len(a)==len(b)>0
    changed=sum(x!=y for x,y in zip(a,b))
    farther=sum(y>x for x,y in zip(a,b))
    nearer=sum(y<x for x,y in zip(a,b))
    return {"sampleCount":len(a),"changed":changed,
      "fartherOnMasked":farther,"nearerOnMasked":nearer,
      "changedShare":changed/len(a)}
def main():
    cli=argparse.ArgumentParser()
    cli.add_argument("--k4z-dir",required=True)
    cli.add_argument("--k4ac-dir",required=True)
    args=cli.parse_args()
    source=Path(args.k4z_dir);candidate=Path(args.k4ac_dir)
    manifest=json.loads((source/"K4Z_ORIGINAL_SOURCE_DENSE_7ROAD_CAMERA.json").read_text())
    result=json.loads((candidate/"K4AC_NATIVE_GPU_DEPTH_CAPABILITY.json").read_text())
    assert manifest["sourceBlob"]==result["sourceBlob"]==SRC
    assert manifest["Hz"]==result["sourceHz"]==240
    assert manifest["sourceB48"]==result["sourceB48"]==7
    assert manifest["sourceB51"]==result["sourceB51"]==28
    assert manifest["errors"]==result["errors"]==[]
    assert result["sourcePhysicsChanged"] is False and result["sourceCameraChanged"] is False
    assert result["newModels"]==result["newColliders"]==0
    assert result["officialARTAccepted"]==result["slope2DNARecognizedMetres"]==0
    assert result["independentART"]=="NOT_TESTED_HOLD"
    assert result["perObjectID"]=="NOT_AVAILABLE"
    assert len(manifest["sessions"])==len(result["modes"])==2
    checked=full_identical=readable=postprobe_checked=0
    mode_results=[]
    for mode in MODES:
        old=next(s for s in manifest["sessions"] if s["mode"]==mode)
        new=next(s for s in result["modes"] if s["mode"]==mode)
        assert len(old["frames"])==41 and len(new["road5"])==7 and len(new["masks"])==6
        assert tuple(x["tick"] for x in new["road5"])==TICKS
        assert [x["mask"] for x in new["masks"]]==list(MASKS)
        audits=[]
        for frame in new["road5"]:
            ref=next(x for x in old["frames"] if x["tick"]==frame["tick"])
            raw_reference,rgb_reference=image(source/ref["file"])
            raw_actual,rgb_actual=image(candidate/frame["originalPNG"]["file"])
            assert len(raw_reference)==ref["bytes"] and sha(raw_reference)==ref["sha256"]
            assert len(raw_actual)==frame["originalPNG"]["bytes"]
            assert sha(raw_actual)==frame["originalPNG"]["sha256"]
            assert frame["originalPNG"]["originalK4ZSha"]==ref["sha256"]
            full=raw_reference==raw_actual
            assert frame["originalPNG"]["exactFullPNG"] is full
            checks=pixel_audit(rgb_reference,rgb_actual)
            # WebGL state hygiene: source scene must remain pixel-identical
            # after any depth FBO blit/readback (except P74 animated CSS ROI).
            after=frame["afterDepthProbeSourcePNG"]
            raw_after,rgb_after=image(candidate/after["file"])
            assert len(raw_after)==after["bytes"] and sha(raw_after)==after["sha256"]
            after_source=pixel_audit(rgb_reference,rgb_after)
            after_before=pixel_audit(rgb_actual,rgb_after)
            assert after_source["sourceOutsideCSSPixelsChanged"]==0
            assert after_before["sourceOutsideCSSPixelsChanged"]==0
            checks.update({"mode":mode,"tick":frame["tick"],"fullPNGExact":full,
              "afterDepthProbeSourcePixelsEqual":True,
              "afterDepthProbeSameTickOriginalPixelsEqual":True,
              "postprobeAnimatedCssDifference":after_before["animatedCssRoiPixelsChanged"]})
            audits.append(checks)
            full_identical+=int(full);checked+=1;postprobe_checked+=1
            s=frame["state"]
            assert s["tick"]==frame["tick"]==s["paused"]
            assert s["road"]==ref["state"]["road"]=="p93-PRISM_CREST-01"
            assert s["B51"]==28 and s["mask"]=="none"
            assert s["audit"]["sourceBlob"]==SRC
            assert s["audit"]["originalSceneA5R19A3OverlayRendered"] is False
        baseline=next(x["depth"] for x in new["road5"] if x["tick"]==11040)
        comparisons=[]
        for m in new["masks"]:
            assert m["sourceSameNativePose"] is True and m["tick"]==11040
            d=m["depth"]
            comparison=m["comparison"]
            if baseline["available"] and d["available"]:
                actual=depth_diff(baseline,d)
                assert comparison["comparable"] and comparison["status"]=="READBACK_COMPARISON_ONLY"
                for k in ("sampleCount","changed","fartherOnMasked","nearerOnMasked"):
                    assert actual[k]==comparison[k],(mode,m["mask"],k)
                assert abs(actual["changedShare"]-comparison["changedShare"])<1e-12
                readable+=1
                comparisons.append({"mask":m["mask"],**actual})
            else:
                assert not comparison["comparable"]
                comparisons.append({"mask":m["mask"],"status":"DEPTH_UNAVAILABLE_HOLD",
                    "reason":d.get("reason") or baseline.get("reason")})
        restored=new["samePoseRestoration"]
        if baseline["available"] and restored["comparable"]:
            assert restored["changed"]==0,("DEPTH_NOT_RESTORED",mode)
        mode_results.append({"mode":mode,"baselineOriginalWebGLFrames":audits,
            "maskDepthComparisons":comparisons,
            "depthStatus":new["status"],"depthSupport":bool(baseline["available"])})
    # Negative controls: an altered 3D pixel must be rejected; a depth change
    # must be distinguishable from a comparison with the same samples.
    base=np.zeros((698,1013,3),dtype=np.uint8)
    bad=base.copy();bad[300,100,0]=255
    try:pixel_audit(base,bad)
    except AssertionError:pass
    else:raise AssertionError("CSS_ROI_TAMPER_NEGATIVE_CONTROL_FAILED")
    a={"available":True,"width":2,"height":2,"stride":1,"samples":[1,2,3,4]}
    b={**a,"samples":[1,5,3,4]}
    assert depth_diff(a,a)["changed"]==0
    assert depth_diff(a,b)["changed"]==1
    audit={
      "schema":"dopagaki.K4AC.independent-source-depth-capability-audit/1",
      "sourceBlob":SRC,"genuineK4ZPNGRechecked":checked,
      "postDepthProbeSameTickSourcePNGAudited":postprobe_checked,
      "originalSourcePixelsRestoredAfterGLProbe":postprobe_checked==14,
      "fullScreenshotPNGIdentical":full_identical,
      "allOriginal3DPixelsOutsideNativeCssROIIdentical":checked==14,
      "maskDepthReadbackCompared":readable,
      "genuine3DDepthMeasurementsEstablished":result["overallStatus"]==
        "DEPTH_SAMPLES_ONLY_PENDING_INDEPENDENT_AUDIT" and readable==12,
      "perObjectDepthLabelsEstablished":False,
      "safeVacantBuildingSiteEstablished":False,
      "recognizablePublicVoidEstablished":False,
      "independentART":"NOT_TESTED_HOLD","officialARTAccepted":0,
      "slope2DNARecognizedMetres":0,"release":"HOLD","merge":"HOLD",
      "modes":mode_results
    }
    target=candidate/"K4AC_INDEPENDENT_DEPTH_AND_ORIGINAL_PIXEL_AUDIT.json"
    target.write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
    assert postprobe_checked==14
    print("K4AC_NATIVE_SOURCE_PIXEL_GATE_PASS",checked,
          "native scenes unchanged before and after GL probe outside P74 HUD")
    print("K4AC_DEPTH_SAMPLE_STATUS",
      "READBACK_CAPABILITY_CANDIDATE" if audit["genuine3DDepthMeasurementsEstablished"]
      else "UNAVAILABLE_OR_UNVALIDATED_HOLD")
    print("K4AC_ART_NOT_TESTED_NO_NEW_MODELS_NO_OBJECT_ID_NO_RELEASE")
if __name__=="__main__":main()

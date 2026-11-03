"""K4AJ strict independent native original B51 GPU-depth continuity audit.
100 real source native-tick snapshots (99 contiguous within two
different windows, plus one additional 14m GPU-proven reference at tick11280).
Not a 240-fps human playback claim or ART pass.
"""
import json,hashlib,math,csv,argparse,runpy
from pathlib import Path
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ZSHA="da69e5d9283f6a8fc5190cc9fefd4e8476114eedfb218fe2eb802bbecfcddb6c"
AISHA="e04c9990ebc2573467e8d95cd3e497a7a6059a9f12384f46507c3c1dfdc0eb60"
AFSHA="016c28bf4fafa50748d8083496a81a5d66732540c0c3b50e863a7c39cfaddf26"
TICKS={"ultra":(11320,11369),"control":(11259,11307)}
N=11176
def read(p,expected):
    data=Path(p).read_bytes()
    assert hashlib.sha256(data).hexdigest()==expected,("K4AJ_SOURCE_SHA_MISMATCH",str(p))
    return json.loads(data)
def gpu(d):
    assert d["available"] is True
    assert d["width"]==1013 and d["height"]==698 and d["stride"]==8
    assert d["method"]=="ORIGINAL_GPU_MESH_RGBA8_DEPTH24_REPLAY"
    assert d["nonlinearDepth"] is True
    assert d["originalVertexShader"] is True
    assert d["perObjectIDs"] is False and d["physicalSafetyVerified"] is False
    v=d["samples"]
    assert len(v)==N and all(type(n) is int and 0<=n<=16777215 for n in v)
    return v
def delta(a,b):
    assert len(a)==len(b)==N
    return (sum(y>x for x,y in zip(a,b)),sum(y<x for x,y in zip(a,b)))
def ordered_windows(rows,check):
    ret=[];start=None
    for i in range(len(rows)+1):
        yes=i<len(rows) and check(rows[i])
        if yes and start is None:start=i
        if not yes and start is not None:
            a=rows[start]["tick"];b=rows[i-1]["tick"]
            ret.append({"firstTick":a,"lastTickInclusive":b,
                        "sampleCount":i-start,"nativeTickDurationSeconds":(i-start)/240})
            start=None
    return {"observedTicks":sum(x["sampleCount"] for x in ret),
        "sampledTickDurationSeconds":sum(x["sampleCount"] for x in ret)/240,
        "intervals":ret,
        "interpretation":"SOURCE_GPU_DEPTH_MASK_OBSERVATION_AT_EVERY_NATIVE_TICK_IN_WINDOW_ONLY"}
def main():
    ap=argparse.ArgumentParser()
    for k in ("k4z","k4ai","k4af","k4aj"):ap.add_argument("--"+k,required=True)
    a=ap.parse_args()
    z,ai,af,aj=map(Path,(a.k4z,a.k4ai,a.k4af,a.k4aj))
    k4z=read(z/"K4Z_ORIGINAL_SOURCE_DENSE_7ROAD_CAMERA.json",ZSHA)
    k4ai=read(ai/"K4AI_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json",AISHA)
    k4af=read(af/"K4AF_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json",AFSHA)
    current=json.loads((aj/"K4AJ_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json").read_text())
    assert all(x==SRC for x in (k4z["sourceBlob"],k4ai["originalSourceBlob"],
                                k4af["originalSourceBlob"],current["originalSourceBlob"]))
    assert current["Hz"]==240 and current["B48"]==7 and current["B51"]==28
    assert current["newModels"]==current["newColliders"]==0
    assert current["physicsChanged"] is current["cameraChanged"] is current["originalSourceGameChanged"] is False
    assert current["officialARTAccepted"]==current["slope2DNAMetres"]==0
    assert current["ART"]=="NOT_TESTED_HOLD" and current["RELEASE"]==current["MERGE"]=="HOLD"
    assert current["errors"]==[] and len(current["sessions"])==2
    assert current["continuousDepthSamplingOnlyInDeclaredWindows"] is True
    assert current["sourceOriginalB51ID"]=="p95-hazard-12"
    helper=runpy.run_path("scripts/p101-r19a6p4r2f5k4ad-independent-rgba-depth-audit.py")
    img=helper["img"];pngdiff=helper["source_png_equals_outside_css"]
    assert sum(len(x["frames"]) for x in k4z["sessions"])==82
    for s in k4z["sessions"]:
        for frame in s["frames"]:
            b=(z/frame["file"]).read_bytes()
            assert len(b)==frame["bytes"] and hashlib.sha256(b).hexdigest()==frame["sha256"]
    rows=[];windows={};snapshot_count=0
    for mode in ("ultra","control"):
        one=next(s for s in current["sessions"] if s["mode"]==mode)
        ref=next(s for s in k4z["sessions"] if s["mode"]==mode)
        past=next(s for s in k4af["sessions"] if s["mode"]==mode)
        k=next(s for s in k4ai["sessions"] if s["mode"]==mode)
        lo,hi=TICKS[mode]
        ticks=sorted(set([11280]+list(range(lo,hi+1))))
        assert one["denseWindow"]=={"firstTick":lo,"lastTickInclusive":hi}
        assert one["referenceTrueGPUAnchorTick"]==11280
        assert len(one["frames"])==len(one["masks"])==len(one["restored"])==len(ticks)
        assert [f["tick"] for f in one["frames"]]==ticks
        assert [m["tick"] for m in one["masks"]]==ticks
        assert [f["tick"] for f in one["restored"]]==ticks
        assert one["errors"]==[]
        mode_rows=[]
        for f,m,rest in zip(one["frames"],one["masks"],one["restored"]):
            t=f["tick"]
            source=f["source"]
            true=k["continuousNative240Hz"]["records"][t-10680]
            assert true["nativeTick"]==t and true["originalB51Id"]=="p95-hazard-12"
            assert true["originalRoad"]==source["road"]=="p93-PRISM_CREST-01"
            assert source["tick"]==source["paused"]==t
            assert source["status"]=="running" and source["effectiveMask"]=="none"
            assert source["camera"]=="ball-lock-unfiltered-heading"
            assert source["audit"]["sourceBlob"]==SRC
            assert source["audit"]["originalSceneA5R19A3OverlayRendered"] is False
            assert m["mask"]=="without-B51-bodies"
            assert m["sourceSameBallCameraAnd240HzTick"] is True
            assert f["k4aiPinnedOriginalTick"] is True
            diff=lambda x,y:max(abs(a-b) for a,b in zip(x,y))
            assert diff(source["xyz"],true["originalSourceBallCenter"])<0.0015
            assert diff(source["eye"],true["originalSourceCameraEye"])<0.025
            assert diff(source["front"],true["originalSourceCameraFront"])<0.0015
            orig=gpu(f["synchronousRenderDepth"])
            masked=gpu(m["synchronousDepth"])
            restored=gpu(rest["depth"])
            assert restored==orig,("K4AJ_ORIGINAL_GPU_DEPTH_NOT_RESTORED",mode,t)
            assert f["synchronousRenderDepth"]["originalDraws"]==72
            assert m["synchronousDepth"]["originalDraws"]==44
            assert rest["depth"]["originalDraws"]==72
            assert f["captureProof"]["tick"]==t and f["captureProof"]["mask"]=="none"
            assert m["proof"]["tick"]==t and m["proof"]["mask"]=="without-B51-bodies"
            assert f["captureProof"]["provenance"]==m["proof"]["provenance"]==rest["proof"]=="SAME_NATIVE_FRAME_REPLAY_ORIGINAL_GPU_MESHES_TO_RGBA8_FBO"
            cens=m["sourceDrawCensus"]
            assert cens["B51_BODY"]["attemptedDrawCalls"]==28
            assert cens["B51_BODY"]["suppressedDrawCalls"]==28
            assert cens["B51_BODY"]["renderedDrawCalls"]==0
            farther,nearer=delta(orig,masked)
            assert nearer==0,("K4AJ_REMOVING_B51_CREATED_NEAR_DEPTH",mode,t)
            assert 0<=farther<=N
            if t==11280:
                k4zref=next(x for x in ref["frames"] if x["tick"]==t)
                assert f["originalPNG"] is not None
                left=img(z/k4zref["file"],k4zref["sha256"],k4zref["bytes"])
                right=img(aj/f["originalPNG"]["file"],f["originalPNG"]["sha256"],
                          f["originalPNG"]["bytes"])
                assert pngdiff(left,right,f["chapterHUD"])["native3DOrNonHUDPixelsChanged"]==0
                old=next(x for x in past["frames"] if x["tick"]==t)
                oldm=next(x for x in past["masks"] if x["tick"]==t and x["mask"]=="without-B51-bodies")
                assert orig==gpu(old["synchronousRenderDepth"])
                assert masked==gpu(oldm["synchronousDepth"])
                assert farther==({"ultra":53,"control":5972}[mode])
            if f["originalPNG"] is not None:
                original=img(aj/f["originalPNG"]["file"],f["originalPNG"]["sha256"],f["originalPNG"]["bytes"])
                recovered=img(aj/rest["screenshot"]["file"],rest["screenshot"]["sha256"],rest["screenshot"]["bytes"])
                assert pngdiff(original,recovered,f["chapterHUD"])["native3DOrNonHUDPixelsChanged"]==0
                snapshot_count+=1
            datum={"mode":mode,"tick":t,"seconds":t/240,"dense":lo<=t<=hi,
                "originalSourceB51Id":"p95-hazard-12",
                "actualSourceGPUDraws":72,"withoutAllB51GPUdraws":44,
                "maskedFartherDepthSamples":farther,"sampledPixels":N,
                "fractionOfSampledGPUdepthChanged":farther/N,
                "nativeDepthRestoredAllSamples":True,
                "physicalCollisionValidated":False,"ART":"NOT_TESTED_HOLD"}
            rows.append(datum)
            if lo<=t<=hi:mode_rows.append(datum)
        assert len(mode_rows)==hi-lo+1
        assert [r["tick"] for r in mode_rows]==list(range(lo,hi+1))
        windows[mode]={
            "nativeWindow":[lo,hi],"sourceGPUDepthVerifiedFrames":len(mode_rows),
            "anyB51GPUDepthContribution":ordered_windows(mode_rows,lambda x:x["maskedFartherDepthSamples"]>0),
            "B51DepthContributionAtLeast10Pct":ordered_windows(mode_rows,lambda x:x["fractionOfSampledGPUdepthChanged"]>=.1),
            "maximumB51DepthContribution":max(mode_rows,key=lambda x:x["maskedFartherDepthSamples"]),
            "sampling":"every_1_over_240_native_source_tick_in_this_window_not_live_240fps_playback"
        }
    assert len(rows)==100
    assert sum(x["dense"] for x in rows)==99
    assert snapshot_count==8  # 4 snapshots each mode, includes 11280.
    # Negative controls reject altered/invalid source-depth interpretation.
    good=[1,2,3]
    def monotonic(a,b):assert len(a)==len(b) and not any(y<x for x,y in zip(a,b))
    rejected=0
    for foo in (lambda:monotonic([3],[2]),lambda:monotonic([3,0],[4,0,1]),
                lambda:assert_unique_bad_tick(),lambda:assert_aggregate_wrong()):
        try:foo()
        except (AssertionError,TypeError):rejected+=1
    assert rejected==4
    with (aj/"K4AJ_100_REAL_SOURCE_GPU_DEPTH_MASKS.csv").open("w",newline="",encoding="utf8") as file:
        writer=csv.DictWriter(file,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)
    report={"schema":"dopagaki.K4AJ.original-GPU-depth-source-100-snapshots/1",
       "decision":"GENUINE_CONTIGUOUS_SOURCE_GPU_B51_DEPTH_99_TICKS_TECH_CANDIDATE_ART_HOLD",
       "originalSourceBlob":SRC,"pinnedK4AIRawSHA256":AISHA,"pinnedK4AFRawSHA256":AFSHA,
       "trueOriginalK4ZPNGVerified":82,"trueOriginalGPUFrames":100,
       "genuineSourceB51Masks":100,"originalDepthRestorations":100,
       "nativeSourceConsecutiveWindowTicks":99,"genuineK4AF11280Anchors":2,
       "observedNativeTickWindows":windows,"physicalCollisionVerified":False,
       "humanVisualObstructionSeconds":"NOT_MEASURED",
       "nativelySampledGPUdepthDurationOnly":True,
       "officialARTAccepted":0,"slope2DNAMetres":0,
       "newModels":0,"newColliders":0,"ART":"NOT_TESTED_HOLD",
       "RELEASE":"HOLD","MERGE":"HOLD"}
    (aj/"K4AJ_INDEPENDENT_99_CONTIGUOUS_SOURCE_GPU_MASK_AUDIT.json").write_text(json.dumps(report,indent=2,ensure_ascii=False)+"\n",encoding="utf8")
    out=["# K4AJ — 元240Hz時点に対応した真正GPUのB51深度遮蔽連続計測","",
       "**SOURCE GPU DEPTH TECH候補／ART HOLD、正式採用0件、Slope2 DNA0m。**","",
       "元GPU 8px格子11,176点/フレームにおいて、B51群を私用rendererで一時描画除去した場合にGPU深度が遠くなったサンプルを同一元物理tickで比較。native tick連続観測であり、ブラウザの240fps再生ではない。","",
       "|幅|測定tick|B51寄与が1点以上のtick|継続tick秒数|最大片数|最大寄与率|",
       "|---|---|---:|---:|---:|---:|"]
    for mode in ("ultra","control"):
        w=windows[mode];win=w["anyB51GPUDepthContribution"];mx=w["maximumB51DepthContribution"]
        out.append(f'|{mode}|{w["nativeWindow"][0]}–{w["nativeWindow"][1]}|{win["observedTicks"]}|{win["sampledTickDurationSeconds"]:.6f}|{mx["maskedFartherDepthSamples"]:,}|{100*mx["fractionOfSampledGPUdepthChanged"]:.3f}%|')
    out+=["","**注意**：観測窓の外のGPU状態は不明。各group maskのGPU深度差の有無は、人が認識した映像遮蔽時間・ART合格・物理衝突・画面内物体IDと同義ではない。元GPU深度は非線形24bitであり、m単位へ変換していない。",
          "元ゲーム/main/本番/PR#46/Camera/240Hz/B48/B51/球/Gold変更なし。新モデル/Collider0。ART/RELEASE/MERGE HOLD。",""]
    (aj/"K4AJ_NATIVE_240HZ_B51_GPU_MASK_WINDOWS_JA.md").write_text("\n".join(out),encoding="utf8")
    print("K4AJ_99_CONSECUTIVE_TRUE_GPU_B51_DEPTH_MASKS_PLUS_TWO_K4AF_ANCHORS_PASS")
    print("K4AJ_100_ORIGINAL_GPU_RESTORATIONS_AND_SAME_SOURCE_POSE_PASS")
    print("K4AJ_ART_HUMAN_VISUAL_COLLISION_RELEASE_HOLD")
def assert_unique_bad_tick():
    arr=[11259,11260,11260]
    assert len(set(arr))==len(arr)
def assert_aggregate_wrong():
    assert sum(range(99))==99
if __name__=="__main__":main()

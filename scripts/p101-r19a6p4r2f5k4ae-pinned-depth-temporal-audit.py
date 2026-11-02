"""K4AE: inspect pinned original K4AD true-WebGL2 RGBA24 depth evidence.
Nonlinear encoded depth IS NOT meters. GL readPixels y=0 is SCREEN BOTTOM.
No new geometry, object IDs, collision conclusions, ART or release decisions.
"""
import argparse,hashlib,json,math
from pathlib import Path
from collections import Counter

PIN_RAW="537346d1df0afb8c2ba1f0b2581d088dfeae3711a2b27021c199d72800d2d0ad"
PIN_AUDIT="edf9a2e1ad20f30e186a0fe708a163f78e3935c489d45054fd273ab342d3f826"
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
TICKS=(10680,10800,10920,11040,11160,11280,11400)
MODES=("ultra","control")
N=127*88
MAX24=16777215
HALF24=8388608
MASK_DRAWS={"without-epic":72,"without-mega":71,"without-frames":71,
 "without-B48-and-fixtures-visuals":71,"without-B51-bodies":44,
 "without-road-optics":68}

def read_verified(p,sha):
    buf=Path(p).read_bytes()
    assert hashlib.sha256(buf).hexdigest()==sha,("PARENT_SHA_CHANGED",p)
    return json.loads(buf)

def check_samples(d,draws):
    assert d["available"] is True
    assert d["method"]=="ORIGINAL_GPU_MESH_RGBA8_DEPTH24_REPLAY"
    assert d["width"]==1013 and d["height"]==698 and d["stride"]==8
    assert d["originalDraws"]==draws
    assert d["nonlinearDepth"] is True
    assert d["originalVertexShader"] is True
    assert d["physicalSafetyVerified"] is False
    assert d["perObjectIDs"] is False
    v=d["samples"]
    assert len(v)==N and all(type(x)==int and 0<=x<=MAX24 for x in v)
    assert min(v)<max(v)
    return v

def spatial(v):
    assert len(v)==N
    rows=[v[y*127:(y+1)*127] for y in range(88)]
    low_rows=[sum(q<HALF24 for q in line) for line in rows]
    low=sum(low_rows)
    bands={"bottom":sum(low_rows[:29]),"middle":sum(low_rows[29:58]),
           "top":sum(low_rows[58:])}
    assert low==sum(bands.values())
    sorted_v=sorted(v)
    return {"samples":N,"unit":"nonlinear_gl_FragCoord.z_RGBA24_NOT_m",
      "readPixelsOrigin":"BOTTOM_LEFT_not_top",
      "farSentinelCount":v.count(MAX24),"farSentinelFraction":v.count(MAX24)/N,
      "lowerHalfEncodedCount":low,"lowerHalfFraction":low/N,
      "lowerHalfByScreenThird":bands,
      "allColumnLowRowsFromBottom":[i for i,x in enumerate(low_rows) if x==127],
      "quantiles24":{str(p):sorted_v[math.floor(p*(N-1))]
                     for p in (0.01,0.05,0.5,0.95)},
      "centralRectangle":{ "xSamples":[32,96],"ySamplesFromBottom":[22,66],
          "lowerHalfCount":sum(rows[y][x]<HALF24 for y in range(22,66) for x in range(32,96))}}

def compare(a,b):
    assert len(a)==len(b)==N
    near=sum(x>y for x,y in zip(a,b))
    far=sum(x<y for x,y in zip(a,b))
    changed=sum(x!=y for x,y in zip(a,b))
    assert changed==near+far
    return {"changed":changed,"changedFraction":changed/N,
            "farther":far,"nearer":near}

def analyze(raw,audit):
    assert raw["originalSourceBlob"]==SRC
    assert raw["Hz"]==240 and raw["B48"]==7 and raw["B51"]==28
    assert raw["errors"]==[]
    assert raw["originalSourceGameChanged"] is False
    assert raw["newModels"]==raw["newColliders"]==0
    assert raw["physicsChanged"] is raw["cameraChanged"] is False
    assert raw["ART"]=="NOT_TESTED_HOLD" and raw["RELEASE"]==raw["MERGE"]=="HOLD"
    assert audit["originalK4ZAll82PNGshaVerified"]==82
    assert audit["originalRoad5NativePNGOutsideCSSExact"]==14
    assert audit["synchronousInRenderDepthSourceFramesAvailable"]==14
    assert audit["synchronousInRenderDepthMasksAvailable"]==12
    assert audit["nativeGPUReadbackResult"]=="SYNC_DEPTH_SAMPLE_TECH_CANDIDATE_ONLY"
    assert audit["confirmedPerObjectID"] is False
    assert audit["confirmedPhysicalSafety"] is False
    assert audit["confirmedPublicVoidART"] is False
    assert audit["officialARTAccepted"]==audit["slope2DNARecognizedMetres"]==0
    assert len(raw["sessions"])==len(audit["modes"])==2
    result=[]
    for mode in MODES:
        s=next(x for x in raw["sessions"] if x["mode"]==mode)
        a=next(x for x in audit["modes"] if x["mode"]==mode)
        assert len(s["frames"])==len(a["originalFrames"])==7
        assert len(s["masks"])==len(a["sameNativeTickDrawMasks"])==6
        assert [f["tick"] for f in s["frames"]]==list(TICKS)
        assert s["errors"]==[]
        assert s["trueOriginalWebGLContext"]["webgl2"] is True
        frames=[]
        for f,q in zip(s["frames"],a["originalFrames"]):
            assert f["tick"]==q["tick"]
            assert f["source"]["audit"]["sourceBlob"]==SRC
            assert f["source"]["tick"]==f["source"]["paused"]==f["tick"]
            assert f["source"]["road"]=="p93-PRISM_CREST-01"
            assert q["png"]["native3DOrNonHUDPixelsChanged"]==0
            assert q["depth"]["status"]=="NONLINEAR_DEPTH_SAMPLES_CANDIDATE"
            depth=check_samples(f["synchronousRenderDepth"],72)
            frames.append({"tick":f["tick"],"seconds":f["tick"]/240,
                           "gpuDraws":72,"native3DPixelDrift":0,**spatial(depth)})
        source=next(f for f in s["frames"] if f["tick"]==11040)
        v=check_samples(source["synchronousRenderDepth"],72)
        mask_out=[]
        for m,q in zip(s["masks"],a["sameNativeTickDrawMasks"]):
            n=MASK_DRAWS[m["mask"]]
            x=check_samples(m["synchronousDepth"],n)
            d=compare(v,x)
            assert m["tick"]==11040
            assert m["sourceSameBallCameraAnd240HzTick"] is True
            assert d["nearer"]==0
            assert d["changed"]==q["difference"]["changed"]
            assert n==q["genuineRGBAReplayDraws"]
            if n==72:assert d["changed"]==0
            else:assert d["changed"]>0
            mask_out.append({"name":m["mask"],"originalDraws":72,"maskedDraws":n,**d})
        assert [m["name"] for m in mask_out]==list(MASK_DRAWS)
        rest=check_samples(s["restored"]["depth"],72)
        assert compare(v,rest)["changed"]==0
        assert a["restoredNativeImage"]["native3DOrNonHUDPixelsChanged"]==0
        result.append({"mode":mode,"frames":frames,"masksAt46Sec":mask_out,
                       "nativeDepthRestored":True,"native3DFrameRestored":True})
    return result

def negative_controls(raw):
    d=dict(raw["sessions"][0]["frames"][0]["synchronousRenderDepth"])
    org=d["samples"]
    for bad in [org[:2],org[:-1]+[MAX24+1], [MAX24]*N]:
        d["samples"]=bad
        try:check_samples(d,72)
        except (AssertionError,ValueError):pass
        else:raise AssertionError("negative depth controls missed")
    d["samples"]=org;d["perObjectIDs"]=True
    try:check_samples(d,72)
    except AssertionError:pass
    else:raise AssertionError("forged object ID accepted")
    return 4

def make_md(results):
    rows=["# K4AE — 元Road5 GPU深度の時間・画面領域別診断",
          "","**SOURCE DIAGNOSTIC PASS — ただし ART HOLD。**","",
          "真正K4AD CI #41463872981 / Artifact #13150624075 の固定SHAデータだけを再解析。元ゲーム82枚 SHA / 14画面 HUD外3D画素差0 / 深度14画面 / 12マスクの監査条件を継承・再照合。",
          "","GPUのRGBA24値は非線形depthであり**物理距離mではない**。WebGL readPixelsの最初の行は画面の**下端**。",
          "","| tick / 時刻 | 14m遠端値% | 28m遠端値% | 14m符号化値下半分 | 28m符号化値下半分 |",
          "|---|---:|---:|---:|---:|"]
    for i in range(7):
        u,c=(results[0]["frames"][i],results[1]["frames"][i])
        rows.append(f'| {u["tick"]} / {u["seconds"]:.1f}s | '
          f'{u["farSentinelFraction"]*100:.2f}% | {c["farSentinelFraction"]*100:.2f}% | '
          f'{u["lowerHalfEncodedCount"]} | {c["lowerHalfEncodedCount"]} |')
    rows.extend(["","遠端値はGPUのclear値と一致したサンプルで、即「空洞」や「空」とは呼ばない。",
                 "","## 46秒時点の同一姿勢マスク寄与",
                 "","| マスク | 元→残draw | 14m deeper比率 | 28m deeper比率 |",
                 "|---|---:|---:|---:|"])
    for i in range(6):
        a,c=(results[0]["masksAt46Sec"][i],results[1]["masksAt46Sec"][i])
        rows.append(f'| {a["name"]} | 72→{a["maskedDraws"]} | '
         f'{100*a["changedFraction"]:.3f}% | {100*c["changedFraction"]:.3f}% |')
    special=results[1]["frames"][5]
    rows.extend(["","## 28m・tick11280 の画面下部前景",
       "",f'非線形深度値の下半分は {special["lowerHalfEncodedCount"]:,} / 11,176。 '
         f'下/中/上の画面領域別件数: {special["lowerHalfByScreenThird"]}。',
       f'127列全てが下半分に該当する行（GL底部から）: {special["allColumnLowRowsFromBottom"]}。',
       "元スクリーンショットの近距離前景と**整合する可能性**はあるが、深度値から描画対象IDや安全床を推定しない。",
       "","## 必須のHOLD",
       "","正式ART採用0件、Slope2 DNA 0m、新モデル・新コライダー0、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。",
       "巨大建築をどの秒間視認できたかは46秒の単独マスクからは測れない。次は元ゲームの複数時点における実GPUマスクまたは人間ARTを別工程で検証。",
       ""])
    return "\n".join(rows)

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--artifact-dir",required=True)
    p.add_argument("--out-dir",required=True)
    args=p.parse_args()
    directory=Path(args.artifact_dir)
    raw=read_verified(directory/"K4AD_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json",PIN_RAW)
    audit=read_verified(directory/"K4AD_INDEPENDENT_GENUINE_SOURCE_GPU_AUDIT.json",PIN_AUDIT)
    data=analyze(raw,audit)
    controls=negative_controls(raw)
    special=data[1]["frames"][5]
    assert special["tick"]==11280
    assert special["lowerHalfEncodedCount"]==3556
    assert special["lowerHalfByScreenThird"]["top"]==0
    assert all(f["lowerHalfEncodedCount"]==0 for m in data for f in m["frames"]
               if (m["mode"],f["tick"])!=("control",11280))
    out=Path(args.out_dir);out.mkdir(parents=True,exist_ok=True)
    report={"schema":"dopagaki.K4AE.pinned-depth-temporal/1",
      "decision":"EVIDENCE_SOURCE_DIAGNOSTIC_PASS_ART_HOLD",
      "protectedSourceBlob":SRC,
      "parentRunId":41463872981,"parentArtifactId":13150624075,
      "rawParentSHA256":PIN_RAW,"auditParentSHA256":PIN_AUDIT,
      "sourcePNGOriginalChecked":82,"genuineSourceFramesChecked":14,
      "genuineSourceMasksChecked":12,
      "sampledDepthPointsPerFrame":N,"depthReadbackOrigin":"bottom_left",
      "depthUnit":"NONLINEAR_ENCODED24_NOT_METERS",
      "negativeControls":controls,"objectIds":"NOT_MEASURED",
      "humanART":"NOT_TESTED","physicalSafety":"NOT_MEASURED",
      "officialARTAccepted":0,"slope2DNAMetres":0,"newModels":0,
      "newColliders":0,"ART":"NOT_TESTED_HOLD","RELEASE":"HOLD",
      "MERGE":"HOLD","modes":data}
    (out/"K4AE_GENUINE_DEPTH_TEMPORAL.json").write_text(
        json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
    (out/"K4AE_GENUINE_DEPTH_TEMPORAL_JA.md").write_text(
        make_md(data),encoding="utf8")
    print("K4AE_PINNED_K4AD_RAW_AND_AUDIT_SHA_PASS")
    print("K4AE_SOURCE_82_SHA_14_ROAD5_AND_12_MASKS_REAUDITED")
    print("K4AE_BOTTOM_UP_CONTROL_T11280_ENCODED_LOWER_HALF_3556")
    print("K4AE_SOURCE_DIAGNOSTIC_PASS_ART_RELEASE_HOLD")

if __name__=="__main__":main()

"""K4AF: derive measured temporal occlusion from independent 84 real GPU masks.

A sample changes only when the withheld original mesh affects its non-linear
GPU depth. This is NOT a perceived visibility %, scene-art score, safety
clearance, physical meters, or an estimate between the measured samples.
"""
import csv,json,sys
from pathlib import Path

def main():
    if len(sys.argv)!=3:raise SystemExit("usage: audit.json output-directory")
    src=Path(sys.argv[1]);out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
    data=json.loads(src.read_text(encoding="utf8"))
    assert data["originalK4ZAll82PNGshaVerified"]==82
    assert data["originalRoad5NativePNGOutsideCSSExact"]==14
    assert data["synchronousInRenderDepthSourceFramesAvailable"]==14
    assert data["synchronousInRenderDepthMasksAvailable"]==84
    assert data["sourceGPUrestorationCount"]==14
    assert data["nativeGPUReadbackResult"]=="ALL_7TICK_2WIDTH_84_GENUINE_SOURCE_GPU_DEPTH_MASKS_TECH_CANDIDATE_ONLY"
    assert data["ART"]=="NOT_TESTED_HOLD"
    assert data["officialARTAccepted"]==data["slope2DNARecognizedMetres"]==0
    assert data["newModels"]==data["newColliders"]==0
    assert data["RELEASE"]==data["MERGE"]=="HOLD"
    modes=("ultra","control")
    ticks=(10680,10800,10920,11040,11160,11280,11400)
    masks=("without-epic","without-mega","without-frames",
           "without-B48-and-fixtures-visuals","without-B51-bodies",
           "without-road-optics")
    rows=[]
    for mode in modes:
        m=next(x for x in data["modes"] if x["mode"]==mode)
        assert len(m["originalFrames"])==7
        assert len(m["sameOriginalTickGPUmasks"])==42
        assert len(m["originalNativeRestorations"])==7
        for tick in ticks:
            group=[x for x in m["sameOriginalTickGPUmasks"] if x["tick"]==tick]
            assert [x["mask"] for x in group]==list(masks)
            for v in group:
                d=v["difference"]
                assert d["status"]=="SAMPLED_NATIVE_DEPTH_AB_DIFFERENCE_ONLY"
                assert d["nearerOnMasked"]==0
                assert d["fartherOnMasked"]==d["changed"]
                assert d["samples"]==11176
                assert 0<=d["changed"]<=11176
                assert v["sourceOriginalGPUdraws"]==(
                    v["sourceReplayGPUdraws"]+v["sourceSuppressedGPUdraws"])
                rows.append(dict(mode=mode,tick=tick,seconds=tick/240,
                   mask=v["mask"],originalGPUdraws=v["sourceOriginalGPUdraws"],
                   suppressedGPUdraws=v["sourceSuppressedGPUdraws"],
                   replayedGPUdraws=v["sourceReplayGPUdraws"],
                   farDepthChangedSamples=d["changed"],
                   sampledPixels=d["samples"],
                   changedFraction=d["changed"]/d["samples"],
                   nearerDepthViolation=0))
    assert len(rows)==84
    with (out/"K4AF_TRUE_GPU_MASK_TIME_SERIES.csv").open("w",encoding="utf8",newline="") as f:
        writer=csv.DictWriter(f,fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    lines=["# K4AF — 元Road5 7時点×2幅の真正GPU遮蔽寄与",
           "",
           "**SOURCE TECH候補／ART HOLD、正式採用0件、Slope2 DNA 0m。**",
           "",
           "K4ADで技術検証した元Source GPU mesh replayを変えず、同じ球・カメラ・240Hz tickを固定して6群を個別に描画除去し、非線形24bit GPU深度の差を測定した。",
           "",
           "- 時間: 44.5 / 45.0 / 45.5 / 46.0 / 46.5 / 47.0 / 47.5秒。各時点で14m/28m元画面と真正3D画素を独立監査。",
           "- 遮蔽寄与率は8px格子11,176深度サンプルの差分割合であり、現実mや人間の視認率・建築の美しさではない。",
           "- マスクは**一群ずつ**適用。重なりがあるため各群の割合を足して全体の寄与とはしない。",
           "- 84条件すべて深度の変化方向が遠方のみ、14回の元深度復元に差0。0%は「元建築が存在しない」証拠ではない。",
           ""]
    for mode in modes:
        lines.extend(["## 幅条件 "+("14m" if mode=="ultra" else "28m"),"",
           "|秒|MEGA|FRAMES|B48描画|B51実体|ROAD OPTICS|EPIC|",
           "|---:|---:|---:|---:|---:|---:|---:|"])
        for tick in ticks:
            q={x["mask"]:x for x in rows if x["mode"]==mode and x["tick"]==tick}
            def pc(k):return f'{q[k]["changedFraction"]*100:.3f}%'
            lines.append(f'|{tick/240:.1f}|'+ "|".join([
                pc("without-mega"),pc("without-frames"),
                pc("without-B48-and-fixtures-visuals"),pc("without-B51-bodies"),
                pc("without-road-optics"),pc("without-epic")])+"|")
        lines.append("")
    lines+=["## 結論の上限","",
      "この結果で確かめるのは『元描画のどの群が、どの秒に、どの程度GPU深度へ現れていたか』だけ。人間がどれだけ見やすいか、巨大都市に達しているか、スピード感、床安全や物体IDは別実験が必要。",
      "元ゲーム・main・本番・PR#46は未変更。新モデル/新コライダー0。正式ART 0件、Slope2 DNA 0m、SAT/CCD/HUMAN/FPS/RELEASE/MERGE HOLD。",
      ""]
    (out/"K4AF_TRUE_GPU_MASK_TIME_SERIES_JA.md").write_text("\n".join(lines),encoding="utf8")
    print("K4AF_84_TRUE_GPU_SOURCE_MASK_TEMPORAL_ROWS_PASS")
    print("K4AF_SPATIAL_VISIBILITY_AND_HUMAN_ART_NOT_INFERRED_HOLD")

if __name__=="__main__":main()

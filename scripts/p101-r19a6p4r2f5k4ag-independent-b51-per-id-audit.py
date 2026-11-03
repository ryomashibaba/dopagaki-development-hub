"""K4AG original 28 B51 individual source GPU draw exclusions, ART HOLD."""
import argparse,csv,hashlib,json,runpy
from pathlib import Path
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
PARENT="016c28bf4fafa50748d8083496a81a5d66732540c0c3b50e863a7c39cfaddf26"
N=11176
def gpu(d,draws):
    assert d["available"] is True and d["method"]=="ORIGINAL_GPU_MESH_RGBA8_DEPTH24_REPLAY"
    assert d["width"]==1013 and d["height"]==698 and d["stride"]==8
    assert d["originalDraws"]==draws and d["nonlinearDepth"] is True
    assert d["originalVertexShader"] is True and d["physicalSafetyVerified"] is False
    assert d["perObjectIDs"] is False
    s=d["samples"]
    assert len(s)==N and all(type(x)==int and 0<=x<=16777215 for x in s)
    return s
def change(a,b):
    assert len(a)==len(b)==N
    return sum(x<y for x,y in zip(a,b)),sum(x>y for x,y in zip(a,b))
def main():
    p=argparse.ArgumentParser()
    for k in ("k4z","k4af","k4ag"):p.add_argument("--"+k,required=True)
    a=p.parse_args()
    z=Path(a.k4z);p=Path(a.k4af);o=Path(a.k4ag)
    raw=p/"K4AF_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json"
    assert hashlib.sha256(raw.read_bytes()).hexdigest()==PARENT
    old=json.loads(raw.read_text());new=json.loads((o/"K4AG_GENUINE_NATIVE_IN_RENDER_DEPTH_REPORT.json").read_text())
    ground=json.loads((z/"K4Z_ORIGINAL_SOURCE_DENSE_7ROAD_CAMERA.json").read_text())
    assert old["originalSourceBlob"]==new["originalSourceBlob"]==ground["sourceBlob"]==SRC
    assert new["Hz"]==240 and new["B48"]==7 and new["B51"]==28
    assert new["errors"]==[]
    assert new["physicsChanged"] is new["cameraChanged"] is new["originalSourceGameChanged"] is False
    assert new["newModels"]==new["newColliders"]==new["officialARTAccepted"]==new["slope2DNAMetres"]==0
    assert new["ART"]=="NOT_TESTED_HOLD" and new["RELEASE"]==new["MERGE"]=="HOLD"
    assert len(new["sessions"])==2
    helper=runpy.run_path("scripts/p101-r19a6p4r2f5k4ad-independent-rgba-depth-audit.py")
    rows=[]
    for mode,group_expected in (("ultra",53),("control",5972)):
        current=next(x for x in new["sessions"] if x["mode"]==mode)
        parent=next(x for x in old["sessions"] if x["mode"]==mode)
        original=next(x for x in ground["sessions"] if x["mode"]==mode)
        assert len(current["frames"])==len(current["masks"])==len(current["restored"])==1
        assert len(current["individuals"])==28
        assert current["errors"]==[]
        f=current["frames"][0];masked=current["masks"][0]
        assert f["tick"]==masked["tick"]==11280
        assert f["source"]["tick"]==f["source"]["paused"]==11280
        assert f["source"]["road"]=="p93-PRISM_CREST-01"
        assert f["source"]["sourceB51"]==28 and f["source"]["effectiveMask"]=="none"
        orig=next(x for x in original["frames"] if x["tick"]==11280)
        aimg=helper["img"](z/orig["file"],orig["sha256"],orig["bytes"])
        bimg=helper["img"](o/f["originalPNG"]["file"],f["originalPNG"]["sha256"],f["originalPNG"]["bytes"])
        assert helper["source_png_equals_outside_css"](aimg,bimg,f["chapterHUD"])["native3DOrNonHUDPixelsChanged"]==0
        original_depth=gpu(f["synchronousRenderDepth"],72)
        group_depth=gpu(masked["synchronousDepth"],44)
        old_original=gpu(next(x for x in parent["frames"] if x["tick"]==11280)["synchronousRenderDepth"],72)
        old_group=gpu(next(x for x in parent["masks"] if x["tick"]==11280 and x["mask"]=="without-B51-bodies")["synchronousDepth"],44)
        assert original_depth==old_original and group_depth==old_group
        assert change(original_depth,group_depth)==(group_expected,0)
        ids=[]
        for q in current["individuals"]:
            oid=q["obstacleId"];ids.append(oid)
            assert isinstance(oid,str) and oid and q["tick"]==11280
            assert q["filteredOriginalB51Ids"]==[oid]
            assert q["sourceSameBallCameraAnd240HzTick"] is True
            assert q["actualDrawsOneFewer"] is True
            one=gpu(q["depth"],71)
            farther,nearer=change(original_depth,one)
            assert nearer==0
            assert all(x<=y<=z for x,y,z in zip(original_depth,one,group_depth))
            rows.append({"mode":mode,"tick":11280,"sourceB51Id":oid,
                         "individualFartherSamples":farther,"fraction":farther/N,
                         "all28FartherSamples":group_expected,"originalDraws":72,
                         "individualDraws":71,"collision":"NOT_TESTED"})
        assert len(set(ids))==28
        assert gpu(current["restored"][0]["depth"],72)==original_depth
        assert current["b51Restored"]["filteredIds"]==[]
        assert gpu(current["b51Restored"]["depth"],72)==original_depth
    assert len(rows)==56
    with (o/"K4AG_B51_56_SOURCE_IDS.csv").open("w",newline="",encoding="utf8") as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
    leaders=sorted((x for x in rows if x["mode"]=="control"),
                   key=lambda x:(-x["individualFartherSamples"],x["sourceB51Id"]))
    assert leaders[0]["individualFartherSamples"]>0
    result={"schema":"dopagaki.K4AG.genuine-source-ID-single-body-audit/1",
      "decision":"SOURCE_GPU_B51_SINGLE_ID_TECH_CANDIDATE_ONLY",
      "parentArtifactJSONSHA256":PARENT,"originalSourceBlob":SRC,
      "genuineSourceSingleBodyMasks":56,"sourceB51ObstaclesPerWidth":28,
      "baselineDepth":2,"groupB51Depth":2,"originalDepthRestorations":4,
      "controlGroupOcclusionSamples":5972,"ultraGroupOcclusionSamples":53,
      "controlTopB51SourceIDs":leaders[:5],
      "newModels":0,"newColliders":0,"officialARTAccepted":0,"slope2DNAMetres":0,
      "ART":"NOT_TESTED_HOLD","collision":"NOT_TESTED",
      "HUMAN":"NOT_TESTED","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD",
      "RELEASE":"HOLD","MERGE":"HOLD"}
    (o/"K4AG_B51_SOURCE_ID_AUDIT.json").write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
    lines=["# K4AG：B51単体GPU遮蔽の真正ID監査","",
           "元K4AFの真正深度と完全一致するRoad5 47.0秒の画面を使用。GPU深度であり、ART・衝突判定・人間視認率ではない。","",
           "- 28m全B51除去: 5,972/11,176=53.436%。",
           "- 14m全B51除去: 53/11,176=0.474%。",
           "- 28個の元IDを1件ずつ描画から除外。物理・衝突判定には介入せず、元source再描画を再使用。",
           "- 元GPU描画命令72、単体除去71、全B51除去44。前景が余計に増えたサンプル0。",
           "","## 28m 上位5元B51 ID","",
           "|元source ID|深度変化サンプル|8px格子比率|",
           "|---|---:|---:|"]
    for q in leaders[:5]:
        lines.append("|"+q["sourceB51Id"]+"|"+str(q["individualFartherSamples"])+"|"+format(100*q["fraction"],".3f")+"%|")
    lines.extend(["","重なりによる非加算性のため各IDの寄与を合計しない。ゲームの安全性・造形合格・接触判定・実距離は不明。",
                  "","正式ART採用0件・Slope2 DNA認定0m。main、元球、240Hz、元カメラ、B48/B51、本番URL、PR#46は不変更。",
                  ""])
    (o/"K4AG_B51_SOURCE_ID_FINDINGS_JA.md").write_text("\n".join(lines),encoding="utf8")
    print("K4AG_56_GENUINE_SOURCE_B51_SINGLE_ID_DEPTH_PROBES_PASS")
    print("K4AG_CONTROL_TOP_SOURCE_B51_ID",leaders[0]["sourceB51Id"],leaders[0]["individualFartherSamples"])
    print("K4AG_ART_COLLISION_RELEASE_HOLD")
if __name__=="__main__":main()

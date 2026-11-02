"""K4Y: evidence-only ART review atlas, original 7-road 240Hz camera PNGs.

NO new building, proxy candidate, collision, city/physics/camera modifications,
site ranking, inferred AIR road, continuous-run claim, or machine ART PASS.
K and K3B are separate captures. This atlas is an inspectable human ART
review instrument, not proof that a public plaza is visible or walkable.
"""
import argparse, hashlib, io, json, zipfile
from pathlib import Path
from collections import Counter, defaultdict
from PIL import Image, ImageDraw, ImageFont

SOURCE="af076d67492a677d2235e4730aef8cdf4808e106"
W,H=1013,698
MODES=("ultra","control")
CATS=("geometryGapProof","foregroundRoadToCourtSupport",
      "threeLayerDepthHumanReview","A5SemanticDistinctionHumanReview",
      "continuousVisibilityEvidence")
UNKNOWN=[
  "Candidate native 3D gap not created or independently inspected",
  "Road-to-court support, collision SAT/CCD and real walking untested",
  "Human entrance/middle/back layer comprehension untested",
  "Actual A5-versus-candidate same-tick comparison not available",
  "Sparse K and K3B captures do not prove continuous on-screen visibility",
]
ROADS=[
 "p93-ABYSS_DIVE-01","p93-CROWN_REVERSAL-01",
 "p93-SCISSOR_RISE-01","p93-LOWER_REVERSAL-01",
 "p93-VOID_SURGE-01","p93-PRISM_CREST-01",
 "p93-FINISH_RIDGE-01",
]
def sha(data):return hashlib.sha256(data).hexdigest()
def zipopen(filename):
    data=Path(filename).read_bytes()
    z=zipfile.ZipFile(io.BytesIO(data))
    assert z.testzip() is None,(filename,"ZIP CRC")
    return z,sha(data)
def read(z,name):return json.loads(z.read(name).decode("utf8"))
def font(size,bold=False):
    paths=("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
           "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf") if bold else (
           "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",)
    for p in paths:
        if Path(p).exists():return ImageFont.truetype(p,size)
    return ImageFont.load_default()
F11=font(11); F14=font(14); F16=font(16); F19=font(19,True); F24=font(24,True)
INK=(24,35,51); MUTED=(88,105,121); PALE=(241,245,249)
def txt(draw,xy,text,size=F14,fill=INK):draw.text(xy,str(text),font=size,fill=fill)
def checked_image(z,item):
    data=z.read(item["file"])
    assert len(data)==item["bytes"] and sha(data)==item["sha256"],(item["file"],"PNG SHA")
    x=Image.open(io.BytesIO(data)).convert("RGB")
    assert x.size==(W,H)
    return x
def frames(log,family):
    assert log["sourceBlob"]==SOURCE
    sessions=log["sessions"]
    assert [s["mode"] for s in sessions]==list(MODES)
    for session in sessions:
        samples=session["observed"] if family=="K" else session["shots"]
        for item in samples:
            assert item["tick"]==item["state"]["tick"]
            assert item["state"]["B51"]==28
            assert item["state"]["camera"]=="ball-lock-unfiltered-heading"
            yield (session["mode"],family,item)
def selected_atlas_candidates(full):
    # Select K early 13 and K3B later 8 per mode; no false interpolation.
    output={}
    for mode in MODES:
        eligible=[x for x in full if x["mode"]==mode and x["state"]["road"] in ROADS
                  and ((x["family"]=="K" and x["tick"]<7680) or
                       (x["family"]=="K3B" and x["tick"]>=7680))]
        assert len(eligible)==21,(mode,len(eligible))
        assert len({x["tick"] for x in eligible})==21
        output[mode]=sorted(eligible,key=lambda x:x["tick"])
    return output
def positions(records):
    n=len(records)
    if n==1:return [records[0],None,None]
    if n==2:return [records[0],records[1],None]
    choices=[records[0],records[n//2],records[-1]]
    assert len({x["tick"] for x in choices})==3
    return choices
def cover_panel(draw,x,y,w,h,label,notes):
    draw.rounded_rectangle((x,y,x+w,y+h),radius=9,fill=(238,242,246),
                           outline=(197,210,221),width=2)
    txt(draw,(x+15,y+15),label,F19)
    py=y+58
    for line in notes:
        txt(draw,(x+15,py),line,F14,MUTED);py+=30
def frame_label(draw,x,y,item):
    if item is None:
        draw.rectangle((x,y,x+434,y+300),fill=(236,240,243))
        txt(draw,(x+28,y+113),"NO THIRD CAPTURE",F19)
        txt(draw,(x+28,y+149),"Evidence deliberately missing",F14,MUTED)
        return
    mode=item["mode"];road=item["state"]["road"]
    draw.rectangle((x,y,x+434,y+300),fill=(250,251,252),outline=(203,212,220))
    draw.rectangle((x,y,x+434,y+39),fill=(23,39,57))
    txt(draw,(x+10,y+9),f"{item['family']}  tick {item['tick']}  {item['tick']/240:.3f}s",F16,(255,255,255))
    txt(draw,(x+11,y+277),f"Source SHA {item['sha256'][:16]}...",F11,MUTED)
def build_road_sheet(out,mode,road_index,records,sources):
    road=ROADS[road_index]
    samples=positions(records)
    canvas=Image.new("RGB",(1745,790),(255,255,255));dr=ImageDraw.Draw(canvas)
    dr.rectangle((0,0,1744,102),fill=INK)
    txt(dr,(28,16),f"K4Y  |  ROAD {road_index}  |  {mode.upper()}  |  REAL ORIGINAL WEBGL2",F24,(255,255,255))
    txt(dr,(29,58),road+"  |  SOURCE-ONLY review; no public-space candidate rendered",F16,(211,225,239))
    for i,item in enumerate(samples):
        x=26+i*451
        frame_label(dr,x,117,item)
        if item is not None:
            pic=checked_image(sources[item["family"]],item)
            resized=pic.resize((434,241),Image.Resampling.LANCZOS)
            canvas.paste(resized,(x,156))
            txt(dr,(x+7,414),f"road: {item['state']['road'][4:31]}",F11,MUTED)
            txt(dr,(x+7,435),f"speed: {item['state']['speed']:.2f}m/s",F14,INK)
    box_x=1391
    cover_panel(dr,box_x,116,337,535,"INDEPENDENT ART GATE",[
      "1. Real open geometry: UNKNOWN",
      "2. Road-to-court: UNKNOWN",
      "3. Entrance / middle / back:",
      "   HUMAN NOT REVIEWED",
      "4. Separate from city A5:",
      "   CANDIDATE NOT BUILT",
      "5. Fast continuity: UNKNOWN",
      "",
      f"{len(records)} source frame(s) only.",
      "Never infer visibility time.",
      "Never rank a site by pixels.",
      "",
      "ART: NOT TESTED / HOLD",
      "Prior K4R/K4U: REJECT",
    ])
    dr.line((26,480,1360,480),fill=(210,220,231),width=2)
    txt(dr,(27,497),"WHAT TO REVIEW ON GENUINE SCREENSHOTS (NOT AUTO-DECIDED)",F19)
    txt(dr,(27,539),"Foreground road / A5 mass / negative-space direction and possible depth layers.",F16)
    txt(dr,(27,574),"With NO candidate, public access, court depth and intended use CANNOT be judged.",F16)
    txt(dr,(27,620),"K early and K3B late are separate protocols; intervening seconds are unrecorded.",F14,MUTED)
    txt(dr,(27,677),"SCREEN CAPTURE: GENUINE    |    DESIGN: NONE    |    ART: HOLD    |    RELEASE: HOLD",F16)
    txt(dr,(27,727),"Images are resized source pixels (SHA checked before resize), not synthetic model renders.",F14,MUTED)
    name=f"K4Y_{mode}_ROAD{road_index}_THREE_SOURCE_FRAMES_REVIEW.png"
    canvas.save(out/name,optimize=True)
    return name
def overview(out,mode,rows,images):
    cw=1025;ch=400
    image=Image.new("RGB",(cw,7*ch+106),"white")
    dr=ImageDraw.Draw(image)
    dr.rectangle((0,0,cw,104),fill=INK)
    txt(dr,(25,15),f"K4Y | {mode.upper()} | ALL SEVEN ROADS | GENUINE SOURCE",F24,(255,255,255))
    txt(dr,(27,58),"ONE MIDDLE CAPTURE PER ROAD. No market. Not a continuous run.",F16,(211,225,239))
    for i,records in enumerate(rows):
        y=106+i*ch
        dr.rectangle((0,y,1024,y+ch-1),fill=(247,249,251) if i%2==0 else (237,241,245))
        mid=positions(records)[1] or positions(records)[0]
        im=checked_image(images[mid["family"]],mid)
        image.paste(im.resize((558,385),Image.Resampling.LANCZOS),(10,y+8))
        txt(dr,(584,y+14),f"Road {i}: {ROADS[i].replace('p93-','')}",F19,INK)
        txt(dr,(585,y+61),f"tick {mid['tick']} / {mid['tick']/240:.3f}s / {mid['family']}",F16)
        txt(dr,(585,y+104),f"{len(records)} source frame(s) in series",F16)
        txt(dr,(585,y+152),"Open plaza: NO CANDIDATE",F14,MUTED)
        txt(dr,(585,y+185),"Road connection: NOT TESTED",F14,MUTED)
        txt(dr,(585,y+218),"3 spatial layers: NOT TESTED",F14,MUTED)
        txt(dr,(585,y+251),"Continuous visibility: UNKNOWN",F14,MUTED)
        txt(dr,(585,y+303),"SOURCE-ONLY; ART HOLD",F19)
    name=f"K4Y_{mode}_7ROAD_TRUE_ORIGINAL_ART_AUDIT_OVERVIEW.png"
    image.save(out/name,optimize=True)
    return name
def main():
    ap=argparse.ArgumentParser()
    for k in ("kzip","k3bzip","k4xzip","out"):ap.add_argument("--"+k,required=True)
    args=ap.parse_args()
    out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
    kz,khash=zipopen(args.kzip)
    bz,bhash=zipopen(args.k3bzip)
    xz,xhash=zipopen(args.k4xzip)
    with kz,bz,xz:
        K=read(kz,"R2F5K_REAL_ORIGINAL_EXTENDED_CAMERA_COVERAGE.json")
        B=read(bz,"R2F5K3B_REAL_SEVEN_ROAD_WEBGL2_CAMERA.json")
        X=read(xz,"K4X_SEVEN_ROAD_TRUE_SOURCE_CAMERAS_UNBUILT_NEGATIVE_SPACE.json")
        assert K["sourceBlob"]==B["sourceBlob"]==X["sourceBlob"]==SOURCE
        assert K["roadCount"]==B["sourceB48"]==X["sourceB48"]==7
        assert K["B51"]==B["sourceB51"]==X["sourceB51"]==28
        assert K["Hz"]==B["sourceHz"]==X["sourceHz"]==240
        assert K["errors"]==B["errors"]==[]
        assert K["noCameraChanges"] and not B["geometryChanged"] and not B["collisionChanged"]
        assert khash==X["KoriginalZipSHA256"] and bhash==X["K3BoriginalZipSHA256"]
        assert X["actualWebGL2AllOriginalPNGVerified"]==58
        assert X["overlappingCaptureFrameSHAAgreements"]==12
        assert len(X["measurements"])==1764
        assert X["projectableAndOnscreenMathOnlyCount"]==611
        assert len(X["roadDiagnostics"])==14
        assert X["noBuildingDesignedOrRendered"] and X["noRoadAssignmentsInferredFromAIR"]
        assert X["notAContinuousSingleRun"] and not X["humanComprehensionTested"]
        allrecord=[]; index={}
        for log,family,z in ((K,"K",kz),(B,"K3B",bz)):
            for mode,fam,item in frames(log,family):
                checked_image(z,item)
                key=(mode,fam,item["tick"])
                assert key not in index,key
                index[key]=item
                allrecord.append({"mode":mode,"family":fam,"tick":item["tick"],
                                  "state":item["state"],"file":item["file"],
                                  "bytes":item["bytes"],"sha256":item["sha256"]})
        assert len(allrecord)==58
        shares=[]
        for mode in MODES:
            ticks={x["tick"] for x in allrecord if x["mode"]==mode and x["family"]=="K"}
            common=sorted(ticks & {x["tick"] for x in allrecord if x["mode"]==mode and x["family"]=="K3B"})
            assert len(common)==6
            for tick in common:
                assert index[mode,"K",tick]["sha256"]==index[mode,"K3B",tick]["sha256"]
                shares.append({"mode":mode,"tick":tick,"sha256":index[mode,"K",tick]["sha256"]})
        assert len(shares)==12
        selected=selected_atlas_candidates(allrecord)
        details=[]
        group=[]
        sources={"K":kz,"K3B":bz}
        for mode in MODES:
            road_rows=[]
            for i,road in enumerate(ROADS):
                seq=[x for x in selected[mode] if x["state"]["road"]==road]
                assert seq
                road_rows.append(seq)
                chosen=[x for x in positions(seq) if x is not None]
                paths=build_road_sheet(out,mode,i,seq,sources)
                rec={"mode":mode,"roadIndex":i,"roadId":road,"sourceCount":len(seq),
                     "chosenTicks":[x["tick"] for x in chosen],
                     "reviewImage":paths,"captureFamilies":list(dict.fromkeys(x["family"] for x in seq)),
                     "firstRecordedTick":seq[0]["tick"],
                     "lastRecordedTick":seq[-1]["tick"],
                     "timeBetweenFirstLastSecondsIsNotContinuousVisibility":True,
                     "knownSourceOnly":True,"humanConclusion":"NOT_REVIEWED",
                     "failedEvidenceGates":[
                         "NO_NATIVE_CANDIDATE_PUBLIC_COURT",
                         "NO_SUPPORT_OR_B48_B51_SAT_CCD",
                         "NO_HUMAN_THREE_LAYER_COMPREHENSION",
                         "NO_A5_VS_CANDIDATE_PAIRED_IMAGE",
                         "NO_CONTINUOUS_CAPTURE_AND_VIEW_DURATION"],
                     "siteApproval":"FORBIDDEN","artAcceptance":"NOT_TESTED_HOLD"}
                group.append(rec)
                for frame in seq:
                    state=frame["state"]
                    # No proxy projection metrics are promoted into art evaluation.
                    details.append({"sourceFrameId":f"{frame['family']}_{mode}_{frame['tick']}",
                      "captureProtocol":frame["family"],"mode":mode,"roadId":road,
                      "tick":frame["tick"],"sourceImageSha256":frame["sha256"],
                      "sourceImageFile":frame["file"],
                      "cameraEye":state["cameraEye"],"cameraFront":state["cameraFront"],
                      "ballXYZ":state["xyz"],"speedMps":state["speed"],
                      "technicalSourceAuthenticity":"SHA256_VERIFIED_GENUINE_WEBGL2",
                      "realNativeCandidateImageSha":"NOT_CREATED",
                      **{key:"NOT_TESTED" for key in CATS},
                      "independentARTDecision":"NOT_TESTED_HOLD",
                      "sourceCameraNotHuman":True,
                      "unknowns":UNKNOWN.copy()})
            overview(out,mode,road_rows,sources)
        assert len(details)==42 and len(group)==14
        assert all(len([r for r in details if r["mode"]==m])==21 for m in MODES)
        assert all(sum(g["sourceCount"] for g in group if g["mode"]==m)==21 for m in MODES)
        assert set(r["roadId"] for r in details)==set(ROADS)
        assert len(list(out.glob("K4Y_*_THREE_SOURCE_FRAMES_REVIEW.png")))==14
        assert len(list(out.glob("K4Y_*_TRUE_ORIGINAL_ART_AUDIT_OVERVIEW.png")))==2
        report={"schema":"dopagaki.k4y-source-only-seven-road-independent-art-review-instrument/1",
          "sourceBlob":SOURCE,"sourceHz":240,"sourceB48":7,"sourceB51":28,
          "trueSourcePNGCountVerified":58,"independentOriginalCaptureStates":42,
          "overlappingKAndK3BFrameSHAEqual":12,
          "twoCaptureProtocolsNotAContinuousRun":True,"sourceZIPsha256":{"K":khash,"K3B":bhash,"K4X":xhash},
          "sourceK4X1764ProjectionRows":1764,"K4XscreenMathHitsNotArtRatings":611,
          "roadReviewSheets":14,"allRoadOverviewSheets":2,
          "candidateOriginalWebGL2FramesRendered":0,"newBuildingModels":0,"newColliders":0,
          "sourcePhysicsCameraCityUnmodified":True,"fakePersonModels":0,
          "automaticSiteRanking":False,"continuousVisibilitySeconds":"UNKNOWN",
          "HUMAN":"NOT_TESTED","SAT":"NOT_RUN","CCD":"NOT_RUN",
          "FPS":"NOT_TESTED","officialARTAccepted":0,"slope2DNARecognizedMetres":0,
          "K4RAndK4UIndependentART":"REJECT","K4YIndependentART":"NOT_TESTED_HOLD",
          "release":"HOLD","merge":"HOLD","reviewContractFields":list(CATS),
          "overlappingSourceFrames":shares,
          "roadReviews":group,"sourceFrames":details,"errors":[]}
        (out/"K4Y_7ROAD_NATIVE_SOURCE_ART_REVIEW_CONTRACT_EVIDENCE.json").write_text(
            json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
        print("K4Y_TRUE_SOURCE_58_PNG_SHA_42_CAMERA_STATES_ART_REVIEW_INSTRUMENT_PASS",
              json.dumps({"sourcePNGVerified":58,"sourceStates":42,
                 "roadSheets":14,"overviewSheets":2,"realNewModels":0,
                 "candidateART":"NOT_TESTED_HOLD","officialARTAccepted":0,
                 "perRoadSourceFrames":{
                   mode:{str(i):len([f for f in selected[mode] if f["state"]["road"]==road])
                         for i,road in enumerate(ROADS)}
                   for mode in MODES}}))
if __name__=="__main__":main()

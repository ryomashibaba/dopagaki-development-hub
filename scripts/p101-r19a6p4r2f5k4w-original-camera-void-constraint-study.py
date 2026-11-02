"""K4W — no new art: original source camera inverse screen-space study.

The true original 240Hz WebGL2 PNGs, original 7-road anchors, frozen
K4R/K4U native screenshots and K4V read-only measurements are SHA-checked.
The research counterfactuals are MATH ONLY: vertical ruler heights for
illustrative 8/12 screen pixels and isotropic ROOFLESS COURT floor scale
needed for 24/32 screen pixels. Neither values nor thresholds demonstrate
human readability, safety, collision clearance, or acceptable architecture.
"""
import argparse, hashlib, importlib.util, io, json, math, zipfile
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SOURCE="af076d67492a677d2235e4730aef8cdf4808e106"
MODES=("ultra","control"); TICKS=(265,721,1057,1249)
W,H=1013,698
TARGET_MARKER_PX=(8.0,12.0)
TARGET_COURT_PX=(24.0,32.0)
ROOFLESS_HALF_GAP_X=(-13.0,12.0) # frozen roof shell x end points
COURT_INSET_X=10.0
MAX_INSET_SCALING=min(abs(ROOFLESS_HALF_GAP_X[0])/COURT_INSET_X,
                      ROOFLESS_HALF_GAP_X[1]/COURT_INSET_X) # 1.2
def sha(b):return hashlib.sha256(b).hexdigest()
def load(z,n):return json.loads(z.read(n).decode("utf8"))
def safezip(p):
    data=Path(p).read_bytes()
    z=zipfile.ZipFile(io.BytesIO(data))
    assert z.testzip() is None,(p,"ZIP CRC")
    return z,sha(data)
def font(size):
    for p in ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
       "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"):
        if Path(p).exists():return ImageFont.truetype(p,size)
    return ImageFont.load_default()
def clipped(img):
    assert img.size==(W,H)
    return img.resize((507,349),Image.Resampling.BILINEAR)
def rise_ruler(fn,center,h):
    a=fn(center);b=fn(center+np.array([0,h,0],dtype=np.float64))
    if a is None or b is None: return float("inf")
    return math.dist(a[:2],b[:2])
def find_height(fn,center,target):
    assert rise_ruler(fn,center,1.7)>0
    lo=0.;hi=1.7
    while rise_ruler(fn,center,hi)<target and hi<1024: hi*=2
    assert hi<1024,("marker cannot meet target in bracket",target)
    for _ in range(55):
        mid=(lo+hi)/2
        if rise_ruler(fn,center,mid)<target:lo=mid
        else:hi=mid
    return round(hi,4)
def court_coords(fn,frame,scale):
    origin,along,outward=frame
    coords=[]
    for x,y in [(-10,-14),(10,-14),(10,14),(-10,14)]:
        p=origin+along*(x*scale)+outward*(y*scale)+np.array([0,.86,0])
        v=fn(p)
        assert v is not None
        coords.append(v[:2])
    return coords
def court_height(fn,frame,scale):
    pts=court_coords(fn,frame,scale)
    return float(max(p[1] for p in pts)-min(p[1] for p in pts))
def find_scale(fn,frame,target):
    lo=0.;hi=1.
    while court_height(fn,frame,hi)<target and hi<128:hi*=2.
    assert hi<128,("court cannot meet illustrative target",target)
    for _ in range(55):
        m=(lo+hi)/2
        if court_height(fn,frame,m)<target:lo=m
        else:hi=m
    return round(hi,5)
def png(z,sample):
    data=z.read(sample["png"])
    assert sha(data)==sample["sha256"] and len(data)==sample["bytes"]
    image=Image.open(io.BytesIO(data)).convert("RGB")
    assert image.size==(W,H)
    return image
def render_sheet(rows,source_and_candidate,out,mode):
    # Images in this annotated figure are authentic screenshots from K4U artifact.
    # Yellow shapes and measurement text are AFTER-CAPTURE mathematical annotations.
    height=4*350;sheet=Image.new("RGB",(1774,height),(246,246,244))
    draw=ImageDraw.Draw(sheet)
    f=font(16);fsmall=font(12);fb=font(19)
    for idx,(entry,pair) in enumerate(zip(rows,source_and_candidate)):
        y=idx*350
        source,candidate=pair
        sheet.paste(clipped(source),(0,y))
        overlay=candidate.copy()
        d=ImageDraw.Draw(overlay)
        xy=entry["projectedCourtQuadPx"]
        d.line([tuple(x) for x in xy]+[tuple(xy[0])],width=4,fill=(255,215,40))
        d.rectangle((0,0,1012,60),fill=(15,21,29))
        d.text((15,10),"REAL K4U WEBGL2 + YELLOW MATH OUTLINE",fill="white",font=font(20))
        d.text((15,35),"ANNOTATION IS NOT NATIVE GPU PIXELS",fill=(255,228,120),font=font(14))
        sheet.paste(clipped(overlay),(508,y))
        x=1024
        draw.rectangle((x+3,y+3,1772,y+346),outline=(110,110,110),width=1)
        draw.text((x+14,y+8),f"{mode.upper()}  tick {entry['tick']}  t={entry['seconds']:.3f}s",font=fb,fill=(12,16,22))
        draw.text((x+14,y+47),f"Actual center floor (frozen K4U) approx:",font=f,fill=(20,20,20))
        draw.text((x+14,y+78),f"Court {entry['courtVerticalPx']:.2f} px high; 1.7m ruler {entry['ruler17Px']:.2f} px",font=f,fill=(40,58,75))
        draw.text((x+14,y+112),f"Marker for 8px:  {entry['markerPhysicalHeightFor8pxM']:.2f}m (hypothetical)",font=f,fill=(35,30,20))
        draw.text((x+14,y+142),f"Marker for 12px: {entry['markerPhysicalHeightFor12pxM']:.2f}m (hypothetical)",font=f,fill=(35,30,20))
        draw.text((x+14,y+178),f"Court 24px: {entry['courtUniformScaleFor24px']:.2f}x, limit 1.20x",font=f,fill=(43,32,20))
        draw.text((x+14,y+206),f"Court 32px: {entry['courtUniformScaleFor32px']:.2f}x, limit 1.20x",font=f,fill=(43,32,20))
        draw.text((x+14,y+245),"Targets are ILLUSTRATIVE, not validated ART criteria.",font=fsmall,fill=(106,28,24))
        draw.text((x+14,y+271),"No actor/model, no 3D edit, no movement of camera.",font=fsmall,fill=(50,50,50))
        draw.text((x+14,y+301),"REAL ORIGINAL frame    |   REAL K4U frame    |   ANALYSIS",font=fsmall,fill=(40,40,45))
        draw.line((0,y+349,1773,y+349),fill=(180,180,180),width=1)
    sheet.save(out,optimize=True)
def run(args):
    import importlib.util
    spec=importlib.util.spec_from_file_location("k4v_immutable",args.k4v_code)
    k4v=importlib.util.module_from_spec(spec);spec.loader.exec_module(k4v)
    for name in ("site_frame","projector","court_measure"):
        assert hasattr(k4v,name)
    sources={}
    for name in ("k","k4r","k4u","k4v"):
        z,zsha=safezip(getattr(args,name))
        sources[name]=z
    with sources["k"] as kz,sources["k4r"] as rz,sources["k4u"] as uz,sources["k4v"] as vz:
        anchors=load(kz,"R2F5K_ALL7_FROZEN_SOURCE_ROAD_ANCHORS.json")
        r=load(rz,"K4R_REAL_ORIGINAL_WEBGL2_16_IMAGES.json")
        u=load(uz,"K4U_REAL_ORIGINAL_WEBGL2_16_IMAGES.json")
        prev=load(vz,"K4V_REAL_CAMERA_COURT_READABILITY_GEOMETRY_AND_PIXELS.json")
        assert anchors["originalGameBlob"]==r["sourceBlob"]==u["sourceBlob"]==prev["sourceBlob"]==SOURCE
        assert anchors["physicalRoadCount"]==r["sourceB48"]==u["sourceB48"]==7
        assert anchors["originalB51"]==r["sourceB51"]==u["sourceB51"]==28
        assert r["Hz"]==u["Hz"]==prev["sourceHz"]==240
        assert r["errors"]==u["errors"]==prev["errors"]==[]
        assert len(prev["measurements"])==16
        assert prev["newGeometryModels"]==prev["newColliders"]==0
        assert prev["officialARTAccepted"]==prev["slope2DNARecognizedMetres"]==0
        out=Path(args.output);out.mkdir(parents=True,exist_ok=True)
        result={"schema":"dopagaki.k4w-true-camera-negative-space-inverse-design-constraints/1",
           "sourceBlob":SOURCE,"sourcePhysicsModified":False,
           "originalCamera":"ball-lock-unfiltered-heading","sourceHz":240,
           "sourceB48":7,"sourceB51":28,
           "upstreamSHA256":{k:sha(Path(getattr(args,k)).read_bytes()) for k in ("k","k4r","k4u","k4v")},
           "originalK4VCodeGitBlob":"1c6d2e232e71b225b9f2206c89beffe8f8ca2104",
           "modelFrozenK4R34Modules":True,"newGeometryModels":0,"newColliders":0,
           "perspective":"K2_APPROXIMATION_NOT_NATIVE_GPU_PROJECTION",
           "thresholdsAreHumanValidated":False,"sampledFramesNotContinuousVideo":True,
           "illustrativeHumanMarkerPx":list(TARGET_MARKER_PX),
           "illustrativeCourtVerticalPx":list(TARGET_COURT_PX),
           "fixedRoofGapLocalX":[-13,12],
           "maxIsotropicCourtScaleInFrozenRoofGap":MAX_INSET_SCALING,
           "siteChangesOnlyMathematical":True,
           "candidateSAT":"NOT_RUN","CCD":"NOT_RUN","walkability":"NOT_RUN",
           "HUMAN":"NOT_RUN","FPS":"NOT_RUN","ART":"HOLD",
           "officialARTAccepted":0,"slope2DNARecognizedMetres":0,
           "release":"HOLD","merge":"HOLD","results":[]}
        for mode in MODES:
            plotted=[]
            pairs=[]
            for tick in TICKS:
                sessions={}
                for tag,log in (("K4R",r),("K4U",u)):
                    o=next(s for s in log["sessions"] if s["mode"]==mode and s["variant"]=="original")
                    e=next(s for s in log["sessions"] if s["mode"]==mode and s["variant"]==tag.lower())
                    oo=next(s for s in o["samples"] if s["tick"]==tick)
                    ee=next(s for s in e["samples"] if s["tick"]==tick)
                    assert oo["state"]["tick"]==ee["state"]["tick"]==tick
                    for field in ("cameraEye","cameraFront","xyz"):
                        assert np.linalg.norm(np.asarray(oo["state"][field])-np.asarray(ee["state"][field]))<.002
                    assert abs(oo["state"]["speed"]-ee["state"]["speed"])<.001
                    assert ee["sha256"]==next(x["realCandidatePNGsha"] for x in prev["measurements"]
                                              if x["mode"]==mode and x["tick"]==tick and x["site"]==tag)
                    sessions[tag]=(oo,ee)
                assert sessions["K4R"][0]["sha256"]==sessions["K4U"][0]["sha256"]
                state=sessions["K4U"][0]["state"]
                fn=k4v.projector(state)
                entry={}
                for tag,param in (("K4R",.75),("K4U",.85)):
                    frame=k4v.site_frame(anchors,mode,param)
                    metric,_=k4v.court_measure(state,frame)
                    historical=next(x for x in prev["measurements"]
                                    if x["mode"]==mode and x["tick"]==tick and x["site"]==tag)
                    for field in ("projectedCourtVerticalExtentPx","onePointSevenMeterRulerHeightPx",
                                  "inFrameCourtApproxPixels","distanceAlongViewM"):
                        assert abs(metric[field]-historical[field])<=.001, (tag,mode,tick,field)
                    center=frame[0]+np.array([0,.86,0],dtype=np.float64)
                    ruler=rise_ruler(fn,center,1.7)
                    h=court_height(fn,frame,1)
                    assert abs(ruler-historical["onePointSevenMeterRulerHeightPx"])<.002
                    assert abs(h-historical["projectedCourtVerticalExtentPx"])<.002
                    marker={str(int(t)):find_height(fn,center,t) for t in TARGET_MARKER_PX}
                    court={str(int(t)):find_scale(fn,frame,t) for t in TARGET_COURT_PX}
                    assert all(v>0 for v in marker.values())
                    assert all(v>0 for v in court.values())
                    entry[tag]={"mode":mode,"tick":tick,"seconds":round(tick/240,5),
                        "site":tag,"oldMarketFrozen":True,
                        "courtVerticalPx":round(h,4),"ruler17Px":round(ruler,4),
                        "courtInFramePixels":historical["inFrameCourtApproxPixels"],
                        "eyeToCourtCenterViewDepthM":historical["distanceAlongViewM"],
                        "markerPhysicalHeightFor8pxM":marker["8"],
                        "markerPhysicalHeightFor12pxM":marker["12"],
                        "courtUniformScaleFor24px":court["24"],
                        "courtUniformScaleFor32px":court["32"],
                        "court24pxWithinUnchangedRoofGap":court["24"]<=MAX_INSET_SCALING,
                        "court32pxWithinUnchangedRoofGap":court["32"]<=MAX_INSET_SCALING,
                        "projectedCourtQuadPx":historical["cornersApproxPx"],
                        "actualNewModel":False,"humanReadabilityDetermined":False}
                    result["results"].append(entry[tag])
                # The comparison layout uses REAL original A5 / K4U PNG before
                # a separate offline overlay on the candidate copy.
                plotted.append(entry["K4U"])
                pairs.append((png(uz,sessions["K4U"][0]),png(uz,sessions["K4U"][1])))
            render_sheet(plotted,pairs,out/f"K4W_{mode}_SOURCE_WEBGL2_CAMERA_INVERSE_CONSTRAINTS.png",mode)
        assert len(result["results"])==16
        # Rejection is based on actual K4V independent art evaluation;
        # numerical targets are illustrative, never acceptance criteria.
        assert all(x["site"]=="K4U" for x in plotted)
        for mode in MODES:
            m=[x for x in result["results"] if x["mode"]==mode and x["site"]=="K4U"]
            assert all(x["markerPhysicalHeightFor8pxM"]>1.7 for x in m)
            assert all(x["court24pxWithinUnchangedRoofGap"] is False for x in m)
        (out/"K4W_GENUINE_SOURCE_CAMERA_INVERSE_PUBLIC_VOID_CONSTRAINTS.json").write_text(
            json.dumps(result,indent=2,ensure_ascii=False)+"\n",encoding="utf8")
        print("K4W_TRUE_SOURCE_CAMERA_CONSTRAINTS_TECH_RESEARCH_LIMITED_PASS_ART_HOLD",
            json.dumps({"actualSourceCameraFramesVerified":8,
              "realCandidateImageShaMatchedK4V":8,"counterfactualMeasurements":16,
              "newModels":0,"court24pxWithinUnchangedRoofGapAllK4U":False,
              "K4U14m":[{k:row[k] for k in
               ("tick","ruler17Px","markerPhysicalHeightFor8pxM",
                "courtVerticalPx","courtUniformScaleFor24px")}
               for row in result["results"] if row["mode"]=="ultra" and row["site"]=="K4U"],
              "officialARTAccepted":0}))
if __name__=="__main__":
    parser=argparse.ArgumentParser()
    for arg in ("k","k4r","k4u","k4v","output","k4v-code"):
        parser.add_argument("--"+arg,required=True)
    run(parser.parse_args())

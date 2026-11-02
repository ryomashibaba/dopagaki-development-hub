"""K4V: audit why a 20mx28m TRUE ROOFLESS market court is unreadable at
native 240Hz source cameras. Source-authenticated images + frozen original
road-anchor geometry. Source screenshots are never edited, only review copies
get an explicit mathematical outline. No building model, no scene mutation.
"""
import argparse, hashlib, io, json, math, zipfile
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SOURCE="af076d67492a677d2235e4730aef8cdf4808e106"
WIDTH,HEIGHT=1013,698
TICKS=(265,721,1057,1249)
MODES=("ultra","control")
def digest(b): return hashlib.sha256(b).hexdigest()
def read(z,n): return json.loads(z.read(n).decode("utf8"))
def norm(v):
    x=np.asarray(v,dtype=np.float64); m=np.linalg.norm(x)
    assert m>1e-9
    return x/m
def site_frame(anchors,mode,u):
    stations=anchors["sourceModes"][mode]["roads"][0]["stations"]
    t=u*80; i=min(79,int(t));alpha=t-i
    def interp(key):
        return np.array(stations[i][key],dtype=np.float64)*(1-alpha)+np.array(stations[i+1][key],dtype=np.float64)*alpha
    center=interp("center"); edge=interp("right")
    along=interp("forward"); along[1]=0;along=norm(along)
    outward=edge-center; outward[1]=0
    outward-=np.dot(outward,along)*along; outward=norm(outward)
    assert abs(np.dot(along,outward))<.02
    return edge+70*outward,along,outward
def projector(state):
    eye=np.array(state["cameraEye"],dtype=np.float64)
    forward=norm(state["cameraFront"])
    right=norm(np.cross(forward,[0,1,0]))
    up=norm(np.cross(right,forward))
    def fn(p):
        v=p-eye; depth=float(np.dot(v,forward))
        if depth<=.66:return None
        return (WIDTH*(1+1.35*np.dot(v,right)/(WIDTH/HEIGHT)/depth)/2,
                HEIGHT*(1-1.35*np.dot(v,up)/depth)/2,depth)
    return fn
def area(pts):
    a=np.array(pts,dtype=float)
    return .5*abs(float(np.dot(a[:,0],np.roll(a[:,1],-1))-np.dot(a[:,1],np.roll(a[:,0],-1))))
def court_measure(state,frame):
    origin,along,outward=frame
    def point(x,y,height):
        return origin+along*x+outward*y+np.array([0,height,0])
    fn=projector(state)
    # All geometry is from the FROZEN 34-module K4R source:
    # actual roofless-center-visible-ground top z=.85;
    # floor is not a collision surface, has x[-11,11], y[-15,15].
    # Use 1m inset to avoid including the boundary shell/decks.
    corners=[point(-10,-14,.86),point(10,-14,.86),
             point(10,14,.86),point(-10,14,.86)]
    views=[fn(p) for p in corners]
    assert all(p is not None for p in views)
    coords=[(float(v[0]),float(v[1])) for v in views]
    bbox=[min(p[0] for p in coords),min(p[1] for p in coords),
          max(p[0] for p in coords),max(p[1] for p in coords)]
    mask=Image.new("L",(WIDTH,HEIGHT),0)
    ImageDraw.Draw(mask).polygon(coords,fill=255)
    pixel_count=int((np.asarray(mask)>0).sum())
    center=fn(point(0,0,.86))
    ruler_top=fn(point(0,0,2.56)) # hypothetical 1.70m standing-height ruler, NOT a person/model
    assert center and ruler_top
    return {"cornersApproxPx":[[round(v,3) for v in p] for p in coords],
      "projectedCourtQuadAreaPx2":round(area(coords),3),
      "inFrameCourtApproxPixels":pixel_count,
      "projectedCourtBBoxPx":[round(x,3) for x in bbox],
      "projectedCourtVerticalExtentPx":round(bbox[3]-bbox[1],3),
      "onePointSevenMeterRulerHeightPx":round(math.dist(center[:2],ruler_top[:2]),3),
      "distanceAlongViewM":round(center[2],3)},mask
def png_verified(z,session,tick):
    image=next(s for s in session["samples"] if s["tick"]==tick)
    data=z.read(image["png"])
    assert len(data)==image["bytes"] and digest(data)==image["sha256"]
    pic=Image.open(io.BytesIO(data)).convert("RGB")
    assert pic.size==(WIDTH,HEIGHT)
    return image,pic
def annotate(img,polygon,variant,site,tick,mode,measurement):
    out=img.copy()
    dr=ImageDraw.Draw(out)
    pts=[tuple(p) for p in polygon]
    dr.line(pts+[pts[0]],fill=(255,230,85),width=3)
    top=f"{variant} | {mode} | tick {tick} | {site}"
    dr.rectangle((0,0,WIDTH-1,61),fill=(15,18,28))
    dr.text((12,7),top,fill=(255,255,255))
    dr.text((12,26),f"Proxy center court {measurement['inFrameCourtApproxPixels']} px, "
        f"1.7m ruler {measurement['onePointSevenMeterRulerHeightPx']} px",fill=(255,230,85))
    dr.text((12,44),"YELLOW = approximate geometry projection; NOT game-rendered annotation",fill=(255,238,175))
    return out
def main():
    ap=argparse.ArgumentParser()
    for n in ("kzip","k4rzip","k4uzip","out"):ap.add_argument("--"+n,required=True)
    args=ap.parse_args()
    out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
    rawzip={name:Path(getattr(args,name)).read_bytes() for name in ("kzip","k4rzip","k4uzip")}
    proof={"schema":"dopagaki.k4v-genuine-webgl2-source-architectural-court-readability/1",
      "sourceBlob":SOURCE,"sourceHz":240,"sourceB48":7,"sourceB51":28,
      "camera":"ball-lock-unfiltered-heading","realK4RCandidate":True,
      "realK4UCandidate":True,"roadWidthModes":list(MODES),
      "sourceZIPsha256":{x:digest(b) for x,b in rawzip.items()},
      "cameraProjection":"K2_APPROXIMATE_1013x698_FOCAL_1.35_NOT_REAL_GPU_MATRIX",
      "modelledGeometry":"FROZEN_K4R_ROOFLESS_COURT_FLOOR_LOCAL_X[-10,10]_Y[-14,14]_TOP_0.86M",
      "ruler":"MATHEMATICAL_1.70M_SCREEN_SIZE_NOT_A_RENDERED_PERSON",
      "newGeometryModels":0,"newColliders":0,"modifiedSourcePhysics":False,
      "candidateClearanceSAT":"NOT_RUN","dynamicHazardCCD":"NOT_RUN",
      "humanWalkability":"NOT_TESTED","actualSemanticComprehension":"HUMAN_ART_REJECT_FROM_K4R_K4U",
      "release":"HOLD","merge":"HOLD","officialARTAccepted":0,
      "slope2DNARecognizedMetres":0,"measurements":[],"errors":[]}
    with zipfile.ZipFile(io.BytesIO(rawzip["kzip"])) as kz,zipfile.ZipFile(io.BytesIO(rawzip["k4rzip"])) as rz,zipfile.ZipFile(io.BytesIO(rawzip["k4uzip"])) as uz:
        assert kz.testzip() is None and rz.testzip() is None and uz.testzip() is None
        anchors=read(kz,"R2F5K_ALL7_FROZEN_SOURCE_ROAD_ANCHORS.json")
        reports={"K4R":read(rz,"K4R_REAL_ORIGINAL_WEBGL2_16_IMAGES.json"),
                 "K4U":read(uz,"K4U_REAL_ORIGINAL_WEBGL2_16_IMAGES.json")}
        for d in reports.values():
            assert d["sourceBlob"]==SOURCE and d["Hz"]==240
            assert d["sourceB48"]==7 and d["sourceB51"]==28
            assert d["errors"]==[] and d["addedColliders"]==0
            assert len(d["sessions"])==4
        assert anchors["originalGameBlob"]==SOURCE and anchors["physicalRoadCount"]==7
        for mode in MODES:
            native={}
            for name,z in (("K4R",rz),("K4U",uz)):
                native[name]={
                    "original":next(s for s in reports[name]["sessions"] if s["mode"]==mode and s["variant"]=="original"),
                    "edited":next(s for s in reports[name]["sessions"] if s["mode"]==mode and s["variant"]==name.lower())}
                br=read(z,f"P4R2F5{name}_{mode}_blender_report.json")
                assert br["originalSourceBlob"]==SOURCE
                assert br["added_faces"]==668 and br["editable_districts"]==5
                assert br["new_colliders"]==0
                assert br[name.lower()+"SingleCandidate"]["meshModules"]==34
                glbname=f"P4R2F5{name}_{mode}_edited.glb"
                assert digest(z.read(glbname))==br["edited_glb_sha256"]
            assert native["K4R"]["edited"]["info"]["triangles"]==11902
            assert native["K4U"]["edited"]["info"]["triangles"]==11902
            frames={"K4R":site_frame(anchors,mode,.75),
                    "K4U":site_frame(anchors,mode,.85)}
            for tick in TICKS:
                images={};samples={}
                for name,z in (("K4R",rz),("K4U",uz)):
                    o,pic=png_verified(z,native[name]["original"],tick)
                    e,edited=png_verified(z,native[name]["edited"],tick)
                    images[name]=(pic,edited)
                    samples[name]=(o,e)
                    assert o["state"]["tick"]==e["state"]["tick"]==tick
                    for field in ("xyz","cameraEye","cameraFront"):
                        assert np.linalg.norm(np.array(o["state"][field])-np.array(e["state"][field]))<.002
                    assert abs(o["state"]["speed"]-e["state"]["speed"])<.001
                # Same authentic A5 background across all site relocations.
                assert samples["K4R"][0]["sha256"]==samples["K4U"][0]["sha256"]
                for field in ("xyz","cameraEye","cameraFront"):
                    assert np.linalg.norm(np.array(samples["K4R"][0]["state"][field])-np.array(samples["K4U"][0]["state"][field]))<.002
                st=samples["K4R"][0]["state"]
                canvas=Image.new("RGB",(WIDTH*3,HEIGHT))
                canvas.paste(images["K4R"][0],(0,0))
                metrics={}
                for ix,name in enumerate(("K4R","K4U"),1):
                    data,mask=court_measure(st,frames[name])
                    before=np.asarray(images[name][0],dtype=np.int16)
                    after=np.asarray(images[name][1],dtype=np.int16)
                    diff=np.max(np.abs(before-after),axis=2)>36
                    rm=np.asarray(mask)>0
                    changed=int(diff.sum());inside=int(np.count_nonzero(diff&rm))
                    data.update({"mode":mode,"tick":tick,"seconds":round(tick/240,5),
                      "site":name,"realOriginalA5PNGsha":samples[name][0]["sha256"],
                      "realCandidatePNGsha":samples[name][1]["sha256"],
                      "screenChangedPixelsThreshold36":changed,
                      "screenChangedFractionPercent":round(changed/(WIDTH*HEIGHT)*100,4),
                      "approxCourtInsideChangedPixels":inside,
                      "approxCourtInsideChangedFraction":round(inside/max(1,rm.sum()),4),
                      "approxCourtChangeShareOfAllChanges":round(inside/max(1,changed),4),
                      "noWalkabilityOrHumanProof":True})
                    proof["measurements"].append(data)
                    metrics[name]=data
                    canvas.paste(annotate(images[name][1],data["cornersApproxPx"],name,
                            f'u={".75" if name=="K4R" else ".85"}',tick,mode,data),
                            (WIDTH*ix,0))
                canvas.save(out/f"K4V_{mode}_{tick}_ORIGINAL_K4R_K4U_REAL_WEBGL2_COURT_EXPLAINED.png",optimize=True)
                # Assert old and new image are genuine full-frame candidates, not overlays.
                assert images["K4R"][1].tobytes()!=images["K4U"][1].tobytes()
                assert metrics["K4R"]["projectedCourtQuadAreaPx2"]>0
                assert metrics["K4U"]["projectedCourtQuadAreaPx2"]>0
    assert len(proof["measurements"])==16
    # An isometric plan could be roofless, but the actual source chase camera
    # projects the floor into a slender strip. Validate the failure mechanism.
    for mode in MODES:
        early=[x for x in proof["measurements"] if x["mode"]==mode and x["site"]=="K4U"]
        assert len(early)==4
        assert all(x["projectedCourtVerticalExtentPx"]<25 for x in early)
        assert all(x["onePointSevenMeterRulerHeightPx"]<8 for x in early)
    (out/"K4V_REAL_CAMERA_COURT_READABILITY_GEOMETRY_AND_PIXELS.json").write_text(
        json.dumps(proof,indent=2,ensure_ascii=False)+"\n",encoding="utf8")
    print("K4V_REAL_K4R_K4U_SOURCE_CAMERA_NEGATIVE_SPACE_DIAGNOSTIC_LIMITED_PASS",json.dumps({
      "realSourceImagesVerified":24,"candidateComparisons":8,
      "courtMeasurements":16,"newModels":0,"officialARTAccepted":0,
      "firstResults":[{"mode":x["mode"],"tick":x["tick"],"site":x["site"],
          "visibleCourtApproxPixels":x["inFrameCourtApproxPixels"],
          "verticalPx":x["projectedCourtVerticalExtentPx"],
          "humanRulerPx":x["onePointSevenMeterRulerHeightPx"]}
        for x in proof["measurements"] if x["mode"]=="ultra"]}))
if __name__=="__main__":main()

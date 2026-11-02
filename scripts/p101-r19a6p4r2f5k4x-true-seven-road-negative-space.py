"""K4X: genuine original K/K3B camera composition research on ALL SEVEN roads.
Two different capture protocols; never splice them into one continuous run.
Analytic side-space envelopes are NEVER building proposals or game rendering.
Source PNGs are unmodified; annotations are offline mathematical overlays.
"""
import argparse,hashlib,io,json,math,zipfile
from collections import Counter
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import numpy as np
SOURCE="af076d67492a677d2235e4730aef8cdf4808e106"
W,H=1013,698
US=(.25,.50,.75); SIDES=("left","right")
def sha(x):return hashlib.sha256(x).hexdigest()
def mag(v):return float(np.linalg.norm(v))
def unit(v):
    a=np.asarray(v,dtype=float);n=mag(a);assert n>1e-9
    return a/n
def loading(p):
    b=Path(p).read_bytes();z=zipfile.ZipFile(io.BytesIO(b))
    assert z.testzip() is None
    return z,sha(b)
def jsonread(z,n):return json.loads(z.read(n).decode())
def picture(z,record):
    data=z.read(record["file"]);assert len(data)==record["bytes"] and sha(data)==record["sha256"]
    x=Image.open(io.BytesIO(data)).convert("RGB");assert x.size==(W,H)
    return x
def perspective(state):
    eye=np.asarray(state["cameraEye"],float)
    fwd=unit(state["cameraFront"])
    side=unit(np.cross(fwd,[0.,1.,0.]))
    up=unit(np.cross(side,fwd))
    def project(p):
        v=p-eye;d=float(np.dot(v,fwd))
        if d<.66:return None
        return ((1.+1.35*float(np.dot(v,side))/(W/H)/d)*W*.5,
                (1.-1.35*float(np.dot(v,up))/d)*H*.5,d)
    return project
def roadframe(roads,ix,u,side):
    a=roads[ix]["stations"];t=u*80;i=min(79,int(t));k=t-i
    def lerp(key):
        return (1-k)*np.asarray(a[i][key],float)+k*np.asarray(a[i+1][key],float)
    edge=lerp(side);center=lerp("center");fwd=lerp("forward")
    fwd[1]=0;fwd=unit(fwd)
    away=edge-center;away[1]=0
    away=unit(away-np.dot(away,fwd)*fwd)
    assert abs(np.dot(away,fwd))<.02
    return edge+70.*away,fwd,away
def clip(poly,axis,bound,greater):
    if not poly:return []
    def signed(p):return ((p[axis]-bound) if greater else (bound-p[axis]))
    out=[];last=poly[-1];dp=signed(last)
    for p in poly:
        dq=signed(p)
        if (dp>=0)!=(dq>=0):
            t=dp/(dp-dq);out.append((last[0]+t*(p[0]-last[0]),last[1]+t*(p[1]-last[1])))
        if dq>=0:out.append(p)
        last=p;dp=dq
    return out
def area(poly):
    if len(poly)<3:return 0.
    return abs(sum(poly[i][0]*poly[(i+1)%len(poly)][1]-poly[(i+1)%len(poly)][0]*poly[i][1] for i in range(len(poly)))*.5)
def screenpoly(poly):
    result=list(poly)
    for axis,bound,g in ((0,0,True),(0,W,False),(1,0,True),(1,H,False)):
        result=clip(result,axis,bound,g)
    return result
def study(state,frame):
    origin,along,outward=frame
    def world(x,y,h):return origin+along*x+outward*y+np.array([0,h,0])
    fn=perspective(state)
    # Only a notional "open court" 20m x 28m on a road-adjacent study site.
    # Not a walkable floor, not a new building, not terrain or a model.
    pts=[fn(world(x,y,.86)) for x,y in ((-10,-14),(10,-14),(10,14),(-10,14))]
    marker=fn(world(0,0,.86));ruler=fn(world(0,0,2.56))
    front=fn(world(0,-14,.86));rear=fn(world(0,14,.86))
    high=fn(world(0,14,20.86))
    if any(x is None for x in pts+[marker,ruler,front,rear,high]):
        return {"projectable":False,"onScreenCourtAreaPx2":None,"unknownReason":"A CORNER OR 3D PROBE IS BEHIND CAMERA","courtPolygonPx":None}
    poly=[(v[0],v[1]) for v in pts]
    clipped=screenpoly(poly)
    full=area(poly);inside=area(clipped)
    bx=(min(q[0] for q in poly),min(q[1] for q in poly),max(q[0] for q in poly),max(q[1] for q in poly))
    return {"projectable":True,"screenCourtTotalAreaPx2":round(full,4),
       "onScreenCourtAreaPx2":round(inside,4),
       "clippedFractionOfProjection":round(inside/max(full,1e-9),5),
       "courtPolygonPx":[[round(y,3) for y in x] for x in poly],
       "centerInFrame":bool(0<=marker[0]<W and 0<=marker[1]<H),
       "screenBBoxPx":[round(x,3) for x in bx],
       "courtVerticalProjectedPx":round(bx[3]-bx[1],4),
       "notionalHuman17mProjectedPx":round(math.dist(marker[:2],ruler[:2]),4),
       "depthSeparationFrontRearProjectedPx":round(math.dist(front[:2],rear[:2]),4),
       "notionalBackAperture20mHeightPx":round(math.dist(rear[:2],high[:2]),4),
       "eyeToSiteCenterViewDepthM":round(marker[2],3)}
def fonts(n):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
              '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf'):
        if Path(p).exists():return ImageFont.truetype(p,n)
    return ImageFont.load_default()
def storyboard(cards,mode,path):
    w,h=1500,350;sheet=Image.new("RGB",(w,len(cards)*h),(242,243,245))
    f=fonts(19);small=fonts(15);title=fonts(22)
    for ri,card in enumerate(cards):
        bg=card["image"].copy();draw=ImageDraw.Draw(bg)
        for name,col in (("right",(255,206,50)),("left",(57,237,234))):
            metric=card[name]
            if metric["projectable"]:
                points=[tuple(x) for x in metric["courtPolygonPx"]]
                draw.line(points+[points[0]],fill=col,width=4)
        draw.rectangle((0,0,1012,54),fill=(13,19,28))
        draw.text((12,6),f"ORIGINAL WebGL2 {mode.upper()} Road {card['road']} tick {card['tick']}",fill="white",font=title)
        draw.text((12,33),"Yellow=RIGHT  Cyan=LEFT  u=.50 +70m  MATH ONLY",fill=(252,228,151),font=small)
        sheet.paste(bg.resize((507,349),Image.Resampling.LANCZOS),(0,ri*h))
        d=ImageDraw.Draw(sheet)
        x,y=521,ri*h
        d.text((x,y+12),f"Road {card['road']}: {card['roadId']}",font=title,fill=(20,28,38))
        d.text((x,y+51),f"Authentic {card['family']} run / tick {card['tick']} ({card['tick']/240:.2f}s)",font=f,fill=(40,51,60))
        for index,name in enumerate(("right","left")):
            m=card[name]
            color=(142,108,0) if name=="right" else (0,111,121)
            d.text((x,y+92+index*70),f"{name.upper()} u=.50 side+70m  NON-BUILT envelope",font=f,fill=color)
            label=(f"Clip area {m['onScreenCourtAreaPx2']:.1f}px2; "+f"depth cue {m['depthSeparationFrontRearProjectedPx']:.1f}px; "
               +f"ruler {m['notionalHuman17mProjectedPx']:.1f}px") if m["projectable"] else "Behind-camera: projection UNKNOWN"
            d.text((x,y+116+index*70),label,font=small,fill=(39,43,49))
        d.text((x,y+260),"Not visibility: original city, hazards and road may occlude ALL markers.",font=small,fill=(145,43,34))
        d.text((x,y+294),"Snapshots are different recorded protocols, not one continuous run.",font=small,fill=(145,43,34))
        d.line((0,(ri+1)*h-1,w,(ri+1)*h-1),fill=(190,194,198),width=2)
    sheet.save(path,optimize=True)
def main():
    p=argparse.ArgumentParser()
    for n in ("kzip","k3bzip","output"):p.add_argument("--"+n,required=True)
    args=p.parse_args();out=Path(args.output);out.mkdir(parents=True,exist_ok=True)
    kz,ksha=loading(args.kzip);bz,bsha=loading(args.k3bzip)
    with kz,bz:
        k=jsonread(kz,"R2F5K_REAL_ORIGINAL_EXTENDED_CAMERA_COVERAGE.json")
        b=jsonread(bz,"R2F5K3B_REAL_SEVEN_ROAD_WEBGL2_CAMERA.json")
        a=jsonread(kz,"R2F5K_ALL7_FROZEN_SOURCE_ROAD_ANCHORS.json")
        assert k["sourceBlob"]==b["sourceBlob"]==a["originalGameBlob"]==SOURCE
        assert k["roadCount"]==b["sourceB48"]==a["physicalRoadCount"]==7
        assert k["B51"]==b["sourceB51"]==a["originalB51"]==28
        assert k["Hz"]==b["sourceHz"]==240 and k["errors"]==b["errors"]==[]
        assert b["actualWebGL2"] and b["allSourceRoadsCameraTarget"]
        assert b["geometryChanged"] is False and b["collisionChanged"] is False
        assert k["sourceOriginalCamera"]=="ball-lock-unfiltered-heading"
        assert b["originalCamera"]=="ball-lock-unfiltered-heading"
        src={"K":kz,"K3B":bz}
        audit={"schema":"dopagaki.k4x-source-seven-road-original-camera-composition/1",
          "sourceBlob":SOURCE,"sourceHz":240,"sourceB48":7,"sourceB51":28,
          "originalCamera":"ball-lock-unfiltered-heading",
          "KoriginalZipSHA256":ksha,"K3BoriginalZipSHA256":bsha,
          "actualWebGL2AllOriginalPNGVerified":0,
          "overlappingCaptureFrameSHAAgreements":0,
          "independentCaptureProtocols":["K_EARLY_BEFORE_TICK_7680",
                                          "K3B_LATE_FROM_TICK_7680"],
          "notAContinuousSingleRun":True,"noRoadAssignmentsInferredFromAIR":True,
          "notionalCourtMeters":[20,28],
          "roadSideOffsetM":70,"notionalDepthApertureHeightM":20,
          "notionalPersonHeightM":1.7,
          "cameraProjection":"K2_APPROXIMATION_NOT_ORIGINAL_GPU_MATRIX",
          "realCityAndB48B51OcclusionTested":False,
          "humanComprehensionTested":False,"thresholdsAreValidated":False,
          "noBuildingDesignedOrRendered":True,
          "newGeometryModels":0,"newColliders":0,
          "sourcePhysicsUnmodified":True,"ART":"HOLD",
          "officialARTAccepted":0,"slope2DNARecognizedMetres":0,
          "HUMAN":"NOT_RUN","SAT":"NOT_RUN","CCD":"NOT_RUN",
          "FPS":"NOT_RUN","RELEASE":"HOLD","MERGE":"HOLD",
          "captureSourceByModeAndRoad":{},"measurements":[],"roadDiagnostics":[]}
        combined={m:[] for m in ("ultra","control")}
        for mode in ("ultra","control"):
            ks=next(x for x in k["sessions"] if x["mode"]==mode)
            bs=next(x for x in b["sessions"] if x["mode"]==mode)
            kr={r["tick"]:r for r in ks["observed"]}
            br={r["tick"]:r for r in bs["shots"]}
            assert len(kr)==15 and len(br)==14
            for tick in sorted(set(kr)&set(br)):
                assert kr[tick]["sha256"]==br[tick]["sha256"]
                assert kr[tick]["state"]["road"]==br[tick]["state"]["road"]
                audit["overlappingCaptureFrameSHAAgreements"]+=1
            for name,records in (("K",kr),("K3B",br)):
                for record in records.values():
                    picture(src[name],record)
                    audit["actualWebGL2AllOriginalPNGVerified"]+=1
            early=[dict(x,origin="K") for t,x in sorted(kr.items()) if t<7680]
            late=[dict(x,origin="K3B") for t,x in sorted(br.items()) if t>=7680]
            assert len(early)==13 and len(late)==8
            assert len(early+late)==21
            combined[mode]=early+late
            names=[r["id"] for r in a["sourceModes"][mode]["roads"]]
            assert len(names)==len(set(names))==7
            roadcounts=Counter(x["state"]["road"] for x in combined[mode])
            assert all(roadcounts[name]>0 for name in names),roadcounts
            audit["captureSourceByModeAndRoad"][mode]={
                "K_early_count":len(early),"K3B_late_count":len(late),
                "perRoad":{n:roadcounts[n] for n in names},
                "K3B_covers_roads_3_to_6":True,
                "skippedAIR":sum(x["state"]["road"]=="AIR" for x in combined[mode])}
        # 42 separate frozen source viewpoints x 42 unbuilt sites = 1764 rows.
        for mode in ("ultra","control"):
            roads=a["sourceModes"][mode]["roads"]
            for s in combined[mode]:
                for ix in range(7):
                    for u in US:
                        for side in SIDES:
                            entry={"mode":mode,"captureFamily":s["origin"],
                              "captureTick":s["tick"],"sourceRoad":s["state"]["road"],
                              "sourceImageSHA256":s["sha256"],"siteRoad":roads[ix]["id"],
                              "siteRoadIndex":ix,"siteU":u,"siteSide":side,"siteOffsetM":70}
                            entry.update(study(s["state"],roadframe(roads,ix,u,side)))
                            audit["measurements"].append(entry)
            cards=[]
            for ix,road in enumerate(roads):
                record=[s for s in combined[mode] if s["state"]["road"]==road["id"]]
                record.sort(key=lambda s:s["tick"])
                s=record[len(record)//2] # fixed median, NOT cherry-picked by visibility
                card={"road":ix,"roadId":road["id"],"tick":s["tick"],"family":s["origin"],
                  "image":picture(src[s["origin"]],s)}
                for side in SIDES:card[side]=study(s["state"],roadframe(roads,ix,.5,side))
                cards.append(card)
            assert len(cards)==7
            storyboard(cards,mode,out/f"K4X_{mode}_SEVEN_TRUE_ORIGINAL_WEBGL2_CAMERAS_UNBUILT_SPACE_STUDY.png")
            for card in cards:
                audit["roadDiagnostics"].append({
                  "mode":mode,"roadIndex":card["road"],"roadId":card["roadId"],
                  "sourceFamily":card["family"],"medianSourceTick":card["tick"],
                  "rightStudy":card["right"],"leftStudy":card["left"]})
        assert len(audit["measurements"])==42*42
        assert len(audit["roadDiagnostics"])==14
        assert audit["actualWebGL2AllOriginalPNGVerified"]==58
        assert audit["overlappingCaptureFrameSHAAgreements"]==12
        assert all(len(x["perRoad"])==7 for x in audit["captureSourceByModeAndRoad"].values())
        visible=sum(x["onScreenCourtAreaPx2"] is not None and x["onScreenCourtAreaPx2"]>0 for x in audit["measurements"])
        audit["projectableAndOnscreenMathOnlyCount"]=visible
        audit["observedTrueRoadsInEachMode"]=7
        audit["designConclusion"]="NO_SITE_APPROVAL_SCREEN_PROXIES_ONLY"
        (out/"K4X_SEVEN_ROAD_TRUE_SOURCE_CAMERAS_UNBUILT_NEGATIVE_SPACE.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
        print("K4X_7ROAD_REAL_WEBGL2_CAMERA_COMPOSITION_RESEARCH_TECH_ONLY_PASS",
           json.dumps({"realOriginalPNGsShaVerified":58,
                        "frozenCameraRecords":42,
                        "distinctSiteProbes":42,
                        "viewSiteRows":len(audit["measurements"]),
                        "roadSourceSnapshots":len(audit["roadDiagnostics"]),
                        "overlappingFrameAgreements":12,
                        "mathematicalVisibleProbes":visible,
                        "officialArtAccepted":0,"newModels":0}))
if __name__=="__main__":main()

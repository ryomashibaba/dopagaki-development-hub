"""R15K2: original R1 Blender images + true CX patch samples + B51 center cues.

This is a 2D original-camera inspection overlay, NOT a new Blender scene,
art, collider, actual B51 future occlusion or human 2-second warning proof.
Two distinct CX source surface polygons are represented once each (840sqm
and 216sqm); duplicated 216sqm landings are not counted as separate parks.
"""
import os,json,argparse,math
from PIL import Image,ImageDraw,ImageFont
P=argparse.ArgumentParser()
for key in ("r15k","original","out"):P.add_argument("--"+key,required=True)
args=P.parse_args();os.makedirs(args.out,exist_ok=True)
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch")
d=json.load(open(args.r15k,encoding="utf8"))
assert d["originalSourceCXBlob"]==SRC
assert d["actualDistinctOriginalCXLandingCoordinates"]==4
assert len(d["rankedActualOriginalCXSourceSurfaceVisibilityPreflight"])==4
assert d["officialArt"]==d["newGameColliders"]==0
TIMES=tuple("t"+str(k) for k in range(1100,1701,50))
SITE=[
 ("CX02_840m2","02 roadbank-promenade None"),
 ("CX04_216m2","04 roadbank-promenade None")
]
def selected(obs,source):
 matches=[x for x in obs.values() if x["originalCXSourceName"]==source]
 assert matches,source
 if len(matches)>1:
  a=matches[0]["realOriginalCXSourceCameraViews"]
  for x in matches[1:]:
   # SAME source patch viewed from identical world: duplicated landings
   # should never be multiplied for visual occupancy.
   assert x["realOriginalCXSourceCameraViews"]==a
 return matches[0]
def pixel(uv,w,h):return (round(uv[0]*w),round((1-uv[1])*h))
audits=[]
for road in ROADS:
 record=d["originalSourceEvidenceByRoad"][road]
 hazard={x["frame"]:x["baselineOriginalB51CentersVisible"] for x in record["originalB51BaselineCenterProjectionByCameraFrame"]}
 for label,source in SITE:
  site=selected(record["realOriginalSourceCXSiteObservations"],source)
  frames={x["frame"]:x for x in site["realOriginalCXSourceCameraViews"]}
  assert set(frames)==set(TIMES)
  panels=[];diagnostics=[]
  for time in TIMES:
   base=os.path.join(args.original,"result-"+road,
                  "R1_"+road+"_"+time+"_TRUE_BLENDER_SOURCE_NOT_WEBGL.png")
   image=Image.open(base).convert("RGB")
   w,h=image.size
   assert (w,h)==(1008,645)
   drawImage=image.copy();draw=ImageDraw.Draw(drawImage)
   site_points=frames[time]["normalizedVisibleSampleScreenCoordinates"]
   cues=hazard[time]
   # Explicitly conservative center-distance marker, not a 3D obstacle
   # bounding box. Size 48px is an annotated REVIEW radius, never human
   # reaction/visibility certified.
   danger=[]
   mind=None
   for cue in cues:
    px,py=pixel(cue["sourceCameraUV"],w,h)
    draw.ellipse((px-11,py-11,px+11,py+11),outline=(68,220,255),width=2)
    draw.line((px-5,py,px+5,py),fill=(68,220,255),width=1)
    draw.line((px,py-5,px,py+5),fill=(68,220,255),width=1)
    if site_points:
     dist=min(math.hypot(px-qx,py-qy) for qx,qy in (pixel(q,w,h) for q in site_points))
     if mind is None or dist<mind:mind=dist
     if dist<=48:danger.append({"originalB51Id":cue["id"],"minimumScreenPixelDistance":round(dist,3)})
   for point in site_points:
    px,py=pixel(point,w,h)
    draw.ellipse((px-5,py-5,px+5,py+5),fill=(255,204,68),outline=(22,20,12),width=1)
   original_frame_sha=None
   out_name="R15K2_"+label+"_"+road+"_"+time+"_ORIGINAL_R1_SOURCE_ANNOTATED.jpg"
   top=Image.new("RGB",(w,34),(17,23,31))
   title=ImageDraw.Draw(top)
   title.text((10,9),f"{road}  {label}  {time}  |  ORIGINAL R1 CAMERA / NOT WEBGL",fill=(242,245,247))
   composite=Image.new("RGB",(w,h+34),(20,22,25))
   composite.paste(top,(0,0));composite.paste(drawImage,(0,34))
   composite.save(os.path.join(args.out,out_name),quality=90)
   # Same original imaging, image edits ONLY in the right column.
   original_half=image.resize((504,323));new_half=drawImage.resize((504,323))
   panel=Image.new("RGB",(1016,346),(19,23,28))
   dd=ImageDraw.Draw(panel)
   dd.text((7,3),"ORIGINAL R1 "+time,fill=(223,227,232))
   dd.text((513,3),"ORIGINAL + yellow CX real face samples / cyan B51 cue centers",fill=(223,227,232))
   panel.paste(original_half,(4,20));panel.paste(new_half,(510,20))
   panels.append(panel)
   diagnostics.append({"frame":time,
      "cxOriginalRealFaceSamplesVisible":len(site_points),
      "originalB51CentersVisible":len(cues),
      "closestOriginalB51CenterToCXVisibleSamplePixels":round(mind,3) if mind is not None else None,
      "conservative48PixelNearOriginalB51CenterWarnings":sorted(danger,key=lambda z:z["originalB51Id"]),
      "actualNewBuildingHazardOcclusionMeasured":False,
      "annotatedOriginalSourceImage":out_name})
  sheet=Image.new("RGB",(1016,346*len(panels)),(19,23,28))
  for i,panel in enumerate(panels):sheet.paste(panel,(0,346*i))
  contact_name="R15K2_"+label+"_"+road+"_13_TRUE_SOURCE_R1_CAMERA_COMPARISON.jpg"
  sheet.save(os.path.join(args.out,contact_name),quality=88)
  audits.append({"road":road,"uniqueOriginalCXSourcePatch":source,"originalCXSourcePatchLabel":label,
    "actualSourceCameraFramesReviewed":len(TIMES),
    "realSourceRasterWidth":1008,"realSourceRasterHeight":645,
    "sourceComparisonsContactSheet":contact_name,
    "actualNewBuildingScreenOccupancyCertified":False,
    "actualB51HumanWarningOcclusionCertified":False,
    "originalR1CameraDiagnosticFrames":diagnostics})
report={"schema":"dopagaki.r15k2-real-source-r1-cx-face-b51-center-overlay/1",
 "sourceBlob":SRC,"originalR1CameraFrames":list(TIMES),
 "actualUniqueSourceCXSurfacePatchCount":2,
 "originalSourceDesignStudySurfaceNames":[x[1] for x in SITE],
 "independentSourceCameraComparisons":audits,
 "approach":"projected-source-CX-face-and-original-B51-center-only",
 "conservativeCenterProximityCircleRadiusPixels":48,
 "notHumanReactionTimeOrPhysicalHazardMask":True,
 "noNewGeometryOrOriginalGameSourceChanged":True,
 "newGameColliders":0,"officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD",
 "INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
with open(os.path.join(args.out,"R15K2_TRUE_ORIGINAL_R1_CX_B51_OVERLAY_AUDIT.json"),"w",encoding="utf8") as o:
 json.dump(report,o,indent=2,ensure_ascii=False)
print("R15K2_2_SOURCE_CX_PATCHES_ORIGINAL_B51_CUE_OVERLAY",
 [(x["road"],x["originalCXSourcePatchLabel"],
   sum(bool(z["conservative48PixelNearOriginalB51CenterWarnings"]) for z in x["originalR1CameraDiagnosticFrames"]),
   min((z["closestOriginalB51CenterToCXVisibleSamplePixels"]
    for z in x["originalR1CameraDiagnosticFrames"]
    if z["closestOriginalB51CenterToCXVisibleSamplePixels"] is not None),default=None))
  for x in audits],"NO ART / GAMEPLAY / HUMAN CERTIFICATION",flush=True)

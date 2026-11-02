"""R15I3 independent same-real-R1-camera image/art/source gate, no auto art pass."""
import os,sys,json,math,copy,statistics
from PIL import Image,ImageChops,ImageDraw
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
TARGET="B48 original physics p93-CROWN_REVERSAL-01:689:702"
TIMES=("t1100","t1200","t1300","t1400","t1500","t1600","t1700")
def validate(a):
 assert a["schema"]=="dopagaki.r15i3-real-road-to-cx-editable-civic-entry-source-prototype/1"
 assert a["originalSourceCXBlob"]==SRC
 assert a["road"] in ("true-pinch","pinch-switch")
 assert a["selectedTrueOriginalB48RoadRimId"]==TARGET
 assert a["originalSourceCXEndpointAndRoadSurfaceReverified"]
 assert a["originalSourceCX18B48_7B51_28Unchanged"]
 assert a["sourcePublicPathCenterlineSampleCount"]==33
 assert 0<=a["sourceCurvedPathMaximumCenterlineGrade"]<.09
 assert a["actualBlenderEditableMeshCount"]==6
 assert isinstance(a["newGeometryAllActualSourceCXB48IntersectionsUnwaived"],list)
 assert all(len(v)==4 and v[3]>0 for v in a["newGeometryAllActualSourceCXB48IntersectionsUnwaived"])
 assert len(a["exactSourceRoadLipXYZ"])==len(a["exactSourceCXPublicPromenadeContactXYZ"])==3
 assert a["officialArt"]==a["officialSlope2Meters"]==a["newGameColliders"]==0
 for key in ("sourceRoadGeometryEdited","sourceGameWebGLRendered","realPhysicalLoadAnalysis",
  "humanContinuousTraversabilityCertified","sourceFullB51FairnessAndAdvanceWarningsCertified",
  "humanVisualArtApproval"):
  assert a[key] is False,key
 assert all(a[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 f=a["originalSource13RealCameraFirstHit"]
 assert len(f)==13 and set(TIMES).issubset(set(f))
 for v in f.values():
  assert v["originalCameraRays"]==228 and 0<=v["newGeometryFirstHit"]<=228
  assert abs(v["newGeometrySourceCameraFraction"]-v["newGeometryFirstHit"]/228)<.00003
 assert len(a["sevenTrueOriginalCameraBlenderNotWebGLImages"])==7
 assert a["realEditablePrivateBlend"].endswith(".blend")
 return True
def fake(a,mutate):
 x=copy.deepcopy(a);mutate(x)
 try:validate(x)
 except (AssertionError,KeyError,TypeError,ValueError):return True
 raise AssertionError("FAKE_R15I3_CERTIFICATE_ACCEPTED")
def arg(k):
 assert k in sys.argv,k
 return sys.argv[sys.argv.index(k)+1]
data=json.load(open(arg("--audit"),encoding="utf8"))
validate(data)
road=data["road"]
orig=arg("--original");trial=arg("--trial");out=arg("--out")
os.makedirs(out,exist_ok=True)
contact=Image.new("RGB",(1040,len(TIMES)*326),(24,27,30))
draw=ImageDraw.Draw(contact)
diff={}
for i,t in enumerate(TIMES):
 a=Image.open(os.path.join(orig,"R1_"+road+"_"+t+"_TRUE_BLENDER_SOURCE_NOT_WEBGL.png")).convert("RGB")
 b=Image.open(os.path.join(trial,"R15I3_"+road+"_"+t+"_TRUE_R1_CAMERA_BLENDER_NOT_WEBGL.png")).convert("RGB")
 assert a.size==b.size and a.width>=800 and a.height>=500
 delta=ImageChops.difference(a,b)
 ratio=sum(max(px)>45 for px in delta.getdata())/(a.width*a.height)
 diff[t]=round(ratio,5)
 a.thumbnail((500,300));b.thumbnail((500,300))
 y=i*326
 draw.text((6,y+2),"Original R1 "+road+" "+t,fill=(232,232,232))
 draw.text((524,y+2),"R15I3 actual source 3D "+t,fill=(232,232,232))
 contact.paste(a,(6,y+24));contact.paste(b,(524,y+24))
name="R15I3_"+road+"_TRUE_R1_7_FRAME_VISUAL_COMPARISON.jpg"
contact.save(os.path.join(out,name),quality=90)
coverage=statistics.mean(data["originalSource13RealCameraFirstHit"][t]["newGeometrySourceCameraFraction"] for t in TIMES)
# Numerical visibility can NEVER promote a rejected art method to art pass.
# A single small roadside study is NOT the monumental integrated city.
verdict="ART_REJECT_TOO_LITTLE_SOURCE_CAMERA_IMPACT" if coverage<.08 else "ART_HOLD_HUMAN_VISUAL_REVIEW"
cases=[
 ("art",lambda a:a.__setitem__("officialArt",1)),
 ("webgl",lambda a:a.__setitem__("sourceGameWebGLRendered",True)),
 ("human",lambda a:a.__setitem__("humanContinuousTraversabilityCertified",True)),
 ("source",lambda a:a.__setitem__("sourceRoadGeometryEdited",True)),
 ("geometry",lambda a:a.__setitem__("actualBlenderEditableMeshCount",0)),
 ("grade",lambda a:a.__setitem__("sourceCurvedPathMaximumCenterlineGrade",.7)),
 ("load",lambda a:a.__setitem__("realPhysicalLoadAnalysis",True))]
for n,f in cases:assert fake(data,f),n
report={"schema":"dopagaki.r15i3-independent-actual-R1-source-civic-entry-image-review/1",
 "road":road,"originalSourceCXBlob":SRC,
 "recomputedOriginalSevenImageDifferenceAbove45":diff,
 "sourceCameraFirstHitMeanNewGeometryNotArtFraction":round(coverage,5),
 "sevenOriginalNativeR1SameCameraVisualComparison":name,
 "originalSourceTriangleIntersectionsUnwaived":data["newGeometryAllActualSourceCXB48IntersectionsUnwaived"],
 "numericalPreliminaryArtImpact":verdict,
 "realHumanVisualReviewCompleted":False,
 "noAutomaticGeometryOrLoadApproval":True,
 "negativeFraudTestsPassed":True,
 "gameWebGLActuallyRendered":False,"originalSourceChanged":False,
 "officialArt":0,"officialSlope2Meters":0,"newGameColliders":0,
 "ART":"REJECT" if verdict.startswith("ART_REJECT") else "HOLD",
 "GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD",
 "INTEGRATION":"HOLD","RELEASE":"HOLD","MERGE":"HOLD"}
with open(os.path.join(out,"R15I3_"+road+"_INDEPENDENT_IMAGE_ART_GATE.json"),"w",encoding="utf8") as f:json.dump(report,f,indent=2)
print("R15I3_INDEPENDENT_SOURCE_IMAGES",road,"new rays",coverage,
      "large RGB image diff",diff,"research art",verdict,
      "NO human support/human gameplay or release PASS",flush=True)

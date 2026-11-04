"""K4CA real 768x480 source-locked scene-region technical regression.

Checks exact SHA-verified K4BZ repaired CHASE and K4CA A2 true Blender
frame. Assert that:
  - K4BZ confirmed dark wedge remains absent at six distinct true pixels;
  - the original right harbor and road frame regions remain bit-identical;
  - the known left terrain pixels actually differ after new research art;
  - source Road5, cameras, nine original trees, lighting, native CC0 and
    ART HOLD are recorded in exact native audit.
No quality metric, fake game render, new model or gameplay assertion.
"""
from pathlib import Path
from PIL import Image
import hashlib,json

ROOT=Path(__file__).resolve().parents[1]
old=ROOT/"docs/research-evidence/k4bz/K4BZ_SAME_CHASE_SINGLE_RAYCAST_PROXY_HIDDEN_REAL_AB_NOT_GAME.png"
new=ROOT/"docs/research-evidence/k4ca/K4CA_SAME_CHASE_TWO_REAL_CC0_COASTAL_TREES_WEATHERED_HILLSIDE_NOT_GAME.png"
meta=ROOT/"docs/research-evidence/k4ca/K4CA_TRUE_NATIVE_SLOPE_CC0_CANOPY_AUDIT.json"

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()
assert old.is_file() and new.is_file() and meta.is_file()
assert sha(old)=="d82a367f49623a8ed2a75a4540ba8a6de07f976a51d49f4dbb20673243576df7"
assert sha(new)=="e864aa1cdcc7707370c47e0542580cd6963f8e2fb9deada8cf0a9752dd8f84d6"
j=json.loads(meta.read_text(encoding="utf-8"))
assert j["canonicalParentBlenderSHA256"]=="162a7baaf7594b36a134457bee817bd7dcf0ef1b3e581419d6561efa92e45382"
assert j["canonicalGameBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
assert j["trueOriginalRoad5VertexFaceFingerprint"]=="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
assert j["fixedOriginalSixSourceCameraPoses"] and j["fixedExperimentChase"]
assert j["fixedNineOriginalTreesTransforms"] and j["fixedSunAndAreaLights"]
assert not j["originalGameSourceEdited"] and not j["originalRoad5GeometryEdited"]
assert j["addedGameColliders"]==0
assert j["K4BZProvenBlackWedgeOverlayRemainsHidden"]
assert j["vendor"]=="https://polyhaven.com/a/island_tree_02"
assert j["vendorLicense"]=="CC0"
assert j["newCC0FullCollectionTreeInstances"]==len(j["plantings"])==2
assert j["A1ArtReview"]=="REJECT_WASHED_OUT_CHALKY_WHITE_SLOPE"
assert j["ART"]=="UNJUDGED_HOLD"
assert j["formalArtAccepted"]==j["formalSlope2DNAMetres"]==0
assert all(j[k]=="HOLD" for k in ("SAT","CCD","HUMAN","FPS","RELEASE","MERGE"))
assert j["files"][new.name]["sha256"]==sha(new)
assert j["files"][new.name]["bytes"]==new.stat().st_size
assert j["files"]["K4CA_COASTAL_SLOPE_PHOTO_CANOPY_EDITABLE_NATIVE_ART_HOLD.blend"]["sha256"]=="299f1972e3383a7fc0047409a0f58581da3884988749dff6842a80cdf49a3ffa"

def brightness(p):
    return sum(p)/3

with Image.open(old) as o, Image.open(new) as n:
    before=o.convert("RGB");after=n.convert("RGB")
assert before.size==after.size==(768,480)

# Exact proven dark wedge regression pixels, not a global benchmark.
pairs=[
 ((292,300),(317,300)),((280,330),(310,330)),
 ((267,360),(310,360)),((250,400),(295,400)),
 ((235,440),(280,440)),((225,470),(270,470))
]
contrasts=[]
for bad,ctrl in pairs:
    val=brightness(after.getpixel(ctrl))-brightness(after.getpixel(bad))
    assert abs(val)<=5,("the six-pixel known black wedge has returned",bad,val)
    assert after.getpixel(bad)==before.getpixel(bad),("proven clear asphalt road changed",bad)
    assert after.getpixel(ctrl)==before.getpixel(ctrl),("road control shifted",ctrl)
    contrasts.append(round(val,3))

# Controls deliberately scattered across actual route, horizon and
# harbor infrastructure; these exact real pixels must stay unchanged.
unchanged=[
 (550,250),(620,300),(660,330),(360,400),
 (350,250),(730,280),(350,340),(250,400)
]
assert all(before.getpixel(p)==after.getpixel(p) for p in unchanged)

# Visible source hill was actually modified; no opinion/quality inferred.
hill=[(20,280),(70,350),(65,400),(170,320),(150,240)]
delta=[round(brightness(after.getpixel(p))-brightness(before.getpixel(p)),3) for p in hill]
assert all(abs(x)>=5 for x in delta),("hill material did not reach true CHASE image",delta)

print(json.dumps({
    "status":"K4CA_TRUE_NATIVE_REGION_REGRESSION_TECH_PASS_ART_NOT_ACCEPTED",
    "blackWedgeKnownPixelContrasts":contrasts,
    "unmodifiedRoadHarborPixels":len(unchanged),
    "actuallyChangedCoastalSlopePixels":len(hill),
    "slopeBrightnessDeltaNotArtScore":delta,
    "genuineSourceLocked":True,
    "formalArt":"REJECT",
    "formalArtAccepted":0,
    "Slope2DNA_M":0,
},ensure_ascii=False,indent=2))

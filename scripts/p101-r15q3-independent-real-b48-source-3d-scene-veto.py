"""R15Q3 independent real Blender source mesh, GLB, PNG and native 240Hz trace audit.
No browser/HUMAN/ART approvals from 3/4 technical analysis cameras.
"""
import argparse,os,json,struct,copy
p=argparse.ArgumentParser()
p.add_argument("--dir",required=True)
a=p.parse_args()
root=a.dir
SRC="af076d67492a677d2235e4730aef8cdf4808e106"
read=lambda f:json.load(open(f,encoding="utf8"))
M=read(os.path.join(root,"R15Q3_SOURCE_EIGHT_REAL_MESH_SCENES_MANIFEST.json"))
A=read(os.path.join(root,"R15Q3_EIGHT_REAL_SOURCE_MESHES_EDITOR_3D_AND_TRAILS_QA.json"))
def verify(doc):
 assert doc["schema"]=="dopagaki.r15q3-eight-original-b48-editable-blend-glb-source-path-renders/1"
 assert doc["originalGameSourceBlob"]==SRC and M["originalGameSourceBlob"]==SRC
 assert doc["sourceTrulyOriginalNative240Hz"] is True
 assert doc["originalGameWebGL"] is False and doc["actualOriginalPlayerCamera"] is False
 assert doc["technicalComparisonCameraNotSourcePlayerCamera"] is True
 assert doc["actualBuiltGameWorldChanged"] is False and doc["newGameColliders"]==0
 assert doc["officialArt"]==doc["officialSlope2Meters"]==0
 assert all(doc[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","RELEASE"))
 assert len(M["pairedRoadAssets"])==len(doc["scenes"])==8
 assert set(doc["scenes"])==set(x["road"]+"|"+x["mode"] for x in M["pairedRoadAssets"])
 out={}
 for item in M["pairedRoadAssets"]:
  key=item["road"]+"|"+item["mode"]
  s=doc["scenes"][key]
  assert s["sourceActualRoadWorld"]==item["road"]
  assert s["sourceStudyMode"]==item["mode"]
  assert s["sourceOriginalPhysics240HzTrue"] is True
  assert s["twoRealOriginalB48SourceMeshes"]==2
  assert s["sampledNativePlayerPoints"]==item["realNativeSampledTrailPoints"]
  assert s["sampledNativePhysicallyGroundedPoints"]+s["sampledNativeAirPoints"]==s["sampledNativePlayerPoints"]
  assert s["sampledNativeTraceNotContinuousSupport"] is True
  assert s["analysisCameraOnlyNotNativeOriginal"] is True
  assert s["actualNativeSourceRealRoadCodeEdited"] is False
  assert s["newGameColliders"]==s["officialArt"]==s["officialSlope2Meters"]==0
  assert len(s["allActualNativeTriangulationSourceFaces"])==2
  assert s["allActualNativeTriangulationSourceFaces"]==[
   x["sourceOriginalTriangleCount"] for x in item["sourceOriginalRoadTriangleCounts"]]
  assert all(x>1000 for x in s["allActualNativeTriangulationSourceFaces"])
  f=os.path.join(root,s["outputRelative"])
  actual=read(os.path.join(root,item["relativeFolder"],"R15Q3_SOURCE_ROAD_AND_TRUE_240HZ_SAMPLE_TRAIL.json"))
  assert actual["sourceGameBlob"]==SRC
  assert actual["road"]==item["road"] and actual["mode"]==item["mode"]
  assert actual["sourcePhysicsHz"]==240 and actual["newGameColliders"]==0
  assert actual["originalCrownB16SourcePointsSHA256"]==item["B16CrownSourceHash"]
  assert actual["trueStudySCISSORSourcePointsSHA256"]==item["sourceModifiedScissorHash"]
  assert len(actual["actualOriginal240HzQuarterSecondSampledPlayerPositionAndSupport"])==s["sampledNativePlayerPoints"]
  assert sum(x["engineGrounded"] for x in actual["actualOriginal240HzQuarterSecondSampledPlayerPositionAndSupport"])==s["sampledNativePhysicallyGroundedPoints"]
  assert actual["actualOriginalGameWebGLRendered"] is False
  for name in ("BLEND","GLB","PNG"):
   assert not os.path.isabs(s[name])
   fn=os.path.join(f,s[name])
   assert os.path.getsize(fn)>12000
   with open(fn,"rb") as h:
    header=h.read(24)
   if name=="PNG":
    assert header[:8]==b"\x89PNG\r\n\x1a\n"
    assert int.from_bytes(header[16:20],"big")>=900
    assert int.from_bytes(header[20:24],"big")>=600
   if name=="GLB":
    assert header[:4]==b"glTF"
    assert struct.unpack_from("<I",header,4)[0]==2
    assert struct.unpack_from("<I",header,8)[0]==os.path.getsize(fn)
   if name=="BLEND":
    assert header[:7]==b"BLENDER"
  out[key]={"sourceCROWNAndSCISSORMeshes":2,
    "sourceNativeSampledGroundedPoints":s["sampledNativePhysicallyGroundedPoints"],
    "sourceNativeSampledAirPoints":s["sampledNativeAirPoints"],
    "realEditableBlenderFileVerified":True,
    "actualGLB2SourceMeshFileVerified":True,
    "realTechnicalAnalysisImageVerified":True,
    "notHumanOrActualOriginalGameCamera":True}
 return out
summary=verify(A)
def fake(name,edit):
 d=copy.deepcopy(A);edit(d)
 try:verify(d)
 except (AssertionError,KeyError,ValueError,TypeError,FileNotFoundError,IndexError):return name
 raise AssertionError("FALSE_ART_OR_GAME_SOURCE_PROMOTION_"+name)
cases=[
 ("source",lambda d:d.__setitem__("originalGameSourceBlob","fake")),
 ("fake_art",lambda d:d.__setitem__("officialArt",1)),
 ("fake_game",lambda d:d.__setitem__("GAMEPLAY","PASS")),
 ("fake_webgl",lambda d:d.__setitem__("originalGameWebGL",True)),
 ("fake_nativecam",lambda d:d.__setitem__("actualOriginalPlayerCamera",True)),
 ("fake_mesh",lambda d:d["scenes"]["true-pinch|B16_ONLY_REFERENCE"].__setitem__("twoRealOriginalB48SourceMeshes",5)),
 ("fake_spheres",lambda d:d["scenes"]["pinch-switch|C_CURVE_SHIFT_30M_NARROW_16M"].__setitem__("sampledNativeAirPoints",999)),
 ("fake_race",lambda d:d["scenes"]["true-pinch|A_C1_SHIFT_24M_SOURCE_WIDTH"].__setitem__("analysisCameraOnlyNotNativeOriginal",False)),
 ("fake_geometry",lambda d:d["scenes"]["pinch-switch|B_C1_SHIFT_40M_SOURCE_WIDTH"].__setitem__("allActualNativeTriangulationSourceFaces",[1,1])),
 ("fake_original",lambda d:d.__setitem__("actualBuiltGameWorldChanged",True))]
out={"schema":"dopagaki.r15q3-independent-source-actual-eight-3d-editable-mesh-and-240hz-path-veto/1",
 "originalGameSourceBlob":SRC,"genuineSourceRealEditableSceneQualityWitness":summary,
 "fakeGameOrWebGLOrHumanArtClaimsRejected":[fake(n,fn) for n,fn in cases],
 "sourceRoadAndOriginalRunnerEvidenceNotApproval":True,
 "officialArt":0,"officialSlope2Meters":0,"ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD"}
with open(os.path.join(root,"R15Q3_INDEPENDENT_REAL_EDITABLE_B48_3D_STUDY_QA.json"),"w",encoding="utf8") as f:json.dump(out,f,indent=2,ensure_ascii=False)
print("R15Q3_INDEPENDENT_REAL_SOURCE_B48_EDITABLE_3D_GLB_PNG",out,flush=True)

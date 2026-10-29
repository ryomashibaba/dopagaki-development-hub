"""R15N independent source vs 4 Blender edited bridge artifact integrity QA.

Art/structural/human/gameplay are HOLD no matter what. Independently parse
GLB 2.0 JSON chunk to verify genuine many editable geometry meshes, original
Blender scene carried real CX/B48/B51 signatures, source native camera frames,
and lack of false physical contact certification. Inspect PNG signatures.
"""
import os,sys,json,struct,copy
args=sys.argv[sys.argv.index("--")+1:]
def arg(n):
 assert n in args,n
 return args[args.index(n)+1]
root=arg("--dir")
read=lambda p:json.load(open(p,encoding="utf8"))
data=read(os.path.join(root,"R15N_TWO_REAL_ROADS_TWO_EDITABLE_OPEN_BRACE_DESIGNS_SOURCE_ART_HOLD.json"))
sha="af076d67492a677d2235e4730aef8cdf4808e106"
ROADS=("true-pinch","pinch-switch");KINDS=("A_LATTICE_RIB","B_SPLIT_CIVIC_SPINE")
def audit(x):
 assert x["schema"]=="dopagaki.r15n-real-original-b48-entry-bridge-native-camera-editable-study/1"
 assert x["sourceBlob"]==sha and x["sourceSceneRoads"]==list(ROADS) and x["studyDesigns"]==list(KINDS)
 assert x["originalInputRecordedFromRealR15M"] is True
 assert x["originalR1CamerasStudyOnlyNotBrowser"] is True
 assert x["actualNativeRunnerWithStudyBridge"] is False and x["realGameplayBridgeImplemented"] is False
 assert x["newOriginalGameColliders"]==x["officialArt"]==x["officialSlope2Meters"]==0
 assert all(x[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 names=[r+"|"+kind for r in ROADS for kind in KINDS]
 assert set(x["perRoadAndDesign"])==set(names)
 raw={}
 for road in ROADS:
  for kind in KINDS:
   key=road+"|"+kind
   item=x["perRoadAndDesign"][key]
   folder=os.path.join(root,item["resultRelative"])
   report=read(os.path.join(folder,"R15N_"+kind+"_"+road+"_REAL_SOURCE_DESIGN_QA.json"))
   assert report["schema"]=="dopagaki.r15n-source-grounded-real-blender-open-brace-bridge/1"
   assert report["sourceGameBlob"]==sha and report["road"]==road and report["design"]==kind
   assert report["sourceOriginalB48Road"]=="p93-CROWN_REVERSAL-01"
   assert report["sourceOriginalGameCodeEdited"] is False
   assert report["newGameColliders"]==report["officialArt"]==report["officialSlope2Meters"]==0
   assert report["sourceOriginalGameWebGLRendered"] is False and report["artApproved"] is False
   assert report["actualNativePhysicsReplayWithStudyDeck"] is False
   assert report["actualVerifiedStructuralLoadPath"] is False
   assert report["ART"]==report["GAMEPLAY"]==report["HUMAN"]==report["RELEASE"]=="HOLD"
   assert report["realNewEditableBlenderMeshObjects"]==item["meshCount"]>=24
   assert report["studyPrimaryRouteSpanMetres"]==(64 if kind==KINDS[0] else 72)
   assert report["studyWidthMetres"]==(10 if kind==KINDS[0] else 14)
   assert report["hypotheticalDownwardGrade"]==(.13 if kind==KINDS[0] else .16)
   assert report["anchorNearestTrueOriginalB48DistanceMetres"]<.02
   assert item["sourceRoadAnchorXYZ"]==report["trueSourceRoadAnchorXYZ"]
   assert 0<=item["sourceGroundHitPiers"]<=5
   assert item["sourceGroundHitPiers"]==len(report["groundAnchorWitnesses"])
   assert item["ungroundedPierStations"]==report["studyPierStationsWithoutSourceGroundRayWitness"]
   assert item["ungroundedPierStations"]+item["sourceGroundHitPiers"]==5
   orig=report["sourceOriginalGeometrySignatures"]
   assert set(orig)=={"CX","B48","B51"}
   assert len(orig["CX"])==18 and len(orig["B48"])==7 and len(orig["B51"])==28
   assert all(len(x)==3 and isinstance(x[2],int) for q in orig.values() for x in q)
   assert len(report["studySourceCameras"])==3
   assert [p["frame"] for p in report["studySourceCameras"]]==["t1600","t1650","t1700"]
   assert all(p["originalSourceCameraSamples"]==135 for p in report["studySourceCameras"])
   assert item["nativeBridgeSourceFirstHit"]==[p["studyBridgeFirstHitFraction"] for p in report["studySourceCameras"]]
   assert all(0<=v<=1 for v in item["nativeBridgeSourceFirstHit"])
   assert item["originalB51PossibleAABBOverlap"]==[len(z["originalB51ResearchPossibleAabbIntersections"]) for z in report["b51SourceDynamicAabbResearch"]]
   assert all(0<=v<=28 for v in item["originalB51PossibleAABBOverlap"])
   assert item["sourcePhysicsNotRepaired"] is True
   assert len(report["sourceLastSupportedXYZ"])==3 and len(report["sourceOriginalExitVelocityXYZ"])==3
   for t in ("t1650","t1700"):
    fn=os.path.join(folder,"R15N_"+kind+"_"+road+"_"+t+"_REAL_SOURCE_R1_CAMERA_BLENDER_ONLY.png")
    b=open(fn,"rb").read(25)
    assert b[:8]==b"\x89PNG\r\n\x1a\n"
    assert int.from_bytes(b[16:20],"big")>350 and int.from_bytes(b[20:24],"big")>250
   blend=os.path.join(folder,"R15N_"+kind+"_"+road+"_EDITABLE_REAL_SOURCE_B48_NOT_GAME.blend")
   assert os.path.getsize(blend)>100000
   glb=os.path.join(folder,"R15N_"+kind+"_"+road+"_STUDY_OBJECTS_ONLY.glb")
   with open(glb,"rb") as f:
    h=f.read(20)
    assert h[:4]==b"glTF"
    version,length=struct.unpack_from("<II",h,4)
    assert version==2 and length==os.path.getsize(glb)
    size,typ=struct.unpack_from("<I4s",h,12)
    assert typ==b"JSON" and size>100
    source=f.read(size).decode("utf8").rstrip(" \0")
    gltf=json.loads(source)
   assert len(gltf.get("meshes",[]))>=24 and len(gltf.get("nodes",[]))>=24
   assert all("primitives" in q for q in gltf["meshes"])
   raw[key]={"originalRoadAnchor":report["trueSourceRoadAnchorXYZ"],
    "sourceOriginalCameraFirstHit":item["nativeBridgeSourceFirstHit"],
    "sourceGroundedPierCount":item["sourceGroundHitPiers"],
    "unknownOrUngroundedPiers":item["ungroundedPierStations"],
    "originalDynamicB51AABBStudyOverlap":item["originalB51PossibleAABBOverlap"],
    "actualEditableBlenderObjects":report["realNewEditableBlenderMeshObjects"],
    "realArtApproved":False}
  # Same source B48 original topology in two design scenes of one road.
  a=read(os.path.join(root,x["perRoadAndDesign"][road+"|"+KINDS[0]]["resultRelative"],
    "R15N_"+KINDS[0]+"_"+road+"_REAL_SOURCE_DESIGN_QA.json"))
  b=read(os.path.join(root,x["perRoadAndDesign"][road+"|"+KINDS[1]]["resultRelative"],
    "R15N_"+KINDS[1]+"_"+road+"_REAL_SOURCE_DESIGN_QA.json"))
  assert a["sourceOriginalGeometrySignatures"]==b["sourceOriginalGeometrySignatures"]
 # Both original roads share same CX18 but their B48 stage variants can differ.
 A=read(os.path.join(root,x["perRoadAndDesign"][ROADS[0]+"|"+KINDS[0]]["resultRelative"],
    "R15N_"+KINDS[0]+"_"+ROADS[0]+"_REAL_SOURCE_DESIGN_QA.json"))
 B=read(os.path.join(root,x["perRoadAndDesign"][ROADS[1]+"|"+KINDS[0]]["resultRelative"],
    "R15N_"+KINDS[0]+"_"+ROADS[1]+"_REAL_SOURCE_DESIGN_QA.json"))
 assert A["sourceOriginalGeometrySignatures"]["CX"]==B["sourceOriginalGeometrySignatures"]["CX"]
 return raw
summ=audit(data)
def fake(name,change):
 x=copy.deepcopy(data);change(x)
 try:audit(x)
 except (AssertionError,KeyError,ValueError,TypeError,IndexError,FileNotFoundError):return name
 raise AssertionError("R15N_FALSE_ART_OR_GAME_SOURCE_PROMOTION "+name)
veto=[
 ("fakeART",lambda x:x.__setitem__("officialArt",1)),
 ("fakeGAME",lambda x:x.__setitem__("realGameplayBridgeImplemented",True)),
 ("fakeWEBGL",lambda x:x.__setitem__("actualNativeRunnerWithStudyBridge",True)),
 ("fakeCOLLIDERS",lambda x:x.__setitem__("newOriginalGameColliders",1)),
 ("fakeSHA",lambda x:x.__setitem__("sourceBlob","tampered")),
 ("fakeDESIGN",lambda x:x.__setitem__("studyDesigns",["other"])),
 ("fakeROAD",lambda x:x.__setitem__("sourceSceneRoads",["wrong"])),
 ("fakeCOUNT",lambda x:x["perRoadAndDesign"]["true-pinch|A_LATTICE_RIB"].__setitem__("meshCount",3)),
 ("fakePIER",lambda x:x["perRoadAndDesign"]["true-pinch|A_LATTICE_RIB"].__setitem__("sourceGroundHitPiers",6)),
 ("fakeSCREEN",lambda x:x["perRoadAndDesign"]["pinch-switch|B_SPLIT_CIVIC_SPINE"].__setitem__("nativeBridgeSourceFirstHit",[1,1,1])),
 ("fakeWARN",lambda x:x["perRoadAndDesign"]["pinch-switch|A_LATTICE_RIB"].__setitem__("originalB51PossibleAABBOverlap",[29,29,29])),
 ("fakeHOLD",lambda x:x.__setitem__("RELEASE","PASS"))]
result={"schema":"dopagaki.r15n-independent-editable-original-road-bridge-visual-source-veto/1",
 "sourceBlob":sha,"fourActualSourceBlenderAndGLBIntegrityStudies":summ,
 "adversarialFalseArtAndGamePromotionsRejected":[fake(name,fn) for name,fn in veto],
 "originalGameStillHasNoNewCollider":True,"actualNativeGameWithNewStructureTested":False,
 "actualHumanPlayOrArtApproved":False,"originalSourceBlenderNotWebGL":True,
 "officialArt":0,"officialSlope2Meters":0,"ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD"}
with open(os.path.join(root,"R15N_INDEPENDENT_TWO_REAL_EDITABLE_BRIDGE_ARCHITECTURES_QA.json"),"w",encoding="utf8") as f:
 json.dump(result,f,indent=2,ensure_ascii=False)
print("R15N_INDEPENDENT_TRUE_ORIGINAL_3D_BRIDGE_SOURCE_ONLY",result,flush=True)

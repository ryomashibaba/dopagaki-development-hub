"""R15R independent camera math, persisted original Runner trace, 28 dynamic B51
time-exact proxy and real Blender PNG/BLEND QA with adversarial false claims.
DO NOT certify actual WebGL, fairness, ART, or road completion.
"""
import os,json,math,copy,struct,argparse
p=argparse.ArgumentParser()
p.add_argument("--camera",required=True)
p.add_argument("--original-q",required=True)
p.add_argument("--scenes",required=True)
p.add_argument("--root",required=True)
p.add_argument("--source-webgl",required=True)
a=p.parse_args()
J=lambda path:json.load(open(path,encoding="utf8"))
D=J(a.camera)
Q=J(a.original_q)
S=J(a.scenes)
SHA="af076d67492a677d2235e4730aef8cdf4808e106"
webgl_source=open(a.source_webgl,encoding="utf8").read()
assert "gl_Position=vec4(1.35*x/aspect,1.35*y," in webgl_source, "Original WebGL source projection changed"
roads=["true-pinch","pinch-switch"]
modes=["B16_ONLY_REFERENCE","A_C1_SHIFT_24M_SOURCE_WIDTH",
 "B_C1_SHIFT_40M_SOURCE_WIDTH","C_CURVE_SHIFT_30M_NARROW_16M"]
selected=[modes[0],modes[2],modes[3]]
norm=lambda x:math.sqrt(sum(float(v)**2 for v in x))
def close(a,b,tol=2e-5):
 return len(a)==len(b) and all(abs(float(x)-float(y))<=tol for x,y in zip(a,b))
def verify(d,s):
 assert d["schema"]=="dopagaki.r15r-actual-native-chase-camera-full-8-r15q-physical-source-trials/1"
 assert d["originalSourceGameBlob"]==Q["originalGameSourceBlob"]==SHA
 assert d["sourceEngineHz"]==Q["realSourceGameHz"]==240
 assert d["actualPhysicalTrialCount"]==8
 assert d["originalP96SteeringUnchanged"] and d["originalB51Preserved"]
 assert d["noInventedPostTerminalCamera"] and d["sourceR15QQuarterSamplesReplayedExactly"]
 assert not d["originalGameEdited"] and not d["sourceWebGLRendered"]
 assert not d["humanCameraFairnessCertified"] and d["newGameColliders"]==0
 assert d["officialArt"]==d["officialSlope2Meters"]==0
 assert all(d[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN","PERFORMANCE","INTEGRATION","RELEASE","MERGE"))
 assert s["schema"]=="dopagaki.r15r-source-native-240hz-camera-and-b51-obb-original-two-b48-road-proxies/1"
 assert s["originalGameBlob"]==SHA
 assert s["sourceGameWebGLShaderPerspectiveNormalizedScaleY"]==1.35
 assert s["sourcePerspectivePixelDimensions"]==[1008,645]
 assert s["sourceCameraMatchesOriginalGLSLPerspectiveNotOnlyEyeAndFront"]
 assert abs(s["sourcePerspectiveEquivalentBlenderLensMM"]-18*1.35*645/1008)<2e-6
 assert s["genuineRunnerCameraReplayed240Hz"] and s["actualOriginalCameraMathFromGameSource"]
 assert not s["actualBrowserWebGLRendered"] and not s["originalGameB51VisualMeshUsed"]
 assert s["sourceOriginalB51CollisionVolumeProxiesOnly"]
 assert not s["noRealGameEditing"] is False
 assert s["newSourceColliders"]==s["officialArt"]==s["officialSlope2Meters"]==0
 assert all(s[k]=="HOLD" for k in ("ART","GAMEPLAY","HUMAN"))
 assert set(s["scenes"])=={r+"|"+m for r in roads for m in selected}
 check={}
 for road in roads:
  assert set(d["actualNativeCameraResults"][road])==set(modes)
  for mode in modes:
   r=d["actualNativeCameraResults"][road][mode]
   stored=Q["nativeScissorRealEditableSurfaceGeometryTrials"][road][mode]["true240HzOriginalSourcePhysics"]
   assert r["nativeOriginalGameReplayMatchingR15QStoredPhysics"]
   assert r["originalNativeRunnerStatus"]==stored["originalSourceStatus"]=="failed"
   assert r["originalNativeRunnerTerminalSeconds"]==stored["originalSourceTerminalTimeSeconds"]
   assert r["sourceOriginalB51Count"]==28 and r["actualNativeCameraAt17SourceOriginalParity"]
   assert r["cameraFromGameSourceNotBrowserWebGL"] and r["noHumanOrArtOrFinishedCertification"]
   f=r["actualNativeQuarterSecondCameraFrames"]
   raw=stored["nativeQuarterSecondSourcePhysicsTrace"]
   assert len(f)==len(raw)>=40
   assert all(f[i]["tick"]==raw[i]["tick"] for i in range(len(raw)))
   assert all(f[i]["seconds"]==raw[i]["seconds"] for i in range(len(raw)))
   assert f[-1]["seconds"]<=stored["originalSourceTerminalTimeSeconds"]+1e-6
   for c,x in zip(f,raw):
    assert close(c["trueNativePlayerWorldXYZ"],x["playerWorldXYZ"])
    assert c["sourceNativeEngineGrounded"]==x["engineGrounded"]
    assert c["sourceNativeContactRoad"]==x["sourceRoad"]
    assert c["sourceNativeSteer"]==x["steer"]
    assert c["sourceNativeSpeedMps"]==x["speedMps"]
    assert c["sourcePlayerStatus"]==x["nativeStatus"]
    assert c["tick"]==round(c["seconds"]*240)
    pos=c["trueNativePlayerWorldXYZ"];eye=c["sourceOriginalGameCameraEyeXYZ"]
    front=c["sourceOriginalGameCameraFrontUnitXYZ"]
    assert abs(eye[1]-pos[1]-7)<2e-5
    delta=[pos[0]-eye[0],pos[2]-eye[2]]
    assert abs(norm(delta)-14)<2e-5
    expected=[34*delta[0]/14,-6,34*delta[1]/14]
    expected=[v/norm(expected) for v in expected]
    assert close(front,expected)
    assert abs(norm(front)-1)<2e-5
    assert abs(norm(c["sourceOriginalGameCameraRightUnitXYZ"])-1)<2e-5
    assert abs(norm(c["sourceOriginalGameCameraUpUnitXYZ"])-1)<2e-5
    if c["seconds"] in (17,22,23):
     bs=c["sourceRealB51TimeSyncedPhysicalOBBs"]
     assert len(bs)==28 and len({b["id"] for b in bs})==28
     assert all(b["originalSourceOnlyPhysicalShape"] and
      len(b["centerXYZ"])==len(b["halfSizeXYZ"])==3 and
      all(math.isfinite(v) for v in b["centerXYZ"]) and
      all(v>0 and math.isfinite(v) for v in b["halfSizeXYZ"]) and
      math.isfinite(b["yawRadians"]) for b in bs)
    else:assert "sourceRealB51TimeSyncedPhysicalOBBs" not in c
   cam17=next(x for x in f if x["seconds"]==17)
   assert close(cam17["sourceOriginalGameCameraEyeXYZ"],stored["sourceExact17RealPosCam"]["sourceViewEye"])
   if mode not in selected:continue
   key=road+"|"+mode
   scene=s["scenes"][key]
   assert scene["nativeOriginalRealB48Meshes"]==2
   assert abs(scene["sourceGLSLPerspectiveEquivalentBlenderLensMM"]-18*1.35*645/1008)<2e-6
   assert scene["actualSource28B51PhysicalVolumeOnly"]
   assert not scene["nativeGameWebGLRendered"]
   assert len(scene["sourceCameraSamples"])==3
   assert [x["second"] for x in scene["sourceCameraSamples"]]==[17,22,23]
   for pic in scene["sourceCameraSamples"]:
    source_frame=next(x for x in f if x["seconds"]==pic["second"])
    assert pic["tick"]==source_frame["tick"]
    assert close(pic["sourceNativeCameraEyeXYZ"],source_frame["sourceOriginalGameCameraEyeXYZ"])
    assert close(pic["sourceNativeCameraFrontUnitXYZ"],source_frame["sourceOriginalGameCameraFrontUnitXYZ"])
    assert pic["sourceActualB51TimeExactProxyCount"]==28
    assert pic["sourceNativePlayerGrounded"]==source_frame["sourceNativeEngineGrounded"]
    assert pic["sourceNativeContactRoad"]==source_frame["sourceNativeContactRoad"]
    assert not pic["originalWebGLOrArtApproved"]
    fpath=os.path.normpath(os.path.join(a.root,pic["image"]))
    assert os.path.commonpath([os.path.abspath(a.root),os.path.abspath(fpath)])==os.path.abspath(a.root)
    assert os.path.getsize(fpath)>12000
    with open(fpath,"rb") as h:header=h.read(24)
    assert header[:8]==b"\\x89PNG\\r\\n\\x1a\\n".decode("unicode_escape").encode("latin1")
    assert int.from_bytes(header[16:20],"big")>=900
    assert int.from_bytes(header[20:24],"big")>=540
   blend=os.path.join(a.root,road,mode,scene["editableNativeCameraBLENDAt22"])
   assert os.path.getsize(blend)>100000
   with open(blend,"rb") as h:assert h.read(7)==b"BLENDER"
   check[key]={"actualOriginalSourceCameraFrames":len(f),"imageFrames":3,
    "timeExactOriginalMovingB51SourceBoxes":28,
    "independentlyRecomputedCameraGeometry":True,
    "nativeFailedNotFinished":True}
 return check
verified=verify(D,S)
def mutate(name,fn):
 d,s=copy.deepcopy(D),copy.deepcopy(S)
 fn(d,s)
 try:verify(d,s)
 except (AssertionError,KeyError,ValueError,TypeError,IndexError,FileNotFoundError):return name
 raise AssertionError("FORGED_RESEARCH_APPROVAL_ACCEPTED "+name)
key=lambda d:d["actualNativeCameraResults"]["true-pinch"]["B16_ONLY_REFERENCE"]
skey="pinch-switch|C_CURVE_SHIFT_30M_NARROW_16M"
bad=[
 ("fake_source",lambda d,s:d.__setitem__("originalSourceGameBlob","fake")),
 ("fake_webgl",lambda d,s:s.__setitem__("actualBrowserWebGLRendered",True)),
 ("fake_art",lambda d,s:s.__setitem__("officialArt",1)),
 ("fake_gameplay",lambda d,s:d.__setitem__("GAMEPLAY","PASS")),
 ("fake_telemetry",lambda d,s:key(d)["actualNativeQuarterSecondCameraFrames"][0].__setitem__("trueNativePlayerWorldXYZ",[0,0,0])),
 ("fake_eye",lambda d,s:key(d)["actualNativeQuarterSecondCameraFrames"][1].__setitem__("sourceOriginalGameCameraEyeXYZ",[0,0,0])),
 ("fake_front",lambda d,s:key(d)["actualNativeQuarterSecondCameraFrames"][2].__setitem__("sourceOriginalGameCameraFrontUnitXYZ",[0,1,0])),
 ("fake_b51",lambda d,s:key(d)["actualNativeQuarterSecondCameraFrames"][8]["sourceRealB51TimeSyncedPhysicalOBBs"].clear()),
 ("fake_terminal",lambda d,s:key(d).__setitem__("originalNativeRunnerStatus","finished")),
 ("fake_visual_model",lambda d,s:s.__setitem__("originalGameB51VisualMeshUsed",True)),
 ("fake_frame",lambda d,s:s["scenes"][skey]["sourceCameraSamples"][0].__setitem__("tick",1)),
 ("fake_human",lambda d,s:d.__setitem__("humanCameraFairnessCertified",True)),
 ("fake_projection",lambda d,s:s.__setitem__("sourcePerspectiveEquivalentBlenderLensMM",30.0)),
]
# B51 mutation point must target its actual time key, never arbitrary index.
bad[7]=("fake_b51",lambda d,s:next(x for x in key(d)["actualNativeQuarterSecondCameraFrames"] if x["seconds"]==17)["sourceRealB51TimeSyncedPhysicalOBBs"].clear())
frauds=[mutate(n,fn) for n,fn in bad]
out={"schema":"dopagaki.r15r-independent-native-actual-chase-camera-and-3d-original-b51-obbs-qa/1",
 "sourceBlob":SHA,"actuallyReplayedEightRunnerTracesIndependentlyCompared":True,
 "actualSourcePlayerCameraMathIndependentlyVerified":True,
 "sourceOnlyPhysicalB51NotOriginalVisualMesh":True,
 "nativeRoadComparisonWitnesses":verified,
 "rejectedForgedArtGameCameraAndB51Claims":frauds,
 "actualWebGLOrHumanOrARTCertified":False,
 "officialArt":0,"officialSlope2Meters":0,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD"}
path=os.path.join(a.root,"R15R_INDEPENDENT_TRUE_NATIVE_SOURCE_CAMERAS_AND_B51_OBB_GLANCE_QA.json")
with open(path,"w",encoding="utf8") as f:json.dump(out,f,indent=2,ensure_ascii=False)
print("R15R_INDEPENDENT_SOURCE_CAMERA_B51_REVIEW_PASS",len(verified),len(frauds),flush=True)

"""K4S: TRUE SOURCE-CAMERA + ORIGINAL A5 GLB RAY OCCLUSION SITING RESEARCH.
Never add models, colliders, player supports, camera modifications, or ART grants.
Executed with original Blender GLB, K & K3B real WebGL2 source-camera evidence,
fresh 7x81 stations per width. Sampled visibility is NOT image-space readability.
"""
import bpy, json, sys, math, hashlib, os
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree

SOURCE='af076d67492a677d2235e4730aef8cdf4808e106'
def arg(k):
    a=sys.argv[sys.argv.index('--')+1:]
    return a[a.index(k)+1]
def js(p):
    return json.loads(Path(p).read_text(encoding='utf8'))
def sha(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for c in iter(lambda:f.read(1024*1024),b''):h.update(c)
    return h.hexdigest()
source,k_path,k3b_path,anchor_path,out=map(arg,(
 '--original-glb','--k-camera','--k3b-camera','--anchors','--output'))
k,k3b,anchors=js(k_path),js(k3b_path),js(anchor_path)
assert k['sourceBlob']==k3b['sourceBlob']==anchors['originalGameBlob']==SOURCE
assert k['Hz']==k3b['sourceHz']==240
assert k['roadCount']==k3b['sourceB48']==anchors['physicalRoadCount']==7
assert k['B51']==k3b['sourceB51']==anchors['originalB51']==28
assert k['errors']==k3b['errors']==[]
assert k['addedColliders']==0 and anchors['addedColliders']==0
assert not k3b['geometryChanged'] and not k3b['collisionChanged']
assert k3b['actualWebGL2'] and k3b['allSourceRoadsCameraTarget']
assert len(anchors['sourceModes'])==2

# World-space original ONLY: GLB is not exported or modified, BVH used as read-only.
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=os.path.abspath(source))
objs=sorted((o for o in bpy.context.scene.objects if o.type=='MESH'),key=lambda o:o.name)
assert len(objs)==5
vertices=[]; triangles=[]
for o in objs:
    m=o.data
    m.calc_loop_triangles()
    offset=len(vertices)
    vertices.extend([o.matrix_world @ v.co for v in m.vertices])
    triangles.extend([tuple(offset+i for i in t.vertices) for t in m.loop_triangles])
assert len(triangles)==10566,(len(triangles),len(vertices))
tree=BVHTree.FromPolygons(vertices,triangles,all_triangles=True)
assert tree is not None
def vec(p):return Vector(p)
def game_to_blender(p):return Vector((p[0],-p[2],p[1]))
def lerp(a,b,u):return vec(a).lerp(vec(b),u)
def frame(mode,site):
    stations=anchors['sourceModes'][mode]['roads'][site['road']]['stations']
    t=site['u']*80;i=min(79,int(t));a=t-i
    center=lerp(stations[i]['center'],stations[i+1]['center'],a)
    edgekey='left' if site['side']=='left' else 'right'
    edge=lerp(stations[i][edgekey],stations[i+1][edgekey],a)
    along=lerp(stations[i]['forward'],stations[i+1]['forward'],a)
    along.y=0;along.normalize()
    outward=edge-center;outward.y=0
    outward-=along*outward.dot(along)
    assert outward.length>0
    outward.normalize()
    assert abs(along.dot(outward))<.02
    origin=edge+outward*site['offset']
    return origin,along,outward
W,H=1013,698  # K2 SOURCE projection surrogate; NOT native pixel mask.
def projected(state,p):
    eye=vec(state['cameraEye'])
    f=vec(state['cameraFront']).normalized()
    right=f.cross(Vector((0,1,0))).normalized()
    up=right.cross(f).normalized()
    v=p-eye;depth=v.dot(f)
    if depth<=.66:return None
    return (W*(1+1.35*v.dot(right)/(W/H)/depth)/2,
            H*(1-1.35*v.dot(up)/depth)/2,depth)
def ray_occluded(eye,target):
    delta=game_to_blender(target)-game_to_blender(eye)
    length=delta.length
    if length<.05:return None
    direction=delta/length
    hit,normal,index,distance=tree.ray_cast(game_to_blender(eye)+direction*.015,
        direction,max(0,length-.035))
    return hit is not None

def sampled_points(origin,along,outward,volume):
    length,width,height=volume
    points=[]
    def add(tag,x,y,z):
        p=origin+along*x+outward*y+Vector((0,z,0))
        points.append((tag,p))
    # Outer shell surrogate, not actual wall, open market, or candidate roof.
    for xfrac in (-1,-.6,-.2,.2,.6,1):
        for zfrac in (.08,.30,.58,.86,1):
            for yf in (-1,1):
                add('shell',length/2*xfrac,width/2*yf,height*zfrac)
    for xf in (-1,-.65,0,.65,1):
        for yf in (-1,0,1):
            add('roof',length/2*xf,width/2*yf,height)
    # Roofless, walkable-LOOKING court test, no physical surface asserted.
    for xf in (-.22,0,.22):
        for yf in (-.24,0,.24):
            add('court',length/2*xf,width/2*yf,.85)
    return points
def bbox(state,pts):
    pr=[projected(state,p) for _,p in pts if _!='court']
    if any(x is None for x in pr):return None
    x0=min(p[0] for p in pr);x1=max(p[0] for p in pr)
    y0=min(p[1] for p in pr);y1=max(p[1] for p in pr)
    width=max(0,min(W,x1)-max(0,x0))
    height=max(0,min(H,y1)-max(0,y0))
    return [round(x,2) for x in (x0,y0,x1,y1,width*height)]
def observed(mode):
    old=next(s for s in k['sessions'] if s['mode']==mode)
    late=next(s for s in k3b['sessions'] if s['mode']==mode)
    earlyshots=[x for x in old['observed'] if x['tick']<7680]
    lateshots=[x for x in late['shots'] if x['tick']>=7680]
    assert len(earlyshots)==13 and len(lateshots)==8
    # Historical first six must be from identical original native camera/physics.
    for original in old['observed'][:6]:
        archived=next(x for x in late['shots'] if x['tick']==original['tick'])
        assert (original['state']['road']==archived['state']['road'])
        for key in ('cameraEye','cameraFront','xyz'):
            assert math.dist(original['state'][key],archived['state'][key])<.002
        assert abs(original['state']['speed']-archived['state']['speed'])<.001
    shots=earlyshots+lateshots
    assert len(shots)==21 and len({s['tick'] for s in shots})==21
    assert all(s['state']['status']=='running' and s['state']['B51']==28
        and s['state']['camera']=='ball-lock-unfiltered-heading' for s in shots)
    assert all(s['state']['cameraEye'] and s['state']['cameraFront'] for s in shots)
    return shots
road_ids=[x['id'] for x in anchors['sourceModes']['ultra']['roads']]
assert len(road_ids)==len(set(road_ids))==7
cases=[
 dict(id='ROAD0_K4R_BASELINE',road=0,u=.75,side='right',offset=70,volume=[90,65,32],programme='market',basis='K2/K4/K4R REJECTED LOCATION'),
 dict(id='ROAD0_RIGHT_EARLIER',road=0,u=.55,side='right',offset=70,volume=[90,65,32],programme='market',basis='siting research only'),
 dict(id='ROAD0_RIGHT_MID_WIDER',road=0,u=.65,side='right',offset=105,volume=[90,65,32],programme='market',basis='siting research only'),
 dict(id='ROAD0_RIGHT_BASE_WIDER',road=0,u=.75,side='right',offset=110,volume=[90,65,32],programme='market',basis='siting research only'),
 dict(id='ROAD0_RIGHT_LATER',road=0,u=.85,side='right',offset=70,volume=[90,65,32],programme='market',basis='siting research only'),
 dict(id='ROAD0_LEFT_SIDE',road=0,u=.75,side='left',offset=70,volume=[90,65,32],programme='market',basis='siting research only'),
 dict(id='ROAD2_K2_TRANSIT_REFERENCE',road=2,u=.25,side='left',offset=70,volume=[120,70,67],programme='transit',basis='K2 ONLY, not new model'),
 dict(id='ROAD3_K2_CIVIC_REFERENCE',road=3,u=.20,side='right',offset=100,volume=[135,95,43],programme='civic',basis='K2 ONLY, not new model')]
assert len({s['id'] for s in cases})==len(cases)
camera_samples={m:observed(m) for m in ('ultra','control')}
assert set(x['state']['road'] for x in camera_samples['ultra'])==set(road_ids)
assert set(x['state']['road'] for x in camera_samples['control'])==set(road_ids)

report=dict(schema='dopagaki.k4s-original-a5-occlusion-and-real-7road-camera-siting/1',
 originalSourceBlob=SOURCE,originalGeometryTriangles=len(triangles),
 originalGLBSha256=sha(source),cameraKFileSha256=sha(k_path),
 cameraK3BFileSha256=sha(k3b_path),freshRoadAnchorSha256=sha(anchor_path),
 sourceModes=['ultra','control'],realCameraCountPerWidth=21,
 originalRealRoadsCoveredPerWidth=7,sourceHz=240,sourceB51=28,
 originalSourceCamera='ball-lock-unfiltered-heading',
 test='VISUAL_ONLY_PROXY_CAMERA_RAYCAST_NOT_ACTUAL_RASTER',
 projection='K2_1013x698_1.35_approximate_not_native_pixel_mask',
 occluders='ONLY_ORIGINAL_A5_FIVE_CITY_MESHES__NOT_ROAD_B51_OTHER_OBJECTS',
 bvhOriginalOnly=True,addedColliders=0,newBlenderModels=0,
 allGlobalSAT='NOT_TESTED',allCCD='NOT_TESTED',walkability='NOT_TESTED',
 originalCityImageReadability='NOT_TESTED',HUMAN='HOLD',
 ART='HOLD',officialArtAccepted=0,slope2DNARecognizedMetres=0,
 PERFORMANCE='HOLD',RELEASE='HOLD',MERGE='HOLD',cases=[])
for site in cases:
    assert site['offset']-site['volume'][1]/2>=30
    c=dict(site,results=[],summary={})
    for mode in ('ultra','control'):
        origin,along,outward=frame(mode,site)
        pts=sampled_points(origin,along,outward,site['volume'])
        assert len(pts)==84,len(pts)
        for shot in camera_samples[mode]:
            state=shot['state']
            bb=bbox(state,pts)
            candidate=[];court=[]
            for tag,p in pts:
                v=projected(state,p)
                if v is None or not(0<=v[0]<=W and 0<=v[1]<=H):continue
                q=dict(kind=tag,blockedByOriginalA5=ray_occluded(state['cameraEye'],p))
                (court if tag=='court' else candidate).append(q)
            shellVis=sum(q['blockedByOriginalA5'] is False for q in candidate)
            courtVis=sum(q['blockedByOriginalA5'] is False for q in court)
            c['results'].append(dict(mode=mode,tick=shot['tick'],
                seconds=round(shot['tick']/240,4),originalSourceRoad=state['road'],
                surrogateProjectedBBox=bb,
                shellInFrameSamples=len(candidate),shellSourceA5UnblockedSamples=shellVis,
                shellOriginalA5BlockedSamples=sum(q['blockedByOriginalA5'] is True for q in candidate),
                courtInFrameSamples=len(court),courtSourceA5UnblockedSamples=courtVis,
                courtOriginalA5BlockedSamples=sum(q['blockedByOriginalA5'] is True for q in court),
                nativeImagesActuallyRenderedForProxy=False,
                sourceFramePNG=shot.get('file'),
                sourceFrameSha256=shot['sha256']))
        r=[x for x in c['results'] if x['mode']==mode]
        observations=[x for x in r if x['shellSourceA5UnblockedSamples']>=6]
        c['summary'][mode]=dict(
            sampledCameraCount=len(r),
            sampleTicksWithSixOrMoreA5ClearProxySurfacePoints=len(observations),
            firstLastSampleTicks=[min(x['tick'] for x in observations),max(x['tick'] for x in observations)] if observations else None,
            sourceRoadSamplesClear=[x['tick'] for x in observations if x['originalSourceRoad']==road_ids[site['road']]],
            maxUnblockedShellSamples=max(x['shellSourceA5UnblockedSamples'] for x in r),
            maxUnblockedCourtSamples=max(x['courtSourceA5UnblockedSamples'] for x in r),
            noContinuousVisibilityClaim=True)
    assert len(c['results'])==42
    report['cases'].append(c)
assert len(report['cases'])==8
Path(out).parent.mkdir(parents=True,exist_ok=True)
Path(out).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('K4S_TRUE7ROAD_CAMERA_ORIGINAL_A5_BVH_SITING_LIMITED_PASS',json.dumps({
 'sourceCameraSamples':42,'siteProxies':len(report['cases']),
 'originalCityTris':len(triangles),'readOnly':True,
 'summary':{x['id']:{m:x['summary'][m]['sampleTicksWithSixOrMoreA5ClearProxySurfacePoints'] for m in ('ultra','control')} for x in report['cases']},
 'ART':'HOLD','SAFETY':'HOLD','HUMAN':'HOLD','release':'HOLD'}))

# G4E-7DZ R6B: one road-centered inhabited urban SECTION. PRIVATE, never game-integrated.
# Real original DR Blender scene + R5A source contact; 2 roads x 4 original cameras.
# No reused R3 gates, R4 mega-slope, R5B short slab, new game collider or altered source.
import bpy, json, math, os, sys
from mathutils import Vector
from mathutils.bvhtree import BVHTree
from bpy_extras.object_utils import world_to_camera_view

argv=sys.argv[sys.argv.index('--')+1:]
def arg(k):
    assert k in argv,k
    return argv[argv.index(k)+1]
road=arg('--road')
assert road in ('true-pinch','pinch-switch')
out=arg('--out')
os.makedirs(out,exist_ok=True)
site=json.load(open(arg('--site-report'),encoding='utf-8'))
contact=json.load(open(arg('--contact'),encoding='utf-8'))
assert site['schema']=='dopagaki.g4e7dy-r1-native-road-approach-city/1'
assert site['sourceCXBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert (site['originalB48'],site['originalB51'],site['newColliders'])==(7,28,0)
assert site['gap52'] and site['unchangedPhysics']
assert contact['road']==road and contact['best'] and contact['best']['preliminaryCandidate']
candidate=contact['best']
stations=site['roads'][road]['stations']
assert len(stations)==21
bpy.ops.wm.open_mainfile(filepath=arg('--source'))
scene=bpy.context.scene
assert scene.get('DO_SCENE_IS_NOT_GAME_WEBGL') is True
assert scene.get('DR_ACTUAL_B48_MESH_COUNT')==7
assert scene.get('DR_ACTUAL_B51_POSES_PER_FRAME')==28
assert scene.get('DR_ACTUAL_B48_VOID_CELL52') is True
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
b48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
b51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
cams=bpy.data.collections['DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION']
assert (len(cx),len(b48),len(b51),len(cams.objects))==(18,7,28,5)
before={
 'CX':sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 'B48':sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in b48),
 'B51':sorted((o.name,o['SOURCE_ORIGINAL_B51_ID']) for o in b51),
 'cameras':sorted((o.name,float(o['true_240hz_time'])) for o in cams.objects)}
side=candidate['side']
assert side in ('L','R')
ix=int(candidate['station'])
assert 4<=ix<=19
contact_source=Vector(candidate['CXcontactWorldXYZ'])
contact_road=Vector(candidate['proposedOutsideRoadPointXYZ'])
chosen=[o for o in cx if o.name==candidate['CX']]
assert len(chosen)==1

def sample(i, offset, height=0):
    center=Vector(stations[i]['center'])
    edge=Vector(stations[i]['left' if side=='L' else 'right'])
    normal=edge-center
    normal.y=0
    assert normal.length>1
    return edge+normal.normalized()*offset+Vector((0,height,0))
def bvh(obj):
    return BVHTree.FromPolygons(
        [tuple(obj.matrix_world@v.co) for v in obj.data.vertices],
        [tuple(p.vertices) for p in obj.data.polygons],all_triangles=False)
cp,n,fi,d=bvh(chosen[0]).find_nearest(contact_source)
assert cp is not None and d<.025 and n.y>.65

coll=bpy.data.collections.new('R6B PRIVATE BROAD INHABITED CITY SECTION UNADOPTED')
scene.collection.children.link(coll)
def mat(name,color):
    m=bpy.data.materials.new('R6B '+name)
    m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value=(*color,1)
    bs.inputs['Roughness'].default_value=.56
    bs.inputs['Metallic'].default_value=.17
    m.diffuse_color=(*color,1)
    return m
shell=mat('subtractive structural inhabited tissue',(.26,.36,.45))
civic=mat('shared public space',(.61,.53,.39))
train=mat('embedded transport mezzanine',(.13,.57,.59))
rail=mat('transport inset rail',(.09,.19,.22))
home=mat('residential courts',(.66,.43,.37))
garden=mat('inhabited landscape court',(.28,.45,.33))
link=mat('original CX contact footway study',(.67,.61,.46))
objs=[]

def geometry(name,points,faces,material,role):
    m=bpy.data.meshes.new('R6B '+name)
    m.from_pydata([tuple(p) for p in points],[],faces)
    m.update()
    assert len(m.polygons)>0
    o=bpy.data.objects.new('R6B '+name,m)
    coll.objects.link(o)
    m.materials.append(material)
    o['R6B_ROLE']=role
    o['R6B_UNADOPTED']=True
    o['R6B_NEW_GAME_COLLIDER']=False
    objs.append(o)
    return o

# One STRUCTURAL section in a real-world station frame: transport cut,
# inhabited public depth, fragmented residential courts; off-road, no giant
# transverse portal. All functions are longitudinally joined, not prop rows.
# Profile contours form closed monocoque sections, not floating thin planes.
def sweep(name,i0,i1,profile,material,role,phase=0):
    N=len(profile)
    verts=[]
    for i in range(i0,i1+1):
        t=(i-i0)/max(1,i1-i0)
        bend=2.8*math.sin((t*2.1+phase)*math.pi)
        undulation=1.8*math.sin(t*5.1+phase)
        for off,height in profile:
            verts.append(sample(i,off+bend,height+undulation))
    faces=[]
    for k in range(i1-i0):
        for j in range(N):
            a=k*N+j
            b=k*N+(j+1)%N
            faces.append((a,b,b+N,a+N))
    faces.extend([tuple(range(N-1,-1,-1)),
                  tuple((i1-i0)*N+j for j in range(N))])
    return geometry(name,verts,faces,material,role)

# These nested structural sections intentionally contain separate negative
# space between them. Unlike R4, no single 100m rising slope covers the road.
sweep('01 transit slot loadbearing cavity',5,19,
 [(18,-1),(19,3),(25,4),(33,3),(40,8),(40,1),(31,-4),(24,-4)],
 shell,'TRANSPORT_SUBSTRUCTURE')
sweep('02 embedded railway concourse',6,18,
 [(23,4.2),(25,5.6),(32,5.6),(35,4.2),(34,7),(23,7)],
 train,'RAIL_CONCOURSE')
sweep('03 civic gathering west shore',5,11,
 [(39,4),(45,12),(57,17),(68,16),(67,10),(53,8),(46,2)],
 civic,'PUBLIC_STAYING_SPACE',.2)
sweep('04 civic gathering east shore',12,19,
 [(39,4),(46,11),(58,16),(70,13),(68,8),(53,7),(45,2)],
 garden,'PUBLIC_OPEN_COURT',.6)
sweep('05 inhabited upper arc',8,14,
 [(59,15),(65,25),(76,38),(92,34),(94,23),(78,28),(69,15)],
 home,'RESIDENTIAL_STREET_SECTION',.4)
sweep('06 offset inhabited extension',15,19,
 [(61,14),(70,24),(85,41),(99,33),(93,19),(78,23),(68,13)],
 home,'ASYMMETRIC_RESIDENTIAL_COURT',1.1)
# Rail is an inlaid reference and MUST NOT be mistaken for an extra road.
for lane,off in enumerate((26.6,30.4),1):
    sweep('07 rail inset '+str(lane),7,18,
     [(off,7.15),(off+.38,7.15),(off+.38,7.30),(off,7.30)],
     rail,'PHYSICAL_RAIL_VISUAL_NOT_GAME_ROAD')
# A CX-surface-rooted FOUR-STATION walk connection deliberately differs from
# R5B's 2 simple slabs. Its junction to the original CX is point-aligned, NOT
# a certified welded/accessible connection.
edge=sample(ix,15,0)+Vector((0,0.8,0))
outer=sample(ix,43,7)
p=contact_source+Vector((0,.35,0))
q=contact_road+Vector((0,.35,0))
base=[p,q,outer,edge]
tangent=Vector(stations[min(ix+1,20)]['center'])-Vector(stations[max(ix-1,0)]['center'])
tangent.y=0
assert tangent.length>1
tangent.normalize()
across=Vector((-tangent.z,0,tangent.x))
verts=[]
for idx,v in enumerate(base):
    width=(7,9,13,9)[idx]
    for dd in (-1,1):
        for vertical in (0,-2.8):
            verts.append(v+across*(width*dd/2)+Vector((0,vertical,0)))
faces=[]
for k in range(3):
    a=k*4;b=(k+1)*4
    faces.extend(((a,b,b+2,a+2),(a+1,a+3,b+3,b+1),
                  (a,a+1,b+1,b),(a+2,b+2,b+3,a+3)))
faces.extend(((0,2,3,1),(12,13,15,14)))
geometry('09 physical CX branch to near-road urban exchange',verts,faces,
         link,'CONTACT_ALIGNED_PEDESTRIAN_BRANCH_UNCERTIFIED')
assert len(objs)==9,len(objs)
# Actual source geometry MUST remain byte-identity-equivalent by source metadata.
after={
 'CX':sorted((o.name,o['source_sha256'],len(o.data.polygons)) for o in cx),
 'B48':sorted((o.name,o['ORIGINAL_GAME_B48_SHA256'],len(o.data.polygons)) for o in b48),
 'B51':sorted((o.name,o['SOURCE_ORIGINAL_B51_ID']) for o in b51),
 'cameras':sorted((o.name,float(o['true_240hz_time'])) for o in cams.objects)}
assert before==after
trees=[(o,bvh(o)) for o in objs]
roadTrees=[(o,bvh(o)) for o in b48]
cxTrees=[(o,bvh(o)) for o in cx]
B48overlap=[]
CXoverlap=[]
for ob,t in trees:
    for source,st in roadTrees:
        hits=t.overlap(st)
        if hits:B48overlap.append([ob.name,source.name,len(hits)])
    for source,st in cxTrees:
        hits=t.overlap(st)
        if hits:CXoverlap.append([ob.name,source.name,len(hits)])
frames=('t1550','t1600','t1650','t1700')
movOverlap={}
sight={}
renders=[]
targets={
 'public':sample(10,51,13),
 'rail':sample(12,29,6),
 'housing':sample(13,78,31),
 'CXcontact':contact_source
}
for fi,shot in enumerate(frames,2):
    scene.frame_set(fi)
    bpy.context.view_layer.update()
    cam=cams.objects.get(shot+' REAL ORIGINAL 240HZ')
    assert cam and cam.type=='CAMERA'
    moving=[(o,bvh(o)) for o in b51]
    hit=[]
    for a,ta in trees:
        for b,tb in moving:
            cross=ta.overlap(tb)
            if cross:hit.append([a.name,b['SOURCE_ORIGINAL_B51_ID'],len(cross)])
    movOverlap[shot]=hit
    this={}
    for name,point in targets.items():
        view=world_to_camera_view(scene,cam,point)
        ray=point-cam.matrix_world.translation
        first=None
        if ray.length>2:
            for ob,tree in cxTrees+roadTrees+trees+moving:
                h,n,poly,d=tree.ray_cast(cam.matrix_world.translation,
                                        ray.normalized(),ray.length-.75)
                if h is not None and d is not None and (first is None or d<first[1]):
                    first=(ob.name,round(float(d),3))
        this[name]={'normalizedXY':[round(float(view.x),4),round(float(1-view.y),4)],
          'inFrame':bool(view.z>0 and 0<view.x<1 and 0<view.y<1),
          'clearToNearTarget':first is None,'firstOccluder':first,
          'humanLegibility':'NOT_CERTIFIED'}
    sight[shot]=this
scene['R6B_NEW_GAME_COLLIDERS']=0
scene['R6B_PRIVATE_NOT_WEBGL']=True
scene['R6B_ART']='HOLD'
scene['R6B_HUMAN']='HOLD'
scene['R6B_RELEASE']='HOLD'
scene.cycles.device='CPU'
scene.cycles.samples=6
scene.cycles.use_denoising=False
scene.view_layers[0].cycles.use_denoising=False
scene.render.threads_mode='FIXED'
scene.render.threads=2
scene.render.image_settings.file_format='PNG'
scene.frame_set(2)
blend='R6B_'+road+'_EDITABLE_PRIVATE_UNADOPTED.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
for fi,shot in enumerate(frames,2):
    scene.frame_set(fi)
    scene.camera=cams.objects.get(shot+' REAL ORIGINAL 240HZ')
    assert scene.camera
    img='R6B_'+road+'_'+shot+'_TRUE_BLENDER_NOT_WEBGL.png'
    scene.render.filepath=os.path.join(out,img)
    bpy.ops.render.render(write_still=True)
    renders.append(img)
audit={
 'schema':'dopagaki.g4e7dz-r6b-integrated-section/1','road':road,
 'originalCXBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'sourceCX':len(cx),'sourceB48':len(b48),'sourceB51':len(b51),
 'sourceCameras':len(cams.objects),'gap52':True,
 'sourceIdentityPreserved':before==after,'newEditableMeshCount':len(objs),
 'newMeshesByRole':{o.name:o['R6B_ROLE'] for o in objs},
 'R5AContact':candidate,'CXcontactPointAlignment':'POINT_ONLY_NOT_WELDED',
 'B48TriangleOverlaps':B48overlap,'CXTriangleOverlaps':CXoverlap,
 'B51FourTimeSampleTriangleOverlaps':movOverlap,
 'nativeCameraVisibilityNotArtQuality':sight,
 'originalBlenderSource':arg('--source'),'editableBlender':blend,'images':renders,
 'staticB48Clear':not B48overlap,
 'fourSnapshotB51Clear':all(not x for x in movOverlap.values()),
 'continuousTimeSafety':'NOT_PROVEN',
 'walkingAccessibility':'NOT_CERTIFIED',
 'structuralCXJoining':'NOT_CERTIFIED',
 'functionLegibility':'NOT_ASSESSED_BY_HUMAN',
 'gameNewColliders':0,'sourceGameChanged':False,
 'newCityWebGL':'NOT_RENDERED','humanPlay':'NOT_RUN',
 'officialArt':0,'officialSlope2Meters':0,
 'TECH':'LIMITED_AUDIT_REVIEW','ART':'HOLD',
 'GAMEPLAY':'HOLD','PERFORMANCE':'HOLD',
 'INTEGRATION':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
 'stopConditions':['giant wall/slope/portal appearance',
  'no readable public/transit/residential distinction',
  'original CX disconnected visually',
  'road or hazard sightlines degraded',
  'source collision or contact unsafe']}
with open(os.path.join(out,'R6B_'+road+'_AUDIT.json'),'w',encoding='utf-8') as f:
    json.dump(audit,f,indent=2,ensure_ascii=False)
print('R6B_TRUE_BLENDER_PRIVATE_ART_HOLD',road,
      'meshes',len(objs),'B48',len(B48overlap),
      'CX',len(CXoverlap),'B51 samples',{k:len(v) for k,v in movOverlap.items()})

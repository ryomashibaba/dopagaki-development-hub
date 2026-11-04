"""K4BP -- three original-source-protected DCC composition experiments.

NO official game, road tessellation, camera pose, collider, PR or main changes.

From exact K4BO editable parent, produce:
 A: research-only low road-following chase camera with ORIGINAL Road5,
 B: research-only oblique harbor sightline with ORIGINAL Road5,
 C: independent *non-game* narrow curved roadway research mesh with a clone
    of the ORIGINAL camera's exact numerical pose and lens.
Never report C as an edit to B48 or an in-game screenshot. Study camera
is duplicated. Original control/ultra and remaining camera poses unchanged.
"""
import bpy,sys,os,json,hashlib,math,struct
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
from math import sin,cos,pi

args=sys.argv[sys.argv.index('--')+1:]
def option(s):return os.path.abspath(args[args.index(s)+1])
parent=option('--base');outdir=option('--out')
os.makedirs(outdir,exist_ok=True)
PARENT_SHA='b546174d5ae5186015981f2d6b5ee40f823cb7a4f2f9ba33f07c2bbda84264e6'
def checksum(path):
 h=hashlib.sha256()
 with open(path,'rb') as f:
  for chunk in iter(lambda:f.read(1<<20),b''):h.update(chunk)
 return h.hexdigest()
assert checksum(parent)==PARENT_SHA,"K4BP PARENT NATIVE BLENDER BYTES CHANGED"
bpy.ops.wm.open_mainfile(filepath=parent)
sc=bpy.context.scene
rig=bpy.data.collections['05_CAMERA | Authentic original source poses']
cams={};roads={};roadcols={};othercols={}
for mode,tick in [('control',11307),('ultra',11341)]:
 found=[ob for ob in rig.objects if ob.type=='CAMERA' and str(tick) in ob.name]
 assert len(found)==1,(mode,[x.name for x in rig.objects])
 cams[mode]=found[0]
 col=bpy.data.collections['K4AY SOURCE B48 | '+mode.upper()+' | TRUE TESSELLATED ROAD5']
 assert len(col.objects)==1
 roadcols[mode]=col;roads[mode]=next(iter(col.objects))
 othercols[mode]=bpy.data.collections['K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | '+mode.upper()]
 assert len(othercols[mode].objects)==6
assert len([o for o in rig.objects if o.type=='CAMERA'])>=6
def fingerprint(obj):
 h=hashlib.sha256()
 for v in obj.data.vertices:
  h.update(struct.pack('<3d',*[float(c) for c in v.co]))
 for p in obj.data.polygons:
  h.update(struct.pack('<3i',*[int(i) for i in p.vertices]))
 return h.hexdigest()
mesh_before={m:fingerprint(o) for m,o in roads.items()}
assert set(mesh_before.values())=={'f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2'}
camera_before={ob.name:(tuple(ob.location),tuple(ob.rotation_euler),float(ob.data.lens))
               for ob in rig.objects if ob.type=='CAMERA'}
control=cams['control']
C=control.location.copy()
forward=control.matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((forward.x,forward.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def P(d,s,z):return C+F*d+S*s+Vector((0,0,z))
roadobj=roads['control']
inv=roadobj.matrix_world.inverted()
def ray(d,s):
 origin=inv@P(d,s,550)
 raydir=(inv.to_3x3()@Vector((0,0,-1))).normalized()
 found,p,normal,index=roadobj.ray_cast(origin,raydir,distance=1400)
 if not found:return None
 q=roadobj.matrix_world@p
 return (float(q.z-C.z),int(index))
distances=[-12,-5,0,5,10,15,20,30,40,55,70,90,110,130,150,170,180]
sections=[]
for d in distances:
 hitvalues=[s for s in range(-70,101,2) if ray(d,s) is not None]
 if len(hitvalues)<16:continue
 left,right=min(hitvalues),max(hitvalues)
 centre=ray(d,0)
 if centre is None:continue
 sections.append(dict(d=d,left=left,right=right,centreZ=centre[0],
   roadWidthApprox=right-left,hitCount=len(hitvalues)))
assert len(sections)>=15 and ray(80,0) is not None and ray(105,0) is not None
def ground(d):
 q=ray(d,0)
 if q is not None:return q[0]
 # Only used for road-side research extensions on either end.
 return min(sections,key=lambda x:abs(x['d']-d))['centreZ']

def col(name):
 c=bpy.data.collections.new('K4BP | '+name)
 sc.collection.children.link(c)
 return c
camera_collection=col('01 distinct trial camera duplicates / SOURCE NEVER MOVED')
narrow_collection=col('02 independent smaller course research geometry NOT B48')
scenery_collection=col('03 pilot narrow-course shoulder terrain NOT COLLISION')
research_materials=[]
def material(name,color,rough=.6,metal=.0,emission=0):
 m=bpy.data.materials.new('K4BP / '+name)
 m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF')
 bs.inputs['Base Color'].default_value=(*color,1)
 bs.inputs['Roughness'].default_value=rough
 bs.inputs['Metallic'].default_value=metal
 if emission:
  bs.inputs['Emission Color'].default_value=(*color,1)
  bs.inputs['Emission Strength'].default_value=emission
 research_materials.append(m)
 return m
road_blue=roads['control'].data.materials[0]
assert road_blue is not None and road_blue.use_nodes
shoulder=material('shoulder warm precision racing stone',(.27,.26,.215),.76,.10)
schist=material('authored dark coastal foliated rock',(.07,.10,.105),.88,.04)
vegetation=material('native dune grass foreground',(.061,.125,.08),.89,.01)
amber=material('glowing valid research road boundary marker',(.9,.4,.11),.44,.06,1.1)
teal=material('glowing valid research road boundary marker teal',(.07,.45,.4),.37,.14,1.1)
dark=material('independent under-track body support',(.028,.035,.040),.82,.06)
created=[]
def new_mesh(name,verts,faces,ma,target,role):
 data=bpy.data.meshes.new('K4BP / '+name+' native mesh')
 data.from_pydata([tuple(x) for x in verts],[],faces)
 data.update(calc_edges=True)
 ob=bpy.data.objects.new('K4BP / '+name,data)
 target.objects.link(ob)
 data.materials.append(ma)
 ob['K4BP_RESEARCH_ONLY']=True
 ob['NEW_GAME_COLLIDER']=False
 ob['REAL_SOURCE_B48_ROAD_CHANGED']=False
 ob['CLEARANCE_WITH_ORIGINAL_B51']='NOT_TESTED_HOLD'
 ob['ARCHITECTURAL_ROLE']=role
 created.append(ob)
 return ob
def loft(name,rows,ma,target,role):
 n=len(rows[0]);assert n>=3 and all(len(r)==n for r in rows)
 verts=[v for row in rows for v in row]
 faces=[(i*n+j,(i+1)*n+j,(i+1)*n+(j+1)%n,i*n+(j+1)%n)
        for i in range(len(rows)-1) for j in range(n)]
 faces.extend([tuple(range(n-1,-1,-1)),tuple((len(rows)-1)*n+k for k in range(n))])
 return new_mesh(name,verts,faces,ma,target,role)

def duplicate_camera(source,label,location=None,look_at=None,lens=None):
 dup=source.copy()
 dup.data=source.data.copy()
 dup.name='K4BP | EXPERIMENT CAMERA | '+label+' | UNAPPROVED'
 camera_collection.objects.link(dup)
 if location is not None:
  dup.location=location
  assert look_at is not None
  vec=Vector(look_at)-dup.location
  assert vec.length>15
  dup.rotation_euler=vec.to_track_quat('-Z','Y').to_euler()
 if lens is not None:
  dup.data.lens=float(lens)
 dup['K4BP_ONLY_RESEARCH_CAMERA']=True
 dup['NOT_ORIGINAL_SOURCE_CAMERA']=True
 dup['NOT_GAME_CAMERA']=True
 return dup

study_cams={}
# A) native wide source road but track-conscious road-following moving shot.
# The 7 m aft and 4 m lateral motion is a meaningful single-frame study;
# source camera and any original camera animated tracks are untouched.
c1=C-F*8+S*4+Vector((0,0,2.8))
target1=P(72,0,ground(72)+3.2)
study_cams['CHASE_OBLIQUE_LOW']=duplicate_camera(control,'CHASE_OBLIQUE_LOW',
 c1,target1,lens=38)
# B) present a readable coastal edge and port buildings from a lateral
# position above the true Road5, keeping the original 7-road scene.
c2=C+F*18+S*53+Vector((0,0,12))
target2=P(105,-1,ground(105)+7)
study_cams['HARBOR_3QUARTER']=duplicate_camera(control,'HARBOR_3QUARTER',
 c2,target2,lens=30)
# C) fixed-original lens/pose clone, but hide the B48 source road ONLY in
# its OWN research render and display entirely separate narrow-course art.
# This isolates geometry change (road width) from camera composition.
study_cams['NARROW_FIXED_ORIGINAL_POSE']=duplicate_camera(control,
 'NARROW_FIXED_ORIGINAL_POSE')
assert tuple(study_cams['NARROW_FIXED_ORIGINAL_POSE'].location)==tuple(control.location)
assert tuple(study_cams['NARROW_FIXED_ORIGINAL_POSE'].rotation_euler)==tuple(control.rotation_euler)
assert study_cams['NARROW_FIXED_ORIGINAL_POSE'].data.lens==control.data.lens
# D) The missing controlled 2x2 factorial: same CHASE pose on the separate
# narrow visual course; this is a CLONE of the A camera and never the source.
study_cams['CHASE_NARROW']=duplicate_camera(
 study_cams['CHASE_OBLIQUE_LOW'],'CHASE_NARROW')
assert tuple(study_cams['CHASE_NARROW'].location)==tuple(study_cams['CHASE_OBLIQUE_LOW'].location)
assert tuple(study_cams['CHASE_NARROW'].rotation_euler)==tuple(study_cams['CHASE_OBLIQUE_LOW'].rotation_euler)
assert study_cams['CHASE_NARROW'].data.lens==study_cams['CHASE_OBLIQUE_LOW'].data.lens
# This alternative road is NOT B48 road and no collisions/safety proven.
# Native 3D geometry follows measured real source centre-line terrain only
# to respect slopes, but narrow width is new artistic hypothesis.
ribbon=[]
under=[]
for d in range(-12,182,3):
 h=ground(d)
 # Consistent editable 26-m central artist's road with 3-m shoulders.
 ribbon.append([P(d,-16.4,h+.52),P(d,-13.1,h+.51),
                P(d,0,h+.50),P(d,13.1,h+.51),
                P(d,16.4,h+.52)])
 under.append([P(d,-17,h-1.7),P(d,-17,h+.43),
               P(d,17,h+.43),P(d,17,h-1.7)])
data_road=new_mesh('ALTERNATE NON_GAME 26m alpine harbor road; source mesh retained',
 [p for row in ribbon for p in row],[],road_blue,narrow_collection,
 'PURE_VISUAL_ROAD_NARROWING_NO_GAME')
n=5
faces=[]
for i in range(len(ribbon)-1):
 for k in range(4):
  faces.append((i*n+k,(i+1)*n+k,(i+1)*n+k+1,i*n+k+1))
data_road.data.from_pydata([],[],[]) if False else None
# Blender Mesh.from_pydata cannot be called twice; use explicit mesh replacement
real_vertices=[v for row in ribbon for v in row]
roadmesh=bpy.data.meshes.new('K4BP / 26m original camera study / 4 real research strips')
roadmesh.from_pydata([tuple(v) for v in real_vertices],[],faces);roadmesh.update(calc_edges=True)
old=data_road.data
data_road.data=roadmesh
bpy.data.meshes.remove(old)
roadmesh.materials.append(road_blue)
roadmesh.materials.append(shoulder)
for face in roadmesh.polygons:
 face.material_index=1 if face.index%4 in (0,3) else 0
loft('NARROW track actual sculpted structural base',
 under,dark,narrow_collection,'ART_CONCEPT_NOT_COLLIDER')
# Research side terraces designed as a spatial landscape, not two
# repetitive 100m white boxes. Source buildings remain in the scene, but
# their original proof does not imply interaction with a new track.
for side,name in [(-1,'WEST'),(1,'EAST')]:
 low=[];hill=[];top=[]
 for d in range(-12,182,3):
  h=ground(d)
  side_noise=1.7*sin(d*.13+(1 if side<0 else 2.3))
  near=side*16.5
  far=side*(57+4*sin(d*.05))
  low.append([P(d,near,h+.25),
              P(d,near+side*5,h-.45),
              P(d,near+side*12,h+1.1+side_noise*.13),
              P(d,near+side*26,h+3.8+side_noise),
              P(d,far,h+8+2*sin(d*.07))])
  hill.append([P(d,near+side*25,h+3.5+side_noise),
               P(d,far,h+7+2*sin(d*.07)),
               P(d,far+side*20,h+13+3*sin(d*.04)),
               P(d,far+side*33,h+11+4*sin(d*.03))])
  top.append([P(d,near+side*4,h+.72),
              P(d,near+side*10,h+.6),
              P(d,near+side*12,h+1.1),
              P(d,near+side*4,h+1.1)])
 # 5-point local contour shell
 loft(name+' independent rock garden narrowed track edge',
      low,schist,scenery_collection,'NONPLAYABLE_GEOSCULPTED_COAST')
 loft(name+' living non-game escarpment beyond track',
      hill,vegetation,scenery_collection,'SCENIC_TERRAIN_ONLY')
 loft(name+' three-dimensional public traffic gutter',
      top,shoulder,scenery_collection,'VISUAL_TRACK_SHOULDER')
# World-to-camera proof: source Road5 screen geometry vs proposed options.
sample_d=[5,10,15,20,30,40,55,70,90,110,130,150,170]
metrics={}
for label,camera in [('ORIGINAL_CONTROL_11307',control)]+list(study_cams.items()):
 samples=[]
 for d in sample_d:
  z=ray(d,0)
  if z is None:continue
  uv=world_to_camera_view(sc,camera,P(d,0,z[0]))
  samples.append({'d':d,'screenX':round(float(uv.x),6),
                  'screenYBottomUp':round(float(uv.y),6),
                  'depth':round(float(uv.z),4),
                  'inFrame':bool(0<=uv.x<=1 and 0<=uv.y<=1 and uv.z>0)})
 far_start=next((x for x in samples if x['d']==70),None)
 far_end=next((x for x in samples if x['d']==170),None)
 assert far_start is not None and far_end is not None
 metrics[label]={
   'cameraPos':list(camera.location),
   'cameraEuler':list(camera.rotation_euler),
   'lensMm':camera.data.lens,
   'samples':samples,
   'sourceRoadCenterlineScreenYSpread70to170':
     round(abs(far_end['screenYBottomUp']-far_start['screenYBottomUp']),6),
   'sourceRoadInFrameCount':sum(x['inFrame'] for x in samples)}
assert metrics['ORIGINAL_CONTROL_11307']['sourceRoadCenterlineScreenYSpread70to170']<.05

# source meshes and all original cameras are byte/numerically untouched.
def assert_protected():
 assert mesh_before=={k:fingerprint(o) for k,o in roads.items()}
 after={ob.name:(tuple(ob.location),tuple(ob.rotation_euler),float(ob.data.lens))
        for ob in rig.objects if ob.type=='CAMERA'}
 assert camera_before==after
assert_protected()

sc.render.engine='BLENDER_EEVEE'
sc.render.resolution_x=1440;sc.render.resolution_y=900
sc.render.resolution_percentage=100
sc.render.image_settings.file_format='PNG'
try:sc.view_settings.view_transform='Filmic'
except Exception:pass
try:sc.view_settings.look='Medium High Contrast'
except Exception:pass
# A and B: exact original full 7 B48 geometry (research camera only).
# C: original control Road5 temporarily render hidden, concept road shown.
def visibility(narrow=False):
 for n,c in roadcols.items():c.hide_render=(n!='control') or narrow
 for n,c in othercols.items():c.hide_render=(n!='control') or narrow
 for o in roads.values():o.hide_render=narrow
 narrow_collection.hide_render=not narrow
 scenery_collection.hide_render=not narrow
 for coll in bpy.data.collections:
  if 'K4AY SOURCE B51 OBB PROXIES' in coll.name:coll.hide_render=True
  if narrow and coll.name.startswith(('K4BO | 01','K4BO | 02','K4BN | 08')):
   coll.hide_render=True
  elif not narrow and coll.name.startswith(('K4BO | 01','K4BO | 02','K4BN | 08')):
   coll.hide_render=False
 bpy.context.view_layer.update()
shots=[]
for label,cam in study_cams.items():
 narrow=label in ('NARROW_FIXED_ORIGINAL_POSE','CHASE_NARROW')
 visibility(narrow)
 sc.camera=cam
 fn='K4BP_'+label+'_RESEARCH_ONLY_NATIVE_DCC_NOT_GAME.png'
 sc.render.filepath=os.path.join(outdir,fn)
 bpy.ops.render.render(write_still=True)
 shots.append({'scenario':label,'cameraIsOriginal':False,
               'originalRoad5Rendered':not narrow,
               'alternativeRoadVisualOnly':narrow,'file':fn})
# Reopen the original native geometry for independent study and future work.
visibility(False)
sc.camera=control
assert_protected()
blend='K4BP_CONTROLLED_CAMERA_AND_ALTERNATE_ROAD_EDITABLE_RESEARCH_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(outdir,blend))
files={}
for fn in [blend]+[x['file'] for x in shots]:
 path=os.path.join(outdir,fn)
 size=os.stat(path).st_size
 assert size>30000,(fn,size)
 files[fn]={'bytes':size,'sha256':checksum(path)}
report={
 'schema':'dopagaki.K4BP.controlled-2x2-camera-and-road-factorial/2',
 'verifiedParentK4BOBlendSHA256':PARENT_SHA,
 'frozenOriginalGameGitBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'originalRoad5VertexFaceFingerprintUnchanged':True,
 'allSixOriginalSourceCameraPosesLensUnchanged':True,
 'originalB48RoadCount':7,'originalB51MoverCount':28,
 'originalPhysicsHz':240,'originalBallRadiusMetres':.65,
 'originalRoad5MeasuredSections':sections,
 'originalSourceAndThreeResearchCameraMetrics':metrics,
 'researchScenarios':shots,
 'narrowResearchTrackHalfWidthMetres':13.1,
 'narrowRoadIsNewIndependentNonGameVisualMesh':True,
 'newGameCollisionCount':0,'gameSourceEdited':False,
 'trueWebGL2GameScreenshot':False,
 'formalArtAcceptedCount':0,'formalSlope2DNAMetres':0,
 'SOURCE_TECH':'PASS','ART':'UNJUDGED_HOLD',
 'SAT':'HOLD','CCD':'HOLD','FPS':'HOLD','HUMAN':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
 'files':files
}
with open(os.path.join(outdir,'K4BP_SOURCE_AND_RESEARCH_CAMERAS_PROVENANCE.json'),'w') as f:
 json.dump(report,f,ensure_ascii=False,indent=2)
print('K4BP_ORIGINAL_B48_SOURCE_PROTECTED_3_RESEARCH_RENDER_NOT_ART_APPROVED',
 json.dumps({'frames':shots,'projectedRoadY70to170':{k:x['sourceRoadCenterlineScreenYSpread70to170']
 for k,x in metrics.items()}},ensure_ascii=False))

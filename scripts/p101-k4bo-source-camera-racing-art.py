"""K4BO actual camera-visibility-led racing-livery & coastal track art.

Work from verified K4BN native original. Preserve every fixed B48/B51
game entity, all six original source cameras and Road5 source tessellation.
Only Blender research paint nodes, authored slender road furniture and
native DCC inspection. Absolutely no playable geometry changes.
"""
import bpy,os,sys,json,hashlib,struct,math
from math import sin,pi
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
argv=sys.argv[sys.argv.index('--')+1:]
def argument(name):return os.path.abspath(argv[argv.index(name)+1])
parent,atlas,outdir=argument('--base'),argument('--atlas'),argument('--out')
os.makedirs(outdir,exist_ok=True)
def checksum(path):
 h=hashlib.sha256()
 with open(path,'rb') as f:
  for raw in iter(lambda:f.read(1<<20),b''):h.update(raw)
 return h.hexdigest()
PARENT_SHA='fb98af8bccb84c9a6eaf18cabc8444135c5df99df267a5a7562c99c1fbe96a37'
assert checksum(parent)==PARENT_SHA
bpy.ops.wm.open_mainfile(filepath=parent)
sc=bpy.context.scene
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
cams={};roads={};roadcols={};six={}
for mode,tick in (('control',11307),('ultra',11341)):
 ca=[o for o in rig.objects if o.type=='CAMERA' and str(tick) in o.name]
 assert len(ca)==1
 cams[mode]=ca[0]
 col=bpy.data.collections["K4AY SOURCE B48 | "+mode.upper()+" | TRUE TESSELLATED ROAD5"]
 assert len(col.objects)==1
 roadcols[mode]=col;roads[mode]=next(iter(col.objects))
 six[mode]=bpy.data.collections["K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | "+mode.upper()]
 assert len(six[mode].objects)==6
def fingerprint(obj):
 h=hashlib.sha256()
 for v in obj.data.vertices:
  h.update(struct.pack("<3d",*[float(x) for x in v.co]))
 for f in obj.data.polygons:
  h.update(struct.pack("<3i",*[int(i) for i in f.vertices]))
 return h.hexdigest()
source_geo={k:fingerprint(v) for k,v in roads.items()}
assert set(source_geo.values())=={'f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2'}
camera_before={k:(tuple(v.location),tuple(v.rotation_euler),float(v.data.lens)) for k,v in cams.items()}
C=cams['control'].location.copy()
fr=cams['control'].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((fr.x,fr.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def P(d,s,z):return C+F*d+S*s+Vector((0,0,z))
road=roads['control']
inverse=road.matrix_world.inverted()
def hit(d,s):
 orig=inverse@P(d,s,600)
 dr=(inverse.to_3x3()@Vector((0,0,-1))).normalized()
 found,local,normal,face=road.ray_cast(orig,dr,distance=1500)
 if not found:return None
 pt=road.matrix_world@local
 return (float(pt.z-C.z),int(face))
# Actual road width and true original-camera screen projection by frame.
cross_sections=[]
source_projection=[]
for d in (-20,0,5,10,15,20,30,40,55,70,90,110,130,150,170):
 hits=[s for s in range(-85,106,2) if hit(d,s) is not None]
 if len(hits)<20:continue
 lo,hi=min(hits),max(hits)
 cross_sections.append({'d':d,'roadLeft':lo,'roadRight':hi,'rayHits':len(hits)})
 for s in (lo+4,0,hi-4):
  z=hit(d,s)
  if z is None:continue
  uv=world_to_camera_view(sc,cams['control'],P(d,s,z[0]))
  source_projection.append({
   'd':d,'s':s,'screenX':round(float(uv.x),5),
   'screenYBottomUp':round(float(uv.y),5),
   'depth':round(float(uv.z),3),'withinFrame':bool(0<=uv.x<=1 and 0<=uv.y<=1 and uv.z>0)})
assert len(cross_sections)>=13
assert len(source_projection)>=27
def bounds(d):
 result=min(cross_sections,key=lambda c:abs(c['d']-d))
 return result['roadLeft'],result['roadRight']

# Instead of painting everything in the renderer's image-plane, this is a
# unique real road-surface decal mapped by forward/lateral 3D metres. New
# original color graphic comes from GitHub source-controlled Pillow script.
image=bpy.data.images.load(atlas,check_existing=False)
image.name='K4BO | GENUINE ORIGINAL FOREGROUND SPEED RHYTHM'
image.pack()
atlas_sha=checksum(atlas)
all_materials={}
for obj in roads.values():
 mat=obj.data.materials[0]
 all_materials[mat.as_pointer()]=mat
assert len(all_materials)==1
for material in all_materials.values():
 assert material.use_nodes
 nodes=material.node_tree.nodes; links=material.node_tree.links
 bs=nodes.get('Principled BSDF');assert bs is not None
 assert len(bs.inputs['Base Color'].links)==1
 src=bs.inputs['Base Color'].links[0].from_socket
 # Granular graphite-navy tint, keeping the original asphalt road physics
 # and its prior material micro-Bump. Does not alter source Road5 mesh.
 grade=nodes.new('ShaderNodeMixRGB');grade.label='K4BO blue-grey marine asphalt color discipline'
 grade.blend_type='MULTIPLY';grade.inputs[0].default_value=.52
 links.new(src,grade.inputs[1])
 grade.inputs[2].default_value=(.42,.64,.78,1)
 geom=nodes.new('ShaderNodeNewGeometry')
 def project(axis,offset,length):
  dot=nodes.new('ShaderNodeVectorMath');dot.operation='DOT_PRODUCT'
  links.new(geom.outputs['Position'],dot.inputs[0])
  dot.inputs[1].default_value=tuple(axis)
  sub=nodes.new('ShaderNodeMath');sub.operation='SUBTRACT'
  links.new(dot.outputs['Value'],sub.inputs[0])
  sub.inputs[1].default_value=float(C.dot(axis))
  add=nodes.new('ShaderNodeMath');add.operation='ADD'
  links.new(sub.outputs[0],add.inputs[0])
  add.inputs[1].default_value=float(offset)
  div=nodes.new('ShaderNodeMath');div.operation='DIVIDE'
  links.new(add.outputs[0],div.inputs[0])
  div.inputs[1].default_value=float(length)
  return div.outputs[0]
 coords=nodes.new('ShaderNodeCombineXYZ')
 links.new(project(S,75,180),coords.inputs[0])
 links.new(project(F,60,265),coords.inputs[1])
 tex=nodes.new('ShaderNodeTexImage');tex.image=image
 tex.extension='CLIP';tex.interpolation='Linear'
 tex.label='K4BO original forward distance 0-180 racing livery'
 links.new(coords.outputs[0],tex.inputs['Vector'])
 scale=nodes.new('ShaderNodeMath');scale.operation='MULTIPLY'
 links.new(tex.outputs['Alpha'],scale.inputs[0]);scale.inputs[1].default_value=.92
 mix=nodes.new('ShaderNodeMixRGB');mix.blend_type='MIX'
 links.new(scale.outputs[0],mix.inputs[0])
 links.new(grade.outputs[0],mix.inputs[1])
 links.new(tex.outputs['Color'],mix.inputs[2])
 links.new(mix.outputs[0],bs.inputs['Base Color'])

# Research-only low-profile road-edge luminous speed fins. Different
# silhouette and actual primary function from previous giant skybridges,
# columns and cranes. Their placement is SOURCE road bounds, never guessed.
def collection(name):
 c=bpy.data.collections.new('K4BO | '+name)
 sc.collection.children.link(c);return c
roadside=collection('01 genuine low-edge aerofoil guide furniture')
details=collection('02 actual road-distance human scale reflectors')
materials=[]
def material(name,color,metal=.2,rough=.3,em=.0):
 m=bpy.data.materials.new('K4BO / '+name)
 m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF')
 p.inputs['Base Color'].default_value=(*color,1)
 p.inputs['Metallic'].default_value=metal
 p.inputs['Roughness'].default_value=rough
 if em:
  p.inputs['Emission Color'].default_value=(*color,1)
  p.inputs['Emission Strength'].default_value=em
 materials.append(m);return m
metal=material('track-tactile neutral titanium',(.22,.26,.27),.68,.35)
cyan=material('coastal turquoise illuminated wayfinding',(.052,.51,.46),.36,.29,1.05)
amber=material('amber painted public course guidance',(.92,.41,.105),.42,.38,.85)
black=material('recessed basalt-graphite light housing',(.028,.04,.044),.16,.78)
objs=[]
def mesh(name,verts,faces,ma,col,role):
 me=bpy.data.meshes.new('K4BO / '+name+' authored surface')
 me.from_pydata([tuple(v) for v in verts],[],faces);me.update(calc_edges=True)
 ob=bpy.data.objects.new('K4BO / '+name,me);col.objects.link(ob);me.materials.append(ma)
 ob['DCC_ONLY']=True;ob['NEW_GAME_COLLIDER']=False
 ob['SOURCE_B51_CLEARANCE']='NOT_TESTED';ob['FUNCTIONAL_ROLE']=role
 objs.append(ob);return ob
def loft(name,rows,ma,col,role):
 n=len(rows[0]);assert n>=3 and all(len(r)==n for r in rows)
 verts=[p for row in rows for p in row]
 faces=[(i*n+j,(i+1)*n+j,(i+1)*n+(j+1)%n,i*n+(j+1)%n)
        for i in range(len(rows)-1) for j in range(n)]
 faces.extend([tuple(range(n-1,-1,-1)),tuple((len(rows)-1)*n+i for i in range(n))])
 return mesh(name,verts,faces,ma,col,role)
def rail(name,pts,radius,ma,col,role):
 pts=[Vector(p) for p in pts];n=7
 rows=[]
 for i,p in enumerate(pts):
  direction=(pts[min(i+1,len(pts)-1)]-pts[max(i-1,0)]).normalized()
  axis=Vector((0,0,1))
  if abs(direction.dot(axis))>.9:axis=Vector((1,0,0))
  a=direction.cross(axis).normalized();b=direction.cross(a).normalized()
  rows.append([p+radius*(a*math.cos(2*pi*k/n)+b*math.sin(2*pi*k/n)) for k in range(n)])
 return loft(name,rows,ma,col,role)
pylon_stats=[]
for side,name in ((-1,'WEST'),(1,'EAST')):
 for i,d in enumerate((10,32,56,82,110,140,164)):
  lo,hi=bounds(d);base_s=lo-7 if side<0 else hi+7
  hit_at=hit(d,lo+4 if side<0 else hi-4)
  assert hit_at is not None
  h=hit_at[0]
  # Author a slim aerofoil that has actual depth and tapers with height,
  # avoids the earlier gigantic featureless sidewalls.
  rows=[]
  for j,z in enumerate((0,1.4,3.4,5.8,7.5)):
   t=j/4
   dd=d+1.6*t*t
   sx=base_s+side*(.7*sin(t*pi))
   rad=1.4*(1-.76*t)
   rows.append([P(dd-1.6+1.0*t,sx,h+z),
                P(dd+.4+1.2*t,sx+side*rad,h+z),
                P(dd+1.45+1.5*t,sx,h+z),
                P(dd+.2,sx-side*.32*rad,h+z)])
  loft(name+' source road-shaped aerodynamic guide '+str(i),
       rows,metal,roadside,'RACE_ROUTE_HUMAN_READABLE_BLADE_NOT_COLLIDER')
  rail(name+' illuminated forward-facing aerofoil inlay '+str(i),
       [row[2] for row in rows],
       .10,cyan if side<0 else amber,roadside,
       'NATIVE_DCC_LIGHTING_REFERENCE_ONLY')
  pylon_stats.append({'side':name,'d':d,'worldLateral':base_s,'groundHeight':round(h,4)})
 # Separate source-road marginal walkway light line:
 # it is never presented as collision-safe clearance.
 pts=[]
 for d in range(4,168,5):
  lo,hi=bounds(d)
  s=lo-4.8 if side<0 else hi+4.8
  hh=hit(d,lo+5 if side<0 else hi-5)
  if hh is not None:pts.append(P(d,s,hh[0]+1.3))
 if len(pts)>=20:
  rail(name+' distant world-scale edge race illumination',
       pts,.17,cyan if side<0 else amber,details,
       'CINEMATIC_ROADSIDE_INLAY_NOT_PLAYABLE')

# Preserve numerical source-camera poses and original road triangle data;
# this is DCC editable styling only, not a WebGL game frame.
assert source_geo=={k:fingerprint(v) for k,v in roads.items()}
assert camera_before=={k:(tuple(v.location),tuple(v.rotation_euler),float(v.data.lens)) for k,v in cams.items()}
def render_mode(mode):
 for name,col in roadcols.items():col.hide_render=name!=mode
 for name,col in six.items():col.hide_render=name!=mode
 for ob in roads.values():ob.hide_render=False
 for col in bpy.data.collections:
  if 'K4AY SOURCE B51 OBB PROXIES' in col.name:col.hide_render=True
 bpy.context.view_layer.update()
sc.render.engine='BLENDER_EEVEE'
sc.render.resolution_x=1440;sc.render.resolution_y=900
sc.render.resolution_percentage=100
sc.render.image_settings.file_format='PNG'
sc.view_settings.exposure=-.12
shots=[]
for mode,tick in (('control',11307),('ultra',11341)):
 render_mode(mode);sc.camera=cams[mode]
 name='K4BO_'+mode.upper()+'_'+str(tick)+'_TRUE_SOURCE_CAMERA_ART_UNJUDGED.png'
 sc.render.filepath=os.path.join(outdir,name)
 bpy.ops.render.render(write_still=True)
 shots.append({'mode':mode,'tick':tick,'file':name})
render_mode('control');sc.camera=cams['control']
blend='K4BO_EDITABLE_GROUND_TRUTHED_VELOCITY_DCC_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(outdir,blend))
files={}
for name in [blend]+[x['file'] for x in shots]:
 path=os.path.join(outdir,name)
 assert os.path.getsize(path)>50000
 files[name]={'bytes':os.path.getsize(path),'sha256':checksum(path)}
audit={
 'schema':'dopagaki.K4BO.true-source-frustum-grounded-racing-art/1',
 'parentK4BNNativeEditableBlendSHA256':PARENT_SHA,
 'raceGraphicRGBAatlasPacked':True,
 'raceGraphicSHA256':atlas_sha,
 'frozenOriginalGameSourceGitBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'road5OriginalGeometryPreserved':source_geo=={k:fingerprint(v) for k,v in roads.items()},
 'sourceCameraNumericalPosesPreserved':camera_before=={k:(tuple(v.location),tuple(v.rotation_euler),float(v.data.lens)) for k,v in cams.items()},
 'sourceRoadSamples':cross_sections,'cameraProjectionTrueOriginalPose':source_projection,
 'sourceB48Roads':7,'sourceB51Movers':28,'originalPhysicsHz':240,
 'originalBallRadiusMetres':.65,
 'newDCCOnlyAerofoilGuideCount':len(objs),'pylonSurvey':pylon_stats,
 'newPlayableColliders':0,'gameSourceEdited':False,
 'actualWebGL2GameCapture':False,
 'artJudgement':'UNJUDGED_HOLD','formallyAdoptedArt':0,'formalSlope2DNAMetres':0,
 'HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD','FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
 'originalSourceCameraDCCImages':shots,'files':files
}
with open(os.path.join(outdir,'K4BO_SOURCE_FRAME_AND_RACING_ART_PROVENANCE.json'),'w') as f:
 json.dump(audit,f,indent=2,ensure_ascii=False)
print('K4BO_NATIVE_ORIGINAL_CAMERA_TECH_ART_HOLD',
 json.dumps({'sourceSamples':cross_sections,
             'nearScreenProjections':[x for x in source_projection if x['s']==0],
             'guidePylons':len(pylon_stats),
             'originalGeometryPreserved':audit['road5OriginalGeometryPreserved']}))

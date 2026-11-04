"""K4BY: true licensed PBR race-road surface and one repaired occupied harbor hall.

Not a screenshot manipulation: starts from the SHA-pinned K4BX A3 Blender
DCC native, edits only RESEARCH surface/material/architecture, saves
editable .blend, renders exactly one frozen CHASE 768x480 image.
Formal Game Road5/physics/six cameras and origin remain untouched.
"""
import bpy,hashlib,json,struct,sys,math
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

args=sys.argv[sys.argv.index('--')+1:]
def arg(flag):return Path(args[args.index(flag)+1]).resolve()
BASE=arg('--base');ASSETS=arg('--assets');OUT=arg('--out');OUT.mkdir(parents=True,exist_ok=True)
BASE_SHA='1cdf3233d3b2b91b1e10b6f7b2212ef9ec74331667ca4129a4e96ce43b4c2179'
GAME_BLOB='af076d67492a677d2235e4730aef8cdf4808e106'
ROAD_SHA='f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2'
def sha(path):
 h=hashlib.sha256()
 with open(path,'rb') as stream:
  for b in iter(lambda:stream.read(1<<20),b''):h.update(b)
 return h.hexdigest()
assert sha(BASE)==BASE_SHA,'K4BX genuine parent Blender differs'
receipt=json.loads((ASSETS/'K4BY_ASPHALT_TRACK_OFFICIAL_PBR_VERIFIED.json').read_text())
assert receipt['assetId']=='asphalt_track' and receipt['license']=='CC0' and receipt['resolution']=='2k'
assert set(receipt['maps'])=={'diff','rough','nor_gl'} and receipt['costJPY']==0
for kind,meta in receipt['maps'].items():
 p=ASSETS/meta['localName']
 assert p.is_file() and p.stat().st_size==meta['bytes'] and sha(p)==meta['sha256']
 assert meta['vendorMD5Pass']

bpy.ops.wm.open_mainfile(filepath=str(BASE))
sc=bpy.context.scene
rig=bpy.data.collections['05_CAMERA | Authentic original source poses']
def poses():
 return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
         for o in rig.objects if o.type=='CAMERA'}
oldposes=poses();assert len(oldposes)>=6
cams=[o for o in bpy.data.objects if o.type=='CAMERA' and o.name.startswith('K4BP | EXPERIMENT CAMERA | CHASE_NARROW |')]
assert len(cams)==1
cam=cams[0];oldcam=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
source=[]
for k in ('CONTROL','ULTRA'):
 co=bpy.data.collections['K4AY SOURCE B48 | '+k+' | TRUE TESSELLATED ROAD5']
 assert len(co.objects)==1
 source.append(next(iter(co.objects)))
def fingerprint(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack('<3d',*[float(x) for x in v.co]))
 for p in o.data.polygons:h.update(struct.pack('<3i',*[int(i) for i in p.vertices]))
 return h.hexdigest()
assert {fingerprint(x) for x in source}=={ROAD_SHA}
oldtrees=[o for o in bpy.data.objects if o.name.startswith('K4BS | genuine CC0 scanned pine tree ')]
canopies=[o for o in bpy.data.objects if o.name.startswith('K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY')]
assert len(oldtrees)==8 and len(canopies)==1
old_tree_matrices={x.name:tuple(tuple(row) for row in x.matrix_world) for x in oldtrees+canopies}
c11307=[o for o in rig.objects if o.type=='CAMERA' and '11307' in o.name]
assert len(c11307)==1
C=c11307[0].location.copy()
look=c11307[0].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((look.x,look.y,0)).normalized()
S=Vector((-F.y,F.x,0))

# The physics Road5 objects are NEVER edited. K4BW research-only skin
# receives true 2K CC0 photogrammetry derived PBR materials, UVs from
# actual world metres, with no random warped/generated texcoords.
skin=[x for x in bpy.data.objects if x.name.startswith('K4BW | continuous source-sampled procedural road patina surface')]
assert len(skin)==1
skin=skin[0]
assert skin.get('NOT_GAME_COLLIDER') is True and skin.get('RESEARCH_DCC_ONLY') is True
assert len(skin.data.polygons)>100
skin_uv=skin.data.uv_layers.get('K4BY | verified actual metres UV')
if not skin_uv:skin_uv=skin.data.uv_layers.new(name='K4BY | verified actual metres UV')
for poly in skin.data.polygons:
 for li in poly.loop_indices:
  p=skin.matrix_world@skin.data.vertices[skin.data.loops[li].vertex_index].co
  r=p-C
  skin_uv.data[li].uv=(float(r.dot(S))/2.0,float(r.dot(F))/2.0)
realmat=bpy.data.materials.new('K4BY | genuine CC0 Asphalt Track 2K road PBR study')
realmat.use_nodes=True
nodes=realmat.node_tree.nodes;nodes.clear();lk=realmat.node_tree.links
out=nodes.new('ShaderNodeOutputMaterial');pr=nodes.new('ShaderNodeBsdfPrincipled')
pr.inputs['Metallic'].default_value=0.0
lk.new(pr.outputs['BSDF'],out.inputs['Surface'])
uv=nodes.new('ShaderNodeUVMap');uv.uv_map=skin_uv.name
loaded={}
for kind,meta in receipt['maps'].items():
 p=ASSETS/meta['localName']
 raw=p.read_bytes();assert hashlib.sha256(raw).hexdigest()==meta['sha256']
 image=bpy.data.images.load(str(p),check_existing=False)
 image.colorspace_settings.name='sRGB' if kind=='diff' else 'Non-Color'
 # In headless Blender has_data may be lazy/False: pack exact bytes,
 # and read back independent packed bytes, not a fictitious loaded flag.
 image.pack(data=raw,data_len=len(raw))
 assert image.packed_file is not None
 assert hashlib.sha256(bytes(image.packed_file.data)).hexdigest()==meta['sha256']
 tex=nodes.new('ShaderNodeTexImage');tex.image=image;tex.extension='REPEAT'
 lk.new(uv.outputs['UV'],tex.inputs['Vector'])
 loaded[kind]=(image,tex)
col=nodes.new('ShaderNodeMixRGB')
col.blend_type='MIX';col.inputs[0].default_value=.84
col.inputs[1].default_value=(.17,.175,.18,1)
lk.new(loaded['diff'][1].outputs['Color'],col.inputs[2])
lk.new(col.outputs['Color'],pr.inputs['Base Color'])
rough=nodes.new('ShaderNodeMapRange')
rough.inputs['From Min'].default_value=0
rough.inputs['From Max'].default_value=1
rough.inputs['To Min'].default_value=.62
rough.inputs['To Max'].default_value=.94
lk.new(loaded['rough'][1].outputs['Color'],rough.inputs['Value'])
lk.new(rough.outputs['Result'],pr.inputs['Roughness'])
normal=nodes.new('ShaderNodeNormalMap')
normal.space='TANGENT';normal.inputs['Strength'].default_value=.32
normal.uv_map=skin_uv.name
lk.new(loaded['nor_gl'][1].outputs['Color'],normal.inputs['Color'])
lk.new(normal.outputs['Normal'],pr.inputs['Normal'])
original_skin_mat=skin.data.materials[0].name
skin.data.materials[0]=realmat
skin['K4BY_GENUINE_CC0_2K_ASPHALT']='https://polyhaven.com/a/asphalt_track'
skin['K4BY_VIRTUAL_SURFACE_NOT_PHYSICS']=True

# Repair the EXISTING primary waterfront public hall rather than adding
# more toy-looking block buildings to the distant scene. Solidify the
# actual authored canopy and correct its exposed eaves.
coll=bpy.data.collections.new('K4BY | one occupied harbor hall | DCC visual only')
sc.collection.children.link(coll)
added=[]

# A1 genuine screenshot rejected the persistent wedge/triangle along the
# prior K4BW virtual road skin. That artifact was already visible in the
# K4BX A3 baseline and became black under the authentic PBR shader.
# Keep it editable but NOT rendered, and coat an exact GEOMETRY DUPLICATE
# of the true original source Road5. This is an independent virtual
# rendering mesh and has no collider/physics and no actual Road5 edits.
skin.hide_render=True
parent_road=source[0]
coating=parent_road.copy()
coating.data=parent_road.data.copy()
coating.name='K4BY | genuine Road5 topology photo pavement proxy | NO GAME COLLIDER'
coll.objects.link(coating)
coating.matrix_world=parent_road.matrix_world.copy()
coating.matrix_world.translation.z+=.027
coating['NOT_GAME_COLLIDER']=True
coating['RESEARCH_DCC_ONLY']=True
coating['AUTHENTIC_SOURCE_ROAD5_GEOMETRY_SHA256']=ROAD_SHA
assert fingerprint(coating)==ROAD_SHA
# Preserve SOURCE geometry and use its real material on vertical faces,
# photo asphalt ONLY on up-facing actual original pavement polygons.
old_source_material=parent_road.data.materials[0] if parent_road.data.materials else None
coating.data.materials.clear()
coating.data.materials.append(realmat)
coating.data.materials.append(old_source_material if old_source_material else realmat)
upfaces=0
for poly in coating.data.polygons:
 world_normal=coating.matrix_world.to_3x3()@poly.normal
 poly.material_index=0 if world_normal.z>.50 else 1
 if poly.material_index==0:upfaces+=1
assert upfaces>30,('no authentic upward asphalt road faces',upfaces)
cuv=coating.data.uv_layers.get('K4BY | source road full-width PBR UV')
if not cuv:cuv=coating.data.uv_layers.new(name='K4BY | source road full-width PBR UV')
for poly in coating.data.polygons:
 for li in poly.loop_indices:
  p=coating.matrix_world@coating.data.vertices[coating.data.loops[li].vertex_index].co
  off=p-C
  cuv.data[li].uv=(float(off.dot(S))/2.0,float(off.dot(F))/2.0)
uv.uv_map=cuv.name
normal.uv_map=cuv.name
added.append(coating)
def material(name,color,rough=.79,metal=0):
 m=bpy.data.materials.new('K4BY | '+name);m.diffuse_color=(*color,1)
 m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF')
 p.inputs['Base Color'].default_value=(*color,1)
 p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
 return m
limestone=material('local load-bearing limestone plinth',(.40,.37,.29),.87)
fir=material('weathered timber structure and entrance',(.28,.23,.16),.78)
bronze=material('patinated zinc flashing and fascia',(.16,.26,.25),.45,.32)
tinted=material('dark deep recessed portal glazing',(.045,.11,.14),.14,.22)
doorframe=material('dark bronze sealed mullion',(.13,.15,.14),.4,.58)
def mesh(name,verts,faces,mat,kind):
 data=bpy.data.meshes.new('K4BY | '+name)
 data.from_pydata([tuple(v) for v in verts],[],faces);data.update()
 ob=bpy.data.objects.new('K4BY | '+name,data)
 coll.objects.link(ob);data.materials.append(mat)
 ob['RESEARCH_DCC_ONLY']=True;ob['NOT_GAME_COLLIDER']=True;ob['OCCUPIED_BUILDING_FUNCTION']=kind
 added.append(ob);return ob
def quad(name,verts,mat,kind):
 return mesh(name,verts,[(0,1,2,3)],mat,kind)
def tube(name,a,b,r,mat,kind):
 axis=b-a;assert axis.length>.07
 f=axis.normalized();u=f.cross(Vector((0,0,1)))
 if u.length<.01:u=f.cross(Vector((1,0,0)))
 u.normalize();v=f.cross(u).normalized()
 verts=[]
 for pt in (a,b):
  for i in range(8):
   t=2*math.pi*i/8
   verts.append(pt+r*(math.cos(t)*u+math.sin(t)*v))
 faces=[tuple(range(7,-1,-1)),tuple(range(8,16))]
 for i in range(8):faces.append((i,(i+1)%8,(i+1)%8+8,i+8))
 return mesh(name,verts,faces,mat,kind)
roof=[o for o in bpy.data.objects if o.name.startswith('K4BW | folded coastal museum and boat service canopy shell')]
assert len(roof)==1
roof=roof[0]
rpts=[roof.matrix_world@v.co for v in roof.data.vertices]
assert len(rpts)==275,('expected previous authored real folded roof',len(rpts))
centroid=sum(rpts,Vector())/len(rpts)
pier=[o for o in bpy.data.objects if o.name.startswith('K4BW | galvanized slender structural pier')]
assert len(pier)==12 or len(pier)==14,(len(pier),[o.name for o in pier])
baseZ=min(float((o.matrix_world@v.co).z) for o in pier for v in o.data.vertices)
base=Vector((centroid.x,centroid.y,baseZ))
roof_z=min(float(x.z) for x in rpts)
assert 6.0<roof_z-baseZ<11.2,(roof_z,baseZ)
def at(along,side,height):
 return base+F*along+S*side+Vector((0,0,height))
so=roof.modifiers.new('K4BY actual folded load-bearing roof sheet 0.28m','SOLIDIFY')
so.thickness=.28;so.offset=-1
bev=roof.modifiers.new('K4BY metal rolled weatherproof hem','BEVEL')
bev.width=.045;bev.segments=2
# A continuous front and rear eave anchored to the existing true roof
# control points. This is flashing, not decorative floating guardrails.
for idx,name in ((0,'seaward'),(10,'landward')):
 v0=[];v1=[]
 for i in range(25):
  p=rpts[i*11+idx]
  v0.append(p);v1.append(p-Vector((0,0,.41)))
 verts=[]
 for x,y in zip(v0,v1):verts.extend((x,y))
 fs=[(2*i,2*i+2,2*i+3,2*i+1) for i in range(24)]
 mesh(name+' continuous under-roof rolled zinc fascia',verts,fs,bronze,'WEATHER_SEALED_EAVE')

# Exactly one main visible glazed frontage is given an actual solid
# parapet, an entrance bay without glass glued over it, and a clerestory
# wall under the folded roof. Camera-facing side is chosen from real
# physical camera proximity; original glazing is kept but door bay OFF.
s_front=min((-5.85,5.85),key=lambda ss:(at(0,ss,0)-cam.location).length)
row=0 if s_front<0 else 1
glass_bay=[o for o in bpy.data.objects
 if o.name.startswith(f'K4BW | maritime hall floor to clerestory glazed bay {row} 5')]
assert len(glass_bay)==1,('original doorway bay not found',row)
glass_bay[0].hide_render=True
s=s_front+(-.12 if s_front<0 else .12)
# Place only structural continuous treatments, no multiplication of
# repeated cube-shaped architecture.
quad('honest seawall parapet behind public glazed facade',
 [at(-12,s,.42),at(12,s,.42),at(12,s,1.22),at(-12,s,1.22)],
 limestone,'LOAD_BEARING_GLAZING_PARAPET')
quad('quiet warm wood structural upper spandrel',
 [at(-12,s,5.58),at(12,s,5.58),at(12,s,7.23),at(-12,s,7.23)],
 fir,'UPPER_WALL_SUPPORT_NOT_FLOATING_ROOF')
# Left/right genuine weather closure to end the thin roof "card".
for edge in (-11.95,11.95):
 quad('end wall under folded canopy '+str(edge),
      [at(edge,-5.7,1.15),at(edge,5.7,1.15),at(edge,5.7,5.6),at(edge,-5.7,5.6)],
      limestone,'OCCUPIED_SEA_SERVICE_SIDEWALL')
# Functional 3.0m wide automatic entrance in existing actual bay:
# recess portal into building and preserve a framed transparent door.
inside=s-(-.27 if s_front<0 else .27)
quad('passenger entrance actual recessed glazed sliding leaf',
 [at(-1.35,inside,1.22),at(1.35,inside,1.22),
  at(1.35,inside,5.28),at(-1.35,inside,5.28)],
 tinted,'OPEN_PUBLIC_ENTRANCE')
for f in (-1.45,1.45):
 tube('entrance deep bronze vertical frame '+str(f),
      at(f,s,1.23),at(f,s,5.38),.06,doorframe,'GLAZING_REVEAL')
tube('entrance weathering canopy lintel',
     at(-1.45,s,5.38),at(1.45,s,5.38),.09,bronze,'WEATHERPROOF_LOAD_HEADER')
tube('sliding accessible door seam',
     at(0,inside-.025,1.25),at(0,inside-.025,5.05),.021,doorframe,'PUBLIC_SLIDING_LEAF')
# A single inhabited terrace edge: handrail model already exists, do
# not add another dozen decorative poles.

# Far halls: roof thickness only, no new giant faux background buildings.
# Blender truncates long object names, so the K4BX-authored semantic
# mesh attribute is the stable identifier: actual structural roof use.
far_roofs=[x for x in bpy.data.objects if x.type=='MESH'
           and x.get('ACTUAL_USE')=='WEATHERPROOF_HARBOR_ROOF']
assert len(far_roofs)==6,(len(far_roofs),[(x.name,x.get('ACTUAL_USE')) for x in far_roofs])
for o in far_roofs:
 solid=o.modifiers.new('K4BY physically thick real harbor metal sheeting','SOLIDIFY')
 solid.thickness=.22;solid.offset=-1
# Record precise source and primary hall screen coverage, NOT score.
def project(p):
 q=world_to_camera_view(sc,cam,p)
 return {'x':round(float(q.x),5),'y':round(float(q.y),5),'z':round(float(q.z),5),
   'inFrame':q.z>0 and 0<q.x<1 and 0<q.y<1}
front=project(at(0,s,4))
assert front['inFrame'],('primary building outside frozen CHASE',front)
assert oldposes==poses() and (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==oldcam
assert {fingerprint(x) for x in source}=={ROAD_SHA}
assert all(tuple(tuple(row) for row in ob.matrix_world)==old_tree_matrices[ob.name] for ob in oldtrees+canopies)
assert sha(BASE)==BASE_SHA
assert sc.render.resolution_x==768 and sc.render.resolution_y==480

sc.camera=cam;sc.render.engine='BLENDER_EEVEE'
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format='PNG'
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
bl=OUT/'K4BY_TRUE_CC0_ROAD_OCCUPIED_HARBOR_EDITABLE_NATIVE_ART_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(bl))
png=OUT/'K4BY_ONE_SAME_CHASE_TRUE_PBR_RACE_ROAD_CIVIC_HARBOR_NOT_GAME.png'
sc.render.filepath=str(png)
bpy.ops.render.render(write_still=True)
assert bl.stat().st_size>180_000_000 and png.stat().st_size>50_000
audit={'schema':'dopagaki.K4BY.true-PBR-road-rebuilt-harbor-one-native-frame/1',
 'originalK4BXA3NativeSHA256':BASE_SHA,
 'originalGameBlob':GAME_BLOB,'originalRoad5FullVertexFaceFingerprint':ROAD_SHA,
 'sourceRoad5VertexFacesUnchanged':True,'sourceSixCameraPoseUnchanged':True,
 'frozenResearchChaseUnchanged':True,'sourceTreesNinePositionsUnchanged':True,
 'sourceB48Roads':7,'sourceB51Movers':28,'sourcePhysicsHz':240,'sourceBallRadiusM':.65,
 'originalResearchRoadSkinMaterial':original_skin_mat,
 'a1WedgeResearchSkinKeptButRenderHidden':True,
 'newTrueSourceRoad5RenderingDuplicateNoCollider':True,
 'renderProxyRealRoad5ExactVertexFacesSHA256':fingerprint(coating),
 'renderProxyOriginalUpwardSurfacePolygons':upfaces,
 'originalGameRoad5MaterialAndGeometryUnmodified':True,'newGameColliders':0,
 'originalSourceGameEdited':False,'researchOnlyNotWebGL':True,
 'officialPolyHavenLicense':'CC0','officialAsset':'asphalt_track',
 'vendorReceiptSHA256':sha(ASSETS/'K4BY_ASPHALT_TRACK_OFFICIAL_PBR_VERIFIED.json'),
 'vendor2kPBRMaps':{kind:meta['sha256'] for kind,meta in receipt['maps'].items()},
 'nativeImagesPackedAndShaVerified':len(loaded),'realPhotographicSurfaceUVMetres':2,
 'primaryHarborCanopyRoofThicknessM':.28,'otherSixHallRoofThicknessM':.22,
 'primaryBuildingEntryBayOpened':glass_bay[0].name,
 'primaryHallCameraFacingSideM':s_front,
 'primaryHallFrontScreen':front,'researchAuthorMeshes':len(added),
 'realNativeRender':True,'renderResolution':[768,480],
 'ART':'UNJUDGED_HOLD','formalArtAccepted':0,'formalSlope2DNAMetres':0,
 'HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD','FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
 'files':{p.name:{'bytes':p.stat().st_size,'sha256':sha(p)} for p in (bl,png)}}
(OUT/'K4BY_GENUINE_PBR_HARBOR_NATIVE_ART_AUDIT.json').write_text(
 json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf-8')
print('K4BY_REAL_NATIVE_SOURCE_PROTECTED_ONE_FRAME_ART_UNJUDGED',
      json.dumps({'front':front,'meshes':len(added),'pbr':len(loaded)}),flush=True)

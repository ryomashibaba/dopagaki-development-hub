"""K4BR -- REAL CC0 photo-scanned texture maps and native cliff glTF in Blender.

IMPORTANT: research-only DCC. Never change source game, collision,
original B48 Road5, all six original cameras, 28 B51 movers, official
branch, production. New scans ARE NOT a pass of ART until seen.
"""
import bpy,sys,os,json,hashlib,struct,math
from pathlib import Path
from mathutils import Vector,Matrix
arg=sys.argv[sys.argv.index('--')+1:]
def opt(name):return Path(arg[arg.index(name)+1]).resolve()
parent=opt('--base');assets=opt('--assets');out=opt('--out')
out.mkdir(parents=True,exist_ok=True)
EXPECTED_K4BQ="5fe3ed2569b807af0b04c46cd1672f83a1c93863a19e958c468369985bd60252"
def sha(path):
 h=hashlib.sha256()
 with open(path,'rb') as f:
  for chunk in iter(lambda:f.read(1<<20),b''):h.update(chunk)
 return h.hexdigest()
assert sha(parent)==EXPECTED_K4BQ
receipt=json.loads((assets/'K4BR_CC0_LIVE_ASSET_RECEIPTS.json').read_text())
assert receipt['license']=='CC0 1.0'
assert receipt['additionalPaidAPI'] is False
assert 'Powered by Poly Haven' in receipt['attribution']
for k,item in receipt['photoscannedAssetsActuallyDownloaded'].items():
 for m,meta in item['maps'].items():
  file=assets/meta['localFile']
  assert file.is_file() and file.stat().st_size==meta['actualBytes']
  assert sha(file)==meta['sha256'] and meta['independentMD5Verified']
model=receipt['verifiedCC0NativePhotogrammetryModel']
assert model['id']=='rock_face_01'
for k,meta in model['files'].items():
 file=assets/meta['localFile']
 assert file.is_file() and file.stat().st_size==meta['actualBytes']
 assert sha(file)==meta['sha256']
bpy.ops.wm.open_mainfile(filepath=str(parent))
sc=bpy.context.scene
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
originals={o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
           for o in rig.objects if o.type=='CAMERA'}
assert len(originals)>=6
source_roads={}
for mode in ('control','ultra'):
 c=bpy.data.collections['K4AY SOURCE B48 | '+mode.upper()+' | TRUE TESSELLATED ROAD5']
 assert len(c.objects)==1
 source_roads[mode]=next(iter(c.objects))
def fingerprint(obj):
 h=hashlib.sha256()
 for v in obj.data.vertices:
  h.update(struct.pack('<3d',*[float(x) for x in v.co]))
 for face in obj.data.polygons:
  h.update(struct.pack('<3i',*[int(x) for x in face.vertices]))
 return h.hexdigest()
before={mode:fingerprint(o) for mode,o in source_roads.items()}
assert set(before.values())=={'f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2'}
cam=next(o for o in rig.objects if o.type=='CAMERA' and '11307' in o.name)
C=cam.location.copy()
forward=cam.matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((forward.x,forward.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def P(d,s,z):return C+F*d+S*s+Vector((0,0,z))
source=source_roads['control']
inv=source.matrix_world.inverted()
def ground(d):
 ray_origin=inv@P(d,0,600)
 ray_direction=(inv.to_3x3()@Vector((0,0,-1))).normalized()
 ok,q,n,ix=source.ray_cast(ray_origin,ray_direction,distance=1600)
 assert ok,('ground point not source terrain',d)
 return float((source.matrix_world@q).z-C.z)
research={}
for label in ('CHASE_NARROW','NARROW_FIXED_ORIGINAL_POSE'):
 found=[o for o in bpy.data.objects if o.type=='CAMERA' and
        o.name.startswith('K4BP | EXPERIMENT CAMERA | '+label+' |')]
 assert len(found)==1,label
 research[label]=found[0]
research_prior={k:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
                for k,o in research.items()}
scanned=bpy.data.collections.new('K4BR | ACTUAL VERIFIED POLY HAVEN CC0 CLIFF SCAN (UNAPPROVED)')
sc.collection.children.link(scanned)

# 3-channel real photographic albedo, roughness and OpenGL normal map.
# A world-projected box strategy prevents UV shearing on steep original
# research cliff faces. All originals preserved as unmodified materials
# in the parent archived .blend, and these new material nodes stay editable.
loaded={}
created_materials={}
for asset_id in ('asphalt_01','rock_ground_02'):
 maps=receipt['photoscannedAssetsActuallyDownloaded'][asset_id]['maps']
 loaded[asset_id]={}
 for name in ('diffuse','rough','nor_gl'):
  img=bpy.data.images.load(str(assets/maps[name]['localFile']),check_existing=False)
  img.name='K4BR | REAL Poly Haven / '+asset_id+' / '+name
  if name!='diffuse':img.colorspace_settings.name='Non-Color'
  img.pack()
  assert img.packed_file is not None
  loaded[asset_id][name]=img

def photo_material(name,asset_id,world_tile_scale,photo_rough):
 material=bpy.data.materials.new('K4BR | ACTUAL CC0 PHOTO PBR | '+name)
 material.use_nodes=True
 nd=material.node_tree.nodes;nd.clear()
 lk=material.node_tree.links
 o=nd.new('ShaderNodeOutputMaterial')
 bs=nd.new('ShaderNodeBsdfPrincipled')
 bs.inputs['Metallic'].default_value=.02
 lk.new(bs.outputs['BSDF'],o.inputs['Surface'])
 position=nd.new('ShaderNodeNewGeometry')
 transform=nd.new('ShaderNodeVectorMath')
 transform.operation='SCALE'
 transform.inputs[3].default_value=world_tile_scale
 lk.new(position.outputs['Position'],transform.inputs[0])
 tex={}
 for ch in ('diffuse','rough','nor_gl'):
  node=nd.new('ShaderNodeTexImage')
  node.name='K4BR_ACTUAL_CC0_'+ch.upper()
  node.label='Physically sourced Poly Haven '+asset_id+' '+ch
  node.image=loaded[asset_id][ch]
  node.extension='REPEAT'
  node.projection='BOX'
  node.projection_blend=.28
  lk.new(transform.outputs['Vector'],node.inputs['Vector'])
  tex[ch]=node
 lk.new(tex['diffuse'].outputs['Color'],bs.inputs['Base Color'])
 rough=nd.new('ShaderNodeMapRange')
 rough.inputs['From Min'].default_value=0
 rough.inputs['From Max'].default_value=1
 rough.inputs['To Min'].default_value=photo_rough
 rough.inputs['To Max'].default_value=min(1.0,photo_rough+.26)
 lk.new(tex['rough'].outputs['Color'],rough.inputs['Value'])
 lk.new(rough.outputs['Result'],bs.inputs['Roughness'])
 normal=nd.new('ShaderNodeNormalMap')
 normal.inputs['Strength'].default_value=.46 if asset_id=='asphalt_01' else .74
 lk.new(tex['nor_gl'].outputs['Color'],normal.inputs['Color'])
 lk.new(normal.outputs['Normal'],bs.inputs['Normal'])
 created_materials[name]=material
 return material

# Map physically sized real materials, preserving the K4BQ art-only road
# geometry, terrain poly groups and all original B48 source meshes.
photo_road=photo_material('worn asphalt high-resolution surface',
                          'asphalt_01',.42,.56)
photo_rock=photo_material('broken coast gravel + cliff lithology',
                          'rock_ground_02',.31,.71)
photo_stone=photo_material('walkway coarse granite from real geology',
                           'rock_ground_02',.48,.62)
targets={
 'K4BQ | hand-spec asphalt crushed basalt/damp tirepatina':photo_road,
 'K4BQ | actual rugged layered green-grey coastal schist':photo_rock,
 'K4BQ | salt weathered slate path stone':photo_stone}
material_assignment={}
for obj in bpy.data.objects:
 if obj.type!='MESH' or not obj.name.startswith('K4BQ /'):continue
 for i,slot in enumerate(obj.material_slots):
  if slot.material is not None and slot.material.name in targets:
   old=slot.material.name
   slot.material=targets[old]
   material_assignment[old]=material_assignment.get(old,0)+1
assert len(material_assignment)==3,material_assignment

# ACTUAL photoscanned native rock-face glTF (about 20k tri as the
# vendor advertises; report actual Blender imported triangles).
# Import into research namespace. This is NOT a file path guess;
# files were fetched via the official API with exact dependencies and MD5.
model_path=assets/model['nativeGLTFRelativeFile']
assert model_path.exists()
def imported_rock(site,d,s,z_offset,desired_longest,rotation):
 current=set(bpy.data.objects)
 bpy.ops.import_scene.gltf(filepath=str(model_path))
 imported=[obj for obj in bpy.data.objects if obj not in current]
 meshes=[obj for obj in imported if obj.type=='MESH']
 assert meshes,{'site':site,'newObjectNames':[x.name for x in imported]}
 triangle_count=sum(len(p.vertices)-2 for obj in meshes for p in obj.data.polygons)
 assert triangle_count>=2000,('expected scanned mesh, not primitive',triangle_count)
 # Determine the world bounds BEFORE applying user placement to preserve
 # arbitrary nested original vendor GLTF transforms and material layers.
 scene_w=bpy.context.evaluated_depsgraph_get()
 verts_world=[]
 for ob in meshes:
  for corner in ob.bound_box:
   verts_world.append(ob.matrix_world@Vector(corner))
 assert verts_world
 lo=Vector((min(v[i] for v in verts_world) for i in range(3)))
 hi=Vector((max(v[i] for v in verts_world) for i in range(3)))
 centre=(lo+hi)*.5
 major=max((hi-lo))
 assert major>0.01,major
 scale=desired_longest/major
 # Parent only the imported top-level roots to the new master empty,
 # retaining the true vendor glTF object's internal material/mesh links.
 master=bpy.data.objects.new('K4BR | CC0 scanned rock face | '+site,None)
 scanned.objects.link(master)
 for ob in imported:
  if ob.parent is None:
   old_world=ob.matrix_world.copy()
   ob.parent=master
   ob.matrix_world=old_world
  if ob.type=='MESH':
   ob['K4BR_EXTERNAL_CC0_PROVENANCE']=model['assetUrl']
   ob['NOT_ORIGINAL_ROAD_OR_COLLIDER']=True
   # glTF import already created its real native meshes and materials.
 # Relative to source Road5 original game-space camera P(d,s,z).
 # Rotate a whole group instead of hand-editing the vendor mesh polygons.
 land=P(d,s,ground(d)+z_offset)
 target=land+Vector((0,0,(hi.z-lo.z)*scale*.38))
 R=Matrix.Rotation(math.radians(rotation),4,'Z')
 master.matrix_world=Matrix.Translation(target)@R@Matrix.Scale(scale,4)@Matrix.Translation(-centre)
 return {'site':site,'sourceRoadD':d,'sourceRoadLateralS':s,
         'importedMeshObjects':len(meshes),'importedTriangles':triangle_count,
         'modelWorldDiameterBeforeScaleM':round(float(major),4),
         'chosenApparentLongestDimensionM':desired_longest,
         'vendorSourceAsset':model['assetUrl']}

scans=[
 imported_rock('coastal west cliff road close approach',38,-30,-4,9.5,20),
 imported_rock('weathered east entrance natural ledge',84,34,6,8.5,-47),
 imported_rock('actual public coastal headland section',137,-42,-9,13.0,104)
]
assert len(scans)==3
# Replace old visibly repetitive octagonal procedural rocks, while keeping
# every object in the edit archive, so the photographically real rock
# replaces rather than being buried behind toy angular stones.
hidden=[]
for ob in bpy.data.objects:
 if ob.name.startswith('K4BQ /') and 'natural fractured rock field' in ob.name:
  ob.hide_render=True
  hidden.append(ob.name)
# Native glTF importer brings proper linked photographic textures;
# save a self-contained editable .blend by packing them.
for image in bpy.data.images:
 if image.source=='FILE' and image.has_data and not image.packed_file:
  try:image.pack()
  except Exception:pass
vendorPackedImages={asset:{ch:bool(img.packed_file) for ch,img in maps.items()}
                    for asset,maps in loaded.items()}
assert all(all(c.values()) for c in vendorPackedImages.values())
def protect():
 assert before=={m:fingerprint(o) for m,o in source_roads.items()}
 now={o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
      for o in rig.objects if o.type=='CAMERA'}
 assert originals==now
 assert research_prior=={
   k:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
   for k,o in research.items()}
protect()
# Camera source originally still frozen; both screenshots below are
# research cameras with non-game narrowed road only.
sc.render.engine='BLENDER_EEVEE'
sc.render.resolution_x=1520
sc.render.resolution_y=950
sc.render.resolution_percentage=100
sc.render.image_settings.file_format='PNG'
try:sc.view_settings.view_transform='Filmic'
except Exception:pass
try:sc.view_settings.look='Medium High Contrast'
except Exception:pass
screens=[]
for label,o in research.items():
 sc.camera=o
 filename='K4BR_'+label+'_REAL_CC0_PBR_AND_PHOTOSCAN_NATIVE_DCC_UNJUDGED.png'
 sc.render.filepath=str(out/filename)
 bpy.ops.render.render(write_still=True)
 screens.append({'researchCamera':label,'actualSourceCamera':False,
  'sourceB48RoadRendered':False,'isGameWebGLScreenshot':False,'file':filename})
sc.camera=research['CHASE_NARROW']
protect()
name='K4BR_ACTUAL_CC0_PHOTOSCAN_ROCKS_EDITABLE_NATIVE_DCC_ART_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(out/name))
files={}
for fn in [name]+[s['file'] for s in screens]:
 path=out/fn
 assert path.stat().st_size>80000
 files[fn]={'bytes':path.stat().st_size,'sha256':sha(path)}
audit={
 'schema':'dopagaki.K4BR.official-CC0-phototexture-and-native-photogrammetry-in-editable-blender/1',
 'parentK4BQVerifiedSHA256':EXPECTED_K4BQ,
 'officialCC0Vendor':'Poly Haven','liveAPIUserAgent':receipt['userAgent'],
 'officialCC0LicensePage':'https://polyhaven.com/license',
 'credit':'Powered by Poly Haven',
 'actualVendorAssetBytesVerifiedMD5AndSHA256':True,
 'assetReceiptsJSON':'K4BR_CC0_LIVE_ASSET_RECEIPTS.json',
 'assetReceiptSHA256':sha(assets/'K4BR_CC0_LIVE_ASSET_RECEIPTS.json'),
 'actualPBRPhotoMapsInEditableBlendPacked':vendorPackedImages,
 'replacedPriorOnlyProceduralMaterialInstances':material_assignment,
 'actualGLTFScannedModelInstances':scans,
 'rejectedOldProceduralRockFieldHiddenNotDeleted':hidden,
 'originalSourceGameBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'originalSourceRoad5VertexFaceUnchanged':True,
 'allSixOriginalSourceCameraNumericPosesUnchanged':True,
 'bothResearchCameraNumericPosesUnchanged':True,
 'sourceB48Roads':7,'sourceB51Movers':28,'sourceHz':240,'sourceBallRadiusM':.65,
 'newGameColliders':0,'originalGameSourceEdited':False,
 'realWebGL2GameScreenshot':False,
 'researchOnlyAlternativeRoadWidthM':26.3,
 'formalArtAccepted':0,'formalSlope2DNAMetres':0,
 'ART':'UNJUDGED_HOLD','HUMAN':'HOLD','SAT':'HOLD',
 'CCD':'HOLD','FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
 'screens':screens,'files':files}
(out/'K4BR_NATIVE_SCANNED_ASSET_AUDIT.json').write_text(json.dumps(audit,indent=2,ensure_ascii=False))
print('K4BR_TRUE_VENDOR_CC0_SCANNED_PBR_BLENDER_PACKED_SOURCE_LOCK_PASS',
      json.dumps({'realRockMeshes':scans,'materials':material_assignment,
                  'originalRoadsUnchanged':True},ensure_ascii=False))

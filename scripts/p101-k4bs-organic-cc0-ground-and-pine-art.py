"""K4BS native art pilot: organic continuous photo-ground + real CC0 conifer.

STRICT: DCC-only on one research frame. Never edit source B48 roads,
source camera six poses, source game, 240Hz collisions or production.
This pilot is not an approved game or quality pass.
"""
import bpy,sys,os,math,json,hashlib,struct,random
from pathlib import Path
from math import sin,cos,pi
from mathutils import Vector,Matrix
arg=sys.argv[sys.argv.index('--')+1:]
def op(name):return Path(arg[arg.index(name)+1]).resolve()
parent=op('--base');assets=op('--assets');dest=op('--out')
dest.mkdir(parents=True,exist_ok=True)
PARENT='7f229b9fbc0d736c056e1494f64192e64b7915f768a6fb38f05c87901229fa69'
def sha(p):
 h=hashlib.sha256()
 with open(p,'rb') as f:
  for b in iter(lambda:f.read(1<<20),b''):h.update(b)
 return h.hexdigest()
assert sha(parent)==PARENT
receipt=json.loads((assets/'K4BS_CC0_LIVE_ASSET_RECEIPTS.json').read_text())
assert receipt['license']=='CC0 1.0'
assert 'Powered by Poly Haven' in receipt['attribution']
assert set(receipt['photoscannedAssetsActuallyDownloaded'])=={'sparse_grass'}
model=receipt['verifiedCC0NativeTreeModel']
assert model['id']=='pine_sapling_small'
for asset in receipt['photoscannedAssetsActuallyDownloaded'].values():
 for m in asset['maps'].values():
  p=assets/m['localFile'];assert p.stat().st_size==m['actualBytes'] and sha(p)==m['sha256']
for m in model['files'].values():
 p=assets/m['localFile'];assert p.stat().st_size==m['actualBytes'] and sha(p)==m['sha256']

bpy.ops.wm.open_mainfile(filepath=str(parent))
sc=bpy.context.scene
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
originals={o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
           for o in rig.objects if o.type=='CAMERA'}
assert len(originals)>=6
src={}
for mode in ('control','ultra'):
 c=bpy.data.collections['K4AY SOURCE B48 | '+mode.upper()+' | TRUE TESSELLATED ROAD5']
 assert len(c.objects)==1
 src[mode]=next(iter(c.objects))
def fingerprint(obj):
 h=hashlib.sha256()
 for v in obj.data.vertices:h.update(struct.pack('<3d',*[float(q) for q in v.co]))
 for p in obj.data.polygons:h.update(struct.pack('<3i',*[int(q) for q in p.vertices]))
 return h.hexdigest()
fp={k:fingerprint(v) for k,v in src.items()}
assert set(fp.values())=={'f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2'}
camera=next(o for o in rig.objects if o.type=='CAMERA' and '11307' in o.name)
C=camera.location.copy()
direction=camera.matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((direction.x,direction.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def P(d,s,z):return C+F*d+S*s+Vector((0,0,z))
inverse=src['control'].matrix_world.inverted()
def ground(d):
 a=inverse@P(d,0,600)
 dr=(inverse.to_3x3()@Vector((0,0,-1))).normalized()
 hit,p,n,idx=src['control'].ray_cast(a,dr,distance=1600)
 assert hit,('road ground absent',d)
 return float((src['control'].matrix_world@p).z-C.z)
research={}
for mode in ('CHASE_NARROW','NARROW_FIXED_ORIGINAL_POSE'):
 candidates=[o for o in bpy.data.objects if o.type=='CAMERA' and o.name.startswith('K4BP | EXPERIMENT CAMERA | '+mode+' |')]
 assert len(candidates)==1
 research[mode]=candidates[0]
research_before={k:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens)) for k,o in research.items()}
def protect():
 assert fp=={k:fingerprint(v) for k,v in src.items()}
 assert originals=={o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens)) for o in rig.objects if o.type=='CAMERA'}
 assert research_before=={k:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens)) for k,o in research.items()}
protect()

# Visible improvements are intentionally limited: real continuous grass/cliff
# transition, real evergreen branch canopy, removal of toy monoliths. No
# extra decoration, one research Camera for controlled comparison.
old_art_hidden=[]
for ob in bpy.data.objects:
 if not ob.name.startswith('K4BQ /'):continue
 if any(s in ob.name for s in (
   'real windworn native maritime pine trunks',
   'modelled volumetric blue-green needle crowns',
   'dune grass micro geometry',
   'lighthouse','interpretive gallery','recessed glazed atrium',
   'singular UV patinated folded coastal civic roof',
   'exposed timber rib','occupied linear exhibition amber light')):
  ob.hide_render=True
  old_art_hidden.append(ob.name)
assert len(old_art_hidden)>=14,len(old_art_hidden)
# Existing K4BQ gallery collection had a view-blocking oversized roof;
# all old objects are preserved in .blend but render-hidden.
for col in bpy.data.collections:
 if col.name.startswith('K4BQ | 05 curved human-scaled maritime'):
  col.hide_render=True
  old_art_hidden.append(col.name)

maps=receipt['photoscannedAssetsActuallyDownloaded']['sparse_grass']['maps']
photos={}
for ch in ('diffuse','nor_gl','rough'):
 img=bpy.data.images.load(str(assets/maps[ch]['localFile']),check_existing=False)
 img.name='K4BS | Verified Poly Haven / sparse_grass / '+ch
 if ch!='diffuse':img.colorspace_settings.name='Non-Color'
 img.pack()
 assert img.packed_file is not None
 photos[ch]=img
# Prepacked original K4BR rock photo images. Check actual usable data.
# Blender truncates long ID material names on save/reload. Select the
# uniquely proven K4BR CC0 rock material by stable identity prefix.
candidates=[m for m in bpy.data.materials
            if m.name.startswith('K4BR | ACTUAL CC0 PHOTO PBR | broken coast')]
assert len(candidates)==1,[(m.name) for m in candidates]
old_gravel=candidates[0]
image_nodes={n.name:n.image for n in old_gravel.node_tree.nodes if n.type=='TEX_IMAGE'}
assert all('K4BR_ACTUAL_CC0_'+m in image_nodes for m in ('DIFFUSE','ROUGH','NOR_GL'))
rockphotos={x:image_nodes['K4BR_ACTUAL_CC0_'+x.upper()] for x in ('diffuse','rough','nor_gl')}
assert all(x.packed_file is not None for x in rockphotos.values())

new_mat=bpy.data.materials.new('K4BS | Continuously masked REAL CC0 green-to-rock coastal erosion')
new_mat.use_nodes=True;nodes=new_mat.node_tree.nodes;nodes.clear();links=new_mat.node_tree.links
outnode=nodes.new('ShaderNodeOutputMaterial')
sourcecoord=nodes.new('ShaderNodeNewGeometry')
def make_pbr(name,photos,scale,r0):
 coord=nodes.new('ShaderNodeVectorMath');coord.operation='SCALE'
 coord.inputs[3].default_value=scale
 links.new(sourcecoord.outputs['Position'],coord.inputs[0])
 channels={}
 for ch in ('diffuse','rough','nor_gl'):
  im=nodes.new('ShaderNodeTexImage')
  im.label='Real verified CC0 photograph / '+name+' / '+ch
  im.image=photos[ch]
  im.extension='REPEAT'
  im.projection='BOX'
  im.projection_blend=.35
  links.new(coord.outputs['Vector'],im.inputs['Vector'])
  channels[ch]=im
 bs=nodes.new('ShaderNodeBsdfPrincipled')
 links.new(channels['diffuse'].outputs['Color'],bs.inputs['Base Color'])
 rr=nodes.new('ShaderNodeMapRange')
 rr.inputs['To Min'].default_value=r0
 rr.inputs['To Max'].default_value=min(1,r0+.20)
 links.new(channels['rough'].outputs['Color'],rr.inputs['Value'])
 links.new(rr.outputs['Result'],bs.inputs['Roughness'])
 norm=nodes.new('ShaderNodeNormalMap')
 norm.inputs['Strength'].default_value=.65
 links.new(channels['nor_gl'].outputs['Color'],norm.inputs['Color'])
 links.new(norm.outputs['Normal'],bs.inputs['Normal'])
 return bs
grassy=make_pbr('sparse_grass',photos,.28,.72)
rocky=make_pbr('rock_ground_02',rockphotos,.27,.75)
# TWO octave long-scale organic ground/noise mask; NO per-face
# rectangular assignments. Slope / fractal variation from world pos.
large=nodes.new('ShaderNodeTexNoise')
large.inputs['Scale'].default_value=.042
large.inputs['Detail'].default_value=4.6
large.inputs['Roughness'].default_value=.7
detail=nodes.new('ShaderNodeTexNoise')
detail.inputs['Scale'].default_value=.19
detail.inputs['Detail'].default_value=3.2
factor=nodes.new('ShaderNodeMath');factor.operation='MULTIPLY_ADD'
links.new(large.outputs['Fac'],factor.inputs[0])
factor.inputs[1].default_value=.77
links.new(detail.outputs['Fac'],factor.inputs[2])
# MULTIPLY_ADD has one output but its 3rd input addition of noise .5,
# using HSV/mapping ramp at more than 1 could bias grass/rock.
factor.inputs[1].default_value=.72
smudge=nodes.new('ShaderNodeMapRange')
smudge.inputs['From Min'].default_value=.48
smudge.inputs['From Max'].default_value=.96
links.new(factor.outputs[0],smudge.inputs['Value'])
# Slow gradient with soft transitions; tie to local normal because
# steep rocky faces support grass poorly.
seep=nodes.new('ShaderNodeVectorMath');seep.operation='DOT_PRODUCT'
links.new(sourcecoord.outputs['Normal'],seep.inputs[0])
seep.inputs[1].default_value=(0,0,1)
slope=nodes.new('ShaderNodeMapRange')
slope.inputs['From Min'].default_value=.28
slope.inputs['From Max'].default_value=.91
links.new(seep.outputs['Value'],slope.inputs['Value'])
mask=nodes.new('ShaderNodeMath');mask.operation='MULTIPLY'
links.new(smudge.outputs['Result'],mask.inputs[0])
links.new(slope.outputs['Result'],mask.inputs[1])
mix=nodes.new('ShaderNodeMixShader')
links.new(mask.outputs[0],mix.inputs[0])
links.new(rocky.outputs[0],mix.inputs[1])
links.new(grassy.outputs[0],mix.inputs[2])
links.new(mix.outputs[0],outnode.inputs['Surface'])
terrain_changed={}
for ob in bpy.data.objects:
 if ob.type!='MESH' or not ob.name.startswith('K4BQ /'):continue
 # The original K4BQ mesh object IDs are truncated to Blender's limit.
 # Detect stable unique upstream author prefix, not full long display name.
 if 'authored subdivided eroded native' not in ob.name:continue
 previous=[sum(1 for p in ob.data.polygons if p.material_index==k) for k in (0,1)]
 ob.data.materials.clear();ob.data.materials.append(new_mat)
 for p in ob.data.polygons:p.material_index=0
 terrain_changed[ob.name]={'polygons':len(ob.data.polygons),'oldPerFaceBlocks':previous,
                          'newUnifiedContinuousMaterial':new_mat.name}
assert len(terrain_changed)==2,terrain_changed
assert all(x['oldPerFaceBlocks'][1]>0 for x in terrain_changed.values())

# Genuine vendor 3D tree GLTF with image alpha and bark textures. We
# instantiate the REAL imported collection with linked geometry (no
# copying 398K triangle meshes per tree). An explicit bounded number.
treefile=assets/model['nativeGLTFRelativeFile']
assert treefile.exists()
was=set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=str(treefile))
added=[o for o in bpy.data.objects if o not in was]
meshobjs=[o for o in added if o.type=='MESH']
assert meshobjs,{'asset':treefile,'imported':[o.name for o in added]}
triangles=sum(max(0,len(face.vertices)-2) for ob in meshobjs for face in ob.data.polygons)
assert 20000<=triangles<=2500000,triangles
bpy.context.view_layer.update()
corners=[ob.matrix_world@Vector(p) for ob in meshobjs for p in ob.bound_box]
assert corners
lo=Vector([min(v[k] for v in corners) for k in range(3)])
hi=Vector([max(v[k] for v in corners) for k in range(3)])
centre=(lo+hi)*.5
height=hi.z-lo.z
assert height>.05,height
template=bpy.data.collections.new('K4BS | POLY HAVEN ACTUAL PINE SAPLING LOW RES MASTER')
sc.collection.children.link(template)
for ob in added:
 template.objects.link(ob)
 for co in tuple(ob.users_collection):
  if co!=template:co.objects.unlink(ob)
 if ob.type=='MESH':
  ob['VENDOR_ASSET']='https://polyhaven.com/a/pine_sapling_small'
  ob['NOT_GAME_COLLIDER']=True
# The original master in source global origin is far outside the canonical
# Road5 camera world; instances are at true independent research terrain.
def terrain_height(d,s):
 h=ground(d)
 v=max(0,(abs(s)-16.4)/75)
 n=(sin(d*.17+s*.19)*.55+
    sin(d*.063-s*.117)*1.6+
    cos(d*.41-s*.35)*.26+
    sin(d*.93+s*.78)*.11)
 if s>0:return h+.3+9.5*v**.73+6*v*v+n*(.20+.82*v)
 return h+.3-13.0*v**.8-3.8*v*v+n*(.2+.55*v)
locs=[(14,-31,5.8),(27,-46,7),(43,-52,5.6),(57,-38,6.5),
      (73,-59,8.5),(94,-48,7.3),(118,-53,8.9),
      (18,34,5.8),(37,48,8.2),(63,45,6.9),(86,58,8.1),
      (110,51,7.4),(139,65,8.2),(157,43,6.3)]
# Bounded high-density pilot after 14-copy research rendering proved too
# expensive for the free software-GL environment; hold full-scene trees.
# Balanced 4 west + 4 east native scene instances of the same actual GLTF.
locs=[locs[i] for i in (0,2,4,6,7,9,11,13)]
sprouts=[]
for i,(d,s,target_height) in enumerate(locs):
 location=P(d,s,terrain_height(d,s)-.25)
 sca=target_height/height
 ob=bpy.data.objects.new('K4BS | genuine CC0 scanned pine tree %02d'%i,None)
 sc.collection.objects.link(ob)
 ob.instance_type='COLLECTION';ob.instance_collection=template
 ob.matrix_world=(Matrix.Translation(location)@
                 Matrix.Rotation(math.radians(i*79%360),4,'Z')@
                 Matrix.Scale(sca,4)@
                 Matrix.Translation(-centre))
 ob['DCC_RESEARCH_ONLY']=True
 ob['NOT_GAME_COLLIDER']=True
 ob['source_asset']='https://polyhaven.com/a/pine_sapling_small'
 ob['source_road_station_d']=d
 ob['lodPolicy']='SOURCE_MESH_SHARED_RESEARCH_ONLY_FPS_HOLD'
 sprouts.append({'d':d,'s':s,'heightM':target_height})
assert len(sprouts)==8
for img in bpy.data.images:
 if img.source=='FILE' and img.has_data and img.packed_file is None:
  try:img.pack()
  except Exception:pass
assert all(x.packed_file is not None for x in photos.values())
def check_source():protect()
check_source()
sc.render.engine='BLENDER_EEVEE'
sc.render.resolution_x=1280;sc.render.resolution_y=800
sc.render.resolution_percentage=100
sc.render.image_settings.file_format='PNG'
try:sc.view_settings.view_transform='Filmic'
except Exception:pass
try:sc.view_settings.look='Medium High Contrast'
except Exception:pass
screens=[]
for name,cam in research.items():
 sc.camera=cam
 path=dest/('K4BS_'+name+'_CONTINUOUS_CC0_GROUND_REAL_PINE_ART_HOLD.png')
 sc.render.filepath=str(path)
 bpy.ops.render.render(write_still=True)
 screens.append({'camera':name,'sourceCamera':False,'roadOriginalB48':False,
                 'file':path.name})
sc.camera=research['CHASE_NARROW'];check_source()
blend=dest/'K4BS_REAL_PINE_AND_ORGANIC_PHOTO_GROUND_EDITABLE_DCC_ART_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
files={}
for path in [blend]+[dest/x['file'] for x in screens]:
 assert path.stat().st_size>60000
 files[path.name]={'bytes':path.stat().st_size,'sha256':sha(path)}
audit={
 'schema':'dopagaki.K4BS.real-CC0-pine-with-organic-photo-ground-source-protected/1',
 'parentEditableK4BR_SHA256':PARENT,
 'vendorCC0ManifestSHA256':sha(assets/'K4BS_CC0_LIVE_ASSET_RECEIPTS.json'),
 'sourceGameImmutableBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'sourceB48Road5VertexFacePreserved':True,'originalSixSourceCamerasNumericallyUnchanged':True,
 'bothResearchCamerasNumericallyUnchanged':True,
 'sourceB48RoadCount':7,'sourceB51MoverCount':28,'sourcePhysicsHz':240,'sourceBallRadiusM':.65,
 'actualPolyHavenSparseGrassMapsPacked':{k:bool(v.packed_file) for k,v in photos.items()},
 'actualImportedRealPineGLTFTriangles':triangles,'actualImportedMeshCount':len(meshobjs),
 'researchTreeSharedGeometryInstances':len(sprouts),'treePlacements':sprouts,
 'renderHiddenPriorToyTreesAndUnrealisticStructures':old_art_hidden,
 'actualTerrainPerPolygonCheckerPatternRemoved':terrain_changed,
 'realGameNewColliders':0,'gameSourceModified':False,'isWebGL2GameScreenshot':False,
 'realGameFpsAndLODProof':'HOLD','ART':'UNJUDGED_HOLD',
 'formalArtAccepted':0,'formalSlope2DNAMetres':0,'SAT':'HOLD','CCD':'HOLD',
 'FPS':'HOLD','HUMAN':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
 'screens':screens,'files':files}
(dest/'K4BS_REAL_ORGANIC_RESEARCH_NATIVE_AUDIT.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
print('K4BS_NATIVE_CC0_REAL_TREE_PLUS_REAL_ORGANIC_GROUND_TECH_HOLD',
 json.dumps({'trianglesPerTree':triangles,'instancedTrees':len(sprouts),
             'terrainFixed':len(terrain_changed)},ensure_ascii=False))

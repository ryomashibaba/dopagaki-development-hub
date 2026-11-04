"""K4BV: one REAL CC0 coastal canopy native Blender CHASE art trial.

K4BU parent SHA-locked. No game, collider, real physical Road5 or camera edits.
No visual ART PASS without inspecting the actual native render.
"""
import bpy,hashlib,json,math,struct,sys
from pathlib import Path
from math import sin,cos,pi
from mathutils import Vector,Matrix
from bpy_extras.object_utils import world_to_camera_view
a=sys.argv[sys.argv.index('--')+1:]
def arg(x):return Path(a[a.index(x)+1]).resolve()
BASE=arg('--base');ASSETS=arg('--assets');OUT=arg('--out');OUT.mkdir(parents=True,exist_ok=True)
S_BLEND='2536375f40e6a20e0061b80aba100c2469cfeacde814f4c127ff194201ba3064'
S_GAME='af076d67492a677d2235e4730aef8cdf4808e106'
S_ROAD='f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2'
def sha(path):
 h=hashlib.sha256()
 with open(path,'rb') as f:
  for b in iter(lambda:f.read(1<<20),b''):h.update(b)
 return h.hexdigest()
assert sha(BASE)==S_BLEND,'wrong immutable K4BU parent'
receipt=json.loads((ASSETS/'K4BV_CC0_VENDOR_VERIFIED_RECEIPT.json').read_text())
assert receipt['assetId']=='island_tree_02' and receipt['license']=='CC0 1.0'
assert receipt['paidApi'] is False and receipt['sourceGameEdited'] is False
for meta in receipt['files'].values():
 p=ASSETS/meta['localFile']
 assert p.is_file() and p.stat().st_size==meta['actualBytes'] and sha(p)==meta['sha256']

bpy.ops.wm.open_mainfile(filepath=str(BASE));sc=bpy.context.scene
rig=bpy.data.collections['05_CAMERA | Authentic original source poses']
def poses():return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
 for o in rig.objects if o.type=='CAMERA'}
orig_camera=poses();assert len(orig_camera)>=6
cams=[o for o in bpy.data.objects if o.type=='CAMERA' and o.name.startswith('K4BP | EXPERIMENT CAMERA | CHASE_NARROW |')]
assert len(cams)==1
cam=cams[0];cam_state=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
assert (sc.render.resolution_x,sc.render.resolution_y)==(768,480)
def road(k):
 c=bpy.data.collections['K4AY SOURCE B48 | '+k+' | TRUE TESSELLATED ROAD5']
 assert len(c.objects)==1
 return next(iter(c.objects))
roads={'control':road('CONTROL'),'ultra':road('ULTRA')}
def fp(o):
 h=hashlib.sha256()
 for v in o.data.vertices:h.update(struct.pack('<3d',*[float(x) for x in v.co]))
 for p in o.data.polygons:h.update(struct.pack('<3i',*[int(x) for x in p.vertices]))
 return h.hexdigest()
assert {fp(o) for o in roads.values()}=={S_ROAD}
prior=sorted((o for o in bpy.data.objects if o.name.startswith('K4BS | genuine CC0 scanned pine tree ')),key=lambda o:o.name)
assert len(prior)==8
prior_matrices={o.name:o.matrix_world.copy() for o in prior}
for ob in prior:ob.hide_render=True

# Import actual vendor glTF geometry with all manufacturer-checked PBR images.
existing=set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=str(ASSETS/receipt['nativeGLTFRelativeFile']))
added=[o for o in bpy.data.objects if o not in existing]
meshes=[o for o in added if o.type=='MESH']
assert meshes
bpy.context.view_layer.update()
tris=sum(max(0,len(p.vertices)-2) for o in meshes for p in o.data.polygons)
assert 50000<tris<5000000,tris
native_corners=[o.matrix_world@Vector(c) for o in meshes for c in o.bound_box]
lo=Vector([min(v[i] for v in native_corners) for i in range(3)])
hi=Vector([max(v[i] for v in native_corners) for i in range(3)])
centre=(lo+hi)*.5;extent=hi-lo
assert all(.1<extent[i]<60 for i in range(3)),list(extent)
assert max(extent.x,extent.y)>1.2*extent.z,('asset shape not a wide coast tree',list(extent))
master=bpy.data.collections.new('K4BV | VERIFIED CC0 ISLAND TREE 02 NATIVE MASTER')
sc.collection.children.link(master)
for o in added:
 master.objects.link(o)
 for c in tuple(o.users_collection):
  if c!=master:c.objects.unlink(o)
 if o.type=='MESH':
  o['VENDOR_CC0']='https://polyhaven.com/a/island_tree_02'
  o['NOT_GAME_COLLIDER']=True

original_11307=[o for o in rig.objects if o.type=='CAMERA' and '11307' in o.name]
assert len(original_11307)==1
C=original_11307[0].location.copy()
forward=original_11307[0].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((forward.x,forward.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def P(d,s,z):return C+F*d+S*s+Vector((0,0,z))
inv=roads['control'].matrix_world.inverted()
def ground(d):
 a=inv@P(d,0,600)
 dr=(inv.to_3x3()@Vector((0,0,-1))).normalized()
 hit,pos,n,index=roads['control'].ray_cast(a,dr,distance=1600)
 assert hit,('no authentic native Road5 under station',d)
 return float((roads['control'].matrix_world@pos).z-C.z)
def terrain_height(d,s):
 h=ground(d);v=max(0,(abs(s)-16.4)/75)
 n=(sin(d*.17+s*.19)*.55+sin(d*.063-s*.117)*1.6+
    cos(d*.41-s*.35)*.26+sin(d*.93+s*.78)*.11)
 if s>0:return h+.3+9.5*v**.73+6*v*v+n*(.20+.82*v)
 return h+.3-13*v**.8-3.8*v*v+n*(.2+.55*v)

# Geometry-only projection of ACTUAL native model. Do not confuse projected
# bbox with alpha-tested visible leaf pixels. One candidate / one render.
H=6.6;scale=H/extent.z;assert .12<scale<12
W,HEIGHT=768,480
candidates=[]
for d in (42,52,62,72,82,92,104,116,128):
 for s in (-24,-28,-32,-36,-40,-45,-50,-56):
  radius=math.hypot(extent.x,extent.y)*scale*.5
  margin=abs(s)-radius-13.15
  if margin<1:continue
  for yaw in (0,30,60,90,120):
   foot=P(d,s,terrain_height(d,s))
   pos=Vector((foot.x,foot.y,foot.z+.15+H*.5))
   mat=(Matrix.Translation(pos)@Matrix.Rotation(math.radians(yaw),4,'Z')@
        Matrix.Scale(scale,4)@Matrix.Translation(-centre))
   pr=[world_to_camera_view(sc,cam,mat@v) for v in native_corners]
   if any(q.z<=0 for q in pr):continue
   xs=[q.x*W for q in pr];ys=[(1-q.y)*HEIGHT for q in pr]
   bbox=[min(xs),min(ys),max(xs),max(ys)]
   if bbox[0]<0 or bbox[1]<0 or bbox[2]>W or bbox[3]>HEIGHT:continue
   bw=bbox[2]-bbox[0];bh=bbox[3]-bbox[1];pct=100*bw*bh/(W*HEIGHT)
   cx=(bbox[0]+bbox[2])/(2*W);by=bbox[3]/HEIGHT
   if not(45<=bw<=270 and 48<=bh<=235 and .63<=cx<=.96 and .40<=by<=.90 and .8<=pct<=12):continue
   score=5*abs(cx-.76)+2.6*abs(by-.72)+2*abs(bw/W-.20)+.003*abs(d-70)
   candidates.append((score,d,s,yaw,mat,bbox,bw,bh,pct,margin))
assert candidates,('HOLD_NO_SAFE_GENUINE_COASTAL_TREE_PROJECTION',list(extent))
score,d,s,yaw,mat,bbox,bw,bh,pct,margin=sorted(candidates,key=lambda v:(v[0],v[1],v[2],v[3]))[0]
hero=bpy.data.objects.new('K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY | RESEARCH ONLY',None)
sc.collection.objects.link(hero);hero.instance_type='COLLECTION';hero.instance_collection=master
hero.matrix_world=mat
hero['NOT_GAME_COLLIDER']=True;hero['DCC_RESEARCH_ONLY']=True
hero['VENDOR_CC0']='https://polyhaven.com/a/island_tree_02'
bpy.context.view_layer.update()
bottom=min((mat@p).z for p in native_corners)
assert abs(bottom-P(d,s,terrain_height(d,s)).z-.15)<.02
assert {fp(v) for v in roads.values()}=={S_ROAD}
assert orig_camera==poses()
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==cam_state
assert all(tuple(o.matrix_world)==tuple(prior_matrices[o.name]) for o in prior)
assert sha(BASE)==S_BLEND

# The imported vendor image textures must actually be available in Blender.
material_set={slot.material for o in meshes for slot in o.material_slots if slot.material}
vendor_image_paths={Path(name).stem.removesuffix('_1k'):ASSETS/meta['localFile']
 for name,meta in receipt['files'].items() if name.startswith('textures/')}
loaded_vendor_images={}
for mat in material_set:
 if not mat.use_nodes:continue
 for node in mat.node_tree.nodes:
  if node.type!='TEX_IMAGE' or node.image is None:continue
  origin=node.image
  # Blender importer can create an image datablock without loading its
  # pixels: has_data=False despite a true vendor JPEG on disk. Resolve it
  # to the EXACT SHA-verified official dependency, never guess/replace art.
  name=origin.name
  if name.endswith(('.jpg','.jpeg','.png')):name=Path(name).stem
  if len(name)>=4 and name[-4]=='.' and name[-3:].isdigit():name=name[:-4]
  name=name.removesuffix('_1k')
  # The glTF importer creates separate roughness/metallic Image nodes
  # from a vendor ARM (ambient occlusion / roughness / metallic) map.
  # Preserve the node's channel decoding; attach the SAME certified
  # official ARM bytes, never invent a nonexistent '*_rough.jpg'.
  # Prefer the glTF importer's actual source filepath over a synthetic
  # display name. A composite leaves_diff-leaves_alpha node still points
  # to the real verified leaves_diff_1k.jpg file.
  source_stem=Path(origin.filepath).stem.removesuffix('_1k')
  vendor_name=source_stem if source_stem in vendor_image_paths else name
  if vendor_name not in vendor_image_paths:
   for suffix in ('_rough','_roughness','_metallic','_occlusion'):
    if vendor_name.endswith(suffix):
     arm_name=vendor_name[:-len(suffix)]+'_arm'
     if arm_name in vendor_image_paths:
      vendor_name=arm_name
     break
  assert vendor_name in vendor_image_paths,('unmapped vendor texture',origin.name,origin.filepath,list(vendor_image_paths))
  if vendor_name not in loaded_vendor_images:
   path=vendor_image_paths[vendor_name]
   exact=next(m for m in receipt['files'].values() if ASSETS/m['localFile']==path)
   assert path.stat().st_size==exact['actualBytes'] and sha(path)==exact['sha256']
   image=bpy.data.images.load(str(path),check_existing=False)
   image.colorspace_settings.name=origin.colorspace_settings.name
   image.alpha_mode=origin.alpha_mode
   # Blender 4 background import can have has_data=False until GPU/CPU
   # pixels are requested. It does NOT establish missing source bytes.
   # Pack exact SHA-verified vendor JPEG bytes, independent of lazy pixels.
   vendor_bytes=path.read_bytes()
   assert len(vendor_bytes)==exact['actualBytes']
   assert hashlib.sha256(vendor_bytes).hexdigest()==exact['sha256']
   image.pack(data=vendor_bytes,data_len=len(vendor_bytes))
   assert image.packed_file is not None,('vendor JPEG pack failed',vendor_name)
   assert image.packed_file.size==len(vendor_bytes),('packed JPEG size mismatch',vendor_name)
   assert hashlib.sha256(bytes(image.packed_file.data)).hexdigest()==exact['sha256'],('packed vendor image mismatch',vendor_name)
   loaded_vendor_images[vendor_name]=image
  node.image=loaded_vendor_images[vendor_name]
new_images=set(loaded_vendor_images.values())
assert len(new_images)>=2,('genuine CC0 textures not packed',list(loaded_vendor_images))
sc.camera=cam;sc.render.engine='BLENDER_EEVEE'
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format='PNG'
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
native=OUT/'K4BV_ONE_GENUINE_COASTAL_CANOPY_EDITABLE_NATIVE_ART_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(native))
shot=OUT/'K4BV_ONE_COASTAL_TREE_SAME_CHASE_NATIVE_768x480_ART_HOLD_NOT_GAME.png'
sc.render.filepath=str(shot)
bpy.ops.render.render(write_still=True)
assert native.stat().st_size>30000000 and shot.stat().st_size>30000
audit={
 'schema':'dopagaki.K4BV.one-real-CC0-coastal-tree-SHA-protected-native-art/1',
 'parentK4BURealNativeSHA256':S_BLEND,'originalSourceGameBlob':S_GAME,
 'originalSourceRoad5Fingerprint':S_ROAD,
 'vendorOfficialVerifiedReceiptSHA256':sha(ASSETS/'K4BV_CC0_VENDOR_VERIFIED_RECEIPT.json'),
 'vendorAsset':'island_tree_02','vendorLicense':'CC0 1.0',
 'genuineImportedNativeTriangles':tris,'genuineImportedMeshCount':len(meshes),
 'genuineVendorImagesPackedCount':len(new_images),
 'genuineVendorBoundsXYZ_M':[round(float(x),5) for x in extent],
 'placement':{'dRoadM':d,'sRoadM':s,'rotationZDeg':yaw,
  'nativeBroadCanopyXYPreserved':True,'groundFootClearanceM':round(bottom-P(d,s,terrain_height(d,s)).z,4),
  'canopyExperimentalRoadsideGapM':round(margin,3),'validCameraCandidates':len(candidates),
  'nativeProjectedBBox768x480':[round(x,3) for x in bbox],
  'projectedWidthPx':round(bw,3),'projectedHeightPx':round(bh,3),
  'projectedEnvelopePct':round(pct,5),'selectionScore':round(score,5)},
 'unchangedOriginalSixCameras':True,'unchangedResearchChaseCamera':True,
 'unchangedAuthenticOriginalRoad5':True,'sourceB48RoadCount':7,'sourceB51MoverCount':28,
 'sourcePhysicsHz':240,'ballRadiusM':.65,
 'oldK4BUSharedPinesKeptButRenderHidden':8,'priorK4BUPineTransformsUnchanged':True,
 'realNativeRender':True,'realNativeRenderSizePx':[768,480],
 'notWebGLGame':True,'actualVisibleLeafPixels':'NOT_MEASURED',
 'ART':'UNJUDGED_HOLD','formalArtAccepted':0,'formalSlope2DNAMetres':0,
 'realGameNewColliders':0,'realGameSourceEdited':False,
 'HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD','FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
 'files':{p.name:{'bytes':p.stat().st_size,'sha256':sha(p)} for p in (native,shot)}}
(OUT/'K4BV_REAL_CC0_COASTAL_TREE_NATIVE_ART_HOLD_AUDIT.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
print('K4BV_GENUINE_NATIVE_ONE_REAL_COASTAL_CANOPY_RENDERED_NOT_ART_PASS',
 json.dumps({'tris':tris,'placing':audit['placement']},ensure_ascii=False),flush=True)

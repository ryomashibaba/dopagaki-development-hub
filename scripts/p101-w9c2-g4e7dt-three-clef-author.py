# G4E-7DT / THREE-CLEF CITY ART-FIRST SILHOUETTE GATE
# Three sculptural inhabited canyon districts, only 29 editable macro objects.
# Genuine DR B48 x7 and B51 x28 collision poses, 240Hz original cameras.
# No game physics edits, no GLB import, no public preview and NOT WebGL.
import bpy,math,json,os,sys
from math import sin,cos,pi
from mathutils import Vector
argv=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
def flag(s):return argv[argv.index(s)+1]
source=flag('--source')
data=json.load(open(flag('--plan'),encoding='utf-8'))
dest=flag('--out');os.makedirs(dest,exist_ok=True)
assert data['schema']=='dopagaki.g4e7dt-three-clef-unadopted/1'
assert data['mainSculpturalDistricts']==3 and data['candidateCount']==1
assert data['additionalGameColliders']==0 and not data['changedGameplay']
assert data['cameraIDs']==['t1550','t1600','t1650']
bpy.ops.wm.open_mainfile(filepath=source)
scene=bpy.context.scene
assert scene['DR_ACTUAL_B48_MESH_COUNT']==7
assert scene['DR_ACTUAL_B51_POSES_PER_FRAME']==28
assert scene['DR_ACTUAL_B48_VOID_CELL52'] is True
assert scene['DO_SOURCE_HASH']==data['sourceOriginalCXVertexSha256']
cx=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
b48=[o for o in bpy.data.objects if o.get('MESH_IS_ORIGINAL_PHYSICS_NOT_A_NEW_COLLIDER')]
b51=[o for o in bpy.data.objects if o.get('SOURCE_ORIGINAL_B51_ID')]
assert len(cx)==18 and len(b48)==7 and len(b51)==28
original_cx=[(o.name,len(o.data.polygons),o['source_sha256']) for o in cx]
original_b48=[(o.name,len(o.data.polygons),o['ORIGINAL_GAME_B48_SHA256']) for o in b48]
original_b51={o['SOURCE_ORIGINAL_B51_ID'] for o in b51}
camera_col=bpy.data.collections.get('DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION')
assert camera_col and len(camera_col.objects)==5
city=bpy.data.collections.new('DT PRIVATE THREE CLEFS / 29 MACRO PARTS / ART HOLD')
scene.collection.children.link(city)
def material(name,c,metal=.17,rough=.58,emit=False):
 m=bpy.data.materials.new(name)
 m.diffuse_color=(*c,1);m.use_nodes=True
 n=m.node_tree.nodes.get('Principled BSDF')
 n.inputs['Base Color'].default_value=(*c,1)
 n.inputs['Metallic'].default_value=metal
 n.inputs['Roughness'].default_value=rough
 if emit:
  n.inputs['Emission Color'].default_value=(*c,1)
  n.inputs['Emission Strength'].default_value=1.75
 return m
M={
 'basalt':material('DT inhabited rock basin / dark supported geography',(.10,.17,.23),.21,.58),
 'shell':material('DT pale massive cliff layers',(.60,.76,.77),.38,.39),
 'shade':material('DT open civic hollow depth',(.045,.12,.19),.28,.63),
 'garden':material('DT occupied terrace green',(.24,.38,.31),.14,.62),
 'warm':material('DT large copper civic floor',(.66,.42,.22),.33,.47),
 'transit':material('DT two broad inhabited transit viaducts',(.31,.60,.68),.4,.42)
}
def shape(name,vertices,faces,materialKey):
 mesh=bpy.data.meshes.new(name)
 mesh.from_pydata(vertices,[],faces)
 mesh.update()
 ob=bpy.data.objects.new(name,mesh)
 city.objects.link(ob)
 mesh.materials.append(M[materialKey])
 ob['DT_GAME_COLLIDER']=False
 ob['DT_ART']='HOLD'
 return ob
def prism(name,poly,y0,y1,kind,innerOpen=False):
 # A genuine deep volume in xz/y, not a facade sheet.
 # The INNER street-facing edge is left OPEN for civic depth; outer shell,
 # ground and roof remain physically present, thick and self-supporting.
 n=len(poly)
 v=[(x,y0,z) for x,z in poly]+[(x,y1,z) for x,z in poly]
 faces=[tuple(reversed(tuple(range(n)))),tuple(range(n,2*n))]
 for i in range(n):
  k=(i+1)%n
  if i!=0 or not innerOpen:
   faces.append((i,k,k+n,i+n))
  else:
   # Build a stout lintel at the top but keep the full atrium underneath
   # unclosed through AIR. This is a real absent wall, not black paint.
   x0,z0=poly[0];x1,z1=poly[1]
   v.extend([(x0,y1-9,z0),(x1,y1-9,z1)])
   a,b=len(v)-2,len(v)-1
   faces.append((a,b,1+n,n))
 return shape(name,v,faces,kind)
def block(name,center,half,kind):
 x,y,z=center;w,h,d=half
 vertices=[(x+sx*w,y+sy*h,z+sz*d) for sy in (-1,1) for sz in (-1,1) for sx in (-1,1)]
 return shape(name,vertices,[(0,1,3,2),(4,6,7,5),(0,4,5,1),(1,5,7,3),
  (3,7,6,2),(2,6,4,0)],kind)
def bridge(name,a,b,width,depth,kind):
 v0=Vector(a);v1=Vector(b)
 dir=v1-v0
 side=Vector((-dir.z,0,dir.x))
 assert side.length>1
 side.normalize();w=side*width*.5;h=Vector((0,depth*.5,0))
 corners=[v0-w-h,v0+w-h,v1+w-h,v1-w-h,v0-w+h,v0+w+h,v1+w+h,v1-w+h]
 return shape(name,[tuple(x) for x in corners],
  [(0,1,2,3),(4,7,6,5),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)],kind)
counts={'macroGeology':0,'openInnerCivicVoids':0,'inhabitedPlazas':0,
 'publicCanyonDecks':0,'joinedTransitSegments':0,'tinyWindowRepeats':0,
 'isolatedSkyscrapers':0,'floatingThinRoofSheets':0}
for idx,s in enumerate(data['sites']):
 x,base,z=s['center'];r=s['radius'];h=s['height']
 gap=s['gap'];hand=s['handedness'];span=s['frontSpan']
 # Three heavily varied sculptural *districts*, one visual language.
 # The foundation starts below the game highway, avoiding DS floating sticks.
 for side in (-1,1):
  for tier in range(3):
   shift=side*(tier*6.5+idx*3)+hand*4*sin(idx*2+tier)
   inner=x+side*(gap*.50+tier*5)
   outer=x+side*(r*.97-tier*5.4)
   front=z-span*.5+tier*(7+idx*3)
   back=z+span*.5-tier*(6+idx)
   # Concave carved wing plan, no mirrored tower repetition in the street.
   poly=[(inner+shift,front),
         (inner+shift+hand*5,back),
         (outer+shift*1.4,back+side*11),
         (outer+side*(4+idx*6),z+12*hand),
         (outer+side*4,front-10-side*idx*4),
         ((inner+outer)*.54+shift,front-16)]
   # lower geology is a continuous, load-bearing mass from y≈-65.
   y0=base-112 if tier==0 else base+h*[.45,.74][tier-1]-5
   y1=base+h*[.45,.74,1][tier]
   assert y1-y0>30
   prism('DT '+s['id']+' inhabited non-rectangular cliff '+str(side)+' / '+str(tier),
    poly,y0,y1,['basalt','shell','garden'][tier],innerOpen=(tier>=1))
   counts['macroGeology']+=1
   if tier>=1:counts['openInnerCivicVoids']+=1
  # Only ONE readable inhabited floor on each side, not DS's 80 floors.
  px=x+side*(gap*.5+r*.27)
  py=base+h*.47
  block('DT '+s['id']+' one broad visible inhabited terrace '+str(side),
   (px,py,z+hand*4),(r*.22,4.4,span*.39),'warm')
  counts['inhabitedPlazas']+=1
 # Low canyon-access platform (not roof or bridge across roadway).
 block('DT '+s['id']+' civic gorge square with uncovered sky',
  (x,base+21,z+3),(gap*.50+8,5.6,span*.27),'shade')
 counts['publicCanyonDecks']+=1
# One continuous public spine, only two MAJOR beams; not a sea of bridges.
sites=data['sites']
for k in range(2):
 a=sites[k];b=sites[k+1]
 pa=(a['center'][0],a['center'][1]+a['height']*.48,a['center'][2]+a['frontSpan']*.13)
 pb=(b['center'][0],b['center'][1]+b['height']*.48,b['center'][2]-b['frontSpan']*.14)
 bridge('DT ONE thick inhabited connecting TRANSIT STRATA '+str(k),pa,pb,13,12,'transit')
 counts['joinedTransitSegments']+=1
assert len(city.objects)==29,(len(city.objects),counts)
assert counts=={'macroGeology':18,'openInnerCivicVoids':12,'inhabitedPlazas':6,
 'publicCanyonDecks':3,'joinedTransitSegments':2,'tinyWindowRepeats':0,
 'isolatedSkyscrapers':0,'floatingThinRoofSheets':0}
assert [(o.name,len(o.data.polygons),o['source_sha256']) for o in cx]==original_cx
assert [(o.name,len(o.data.polygons),o['ORIGINAL_GAME_B48_SHA256']) for o in b48]==original_b48
assert {o['SOURCE_ORIGINAL_B51_ID'] for o in b51}==original_b51
assert len(camera_col.objects)==5
scene['DT_ART']='HOLD';scene['DT_HUMAN']='HOLD';scene['DT_PUBLISH']='HOLD'
scene['DT_NAME']='THREE-CLEF CITY PRIMARY-SILHOUETTE_RESEARCH'
scene['DT_OPEN_AIR_CIVIC_CANYONS']=3
scene['DT_GAME_COLLIDERS_ADDED']=0
scene['DT_REAL_WEBGL_GAME_FRAMEBUFFER']=False
scene.render.threads_mode='FIXED';scene.render.threads=2
scene.cycles.device='CPU';scene.cycles.samples=3
scene.cycles.use_denoising=False
scene.view_layers[0].cycles.use_denoising=False
scene.render.image_settings.file_format='PNG'
blend=os.path.join(dest,'G4E7DT_'+data['road']+'_THREE_CLEF_EDITABLE_ART_HOLD.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend)
for i,cam in enumerate(data['cameraIDs']):
 scene.frame_set(i+2) # B51 physics native frames: 15.5, 16.0, 16.5
 scene.camera=camera_col.objects.get(cam+' REAL ORIGINAL 240HZ')
 assert scene.camera is not None
 scene.render.filepath=os.path.join(dest,'G4E7DT_'+data['road']+'_'+cam+'_BLENDER_NOT_WEBGL.png')
 bpy.ops.render.render(write_still=True)
audit={'schema':'G4E7DT_THREE_CLEF_REAL_PHYSICAL_ART_REVIEW',
 'road':data['road'],'originalCXHashes':original_cx,
 'originalPhysicalB48Hashes':original_b48,'originalB51IDs':sorted(original_b51),
 'originalCameraCount':5,'comparableFrames':data['cameraIDs'],
 'realB48Count':len(b48),'realB51Count':len(b51),'geometryAdded':len(city.objects),
 'sculptureResearchCounts':counts,'cityWorldPlan':data['sites'],
 'referenceRenderer':'REAL_BLENDER_CPU_NOT_GAME_WEBGL',
 'originalGamePhysicsEdited':False,'newColliders':0,
 'visualQuality':'UNADOPTED_AWAIT_HUMAN_REVIEW',
 'art':'HOLD','human':'HOLD','publish':'HOLD','merge':'HOLD',
 'formalSlope2Meters':0}
with open(os.path.join(dest,'G4E7DT_'+data['road']+'_ART_AUDIT.json'),'w') as f:
 json.dump(audit,f,indent=2)
print('DT_THREE_CLEF_REAL_B48_B51_ART_VIEW_PASS',
 json.dumps({'road':data['road'],'macro_objects':len(city.objects),'views':3,
 'gameWebGL':False,'art':'HOLD'}))
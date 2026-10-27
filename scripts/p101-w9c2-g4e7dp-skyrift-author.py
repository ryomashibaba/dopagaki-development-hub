# G4E-7DP / SKYRIFT QUARTER -- ORIGINAL editable Blender urban hypothesis.
# ART-FIRST, still UNADOPTED. 15--17s reference views ONLY, not game WebGL.
# Source remains the exact G4E-7DO native camera master. Add no gameplay mesh.
import bpy,sys,os,json,math
from math import sin,cos,pi
from mathutils import Vector
arg=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
def flag(s):return arg[arg.index(s)+1]
src=flag('--source');master=flag('--master');out=flag('--out')
os.makedirs(out,exist_ok=True)
data=json.load(open(src,encoding='utf-8'))
assert data['schema']=='dopagaki.g4e7do-native-master-editable-blender/1'
assert data['physics']['surfaces']==7 and data['physics']['movingHazards']==28
assert data['physics']['gap52'] and data['physics']['officialSlope2Meters']==0
bpy.ops.wm.open_mainfile(filepath=master)
scene=bpy.context.scene
assert scene.get('DO_SCENE_IS_NOT_GAME_WEBGL')==True
assert scene.get('DO_SOURCE_HASH')==data['cxVertexSha256']
cam_collection=bpy.data.collections.get('DO 240HZ ORIGINAL GAME CAMERAS / EXACT PROJECTION')
assert cam_collection and len(cam_collection.objects)==5
source_objects=[o for o in bpy.data.objects if o.get('game_world_xyz_unmodified')]
assert len(source_objects)==len(data['structures'])
original_geometry=[(o.name,len(o.data.polygons),o.get('source_sha256')) for o in source_objects]
urban=bpy.data.collections.new('DP UNADOPTED ONE CONNECTED INHABITED SKYRIFT')
scene.collection.children.link(urban)
def mat(name,color,metal=.15,rough=.5,emit=None):
 m=bpy.data.materials.new(name)
 m.diffuse_color=(*color,1)
 m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF')
 bs.inputs['Base Color'].default_value=(*color,1)
 bs.inputs['Metallic'].default_value=metal
 bs.inputs['Roughness'].default_value=rough
 if emit:
  bs.inputs['Emission Color'].default_value=(*emit,1)
  bs.inputs['Emission Strength'].default_value=2.2
 return m
skin=mat('DP sculptural pearl shell',(.57,.76,.79),.42,.3)
inside=mat('DP inhabited recess dark titanium',(.035,.12,.17),.68,.4)
inner=mat('DP copper social deck',(.50,.32,.19),.34,.5)
warm=mat('DP inhabited amber light',(.72,.38,.11),.2,.5,(1,.41,.09))
cool=mat('DP public transit cyan light',(.075,.60,.75),.22,.25,(.02,.74,1))
garden=mat('DP garden city green terraces',(.15,.38,.29),.09,.7)
s0=data['lineGuides'][1]['tracks'][0]['points']
s1=data['lineGuides'][1]['tracks'][1]['points']
def lerp(a,b,t):return a*(1-t)+b*t
def interp(points,t):
 i=min(47,max(0,int(t)));f=t-i
 return Vector(tuple(lerp(points[i][k],points[i+1][k],f) for k in range(3)))
def place(station,d,h):
 edge=interp(s0,station);mid=interp(s1,station)
 outward=Vector((edge.x-mid.x,0,edge.z-mid.z)).normalized()
 return edge+outward*d+Vector((0,h,0))
def mesh(name,verts,faces,material):
 me=bpy.data.meshes.new(name)
 me.from_pydata([tuple(v) for v in verts],[],faces)
 me.update()
 ob=bpy.data.objects.new(name,me)
 urban.objects.link(ob);me.materials.append(material)
 ob['DP_ART']='HOLD';ob['DP_COLLISION']='NONE'
 return ob
def strip(name,d_base,h_base,variation,material,seed):
 # Continuous macro-landscape, connected along the original roadside
 # instead of adding independent, rectilinear houses or huge blind walls.
 verts=[];faces=[];columns=8;rows=52
 for i in range(rows+1):
  t=i/rows
  for j in range(columns+1):
   s=j/columns
   d=d_base+61*s+10*sin(3*pi*t+seed)+7*sin(pi*s)*cos(5*pi*t+seed)
   h=(h_base+variation*(sin(pi*t)**2)+
     17*sin(pi*s)+13*s+9*sin(2*pi*t+seed)*s)
   verts.append(place(30.5+t*12.2,d,h))
 for i in range(rows):
  t=(i+.5)/rows
  for j in range(columns):
   # Actual void openings across the ribbon, never black-painted holes.
   cut=(.34<t<.44 and j in (3,4,5)) or (.66<t<.78 and j in (2,3,4))
   if cut:continue
   a=i*(columns+1)+j;b=a+columns+1
   faces.append((a,a+1,b+1,b))
 ob=mesh(name,verts,faces,material)
 solid=ob.modifiers.new('DP THICK REAL VOLUME / NOT A FLAT BILLBOARD','SOLIDIFY')
 solid.thickness=7.5;solid.offset=0
 return ob
# Sculpted spatial strands forming a shared skylit civic canyon between.
a=strip('DP continuous inhabited cliffside -- near bank',105,65,64,skin,.1)
b=strip('DP separate but connected upper inhabited ridge',203,91,72,inside,1.5)
c=strip('DP low terraced waterfront / garden public land',154,35,23,garden,2.7)
def deck(u,near,far,h,width,color,name):
 # One tapered spatial bridge IN the public sky-canyon, not a playable road.
 x0=place(u-width,near,h);x1=place(u+width,near,h+4)
 x2=place(u+width,far,h+15);x3=place(u-width,far,h+10)
 ob=mesh(name,[x0,x1,x2,x3],[(0,1,2,3)],color)
 m=ob.modifiers.new('Inhabited public deck thickness','SOLIDIFY');m.thickness=4.5
for j,(station,near,far,h) in enumerate([(33.1,153,220,69),(38.4,149,232,86),(41.1,152,226,75)]):
 deck(station,near,far,h,6.5,inner,'DP open-air inhabited connector '+str(j))
# Interior building use is visibly recessed under the full-shell outer skin.
# Sparse warm/cold longitudinal strokes replace repetitive facade boxes.
for strand,d,h,material,count in [
 ('residential',159,67,warm,13),('transit',180,48,cool,9),
 ('upper-garden',242,96,cool,10)]:
 for j in range(count):
  t0=(j+.12)/count;t1=(j+.78)/count
  w=1.3 if strand=='residential' else 1.0
  positions=[place(30.5+12.2*t0,d,h),place(30.5+12.2*t1,d,h+3),
   place(30.5+12.2*t1,d,h+3+w),place(30.5+12.2*t0,d,h+w)]
  mesh('DP '+strand+' inhabited slot '+str(j),positions,[(0,1,2,3)],material)
# Structural buttresses tilt inward and visibly connect to ground: no
# freestanding giant floating roof. Three deliberately spaced geology ribs.
for j,station in enumerate((32.8,36.0,40.4)):
 base=place(station,177,5)
 tip=place(station+0.8,164,71+12*j)
 top=place(station+1.3,181,74+12*j)
 tail=place(station-1,191,5)
 mesh('DP connected excavated cliff root '+str(j),[base,tip,top,tail],
  [(0,1,2),(0,2,3)],skin)
# Camera and the source assets remain structurally untouched.
assert [(o.name,len(o.data.polygons),o.get('source_sha256')) for o in source_objects]==original_geometry
assert len(source_objects)==len(data['structures'])
assert len(cam_collection.objects)==5
assert len(urban.objects)>=40
scene['DP_ART']='HOLD';scene['DP_HUMAN']='HOLD';scene['DP_PUBLISH']='HOLD'
scene['DP_NAME']='SKYRIFT_QUARTER_V1'
scene['DP_UNADOPTED']=True;scene['DP_ADDED_COLLIDERS']=0
scene.cycles.device='CPU';scene.cycles.samples=2
scene.cycles.use_denoising=False
scene.view_layers[0].cycles.use_denoising=False
scene.render.threads_mode='FIXED';scene.render.threads=2
blend=os.path.join(out,'G4E7DP_'+data['road']+'_SKYRIFT_QUARTER_ART_HOLD.blend')
bpy.ops.wm.save_as_mainfile(filepath=blend)
for shot in data['cameras']:
 scene.camera=cam_collection.objects.get(shot['id']+' REAL ORIGINAL 240HZ')
 assert scene.camera
 scene.render.filepath=os.path.join(out,'G4E7DP_'+data['road']+'_'+shot['id']+'_ACTUAL_BLENDER_NOT_WEBGL.png')
 bpy.ops.render.render(write_still=True)
audit={'schema':'G4E7DP_AUTHORED_ONE_WORLD_SKYRIFT_QUARTER_AUDIT',
 'road':data['road'],'originalCXTriangles':data['cxTriangleCount'],
 'unalteredCXMeshCount':len(source_objects),'newLandscapeObjects':len(urban.objects),
 'cameraCount':len(cam_collection.objects),'originalGameCamera':'UNMODIFIED_240HZ',
 'originalCXVertexSha256':data['cxVertexSha256'],
 'addedColliders':0,'addedRoads':0,'addedHazards':0,
 'materializedBlenderOnly':True,'actualGameWebGL':'NOT_RUN',
 'art':'HOLD','human':'HOLD','publish':'HOLD','ready':'HOLD','merge':'HOLD',
 'officialSlope2Meters':0}
with open(os.path.join(out,'G4E7DP_'+data['road']+'_AUDIT.json'),'w') as f:
 json.dump(audit,f,indent=2)
print('DP_AUTHORED_REAL_BLENDER_COMPLETE_UNADOPTED',json.dumps(audit))

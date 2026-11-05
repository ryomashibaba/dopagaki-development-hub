"""K4CT: native editable Blender world authored around the EXACT original B51-13/14 source stations.
The DCC triangle vertices are exported unchanged to the ORIGINAL WebGL2 PRIVATE game
as noncolliding scenery. No static Game/Road5/Camera/240Hz solver/28 B51 changes.
A concept render is NOT a substitute for native camera review or human ART acceptance.
"""
import bpy, json, math
from pathlib import Path
from collections import defaultdict
from mathutils import Vector

OUT=Path('test-results/k4ct-contact-retry')
site=json.loads((OUT/'K4CT_DCC_AUTHENTIC_SITE.json').read_text())
assert site['schema']=='k4ct-authentic-source-physical-spillway-dcc-v1'
assert site['originalB48Count']==7 and site['originalB51Count']==28
assert site['newColliders']==0
assert {s['id'] for s in site['stations']}=={'a13-machine-13','a13-machine-14'}
assert bpy.app.version>=(4,0,0),bpy.app.version_string
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# In game Y is vertical. Blender Z is vertical. This proper rotation preserves scale.
def B(p):return (p[0],-p[2],p[1])
def add(a,b):return tuple(a[i]+b[i] for i in range(3))
def sub(a,b):return tuple(a[i]-b[i] for i in range(3))
def mul(v,k):return tuple(t*k for t in v)
def mix(a,b,t):return add(mul(a,1-t),mul(b,t))
def length(v):return math.sqrt(sum(x*x for x in v))
def unit(v):
 d=length(v)
 return mul(v,1/d) if d>1e-9 else (1,0,0)
def cross(a,b):return (a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])
Y=(0,1,0)
COLORS={
 'basalt':(.105,.16,.19),'shale':(.22,.30,.32),'chalk':(.48,.49,.43),
 'limestone':(.72,.68,.55),'copper':(.64,.39,.19),'oxidized':(.19,.49,.47),
 'darksteel':(.10,.18,.22),'steel':(.31,.42,.46),'amber':(.95,.54,.13),
 'signal':(.99,.25,.12),'glass':(.20,.60,.69),'lights':(.54,.92,.83),
 'tide':(.035,.27,.33),'shallows':(.10,.37,.40),'foam':(.25,.58,.59),
 'asphalt':(.095,.165,.19),'roadmark':(.23,.55,.58),'roadedge':(.80,.51,.24),
 'moss':(.18,.30,.25),'slate':(.32,.33,.32),'roof':(.34,.43,.44)
}
GROUPS=defaultdict(list)
def tri(group,a,b,c,mat):
 assert mat in COLORS and all(math.isfinite(t) for p in (a,b,c) for t in p)
 if length(cross(sub(b,a),sub(c,a)))<1e-6:return
 GROUPS[group].append((a,b,c,mat))
def quad(g,a,b,c,d,m,twoside=True):
 tri(g,a,b,c,m);tri(g,a,c,d,m)
 if twoside:
  tri(g,c,b,a,m);tri(g,d,c,a,m)
def beam(g,a,b,r,mat):
 direction=unit(sub(b,a))
 side=unit(cross(direction,Y)) if abs(direction[1])<.9 else (1,0,0)
 vertical=unit(cross(direction,side))
 ring=lambda p:[add(p,add(mul(side,r*x),mul(vertical,r*z))) for x,z in ((-1,-1),(1,-1),(1,1),(-1,1))]
 A=ring(a);C=ring(b)
 for j in range(4):quad(g,A[j],A[(j+1)%4],C[(j+1)%4],C[j],mat)
 quad(g,*A,mat);quad(g,*C,mat)
def box(g,centre,w,d,h,mat,fw=(0,0,1),side=(1,0,0)):
 fw=unit((fw[0],0,fw[2]));side=unit((side[0],0,side[2]))
 corner=lambda x,y,z:add(centre,add(mul(side,x*w/2),add(mul(Y,y*h/2),mul(fw,z*d/2))))
 b=[corner(x,-1,z) for x,z in ((-1,-1),(1,-1),(1,1),(-1,1))]
 t=[corner(x,1,z) for x,z in ((-1,-1),(1,-1),(1,1),(-1,1))]
 quad(g,*b,mat)
 quad(g,*t,mat)
 for i in range(4):quad(g,b[i],b[(i+1)%4],t[(i+1)%4],t[i],mat)
def road(idx):
 return next(r for r in site['roads'] if r['index']==idx)
def sample(idx,u):
 r=road(idx);f=max(0,min(128,u*128));i=min(127,int(f));t=f-i
 return {k:mix(r['samples'][i][k],r['samples'][i+1][k],t) for k in ('left','center','right')}
def frame(idx,u):
 p=sample(idx,u)
 before=sample(idx,max(0,u-.012))['center']
 after=sample(idx,min(1,u+.012))['center']
 fw=unit((after[0]-before[0],0,after[2]-before[2]))
 side=unit((p['right'][0]-p['left'][0],0,p['right'][2]-p['left'][2]))
 return p,fw,side
def offset_edge(p,side,dist,base):
 edge=p['right' if base=='R' else 'left']
 direction=side if base=='R' else mul(side,-1)
 return add(edge,mul(direction,dist))

# Large-scale geological / maritime composition. The B48 collision road is NOT
# recreated as a second physical surface. Negative space interrupts the rock mass.
all_road_centres=[s['center'] for r in site['roads'] for s in r['samples']]
water_y=min(x[1] for x in all_road_centres)-26
for idx,u0,u1 in ((5,.05,.99),(6,0,.60)):
 samples=[sample(idx,u0+(u1-u0)*k/120) for k in range(121)]
 for i in range(120):
  a,b=samples[i],samples[i+1]
  mid=(i+.5)/120
  directions=[]
  for p in (a,b):
   directions.append(unit((p['right'][0]-p['left'][0],0,p['right'][2]-p['left'][2])))
  # Four stratified left banks, punctuated by real cuts and stepped landings
  def left_profile(p,d,i):
   x=i/120
   heights=[-12,-7,4+4*math.sin(x*18),17+9*math.sin(x*12),32+12*math.sin(x*7)]
   offs=[26,46,79,112,168]
   return [add(offset_edge(p,d,off,'L'),(0,h,0)) for off,h in zip(offs,heights)]
  A=left_profile(a,directions[0],i)
  C=left_profile(b,directions[1],i+1)
  for j in range(4):
   if j>=2 and ((.19<mid<.31) or (.56<mid<.71)):continue
   if j>=3 and i%9 in (0,1):continue
   quad('01_RIFT_AND_SECTIONED_BASALT',A[j],C[j],C[j+1],A[j+1],
        ('basalt','shale','chalk','moss')[j])
  # A terraced low seawall opens onto a broad horizontal tide basin.
  def right_profile(p,d):
   return [
    add(offset_edge(p,d,28,'R'),(0,-13,0)),
    add(offset_edge(p,d,43,'R'),(0,-19,0)),
    add(offset_edge(p,d,72,'R'),(0,water_y+7-p['right'][1],0)),
    add(offset_edge(p,d,94,'R'),(0,water_y-p['right'][1],0))]
  A=right_profile(a,directions[0]);C=right_profile(b,directions[1])
  for j,m in enumerate(('basalt','slate','chalk')):
   quad('02_TIDAL_CUT_AND_BANK',A[j],C[j],C[j+1],A[j+1],m)
  at=add(offset_edge(a,directions[0],94,'R'),(0,water_y-a['right'][1],0))
  bt=add(offset_edge(b,directions[1],94,'R'),(0,water_y-b['right'][1],0))
  af=add(offset_edge(a,directions[0],340,'R'),(0,water_y-a['right'][1],0))
  bf=add(offset_edge(b,directions[1],340,'R'),(0,water_y-b['right'][1],0))
  quad('03_REAL_HORIZON_TIDAL_WATER',at,bt,bf,af,'shallows' if i%24<3 else 'tide')
  if i%19==0:
   quad('03_REAL_HORIZON_TIDAL_WATER',at,bt,add(bt,(0,.17,0)),add(at,(0,.17,0)),'foam')

# Transform road controls into expressive, different B51-13/14 set pieces.
def shore_anchor(st,side='R',off=40):
 p,fw,lat=frame(st['roadIndex'],st['u'])
 return p,fw,lat,offset_edge(p,lat,off,side)

stations={s['id']:s for s in site['stations']}
for number,st in ((13,stations['a13-machine-13']),(14,stations['a13-machine-14'])):
 p,fw,lat,L=shore_anchor(st,'L',34)
 _,_,_,R=shore_anchor(st,'R',34)
 # Distinct gate silhouette: hazard 13 has one tilted copper navigation tower;
 # hazard 14 uses split oxidized gantries defining the next part of the journey.
 group='04_13_TILT_GATE' if number==13 else '05_14_SPLIT_GATE'
 height=58 if number==13 else 43
 for side,anchor in (('L',L),('R',R)):
  foot=add(anchor,(0,-5,0))
  head=add(anchor,add((0,height,0),mul(lat,(1 if side=='R' else -1)*(7 if number==13 else 2))))
  beam(group,foot,head,3.2,'darksteel')
  beam(group,add(foot,mul(fw,10)),head,1.5,'copper' if number==13 else 'oxidized')
  # Navigational light at human-visible scale, never implies safe lane
  box(group,add(head,(0,3,0)),8,7,6,'signal' if number==13 else 'amber',fw,lat)
  box(group,add(head,(0,6,0)),10,9,1.3,'lights',fw,lat)
 # Single overhead open truss above gameplay, not a collider or tunnel wall.
 topL=add(L,(0,height+9,0));topR=add(R,(0,height+9,0))
 beam(group,topL,topR,1.8,'steel')
 for t in (.18,.36,.54,.72):
  a=mix(topL,topR,t);b=mix(topL,topR,t+.10)
  beam(group,add(a,mul(fw,-4)),add(b,mul(fw,4)),.85,'copper' if number==13 else 'oxidized')
 # Wharf service deck is OUTBOARD, no central road collision or camera proxy.
 _,_,_,dock=shore_anchor(st,'R',129)
 dock=add(dock,(0,-2,0))
 box('06_WORKING_DOCK_AND_MAINTENANCE',dock,69,85,9,'basalt',fw,lat)
 for dx in (-26,26):
  support=add(dock,mul(lat,dx))
  beam('06_WORKING_DOCK_AND_MAINTENANCE',add(support,(0,-5,0)),
       add(support,(0,-38,0)),2.2,'darksteel')
 # Built roofline has alternating voids / open loading bays, not a solid block.
 terminal=add(dock,add(mul(lat,18),(0,20,0)))
 box('07_PORT_CONTROL_AND_SERVICE',terminal,36,71,29,'darksteel',fw,lat)
 box('07_PORT_CONTROL_AND_SERVICE',add(terminal,(0,15,0)),44,77,4,'roof',fw,lat)
 for k in (-2,-1,0,1,2):
  q=add(terminal,add(mul(fw,k*11),(0,2,0)))
  box('07_PORT_CONTROL_AND_SERVICE',add(q,mul(lat,-19)),2.0,6,16,'glass',fw,lat)
 for k in (-1,1):
  tower=add(dock,add(mul(fw,k*27),mul(lat,47)))
  beam('08_WORKING_CARGO_CRANES',add(tower,(0,5,0)),add(tower,(0,73,0)),3,'steel')
  beam('08_WORKING_CARGO_CRANES',add(tower,(0,70,0)),add(tower,add((0,70,0),mul(lat,-83))),2.5,'copper')
  beam('08_WORKING_CARGO_CRANES',add(tower,(0,74,0)),add(tower,add((0,70,0),mul(lat,-83))),1.1,'oxidized')
  beam('08_WORKING_CARGO_CRANES',add(tower,add((0,68,0),mul(lat,-72))),
       add(tower,add((0,20,0),mul(lat,-72))),.5,'darksteel')

# One place-defining spillway/dry dock bridges between real coast and terminal.
for j,(idx,u) in enumerate(((5,.47),(5,.76),(6,.20))):
 p,fw,lat=frame(idx,u)
 centre=offset_edge(p,lat,174,'R')
 centre=add(centre,(0,water_y+17-p['right'][1],0))
 deck='09_SPILLWAY_SERVICE_BRIDGES'
 box(deck,centre,127,12,5,'copper',fw,lat)
 for x in (-55,-20,20,55):
  a=add(centre,mul(lat,x))
  beam(deck,add(a,(0,-3,0)),add(a,(0,-31,0)),2,'basalt')
  beam(deck,add(a,(0,3,0)),add(a,(0,14,0)),.85,'steel')
 for x in (-48,48):
  a=add(centre,mul(lat,x))
  beam(deck,add(a,(0,12,0)),add(centre,(0,25,0)),1.1,'oxidized')


# The ORIGINAL Road5/6 is still the sole collision road. This is a Blender-
# authored, noncolliding skin whose Y values are sourced from the actual B48
# lane quadrilateral (+0.12 m air gap to avoid z fighting). It replaces the
# visually incoherent magenta/cyan stripes *only in the research renderer*.
# Changing these visible colors DOES NOT change steering, safety, lanes or CCD.
roadBands=((0,.035,'darksteel'),(.035,.055,'roadedge'),(.055,.46,'asphalt'),
           (.46,.475,'roadmark'),(.475,.525,'asphalt'),(.525,.54,'roadmark'),
           (.54,.945,'asphalt'),(.945,.965,'roadedge'),(.965,1,'darksteel'))
for idx in (5,6):
 for k in range(128):
  a=sample(idx,k/128);c=sample(idx,(k+1)/128)
  def rd(s,t):
   return add(mix(s['left'],s['right'],t),(0,.12,0))
  for t0,t1,m in roadBands:
   quad('00_SOURCE_CONFORMAL_NONCOLLIDING_ROAD_ART',
        rd(a,t0),rd(c,t0),rd(c,t1),rd(a,t1),m,twoside=False)
# Two different, authentic source-station warning portal forms. These are
# spatial landmarks, not extra moving hazards and not certified safe lanes.
for st in site['stations']:
 number=int(st['id'].rsplit('-',1)[1])
 p,fw,side=frame(st['roadIndex'],st['u'])
 gt='0A_SOURCE_STATION_GATE_CANTILEVERS'
 # Staggered high sweeping ribs make the 2 hazards legible from approach.
 for sideLabel,mult in (('L',-1),('R',1)):
  edge=offset_edge(p,side,24,sideLabel)
  vertical=41 if number==13 else 59
  base=add(edge,(0,-9,0))
  tip=add(edge,add((0,vertical,0),mul(side,mult*10)))
  beam(gt,base,tip,1.7,'oxidized' if number==14 else 'copper')
  beam(gt,tip,add(tip,add(mul(fw,34),(0,-13,0))),1.0,'darksteel')
  # Hot visual navigation marker is OUTSIDE road; no false safe-path guarantee.
  box(gt,add(tip,(0,2,0)),6,7,5,'amber' if number==14 else 'signal',fw,side)

# Editability: separate mesh objects by functional zones, real Blender materials.
materials={}
for key,color in COLORS.items():
 m=bpy.data.materials.new('K4CT_'+key.upper())
 m.diffuse_color=(*color,1)
 m.use_nodes=True
 node=m.node_tree.nodes.get('Principled BSDF')
 if node:
  node.inputs['Base Color'].default_value=(*color,1)
  node.inputs['Metallic'].default_value=.6 if key in ('steel','copper','oxidized','darksteel') else .08
  node.inputs['Roughness'].default_value=.22 if key in ('glass','tide','shallows','lights') else .74
 materials[key]=m
counts={}
for group,faces in GROUPS.items():
 verts=[];tris=[];mi=[]
 for a,b,c,mat in faces:
  i=len(verts);verts.extend((B(a),B(b),B(c)));tris.append((i,i+1,i+2));mi.append(mat)
 mesh=bpy.data.meshes.new(group+'_EDITABLE_MESH')
 mesh.from_pydata(verts,[],tris);mesh.update()
 obj=bpy.data.objects.new(group,mesh);bpy.context.collection.objects.link(obj)
 for mat in materials.values():mesh.materials.append(mat)
 ids={name:k for k,name in enumerate(COLORS.keys())}
 for poly,mat in zip(mesh.polygons,mi):poly.material_index=ids[mat]
 obj['originalGameCollidersAdded']=0
 obj['formalARTAccepted']=False
 obj['usesActualSourceB48']=True
 obj['notAHumanVerdict']=True
 counts[group]=len(faces)
assert sum(counts.values())>2500,counts
assert all(len(f)>0 for f in GROUPS.values())

# The production data is exported BY this Blender authoring process itself.
flat=[]
for group,faces in GROUPS.items():
 for a,b,c,mat in faces:
  for p in (a,b,c):flat.extend((*p,*COLORS[mat]))
assert len(flat)==sum(counts.values())*18
authored={'schema':'k4ct-blender-authored-true-source-integrated-scene/1',
 'nativeBlenderVersion':bpy.app.version_string,
 'vertices':flat,'triangles':sum(counts.values()),'objects':counts,'materials':list(COLORS),
 'sameGameCoordinateSystem':True,'actualStations':site['stations'],
 'sourcePhysicalRoad5SHA256':site['researchPhysicalRoad5SHA256'],
 'originalB48':7,'originalB51':28,'newColliders':0,'ART':'REJECT',
 'formalArtAdopted':0,'slope2DNAmeters':0,'HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD',
 'FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
(OUT/'K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json').write_text(json.dumps(authored,separators=(',',':'))+'\n')

# DCC-only composition render, explicitly NOT original chase camera evidence.
s13=stations['a13-machine-13'];p,fw,lat=frame(s13['roadIndex'],s13['u'])
cam_pos=add(p['center'],add(mul(fw,-215),add(mul(lat,106),(0,82,0))))
look=add(p['center'],add(mul(fw,120),(0,26,0)))
cam_data=bpy.data.cameras.new('DCC_ONLY_NOT_ORIGINAL_SOURCE_CAMERA')
cam=bpy.data.objects.new('DCC_CONCEPT_VIEW_NOT_GAME_CAMERA',cam_data)
bpy.context.collection.objects.link(cam);bpy.context.scene.camera=cam
cam.location=B(cam_pos);direction=Vector(B(look))-cam.location
cam.rotation_euler=direction.to_track_quat('-Z','Y').to_euler()
cam_data.type='PERSP';cam_data.lens=27
sun=bpy.data.lights.new('DCC_SHADOWS_SUN','SUN');sun.energy=2.1
light=bpy.data.objects.new('DCC_SHADOWS_SUN',sun);bpy.context.collection.objects.link(light)
light.rotation_euler=(math.radians(35),0,math.radians(-22))
world=bpy.context.scene.world or bpy.data.worlds.new('K4CT_DCC_SKY')
bpy.context.scene.world=world;world.use_nodes=True
bg=world.node_tree.nodes.get('Background')
if bg:bg.inputs['Color'].default_value=(.16,.25,.34,1);bg.inputs['Strength'].default_value=.65
scene=bpy.context.scene
scene.render.resolution_x=1280;scene.render.resolution_y=720;scene.render.resolution_percentage=100
try:scene.render.engine='BLENDER_EEVEE_NEXT'
except:scene.render.engine='BLENDER_EEVEE'
scene.render.image_settings.file_format='PNG'
blend=OUT/'K4CT_EDITABLE_SOURCE_ALIGNED_TIDAL_SPILLWAY_ART_REJECT.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(blend.resolve()))
scene.render.filepath=str((OUT/'K4CT_DCC_CONCEPT_NOT_SOURCE_CAMERA.png').resolve())
try:
 bpy.ops.render.render(write_still=True)
except Exception as e:
 (OUT/'K4CT_DCC_CONCEPT_RENDER_ERROR.txt').write_text(str(e))
result={'schema':'k4ct-genuine-native-blender-evidence/1',
 'editableBlend':blend.is_file() and blend.stat().st_size>30000,
 'blenderVersion':bpy.app.version_string,'sourceRoad5PhysicalSHA256':site['researchPhysicalRoad5SHA256'],
 'originalMovingB51':28,'originalRoads':7,'exactNativeB51Stations':[s['id'] for s in site['stations']],
 'trueDCCObjects':len(GROUPS),'triangles':authored['triangles'],'sameGameVertices':True,
 'gameCollidersAdded':0,'nativeGameIntegratedYet':False,
 'ART':'REJECT','formalART':0,'HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD','FPS':'HOLD'}
(OUT/'K4CT_DCC_EDITABLE_AUTHOR_RESULT.json').write_text(json.dumps(result,indent=2)+'\n')
print('K4CT_REAL_EDITABLE_DCC_AUTHORED_FOR_SOURCE_NATIVE_GAME',json.dumps(result))

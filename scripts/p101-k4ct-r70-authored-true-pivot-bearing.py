"""R70 one Blender-authored fixed true B51-14 pivot cantilever/bearing on left bank.
Uses original R49 BLEND and exports actual evaluated polygons to original
private scene bridge, leaving protected8 and all actual B51/road untouched."""
import bpy,bmesh,json,hashlib,math
from pathlib import Path
from mathutils import Vector
root=Path('test-results/k4ct-contact-retry');out=Path('test-results/k4ct-r70-authored')
out.mkdir(parents=True,exist_ok=True)
dfile=root/'K4CT_DCC_BLENDER_TO_NATIVE_GEOMETRY.json'
rfile=root/'K4CT_R9_BLENDER_TRUE_MATERIAL_BRIDGE.json'
bfile=root/'K4CT_EDITABLE_SOURCE_ALIGNED_TIDAL_SPILLWAY_ART_REJECT.blend'
early=json.loads(Path('test-results/k4ct-r60-early/K4CT_R60_ORIGINAL_NATIVE_WARNING_RESULT.json').read_text())
assert [f['tick'] for f in early['frames']]==[15660,15744,15924]
assert all(len(f['trueSourceCamera'])==12 for f in early['frames'])
D=json.loads(dfile.read_text());R=json.loads(rfile.read_text())
assert D['triangles']==R['totalDccTriangles']==32004
assert D['originalB48']==R['originalB48']==7 and D['originalB51']==R['originalB51']==28
assert D['newColliders']==R['newColliders']==0
assert D['sourcePhysicalRoad5SHA256']=='4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b'
group=next(n for n in D['objects'] if n.startswith('17_'))
protected={'00','12','13','19','34','35','41','42'}
def pg(d):
 o={};i=0
 for n,c in d['objects'].items():
  if n[:2] in protected:o[n]=d['vertices'][i:i+c*18]
  i+=c*18
 assert i==len(d['vertices'])
 return o
preserve=pg(D);oldroad=R['legacyRoadVertices'][:]
oldblob=hashlib.sha256(bfile.read_bytes()).hexdigest()
bpy.ops.wm.open_mainfile(filepath=str(bfile.resolve()))
assert bpy.app.version>=(4,0,0)
# R70 true Road6 physical centre and source-native signed lateral basis.
# Inputs below are local heights above original ROAD_Y, NOT absolute world Y.
ROAD_Y=120.5326810034845
O=Vector((1178.7223464542742,0,-493.61728855064536))
F=Vector((.9194711927942447,0,-.3931573802200958))
S=Vector((-.3964271885636732,0,-.9180661654627634))
def world(d,t,h):return O+S*d+F*t+Vector((0,ROAD_Y+h,0))
# Validate native 64-bit source positions before Blender mathutils.Vector
# rounding: doing the subtraction AFTER casting yields ~0.12mm false drift.
TRUE_PIVOT_XYZ=(1181.5640147661836,122.43275866083378,-487.0341339030744)
def pivot_of(native):
 c=native['centre'];yaw=native['yawRadians'];half=native['halfSize'][0]
 return (c[0]-math.cos(yaw)*half,c[1],c[2]+math.sin(yaw)*half)
poses=[next(p for p in frame['realNativeB51Poses'] if p['id']=='a13-machine-14') for frame in early['frames']]
assert all(math.dist(pivot_of(p),TRUE_PIVOT_XYZ)<1e-9 for p in poses),'true source fixed native B51-14 pivot drift'
P=Vector(TRUE_PIVOT_XYZ)

assert all(p['halfSize']==[1.7,1.7,1.4] for p in poses)
localD=(P-world(0,0,0)).dot(S);localT=(P-world(0,0,0)).dot(F)
assert -7.18<localD< -7.16 and abs(localT)<.03,'source pivot is not original left road shoulder'
FULL_ROTATION_SWEEP_RADIUS=math.hypot(2*1.7,1.4)
assert abs(FULL_ROTATION_SWEEP_RADIUS-3.67695526217)<1e-7
assert -12.5-(localD-FULL_ROTATION_SWEEP_RADIUS)<-1.6,'incorrect support clearance sign'
assert abs(-12.5-localD)-FULL_ROTATION_SWEEP_RADIUS>1.65
assert (P.y+6)-(P.y+1.7)>=4.3-1e-7

def tobl(p):return Vector((p.x,-p.z,p.y))
def togame(v):return Vector((v.x,v.z,-v.y))
materials={x['name']:x for x in R['materials']}
parts=[]
def build(name,points,faces,material,width):
 mesh=bpy.data.meshes.new('R70_'+name+'_EDITABLE')
 mesh.from_pydata([tobl(p) for p in points],[],faces)
 mesh.update()
 obj=bpy.data.objects.new('R70_'+name+'_AUTHORED',mesh)
 bpy.context.collection.objects.link(obj)
 m=bpy.data.materials.new('R70_'+material.upper()+'_'+name)
 m.use_nodes=True
 bsdf=m.node_tree.nodes.get('Principled BSDF')
 x=materials[material]
 bsdf.inputs['Base Color'].default_value=(*x['baseColor'],1)
 bsdf.inputs['Roughness'].default_value=x['roughness']
 bsdf.inputs['Metallic'].default_value=x['metalness']
 mesh.materials.append(m)
 if width:
  bev=obj.modifiers.new('R70_MACHINED_BEVEL','BEVEL')
  bev.width=width;bev.segments=2;bev.limit_method='ANGLE';bev.angle_limit=.45
 parts.append((obj,material,width))
def prism(name,three,depth,mat,w):
 a=[world(d,t-depth/2,y) for d,t,y in three]
 b=[world(d,t+depth/2,y) for d,t,y in three]
 build(name,a+b,[(0,1,2),(5,4,3),(0,3,4,1),(1,4,5,2),(2,5,3,0)],mat,w)
def member(name,a,b,r,mat,w):
 u=tobl(a);v=tobl(b);d=(v-u).normalized()
 n=d.cross(Vector((0,0,1)))
 if n.length<.001:n=d.cross(Vector((0,1,0)))
 n.normalize();p=d.cross(n).normalized()
 ring=lambda c:[c-n*r-p*r,c+n*r-p*r,c+n*r+p*r,c-n*r+p*r]
 coords=[togame(x) for x in ring(u)+ring(v)]
 faces=[(0,3,2,1),(4,5,6,7)]
 for i in range(4):faces.append((i,(i+1)%4,(i+1)%4+4,i+4))
 build(name,coords,faces,mat,w)
# R70: ONE fixed-pivot left-bank industrial support, no A-frame or opaque
# cliff wedge. The native rotor itself STILL rotates inside its original
# physical B51 collision OBB, around the EXACT untouched source P pivot.
# No source native physics energy/motor force is added: this is visual stage
# engineering only, never a certified kinematic force or safety aid.
# A compact support tower is physically LEFT and OUTSIDE original B48;
# its nearest lateral point is d=-12.5 (road left edge is d=-8).
# Native B51-14 entire 360-degree OBB sweep stays >=1.65m from the
# outboard tower. Only the elevated cantilever approaches the fixed rotor
# pivot: the beam is >=4.30m ABOVE the entire original B51 vertical OBB;
# the thin vertical axis drops at the true stationary pivot to the rotor top.
# Its bottom touches native B51 top, does not create an independent obstacle
# in the drive corridor. No decorative fake safe gate/traffic instruction.
def cube(name,d0,d1,t0,t1,h0,h1,material,bevel):
 assert d0<d1<=-12.5 and t0<t1 and h0<h1
 ps=[world(d,t,h) for h in (h0,h1) for t in (t0,t1) for d in (d0,d1)]
 faces=[(0,1,3,2),(4,6,7,5),(0,4,5,1),(2,3,7,6),(0,2,6,4),(1,5,7,3)]
 build(name,ps,faces,material,bevel)
cube('01_SOURCE_BANK_FOOTING',-16.3,-12.5,-5.5,5.5,-2,1.0,'r44_bank_cut_stone',.14)
cube('02_MECHANICAL_SERVICE_TOWER',-15.7,-13.2,-2.4,2.4,1.0,8.5,'r44_gate_patina',.16)
cube('03_STRONGLINE_COPPER_SPINE',-15.4,-14.9,-2.2,2.2,1.0,8.3,'copper',.06)
cube('04_MACHINED_TOP_BEARING_HOOD',-16.0,-12.8,-3.3,3.3,8.3,9.4,'steel',.13)
member('05_SINGLE_HIGH_CANTILEVER',world(-14.3,0,8.6),P+Vector((0,6,0)),.28,'steel',.05)
member('06_COAXIAL_VERTICAL_SHAFT',P+Vector((0,1.7,0)),P+Vector((0,6,0)),.13,'r44_gate_bronze',.035)
member('07_BEARING_COLLAR_ABOVE_NATIVE_BODY',P+Vector((0,1.73,0)),P+Vector((0,2.35,0)),.23,'r44_gate_patina',.055)
member('08_OFFROAD_BRACE',world(-14.1,-3.2,5.3),world(-14.1,0,8.4),.24,'steel',.045)
member('09_TOWER_ANCHOR',world(-14.0,0,.3),world(-14.0,0,2.3),.30,'r44_gate_bronze',.04)
member('10_SIDE_DRIVE_PLAQUE',world(-15.7,1.5,6.3),world(-13.2,1.5,6.3),.12,'copper',.02)
assert len(parts)==10
deps=bpy.context.evaluated_depsgraph_get()
appendD=[];appendR=[];count=0;manifest=[]
for ob,name,width in parts:
 ev=ob.evaluated_get(deps);mesh=ev.to_mesh()
 bm=bmesh.new();bm.from_mesh(mesh);bmesh.ops.triangulate(bm,faces=list(bm.faces))
 uv=bm.loops.layers.uv.verify();entry=materials[name]
 start=count
 for face in bm.faces:
  loops=list(face.loops)
  if len(loops)!=3:raise ValueError('non triangle evaluated')
  pts=[togame(l.vert.co) for l in loops]
  norm=(pts[1]-pts[0]).cross(pts[2]-pts[0])
  if norm.length<1e-7:continue
  norm.normalize()
  for loop,p in zip(loops,pts):loop[uv].uv=(p.x*.017,p.z*.017)
  shade=max(.55,.69+.20*abs(norm.y))
  rgb=[min(1,max(0,float(v)*shade)) for v in entry['baseColor']]
  for loop,p in zip(loops,pts):
   tex=loop[uv].uv
   appendD.extend([float(p.x),float(p.y),float(p.z),*rgb])
   appendR.extend([float(p.x),float(p.y),float(p.z),
      *[float(v) for v in entry['baseColor']],
      float(norm.x),float(norm.y),float(norm.z),
      float(tex.x),float(tex.y),float(entry['id']),
      float(entry['roughness']),float(entry['metalness'])])
  count+=1
 bm.free();ev.to_mesh_clear()
 manifest.append({'name':ob.name,'material':name,'bevel':width,'evaluatedTriangles':count-start})
assert len(parts)==10 and count>130
oldcount=D['objects'][group];start=sum(c for n,c in D['objects'].items() if list(D['objects']).index(n)<list(D['objects']).index(group))+oldcount
assert start>R['roadLegacyTriangles']
dOff=start*18;rOff=(start-R['roadLegacyTriangles'])*42
assert D['vertices'][dOff:dOff+3]==R['vertices'][rOff:rOff+3]
D['vertices'][dOff:dOff]=appendD;R['vertices'][rOff:rOff]=appendR
D['objects'][group]+=count;D['triangles']+=count
R['triangles']+=count;R['totalDccTriangles']+=count
assert D['triangles']==R['totalDccTriangles']==R['roadLegacyTriangles']+R['triangles']
assert len(D['vertices'])==D['triangles']*18 and len(R['vertices'])==R['triangles']*42
assert pg(D)==preserve and R['legacyRoadVertices']==oldroad
assert hashlib.sha256(bfile.read_bytes()).hexdigest()==oldblob
D['ART']='HOLD';D['formalArtAdopted']=0;D['slope2DNAmeters']=0
R['ART']='HOLD'
dfile.write_text(json.dumps(D,separators=(',',':'))+'\n')
rfile.write_text(json.dumps(R,separators=(',',':'))+'\n')
saved=out/'R70_TRUE_NATIVE_PIVOT_CANTILEVER_ART_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(saved.resolve()))
assert saved.stat().st_size>100000
report={'schema':'k4ct-r70-authored-one-true-rotor-pivot-bearing-blender/1',
 'source':'R60 3 original true 240Hz Chromium cameras and exact moving B51 poses',
 'trueEditableBlenderMeshes':len(parts),'newEvaluatedTriangles':count,
 'wholeSceneTriangles':D['triangles'],'group':group,'protected8XYZRGBExact':True,
 'originalRoad5Sha':D['sourcePhysicalRoad5SHA256'],'B48':7,'B51':28,
 'newColliders':0,'sourceBlenderSHAUnchanged':oldblob,'objects':manifest,
 'humanProven':False,'actualKinematicCouplingToB51':False,
 'trueOriginalRotorPivotXYZ':list(TRUE_PIVOT_XYZ),'nativePivotAcrossThreeActualTicks':True,
 'fullOriginalRotorSweepRadiusMetres':FULL_ROTATION_SWEEP_RADIUS,
 'leftBankTowerMinimumSweepClearanceM':abs(-12.5-localD)-FULL_ROTATION_SWEEP_RADIUS,
 'cantileverMinimumAboveOriginalRotorM':4.3,
 'mechanicalMountCoaxialAtTrueNativePivot':True,
 'visualNoPhysicalMotorDriveOrNewCollider':True,
 'researchArtOnly':True,'ART':'HOLD','HUMAN':'HOLD','formalARTAdopted':0,
 'slope2DNAmeters':0,'RELEASE':'HOLD','MERGE':'HOLD'}
(out/'R70_TRUE_PIVOT_BEARING_MANIFEST.json').write_text(json.dumps(report,indent=2)+'\n')
print('R70_GENUINE_BLENDER_MACHINE_AUTHORED',json.dumps({'meshes':len(parts),'triangles':count,'total':D['triangles'],'protected':True}))

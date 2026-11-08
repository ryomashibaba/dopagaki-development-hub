"""R60 single real Blender editable noncolliding mechanical rocker.
Uses original R49 BLEND and exports actual evaluated polygons to original
private scene bridge, leaving protected8 and all actual B51/road untouched."""
import bpy,bmesh,json,hashlib,math
from pathlib import Path
from mathutils import Vector
root=Path('test-results/k4ct-contact-retry');out=Path('test-results/k4ct-r60-authored')
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
O=Vector((1157.592,0,-494.670));F=Vector((.92049565,0,-.3907528));S=Vector((-.3907528,0,-.92049565))
def world(d,t,y):return O+S*d+F*t+Vector((0,y,0))
def tobl(p):return Vector((p.x,-p.z,p.y))
def togame(v):return Vector((v.x,v.z,-v.y))
materials={x['name']:x for x in R['materials']}
parts=[]
def build(name,points,faces,material,width):
 mesh=bpy.data.meshes.new('R60_'+name+'_EDITABLE')
 mesh.from_pydata([tobl(p) for p in points],[],faces)
 mesh.update()
 obj=bpy.data.objects.new('R60_'+name+'_AUTHORED',mesh)
 bpy.context.collection.objects.link(obj)
 m=bpy.data.materials.new('R60_'+material.upper()+'_'+name)
 m.use_nodes=True
 bsdf=m.node_tree.nodes.get('Principled BSDF')
 x=materials[material]
 bsdf.inputs['Base Color'].default_value=(*x['baseColor'],1)
 bsdf.inputs['Roughness'].default_value=x['roughness']
 bsdf.inputs['Metallic'].default_value=x['metalness']
 mesh.materials.append(m)
 if width:
  bev=obj.modifiers.new('R60_MACHINED_BEVEL','BEVEL')
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
# Research static, single nonrepeating load chain, outside true right B48 bank
prism('01_ROCK_BASE',[(-70,21,106),(-38,21,106),(-51,21,129)],22,'r44_bank_cut_stone',.5)
member('02_PRIMARY_BRANCH',world(-55,6,120),world(-43,18,158),2.35,'darksteel',.32)
member('03_DIFFERENT_LOAD_BRANCH',world(-59,34,115),world(-43,18,158),1.95,'r44_gate_patina',.28)
member('04_HINGED_OVERARM',world(-43,18,158),world(-24,22,139),3.35,'r44_gate_bronze',.4)
member('05_COUNTERWEIGHT_ARM',world(-43,18,158),world(-72,25,144),3.4,'copper',.36)
prism('06_WEIGHT',[(-80,25,141),(-68,25,149),(-77,25,128)],12,'r44_gate_bronze',.6)
member('07_EXPOSED_PISTON',world(-61,4,113),world(-42,15,148),1.1,'steel',.18)
member('08_PARALLEL_DIFFERENT_PISTON',world(-53,31,111),world(-38,19,151),1.,'steel',.17)
member('09_B51_APPROACH_SPINDLE',world(-24,22,139),world(-23,22,124),2.9,'r44_gate_patina',.18)
prism('10_OPEN_ROTOR_JAW',[(-28,22,127),(-20,22,126),(-23,22,136)],9,'signal',.2)
pose=Vector(early['frames'][0]['realNativeB51Poses'][0]['centre'])
assert early['frames'][0]['realNativeB51Poses'][0]['id']=='a13-machine-14'
assert 1<(pose-world(-23,22,124)).length<15
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
saved=out/'R60_ONE_AUTHORED_COUNTERWEIGHT_UNAPPROVED.blend'
bpy.ops.wm.save_as_mainfile(filepath=str(saved.resolve()))
assert saved.stat().st_size>100000
report={'schema':'k4ct-r60-authored-one-counterweight-genuine-blender/1',
 'source':'R60 3 original true 240Hz Chromium cameras and exact moving B51 poses',
 'trueEditableBlenderMeshes':len(parts),'newEvaluatedTriangles':count,
 'wholeSceneTriangles':D['triangles'],'group':group,'protected8XYZRGBExact':True,
 'originalRoad5Sha':D['sourcePhysicalRoad5SHA256'],'B48':7,'B51':28,
 'newColliders':0,'sourceBlenderSHAUnchanged':oldblob,'objects':manifest,
 'humanProven':False,'actualKinematicCouplingToB51':False,
 'researchArtOnly':True,'ART':'HOLD','HUMAN':'HOLD','formalARTAdopted':0,
 'slope2DNAmeters':0,'RELEASE':'HOLD','MERGE':'HOLD'}
(out/'R60_AUTHORED_MACHINE_MANIFEST.json').write_text(json.dumps(report,indent=2)+'\n')
print('R60_GENUINE_BLENDER_MACHINE_AUTHORED',json.dumps({'meshes':len(parts),'triangles':count,'total':D['triangles'],'protected':True}))

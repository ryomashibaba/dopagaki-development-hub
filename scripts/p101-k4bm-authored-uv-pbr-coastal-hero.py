"""K4BM — source-road-calibrated custom UV+PBR maritime hero, DCC research only.

Not another primitive skyline. Uses substantial authored parametric mesh sections,
true per-face UVs, physically coherent layered materials, road-surface granular
microstructure and deliberately composed near/mid/far art. No game integration.

Source B48 Road5 mesh, all 6 cameras, all original B51 movers and physics remain
unmodified; art-only DCC shaders and editable research meshes are unapproved.
"""
import bpy,sys,os,json,hashlib,struct,math,random
from math import sin,cos,pi
from mathutils import Vector
args=sys.argv[sys.argv.index('--')+1:]
def flag(x):return os.path.abspath(args[args.index(x)+1])
base=flag('--base');outdir=flag('--out')
os.makedirs(outdir,exist_ok=True)
def sha(p):
 h=hashlib.sha256()
 with open(p,'rb') as f:
  for a in iter(lambda:f.read(1<<20),b''):h.update(a)
 return h.hexdigest()
PARENT_SHA="220855d6500a74697e41b9bad36cb5c20654ea77d8c8a4be48d5ebf9a4ab2488"
assert sha(base)==PARENT_SHA
bpy.ops.wm.open_mainfile(filepath=base)
scene=bpy.context.scene
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
cams={};src={};rc={};other={}
for name,tick in (("control",11307),("ultra",11341)):
 a=[o for o in rig.objects if o.type=="CAMERA" and str(tick) in o.name]
 assert len(a)==1
 cams[name]=a[0]
 c=bpy.data.collections["K4AY SOURCE B48 | "+name.upper()+" | TRUE TESSELLATED ROAD5"]
 assert len(c.objects)==1
 rc[name]=c;src[name]=next(iter(c.objects))
 other[name]=bpy.data.collections["K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | "+name.upper()]
 assert len(other[name].objects)==6
def fp(obj):
 h=hashlib.sha256()
 for v in obj.data.vertices:
  h.update(struct.pack('<3d',*[float(x) for x in v.co]))
 for face in obj.data.polygons:
  h.update(struct.pack('<3i',*[int(v) for v in face.vertices]))
 return h.hexdigest()
fp0={n:fp(o) for n,o in src.items()}
assert set(fp0.values())=={"f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"}
cam0={n:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens)) for n,o in cams.items()}
C=cams['control'].location.copy()
look=cams['control'].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((look.x,look.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def P(d,s,z):return C+F*d+S*s+Vector((0,0,z))
obj=src['control']; inv=obj.matrix_world.inverted()
def ray(d,s):
 orig=inv@P(d,s,600)
 direct=(inv.to_3x3()@Vector((0,0,-1))).normalized()
 valid,local,n,face=obj.ray_cast(orig,direct,distance=1500)
 if not valid:return None
 pt=obj.matrix_world@local
 return (float(pt.z-C.z),int(face))
survey=[]
for dd in (-25,0,25,50,75,100,125,150,170):
 hits=[s for s in range(-70,111,2) if ray(dd,s) is not None]
 assert len(hits)>=35,(dd,hits)
 lo=min(hits);hi=max(hits)
 assert -50<lo<-20 and 40<hi<90,(dd,lo,hi)
 assert ray(dd,lo+5) is not None and ray(dd,hi-5) is not None
 survey.append(dict(d=dd,left=lo,right=hi,lz=ray(dd,lo+5)[0],rz=ray(dd,hi-5)[0],count=len(hits)))
def it(d,key):
 if d<=survey[0]['d']:return survey[0][key]
 if d>=survey[-1]['d']:return survey[-1][key]
 for a,b in zip(survey,survey[1:]):
  if a['d']<=d<=b['d']:
   t=(d-a['d'])/(b['d']-a['d'])
   return a[key]*(1-t)+b[key]*t
def boundary(d,side):return it(d,'left' if side<0 else 'right')
def height(d,side):return it(d,'lz' if side<0 else 'rz')
oldhidden=[]
for c in bpy.data.collections:
 if c.name.startswith(("K4BL |","K4BK |","K4BJ |","K4BI |","K4BH |")):
  assert c!=rig and c not in rc.values() and c not in other.values()
  c.hide_render=True;oldhidden.append(c.name)
def collection(name):
 c=bpy.data.collections.new("K4BM | "+name)
 scene.collection.children.link(c);return c
roadart=collection("01 manually constructed PBR road surface DCC")
cliffs=collection("02 fractured geological coastal slopes")
west=collection("03 West library carved atrium")
east=collection("04 East passenger terminal fan structure")
city=collection("05 distant functioning dock structures")
elements=collection("06 human scale details and typography")
lights=collection("07 practical public light sources")
made=[]
def mat(name,col,rough=.55,metal=0,em=0):
 m=bpy.data.materials.new("K4BM | "+name)
 m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF')
 bs.inputs['Base Color'].default_value=(*col,1)
 bs.inputs['Roughness'].default_value=rough
 bs.inputs['Metallic'].default_value=metal
 if em:
  bs.inputs['Emission Color'].default_value=(*col,1)
  bs.inputs['Emission Strength'].default_value=em
 return m
dark=mat("deep graphite stone marine foundation",(.030,.039,.041),.88,.07)
pale=mat("warm fired ceramic structural hull",(.58,.52,.42),.53,.08)
redstone=mat("salmon sandstone colored exposed geologic seam",(.29,.18,.13),.9,.03)
steel=mat("brushed gunmetal skeleton",(.18,.23,.23),.38,.73)
brass=mat("warmer copper edge fin",(.49,.31,.15),.32,.67)
glass=mat("smoky steel blue glazed research lobby",(.018,.13,.18),.20,.46)
void=mat("deep excavated actual shadow cavity",(.005,.013,.019),.81,.01)
lit=mat("habitable amber civic rooms",(.7,.30,.105),.45,.03,1.3)
green=mat("fired verdigris waterline canopy",(.07,.18,.14),.53,.58)
sand=mat("hand-cut coastal granite paving",(.28,.28,.26),.82,.04)
pine=mat("maritime evergreen",(.06,.16,.10),.94,.02)
bark=mat("rifted wind-worn pine bark",(.15,.087,.047),.95,.01)
sea=mat("wave-streak blue grey water",(.013,.075,.094),.18,.16)
ochre=mat("ceramic saffron information panels",(.65,.39,.13),.64,.08)
emissive=mat("diffused warm carved lintel",(.96,.66,.35),.35,.03,.85)

def mesh(name,v,faces,material,coll,role,smooth=False,uv=True):
 data=bpy.data.meshes.new("K4BM / "+name+" / unique author mesh")
 data.from_pydata([tuple(x) for x in v],[],faces)
 data.update(calc_edges=True)
 obj=bpy.data.objects.new("K4BM / "+name,data)
 coll.objects.link(obj);data.materials.append(material)
 obj['K4BM_ART']="UNJUDGED_HOLD"
 obj['K4BM_DCC_ONLY']=True
 obj['K4BM_GAME_COLLIDER']=False
 obj['K4BM_PRESERVE_ORIGINAL_B48']=True
 obj['ARCHITECTURAL_INTENT']=role
 for f in data.polygons:f.use_smooth=smooth
 if uv:
  layer=data.uv_layers.new(name="K4BM_PHYSICAL_UV_EDITABLE")
  for poly in data.polygons:
   n=len(poly.loop_indices)
   for k,loop_idx in enumerate(poly.loop_indices):
    vi=data.loops[loop_idx].vertex_index
    world=obj.matrix_world@data.vertices[vi].co
    # 1 texture repeat / 3m horizontal, 2m vertical; physical point,
    # not auto-UV generated random colors.
    rel=world-C
    ux=float(rel.dot(F))/3.5
    uy=float((rel.dot(S)+rel.z*.3))/3.5
    layer.data[loop_idx].uv=(ux,uy)
 made.append(obj)
 return obj
def loft(name,rows,material,coll,role,smooth=True):
 n=len(rows[0]);assert n>=3 and len(rows)>1
 assert all(len(row)==n for row in rows)
 v=[p for row in rows for p in row]
 faces=[(i*n+j,(i+1)*n+j,(i+1)*n+(j+1)%n,i*n+(j+1)%n)
        for i in range(len(rows)-1) for j in range(n)]
 faces.extend([tuple(range(n-1,-1,-1)),tuple((len(rows)-1)*n+j for j in range(n))])
 return mesh(name,v,faces,material,coll,role,smooth)
def tube(name,pts,radius,ma,col,role,ns=8):
 pts=[Vector(v) for v in pts];assert len(pts)>1
 rows=[]
 for i,p in enumerate(pts):
  axis=(pts[min(i+1,len(pts)-1)]-pts[max(i-1,0)]).normalized()
  reference=Vector((0,0,1))
  if abs(axis.dot(reference))>.9:reference=Vector((1,0,0))
  u=axis.cross(reference).normalized();w=axis.cross(u).normalized()
  rows.append([p+radius*(cos(2*pi*k/ns)*u+sin(2*pi*k/ns)*w) for k in range(ns)])
 return loft(name,rows,ma,col,role)
def box(name,d0,d1,s0,s1,z0,z1,ma,col,role):
 return loft(name,[[P(d,s,z) for s,z in
            ((s0,z0),(s1,z0),(s1,z1),(s0,z1))]
            for d in (d0,d1)],ma,col,role,False)

# Multi-scale physically grounded UV geologic material.
def textured(name,low,high,scale,stone=False):
 m=mat(name,low,.80,.03)
 n=m.node_tree.nodes;L=m.node_tree.links;bs=n.get('Principled BSDF')
 uv=n.new('ShaderNodeUVMap');uv.uv_map="K4BM_PHYSICAL_UV_EDITABLE"
 noise=n.new('ShaderNodeTexNoise')
 noise.inputs['Scale'].default_value=scale
 noise.inputs['Detail'].default_value=5.2
 noise.inputs['Roughness'].default_value=.78
 L.new(uv.outputs['UV'],noise.inputs['Vector'])
 vor=n.new('ShaderNodeTexVoronoi')
 vor.feature='F1'
 vor.inputs['Scale'].default_value=2.4 if stone else 5.7
 L.new(uv.outputs['UV'],vor.inputs['Vector'])
 cm=n.new('ShaderNodeValToRGB')
 cm.color_ramp.elements[0].position=.23
 cm.color_ramp.elements[0].color=(*low,1)
 cm.color_ramp.elements[1].position=.82
 cm.color_ramp.elements[1].color=(*high,1)
 L.new(noise.outputs['Fac'],cm.inputs['Fac'])
 L.new(cm.outputs['Color'],bs.inputs['Base Color'])
 bump=n.new('ShaderNodeBump')
 bump.inputs['Strength'].default_value=.24 if stone else .16
 bump.inputs['Distance'].default_value=.030 if stone else .008
 L.new(vor.outputs['Distance'],bump.inputs['Height'])
 L.new(bump.outputs['Normal'],bs.inputs['Normal'])
 return m
rock=textured('UV art hewn banded seaside schist',(.043,.061,.067),(.16,.17,.16),.58,True)
ceramic=textured('UV handcut fired ivory tile micro seams',(.40,.39,.32),(.71,.67,.55),1.65)
copper=textured('UV weathered copper variable oxide',(.045,.10,.085),(.24,.36,.26),2.3)
paving=textured('UV human masonry paving and joints',(.19,.21,.19),(.49,.45,.36),1.20,True)

# Road needs MICRO and macro material realism: physically varied bitumen,
# longitudinal rolling tire patina, subtle joints, true silhouette-safe
# edge marking. DCC shader only — no floating road overlays or colliders.
rm=bpy.data.materials.new("K4BM | authentic Road5 layered painted asphalt PBR DCC")
rm.use_nodes=True
N=rm.node_tree.nodes;N.clear();L=rm.node_tree.links
o=N.new("ShaderNodeOutputMaterial");bs=N.new("ShaderNodeBsdfPrincipled")
bs.inputs["Roughness"].default_value=.68
bs.inputs["Metallic"].default_value=.025
L.new(bs.outputs["BSDF"],o.inputs["Surface"])
g=N.new("ShaderNodeNewGeometry")
def mathnode(op,x=None,y=None):
 m=N.new("ShaderNodeMath");m.operation=op
 for i,a in enumerate((x,y)):
  if a is None:continue
  if isinstance(a,(int,float)):m.inputs[i].default_value=float(a)
  else:L.new(a,m.inputs[i])
 return m.outputs[0]
def dot(vec):
 n=N.new("ShaderNodeVectorMath");n.operation="DOT_PRODUCT"
 L.new(g.outputs['Position'],n.inputs[0]);n.inputs[1].default_value=tuple(vec)
 return mathnode('SUBTRACT',n.outputs['Value'],float(vec.dot(C)))
ds=dot(F);ss=dot(S)
def around(x,target,w):
 return mathnode('LESS_THAN',mathnode('ABSOLUTE',mathnode('SUBTRACT',x,target)),w)
noise=N.new("ShaderNodeTexNoise")
noise.inputs['Scale'].default_value=.14
noise.inputs['Detail'].default_value=7.0
noise.inputs['Roughness'].default_value=.84
L.new(g.outputs["Position"],noise.inputs["Vector"])
roughnoise=N.new("ShaderNodeTexNoise")
roughnoise.inputs['Scale'].default_value=9.4
roughnoise.inputs['Detail'].default_value=3.8
L.new(g.outputs["Position"],roughnoise.inputs["Vector"])
ramp=N.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].position=.22
ramp.color_ramp.elements[0].color=(.009,.016,.020,1)
ramp.color_ramp.elements[1].position=.85
ramp.color_ramp.elements[1].color=(.080,.086,.084,1)
L.new(noise.outputs['Fac'],ramp.inputs['Fac'])
c=ramp.outputs['Color']
def mix(mask,color):
 global c
 m=N.new('ShaderNodeMixRGB');m.blend_type='MIX'
 L.new(mask,m.inputs[0]);L.new(c,m.inputs[1])
 m.inputs[2].default_value=(*color,1)
 c=m.outputs[0]
# Tire wear reads from a fast camera as muted broad longitudinal streaks
# rather than unrealistic flat grey and bright thick white guide rails.
for x in (-23,-13,13,24):
 fade=mathnode('MULTIPLY',around(ss,mathnode('ADD',x,mathnode('MULTIPLY',ds,.055)),1.55),.30)
 mix(fade,(.015,.025,.030))
for x,w,col in [(-32,.12,(.36,.40,.35)),(50,.14,(.40,.42,.37))]:
 target=x if x<0 else mathnode('ADD',x,mathnode('MULTIPLY',ds,.12))
 mix(around(ss,target,w),col)
for x in (-15,19):
 band=around(ss,mathnode('ADD',x,mathnode('MULTIPLY',ds,.055)),.18)
 dash=mathnode('LESS_THAN',mathnode('MODULO',mathnode('ADD',ds,2),15),4.7)
 mix(mathnode('MULTIPLY',band,dash),(.44,.46,.39))
# Protect rider-facing asphalt; shoulder hatching is a shader-only lane
# grammar and should not be confused with real geometry safety.
for side in (-1,1):
 margin=(-35 if side<0 else 56)
 phase=mathnode('MODULO',mathnode('ADD',ds,mathnode('MULTIPLY',ss,.27)),10)
 m=mathnode('MULTIPLY',around(ss,margin,1.8),
            mathnode('LESS_THAN',phase,3))
 mix(mathnode('MULTIPLY',m,.55),(.48,.30,.17))
# Fine cross joints and variegated granularity
joint=mathnode('LESS_THAN',mathnode('MODULO',mathnode('ADD',ds,7),31.5),.09)
mix(mathnode('MULTIPLY',joint,.31),(.03,.034,.032))
L.new(c,bs.inputs['Base Color'])
bump=N.new('ShaderNodeBump')
bump.inputs['Strength'].default_value=.27
bump.inputs['Distance'].default_value=.014
L.new(roughnoise.outputs['Fac'],bump.inputs['Height'])
L.new(bump.outputs['Normal'],bs.inputs['Normal'])
# Material roughness variance for more truthful raking sunlight
mul=mathnode('MULTIPLY',roughnoise.outputs['Fac'],.31)
add=mathnode('ADD',mul,.46)
L.new(add,bs.inputs['Roughness'])
for road in src.values():
 road.data.materials.clear();road.data.materials.append(rm)

# ---- Accurate high-detail layered coastline: real mesh panels across the
# near roadside, irregular rock geometry, no fake 100-m vertical cliff walls.
# Not built into existing source 7 road collision meshes.
for side,label in ((-1,'WEST'),(1,'EAST')):
 rng=random.Random(101 if side<0 else 221)
 for j,(start,end) in enumerate(((-26,20),(22,65),(66,119),(120,174))):
  rows=[];crest=[]
  for dd in range(start,end+1,2):
   sx=boundary(dd,side)+side*7
   gz=height(dd,side)
   jitter=1.1*sin(dd*.29+j*1.43)+.6*cos(dd*.87)
   # irregular, physically substantial 7-point section with horizontal
   # lamination, supports a low human-scaled observation promenade.
   rows.append([P(dd,sx,gz-4),
                P(dd,sx+side*7,gz-7),
                P(dd,sx+side*14,gz-8),
                P(dd,sx+side*26+jitter,gz-3.8),
                P(dd,sx+side*29+jitter,gz+.5+jitter*.22),
                P(dd,sx+side*15,gz+1.3),
                P(dd,sx,gz+.75)])
   crest.append(P(dd,sx+side*16,gz+2))
  loft(label+' geology cutaway 7-vertex UV structural shale section '+str(j),
       rows,rock,cliffs,'SOURCE_CALIBRATED_REAL_CLIFF_HORIZON',False)
  if j in (0,2):
   tube(label+' slender terrace accessible brushed rail '+str(j),
        crest,.20,steel,elements,'PEDESTRIAN_SCALE_NOT_APPROVED_COLLIDER')
  # At visible near camera: split a slab into unique slightly angled
  # paving panels rather than a long thin rectangular box.
  for k in range(start+2,end-4,7):
   xs=[P(d,boundary(d,side)+side*14,height(d,side)+1.9)
       for d in (k,k+2.4,k+5.4)]
   if len(xs)==3:
    tube(label+' precision granite hewn pavement seam '+str(j)+'_'+str(k),
         xs,.11,paving,elements,'UV_DISTINCT_CUT_STONE_SEAM')
 # Salt-tolerant windswept pine with actual branch section (not blobs).
 for i,(d,extra,scale) in enumerate(((12,28,6.3),(48,35,8.0),(88,37,9.2),(135,38,7.1))):
  sx=boundary(d,side)+side*extra
  gz=height(d,side)
  trunk=[P(d+.2*q+1.2*sin(q*.2+i),sx+side*2*sin(q*.38),gz+q)
         for q in range(0,int(scale),2)]
  tube(label+' hand-placed windswept pine bark '+str(i),
       trunk,.25,bark,cliffs,'REAL_GEOLOGICAL_LANDSCAPE')
  for branch in range(4):
   z=gz+scale*.47+branch*.65
   tip=P(d+2.9+branch*.4,sx+side*(1.5+branch*.8),z+.5)
   tube(label+' angled sculptural pine branch '+str(i)+'_'+str(branch),
        [P(d+1,sx,z-.6),tip],.14,bark,cliffs,'IRREGULAR_GROWTH')
   rows=[]
   for t in (0,.33,.66,1):
    rad=(1-t)*1.8+0.1
    center=tip+F*(t*1.8)+Vector((0,0,t*.7))
    rows.append([center+rad*(S*cos(a*2*pi/9)+Vector((0,0,1))*sin(a*2*pi/9)*.6)
                 for a in range(9)])
   loft(label+' evergreen tapered branch crown '+str(i)+'_'+str(branch),
        rows,pine,cliffs,'REAL_SECTIONED_FOLIAGE')

# WEST — *one* correctly-scaled articulated archive complex; no giant
# homogeneous wave panel. Architectural tectonics: tapered cut-stone stacks,
# inset public courtyard and hand-authored exterior UV tile cladding.
def west_edge(d):return boundary(d,-1)-13
def west_z(d):return height(d,-1)
westSections=[(29,18,20),(45,27,27),(68,36,32),(88,37,37),
              (110,33,40),(132,30,35),(155,26,29),(178,21,25)]
body=[];roof=[]
for dd,depth,heightp in westSections:
 sx=west_edge(dd);zz=west_z(dd)
 body.append([P(dd,sx,zz-5),P(dd,sx-3,zz+1),
              P(dd,sx-3,zz+heightp-4),
              P(dd,sx-depth,zz+heightp-2),
              P(dd,sx-depth-4,zz-11)])
 # High craftsmanship sculptural thin stepped roof with 1.4m thick return.
 roof.append([P(dd,sx+5,zz+heightp+1),
              P(dd,sx-depth-5,zz+heightp+7),
              P(dd,sx-depth-9,zz+heightp+8.4),
              P(dd,sx+4,zz+heightp+2.5)])
loft('WEST ARCHIVE geologically carved terraced civic wall',
     body,ceramic,west,'PUBLIC_READING_AND_ARCHIVE_CAMPUS')
loft('WEST ARCHIVE tapered UV-jointed cantilever roof shell',
     roof,pale,west,'SINGULAR_ARCHITECTURAL_AUTHORSHIP')
# Large carved openings; no wall-of-identical-windows facade.
for j,(a,b,z0,z1) in enumerate(((33,58,5,21),(70,108,4,29),(119,161,8,24))):
 dd=(a+b)*.5;s=west_edge(dd);z=west_z(dd)
 # Substantial 4m setback: the native 3D model contains actual shadows
 box('WEST ARCHIVE physically dark public atrium '+str(j),
     a,b,s-1,s-4.8,z+z0,z+z1,void,west,'SHADOWED_PUBLIC_ENTRANCE_VOID')
 box('WEST ARCHIVE real UV transom glulam glazing '+str(j),
     a+1,b-1,s-4.8,s-6.1,z+z0+1,z+z1-1,glass,west,'GALLERY_TRANSPARENT_STRUCTURE')
 box('WEST ARCHIVE human occupied reference library '+str(j),
     a+3,b-3,s-8,s-8.7,z+z0+3,z+z1-3,lit,west,'FULL_INTERIOR_PROGRAM')
 for frac in (.16,.38,.71,.86):
  x=a+(b-a)*frac
  tube('WEST ARCHIVE individually crafted recessed bronze mullion '+str(j)+'_'+str(frac),
       [P(x,west_edge(x)+.1,west_z(x)+z0-2),P(x,west_edge(x)-.8,west_z(x)+z1+5)],
       .25,brass,west,'AUTHORED_HUMAN_FACADE')
 tube('WEST ARCHIVE deep stone projecting sunlight shade '+str(j),
      [P(x,west_edge(x)+3,west_z(x)+z1+3) for x in range(a,b,3)],
      .82,pale,west,'PHYSICAL_SHADOW_CASTING_DETAIL')
 for k in range(3):
  x=a+(b-a)*(k+.5)/3
  tube('WEST ARCHIVE inhabited gallery integrated lighting '+str(j)+'_'+str(k),
       [P(x-2,west_edge(x)-3.2,west_z(x)+z1-4),P(x+2,west_edge(x)-3.2,west_z(x)+z1-4)],
       .22,emissive,west,'FUNCTIONAL_PUBLIC_LIGHTING')
# distinct contrast in near-camera road-side human-scale stair / mesh
for k in range(11):
 dd=31+1.8*k
 sx=west_edge(dd)
 zz=west_z(dd)
 box('WEST ARCHIVE cut stone public staircase '+str(k),
     dd,dd+1.6,sx-11,sx-6.0,zz+2.0+.4*k,zz+2.6+.4*k,paving,west,'ACCESSIBLE_PUBLIC_LEVEL_CHANGE')

# EAST — elegant warm steel maritime canopy, but do NOT copy the west.
# A precise 3D deep-finned screened terminal/café with roof sheltered space.
def east_edge(d):return boundary(d,1)+14
def east_z(d):return height(d,1)
stations=[(31,19,18),(55,31,24),(82,41,31),
          (108,38,34),(136,34,31),(162,28,27),(176,23,21)]
roof=[];face=[]
for dd,depth,h in stations:
 sx=east_edge(dd);z=east_z(dd)
 roof.append([P(dd,sx-3,z+h),P(dd,sx+depth,z+h+5),
              P(dd,sx+depth+3,z+h+6.6),P(dd,sx-5,z+h+1.5)])
 face.append([P(dd,sx,z-4),P(dd,sx+2,z-4),
              P(dd,sx+2,z+h-6),P(dd,sx,z+h-6)])
loft('EAST PASSENGER TERMINAL tapering oxidized copper shell',
     roof,copper,east,'GENUINE_MARITIME_PASSENGER_HALL')
loft('EAST PASSENGER TERMINAL panoramic deeply shaded window wall',
     face,glass,east,'INDOOR_FUNCTIONAL_CAFE_AND_FERRY_HALL')
for j,(a,b,z0,z1) in enumerate(((38,63,3,16),(70,106,4,24),(117,154,5,25))):
 dd=(a+b)/2;s=east_edge(dd);z=east_z(dd)
 box('EAST TERMINAL sunk shadow recessed ticket lobby '+str(j),
     a+1,b-1,s-1,s+1,z+z0,z+z1,void,east,'ACTUAL_PUBLIC_TRANSIT_HALL')
 box('EAST TERMINAL deep viewing glass '+str(j),
     a+2,b-2,s+1.7,s+3,z+z0+1,z+z1-1,glass,east,'CURTAIN_WALL_DEPTH')
 box('EAST TERMINAL illuminated room, seats and ticketing '+str(j),
     a+4,b-4,s+6,s+7,z+z0+3,z+z1-3,lit,east,'INHABITED_SEATS')
# AUTHOR DCC serious set of fin profiles, intentionally varied spacing and
# elevation rather than copy-paste windows. They cast visible near-source
# shadows on the public glass skin.
for k in range(25):
 dd=35+k*5.5
 if dd>175:break
 sx=east_edge(dd);z=east_z(dd)
 t=k/25
 h=21+9*sin(t*pi)
 tube('EAST terminal hand-formed titanium deep sun-screen '+str(k),
      [P(dd-1,sx-3,z+1),
       P(dd-.4,sx-3.5,z+h*.4),
       P(dd+1.2,sx-5.0,z+h+3),
       P(dd+5,sx+1.0,z+h+5)],
      .55,steel,east,'REAL_SCULPTED_FACADE_SUNSHADE')
# human scale deck / handrail follows source geometry, not arbitrary long slab
tube('EAST harbor walking promenade human-scale edge',
     [P(d,east_edge(d)-4,east_z(d)+2.1) for d in range(35,175,4)],
     .18,brass,elements,'PUBLIC_WALKABLE_LOBBY_NOT_GAME_COLLIDER')

# Hero harbor skyline — 3 varying DISTINCT public functions; no row of
# giant identical cylinders, they share a faceted structural set of authored
# profiles with terrace cuts and translucent public activities.
buildings=[
 ('tide observatory',202,-72,32,75,9),
 ('civic interchange tower',227,42,35,111,8),
 ('seafarers archive',257,-144,45,92,7),
 ('marine operations',301,114,39,89,10)]
for name,d0,s0,r,h,n in buildings:
 floor=height(170,1)-8
 rows=[]
 for idx in range(13):
  t=idx/12
  rx=r*(1-.24*t)*(1+.09*sin(t*pi*4))
  ry=r*(.60-.07*t)
  dd=d0+6*t*t
  rows.append([P(dd+rx*cos(2*pi*j/n+.12*t),
                 s0+ry*sin(2*pi*j/n+.12*t),floor+h*t)
               for j in range(n)])
 loft('HARBOR '+name+' purpose-designed inhabited stepped massing',
      rows,ceramic if name=='tide observatory' else dark,city,
      'SOLID_CIVIC_CITY_LANDMARK')
 for frac in (.23,.48,.70):
  z=floor+h*frac
  rad=r*(1-.24*frac)
  rings=[]
  for level in (-1.5,2.2):
   rings.append([P(d0+6*frac*frac+rad*cos(2*pi*j/n),
                   s0+rad*.6*sin(2*pi*j/n),z+level)
                 for j in range(n)])
  loft('HARBOR '+name+' occupied panoramically lit hall '+str(frac),
       rings,glass,city,'HABITABLE_VIEWING_LEVEL')
  for side in (-1,1):
   dd=d0+6*frac*frac
   tube('HARBOR '+name+' one load bearing rib '+str(frac)+'/'+str(side),
        [P(dd+rad*side,s0,floor+h*frac-2),
         P(dd+rad*.86*side,s0+6,floor+h*(frac+.12))],
        .60,steel,city,'VISIBLE_LOAD_BRACED_CITY')
 # strongly defined single rooftop weather protective turbine canopy
 tube('HARBOR '+name+' real crown roof ballast edge',
      [P(d0+6+r*.7*cos(2*pi*j/20),
         s0+r*.5*sin(2*pi*j/20),floor+h+2)
       for j in range(21)],
      .60,brass,city,'SCULPTED_CIVIC_CROWN')
# Aerial harbor portal: deliberately functional loading architecture,
# farther beyond the Road5 end. This is BACKGROUND not new driveable route.
for dd,ss,h in ((210,132,52),(252,194,67)):
  z=height(170,1)-22
  tube('HARBOR articulated working quay gantry leg '+str(dd),
       [P(dd-8,ss-20,z),P(dd-8,ss-17,z+h*.60),P(dd-6,ss-18,z+h)],
       1.6,steel,city,'WORKING_QUAY_CRANE')
  tube('HARBOR asymmetrical quay crane overhead '+str(dd),
       [P(dd-6,ss-60,z+h),P(dd-5,ss+41,z+h+4)],
       1.3,brass,city,'READABLE_PORT_LOGISTICS')
  tube('HARBOR rigging cable '+str(dd),
       [P(dd-5,ss+8,z+h),P(dd-4,ss+8,z+h*.33)],
       .16,dark,city,'REAL_HARBOR_RIGGING')
# True modeled water surface DCC only; sea outside Road5 and beyond its
# source end, never mislabeled as collidable road.
mesh('HARBOR physical sea with UV wave micro material',
    [P(190,-900,-42),P(1250,-900,-42),
     P(1250,1200,-42),P(190,1200,-42)],
    [(0,1,2,3)],sea,city,'HARBOR_SEA_NOT_DRIVEABLE')
# Dry-cut distant coastline with spatially graduated silhouette
for side,name in ((-1,'WEST'),(1,'EAST')):
 rows=[]
 for dd in (182,218,270,350,460,610):
  ss=side*(90+28*sin(dd*.009))
  ss2=side*(200+35*cos(dd*.006))
  basez=height(170,side)-18
  crestz=basez+14+16*sin(dd*.014+side)
  rows.append([P(dd,ss,basez-50),
               P(dd,ss2,basez-60),
               P(dd,ss2,crestz-7),
               P(dd,ss,crestz)])
 loft(name+' truly modeled maritime erosion distant escarpment',
      rows,rock,city,'SEA_EDGE_ENVIRONMENTAL_TERRAIN')
# Name signage belongs to architecture, not a huge billboard in camera.
def signage(text,name,dd,side,zoffset,size):
 data=bpy.data.curves.new('K4BM / '+name+' independently editable signage','FONT')
 data.body=text
 data.size=size;data.extrude=.02;data.bevel_depth=.008
 obj=bpy.data.objects.new('K4BM / '+name,data)
 elements.objects.link(obj)
 obj.location=P(dd,boundary(dd,side)+side*17,height(dd,side)+zoffset)
 obj.rotation_euler=cams['control'].rotation_euler
 obj.data.materials.append(ochre if side<0 else pale)
 obj["K4BM_DCC_ONLY"]=True
 obj["ART_JUDGEMENT"]="UNJUDGED_HOLD"
 made.append(obj)
signage('STRATA / ARCHIVE','WEST carved functional signage',68,-1,29,3.5)
signage('TIDE / TRANSIT','EAST maritime orientation',83,1,26,3.4)

# Atmospheric art balance: leave original immutable camera, single raking
# broad sun, physically plausible exposed public interior lighting.
world=scene.world;world.use_nodes=True
for n in world.node_tree.nodes:
 if n.type=='TEX_SKY':
  n.sky_type='NISHITA'
  n.sun_elevation=math.radians(8.7)
  n.sun_rotation=math.radians(240)
 if n.type=='BACKGROUND':n.inputs['Strength'].default_value=.36
for o in bpy.data.objects:
 if o.type=='LIGHT':o.hide_render=True
sun=bpy.data.lights.new('K4BM softened strong directional sea light','SUN')
sun.energy=2.7;sun.angle=math.radians(7.2)
so=bpy.data.objects.new('K4BM / visible sun gobo raking illumination',sun)
lights.objects.link(so)
so.rotation_euler=tuple(math.radians(q) for q in (31,-31,150))
for name,dd,side,zh in [('library',78,-1,21),('archive',140,-1,20),
                        ('ferry',84,1,21),('concourse',131,1,20)]:
 l=bpy.data.lights.new('K4BM / '+name+' actual task area light','AREA')
 l.energy=7600;l.color=(1,.78,.54);l.shape='RECTANGLE'
 l.size=15;l.size_y=7
 ob=bpy.data.objects.new('K4BM / '+name+' lighting fixture',l)
 lights.objects.link(ob)
 ob.location=P(dd,boundary(dd,side)+side*22,height(dd,side)+zh)

scene.render.engine="BLENDER_EEVEE"
if hasattr(scene,'eevee'):
 for key,v in (('taa_render_samples',128),('use_gtao',True),('gtao_distance',4.0),
               ('gtao_factor',1.18),('use_soft_shadows',True)):
  if hasattr(scene.eevee,key):setattr(scene.eevee,key,v)
scene.render.resolution_x=1440
scene.render.resolution_y=900
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
try:scene.view_settings.view_transform='Filmic'
except Exception:pass
try:scene.view_settings.look='Medium High Contrast'
except Exception:pass
scene.view_settings.exposure=-.24
assert fp0=={m:fp(obj) for m,obj in src.items()}
assert cam0=={m:(tuple(obj.location),tuple(obj.rotation_euler),float(obj.data.lens)) for m,obj in cams.items()}
def show(mode):
 for m,c in rc.items():c.hide_render=m!=mode
 for obj in src.values():obj.hide_render=False
 for m,c in other.items():c.hide_render=m!=mode
 for c in bpy.data.collections:
  if 'K4AY SOURCE B51 OBB PROXIES' in c.name:c.hide_render=True
 bpy.context.view_layer.update()
shots=[]
for mode,tick in [('control',11307),('ultra',11341)]:
 show(mode);scene.camera=cams[mode]
 name='K4BM_'+mode.upper()+'_'+str(tick)+'_ACTUAL_SOURCE_CAMERA_UVPBR_ART_HOLD.png'
 scene.render.filepath=os.path.join(outdir,name)
 bpy.ops.render.render(write_still=True)
 shots.append({'mode':mode,'tick':tick,'file':name})
show('control');scene.camera=cams['control']
blend='K4BM_UV_PBR_AUTHOR_SCULPTED_EDITABLE_DCC_ART_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(outdir,blend))
files={}
for name in [blend]+[s['file'] for s in shots]:
 path=os.path.join(outdir,name);size=os.stat(path).st_size
 assert size>10000
 files[name]={'bytes':size,'sha256':sha(path)}
audit={
 'schema':'dopagaki.K4BM.true-source-UV-PBR-authored-civic-hero/1',
 'parentK4BLNativeBlenderSHA256':PARENT_SHA,
 'frozenSourceGameBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'originalRoad5VertexAndFaceFingerprintPreserved':fp0=={m:fp(obj) for m,obj in src.items()},
 'sourceCameraNumericPosesAndLensUnchanged':cam0=={m:(tuple(obj.location),tuple(obj.rotation_euler),float(obj.data.lens)) for m,obj in cams.items()},
 'realRoad5SectionsMeasured':survey,
 'originalB48Roads':7,'originalB51Movers':28,'originalPhysicsHz':240,'originalBallRadiusM':.65,
 'retainedPriorUnapprovedArtHiddenNotDeleted':oldhidden,
 'independentEditableResearchObjects':len(made),
 'nativeUVEditedResearchMeshes':sum(bool(o.type=='MESH' and o.data.uv_layers) for o in made),
 'originalFixedSourceCameraDCCImages':shots,
 'nativeRenderEngine':'BLENDER_EEVEE',
 'newPlayableGameCollisionMeshes':0,'gameSourceModified':False,'isGameWebGLFrame':False,
 'ART':'UNJUDGED_HOLD','formalArtAccepted':0,'formalSlope2DNAacceptedMetres':0,
 'B51_CLEARANCE':'HOLD','SAT':'HOLD','CCD':'HOLD','HUMAN':'HOLD','FPS':'HOLD',
 'RELEASE':'HOLD','MERGE':'HOLD','files':files
}
with open(os.path.join(outdir,'K4BM_ORIGINAL_CAMERA_UVPBR_PROVENANCE.json'),'w') as f:
 json.dump(audit,f,ensure_ascii=False,indent=2)
print("K4BM_REAL_ROAD_SOURCE_EDITABLE_UV_PBR_TECH_ART_UNJUDGED",json.dumps({
 'uv_meshes':audit['nativeUVEditedResearchMeshes'],'source_road_unchanged':audit['originalRoad5VertexAndFaceFingerprintPreserved'],
 'road_scales':survey}))

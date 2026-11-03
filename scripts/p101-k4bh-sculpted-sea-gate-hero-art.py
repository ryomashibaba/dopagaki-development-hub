"""K4BH / DOPAGAKI SLOPE — ONE authored cinematic roadside civic art pilot.

DCC study, NOT native WebGL. Original source meshes, 240Hz physics, camera,
moving hazards, collision/safety and seven actual roads stay byte-for-byte
unchanged in the repository. No ART acceptance is inferred from generation.
"""
import bpy, math, os, sys, hashlib, json, struct
from mathutils import Vector
from math import sin, cos, pi
args=sys.argv[sys.argv.index('--')+1:]
def arg(s): return os.path.abspath(args[args.index(s)+1])
base,out=arg('--base'),arg('--out')
os.makedirs(out,exist_ok=True)
with open(base,'rb') as f:
    parent_sha=hashlib.sha256(f.read()).hexdigest()
assert parent_sha=='b665c84a88d719c4615638cfeb95ab5fe92a84a3a07d3ebe096dd540dd749b2f'
bpy.ops.wm.open_mainfile(filepath=base)
scene=bpy.context.scene
rig=bpy.data.collections['05_CAMERA | Authentic original source poses']
CAM={}
for mode,t in (('control',11307),('ultra',11341)):
    matching=[x for x in rig.objects if x.type=='CAMERA' and str(t) in x.name]
    assert len(matching)==1
    CAM[mode]=matching[0]
ROAD={}
OTHERS={}
for m in ('control','ultra'):
    collection=bpy.data.collections['K4AY SOURCE B48 | '+m.upper()+' | TRUE TESSELLATED ROAD5']
    assert len(collection.objects)==1
    ROAD[m]=next(iter(collection.objects))
    OTHERS[m]=bpy.data.collections['K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | '+m.upper()]
def fingerprint(o):
    h=hashlib.sha256()
    for p in o.data.vertices:
        h.update(struct.pack('<3d',*[float(v) for v in p.co]))
    for f in o.data.polygons:
        h.update(struct.pack('<3i',*[int(i) for i in f.vertices]))
    return h.hexdigest()
original_fp={m:fingerprint(o) for m,o in ROAD.items()}
assert set(original_fp.values())=={'f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2'}
camera_snapshot={m:(tuple(o.location),tuple(o.rotation_euler),o.data.lens) for m,o in CAM.items()}
# Eliminate the *rejected DCC presentation layers* from this A/B. Do not
# delete, merge, alter, or hide the authentic source road/camera collections.
hidden={}
for c in bpy.data.collections:
    old = c.name.startswith(('K4BG ','K4BE ','K4BD ','K4BC V3 ','K4BC V2 ART ','K4AX ','K4AT ','K4AU ','K4AV '))
    if old:
        c.hide_render=True
        hidden[c.name]=len(c.objects)
# The new artwork is a single deliberately authored longitudinal civic
# composition, not a random block city generator.
def makecol(name):
    c=bpy.data.collections.new('K4BH | '+name)
    scene.collection.children.link(c)
    return c
arch=makecol('01 CROSS-RIVER MONUMENTAL GATE')
front=makecol('02 LANDSCAPED INHABITED STREET WALLS')
rooms=makecol('03 INNER LIBRARY AND CONSERVATORY')
far=makecol('04 FAR URBAN DEPTH AND LANDMARKS')
shore=makecol('05 TERRACES AND SEA CLIFF')
ill=makecol('06 PRACTICAL LUMINAIRES')
created=[]
# Camera-derived global site alignment. Geometry is one fixed world-space
# ensemble for BOTH genuine unchanged source camera poses, not billboards.
C=CAM['control'].location.copy()
H=(CAM['control'].matrix_world.to_quaternion() @ Vector((0,0,-1)))
H=Vector((H.x,H.y,0)).normalized()
R=Vector((-H.y,H.x,0))
def P(d,s,z):
    return C+H*d+R*s+Vector((0,0,z))
def material(name,rgb,rough=.64,metal=0,emission=0):
    m=bpy.data.materials.new('K4BH / '+name)
    m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*rgb,1)
    p.inputs['Roughness'].default_value=rough
    p.inputs['Metallic'].default_value=metal
    if emission and 'Emission Color' in p.inputs:
        p.inputs['Emission Color'].default_value=(*rgb,1)
        p.inputs['Emission Strength'].default_value=emission
    return m
obsidian=material('blue-charcoal formed basalt',(.025,.045,.055),.63,.12)
ceramic=material('pearl weatherproof high-firing ceramic',(.46,.48,.43),.52)
copper=material('patinated bronze exposed edges',(.21,.25,.20),.36,.69)
stone=material('cut limestone structural interior',(.38,.35,.30),.79)
glass=material('inset cobalt-sapphire laminated glass',(.028,.115,.145),.20,.30)
light=material('warm inhabited luminous interiors',(.95,.44,.13),.34,.08,3.7)
vein=material('subtle sea-cyan guiding seam',(.035,.36,.40),.35,.25,.62)
soil=material('dark moss and planted terrace',(.085,.16,.105),.9)
mount=material('distant stratified shore slate',(.085,.135,.16),.92)
def geo(name,verts,faces,mat,col,role):
    assert verts and faces
    m=bpy.data.meshes.new('K4BH '+name+' editable mesh')
    m.from_pydata([tuple(v) for v in verts],[],faces)
    m.update(calc_edges=True)
    o=bpy.data.objects.new('K4BH / '+name,m)
    col.objects.link(o)
    m.materials.append(mat)
    o['DCC_ONLY_NOT_COLLISION']=True
    o['ART_STATUS']='UNASSESSED_RESEARCH'
    o['ARCHITECTURAL_ROLE']=role
    created.append(o)
    return o
def bridge_section(name,sections,mat,col,role):
    n=len(sections[0]); assert n>2 and all(len(s)==n for s in sections)
    v=[tuple(p) for row in sections for p in row]
    faces=[]
    for i in range(len(sections)-1):
        for j in range(n):
            faces.append((i*n+j,(i+1)*n+j,(i+1)*n+(j+1)%n,i*n+(j+1)%n))
    faces.append(tuple(range(n-1,-1,-1)))
    faces.append(tuple((len(sections)-1)*n+j for j in range(n)))
    return geo(name,v,faces,mat,col,role)
def solid(name,d0,d1,s0,s1,z0,z1,mat,col,role='NONCOLLIDING_CIVIC'):
    return bridge_section(name,[[P(d,s,z) for s,z in
        ((s0,z0),(s1,z0),(s1,z1),(s0,z1))] for d in (d0,d1)],mat,col,role)
def ribbon(name,points,width,thick,mat,col,role):
    v=[]
    for d,s,z in points:
        v.extend([P(d,s-width/2,z),P(d,s+width/2,z),P(d,s+width/2,z+thick),P(d,s-width/2,z+thick)])
    return bridge_section(name,[v[i:i+4] for i in range(0,len(v),4)],mat,col,role)
# 1. Intentional, expensive-looking source B48 art surface rather than a
# generic flat gray slab. Pure shader substitution on duplicate DCC mesh:
# the sampled original road tessellation NEVER changes.
roadmat=bpy.data.materials.new('K4BH / layered directional volcanic composite')
roadmat.use_nodes=True
nodes=roadmat.node_tree.nodes;links=roadmat.node_tree.links
p=nodes.get('Principled BSDF')
p.inputs['Metallic'].default_value=.24
p.inputs['Roughness'].default_value=.38
g=nodes.new('ShaderNodeNewGeometry')
broad=nodes.new('ShaderNodeTexNoise'); broad.inputs['Scale'].default_value=.029
broad.inputs['Detail'].default_value=4.5; broad.inputs['Roughness'].default_value=.69
links.new(g.outputs['Position'],broad.inputs['Vector'])
ramp=nodes.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].position=.19
ramp.color_ramp.elements[0].color=(.012,.023,.031,1)
ramp.color_ramp.elements[1].position=.81
ramp.color_ramp.elements[1].color=(.100,.137,.150,1)
links.new(broad.outputs['Fac'],ramp.inputs['Fac'])
links.new(ramp.outputs['Color'],p.inputs['Base Color'])
micro=nodes.new('ShaderNodeTexNoise'); micro.inputs['Scale'].default_value=8.2
micro.inputs['Detail'].default_value=3.0
links.new(g.outputs['Position'],micro.inputs['Vector'])
bump=nodes.new('ShaderNodeBump')
bump.inputs['Strength'].default_value=.19
bump.inputs['Distance'].default_value=.015
links.new(micro.outputs['Fac'],bump.inputs['Height'])
links.new(bump.outputs['Normal'],p.inputs['Normal'])
for obj in ROAD.values():
    obj.data.materials.clear()
    obj.data.materials.append(roadmat)
# 2. Long connected road-side cliffs and public-use architecture:
# no toy building grid. Monumental folded acoustic fins, huge apertures,
# setbacks and actually visible occupied warm recesses.
for sign,label in ((-1,'WEST / public reading library'),(1,'EAST / tidal science conservatory')):
    stations=[40,68,110,155,207,266,333,402,480]
    # Organic sectional façade with continuous ground and large single roof
    # instead of disconnected repeated boxes.
    section=[]
    for d in stations:
        swell=sin(.011*d+(0 if sign<0 else .7))
        ss=sign*(172+8*swell)
        outer=sign*(290+13*cos(.013*d))
        roofheight=79+17*swell+(16 if sign<0 else -2)
        section.append([P(d,ss,-125),P(d,outer,-125),
                        P(d,outer,roofheight-19),
                        P(d,sign*(251+14*swell),roofheight+19),
                        P(d,ss,roofheight)])
    bridge_section(label+' contiguous carved basalt foundation',section,obsidian,shore,'LOAD_BEARING_CLIFF')
    # Natural broad ceramic ribbon, fully thick and formed to its volume.
    roofsections=[]
    for d in stations:
        lift=12*sin(d*.012)+5*sin(.027*d+(1 if sign<0 else 0))
        roofsections.append([
            P(d,sign*155,84+lift),P(d,sign*280,96+lift),
            P(d,sign*289,110+lift),P(d,sign*238,123+lift),
            P(d,sign*148,106+lift)])
    bridge_section(label+' upper weatherproof tectonic roof',roofsections,ceramic,front,'THICK_CIVIC_ROOF')
    # Hand-designed civic room groups with true shaded depth, not a window texture.
    for i,(a,b,z) in enumerate(((77,132,16),(192,264,24),(330,428,28))):
        solid(label+' bronze framed colonnade '+str(i),a,b,sign*170,sign*178,z,z+48,copper,rooms)
        solid(label+' recessed sapphire glass '+str(i),a+7,b-7,sign*179,sign*187,z+4,z+44,glass,rooms)
        solid(label+' occupied amber room behind glass '+str(i),a+12,b-13,sign*189,sign*193,z+9,z+38,light,rooms)
        solid(label+' walkable public civic floor study '+str(i),a,b,sign*193,sign*269,z-9,z-5,stone,rooms)
        solid(label+' raised planted terrace garden '+str(i),a+8,b-11,sign*245,sign*278,z-4,z-1,soil,rooms)
    # Nonrepetitive sculptural bronze sweeping cornice.
    ribbon(label+' single flowing weather-beaten bronze reveal',
           [(d,sign*(157+9*sin(d*.015)),107+10*sin(d*.011)) for d in stations],
           3.6,1.5,copper,front,'INTEGRATED_FACADE_DETAIL')
# 3. Dominant open monumental civic threshold, set far enough ahead for
# visible third-dimensionality. This is genuine *physical arc mesh*, not
# text or a camera-space overlay. Side supports are OFFROAD proposals only.
def archloop(name,d,span,height,thickness,mat):
    # Twin folded elliptical arch faces with deep cut-through clear opening.
    n=38
    outline=[]
    for j in range(n+1):
        t=j*pi/n
        s=span*cos(t)
        z=-84+height*sin(t)
        outline.append((s,z))
    v=[]
    for d_off in (0,thickness):
        for s,z in outline:
            v.append(P(d+d_off,s,z))
            v.append(P(d+d_off,s+(-18 if s<0 else 18),z+18))
    faces=[]
    q=2*(n+1)
    for j in range(n):
        for i in (0,1):
            a=2*j+i;b=a+2
            faces.append((a,b,q+b,q+a))
        a=2*j;faces.append((a,a+1,q+a+1,q+a))
    for j in (0,n):
        a=2*j;faces.append((a,q+a,q+a+1,a+1))
    return geo(name,v,faces,mat,arch,'FREE_CLEAR_SPAN_UNVERIFIED')
archloop('SEA-GATE immense folded ceramic monument',550,174,235,31,ceramic)
archloop('SEA-GATE inner bronze load-spine',564,159,215,7,copper)
# Offset structural spires; their bases join the cliff rather than
# floating in front of the playable road.
for sign,label in ((-1,'west coast'),(1,'east delta')):
    for i,(d,s,zmax) in enumerate(((516,183,211),(583,247,302))):
        verts=[]; faces=[]
        for level in range(15):
            t=level/14;z=-190+(zmax+190)*t
            radius=(39 if i==0 else 27)*(1-t)**.75+3
            for j in range(7):
                a=2*pi*j/7+.32*t*(1 if sign<0 else -1)
                rr=radius*(.9+.12*cos(3*a))
                verts.append(P(d+sin(t*pi)*16,sign*s+rr*cos(a),z+rr*sin(a)*.12))
        for k in range(14):
            for j in range(7):
                faces.append((7*k+j,7*k+(j+1)%7,7*(k+1)+(j+1)%7,7*(k+1)+j))
        faces.extend([tuple(range(6,-1,-1)),tuple(14*7+i for i in range(7))])
        geo(label+' singular tide-polished helical civic tower '+str(i),verts,faces,
            copper if i else obsidian,far,'BACKDROP_ARCHITECTURE_NOT_COLLIDER')
        for z in (12,38,69):
            solid(label+' amber occupied harbor-facing room at '+str(z),
                  d-22,d+20,sign*(s+33),sign*(s+35),z,z+5,light,rooms)
# 4. One deliberate far skyline with varied silhouettes and connected
# stepped coastal podium, NOT a density metric or a box forest.
# All objects have modeled solids and a shared city datum behind the road.
for i,(ds,ss,h,shape) in enumerate(((935,-480,205,3),(1040,-225,340,5),
            (1180,165,440,7),(920,505,250,4),(1420,-80,300,5))):
    faces=[];verts=[];n=shape+4
    for layer in range(9):
        t=layer/8; height=-205+h*t
        radius=(35+20*(i%3))*(1-.78*t)
        for k in range(n):
            a=k*2*pi/n+.26*t+0.08*i
            rr=radius*(1+.13*cos(k*2+2*t))
            verts.append(P(ds,ss,0)+Vector((H.x*cos(a)-H.y*sin(a),
                       H.y*cos(a)+H.x*sin(a),0))*rr+Vector((0,0,height)))
    for j in range(8):
        for k in range(n):
            faces.append((n*j+k,n*j+(k+1)%n,n*(j+1)+(k+1)%n,n*(j+1)+k))
    faces.extend([tuple(range(n-1,-1,-1)),tuple(8*n+k for k in range(n))])
    geo('far skyline '+str(i)+' varied carved beacon silhouette',verts,faces,
        obsidian if i%2 else copper,far,'DISTANT_CIVIC_SKYLINE')
# 5. Coastal terrain to close the artificial empty horizon behind the
# source road. Offroad relief is NOT a substitute physical driveable road.
for sign in (-1,1):
    pts=[]
    for d in (410,600,820,1040,1300,1630):
        h=-175+18*sin(d*.004+sign)
        pts.append([P(d,sign*330,h-75),P(d,sign*750,h-75),
            P(d,sign*740,h+27+33*sin(d*.011)),P(d,sign*320,h+8)])
    bridge_section(('WEST' if sign<0 else 'EAST')+' distant authentic coastline rock mass',pts,mount,shore,'DISTANT_NONPLAYABLE_LANDSCAPE')
# 6. True world daylight. No fake horizon 2D card, no crowding hazard center.
world=scene.world
world.use_nodes=True
world.node_tree.nodes.clear()
outn=world.node_tree.nodes.new('ShaderNodeOutputWorld')
bg=world.node_tree.nodes.new('ShaderNodeBackground')
sky=world.node_tree.nodes.new('ShaderNodeTexSky')
sky.sky_type='NISHITA'
sky.sun_elevation=math.radians(12)
sky.sun_rotation=math.radians(125)
bg.inputs['Strength'].default_value=.34
world.node_tree.links.new(sky.outputs['Color'],bg.inputs['Color'])
world.node_tree.links.new(bg.outputs['Background'],outn.inputs['Surface'])
# Keep original light objects in editable .blend; render only new design lights.
for o in bpy.data.objects:
    if o.type=='LIGHT':o.hide_render=True
def sunlamp(name,rotation,energy,size):
    da=bpy.data.lights.new(name,'SUN'); da.energy=energy;da.angle=math.radians(size)
    ob=bpy.data.objects.new('K4BH '+name,da);ill.objects.link(ob)
    ob.rotation_euler=tuple(math.radians(x) for x in rotation);return ob
sunlamp('low sunlight wide soft shadow',(35,-28,145),2.9,9)
for sign in (-1,1):
    for d in (115,225,374):
        ld=bpy.data.lights.new('warm occupied street-level skylight '+str(sign)+'/'+str(d),'AREA')
        ld.energy=19000
        ld.color=(1,.66,.36)
        ld.shape='RECTANGLE';ld.size=23;ld.size_y=8
        ob=bpy.data.objects.new('K4BH gallery interior fixture',ld)
        ill.objects.link(ob);ob.location=P(d,sign*181,49)
        ob.rotation_euler=(0,0,0)
scene.render.engine='CYCLES'
scene.cycles.samples=64
scene.cycles.use_denoising=False
scene.render.resolution_x=1080
scene.render.resolution_y=720
scene.render.resolution_percentage=85
scene.render.image_settings.file_format='PNG'
try:scene.view_settings.view_transform='Filmic'
except Exception:pass
scene.view_settings.exposure=-.20
# Exact original source camera numerics and B48 tessellation are immutable.
assert original_fp=={m:fingerprint(o) for m,o in ROAD.items()}
assert camera_snapshot=={m:(tuple(o.location),tuple(o.rotation_euler),o.data.lens) for m,o in CAM.items()}
def show(mode):
    for m,obj in ROAD.items():
        col=bpy.data.collections['K4AY SOURCE B48 | '+m.upper()+' | TRUE TESSELLATED ROAD5']
        col.hide_render=(m!=mode)
        obj.hide_render=False
    for m,col in OTHERS.items():col.hide_render=(m!=mode)
    for col in bpy.data.collections:
        if 'K4AY SOURCE B51 OBB PROXIES' in col.name:col.hide_render=True
    bpy.context.view_layer.update()
shots=[]
for mode,tick in (('control',11307),('ultra',11341)):
    show(mode)
    scene.camera=CAM[mode]
    name='K4BH_'+mode.upper()+'_'+str(tick)+'_ORIGINAL_CAMERA_DCC_ART_HOLD.png'
    scene.render.filepath=os.path.join(out,name)
    bpy.ops.render.render(write_still=True)
    shots.append({'mode':mode,'tick':tick,'file':name})
show('control')
scene.camera=CAM['control']
bln='K4BH_SCULPTED_SEA_GATE_EDITABLE_HERO_ART_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,bln))
hashes={}
for file in [bln]+[x['file'] for x in shots]:
    b=open(os.path.join(out,file),'rb').read()
    assert len(b)>10000
    hashes[file]={'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
report={
  'schema':'dopagaki.K4BH.authentic-two-source-camera-hero-art-pilot/1',
  'parentK4BGSourceDCCBlendSha256':parent_sha,
  'frozenOriginalGameBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
  'road5SourceFingerprintPreserved':original_fp=={m:fingerprint(o) for m,o in ROAD.items()},
  'sourceCameraNumericsPreserved':camera_snapshot=={m:(tuple(o.location),tuple(o.rotation_euler),o.data.lens) for m,o in CAM.items()},
  'original7B48And28B51PhysicsUnchanged':True,
  'road5MaterialEditedInDCCOnly':True,
  'newGameCollider':False,'newPlayableRoad':False,
  'editableAuthoredDCCObjects':len(created),
  'hiddenRejectedParentCollections':hidden,
  'screenshots':shots,
  'fullOriginalWebGL2Frames':False,
  'independentAll7BVH':'NOT_RUN_HOLD',
  'ART':'UNJUDGED_HOLD','formalARTAccepted':0,'slope2DNAmetres':0,
  'HUMAN':'HOLD','CCD':'HOLD','SAT':'HOLD','FPS':'HOLD',
  'RELEASE':'HOLD','MERGE':'HOLD','files':hashes
}
with open(os.path.join(out,'K4BH_SOURCE_CAMERA_PROVENANCE.json'),'w') as f:
    json.dump(report,f,ensure_ascii=False,indent=2)
print('K4BH_NATIVE_EDITABLE_HERO_TECH_ONLY_NOT_ART_PASS',json.dumps({
  'objects':len(created),'images':len(shots),'ART':report['ART'],
  'sourceRoadUnchanged':report['road5SourceFingerprintPreserved']}))

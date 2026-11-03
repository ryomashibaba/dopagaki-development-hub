"""K4BI cinematic native Blender Road5 hero: roadway surfacing + inhabited facade craft.

DCC-only. Retains source B48 mesh, original numeric cameras and game physics.
This is an artist-proposed study, not actual playable geometry or WebGL frames.
All art is unapproved; after rendering a human must judge full-frame images.
"""
import bpy, os, math, json, hashlib, struct, sys
from math import sin, cos, pi
from mathutils import Vector

argv=sys.argv[sys.argv.index('--')+1:]
def arg(k): return os.path.abspath(argv[argv.index(k)+1])
base,out=arg('--base'),arg('--out')
os.makedirs(out,exist_ok=True)
def sha(path):
    h=hashlib.sha256()
    with open(path,'rb') as f:
        for part in iter(lambda:f.read(2**20),b''):
            h.update(part)
    return h.hexdigest()
assert sha(base)=='6e1251b08c37d67b6c87d450d616afd2485572aa94d1491e8395599c8c042796'
bpy.ops.wm.open_mainfile(filepath=base)
sc=bpy.context.scene
rig=bpy.data.collections['05_CAMERA | Authentic original source poses']
cams={}
for m,t in [('control',11307),('ultra',11341)]:
    matches=[o for o in rig.objects if o.type=='CAMERA' and str(t) in o.name]
    assert len(matches)==1
    cams[m]=matches[0]
roads={};roadcols={};othercols={}
for mode in ('control','ultra'):
    key='K4AY SOURCE B48 | '+mode.upper()+' | TRUE TESSELLATED ROAD5'
    roadcols[mode]=bpy.data.collections[key]
    assert len(roadcols[mode].objects)==1
    roads[mode]=next(iter(roadcols[mode].objects))
    othercols[mode]=bpy.data.collections['K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | '+mode.upper()]
    assert len(othercols[mode].objects)==6
def fingerprint(o):
    h=hashlib.sha256()
    for v in o.data.vertices:
        h.update(struct.pack('<3d',*map(float,v.co)))
    for f in o.data.polygons:
        h.update(struct.pack('<3i',*[int(k) for k in f.vertices]))
    return h.hexdigest()
fp0={m:fingerprint(o) for m,o in roads.items()}
assert set(fp0.values())=={'f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2'}
cam0={m:(tuple(o.location),tuple(o.rotation_euler),o.data.lens) for m,o in cams.items()}
C=cams['control'].location.copy()
heading=cams['control'].matrix_world.to_quaternion() @ Vector((0,0,-1))
H=Vector((heading.x,heading.y,0)).normalized()
R=Vector((-H.y,H.x,0))
def p(d,s,z):return C+H*d+R*s+Vector((0,0,z))
def coll(name):
    c=bpy.data.collections.new('K4BI | '+name);sc.collection.children.link(c);return c
roadart=coll('01 ROAD TEXTURE RACING ART DCC ONLY')
craft=coll('02 VARYING PUBLIC FACADE AND STRUCTURE')
glassarea=coll('03 LIT LIBRARY AND TIDAL CONSERVATORY RECESSES')
details=coll('04 ARCHITECTURAL DETAILS NOT COLLIDERS')
portals=coll('05 CIVIC PORTICO ARTICULATED NEGATIVE SPACE')
lamps=coll('06 PRACTICAL WARM LIGHT IN ROOMS')
made=[]
def mat(n,col,metal=0,rough=.58,em=0):
    x=bpy.data.materials.new('K4BI | '+n)
    x.use_nodes=True
    bs=x.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value=(*col,1)
    bs.inputs['Roughness'].default_value=rough
    bs.inputs['Metallic'].default_value=metal
    if em:
        bs.inputs['Emission Color'].default_value=(*col,1)
        bs.inputs['Emission Strength'].default_value=em
    return x
glaze=mat('satin bone ceramic ribs',(.67,.59,.46),.12,.46)
bronze=mat('dark sculptural champagne bronze',(.33,.25,.15),.67,.34)
trim=mat('thin bright machined brass reveals',(.62,.39,.16),.61,.34)
glass=mat('prussian glass dark reflective',(.012,.071,.099),.48,.21)
recess=mat('truly dark glass cavity',(.005,.014,.019),.17,.67)
brick=mat('large cut basalt with joint relief',(.061,.072,.074),.09,.88)
copper=mat('terracotta inner wall',(.34,.14,.089),.08,.69)
warm=mat('interior room bounce amber',(.83,.35,.12),.05,.47,3.2)
lampmat=mat('warm luminous edge line',(.97,.62,.26),.05,.35,2.0)
cyan=mat('cyan edge anodized illumination',(.042,.55,.68),.33,.34,1.3)
foliage=mat('deep living architectural greens',(.07,.15,.075),.00,.87)
stone=mat('light structural paving',(.29,.27,.235),.06,.8)
def mesh(n,verts,faces,ma,collection,role):
    m=bpy.data.meshes.new('K4BI / '+n+'/mesh')
    m.from_pydata([tuple(v) for v in verts],[],faces)
    m.update(calc_edges=True)
    o=bpy.data.objects.new('K4BI / '+n,m)
    collection.objects.link(o)
    m.materials.append(ma)
    o['ROLE']=role
    o['GAME_COLLIDER']=False
    o['DCC_ART_HOLD']=True
    made.append(o)
    return o
def swept(n,rows,ma,collection,role):
    k=len(rows[0]);assert k>=3 and len(rows)>1 and all(len(q)==k for q in rows)
    verts=[v for row in rows for v in row]
    faces=[(i*k+j,(i+1)*k+j,(i+1)*k+(j+1)%k,i*k+(j+1)%k)
        for i in range(len(rows)-1) for j in range(k)]
    faces.append(tuple(range(k-1,-1,-1)))
    faces.append(tuple((len(rows)-1)*k+j for j in range(k)))
    return mesh(n,verts,faces,ma,collection,role)
def box(n,d0,d1,s0,s1,z0,z1,ma,collection,role):
    return swept(n,[[p(d,s,z) for s,z in ((s0,z0),(s1,z0),(s1,z1),(s0,z1))]
                for d in (d0,d1)],ma,collection,role)
def tubing(n,points,radius,material,collection,role,sides=6):
    assert len(points)>=2
    rows=[]
    for d,s,z in points:
        rows.append([p(d,s+radius*cos(2*pi*i/sides),z+radius*sin(2*pi*i/sides)) for i in range(sides)])
    return swept(n,rows,material,collection,role)
# --- ROAD SURFACE: original tessellation untouched; instead color/roughness
# from physical world-space distances. All stripes conform to B48 mesh,
# including bends and bankings. No unsafe physically floating overlays.
def mnode(nodes,name,op,inputs=()):
    a=nodes.new(name)
    if name=='ShaderNodeMath':a.operation=op
    if name=='ShaderNodeVectorMath':a.operation=op
    for i,v in enumerate(inputs):
        if isinstance(v,(int,float)):a.inputs[i].default_value=v
    return a
roadmat=bpy.data.materials.new('K4BI | RESTRICTED DCC ONLY | crafted composite + racing grammar')
roadmat.use_nodes=True
nn=roadmat.node_tree.nodes;ll=roadmat.node_tree.links
bs=nn.get('Principled BSDF')
bs.inputs['Roughness'].default_value=.56
bs.inputs['Metallic'].default_value=.05
geom=nn.new('ShaderNodeNewGeometry')
def scalarpos(vec,origin):
    n=mnode(nn,'ShaderNodeVectorMath','DOT_PRODUCT')
    ll.new(geom.outputs['Position'],n.inputs[0])
    n.inputs[1].default_value=tuple(vec)
    sub=mnode(nn,'ShaderNodeMath','SUBTRACT',(None,float(origin.dot(vec))))
    ll.new(n.outputs['Value'],sub.inputs[0])
    return sub.outputs[0]
s=scalarpos(R,C);d=scalarpos(H,C)
def mathop(op,a,b=None):
    n=mnode(nn,'ShaderNodeMath',op)
    if isinstance(a,(float,int)):n.inputs[0].default_value=float(a)
    else:ll.new(a,n.inputs[0])
    if b is not None:
        if isinstance(b,(float,int)):n.inputs[1].default_value=float(b)
        else:ll.new(b,n.inputs[1])
    return n.outputs[0]
def edgecenter(v,w):
    a=mathop('SUBTRACT',s,v)
    return mathop('LESS_THAN',mathop('ABSOLUTE',a),w)
def mult(a,b):return mathop('MULTIPLY',a,b)
def maxv(a,b):return mathop('MAXIMUM',a,b)
def minv(a,b):return mathop('MINIMUM',a,b)
noise=nn.new('ShaderNodeTexNoise')
noise.inputs['Scale'].default_value=.19
noise.inputs['Detail'].default_value=5
noise.inputs['Roughness'].default_value=.82
ll.new(geom.outputs['Position'],noise.inputs['Vector'])
ramp=nn.new('ShaderNodeValToRGB')
ramp.color_ramp.elements[0].position=.17
ramp.color_ramp.elements[0].color=(.009,.015,.018,1)
ramp.color_ramp.elements[1].position=.85
ramp.color_ramp.elements[1].color=(.055,.076,.082,1)
ll.new(noise.outputs['Fac'],ramp.inputs['Fac'])
shade=ramp.outputs['Color']
def colorlayer(previous,mask,color):
    mix=nn.new('ShaderNodeMixRGB');mix.blend_type='MIX'
    ll.new(mask,mix.inputs[0])
    ll.new(previous,mix.inputs[1])
    mix.inputs[2].default_value=(*color,1)
    return mix.outputs[0]
# Subtle regular 27m expansion/construction joints, beveled in asphalt.
joint=mathop('LESS_THAN',mathop('MODULO',mathop('ADD',d,1.4),27.0),.21)
shade=colorlayer(shade,mult(joint,.4),(.011,.017,.019))
# Arch-designed deck language: physical racing stripes; central dual brass
# median is continuous; 4 broken lane markers avoid monotonous blank asphalt.
for side in (-1,1):
    for lateral in (31,74,114):
        m=edgecenter(side*lateral,.72 if lateral!=74 else 1.15)
        if lateral!=114:
            dash=mathop('LESS_THAN',mathop('MODULO',mathop('ADD',d,3*side),39.0),20.0)
            m=mult(m,dash)
        shade=colorlayer(shade,m,(.41,.52,.48) if lateral==74 else (.70,.63,.41))
    # Explicit bold continuous edge delineation, visible even at high speed.
    for lat,width,col in ((137,1.9,(.13,.78,.74)),(144,3.2,(.75,.43,.16))):
        m=edgecenter(side*lat,width)
        shade=colorlayer(shade,m,col)
for offset in (-4,4):
    shade=colorlayer(shade,edgecenter(offset,.52),(.91,.65,.27))
# Chevron safety shoulder: zigzag copper segments beyond the edge line,
# DCC-shader-only, no colliders and no unsafe strip mesh.
abss=mathop('ABSOLUTE',s)
outside=mult(mathop('GREATER_THAN',abss,149),mathop('LESS_THAN',abss,161))
zig=mathop('LESS_THAN',mathop('MODULO',mathop('ADD',d,mult(abss,.53)),26),8)
shade=colorlayer(shade,mult(outside,zig),(.49,.33,.15))
ll.new(shade,bs.inputs['Base Color'])
micro=nn.new('ShaderNodeTexNoise')
micro.inputs['Scale'].default_value=7.0
micro.inputs['Detail'].default_value=3.3
ll.new(geom.outputs['Position'],micro.inputs['Vector'])
bump=nn.new('ShaderNodeBump')
bump.inputs['Strength'].default_value=.20
bump.inputs['Distance'].default_value=.012
ll.new(micro.outputs['Fac'],bump.inputs['Height'])
ll.new(bump.outputs['Normal'],bs.inputs['Normal'])
for o in roads.values():
    o.data.materials.clear()
    o.data.materials.append(roadmat)
# --- AUTHOR-DIRECTED FACADES: landscape-scale but finely articulated,
# three distinctly proportioned ranges of inhabited windows, structural
# exoskeleton, deep dark thresholds, and illuminated functioning interiors.
# Cliffs and roof remain from K4BH, but the old giant plain front walls
# are no longer bare. Window glass is set in physically modeled frames.
bays=[
    (47,76,7,46),(79,125,8,59),(131,155,13,54),(166,221,10,66),
    (232,273,13,50),(281,329,8,62),(344,395,15,57)]
for sign,label in [(-1,'WEST / ARCHIVE + CIVIC GALLERY'),(1,'EAST / MARINE CONSERVATORY')]:
    outer=sign*160.0
    inner=sign*166.0
    for i,(a,b,zlo,zhi) in enumerate(bays):
        jitter=3.0*sin(i*1.91+sign)
        col=bronze if i%3 else glaze
        # Architectural hierarchy: true framed portal has depth, sill,
        # header, vertical braced structural edges.
        box(label+' lower structural soffit '+str(i),
            a,b,sign*157,sign*166,zlo-5,zlo-2,stone,craft,'PUBLIC_WALKWAY_STRUCTURAL_EDGE')
        box(label+' dark portal negative void '+str(i),
            a+3,b-3,sign*155,sign*163,zlo+1,zhi-1,recess,glassarea,'PHYSICALLY_RECESSED_PUBLIC_ROOM')
        box(label+' glass skin inner plane '+str(i),
            a+5,b-5,sign*156,sign*158,zlo+3,zhi-5,glass,glassarea,'INNER_GLASS_PLANE')
        box(label+' illuminated inhabited room far field '+str(i),
            a+6,b-6,sign*163,sign*166,zlo+5,zhi-7,
            warm if (i+sign)%3 else copper,glassarea,'ACTUAL_INTERIOR_LIGHT')
        box(label+' upper structural shading brow '+str(i),
            a-1,b+1,sign*153,sign*170,zhi,zhi+4,col,craft,'SHADOW_CASTING_TRUE_DEPTH_CANOPY')
        box(label+' warm integrated under-sill light '+str(i),
            a+4,b-4,sign*154,sign*157,zlo-.8,zlo+.35,lampmat,details,'LIGHT_REFLECTING_SILL')
        for n in (0,1,2):
            d0=a+(b-a)*(n+1)/4
            box(label+' exposed bronze mullion '+str(i)+'/'+str(n),
                d0-.66,d0+.66,sign*151,sign*163,zlo,zhi+1,bronze,details,'STRUCTURAL_FENESTRATION')
        # Deep contrasting bases and horizontal darker shadow grooves.
        for hz in [zhi-12,zhi-25]:
            if hz<zlo+6:continue
            box(label+' dark horizontal solar-shelf '+str(i)+'/'+str(hz),
                a+4,b-4,sign*150,sign*159,hz,hz+.8,bronze,details,'SHADED_SOLAR_SHELF')
        # Arch portal silhouette varies between window bays; no copies
        # of a rectangle pretending to be a city.
        if i in (1,3,6):
            pts=[]
            for j in range(18):
                tt=pi*j/17
                pts.append((a+(b-a)*j/17,
                    sign*(148-4*sin(tt)),
                    zhi+3+8*sin(tt)))
            tubing(label+' long cantilevered cornice '+str(i),
                   pts,2.4,glaze,details,'SCULPTED_CANTILEVERED_CORNICE')
    # Urban-scale folded load piers cast shadows and make the frontage read
    # as a continuous public building instead of a smooth toy wall.
    for i,(a,b,zlo,zhi) in enumerate(bays[:-1]):
        d0=b+2
        profile=[]
        for dd,dx in ((d0-5,0),(d0+1,1),(d0+7,0)):
            profile.append([p(dd,sign*140,-69),p(dd,sign*163,-69),
                p(dd,sign*174,92+jitter),p(dd,sign*154,101+jitter)])
        swept(label+' massive carved archway buttress '+str(i),
              profile,glaze if i%2 else brick,craft,'LOAD_APPEARANCE_ONLY_NOT_GAME_COLLIDER')
    # Three-dimensional bronze rail infill / gallery wall for human scale,
    # entirely beyond playfield and unverified for physical clearance.
    for lo,hi in [(35,124),(164,263),(302,401)]:
        tubing(label+' continuous bronze balcony balustrade '+str(lo),
               [(dd,sign*152,6.0+2*sin(dd*.014)) for dd in range(lo,hi+1,6)],
               .7,trim,details,'HUMAN_SCALE_PUBLIC_BALUSTRADE')
        for d0 in range(lo,hi,12):
            tubing(label+' balustrade stanchion '+str(d0),
                   [(d0,sign*152,-3),(d0,sign*152,6.0)],
                   .48,bronze,details,'HUMAN_SCALE_STANCHION')
# Hero public atrium: recognizably distinct two-arc structural arch, with
# legs beyond the formal road edge. Complex tapered ribs, a true central
# aperture and deep soffit, not a hovering hollow ring.
for sign,label in [(-1,'ARCHIVE THEATER'),(1,'TIDAL MARITIME CENTER')]:
    rows=[]
    for i in range(28):
        t=i/27
        d=213+110*t
        s=sign*(176+23*sin(pi*t))
        low=-4+26*sin(pi*t)
        height=95+34*sin(pi*t)
        rows.append([p(d,s,low),p(d,s+sign*41,low-8),
                     p(d,s+sign*48,height),
                     p(d,s+sign*16,height+17),
                     p(d,s,height-2)])
    swept(label+' multi-span inhabited civic canopy',rows,glaze,portals,'HIGH_CIVIC_ROOF_NOT_PLAYABLE')
    tubing(label+' copper continuous roof outline',
           [(210+112*i/27,sign*(181+24*sin(pi*i/27)),
             110+34*sin(pi*i/27)) for i in range(28)],
            2.1,bronze,portals,'SINGULAR_SCULPTURAL_ROOF_EDGE')
# Embedded glass screens and large continuous inner program visible in
# reflective front rooms. Very low object repetition, but high local detail.
for sign,label in [(-1,'WEST'),(1,'EAST')]:
    for i,(aa,bb) in enumerate(((60,120),(176,227),(291,363))):
        for j in range(2):
            a=aa+(bb-aa)*j/2+2
            b=aa+(bb-aa)*(j+1)/2-2
            z=29+5*i
            box(label+' visible library books wall '+str(i)+'/'+str(j),
                a,b,sign*172,sign*178,z,z+17,
                copper if i%2 else brick,glassarea,'HUMAN_PROGRAMMATIC_INTERIOR')
            for k in range(3):
                box(label+' amber casework slot '+str(i)+'/'+str(j)+'/'+str(k),
                   a+2,b-2,sign*168,sign*172,z+2+4.2*k,z+2.7+4.2*k,
                   lampmat,glassarea,'VISIBLE_INTERIOR_DISPLAY')
# Final facade identity is expressed through a continuous, physically
# placed mineral-cyan wayfinding inlay and a contrasting warmer under-soffit
# band. These are independent native meshes, not HUD billboards.
for sign,label in [(-1,'west'),(1,'east')]:
    tubing(label+' uninterrupted tidal-cyan public-facade wayfinding',
           [(dd,sign*153.0,77.0+3.2*sin(dd*.012)) for dd in range(44,410,5)],
           .65,cyan,details,'ARCHITECTURAL_WAYFINDING_NOT_GAME')
    tubing(label+' hand-finished under-window warm glazing reveal',
           [(dd,sign*154.5,-3.2+1.5*sin(dd*.016)) for dd in range(44,400,5)],
           .50,bronze,details,'FACADE_REAL_SCALE')
# Spatial lighting: reinstate an intentional late-day lighting direction;
# all prior K4BH lighting remains, except add practical area illumination
# centered inside newly modelled facades.
for sign in [-1,1]:
    for d0 in [98,196,298]:
        data=bpy.data.lights.new('K4BI | interior task lighting '+str(sign)+' '+str(d0),'AREA')
        data.energy=7500
        data.color=(1,.65,.37)
        data.shape='RECTANGLE';data.size=27;data.size_y=9
        ob=bpy.data.objects.new('K4BI / physical ceiling fixture '+str(sign)+' '+str(d0),data)
        lamps.objects.link(ob)
        ob.location=p(d0,sign*157,63)
        # downward facing area lights: normal from local -Z
sc.cycles.samples=96
try:sc.cycles.use_denoising=True
except Exception:pass
try:bpy.context.view_layer.cycles.use_denoising=True
except Exception:pass
sc.render.engine='CYCLES'
sc.render.resolution_x=1152
sc.render.resolution_y=768
sc.render.resolution_percentage=100
sc.render.image_settings.file_format='PNG'
try:sc.view_settings.look='Medium High Contrast'
except Exception:pass
sc.view_settings.exposure=-.26
# Preserve the genuine original source instead of hiding the other 6 roads
# or the fixed camera poses. DCC source Road5 gets shader only.
assert fp0=={m:fingerprint(o) for m,o in roads.items()}
assert cam0=={m:(tuple(o.location),tuple(o.rotation_euler),o.data.lens) for m,o in cams.items()}
def show(mode):
    for m,col in roadcols.items():col.hide_render=m!=mode
    for m,o in roads.items():o.hide_render=False
    for m,col in othercols.items():col.hide_render=m!=mode
    for c in bpy.data.collections:
        if 'K4AY SOURCE B51 OBB PROXIES' in c.name:c.hide_render=True
    bpy.context.view_layer.update()
shots=[]
for m,t in [('control',11307),('ultra',11341)]:
    show(m)
    sc.camera=cams[m]
    name='K4BI_'+m.upper()+'_'+str(t)+'_ORIGINAL_CAMERA_ART_UNJUDGED.png'
    sc.render.filepath=os.path.join(out,name)
    bpy.ops.render.render(write_still=True)
    shots.append({'mode':m,'tick':t,'file':name})
show('control');sc.camera=cams['control']
blend='K4BI_ROAD_MATERIAL_ARCHITECTURAL_DETAIL_EDITABLE_DCC_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
files={}
for fn in [blend]+[x['file'] for x in shots]:
    sz=os.stat(os.path.join(out,fn)).st_size
    assert sz>10000
    files[fn]={'bytes':sz,'sha256':sha(os.path.join(out,fn))}
audit={
 'schema':'dopagaki.K4BI.source-road-material-and-inhabited-architecture-native-DCC/1',
 'parentK4BHBlendSHA256':sha(base),
 'originalGameBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
 'originalPhysicsHz':240,'originalB48Roads':7,'originalB51Movers':28,'originalBallRadiusMetres':.65,
 'originalRoad5VertexPolygonFingerprintUnchanged':fp0=={m:fingerprint(o) for m,o in roads.items()},
 'sourceCameraNumericsUnchanged':cam0=={m:(tuple(o.location),tuple(o.rotation_euler),o.data.lens) for m,o in cams.items()},
 'roadShaderArtOnlyNotPhysicalRoad':True,'newPlayableColliders':0,
 'newDCCArtObjects':len(made),
 'twoOriginalSourceCameraDCCScreenshots':shots,
 'webglFrames':False,'fullB51Clearance':'NOT_TESTED','humanVisualQuality':'NOT_APPROVED',
 'ART':'UNJUDGED_HOLD','formalARTAccepted':0,'slope2DNAmetres':0,
 'SAT':'HOLD','CCD':'HOLD','FPS':'HOLD','HUMAN':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
 'files':files
}
with open(os.path.join(out,'K4BI_ORIGINAL_SOURCE_CAMERA_DCC_PROVENANCE.json'),'w') as f:
    json.dump(audit,f,ensure_ascii=False,indent=2)
print('K4BI_EDITABLE_SOURCE_DCC_TECH_ONLY',json.dumps({
    'meshFingerprintPreserved':audit['originalRoad5VertexPolygonFingerprintUnchanged'],
    'camerasPreserved':audit['sourceCameraNumericsUnchanged'],
    'newDCC':len(made),'art':'UNJUDGED_HOLD'}))

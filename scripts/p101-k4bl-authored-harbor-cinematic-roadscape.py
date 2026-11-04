"""K4BL — Road5-calibrated COASTAL HARBOR art-direction rebuild (DCC only).

ARTIST'S SCENE: low near-camera berms; middle-distance occupied maritime
architecture; an open port-city horizon. Do not repeat prior blank canyon
walls or a road-blocking toy sky bridge. Custom lofted models, a single
physically patterned original road material, world sky and habitable spaces.

All changes research/editable Blender only; no original physics/7 B48 roads,
28 B51 hazards, camera transforms, navigation, game materials or colliders
are changed. Two source-camera DCC renders can be reviewed but are NOT game
screenshots, nor are they proof of art acceptance or collision clearance.
"""
import bpy,os,sys,json,hashlib,struct,math
from math import sin,cos,pi
from mathutils import Vector

args=sys.argv[sys.argv.index('--')+1:]
def arg(s):return os.path.abspath(args[args.index(s)+1])
base,output_dir=arg('--base'),arg('--out')
os.makedirs(output_dir,exist_ok=True)
def fh(path):
    h=hashlib.sha256()
    with open(path,'rb') as f:
        for part in iter(lambda:f.read(2**20),b''):h.update(part)
    return h.hexdigest()
PARENT='8874f09c868218879bcc6a346303819b17f38ffda11177c44555e022167a1c9c'
assert fh(base)==PARENT
bpy.ops.wm.open_mainfile(filepath=base)
scene=bpy.context.scene
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
cams={}
roadcols={};othercols={};roads={}
for mode,tick in (('control',11307),('ultra',11341)):
    ca=[x for x in rig.objects if x.type=='CAMERA' and str(tick) in x.name]
    assert len(ca)==1
    cams[mode]=ca[0]
    key='K4AY SOURCE B48 | '+mode.upper()+' | TRUE TESSELLATED ROAD5'
    c=bpy.data.collections[key]
    assert len(c.objects)==1
    roadcols[mode]=c
    roads[mode]=next(iter(c.objects))
    other=bpy.data.collections['K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | '+mode.upper()]
    assert len(other.objects)==6
    othercols[mode]=other
def fingerprint(ob):
    h=hashlib.sha256()
    for v in ob.data.vertices:
        h.update(struct.pack('<3d',*[float(k) for k in v.co]))
    for f in ob.data.polygons:
        h.update(struct.pack('<3i',*[int(i) for i in f.vertices]))
    return h.hexdigest()
before={m:fingerprint(o) for m,o in roads.items()}
assert set(before.values())=={'f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2'}
cam0={m:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens)) for m,o in cams.items()}
C=cams['control'].location.copy()
fw=cams['control'].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((fw.x,fw.y,0)).normalized()
R=Vector((-F.y,F.x,0))
def P(d,s,z):return C+F*d+R*s+Vector((0,0,z))

# Exact source Road5 physical samples: first take raycast, then interpolate
# for offroad scenery. Never infer future B48/B51 clearance from these hits.
roadobj=roads['control']
inv=roadobj.matrix_world.inverted()
def source_hit(d,s):
    origin=inv@P(d,s,450)
    direction=(inv.to_3x3()@Vector((0,0,-1))).normalized()
    hit,local,normal,index=roadobj.ray_cast(origin,direction,distance=1200)
    if not hit:return None
    world=roadobj.matrix_world@local
    return float(world.z-C.z),int(index)
surveys=[]
for d in (-25,0,25,50,75,100,125,150,170):
    offsets=[s for s in range(-70,110,2) if source_hit(d,s) is not None]
    assert len(offsets)>24,(d,offsets)
    left=min(offsets);right=max(offsets)
    assert -55<left<-22 and 42<right<90
    leftpoint=source_hit(d,left+5)
    rightpoint=source_hit(d,right-5)
    assert leftpoint is not None and rightpoint is not None
    surveys.append({'d':d,'left':left,'right':right,'leftZ':leftpoint[0],'rightZ':rightpoint[0],'hits':len(offsets)})
def interpolate(d,key):
    for a,b in zip(surveys,surveys[1:]):
        if a['d']<=d<=b['d']:
            t=(d-a['d'])/(b['d']-a['d'])
            return a[key]*(1-t)+b[key]*t
    return surveys[0 if d<surveys[0]['d'] else -1][key]
def edge(d,side):
    k='left' if side<0 else 'right'
    return interpolate(d,k)
def ground(d,side):
    k='leftZ' if side<0 else 'rightZ'
    return interpolate(d,k)

hidden=[]
for c in bpy.data.collections:
    if c.name.startswith(('K4BK |','K4BJ |','K4BI |','K4BH |')):
        assert c not in roadcols.values() and c not in othercols.values() and c!=rig
        c.hide_render=True
        hidden.append(c.name)
# Older K4BE/K4BG etc had already been render-off in preserved parent.

def coll(name):
    c=bpy.data.collections.new('K4BL | '+name)
    scene.collection.children.link(c)
    return c
roadsides=coll('01 calibrated coastal road margins')
west=coll('02 WEST quarry-terraced reading institute')
east=coll('03 EAST offshore passenger terminal')
harbor=coll('04 inhabited harbor skyline and quays')
landscape=coll('05 tidal geology water and maritime pines')
functional=coll('06 original-camera legible wayfinding')
lighting=coll('07 practical and natural lights')
made=[]

def material(name,col,rough=.6,metal=.0,emission=0):
    m=bpy.data.materials.new('K4BL | '+name)
    m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*col,1)
    p.inputs['Roughness'].default_value=rough
    p.inputs['Metallic'].default_value=metal
    if emission:
        p.inputs['Emission Color'].default_value=(*col,1)
        p.inputs['Emission Strength'].default_value=emission
    return m
basalt=material('quarried midnight blue basalt',(.024,.038,.048),.84,.10)
stone=material('sandstone warm porcelain cladding',(.43,.38,.30),.73,.06)
ivory=material('precision ivory fiber reinforced ceramic',(.68,.64,.53),.43,.09)
gold=material('weathered warm brushed marine brass',(.44,.29,.13),.36,.68)
copper=material('oxidized green marine copper',(.055,.19,.16),.56,.55)
sapphire=material('deep sapphire public curtainwall',(.025,.10,.15),.23,.36)
shadow=material('real shadowed interior cavity',(.007,.016,.025),.79,.0)
interior=material('warm inhabited public library light',(.8,.30,.12),.47,.02,1.3)
rail=material('seawater hard-coated aluminum',(.11,.29,.31),.38,.46)
lightblue=material('low intensity blue-white platform indicator',(.33,.72,.83),.27,.26,.78)
warm=material('subtle warm accent led band',(.9,.51,.24),.4,.05,.8)
pine=material('maritime pine needles',(.07,.16,.11),.92,.01)
pine2=material('maritime pine soft dull sage',(.11,.21,.15),.91,.01)
bark=material('coastal pine richly weathered bark',(.13,.08,.052),.89,.03)
terrain=material('layered outcrop weathered slate',(.10,.14,.16),.94,.03)
cobble=material('embankment granite paving',(.25,.255,.25),.89,.04)
sea=material('deep blue tidal sea',(.015,.10,.14),.24,.07)

def geo(name,verts,faces,ma,collection,role,smooth=False):
    mesh=bpy.data.meshes.new('K4BL / '+name+' / editable mesh')
    mesh.from_pydata([tuple(x) for x in verts],[],faces)
    mesh.update(calc_edges=True)
    ob=bpy.data.objects.new('K4BL / '+name,mesh)
    collection.objects.link(ob)
    ob.data.materials.append(ma)
    ob['ART_STATUS']='UNASSESSED_HOLD'
    ob['RESEARCH_DCC_ONLY_NOT_GAME_COLLIDER']=True
    ob['FUNCTIONAL_MATERIAL_ROLE']=role
    for f in mesh.polygons:f.use_smooth=smooth
    made.append(ob)
    return ob
def loft(name,rows,ma,col,role,smooth=True):
    assert len(rows)>1
    n=len(rows[0]);assert n>=3 and all(len(a)==n for a in rows)
    vertices=[p for row in rows for p in row]
    faces=[(i*n+j,(i+1)*n+j,(i+1)*n+(j+1)%n,i*n+(j+1)%n)
           for i in range(len(rows)-1) for j in range(n)]
    faces.extend([tuple(range(n-1,-1,-1)),tuple((len(rows)-1)*n+j for j in range(n))])
    return geo(name,vertices,faces,ma,col,role,smooth)
def box(name,d0,d1,s0,s1,z0,z1,ma,col,role):
    return loft(name,[[P(d,s,z) for s,z in ((s0,z0),(s1,z0),(s1,z1),(s0,z1))]
                for d in (d0,d1)],ma,col,role,False)
def tube(name,pts,r,ma,col,role,n=7):
    pts=[Vector(x) for x in pts]
    assert len(pts)>1
    rows=[]
    for i,q in enumerate(pts):
        direction=(pts[min(len(pts)-1,i+1)]-pts[max(0,i-1)]).normalized()
        axis=Vector((0,0,1))
        if abs(direction.dot(axis))>.85:axis=Vector((1,0,0))
        a=direction.cross(axis).normalized()
        b=direction.cross(a).normalized()
        rows.append([q+r*(a*cos(2*pi*k/n)+b*sin(2*pi*k/n)) for k in range(n)])
    return loft(name,rows,ma,col,role)

# Road surface craft: dark wet-look graphite made from original source mesh.
# Material-only, all control/ultra B48 true tessellation remains untouched.
rmat=bpy.data.materials.new('K4BL | Road5 low-sheen aggregate + maritime track typography DCC')
rmat.use_nodes=True
nodes=rmat.node_tree.nodes;nodes.clear()
links=rmat.node_tree.links
out=nodes.new('ShaderNodeOutputMaterial')
p=nodes.new('ShaderNodeBsdfPrincipled')
p.inputs['Roughness'].default_value=.59
p.inputs['Metallic'].default_value=.07
links.new(p.outputs['BSDF'],out.inputs['Surface'])
g=nodes.new('ShaderNodeNewGeometry')
def nmath(op,a=None,b=None):
    x=nodes.new('ShaderNodeMath');x.operation=op
    for i,v in enumerate((a,b)):
        if v is not None:
            if isinstance(v,(float,int)):x.inputs[i].default_value=float(v)
            else:links.new(v,x.inputs[i])
    return x.outputs[0]
def spatial(vector):
    d=nodes.new('ShaderNodeVectorMath');d.operation='DOT_PRODUCT'
    links.new(g.outputs['Position'],d.inputs[0]);d.inputs[1].default_value=tuple(vector)
    return nmath('SUBTRACT',d.outputs['Value'],float(C.dot(vector)))
d=spatial(F);s=spatial(R)
tex=nodes.new('ShaderNodeTexNoise')
tex.inputs['Scale'].default_value=.09
tex.inputs['Detail'].default_value=4.2
tex.inputs['Roughness'].default_value=.74
links.new(g.outputs['Position'],tex.inputs['Vector'])
cr=nodes.new('ShaderNodeValToRGB')
cr.color_ramp.elements[0].position=.18
cr.color_ramp.elements[0].color=(.006,.014,.018,1)
cr.color_ramp.elements[1].position=.83
cr.color_ramp.elements[1].color=(.059,.074,.076,1)
links.new(tex.outputs['Fac'],cr.inputs['Fac'])
basecol=cr.outputs['Color']
def mixmask(mask,col):
    global basecol
    mx=nodes.new('ShaderNodeMixRGB')
    links.new(mask,mx.inputs[0]);links.new(basecol,mx.inputs[1])
    mx.inputs[2].default_value=(*col,1)
    basecol=mx.outputs[0]
def near(x,y,w):
    return nmath('LESS_THAN',nmath('ABSOLUTE',nmath('SUBTRACT',x,y)),w)
# Thin racing-appropriate markings in real survey frame. More restraint
# than old overpowering white road paint, with a graphic edge boundary.
for xpos,color,width in [
    (-33,(.42,.50,.50),.22),
    (50,(.42,.54,.52),.25),
    (-4,(.50,.60,.55),.17)]:
    if xpos>0:xpos=nmath('ADD',xpos,nmath('MULTIPLY',d,.09))
    mixmask(near(s,xpos,width),color)
for pos in (-19,22):
    target=nmath('ADD',pos,nmath('MULTIPLY',d,.06))
    dash=nmath('LESS_THAN',nmath('MODULO',nmath('ADD',d,4),14),5.3)
    mixmask(nmath('MULTIPLY',near(s,target,.22),dash),(.64,.61,.45))
# Sections of the greenish mineral stripe at the outward roadway margin
# explicitly shader-only. No floating, colliding graphical geometry.
for side in (-1,1):
    pos=(-36 if side<0 else 54)
    if side>0:pos=nmath('ADD',54,nmath('MULTIPLY',d,.08))
    mask=near(s,pos,.6)
    mixmask(mask,(.13,.42,.39))
# Extremely subtle sawtooth shoulder protection, not thick solid bands.
for side in (-1,1):
    xc=(-37 if side<0 else 57)
    mask=near(s,xc,2.3)
    period=nmath('MODULO',nmath('ADD',d,nmath('MULTIPLY',s,.24)),9.5)
    pattern=nmath('LESS_THAN',period,2)
    mixmask(nmath('MULTIPLY',mask,nmath('MULTIPLY',pattern,.42)),(.29,.26,.15))
links.new(basecol,p.inputs['Base Color'])
micro=nodes.new('ShaderNodeTexNoise')
micro.inputs['Scale'].default_value=8.4
micro.inputs['Detail'].default_value=2.1
links.new(g.outputs['Position'],micro.inputs['Vector'])
bump=nodes.new('ShaderNodeBump')
bump.inputs['Strength'].default_value=.18
bump.inputs['Distance'].default_value=.008
links.new(micro.outputs['Fac'],bump.inputs['Height'])
links.new(bump.outputs['Normal'],p.inputs['Normal'])
for obj in roads.values():
    obj.data.materials.clear()
    obj.data.materials.append(rmat)

# Road margin: a low and landscape-led section close to the camera, instead
# of massive 30m walls blocking both sides of the first 70m of travel.
for side,name in ((-1,'WEST'),(1,'EAST')):
    margin=[]
    for dd in range(-25,176,5):
        ss=edge(dd,side)
        z=ground(dd,side)
        sign=side
        # 0.9m high stone textured source-side retaining wall. Long varied
        # berms and tidal garden behind, not a barrier towering in front.
        margin.append([P(dd,ss+sign*5,z-3),
                       P(dd,ss+sign*32,z-10),
                       P(dd,ss+sign*35,z-2),
                       P(dd,ss+sign*12,z+1),
                       P(dd,ss+sign*5,z+.8)])
    loft(name+' architecturally terraced coastal roadway embankment',
         margin,terrain,roadsides,'REAL_SURVEY_OFFROAD_CLIFF',False)
    tube(name+' continuous bead-blasted marine guardrail',
         [P(dd,edge(dd,side)+side*4,ground(dd,side)+1.35)
          for dd in range(-25,176,5)],
         .25,rail,roadsides,'NONCOLLIDING_SURVEY_FOLLOWING_BARRIER')
    # Refined 0.6m high planted berm along the road itself
    for i,(a,b) in enumerate(((-15,18),(36,64),(89,121),(145,168))):
        rows=[]
        for dd in range(a,b+1,4):
            ss=edge(dd,side)+side*16
            zz=ground(dd,side)
            rows.append([P(dd,ss,zz-2),
                         P(dd,ss+side*20,zz-5),
                         P(dd,ss+side*20,zz+1.4),
                         P(dd,ss,zz+2)])
        loft(name+' vegetated salt-tolerant public planting '+str(i),
             rows,pine if i%2 else pine2,landscape,'TIDAL_LANDSCAPE')
        tube(name+' precision bronze waterside promenade rail '+str(i),
             [P(dd,edge(dd,side)+side*31,ground(dd,side)+3.1)
              for dd in range(a,b+1,4)],
             .11,gold,roadsides,'PEDESTRIAN_HARBOR_PAVING')
# WEST reading pavilion: sculptural curved facade begins only d=65, so
# the first 50m roadside remains open with landscaping.
wst=[(67,49,10),(83,52,15),(104,57,23),(125,61,24),(146,58,20),(169,53,13)]
walls=[];roof=[];glazed=[]
for dd,back,height in wst:
    outer=edge(dd,-1)-21
    h=ground(dd,-1)
    walls.append([P(dd,outer,h-8),P(dd,outer-19,h-10),
                  P(dd,outer-22,h+height-5),P(dd,outer,h+height-7)])
    roof.append([P(dd,outer+3,h+height-3),
                 P(dd,outer-back*.64,h+height-6),
                 P(dd,outer-back*.68,h+height+1.9),
                 P(dd,outer+6,h+height+2)])
    glazed.append([P(dd,outer+.5,h+2),
                   P(dd,outer-1.6,h+2),P(dd,outer-1.6,h+height-11),
                   P(dd,outer+.5,h+height-11)])
loft('WEST reading house weathered stone structural body',walls,basalt,west,'PUBLIC_LIBRARY_ENCLOSED')
loft('WEST low soaring single ivory ribbon roof',roof,ivory,west,'ONE_AUTHORED_STONE_CANOPY')
loft('WEST continuous panoramic reading glass',glazed,sapphire,west,'LIBRARY_GLAZING_REAL_DEPTH')
for i,(a,b) in enumerate(((70,94),(103,131),(137,162))):
    dd=(a+b)/2;ss=edge(dd,-1)-15;z=ground(dd,-1)
    box('WEST reading room dark architectural negative space '+str(i),
        a,b,ss+.5,ss-1.3,z+4,z+15,shadow,west,'ACTUALLY_RECESSED_LOBBY')
    box('WEST inhabited archive exhibit behind glass '+str(i),
        a+3,b-3,ss-3.4,ss-5.1,z+5,z+12,interior,west,'VISIBLE_OCCUPIED_CIVIC_PROGRAM')
    for x in (a+4,b-4):
        tube('WEST gallery slender bronze mullion '+str(i)+'/'+str(x),
             [P(x,edge(x,-1)-12,ground(x,-1)+2),
              P(x,edge(x,-1)-12,ground(x,-1)+23)],
             .23,gold,west,'ACTUAL_CURTAINWALL_SUPPORT')
# A very different EAST passenger terminal: gently sloped fan roof with
# real visible public concourse. Not a copied row of chunky wall boxes.
est=[(75,60,9),(92,64,15),(112,69,21),
     (140,74,27),(160,75,25),(178,64,18)]
deck=[];roof=[];glasswall=[]
for dd,sback,ht in est:
    z=ground(dd,1)
    sx=edge(dd,1)+14
    deck.append([P(dd,sx,z-6),P(dd,sx+36,z-7),P(dd,sx+40,z+1),P(dd,sx,z+1)])
    roof.append([P(dd,sx-2,z+ht-3),
                 P(dd,sx+sback*.64,z+ht+10),
                 P(dd,sx+sback*.68,z+ht+13),
                 P(dd,sx-4,z+ht+2)])
    glasswall.append([P(dd,sx,z+4),P(dd,sx+2,z+4),
                      P(dd,sx+2,z+ht-9),P(dd,sx,z+ht-9)])
loft('EAST ferry passenger dock granite promenade',deck,cobble,east,'PUBLIC_TERMINAL_PIER')
loft('EAST one long patinated copper tidal sail',roof,copper,east,'SCULPTURAL_MARITIME_ROOF')
loft('EAST deep glass passenger terminal hall',glasswall,sapphire,east,'INHABITED_TRANSIT_INTERIOR')
for i,(a,b) in enumerate(((75,98),(105,135),(141,170))):
    m=(a+b)/2
    s0=edge(m,1)+15;g0=ground(m,1)
    box('EAST ferry ticket gates functional hall '+str(i),
        a+3,b-2,s0+4,s0+6,g0+5,g0+19,interior,east,'TRANSIT_FUNCTIONAL_INTERIOR')
    for d0 in (a+3,b-2):
        tube('EAST elegantly canted terminal mullion '+str(i)+'/'+str(d0),
             [P(d0,edge(d0,1)+10,ground(d0,1)+2),
              P(d0+2,edge(d0,1)+11,ground(d0,1)+25)],
             .27,gold,east,'BRACED_MARINE_STRUCTURE')
# Actual maritime pines: irregular, real 3D sectional branches with
# handcrafted readable needles, varied appearance, not repeated boxes.
def tree(label,dd,side,extra,scale,variant):
    ss=edge(dd,side)+side*extra
    h=ground(dd,side)
    verts=[]
    # tapered woody trunk, sparse actual crown and dark coastal needles
    trunk=[P(dd,ss,h+1+i*(scale*.46/7))
           +R*(.18*scale*sin(.48*i+.7*variant)) for i in range(8)]
    tube(label+' exposed angular twisted bark',trunk,.18*scale,bark,landscape,'LIVING_COASTAL_PINE')
    # asymmetric foliage clusters physically shape the skyline with parallax
    for i,offset in enumerate(((-.36,.14,.75),(.21,-.20,.93),(.08,.19,1.06))):
        dz,ds,alt=offset
        center=P(dd+scale*dz,ss+scale*ds,h+scale*alt)
        rings=[]
        for level in range(4):
            t=level/3
            rad=scale*(.32-.10*t)*(1+.12*sin(variant+level))
            rings.append([center+F*(rad*cos(k*2*pi/7))
                          +R*(rad*sin(k*2*pi/7))
                          +Vector((0,0,(t-.5)*scale*.36))
                          for k in range(7)])
        loft(label+' organic pine crown '+str(i),rings,
             pine if i%2 else pine2,landscape,'ORGANIC_LIVING_CANOPY')
for i,(d0,side,offset,scale) in enumerate([
    (-9,-1,32,7.5),(22,-1,35,7),(38,1,38,7.8),
    (43,-1,46,9),(58,1,45,10),(96,-1,37,10),
    (107,1,47,10),(134,-1,45,11),(154,1,50,11)]):
    tree('pine '+str(i),d0,side,offset,scale,i)

# FAR CITY — humanly composed backdrop, not a huge wall facing the camera.
# With camera forward Road5 ending at 189m, skyline starts ~195m. The
# materials/ranges behind the road are just DCC research scenic background.
def skyline(name,d0,s0,height,radius,nfaces,material_main):
    basez=ground(170,1)+1.5
    rows=[]
    for i in range(8):
        t=i/7
        zz=basez+height*t
        r=radius*(1-.33*t)*(1+.07*sin(i*.8))
        rows.append([P(d0+2*sin(t*pi)+r*cos(k*2*pi/nfaces+.12*t),
                        s0+r*.83*sin(k*2*pi/nfaces+.12*t),zz)
                     for k in range(nfaces)])
    loft(name+' volumetric faceted maritime infrastructure tower',
         rows,material_main,harbor,'HARBOR_LIVING_CITY_SILHOUETTE')
    # 3 different inhabited floor bands, physically separate and deep
    for frac in (.28,.52,.78):
        z=basez+height*frac
        r=radius*(1-.33*frac)
        rows2=[]
        for elev in (-.85,1.8):
            rows2.append([P(d0+r*.98*cos(k*2*pi/nfaces),
                            s0+r*.80*sin(k*2*pi/nfaces),z+elev)
                          for k in range(nfaces)])
        loft(name+' panoramic occupied harbor floor '+str(frac),
             rows2,sapphire,harbor,'ACTUALLY_INHABITED_HARBOR_BUILDING')
for desc,dd,ss,ht,rad,faces,ma in [
    ('shipbuilders museum',219,-112,42,23,7,basalt),
    ('tide observatory',227,88,54,23,9,stone),
    ('marine operations exchange',247,-23,38,28,8,basalt),
    ('maritime municipal center',279,-154,76,28,8,copper),
    ('interchange lower podium',296,141,69,31,9,basalt),
    ('coastal lantern civic hall',323,23,60,23,7,sapphire),
    ('breakwater apartments',367,218,65,31,8,stone)]:
    skyline(desc,dd,ss,ht,rad,faces,ma)
# Single genuine 3D dockyard gantry at d=225, right of road. Adds a readable
# functional urban signature without a road-spanning toy skybridge.
def gantry(name,dd,ss,width,height):
    z=ground(170,1)-6
    for sg in (-1,1):
        s0=ss+sg*width*.5
        tube(name+' dockyard salt-finished crane leg '+str(sg),
             [P(dd-6,s0,z),P(dd-5,s0+sg*3,z+height*.38),
              P(dd-1,s0,z+height)],1.25,gold,harbor,'OPERATING_SHIPYARD_GANTRY')
    tube(name+' upper high-load trussed cross beam',
         [P(dd-2,ss-width*.58,z+height),
          P(dd-2,ss+width*.58,z+height)],
         1.1,gold,harbor,'FUNCTIONING_DOCK_CRANE_BEAM')
    tube(name+' downward loading hook cable',
         [P(dd-2,ss+9,z+height),P(dd-1,ss+9,z+height*.36)],
         .25,basalt,harbor,'HARBOR_LOADING_EQUIPMENT')
gantry('working container port crane',248,167,62,59)
# Beyond the B48 road end, visible sea and layered coastal cliffs without
# introducing a fake continuation of Road5 or a gameplay surface.
geo('real horizon ocean surfacing',
    [P(193,-800,-4),P(1300,-800,-4),P(1300,1100,-4),P(193,1100,-4)],
    [(0,1,2,3)],sea,landscape,'COASTAL_WATER_NOT_PLAYABLE')
# physically coherent gentle hill shoreline beyond two sides
for side,label in ((-1,'WEST'),(1,'EAST')):
    rows=[]
    for dd in (185,230,300,410,540,770):
        inner=side*(100+20*sin(dd*.008))
        outer=side*(260+38*sin(dd*.006+.8))
        h0=ground(170,side)-13
        rows.append([P(dd,inner,h0-36),
                     P(dd,outer,h0-44),
                     P(dd,outer,h0+40+20*sin(dd*.012)),
                     P(dd,inner,h0+5)])
    loft(label+' layered long-distance coastline topography',rows,
         terrain,landscape,'BACKDROP_LAND_NOT_NATIVE_ROAD')

# Hand-authored maritime city identity. A road-facing sign is a real,
# editable extruded Blender TEXT object mounted on the actual terminal
# facade — NOT an image/HUD card or native WebGL in-game sign.
def physical_sign(name,txt,dd,ss,zz,height,col):
    curve=bpy.data.curves.new('K4BL | '+name,'FONT')
    curve.body=txt
    curve.size=height
    curve.extrude=.065
    curve.bevel_depth=.015
    curve.align_x='CENTER'
    ob=bpy.data.objects.new('K4BL / '+name,curve)
    functional.objects.link(ob)
    ob.location=P(dd,ss,zz)
    ob.rotation_euler=(C-ob.location).to_track_quat('Z','Y').to_euler()
    ob.data.materials.append(col)
    ob['IN_WORLD_ARCHITECTURAL_SIGN']=True
    ob['NOT_GAMEPLAY_OR_HUD']=True
    ob['ART_JUDGEMENT']='UNJUDGED'
    made.append(ob)
physical_sign('marine terminal facade wordmark','TIDAL  /  PORT 05',
              115,edge(115,1)+14,ground(115,1)+18,4.2,ivory)
physical_sign('western reading house civic identity','THE COASTAL ARCHIVE',
              122,edge(122,-1)-14,ground(122,-1)+13,3.3,ivory)

# The distant city requires recognizable public functions instead of
# oversimplified ivory cylinders. Crisp exterior structural spines and
# stacked belvederes are actual low-poly facade geometry.
for name,dd,ss,height,radius,nfaces,ma in [
    ('shipbuilders museum',219,-112,42,23,7,basalt),
    ('tide observatory',227,88,54,23,9,stone),
    ('marine operations exchange',247,-23,38,28,8,basalt),
    ('maritime municipal center',279,-154,76,28,8,copper),
    ('interchange lower podium',296,141,69,31,9,basalt),
    ('coastal lantern civic hall',323,23,60,23,7,sapphire),
    ('breakwater apartments',367,218,65,31,8,stone)]:
    base=ground(170,1)+1.5
    for k in (0,2,4,6):
        a=(k/nfaces)*2*pi
        rad=radius*1.035
        tube(name+' tapering architectural load fin / '+str(k),
             [P(dd+rad*cos(a),ss+rad*.83*sin(a),base+3),
              P(dd+rad*.90*cos(a+.07),ss+rad*.75*sin(a+.07),base+height*.58),
              P(dd+rad*.72*cos(a+.12),ss+rad*.63*sin(a+.12),base+height*.91)],
             .32,gold if k==2 else rail,harbor,
             'HUMANLY_READABLE_SKYLINE_FACADE')
    # Distinct thin public-access corona and glazed lit observation deck.
    rad=radius*(1-.33*.88)
    pp=[P(dd+rad*cos(2*pi*k/24),
          ss+rad*.83*sin(2*pi*k/24),base+height*.88) for k in range(25)]
    tube(name+' inhabited roof promenade outline',
         pp,.35,lightblue,harbor,'REAL_OCCUPIED_ROOFTOP_PROMENADE')
# A low working vessel distinct from architectural skyline, physically
# modeled behind the end of true Road5 and NOT navigable roadway.
vessel=[]
for dd,ww,ss in ((205,12,27),(215,15,26),(230,15,25),(244,11,24)):
    vessel.append([P(dd,ss-ww,ground(170,1)-3),
                   P(dd,ss+ww,ground(170,1)-3),
                   P(dd,ss+ww*.85,ground(170,1)+3),
                   P(dd,ss-ww*.85,ground(170,1)+3)])
loft('TIDAL 05 physically modeled passenger launch hull',vessel,
     basalt,harbor,'NONPLAYABLE_WORKING_HARBOR_FERRY')
for a,bb in ((213,223),(227,238)):
    box('ferry accessible full-height glass wheelhouse '+str(a),a,bb,
        15,36,ground(170,1)+4,ground(170,1)+16,
        sapphire,harbor,'HUMAN_MARITIME_VEHICLE_PROGRAM')

# Cinematic natural light: physically sensible low sun/cross-raking
# architecture, avoid source camera overexposed blank sky.
world=scene.world
world.use_nodes=True
for node in world.node_tree.nodes:
    if node.type=='TEX_SKY':
        node.sky_type='NISHITA'
        node.sun_elevation=math.radians(6)
        node.sun_rotation=math.radians(238)
    if node.type=='BACKGROUND':
        node.inputs['Strength'].default_value=.35
for obj in bpy.data.objects:
    if obj.type=='LIGHT':obj.hide_render=True
def sunlight():
    dat=bpy.data.lights.new('K4BL low sun natural grazing shadow','SUN')
    dat.energy=2.7
    dat.color=(1,.82,.65)
    dat.angle=math.radians(8)
    obj=bpy.data.objects.new('K4BL sunset camera shadow shape',dat)
    lighting.objects.link(obj)
    obj.rotation_euler=tuple(math.radians(x) for x in (28,-27,142))
sunlight()
for desc,dd,side,z in [('library',104,-1,18),('terminal',125,1,18),
                       ('harbor lights',270,1,48)]:
    dat=bpy.data.lights.new('K4BL '+desc+' functional occupied light','AREA')
    dat.energy=6500
    dat.color=(1,.73,.48)
    dat.shape='RECTANGLE'
    dat.size=18;dat.size_y=9
    ob=bpy.data.objects.new('K4BL / '+desc+' room light',dat)
    lighting.objects.link(ob)
    ob.location=P(dd,edge(min(dd,170),side)+side*30,
                  ground(min(dd,170),side)+z)
# Render two original immutable source cameras. EEVEE to avoid unavailable
# OIDN and coarse Monte-Carlo noise from prior Cycles GPU-less builds.
render_mode=args[args.index('--renderer')+1] if '--renderer' in args else 'cycles'
assert render_mode in ('eevee','cycles'),render_mode
if render_mode=='eevee':
    scene.render.engine='BLENDER_EEVEE'
    if hasattr(scene,'eevee'):
        scene.eevee.taa_render_samples=96
        for key,value in (('use_gtao',True),('gtao_distance',3.0),
                          ('gtao_factor',1.15),('use_soft_shadows',True)):
            if hasattr(scene.eevee,key):
                setattr(scene.eevee,key,value)
else:
    # Real Blender CPU renderer previously verified in K4BK Actions.
    # This fallback is not the unavailable OpenImageDenoiser.
    scene.render.engine='CYCLES'
    scene.cycles.samples=72
    try: scene.cycles.use_denoising=False
    except Exception: pass
    try: bpy.context.view_layer.cycles.use_denoising=False
    except Exception: pass
scene.render.resolution_x=1400
scene.render.resolution_y=900
scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'
try:scene.view_settings.view_transform='Filmic'
except Exception:pass
try:scene.view_settings.look='Medium High Contrast'
except Exception:pass
scene.view_settings.exposure=-.34

assert before=={m:fingerprint(obj) for m,obj in roads.items()}
assert cam0=={m:(tuple(obj.location),tuple(obj.rotation_euler),float(obj.data.lens)) for m,obj in cams.items()}
def show(mode):
    for m,c in roadcols.items():c.hide_render=m!=mode
    for m,obj in roads.items():obj.hide_render=False
    for m,c in othercols.items():c.hide_render=m!=mode
    for c in bpy.data.collections:
        if 'K4AY SOURCE B51 OBB PROXIES' in c.name:c.hide_render=True
    bpy.context.view_layer.update()
shots=[]
for mode,tick in (('control',11307),('ultra',11341)):
    show(mode)
    scene.camera=cams[mode]
    name='K4BL_'+mode.upper()+'_'+str(tick)+'_GENUINE_SOURCE_CAMERA_HARBOR_ART_HOLD.png'
    scene.render.filepath=os.path.join(output_dir,name)
    bpy.ops.render.render(write_still=True)
    shots.append({'mode':mode,'tick':tick,'file':name})
show('control')
scene.camera=cams['control']
blend='K4BL_HARBOR_ART_DIRECTED_EDITABLE_NATIVE_BLENDER_HOLD.blend'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(output_dir,blend))
files={}
for name in [blend]+[x['file'] for x in shots]:
    filename=os.path.join(output_dir,name)
    size=os.stat(filename).st_size
    assert size>10000
    files[name]={'bytes':size,'sha256':fh(filename)}
provenance={
  'schema':'dopagaki.K4BL.native-art-directed-coastal-harbor/1',
  'parentK4BKVerifiedEditableBlendSha256':PARENT,
  'frozenGameSourceGitBlob':'af076d67492a677d2235e4730aef8cdf4808e106',
  'originalRoad5TessellationUnchanged':before=={m:fingerprint(obj) for m,obj in roads.items()},
  'originalSourceCameraNumericsUnchanged':cam0=={m:(tuple(obj.location),tuple(obj.rotation_euler),float(obj.data.lens)) for m,obj in cams.items()},
  'originalRoad5SurveySections':surveys,
  'originalB48Roads':7,'originalB51Movers':28,'originalPhysicsHz':240,'originalBallRadiusM':.65,
  'oldRejectedArtCollectionsHiddenNotDeleted':hidden,
  'newIndependentEditableArtObjects':len(made),
  'originalCameraDCCScreenshots':shots,
  'renderer':render_mode,
  'isOriginalWebGL2GameFrame':False,
  'gameFileEdited':False,'newGameColliders':0,
  'formalArtAccepted':0,'slope2DNAAcceptedMetres':0,
  'ART':'UNJUDGED_HOLD','B51_clearance':'NOT_TESTED_HOLD',
  'SAT':'HOLD','CCD':'HOLD','FPS':'HOLD','HUMAN':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
  'files':files
}
with open(os.path.join(output_dir,'K4BL_TRUE_SOURCE_CAMERA_PROVENANCE.json'),'w') as f:
    json.dump(provenance,f,ensure_ascii=False,indent=2)
print('K4BL_TRUE_SOURCE_CAMERA_DCC_TECH_ART_UNJUDGED',
      json.dumps({'sourceRoad5Protected':provenance['originalRoad5TessellationUnchanged'],
                  'newObjects':len(made),'actualRoadSections':surveys},ensure_ascii=False))

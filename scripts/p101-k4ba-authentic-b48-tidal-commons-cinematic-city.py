"""K4BA Tidal Commons / cinematic ART-FIRST reset of real Road5 (DCC ONLY).

Retains previous editable attempts for comparison but hides their art collections.
Builds a complete 3D civic city, sightline-ending tidal observatory and meaningful
material detailing along the authentic original B48 Road5 triangulated shell.
The genuine original 7 B48 sections, 28 B51 source obstacles, 6 source-numeric
cameras, game WebGL2, physics, 240Hz, collisions, and production stay UNCHANGED.
Every proposed surface is NONCOLLISION DCC ART. No formal ART certification.
"""
import bpy, math, os, sys, hashlib, json, struct
from math import pi, sin, cos
from mathutils import Vector
argv=sys.argv[sys.argv.index("--")+1:]
def arg(key):
    return os.path.abspath(argv[argv.index(key)+1])
base=arg("--base"); src=arg("--source"); out=arg("--out")
os.makedirs(out,exist_ok=True)
S=json.load(open(src,encoding="utf8"))
assert S["schema"]=="dopagaki.K4AY.original-B48-tessellated-B51-native-clock-readonly/1"
assert S["frozenOriginalGameGitBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
assert S["originalPhysicsHz"]==240 and S["originalB48Roads"]==7 and S["originalB51MovingObstacles"]==28
assert S["modes"]["control"]["roadID"]=="p93-PRISM_CREST-01"
bpy.ops.wm.open_mainfile(filepath=base)
scene=bpy.context.scene
roadcols={m:bpy.data.collections.get("K4AY SOURCE B48 | "+m.upper()+" | TRUE TESSELLATED ROAD5") for m in ("control","ultra")}
assert all(c is not None and len(c.objects)==1 for c in roadcols.values())
rgeo={m:next(iter(c.objects)) for m,c in roadcols.items()}
def road_fingerprint(obj):
    h=hashlib.sha256()
    for p in obj.data.vertices:h.update(struct.pack("<3d",*p.co))
    for f in obj.data.polygons:h.update(struct.pack("<3i",*tuple(f.vertices)))
    return h.hexdigest()
before={m:road_fingerprint(o) for m,o in rgeo.items()}
assert before["control"]==before["ultra"]
rig=bpy.data.collections.get("05_CAMERA | Authentic original source poses");assert rig
cams={};proxies={}
for m in ("control","ultra"):
    for rec in S["modes"][m]["sourceTimeRecords"]:
        t=rec["tick"]
        found=[ob for ob in rig.objects if ob.type=="CAMERA" and str(t) in ob.name]
        assert len(found)==1,(m,t)
        cam=found[0]
        original=Vector((rec["eye"][0],-rec["eye"][2],rec["eye"][1]))
        assert (cam.location-original).length<.0002,(m,t)
        cams[(m,t)]=cam
        c=bpy.data.collections.get("K4AY SOURCE B51 OBB PROXIES | "+m.upper()+" | TICK "+str(t))
        assert c and len(c.objects)==28
        proxies[(m,t)]=c
assert len(cams)==len(proxies)==6
old=[]
for c in bpy.data.collections:
    if c.name.startswith(("01_HERO |","02_SITE |","03_DETAIL |","04_DISTANT |","06_LIGHT |","K4AZ 0")):
        c.hide_render=True
        old.append(c.name)
assert len(old)>=11
def col(name):
    c=bpy.data.collections.new(name);scene.collection.children.link(c);return c
site=col("K4BA 01 | GEOGRAPHY and off-road landforms")
roof=col("K4BA 02 | CITY roof shells and civic section")
front=col("K4BA 03 | PUBLIC galleries and real open rooms")
skyline=col("K4BA 04 | TIDAL MERIDIAN observatory and skyline")
garden=col("K4BA 05 | public gardens water humans")
surf=col("K4BA 06 | noncollision ROAD MATERIAL STUDY ONLY")
lightcol=col("K4BA 07 | physically authored lights")
# Visually coherent architectural materials with multi-frequency texture.
def mat(name,color,metal=0,rough=.6,emission=0,trans=0,grain=0):
    m=bpy.data.materials.new(name);m.use_nodes=True;m.diffuse_color=(*color,1)
    p=m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value=(*color,1)
    p.inputs["Metallic"].default_value=metal
    p.inputs["Roughness"].default_value=rough
    if emission:
        p.inputs["Emission Color"].default_value=(*color,1)
        p.inputs["Emission Strength"].default_value=emission
    if trans:p.inputs["Transmission Weight"].default_value=trans
    if grain:
        n=m.node_tree.nodes.new("ShaderNodeTexNoise")
        n.inputs["Scale"].default_value=grain;n.inputs["Detail"].default_value=4.3
        bump=m.node_tree.nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value=.09;bump.inputs["Distance"].default_value=.014
        m.node_tree.links.new(n.outputs["Fac"],bump.inputs["Height"])
        m.node_tree.links.new(bump.outputs["Normal"],p.inputs["Normal"])
    return m
dark=mat("K4BA | warm graphite real-road material PROPOSAL",(.079,.097,.106),.10,.70,grain=48)
slate=mat("K4BA | maritime basalt natural cliff",(.137,.158,.16),0,.88,grain=21)
stone=mat("K4BA | pale buff cast-stone architecture",(.57,.50,.41),.02,.68,grain=58)
sand=mat("K4BA | warm coastal sandstone landform",(.34,.29,.235),0,.88,grain=17)
copper=mat("K4BA | patinated bronze folded structural plate",(.29,.31,.29),.59,.34,grain=33)
gold=mat("K4BA | brushed warm copper detail",(.53,.35,.18),.69,.33)
glass=mat("K4BA | dense turquoise low-transmission glazing",(.045,.18,.20),.12,.22,trans=.46)
interior=mat("K4BA | occupied amber rooms and doorways",(.87,.48,.23),.15,.42,emission=.85)
vegetation=mat("K4BA | green coastal canopy",(.10,.195,.12),0,.83,grain=25)
vegetation2=mat("K4BA | upland olive planting",(.24,.28,.16),0,.81)
water=mat("K4BA | reflecting harbor basin",(.06,.23,.275),.19,.14)
white=mat("K4BA | stone walkway light neutral",(.69,.61,.49),.08,.65)
tile=mat("K4BA | inset road precision matrix material",(.14,.15,.16),.32,.57,grain=120)
rubber=mat("K4BA | fine tactical road aggregate shadow",(.045,.056,.065),.14,.81,grain=105)
# Preview-only true original Road5: original vertex coordinates and indexes untampered.
for obj in rgeo.values():
    obj.data.materials.clear();obj.data.materials.append(dark);obj.data.materials.append(slate)
    top=S["modes"]["control"]["mesh"]["topIndexCount"]//3
    for face in obj.data.polygons:face.material_index=0 if face.index<top else 1
    obj["K4BA_PREVIEW_MATERIAL_ONLY_ORIGINAL_GAME_ROAD_MESH_UNCHANGED"]=True
# Read AUTHENTIC source road 91 longitudinal x 13 lateral top tessellation.
P=S["modes"]["control"]["mesh"]["positions"]
assert len(P)//3==2*91*13
def vec(i,j):
    k=3*(i*13+j)
    return Vector((P[k],-P[k+2],P[k+1]))
def sample(u,v):
    u=max(0,min(1,u))*90;v=max(0,min(1,v))*12
    i=min(89,int(u));j=min(11,int(v));a=u-i;b=v-j
    return vec(i,j)*(1-a)*(1-b)+vec(i+1,j)*a*(1-b)+vec(i,j+1)*(1-a)*b+vec(i+1,j+1)*a*b
def edge(u,sign,d,h):
    a=sample(u,0);b=sample(u,1)
    right=(b-a).copy();right.z=0;right.normalize()
    p=a if sign<0 else b
    return p+right*(sign*d)+Vector((0,0,h))
# Worldwide end-of-road world frame, ornamental CITY AFTER physical road end,
# NEVER creates a road surface, safe continuation, or gameplay collision there.
end=sample(1,.5)
fwd=Vector((.847,.502,0)).normalized()
lat=Vector((.51,-.86,0)).normalized()
def far(depth,lateral,height):
    return end+fwd*depth+lat*lateral+Vector((0,0,height))
def geom(name,points,faces,material,destination,role="OFFROAD_ARCH"):
    g=bpy.data.meshes.new(name+" editable native mesh")
    g.from_pydata([tuple(p) for p in points],[],faces);g.update(calc_edges=True)
    obj=bpy.data.objects.new(name,g);destination.objects.link(obj)
    if material:g.materials.append(material)
    for p in g.polygons:p.use_smooth=True
    obj["K4BA_ROLE"]=role
    return obj
created=[]
def surface(name,rows,material,dest,thick=0,role="OFFROAD_ARCH"):
    assert len(rows)>=2 and all(len(row)==len(rows[0]) and len(row)>=2 for row in rows)
    n=len(rows[0]);vv=[x for row in rows for x in row]
    ff=[(i*n+j,(i+1)*n+j,(i+1)*n+j+1,i*n+j+1)
        for i in range(len(rows)-1) for j in range(n-1)]
    obj=geom(name,vv,ff,material,dest,role)
    if thick:
        md=obj.modifiers.new("actual architectural physical plate","SOLIDIFY")
        md.thickness=thick;md.offset=-1
    created.append(obj)
    return obj
def line(name,points,material,dest,r=.18,role="OFFROAD_ARCH"):
    assert len(points)>1
    c=bpy.data.curves.new(name+" editable 3D path","CURVE")
    c.dimensions="3D";c.resolution_u=12;c.bevel_depth=r;c.bevel_resolution=3
    sp=c.splines.new("POLY");sp.points.add(len(points)-1)
    for v,p in zip(sp.points,points):v.co=(*p,1)
    obj=bpy.data.objects.new(name,c);dest.objects.link(obj);c.materials.append(material)
    obj["K4BA_ROLE"]=role;created.append(obj);return obj
def cylinder(name,center,r,height,material,dest,n=11):
    v=[];f=[]
    for h in (0,height):
        for k in range(n):
            a=2*pi*k/n
            v.append(center+Vector((r*cos(a),r*sin(a),h)))
    for k in range(n):f.append((k,(k+1)%n,n+(k+1)%n,n+k))
    f.extend([tuple(reversed(range(n))),tuple(range(n,2*n))])
    return geom(name,v,f,material,dest)
def occupancy(name,start,stop,wall,height=14):
    # Finite occupied glass-front reading/market room with a door GAP.
    for i in range(7):
        u=start+(stop-start)*i/6
        if i==3:continue
        n=sample(u,0)
        for side in (-1,1):
            center=edge(u,side,wall,5)
            verts=[center+Vector((0,0,h)) for h in (0,height)]
            line("MARKET / timber copper portal "+name+str(i)+str(side),
                 verts,gold,front,.27)
    for side in (-1,1):
        for i in range(6):
            if i==3:continue
            u0=start+(stop-start)*i/6;u1=start+(stop-start)*(i+1)/6
            surface("PUBLIC LIBRARY transparent recessed wall "+name+str(i)+str(side),
                    [[edge(u0,side,wall+3,h) for h in (4,19)],
                     [edge(u1,side,wall+3,h) for h in (4,19)]],
                    glass,front,.18)
            if i%2==0:
                line("WARM INTERIOR occupied reading rooms "+name+str(i)+str(side),
                     [edge(u0,side,wall+3,7),edge(u1,side,wall+3,7)],interior,front,.42)

# FIRST: actually populated road-adjacent urban canyons. 3 true structure levels
# continuous along s to Road5 physical end. Side distance ensures no road contact.
for side,word in ((-1,"WEST MARKET"),(1,"EAST LIBRARY")):
    # Rock is BELOW the promenades; present as natural *outside* ground.
    for layer in range(4):
        rows=[]
        for i in range(82):
            u=.68+.32*i/81
            row=[]
            for j in range(9):
                d=18+layer*32+j*4.8
                h=-12-layer*7+2.5*sin(4*pi*u)+2.7*sin(j*pi/8)
                row.append(edge(u,side,d,h))
            rows.append(row)
        surface("ROAD-EDGE HABITABLE ROCK TERRACE "+word+str(layer),
                rows,sand if layer%2==0 else slate,site,2.3)
    for level,(lo,hi,h) in enumerate(((13,47,11),(30,84,29),(60,107,49))):
        rows=[]
        for i in range(84):
            u=.68+.32*i/83
            row=[edge(u,side,lo+(hi-lo)*j/12,
                      h+3*sin(pi*(u-.68)/.32)+.7*sin(2*pi*j/12))
                 for j in range(13)]
            rows.append(row)
        surface("OCCUPIED INHABITED PODIUM / "+word+" / LEVEL "+str(level),
                rows,stone if level!=1 else copper,front,2.0)
        for d in (lo+1,hi-1):
            line("PERIMETER bronze public balustrade "+word+str(level)+str(d),
                 [edge(.68+.32*i/100,side,d,h+4+3*sin(pi*i/100))
                  for i in range(101)],gold,front,.26)
        for i in range(23):
            u=.69+.30*i/22
            if i in (7,8,15):continue  # open pedestrian civic entrances
            point=edge(u,side,lo+9,0)
            line("STRUCTURAL VERTICAL PORTICO / "+word+str(level)+str(i),
                 [point,edge(u,side,lo+9,h-1),
                  edge(u,side,lo+17,h+1)],copper,roof,.49)
    occupancy(word,.72,.975,49)
    # roof forms are distinct 2 large overlapping sculpted sailing shells,
    # with sectional geometry, not an endless loop of identical box facades.
    for seg,(a,b) in enumerate(((.705,.838),(.853,.987))):
        rows=[]
        for i in range(64):
            u=a+(b-a)*i/63
            row=[]
            for j in range(18):
                v=j/17
                d=20+108*v
                h=51+13*sin(pi*v)+19*sin(pi*(u-a)/(b-a))**1.24+12*v*v
                row.append(edge(u,side,d,h))
            rows.append(row)
        surface("NATIVE THICK SCULPTURAL CIVIC CANOPY "+word+str(seg),
                rows,stone if side==-1 else copper,roof,2.5)
        for j in (0,5,10,17):
            v=j/17;d=20+108*v
            line("HAND-CUT ROOF / QUARTZ BRONZE EDGE "+word+str(seg)+str(j),
                 [edge(a+(b-a)*i/63,side,d,
                    51+13*sin(pi*v)+19*sin(pi*i/63)**1.24+12*v*v)
                  for i in range(64)],gold,roof,.40)
        # Crucial VOID in center: do not physically close atrium
        for j in (6,13,23,34,43,56):
            u=a+(b-a)*j/63
            line("REAL ARCHITECTURAL LOAD RIB "+word+str(seg)+str(j),
                 [edge(u,side,20+108*k/35,
                   49+13*sin(pi*k/35)+19*sin(pi*j/63)**1.24)
                  for k in range(36)],copper,roof,.39)

# The deep active waterfront public gardens are off-road, connected to deck.
for side,word in ((-1,"WEST"),(1,"EAST")):
    for u,dist in ((.76,101),(.852,126),(.943,99)):
        center=edge(u,side,dist,21)
        n=56;v=[];faces=[]
        for r in (19,14):
            for k in range(n):
                a=2*pi*k/n
                v.append(center+Vector((r*cos(a),r*sin(a),0)))
        faces=[(k,(k+1)%n,n+(k+1)%n,n+k) for k in range(n)]
        pool=geom("REAL PUBLIC GARDEN / open ring water court "+word+str(u),
                  v,faces,stone,garden)
        pool.modifiers.new("garden basin structural depth","SOLIDIFY").thickness=2
        v=[center+Vector((13*cos(2*pi*k/n),13*sin(2*pi*k/n),-1)) for k in range(n)]
        geom("SHALLOW REFLECTING WATER / not road "+word+str(u),
             v,[tuple(range(n))],water,garden)
        for j in range(8):
            a=2*pi*j/8
            base=center+Vector((26*cos(a),26*sin(a),-3))
            cylinder("SINGLE coastal tree trunk "+word+str(u)+str(j),
                     base,1.4,10,slate,garden)
            # Curved sculpted crown, not a simple sphere.
            rows=[]
            for k in range(12):
                t=k/11;rr=6.5*(max(.02,sin(pi*t)))**.7
                rows.append([base+Vector((rr*cos(2*pi*i/12)+2*t,
                            rr*sin(2*pi*i/12),7+15*t)) for i in range(12)])
            surface("wind-swept 3D maritime tree canopy "+word+str(u)+str(j),
                    rows,vegetation if j%2 else vegetation2,garden)

# The meaningful inhabited transverse institution: a walkable sky conservatory
# with real roof, broad glass facades and colossal solid edge foundations.
# This is NOT a source collision, driving ramp or original game overhead portal.
u0=.969;u1=.991
W=(sample(.982,1)-sample(.982,0)).length
def cross(u,v,h):
    if v<0:return edge(u,-1,-v*W,h)
    if v>1:return edge(u,1,(v-1)*W,h)
    return sample(u,v)+Vector((0,0,h))
for layer in ("bottom","facade","roof"):
    rows=[]
    for u in [u0,u0+(u1-u0)*.33,u0+(u1-u0)*.67,u1]:
        row=[]
        for j in range(33):
            v=-.20+1.4*j/32;t=max(0,min(1,v))
            wave=4*sin(pi*t)**.8
            if layer=="bottom":h=31+wave
            elif layer=="facade":h=42+wave
            else:h=51+8*sin(pi*t)**1.15
            row.append(cross(u,v,h))
        rows.append(row)
    surface("THE OVERHEAD CIVIC CONSERVATORY / "+layer,
           rows,stone if layer!="facade" else glass,roof,
           2 if layer!="facade" else .28)
for u in (u0,u1):
    for j in range(13):
        v=-.15+1.30*j/12;t=max(0,min(1,v))
        line("GALLERY OCCUPIED TRANSVERSE BRONZE MULLION "+str(u)+str(j),
             [cross(u,v,h) for h in (34+4*sin(pi*t),50+8*sin(pi*t)**1.15)],
             gold,roof,.44)
for side in (-1,1):
    for j in range(4):
        u=u0+(u1-u0)*j/3
        line("CONSERVATORY LOAD-BEARING STATION FRAME "+str(side)+str(j),
             [edge(u,side,14,0),edge(u,side,14,18),
              edge(u,side,22,33)],copper,roof,.88)
    # all occupied rooms lead into 40m-high station head / real public movement
    for j in (4,7,11):
        line("PUBLIC TRANSIT ESCALATOR SECTION 3D "+
                 str(side)+str(j),
             [edge(.936,side,j+13,13),edge(.956,side,j+13,29),
              edge(.978,side,j+13,34)],gold,front,.40)

# Monumental focal terminus visible in actual original source camera:
# TWO sculpted inhabited civic crescents around an actually OPEN 105m atrium.
# All entirely beyond physical Road5, not a fabricated drivable continuation.
for segment,dep in enumerate((58,96,132)):
    for side in (-1,1):
        rows=[]
        for j in range(38):
            t=j/37
            # curved wings with a deliberate central skyline void
            horizontal=side*(63+64*t)
            vertical=12+85*sin(pi*t)**.80+14*t
            row=[far(dep+12*math.sin(pi*t)*sign,horizontal,vertical+dh)
                 for sign,dh in ((-1,-5),(1,5))]
            rows.append(row)
        surface("TERMINUS LARGE TECTONIC 3D SAIL / "+str(segment)+str(side),
                rows,stone if segment!=1 else copper,skyline,4.2)
        for t in (0,.25,.50,.75,1):
            j=int(t*37)
            line("TERMINUS structural folded seam "+str(segment)+str(side)+str(t),
                 [far(dep+d,side*(63+64*t),
                      12+85*sin(pi*t)**.8+14*t+dh)
                   for d,dh in ((-16,-6),(0,0),(16,6))],
                 gold,skyline,.56)
# A strong true architecturally continuous inhabited observation ring in the
# inner skyline; suspended by four spatial masts, not skinny empty arches.
center=far(84,0,96)
N=64;wall=[]
for k in range(N):
    th=2*pi*k/N
    wall.append(center+Vector((57*cos(th),39*sin(th),0)))
rows=[wall,[x+Vector((0,0,9)) for x in wall]]
surface("TERMINUS GREAT SKY PUBLIC OBSERVATORY / closed inhabited gallery ring",
        rows,glass,skyline,1.35)
surface("TERMINUS OBSERVATORY metallic pedestrian balcony",
        [[x+Vector((0,0,-5)) for x in wall],
         [center+Vector((49*cos(2*pi*k/N),31*sin(2*pi*k/N),-5)) for k in range(N)]],
        copper,skyline,1.75)
for k in range(0,N,4):
    p=wall[k]
    line("PUBLIC OBSERVATORY / real structural glass-facade division "+str(k),
         [p+Vector((0,0,-1)),p+Vector((0,0,11))],gold,skyline,.26)
for side in (-1,1):
    for d in (-34,34):
        foot=far(84,side*100+d,0)
        line("MERIDIAN OPEN OBSERVATORY / four major real pylons "+str(side)+str(d),
             [foot,foot+Vector((0,0,48)),
              center+Vector((side*27,d*.45,0))],copper,skyline,3.4)

# Publicly functional mixed-use harbor skyline, diversified tapered sections
# instead of repeating stick boxes. Build coherent towers with real openings.
def mixed_tower(name,depth,side,height,baseR,phase,material):
    center=far(depth,side,0)
    n=15
    rows=[]
    for i in range(25):
        t=i/24
        taper=baseR*(1-.43*t)
        rows.append([center+Vector((
          taper*cos(2*pi*j/n+phase*t)+4*sin(pi*t),
          taper*.78*sin(2*pi*j/n+phase*t)+4*sin(2*pi*t),
          2+height*t))
          for j in range(n)])
    for j in range(n):
        if j%5==2:continue # authentic long recessed faceted window slots
        surface(name+" / folded mixed-use skin elevation "+str(j),
                [[row[j],row[(j+1)%n]] for row in rows],
                glass if j%3 else material,skyline,.35)
    for j in (0,3,6,9,12):
        line(name+" / grounded copper mullion "+str(j),
             [row[j] for row in rows],gold,skyline,.52)
    # Civic terrace crown with rooftop pool, scale and mass.
    surface(name+" / non-drivable roof",
            [rows[-1],[
             center+Vector(((baseR*.57)*cos(2*pi*j/n+phase),
                            (baseR*.44)*sin(2*pi*j/n+phase),height+3))
             for j in range(n)]],
            material,skyline,1)
for idx,(d,side,h,r,turn) in enumerate((
   (190,-175,122,28,.4),(228,155,109,34,.8),(275,-245,156,29,.6),
   (313,214,138,26,-.7),(380,-86,189,34,.3),(438,152,148,29,.8),
   (510,-285,175,35,.3),(580,268,130,38,-.5))):
    mixed_tower("COASTAL CIVIC QUARTER / independent tall profile "+str(idx),
                d,side,h,r,turn,stone if idx%2 else copper)
# Multi-grain basins and hill terraces frame both sides of skyline; importantly
# they are NOT a fabricated original road, stage continuation or safe surface.
for side in (-1,1):
    for band in range(5):
        rows=[]
        for i in range(30):
            depth=20+(460*i/29)
            row=[]
            for j in range(12):
                lateral=side*(150+band*52+j*8)
                height=-20-band*8+10*sin(i*pi/29)**2+4*cos(j*pi/11)
                row.append(far(depth,lateral,height))
            rows.append(row)
        surface("TIDAL LANDSCAPE / ocean-facing rock terraces "+
                str(side)+str(band),rows,slate if band%2 else sand,site,2.0)
# Far view above the true terminus has distinct massive stand-off sea cliffs.
for side in (-1,1):
    rows=[]
    for i in range(31):
        u=i/30
        row=[]
        for j in range(13):
            v=j/12
            depth=570+u*390
            lateral=side*(170+v*440)
            height=-42+155*(v**1.1)+35*sin(3*u*pi+side)*sin(v*pi)
            row.append(far(depth,lateral,height))
        rows.append(row)
    surface("LONG-FOCUS 3D WATERSHED / far rocky coast "+str(side),
            rows,sand if side<0 else slate,site,4)

# Material study: REAL tessellated Road5 samples, not a newly invented
# road extension or altered collider. Surface decor is only DCC visual proposal.
for v0,v1,material in ((.08,.20,tile),(.26,.31,rubber),
                        (.37,.44,tile),(.56,.63,tile),
                        (.69,.74,rubber),(.80,.92,tile)):
    rows=[]
    for i in range(181):
        u=.655+.345*i/180
        rows.append([sample(u,v0+(v1-v0)*j/10)+Vector((0,0,.033))
                     for j in range(11)])
    surface("DCC ROAD SKIN test band real B48 samples "+str(v0),
            rows,material,surf,0,"NONCOLLISION_VISUAL_ONLY")
# Complex measured natural slab seams of varying spans, no fake safety cue.
for v in (.045,.235,.48,.52,.765,.955):
    line("DCC ROAD SKIN long-stone precision construction joint "+str(v),
        [sample(.66+.34*i/172,v)+Vector((0,0,.07)) for i in range(173)],
        gold if v in (.045,.955) else slate,surf,.092,"NONCOLLISION_VISUAL_ONLY")
for i,u in enumerate((.685,.718,.761,.803,.847,.902,.948,.988)):
    for v0,v1 in ((.025,.21),(.79,.975)):
        line("DCC ROAD SKIN segmented shoulder stone bedding "+str(i)+str(v0),
             [sample(u,v0)+Vector((0,0,.069)),
              sample(u,v1)+Vector((0,0,.069))],
             gold,surf,.085,"NONCOLLISION_VISUAL_ONLY")

# Real intentional light hierarchy for public interiors + natural atmosphere.
def area(name,location,power,rgb,size):
    d=bpy.data.lights.new(name,"AREA")
    d.energy=power;d.color=rgb;d.shape="DISK";d.size=size
    o=bpy.data.objects.new(name,d);lightcol.objects.link(o)
    o.location=location;o.rotation_euler=(Vector((0,0,-1))).to_track_quat("-Z","Y").to_euler()
for side in (-1,1):
    for u in (.74,.81,.89,.96):
        area("PUBLIC INTERIOR WARM WALL SCONCE "+str(side)+str(u),
             edge(u,side,57,30),990,(1,.7,.4),18)
for d in (52,100,200):
    area("HARBOR MERIDIAN true terminal soft public art light "+str(d),
         far(d,0,149),1500,(1,.66,.36),28)
world=bpy.data.worlds.new("K4BA / authentic sea-atmosphere DCC only");world.use_nodes=True
p=world.node_tree.nodes.get("Background")
p.inputs["Color"].default_value=(.54,.64,.69,1);p.inputs["Strength"].default_value=.72
try:
    sky=world.node_tree.nodes.new("ShaderNodeTexSky");sky.sky_type="NISHITA"
    sky.sun_elevation=math.radians(23);sky.sun_rotation=math.radians(109)
    sky.air_density=2.4;sky.dust_density=2.3
    world.node_tree.links.new(sky.outputs["Color"],p.inputs["Color"])
except Exception:pass
scene.world=world
sun=bpy.data.lights.new("K4BA off-axis late afternoon studio sun","SUN")
sun.energy=1.7;sun.angle=.095
so=bpy.data.objects.new("K4BA authored art sun NOT original",sun);lightcol.objects.link(so)
so.rotation_euler=(.55,-.71,-.41)
scene.render.engine="CYCLES";scene.cycles.samples=26
scene.cycles.use_denoising=False
scene.render.resolution_x=1013;scene.render.resolution_y=698
scene.render.resolution_percentage=88
scene.render.image_settings.file_format="PNG"
try:scene.view_settings.view_transform="AgX"
except Exception:scene.view_settings.view_transform="Filmic"
scene.view_settings.exposure=-.18
scene.view_settings.gamma=1.0
def show(mode,tick):
    for k,c in roadcols.items():c.hide_render=k!=mode
    for k,c in proxies.items():c.hide_render=k!=(mode,tick)
    bpy.context.view_layer.update()
def shot(name,camera):
    scene.camera=camera
    scene.render.filepath=os.path.join(out,name)
    bpy.ops.render.render(write_still=True)
renders=[]
for mode in ("control","ultra"):
    for rec in S["modes"][mode]["sourceTimeRecords"]:
        tick=rec["tick"];show(mode,tick)
        path="K4BA_TRUE_POSE_DCC_"+mode.upper()+"_"+str(tick)+".png"
        shot(path,cams[(mode,tick)])
        renders.append({"mode":mode,"nativeTick":tick,
                        "sourceOriginalPNG_SHA256":rec["sourceImageSHA256"],
                        "sourceNativeSeconds":rec["sourceNativeSeconds"],
                        "sourceProxyOBBCount":28,
                        "dccScreenshot":path})
assert len(renders)==6
show("control",11278)
camdat=bpy.data.cameras.new("K4BA designer city full section / NOT GAME");camdat.lens=35
camera=bpy.data.objects.new("K4BA city aerial / NO ORIGINAL GAME CLAIM",camdat)
rig.objects.link(camera);camera.location=far(0,380,250)
target=far(114,0,100)
camera.rotation_euler=(target-camera.location).normalized().to_track_quat("-Z","Y").to_euler()
shot("K4BA_ARTIST_CITY_AERIAL_DCC_NOT_GAME.png",camera)
show("control",11259)
scene.camera=cams[("control",11259)]
after={m:road_fingerprint(o) for m,o in rgeo.items()}
assert before==after
assert len(created)>100
blend="K4BA_TIDAL_COMMONS_EDITABLE_ART_REJECT_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
glb="K4BA_TIDAL_COMMONS_DCC_MESHES_NOT_GAME.glb"
bpy.ops.export_scene.gltf(filepath=os.path.join(out,glb),
                          export_format="GLB",export_cameras=False,export_lights=False)
files=[blend,glb,"K4BA_ARTIST_CITY_AERIAL_DCC_NOT_GAME.png"]+[a["dccScreenshot"] for a in renders]
checks={}
for filename in files:
    data=open(os.path.join(out,filename),"rb").read()
    assert len(data)>2000,filename
    checks[filename]={"sha256":hashlib.sha256(data).hexdigest(),"bytes":len(data)}
report={
 "schema":"dopagaki.K4BA.real-original-Road5-whole-screen-DCC-art-rebuild/1",
 "sourceFrozenBlob":"af076d67492a677d2235e4730aef8cdf4808e106",
 "trueRoadID":"p93-PRISM_CREST-01",
 "trueRoadControlPointsSHA256":S["modes"]["control"]["originalRoadSourcePointsSHA256"],
 "originalB48RoadCount":7,"originalB51MovingCount":28,
 "trueRoadTriangles":S["modes"]["control"]["trueSourceTriangleCount"],
 "trueSourceRoadFingerprintBefore":before,"trueSourceRoadFingerprintAfter":after,
 "roadGeometryUnmodified":True,"originalSixNumericCamerasUnmodified":True,
 "sourceB51OBBProxySnapshots":6*28,
 "trueRoadMaterialChangedForDCCOnly":True,
 "sourceGameRoadMaterialUnmodified":True,
 "proposedRoadAndSkylineNoGameColliders":True,
 "road5EndIsOriginalNoDriveableContinuationAuthored":True,
 "oldK4AZResearchArtPreservedButNotRendered":old,
 "authoredEditableObjects":len(created),
 "sourceNumericCameraDccRenders":renders,
 "actualGameWebGL2Frames":False,"originalGameDriveAndCCDVerified":False,
 "independentB48B51BVHSnapshotAudit":"NOT_YET_RUN_HOLD",
 "artistRating":"NOT_REVIEWED_ART_HOLD",
 "formalArtApproved":0,"Slope2DNACertifiedMetres":0,
 "ART":"REJECT_HOLD","HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD",
 "FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":checks}
with open(os.path.join(out,"K4BA_SOURCE_DCC_ART_PROVENANCE.json"),"w") as fd:
    json.dump(report,fd,indent=2)
print("K4BA_SOURCE_CINEMATIC_CITY_DCC_RENDERED_NOT_ART_APPROVED",
      json.dumps({"newObjects":len(created),"renders":len(renders),
       "B48OriginalUnmodified":before==after,"sourceB51Count":168}))

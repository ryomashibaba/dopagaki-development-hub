"""K4AZ / Civic Rift - recompose Road5 as an inhabited architectural landscape.

READ ONLY B48/B51. No changes to original physics, hazards or WebGL.
This generates editable, Blender-native architectural mass, separated from
preserved K4AY reference collections, and 6 genuine numeric source-POSE
Blender renders plus an independently composed designer view. Not game art PASS.
"""
import bpy, math, os, sys, json, hashlib, struct
from math import sin, cos, pi
from mathutils import Vector
from mathutils.bvhtree import BVHTree

arg=sys.argv[sys.argv.index("--")+1:]
def option(name):
    i=arg.index(name)
    return os.path.abspath(arg[i+1])
base=option("--base")
source=option("--source")
out=option("--out")
os.makedirs(out,exist_ok=True)
data=json.load(open(source,encoding="utf8"))
assert data["schema"]=="dopagaki.K4AY.original-B48-tessellated-B51-native-clock-readonly/1"
assert data["frozenOriginalGameGitBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
assert data["originalPhysicsHz"]==240 and data["originalB48Roads"]==7
assert data["originalB51MovingObstacles"]==28
assert data["modes"]["control"]["roadID"]=="p93-PRISM_CREST-01"
assert data["modes"]["control"]["originalRoadSourcePointsSHA256"]==data["modes"]["ultra"]["originalRoadSourcePointsSHA256"]
bpy.ops.wm.open_mainfile(filepath=base)
scene=bpy.context.scene
# Source road must stay real tessellated data, not an invented slab.
road_cols={}
for mode in ("control","ultra"):
    c=bpy.data.collections.get("K4AY SOURCE B48 | "+mode.upper()+" | TRUE TESSELLATED ROAD5")
    assert c is not None and len(c.objects)==1
    road_cols[mode]=c
def fingerprint(road):
    import hashlib
    h=hashlib.sha256()
    for p in road.data.vertices:h.update(struct.pack("<3d",*[float(v) for v in p.co]))
    for f in road.data.polygons:h.update(struct.pack("<3i",*[int(i) for i in f.vertices]))
    return h.hexdigest()
geometry_hash_before={k:fingerprint(next(iter(c.objects))) for k,c in road_cols.items()}
assert geometry_hash_before["control"]==geometry_hash_before["ultra"]
rig=bpy.data.collections.get("05_CAMERA | Authentic original source poses")
assert rig is not None
cameras={}
for mode in ("control","ultra"):
    for row in data["modes"][mode]["sourceTimeRecords"]:
        tick=row["tick"]
        matches=[o for o in rig.objects if o.type=="CAMERA" and str(tick) in o.name]
        assert len(matches)==1,(mode,tick)
        camera=matches[0]
        v=Vector((row["eye"][0],-row["eye"][2],row["eye"][1]))
        assert (camera.location-v).length<0.0002
        cameras[(mode,tick)]=camera
assert len(cameras)==6
b51cols={}
for mode in ("control","ultra"):
    for row in data["modes"][mode]["sourceTimeRecords"]:
        tick=row["tick"]
        c=bpy.data.collections.get("K4AY SOURCE B51 OBB PROXIES | "+mode.upper()+" | TICK "+str(tick))
        assert c is not None and len(c.objects)==28,(mode,tick)
        b51cols[(mode,tick)]=c

# K4AX art is retained in the .blend for genuine side-by-side study, but hidden.
OLD_NAMES=("01_HERO |","02_SITE |","03_DETAIL |","04_DISTANT |","06_LIGHT |")
old_hidden=[]
for c in list(bpy.data.collections):
    if c.name.startswith(OLD_NAMES):
        c.hide_render=True
        old_hidden.append(c.name)
assert len(old_hidden)==5

def group(name):
    c=bpy.data.collections.new(name)
    scene.collection.children.link(c)
    return c
tectonic=group("K4AZ 01 | TRUE BANK GEOLOGY + terraced canyon")
civic=group("K4AZ 02 | LEFT civic agora, sectioned vaults and open ground rooms")
market=group("K4AZ 03 | RIGHT inhabited arcades, bridges and gardens")
silhouette=group("K4AZ 04 | FIGURATIVE skyline anchors, not repeating towers")
lights=group("K4AZ 05 | authored civic interior lighting")
roadsurf=group("K4AZ 06 | DCC-only noncollision surface pattern proposals")

def material(name,color,metal=0,rough=.6,glass=0,emit=None):
    m=bpy.data.materials.new(name)
    m.use_nodes=True
    m.diffuse_color=(*color,1)
    p=m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value=(*color,1)
    p.inputs["Metallic"].default_value=metal
    p.inputs["Roughness"].default_value=rough
    if glass:
        p.inputs["Transmission Weight"].default_value=glass
        p.inputs["IOR"].default_value=1.48
    if emit:
        p.inputs["Emission Color"].default_value=(*emit[:3],1)
        p.inputs["Emission Strength"].default_value=emit[3]
    return m
basalt=material("K4AZ | Wet dark basalt construction and road",(.035,.055,.065),.18,.80)
# Actual 3D procedural roughness for premium aggregate, not an RGB noise overlay.
p=basalt.node_tree.nodes.get("Principled BSDF")
noise=basalt.node_tree.nodes.new("ShaderNodeTexNoise")
noise.inputs["Scale"].default_value=48
noise.inputs["Detail"].default_value=3.2
bump=basalt.node_tree.nodes.new("ShaderNodeBump")
bump.inputs["Strength"].default_value=.12
bump.inputs["Distance"].default_value=.018
basalt.node_tree.links.new(noise.outputs["Fac"],bump.inputs["Height"])
basalt.node_tree.links.new(bump.outputs["Normal"],p.inputs["Normal"])
edge_stone=material("K4AZ | Copper-black structural stone",(.105,.135,.145),.12,.72)
concrete=material("K4AZ | Warm quartz concrete / open public decks",(.52,.44,.35),.10,.72)
patina=material("K4AZ | Brushed oxidized architectural copper",(.34,.32,.25),.62,.37)
bronze=material("K4AZ | Bronze threshold + craft details",(.53,.30,.14),.72,.34)
glass=material("K4AZ | Deep teal facade glass / actual recess",(.035,.21,.24),.14,.17,glass=.66)
interior=material("K4AZ | Amber occupied community rooms",(.61,.34,.14),.06,.55,emit=(.80,.43,.16,.34))
rock=material("K4AZ | Stratified sandstone rock + grown bank",(.28,.24,.205),0,.90)
rock2=material("K4AZ | Shadow fissure / basalt cliff",(.11,.135,.14),.1,.91)
green=material("K4AZ | Deep oxygen foliage",(.085,.22,.13),0,.89)
green2=material("K4AZ | Fine olive meadow",(.18,.23,.12),0,.90)
white=material("K4AZ | Restrained route strip in DCC, not game cue",(.55,.53,.42),.14,.82)
water=material("K4AZ | Recessed reflecting pool",(.055,.19,.23),.12,.15)
glow=material("K4AZ | Recessed amber architectural practicals",(.89,.59,.26),.1,.32,emit=(.98,.64,.28,2.1))
# Retint true Road5 source geometry MATERIAL ONLY in editable DCC art preview.
for mode,c in road_cols.items():
    obj=next(iter(c.objects))
    obj.data.materials.clear()
    obj.data.materials.append(basalt)
    obj.data.materials.append(edge_stone)
    count=data["modes"][mode]["mesh"]["topIndexCount"]//3
    for face in obj.data.polygons:face.material_index=0 if face.index<count else 1
    obj["K4AZ_PREVIEW_MATERIAL_ONLY_TRUE_B48_POINTS_UNMODIFIED"]=True

# Source tessellation uses rows 31x5, resolution 3 -> 91x13 top lattice.
orig=data["modes"]["control"]["mesh"]
positions=orig["positions"]
NU=90;NV=12
assert len(positions)//3==2*(NU+1)*(NV+1)
assert orig["topIndexCount"]//3==2*NU*NV
def convert(p):return Vector((p[0],-p[2],p[1]))
def lattice(i,j):
    k=3*(i*(NV+1)+j)
    return convert(positions[k:k+3])
def sample(u,v):
    u=min(1,max(0,u))*NU; v=min(1,max(0,v))*NV
    i=min(NU-1,int(u)); j=min(NV-1,int(v))
    a=u-i;b=v-j
    return (lattice(i,j)*(1-a)*(1-b)+lattice(i+1,j)*a*(1-b)+
            lattice(i,j+1)*(1-a)*b+lattice(i+1,j+1)*a*b)
def bankpoint(u,side,offset,height):
    assert side in (-1,1)
    L=sample(u,0);R=sample(u,1)
    edge=L if side<0 else R
    along=R-L
    tangent=Vector((along.x,along.y,0)).normalized()
    return edge+side*tangent*offset+Vector((0,0,height))
def mesh(name,verts,faces,mat,col,role="OFF_ROAD_ARCHITECTURE"):
    g=bpy.data.meshes.new(name+" EDITABLE MESH")
    g.from_pydata([tuple(p) for p in verts],[],faces)
    g.update(calc_edges=True)
    obj=bpy.data.objects.new(name,g);col.objects.link(obj)
    if mat:g.materials.append(mat)
    for face in g.polygons:face.use_smooth=True
    obj["K4AZ_SURVEY_ROLE"]=role
    return obj
architectural=[]
def strip(name,rows,mat,col,solid=0):
    assert len(rows)>1 and len(rows[0])>=2
    n=len(rows[0])
    assert all(len(x)==n for x in rows)
    pts=[p for row in rows for p in row]
    faces=[(i*n+j,(i+1)*n+j,(i+1)*n+j+1,i*n+j+1)
           for i in range(len(rows)-1) for j in range(n-1)]
    obj=mesh(name,pts,faces,mat,col)
    architectural.append(obj)
    if solid:
        m=obj.modifiers.new("REAL PLATE CROSS SECTION","SOLIDIFY")
        m.thickness=solid;m.offset=-1
    return obj
def polyline(name,pts,radius,mat,col):
    crv=bpy.data.curves.new(name+" editable spline","CURVE")
    crv.dimensions="3D";crv.resolution_u=12
    crv.bevel_depth=radius;crv.bevel_resolution=3
    curve=crv.splines.new("POLY")
    curve.points.add(len(pts)-1)
    for p,v in zip(curve.points,pts):p.co=(*v,1)
    obj=bpy.data.objects.new(name,crv);col.objects.link(obj)
    crv.materials.append(mat)
    obj["K4AZ_SURVEY_ROLE"]="OFF_ROAD_ARCHITECTURE"
    return obj
def sculpt_grove(name,p,height,radius,mat,col):
    # Lofts with asymmetry, not 2D tree billboards.
    n=12; rings=10; points=[];faces=[]
    for i in range(rings+1):
        t=i/rings
        r=max(.025,radius*math.sin(pi*t)**.8*(1+.12*sin(5*t)))
        for j in range(n):
            a=j*2*pi/n
            points.append(p+Vector((r*cos(a)+2*t*t,r*sin(a),height*t)))
    for i in range(rings):
        for j in range(n):
            k=i*n+j
            faces.append((k,i*n+(j+1)%n,(i+1)*n+(j+1)%n,k+n))
    obj=mesh(name,points,faces,mat,col)
    architectural.append(obj)
    return obj
def cylindrical_open_pavilion(name,u,side,d,rad,h,mat,col):
    # Open circular public atrium; center EMPTY, thick perimeter ring only.
    n=50
    center=bankpoint(u,side,d,h)
    vertices=[]
    for r in (rad,rad-4.2):
        for i in range(n):
            a=2*pi*i/n
            vertices.append(center+Vector((r*cos(a),r*sin(a),0)))
    faces=[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
    roof=mesh(name+" / OPEN RING ROOF",vertices,faces,mat,col)
    architectural.append(roof)
    m=roof.modifiers.new("Structural ring plate","SOLIDIFY")
    m.thickness=2.2;m.offset=-1
    for i in range(0,n,5):
        p=vertices[i]
        down=Vector((p.x,p.y,center.z-20))
        polyline(name+" / curved column "+str(i),[
            down,down+Vector((0,0,11)),p+Vector((1.1,0,-1.8))],.65,patina,col)
    return center

# Terrain FIRST: actual B48 edges stay exposed, no invented replacement rideable plane.
for side,name in [(-1,"LEFT"),(1,"RIGHT")]:
    for tier in range(4):
        lo,hi=[(76,109),(110,155),(157,206),(208,266)][tier]
        uu=[.66+i*(.34/62) for i in range(63)]
        rows=[]
        for u in uu:
            phase=(u-.66)*21
            points=[]
            for j in range(10):
                off=lo+(hi-lo)*j/9
                h=(-8-9*tier+(off-lo)*(-.10)+
                   3.5*sin(phase+.4*tier)*sin(pi*j/9))
                points.append(bankpoint(u,side,off,h))
            rows.append(points)
        strip("GEOLOGICAL TERRACES / "+name+" / stratum "+str(tier),
              rows,rock if tier%2==0 else rock2,tectonic,solid=2.1)
    # One physically legible outer elevated linear promenade, not a void.
    for deck in range(3):
        start=.70+deck*.045;end=.94+deck*.016
        rows=[]
        for i in range(58):
            u=start+(end-start)*i/57
            rows.append([bankpoint(u,side,20+deck*19+6*j/7,
                       2+deck*11+2.4*sin((u-start)*pi/(end-start)))
                for j in range(8)])
        strip("HUMAN PUBLIC TERRACE / "+name+" / LEVEL "+str(deck+1),
              rows,concrete if deck<2 else patina,
              civic if side<0 else market,solid=1.5)
        for off in (20+deck*19,26+deck*19):
            polyline("PUBLIC GUARD / "+name+" / level "+str(deck)+" / "+str(off),
                     [bankpoint(start+(end-start)*i/55,side,off,
                       3.7+deck*11+2.4*sin(pi*i/55)) for i in range(56)],
                     .18,bronze,civic if side<0 else market)

# LEFT / 3 genuine shell segments with a visible sky slot between. No huge blank canopy.
for piece,(u0,u1) in enumerate(((.735,.798),(.812,.893),(.904,.985))):
    rows=[]
    for i in range(46):
        u=u0+(u1-u0)*i/45
        row=[]
        for j in range(20):
            v=j/19
            d=28+73*v+5.5*sin(pi*(u-u0)/(u1-u0))*sin(pi*v)
            lift=(33+18*sin(pi*v)+8*sin(pi*(u-u0)/(u1-u0))+
                  7*sin(2*pi*v)*sin(pi*(u-u0)/(u1-u0))+.03*(u-.75)*100)
            row.append(bankpoint(u,-1,d,lift))
        rows.append(row)
    strip("LEFT CIVIC VAULT / TRUE ARCHITECTURAL ROOF "+str(piece),
          rows,concrete,civic,solid=2.0)
    for v in (.04,.52,.96):
        polyline("VAULT RECESSED BRONZE RIM / "+str(piece)+" "+str(v),
             [bankpoint(u0+(u1-u0)*i/60,-1,
              28+73*v+5.5*sin(pi*i/60)*sin(pi*v),
              33+18*sin(pi*v)+8*sin(pi*i/60)+
              7*sin(2*pi*v)*sin(pi*i/60)+.03*((u0+(u1-u0)*i/60)-.75)*100)
              for i in range(61)],.38,bronze,civic)
    # Structural ribs touch both open side courts. Sparse with clear architecture logic.
    for i in (9,22,35):
        u=u0+(u1-u0)*i/45
        polyline("VAULT COFFER / "+str(piece)+" / "+str(i),
             [bankpoint(u,-1,28+73*j/20,31+18*sin(pi*j/20)+8*sin(pi*i/45))
              for j in range(21)],.30,patina,civic)
    # deep sectional colonnades and glass storefronts with actual voids for doors
    for k in range(15):
        u=u0+(u1-u0)*(k+.5)/15
        if k in (2,3,10):continue
        a=bankpoint(u,-1,35,5)
        b=bankpoint(u,-1,37,27)
        polyline("COLUMN / civic exchange / "+str(piece)+" / "+str(k),
                 [a,a+Vector((0,0,12)),b],.56,patina,civic)
        if k%3!=0:
            row0=[bankpoint(u-.0015,-1,55,5),
                  bankpoint(u-.0015,-1,55,22)]
            row1=[bankpoint(u+.0015,-1,55,5),
                  bankpoint(u+.0015,-1,55,22)]
            strip("SUNK GLASS SHOP ROOM / public reading room "+
                  str(piece)+" "+str(k),[row0,row1],glass,civic)
        else:
            polyline("AMBER ACTIVE COMMUNITY ROOM "+str(piece)+" "+str(k),
                     [bankpoint(u-.003,-1,57,8),
                      bankpoint(u+.003,-1,57,8)],.45,glow,civic)

# RIGHT / inhabited mid-rise arcade, continuous along genuine road.
for deck in range(2):
    u0=.724+deck*.065;u1=.984
    rows=[]
    for i in range(75):
        u=u0+(u1-u0)*i/74
        rows.append([bankpoint(u,1,25+41*j/12,
                      25+deck*15+5*sin(pi*i/74)+3*sin(pi*j/12)) for j in range(13)])
    strip("RIGHT PUBLIC HALL / multiple inhabitable gallery decks "+str(deck),
          rows,concrete if deck==0 else patina,market,solid=2.4)
    for i in range(20):
        u=u0+(u1-u0)*(i+.5)/20
        if i%6 in (1,2):continue # purposeful real entrance slots
        polyline("RIGHT PUBLIC GALLERY PIER "+str(deck)+" "+str(i),
                 [bankpoint(u,1,46,2),
                  bankpoint(u,1,46,19+deck*12),
                  bankpoint(u,1,44,24+deck*15)],
                 .78,edge_stone,market)
        if i%2:
            uleft=u-.002;uright=u+.002
            strip("RIGHT INHABITED GLASS BAY "+str(deck)+" "+str(i),
               [[bankpoint(uleft,1,64,8+deck*15),
                 bankpoint(uleft,1,64,19+deck*15)],
                [bankpoint(uright,1,64,8+deck*15),
                 bankpoint(uright,1,64,19+deck*15)]],glass,market)
    for d in (24,66):
        polyline("RIGHT GALLERY CONTINUOUS PRECISION COPPER EDGE "+str(deck)+str(d),
                 [bankpoint(u0+(u1-u0)*i/77,1,d,
                    26+deck*15+5*sin(pi*i/77)) for i in range(78)],
                 .34,bronze,market)

# Four genuinely different open ring public spaces, clear unbuilt courts.
for side,u,d,rad,lev,name in [
    (1,.841,111,29,27,"PUBLIC BOTANICAL RING + REFLECTIONS"),
    (1,.953,125,24,35,"ROOF AMPHITHEATRE + OPEN COURT"),
    (-1,.773,129,25,19,"CIVIC WATER COURT + OPEN CIRCULATION"),
    (-1,.954,138,30,28,"SUSPENDED PERFORATED EXHIBITION GARDEN")]:
    center=cylindrical_open_pavilion(name,u,side,d,rad,lev,bronze,
                                     civic if side<0 else market)
    watercenter=center-Vector((0,0,13))
    # water only at recessed outer courtyard, never in road.
    points=[watercenter+Vector((rad*.47*cos(i*2*pi/40),
                                rad*.47*sin(i*2*pi/40),0)) for i in range(40)]
    mesh(name+" / REAL RECESSED WATER BASIN",points,
         [tuple(range(40))],water,civic if side<0 else market)
    for k in range(8):
        a=2*pi*k/8
        p=center+Vector(((rad+8)*cos(a),(rad+8)*sin(a),-18))
        sculpt_grove(name+" / planted canopy "+str(k),p,13,6,
                     green if k%2 else green2,market if side>0 else civic)

# Far BIG silhouette anchors, unlike isolated old K4AX tower: two varied forms
# tied to the Road5 geometry by the inhabited podiums.
def sculpt_tower(name,u,side,d,height,baseR,nrings,nedges):
    center=bankpoint(u,side,d,0)
    rows=[]
    for j in range(nrings+1):
        t=j/nrings
        ring=[]
        for k in range(nedges):
            a=2*pi*k/nedges + .75*t*t
            rx=baseR*(1-.42*t)+3*sin(3*pi*t)
            ry=baseR*.72*(1-.17*t)
            ring.append(center+Vector((rx*cos(a)+9*sin(pi*t),
                         ry*sin(a)+5*t*t,height*t+7)))
        rows.append(ring)
    for k in range(nedges):
        strip(name+" / authored tapered facade plane "+str(k),
          [[row[k],row[(k+1)%nedges]] for row in rows],
          glass if k%4 else patina,silhouette,solid=.38)
    for k in range(0,nedges,4):
        polyline(name+" / spandrel structural fin "+str(k),
                 [row[k] for row in rows],.42,bronze,silhouette)
    return center
sculpt_tower("RIGHT / CRESCENT CIVIC LIGHTHOUSE",.94,1,208,166,32,36,14)
sculpt_tower("LEFT / BASALT CULTURAL CHIMNEY",.97,-1,231,111,28,28,11)

# True-source-geometry longitudinal civic connector across the FULL real road.
# This is one designed inhabitable elevated pedestrian connection, NOT a gate
# obstacle, NOT a new collider, never a gameplay-camera or safety certification.
def crossing(u,q,h):
    if q<0:return bankpoint(u,-1,-q*(sample(u,1)-sample(u,0)).length,h)
    if q>1:return bankpoint(u,1,(q-1)*(sample(u,1)-sample(u,0)).length,h)
    return sample(u,q)+Vector((0,0,h))
bridge_u=.925
# Floating deck is high above actual B48/B51 occupied collision band.
cross_rows=[]
for u in (bridge_u-.005,bridge_u,bridge_u+.005):
    cross_rows.append([crossing(u,-.10+1.20*i/64,
                   40+4.5*sin(pi*max(0,min(1,-.10+1.20*i/64))))
                   for i in range(65)])
strip("HERO FOCAL EVENT / HIGH PUBLIC SKY TRANSIT GALLERY - TRUE ROAD CLEAR",
      cross_rows,concrete,market,solid=2.1)
for u in (bridge_u-.005,bridge_u+.005):
    for h in (43.0,49.0):
        polyline("FAR SKY TRANSIT PEDESTRIAN PARAPET "+str(u)+str(h),
                 [crossing(u,-.1+1.2*i/70,
                    h+4*sin(pi*max(0,min(1,-.1+1.2*i/70)))) for i in range(71)],
                 .22,bronze,market)
for u in (bridge_u-.012,bridge_u+.015):
    polyline("TRANSIT FOCAL / OPEN IMPRESSIVE SEGMENTED ARCH "+str(u),
             [crossing(u,-.10+1.20*i/70,
                  52+24*sin(pi*max(0,min(1,-.1+1.2*i/70)))**1.18)
               for i in range(71)],1.12,patina,market)
# A tangible station head anchors each end, safely OUTSIDE the physical road.
for side in (-1,1):
    u=bridge_u
    for offset in (16,30,43):
        polyline("SKY GALLERY BANK SUPPORT / "+str(side)+str(offset),
          [bankpoint(u,side,offset,0),
           bankpoint(u,side,offset,20),
           bankpoint(u,side,offset+2.5,40)],
          .86,edge_stone,civic if side<0 else market)
    strip("PEDESTRIAN TRANSIT CONCOURSE ENTRANCE / "+str(side),
         [[bankpoint(u-.018,side,13+44*i/10,26+15*(i/10))
            for i in range(11)],
          [bankpoint(u+.018,side,13+44*i/10,26+15*(i/10))
            for i in range(11)]],
         patina,civic if side<0 else market,solid=1.7)

# ROAD ART IS A NON-COLLIDING MATERIAL STUDY ONLY. WIDE TRUE-SOURCE
# tiled grip bands articulate the enormous 90-106m authentic road width.
road_band=material("K4AZ | Fine ribbed basalt center longitudinal grip",
                   (.064,.09,.102),.28,.85)
for start,end in ((.19,.29),(.365,.425),(.575,.635),(.71,.81)):
    rows=[]
    for i in range(141):
        u=.657+.343*i/140
        rows.append([sample(u,start+(end-start)*j/7)+Vector((0,0,.026))
                     for j in range(8)])
    mesh("DCC NONCOLLISION / highway full-depth relief material band "+str(start),
         [p for row in rows for p in row],
         [(i*8+j,(i+1)*8+j,(i+1)*8+j+1,i*8+j+1)
           for i in range(140) for j in range(7)],
         road_band,roadsurf,"VISUAL_ONLY_PROPOSAL_NOT_SOURCE_MARKING")
# Human-scale road-to-bank threshold pavers at genuine B48 edges.
for side,v in ((-1,.008),(1,.992)):
    for i in range(27):
        u=.665+.33*i/26
        polyline("DCC ONLY / true source skin integrated road-shoulder sawcut "+
                  str(side)+str(i),
            [sample(u,v)+Vector((0,0,.06)),
             sample(u,v+(-.025 if side>0 else .025))+Vector((0,0,.06))],
            .047,bronze,roadsurf)

# Inlaid 3D ART material proposals directly sampled from original B48, no fake mesh.
# This collection is separately toggleable and explicitly NOT original gameplay cues.
for v in (.075,.265,.735,.925):
    vv=.0022
    rows=[]
    for i in range(171):
        u=.642+.358*i/170
        rows.append([sample(u,v-vv)+Vector((0,0,.046)),
                     sample(u,v+vv)+Vector((0,0,.046))])
    obj=mesh("DCC ONLY original skin-conformal inlaid directional seam "+str(v),
             [p for row in rows for p in row],
             [(2*i,2*i+2,2*i+3,2*i+1) for i in range(len(rows)-1)],
             white,roadsurf,"VISUAL_ONLY_PROPOSAL_NOT_SOURCE_MARKING")
# Few measured basalt joint seams; not source safety-signalling replacements.
for u in (.715,.763,.811,.859,.907,.955):
    rows=[]
    for i in range(29):
        v=.05+.90*i/28
        rows.append([sample(u-.00055,v)+Vector((0,0,.049)),
                     sample(u+.00055,v)+Vector((0,0,.049))])
    mesh("DCC ONLY transversal integrated ground material joint "+str(u),
         [p for row in rows for p in row],
         [(2*i,2*i+2,2*i+3,2*i+1) for i in range(28)],
         patina,roadsurf,"VISUAL_ONLY_PROPOSAL_NOT_SOURCE_MARKING")

# Street/civic practicals: legible inhabited rooms, not neon scenery.
def area_light(name,position,power,color,size):
    lamp=bpy.data.lights.new(name,"AREA")
    lamp.energy=power;lamp.color=color;lamp.shape="DISK";lamp.size=size
    obj=bpy.data.objects.new(name,lamp);lights.objects.link(obj)
    obj.location=position;obj.rotation_euler=(Vector((0,0,-1))).to_track_quat("-Z","Y").to_euler()
for side in (-1,1):
    for u in (.75,.81,.87,.93):
        p=bankpoint(u,side,53,30)
        area_light("Civic facade warm practical "+str(side)+str(u),
                   p,800,(1,.68,.37),15)

# Studio light, sky, filmic tonemapping are ONLY non-game survey directions.
world=bpy.data.worlds.new("K4AZ STUDIO atmosphere / NOT original game")
scene.world=world;world.use_nodes=True
world.node_tree.nodes["Background"].inputs["Color"].default_value=(.48,.56,.63,1)
try:
    sky=world.node_tree.nodes.new("ShaderNodeTexSky")
    sky.sky_type="NISHITA"
    sky.sun_elevation=math.radians(17)
    sky.sun_rotation=math.radians(125)
    sky.air_density=2.2
    sky.dust_density=2.9
    world.node_tree.links.new(sky.outputs["Color"],
                              world.node_tree.nodes["Background"].inputs["Color"])
except Exception:
    pass
world.node_tree.nodes["Background"].inputs["Strength"].default_value=.63
light=bpy.data.lights.new("K4AZ diffuse warm sun / studio only","SUN")
light.energy=1.55;light.angle=.085
sun=bpy.data.objects.new("K4AZ studio sun",light);lights.objects.link(sun)
sun.rotation_euler=(.43,-.70,-.33)
scene.render.engine="CYCLES"
scene.cycles.samples=25
scene.cycles.use_denoising=False
scene.render.resolution_x=1013;scene.render.resolution_y=698
scene.render.resolution_percentage=88
scene.render.image_settings.file_format="PNG"
try:scene.view_settings.view_transform="AgX"
except Exception:scene.view_settings.view_transform="Filmic"
try:scene.view_settings.look="Medium High Contrast"
except Exception:pass
scene.view_settings.exposure=-.20
scene.view_settings.gamma=1

# Scene remains editable and original camera numeric. Every time frame switches
# 28 actual source OBBs at its EXACT simulation time, never a synthesized visual hazard.
def visible(mode,tick):
    for key,c in road_cols.items():c.hide_render=(key!=mode)
    for key,c in b51cols.items():c.hide_render=(key!=(mode,tick))
    bpy.context.view_layer.update()
def capture(label,camera):
    scene.camera=camera
    scene.render.filepath=os.path.join(out,label)
    bpy.ops.render.render(write_still=True)

original_masks=[]
for mode in ("control","ultra"):
    for shot in data["modes"][mode]["sourceTimeRecords"]:
        t=shot["tick"]
        visible(mode,t)
        cap="K4AZ_SOURCE_POSE_DCC_"+mode.upper()+"_"+str(t)+".png"
        capture(cap,cameras[(mode,t)])
        original_masks.append({"mode":mode,"tick":t,"sourceCameraPNG_SHA256":shot["sourceImageSHA256"],
             "actualSourceTickSeconds":shot["sourceNativeSeconds"],
             "B51ActualSourceCollisionProxyCount":28,"DCCshot":cap})
# Artist camera is intentionally extra and not a true native source camera.
visible("control",11278)
camdata=bpy.data.cameras.new("K4AZ designer aerial art critique not-game")
camdata.lens=32;camdata.sensor_fit="VERTICAL";camdata.sensor_height=32
cam=bpy.data.objects.new("K4AZ studio aerial / NOT ORIGINAL GAME",camdata)
rig.objects.link(cam)
cam.location=bankpoint(.79,1,200,145)
aim=sample(.86,.5)+Vector((0,0,21))
cam.rotation_euler=(aim-cam.location).normalized().to_track_quat("-Z","Y").to_euler()
capture("K4AZ_DCC_DESIGN_STUDIO_NOT_GAME.png",cam)
visible("control",11259)
scene.camera=cameras[("control",11259)]
# Be explicit that old architecture is stored and new is the only visible candidate.
geometry_hash_after={k:fingerprint(next(iter(c.objects))) for k,c in road_cols.items()}
assert geometry_hash_after==geometry_hash_before,"SOURCE ROAD PHYSICAL GEOMETRY MODIFIED"
assert len(original_masks)==6 and len(b51cols)==6
assert len(architectural)>20
basefile="K4AZ_CIVIC_RIFT_EDITABLE_ART_REJECT_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,basefile))
glbfile="K4AZ_CIVIC_RIFT_DCC_GEOMETRY_ONLY.glb"
bpy.ops.export_scene.gltf(filepath=os.path.join(out,glbfile),
                          export_format="GLB",export_cameras=False,export_lights=False)
files=[basefile,glbfile,"K4AZ_DCC_DESIGN_STUDIO_NOT_GAME.png"]+[
        r["DCCshot"] for r in original_masks]
stamp={}
for file in files:
    p=os.path.join(out,file)
    assert os.path.isfile(p) and os.path.getsize(p)>2000,file
    with open(p,"rb") as f:
        stamp[file]={"bytes":os.path.getsize(p),
                     "sha256":hashlib.sha256(f.read()).hexdigest()}
report={
    "schema":"dopagaki.K4AZ.true-b48-b51-native-scenography-dcc-first/1",
    "gitSourceBlob":"af076d67492a677d2235e4730aef8cdf4808e106",
    "parentK4AYActions":41612254866,"parentK4AYArtifact":13218659517,
    "trueB48SourceRoadID":data["modes"]["control"]["roadID"],
    "road5SourceControlPointsSHA256":data["modes"]["control"]["originalRoadSourcePointsSHA256"],
    "road5MeshFingerprintBefore":geometry_hash_before,
    "road5MeshFingerprintAfter":geometry_hash_after,
    "realRoad5MeshVerticesUnchanged":True,
    "actualOriginalSourceB48Sections":7,"actualB51MovingObstacles":28,
    "sourceB51OBBInstancesStored":6*28,"nativeCameraShots":original_masks,
    "sourceB51OBBCollisionProxyNOTGameArt":True,"sourceCameraNumericsUnchanged":True,
    "newEditableArchitectureMeshCount":len(architectural),
    "originalK4AXArchitecturePreservedButNotRendered":old_hidden,
    "sourceRoadInlaysAreNonCollisionDesignProposalsOnly":True,
    "noNewGameColliders":True,"originalGameScreenshots":False,
    "originalWebGL2PhysicsRun":False,"roadArchitectureBVHContact":"NOT_TESTED_HOLD",
    "sourceB51VsArchitectureExactIntersection":"NOT_TESTED_HOLD",
    "humanReadableArt":"NOT_TESTED_HOLD",
    "formalARTAccepted":0,"Slope2DNAMetres":0,"ART":"REJECT_HOLD",
    "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD",
    "RELEASE":"HOLD","MERGE":"HOLD",
    "files":stamp
}
with open(os.path.join(out,"K4AZ_DCC_PROVENANCE_AND_GATE_REPORT.json"),"w",encoding="utf8") as f:
    json.dump(report,f,ensure_ascii=False,indent=2)
print("K4AZ_DCC_SOURCE_PHYSICS_UNMODIFIED_RECOMPOSED_NOT_ART_PASS",
      json.dumps({"architectureMeshes":len(architectural),"shots":len(original_masks),
       "sourceroadB48":data["modes"]["control"]["roadID"],
       "sourceB51proxies":168,"ART":report["ART"]}))

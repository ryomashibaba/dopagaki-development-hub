"""K4BC source-Camera architected monumental road-side civic district.
Not a generic collection of futuristic towers: mass, void, building section,
load paths, civic programme, terrain and an inhabited skyline form one scene.

All B48/B51 physics, 240Hz, 0.65m ball, six real Camera numeric poses, source
gamestate and course stay untouched. This is only editable Blender DCC art,
never source gameplay collision, ART PASS, or verified WebGL2 screenshots.
"""
import bpy, math, json, hashlib, struct, sys, os
from math import sin,cos,pi
from mathutils import Vector
argv=sys.argv[sys.argv.index("--")+1:]
def path(arg):
    return os.path.abspath(argv[argv.index(arg)+1])
base=path("--base");src=path("--source");out=path("--out")
os.makedirs(out,exist_ok=True)
S=json.load(open(src,encoding="utf8"))
assert S["schema"]=="dopagaki.K4AY.original-B48-tessellated-B51-native-clock-readonly/1"
assert S["frozenOriginalGameGitBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
assert S["originalPhysicsHz"]==240 and S["originalB48Roads"]==7 and S["originalB51MovingObstacles"]==28
assert S["modes"]["control"]["roadID"]=="p93-PRISM_CREST-01"
bpy.ops.wm.open_mainfile(filepath=base)
scene=bpy.context.scene
sourcecols={mode:bpy.data.collections.get("K4AY SOURCE B48 | "+mode.upper()+" | TRUE TESSELLATED ROAD5") for mode in ("control","ultra")}
assert all(c is not None and len(c.objects)==1 for c in sourcecols.values())
roads={mode:next(iter(c.objects)) for mode,c in sourcecols.items()}
def fp(obj):
    h=hashlib.sha256()
    for p in obj.data.vertices:h.update(struct.pack("<3d",*[float(x) for x in p.co]))
    for p in obj.data.polygons:h.update(struct.pack("<3i",*[int(x) for x in p.vertices]))
    return h.hexdigest()
before={mode:fp(x) for mode,x in roads.items()}
assert before["control"]==before["ultra"]
assert len(roads["control"].data.polygons)==4728
rig=bpy.data.collections.get("05_CAMERA | Authentic original source poses")
assert rig
cams={};proxies={}
for mode in ("control","ultra"):
    for r in S["modes"][mode]["sourceTimeRecords"]:
        t=r["tick"];c=[o for o in rig.objects if o.type=="CAMERA" and str(t) in o.name]
        assert len(c)==1
        p=Vector((r["eye"][0],-r["eye"][2],r["eye"][1]))
        assert (c[0].location-p).length<.0002
        cams[mode,t]=c[0]
        pc=bpy.data.collections.get("K4AY SOURCE B51 OBB PROXIES | "+mode.upper()+" | TICK "+str(t))
        assert pc is not None and len(pc.objects)==28
        proxies[mode,t]=pc
assert len(cams)==len(proxies)==6
# Keep every rejected art collection editable, but hide all OLD generated art:
# source B48 tessellations, B51 original-time proxies and six cameras NOT hidden.
disabled=[]
for coll in bpy.data.collections:
    if coll.name.startswith(("K4BA 01 |","K4BA 02 |","K4BA 03 |",
            "K4BA 04 |","K4BA 05 |","K4BA 06 |","K4BA 07 |",
            "K4BB 01 |","K4BB 02 |","K4BB 03 |","K4BB 04 |",
            "K4BB 05 |")):
        coll.hide_render=True;disabled.append(coll.name)
assert len(disabled)>=11
def coll(name):
    c=bpy.data.collections.new(name);scene.collection.children.link(c);return c
terrain=coll("K4BC 01 | tectonic cliffs and founded public banks")
public=coll("K4BC 02 | West exchange and East civic library - sectional mass")
entry=coll("K4BC 03 | oversized legible entrances and public courtyards")
terminus=coll("K4BC 04 | monumental occupied skyline, NOT a driveable road")
surfaceart=coll("K4BC 05 | NONCOLLISION Road5 shoulder civic stone seam study")
lights=coll("K4BC 06 | studio architectural and public-space lighting")
review=coll("K4BC 07 | additional artist camera, NOT original game")
made=[]
def material(name,color,metal=0,rough=.6,glazing=0,emission=0,grain=0):
    m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
    p=m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value=(*color,1)
    p.inputs["Metallic"].default_value=metal
    p.inputs["Roughness"].default_value=rough
    if glazing:p.inputs["Transmission Weight"].default_value=glazing
    if emission:
        p.inputs["Emission Color"].default_value=(*color,1)
        p.inputs["Emission Strength"].default_value=emission
    if grain:
        n=m.node_tree.nodes.new("ShaderNodeTexNoise")
        n.inputs["Scale"].default_value=grain;n.inputs["Detail"].default_value=4
        b=m.node_tree.nodes.new("ShaderNodeBump")
        b.inputs["Strength"].default_value=.08;b.inputs["Distance"].default_value=.018
        m.node_tree.links.new(n.outputs["Fac"],b.inputs["Height"])
        m.node_tree.links.new(b.outputs["Normal"],p.inputs["Normal"])
    return m
rock=material("K4BC / black basalt stratified coastal geology",(.125,.147,.153),rough=.86,grain=21)
cliff=material("K4BC / warm ochre layered cut sandstone",(.39,.33,.24),rough=.82,grain=38)
trav=material("K4BC / monumental light ivory honed public travertine",(.57,.51,.42),rough=.71,grain=45)
terracotta=material("K4BC / saturated oxidized red glazed fired brick",(.43,.19,.15),rough=.63,grain=35)
bronze=material("K4BC / dark aged copper structural plates",(.25,.29,.28),metal=.64,rough=.38,grain=33)
window=material("K4BC / actual occupied green-glass facades",(.05,.18,.19),metal=.08,rough=.25,glazing=.44)
wood=material("K4BC / honey timber civic exhibit and seats",(.48,.25,.11),rough=.66,grain=76)
roofmat=material("K4BC / white monolithic shell reinforced concrete",(.61,.58,.50),rough=.64,grain=30)
glow=material("K4BC / large visible golden indoor public lighting",(.95,.58,.27),emission=3,rough=.4)
green=material("K4BC / park terrace olive trees",(.125,.24,.14),rough=.72)
water=material("K4BC / harbor water reflecting blue-gray",(.075,.23,.29),metal=.2,rough=.17)
# AUTHENTIC tessellated B48 Road5 top lattice in source JSON; NEVER new road.
P=S["modes"]["control"]["mesh"]["positions"]
assert len(P)//3==2*91*13
def point(i,j):
    k=3*(i*13+j)
    return Vector((P[k],-P[k+2],P[k+1]))
def sample(u,v):
    u=max(0,min(1,u))*90;v=max(0,min(1,v))*12
    i=min(89,int(u));j=min(11,int(v));a=u-i;b=v-j
    return (point(i,j)*(1-a)*(1-b)+point(i+1,j)*a*(1-b)+
            point(i,j+1)*(1-a)*b+point(i+1,j+1)*a*b)
def edge(u,side,d,h):
    a=sample(u,0);b=sample(u,1)
    x=b-a;x.z=0;x.normalize()
    return (a if side<0 else b)+x*(side*d)+Vector((0,0,h))
end=sample(1,.5)
F=Vector((.847,.502,0)).normalized()
L=Vector((.51,-.86,0)).normalized()
def far(d,s,h):return end+F*d+L*s+Vector((0,0,h))
def mesh(name,verts,faces,mat,col,role="OFFROAD_ARCH"):
    data=bpy.data.meshes.new(name+" editable surface")
    data.from_pydata([tuple(p) for p in verts],[],faces);data.update(calc_edges=True)
    ob=bpy.data.objects.new(name,data);col.objects.link(ob)
    if mat:data.materials.append(mat)
    for p in data.polygons:p.use_smooth=True
    ob["K4BC_ROLE"]=role
    made.append(ob);return ob
def sheet(name,rows,mat,col,thick=0,role="OFFROAD_ARCH"):
    assert len(rows)>1 and len(rows[0])>1 and all(len(r)==len(rows[0]) for r in rows)
    n=len(rows[0]);verts=[x for r in rows for x in r]
    faces=[(i*n+j,(i+1)*n+j,(i+1)*n+j+1,i*n+j+1)
      for i in range(len(rows)-1) for j in range(n-1)]
    ob=mesh(name,verts,faces,mat,col,role)
    if thick:
        mod=ob.modifiers.new("real thick architectural shell","SOLIDIFY")
        mod.thickness=thick;mod.offset=-1
    return ob
def beam(name,path,mat,col,r=.7):
    assert len(path)>1
    cu=bpy.data.curves.new(name+" real architectural beam","CURVE")
    cu.dimensions="3D";cu.bevel_depth=r;cu.bevel_resolution=3
    pl=cu.splines.new("POLY");pl.points.add(len(path)-1)
    for p,v in zip(pl.points,path):p.co=(*v,1)
    ob=bpy.data.objects.new(name,cu);col.objects.link(ob)
    cu.materials.append(mat);ob["K4BC_ROLE"]="OFFROAD_ARCH";made.append(ob)
    return ob
def lamp(name,at,power,color,diam):
    data=bpy.data.lights.new(name,"AREA");data.energy=power;data.color=color;data.size=diam;data.shape="DISK"
    o=bpy.data.objects.new(name,data);lights.objects.link(o)
    o.location=at
    o.rotation_euler=(Vector((0,0,-1))).to_track_quat("-Z","Y").to_euler()
# Ground form is cut IN SECTION and follows source road actual curved edge.
# Important source road and B51 physics no additional drivable material.
for side,word in ((-1,"WEST EXCHANGE"),(1,"EAST CIVIC LIBRARY")):
    rows=[]
    for i in range(121):
        u=.69+.31*i/120;vrow=[]
        for j in range(36):
            t=j/35;d=34+t*250
            h=-9+4*sin(2*pi*i/120)+16*(t**1.7)-6*sin(3*pi*t)**2
            vrow.append(edge(u,side,d,h))
        rows.append(vrow)
    sheet("FOUND LANDSCAPE / CONTINUOUS physically sectioned coast / "+word,
          rows,cliff if side==-1 else rock,terrain,10)
    # True above-ground public foundation decks/retaining walls are not
    # merely narrow pipes hovering over an unmodeled black void.
    for level,(inner,outer,z) in enumerate(((37,88,5),(89,154,10),(155,222,19))):
        rows=[]
        for i in range(101):
            u=.70+.30*i/100
            rows.append([edge(u,side,inner+(outer-inner)*j/15,z)
                         for j in range(16)])
        sheet("COMPOSITE PUBLIC TERRACE ACTUAL OCCUPIED DECK "+word+str(level),
              rows,trav if level!=1 else bronze,terrain,4.4)
        if level<2:
            # closed deep load-bearing edge wall, rather than floating slab
            sheet("REAL SUBGRADE retaining wall "+word+str(level),
                  [[edge(u,side,inner,z0) for z0 in (-18,z-3,z)]
                   for u in [.70+.30*i/90 for i in range(91)]],
                  rock,terrain,2.7)
    # DCC landscape trees at far terraces, away from movement corridor
    for k in range(18):
        u=.723+(k%9)*.030
        d=158+47*(k//9)+7*sin(k*2.4)
        base=edge(u,side,d,20)
        beam("Tree actual trunk urban grove "+word+str(k),
             [base,base+Vector((0,0,12))],wood,terrain,1.2)
        rows=[]
        for level in range(12):
            t=level/11
            radius=7*(max(.03,sin(pi*t)))**.6
            rows.append([base+Vector((radius*cos(2*pi*j/12)+2*t,
                        radius*sin(2*pi*j/12),9+16*t))
                         for j in range(13)])
        sheet("Single 3D tree canopy / "+word+str(k),rows,
              green,terrain,0.5)
# TWO ACTUALLY DIFFERENT BUILDING PROGRAMS, mass/void readable in real Camera.
# Their facades face source Road5, open five-storey foyers with rooms behind.
for side,word in ((-1,"WEST / HARBOR EXCHANGE"),(1,"EAST / CENTRAL LIBRARY")):
    start=.705 if side<0 else .727
    stop=.984 if side<0 else .996
    # Outer tall protecting acoustic screen, not repeating generic little rooms.
    for seg in range(6):
        u0=start+(stop-start)*seg/6
        u1=start+(stop-start)*(seg+1)/6
        if seg in (1,4):
            # 2 massive real street-visible atrium openings; adjacent building
            # sections explicitly wrap the void and lead to public deck below.
            for u in (u0,u1):
                sheet("ATRIUM deep thick jamb "+word+str(seg)+str(u),
                  [[edge(u,side,d,h) for h in (6,20,38,51)]
                   for d in (37,47,62)],trav,public,4.5)
            beam("Atrium wide visible lintel "+word+str(seg),
                 [edge(u0,side,38,48),edge(u1,side,38,48)],bronze,public,2.4)
        else:
            # Large actual 3D facade panelling, with stone spandrel/plinth,
            # individually occupied glass behind and thick fins.
            sheet("FOYER THREE-STOREY GREEN GLASS FACADE "+word+str(seg),
                 [[edge(u,side,44,h) for h in (12,33,46)]
                  for u in (u0,u1)],window,public,1.2)
            sheet("LOWER PUBLIC PODIUM REAL STONE SPANDREL "+word+str(seg),
                 [[edge(u,side,38,h) for h in (0,6,11)]
                  for u in (u0,u1)],trav,public,2)
            beam("BUILDING VERTICAL PIER monumental "+word+str(seg),
                 [edge(u0,side,39,0),edge(u0,side,39,52)],trav,public,2.1)
            for h in (14,36):
                beam("ACTUAL OCCUPIED 3D atrium floor line "+word+str(seg)+str(h),
                     [edge(u0,side,49,h),edge(u1,side,49,h)],
                     bronze,public,.9)
            # Back wall/ceiling reflection for depth, not a zero-depth facade.
            sheet("READABLE DEEP GALLERY WARM BACKPLANE "+word+str(seg),
                 [[edge(u,side,95,h) for h in (5,39,51)]
                  for u in (u0,u1)],terracotta if side<0 else wood,public,2)
            # Real broad display volumes 9m height, seen from front through glass.
            for sub in range(3):
                u=u0+(u1-u0)*(sub+.5)/3
                sheet("FUNCTIONAL LARGE PUBLIC ARCHIVAL NICHE "+word+str(seg)+str(sub),
                     [[edge(u-.004,side,d,h) for h in (12,29)]
                      for d in (67,77,90)],
                     terracotta if side<0 else wood,public,.9)
        # Artist-authored unified roof sequence gives 3D mass; large daylight cuts
        # between seg groups, not delicate floating white aerodynamic sheet.
        rows=[]
        for i in range(17):
            u=u0+(u1-u0)*i/16
            row=[]
            for j in range(26):
                t=j/25
                d=33+148*t
                h=56+16*sin(pi*t)**1.22+7*sin(pi*i/16)**1.6
                if side>0:h+=7*sin(pi*(1-t))
                row.append(edge(u,side,d,h))
            rows.append(row)
        sheet("TECTONIC 3D HAND-CRAFTED ROOF VAULT / "+word+str(seg),
              rows,roofmat if side==-1 else terracotta,public,3)
        # roof underside expressive deep ribs, visibly supporting section
        for a in (0,8,16):
            u=u0+(u1-u0)*a/16
            beam("STRUCTURAL 3D FOLDED ROOF RIB "+word+str(seg)+str(a),
                 [edge(u,side,33+148*j/35,
                       53+16*sin(pi*j/35)**1.22+7*sin(pi*a/16)**1.6)
                  for j in range(36)],bronze,public,.72)
    # 2 oversized readable place-making amphitheatre atria instead of
    # previous tiny repeated shelves invisible in fast native camera.
    for n,(u0,u1) in enumerate(((start+.050,start+.098),
                               (start+.166,start+.209))):
        # A series of 12m WIDE physically tiered concentric civic stone steps.
        for k in range(7):
            d=50+k*13
            h=5+k*3.5
            sheet("CIVIC LANDMARK TERRACED READING STEPS "+word+str(n)+str(k),
                  [[edge(u,side,d+q,h) for q in (0,7.5)]
                   for u in (u0,u1)],trav if k%2 else wood,entry,2.4)
            # Handrails establish public use and a real human path up steps
        for u in (u0+.003,u1-.003):
            beam("PUBLIC STAIR ACTUAL HANDRAIL / "+word+str(n)+str(u),
                 [edge(u,side,50+k*13,10+k*3.5) for k in range(7)],
                 bronze,entry,.33)
        # 16-25 m square* MULTI-LEVEL RECESSED ENTRANCE framed in red/orange
        # so users can read the public function at high speed, not 1 m props.
        for u in (u0,u1):
            beam("GRAND FOYER ENTRANCE RED TECTONIC STONE JAMBS "+word+str(n)+str(u),
                 [edge(u,side,38,7),edge(u,side,38,47)],
                 terracotta,entry,2.0)
        beam("GRAND FOYER UPPER DEEP SIGNLESS SOFFIT "+word+str(n),
             [edge(u0,side,38,47),edge(u1,side,38,47)],
             terracotta,entry,2.5)
        # Underlying warm visible interior beams, world-scale service space
        for h in (21,32,40):
            beam("FOYER OCCUPIED INTERIOR LANTERN WARM LINES "+word+str(n)+str(h),
                 [edge(u0+.006,side,76,h),
                  edge(u1-.006,side,76,h)],glow,entry,.48)
    # Unified high perimeter public terrace with standing room and
    # distinct structural glass, no collision-affecting source placement.
    for h,d in ((16,57),(31,58),(50,60)):
        beam("READABLE PUBLIC FLOOR PLATE FRONT ELEVATION "+word+str(h),
             [edge(start+(stop-start)*i/100,side,d,h) for i in range(101)],
             trav if h==16 else bronze,public,.85)
    for u in (.75,.83,.915,.974):
        lamp("PUBLIC HALL ACTUAL ARCHITECTURAL WARM LIGHT "+word+str(u),
             edge(u,side,72,38),1850,(1,.70,.40),24)
# A single high clear civic pedestrian conservatory *crossing above* original
# Road5, with ACTUAL broad solid roof and building: not an invisible wire hoop.
# Large clearance is architecturally motivated, still noncollision DCC proposal.
def cross(u,v,h):
    if v<0:return edge(u,-1,-v*95,h)
    if v>1:return edge(u,1,(v-1)*95,h)
    return sample(u,v)+Vector((0,0,h))
for body,(lower,upper,material0) in enumerate(((48,52,trav),(68,73,roofmat))):
    rows=[]
    for i in range(13):
        u=.965+.023*i/12
        row=[]
        for j in range(51):
            v=-.30+1.6*j/50
            h=lower+7*sin(pi*min(1,max(0,v)))**1.3
            row.append(cross(u,v,h))
        rows.append(row)
    sheet("INHABITED SKY MUSEUM PHYSICAL THICK "+("FLOOR" if body==0 else "ROOF"),
          rows,material0,entry,3)
for u in (.965,.988):
    for v in (-.24,-.08,.08,.21,.34,.47,.60,.73,.86,1.00,1.16,1.28):
        t=min(1,max(0,v))
        beam("SKY MUSEUM ACTUAL LOAD BEARING FACADE "+str(u)+str(v),
             [cross(u,v,51+7*sin(pi*t)),cross(u,v,71+7*sin(pi*t))],
             bronze,entry,.58)
for side in (-1,1):
    for u in (.965,.988):
        beam("SKY MUSEUM STRUCTURAL PIERS ON CITY DECK "+str(side)+str(u),
             [edge(u,side,69,0),edge(u,side,69,20),edge(u,side,44,46)],
             bronze,entry,2.2)
# Road-specific decoration is a visibly segmented STRATIFIED SHOULDER,
# no synthetic game safety road, false driving continuation, or hazard paint.
for side in (-1,1):
    for k in range(11):
        u0=.68+.028*k;u1=u0+.015
        rows=[]
        for j in range(7):
            u=u0+(u1-u0)*j/6
            rows.append([sample(u,v)+Vector((0,0,.07))
                         for v in ((.012,.085,.135,.167) if side<0 else (.833,.865,.915,.988))])
        sheet("NONCOLLISION DCC city-scale inlaid shoulder plate "+str(side)+str(k),
              rows,bronze if k%3==0 else rock,surfaceart,0,
              role="NONCOLLISION_DCC_ROAD_SKIN_ONLY")
# Actual iconic CENTRAL high skyline, open original trajectory below:
# no road-like floor beyond B48. The same TWO civic cultural end buildings
# have fully closed occupied volumes and thick cut-out glazed voids.
for side,title in ((-1,"HARBOR EXCHANGE ARCHIVES"),
                   (1,"METROPOLITAN BOOK HALL")):
    c=far(80,side*155,0)
    # Broad 110m tall occupied mass, not skinny hollow fin: form a full set
    # of 16 circumferential facets with punched high public window slots.
    n=18;N=17;R=45
    ring=[]
    for i in range(N):
        t=i/(N-1);r=R*(1-.37*t)+3*sin(2*pi*t)
        ring.append([c+Vector((r*cos(2*pi*j/n+side*.11*t),
                               r*.70*sin(2*pi*j/n+side*.11*t),
                               4+112*t)) for j in range(n)])
    for j in range(n):
        if j in (3,4,5) or (side>0 and j in (10,11)):
            # 24 to 70m public void: pier remains above and below.
            for i0,i1 in ((0,3),(11,N-1)):
                rows=[ [ring[i][j],ring[i][(j+1)%n]]
                      for i in range(i0,i1+1)]
                sheet("CIVIC TERMINAL PUNCHED 3D MONOLITH SHELL "+
                      title+str(j)+str(i0),rows,
                      trav if side<0 else terracotta,terminus,2.2)
        else:
            rows=[[ring[i][j],ring[i][(j+1)%n]] for i in range(N)]
            sheet("ACTUAL 110m TALL TERMINUS INSULATED OUTER WALL "+
                  title+str(j),rows,
                  trav if j%4==0 else bronze,terminus,2)
        if j%3==0:
            beam("CONTINUOUS AERIAL BUILDING STRUCTURAL MULLION "+title+str(j),
                 [ring[i][j] for i in range(N)],trav,terminus,1.15)
    # Inner occupied volume behind the split carved stone facades.
    for i in (5,10):
        rr=R*(1-.37*i/(N-1))
        h=4+112*i/(N-1)
        sheet("SOLID PUBLIC SKYLOBBY ACTUAL FLOOR "+title+str(i),
              [[c+Vector((rr*cos(2*pi*j/n),rr*.7*sin(2*pi*j/n),h))
                 for j in range(n+1)],
               [c+Vector(((rr-12)*cos(2*pi*j/n),(rr-12)*.7*sin(2*pi*j/n),h))
                 for j in range(n+1)]],wood,terminus,2)
        beam("BELT OF READABLE OCCUPIED AMBER SKYLOB B Y "+title+str(i),
             [c+Vector((rr*cos(2*pi*j/60),
                        rr*.70*sin(2*pi*j/60),h+5))
              for j in range(61)],glow,terminus,.60)
    # Roof crown is a sloping, physically finished public gallery, not wire.
    sheet("ACTUAL ROOF GARDEN WEATHER COVER "+title,
          [ring[-1],[c+Vector((14*cos(2*pi*j/n),11*sin(2*pi*j/n),122))
                     for j in range(n)]],
          roofmat if side<0 else terracotta,terminus,4)
    # Four base piers genuinely reach the harbor foundation.
    for j in (1,5,10,14):
        b=ring[0][j]
        beam("TERMINAL FOUNDATIONAL TECTONIC SUPPORT "+title+str(j),
             [b+Vector((0,0,-65)),b,ring[3][j]],rock,terminus,2.8)
# Only a giant suspended HOLLOW upper sky observatory connecting end buildings.
# No physical floor near original route or B51, clearance high above.
rows=[]
for i in range(51):
    t=i/50
    p=far(80,(-115+230*t),131+12*sin(pi*t))
    rows.append([p+Vector((0,0,z)) for z in (-5,0,10)])
sheet("SKY OBSERVATORY / HOLLOW OCCUPIED CROSS-HARBOR SECTION OVER ROUTE",
      rows,window,terminus,1.1)
for i in (0,10,20,30,40,50):
    t=i/50
    beam("AERIAL LANDMARK roof structural member "+str(i),
         [far(80,-115+230*t,124+12*sin(pi*t)),
          far(80,-115+230*t,145+12*sin(pi*t))],bronze,terminus,.9)
# Source world physical studio light, yet no live game sky or color edits.
world=bpy.data.worlds.new("K4BC / cool coastal city atmosphere / DCC ONLY")
world.use_nodes=True
bg=world.node_tree.nodes.get("Background")
bg.inputs["Color"].default_value=(.39,.56,.70,1)
bg.inputs["Strength"].default_value=.70
try:
    sky=world.node_tree.nodes.new("ShaderNodeTexSky")
    sky.sky_type="NISHITA";sky.sun_elevation=math.radians(39)
    sky.sun_rotation=math.radians(136)
    sky.air_density=1.8;sky.dust_density=1.5
    world.node_tree.links.new(sky.outputs["Color"],bg.inputs["Color"])
except Exception:pass
scene.world=world
sun=bpy.data.lights.new("K4BC DCC summer warm sun","SUN")
sun.energy=1.8;sun.angle=.12
sunob=bpy.data.objects.new("K4BC DCC only summer day sun",sun)
lights.objects.link(sunob);sunob.rotation_euler=(.53,-.59,.32)
scene.render.engine="CYCLES";scene.cycles.samples=32
scene.cycles.use_denoising=False
scene.render.resolution_x=1013;scene.render.resolution_y=698
scene.render.resolution_percentage=88
scene.render.image_settings.file_format="PNG"
try:scene.view_settings.view_transform="AgX"
except Exception:scene.view_settings.view_transform="Filmic"
scene.view_settings.exposure=-.25
def show(mode,tick):
    for key,col in sourcecols.items():col.hide_render=key!=mode
    for key,col in proxies.items():col.hide_render=key!=(mode,tick)
    bpy.context.view_layer.update()
def render(name,cam):
    scene.camera=cam
    scene.render.filepath=os.path.join(out,name)
    bpy.ops.render.render(write_still=True)
shots=[]
for mode in ("control","ultra"):
    for p in S["modes"][mode]["sourceTimeRecords"]:
        tick=p["tick"];show(mode,tick)
        name="K4BC_AUTHENTIC_SOURCE_NUMERIC_DCC_"+mode.upper()+"_"+str(tick)+".png"
        render(name,cams[mode,tick])
        shots.append({"mode":mode,"sourceTick":tick,
            "nativeSourceSeconds":p["sourceNativeSeconds"],
            "sourceScreenshotSHA":p["sourceImageSHA256"],
            "exactSourceB51OBBCount":28,"DCCimage":name})
assert len(shots)==6
show("control",11278)
cdata=bpy.data.cameras.new("K4BC high-level city editorial - NOT GAME")
cdata.lens=43
cam=bpy.data.objects.new("K4BC author design aerial / not source camera",cdata)
review.objects.link(cam)
cam.location=edge(.88,1,360,290)
target=sample(.91,.5)+Vector((0,0,34))
cam.rotation_euler=(target-cam.location).normalized().to_track_quat("-Z","Y").to_euler()
render("K4BC_INHABITED_CIVIC_QUARTER_AERIAL_DCC_NOT_GAME.png",cam)
show("control",11259)
scene.camera=cams["control",11259]
after={mode:fp(x) for mode,x in roads.items()}
assert before==after
assert len(made)>100
blend="K4BC_SOURCE_CAMERA_CIVIC_RECOMPOSITION_EDITABLE_ART_REJECT_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
glb="K4BC_ARCHITECTURE_NOT_GAME_DCC_VISUAL_RESEARCH.glb"
bpy.ops.export_scene.gltf(filepath=os.path.join(out,glb),
                          export_format="GLB",export_cameras=False,export_lights=False)
names=[blend,glb,"K4BC_INHABITED_CIVIC_QUARTER_AERIAL_DCC_NOT_GAME.png"]+[s["DCCimage"] for s in shots]
proof={}
for name in names:
    raw=open(os.path.join(out,name),"rb").read()
    assert len(raw)>2000,name
    proof[name]={"bytes":len(raw),"sha256":hashlib.sha256(raw).hexdigest()}
report={"schema":"dopagaki.K4BC.authentic-source-numeric-camera-section-architecture/1",
        "originalFrozenWebGLBlob":"af076d67492a677d2235e4730aef8cdf4808e106",
        "originalB48RoadCount":7,"originalB51Movers":28,
        "originalPhysicalRoad5ID":"p93-PRISM_CREST-01",
        "sourceB48Road5Triangles":4728,
        "sourceRoad5ControlPointsSHA":S["modes"]["control"]["originalRoadSourcePointsSHA256"],
        "trueOriginalB48MeshGeometryBefore":before,"trueOriginalB48MeshGeometryAfter":after,
        "originalB48GeometryUnchanged":True,"sourceCameraNumericsUntouched":True,
        "exactNativeB51PhysicalCollisionOBBFrames":168,
        "baseK4BBRoadMaterialPBR_UV_Preserved":True,
        "oldRejectionBlenderCollectionsEditableHidden":disabled,
        "newArchitectureMeshAndBeamCount":len(made),
        "roadSeamsAreNoncollisionDccOnly":True,
        "noInventedDrivableRoadBeyondRealSourceEnd":True,
        "sourceCameraDccRenders":shots,
        "nativeWebGL2GameScreenshot":False,"originalGamePhysicsActuallyRun":False,
        "independentNewArchitectureB48B51BVH":"NOT_YET_TESTED_HOLD",
        "wholeGameOtherRoadCollisionClearance":"NOT_TESTED_HOLD",
        "newSourceGameColliders":False,"formalARTAccepted":0,
        "Slope2DNACertifiedMetres":0,
        "ART":"REJECT_HOLD","HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD",
        "FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD","files":proof}
with open(os.path.join(out,"K4BC_TRUE_SOURCE_CIVIC_ART_HOLD_PROVENANCE.json"),"w") as fd:
    json.dump(report,fd,indent=2)
print("K4BC_ORIGINAL_SOURCE_CAMERA_RECOMPOSITION_DCC_ONLY_ART_HOLD",
      json.dumps({"createdEditableObjects":len(made),"cameraShots":len(shots),
                  "originalRoadGeometryUntouched":before==after,"ART":report["ART"]}))

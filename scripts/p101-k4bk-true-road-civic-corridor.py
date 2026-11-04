"""K4BK — true-source Road5 measured civic roadscape, Blender-native DCC art only.

A complete architectural scene in real surveyed source-camera coordinates:
no fake wide d=550m layout or s=+/-170m roadside.  All original source
Road5 tessellation, source Camera poses and game code remain invariant.
This is an unapproved original art concept, not WebGL, collision, gameplay,
safety validation or formal ART acceptance. Individual materials and forms
remain independently editable in the genuine saved Blender .blend.
"""
import bpy,os,sys,json,hashlib,struct,math
from math import sin,cos,pi
from mathutils import Vector

argv=sys.argv[sys.argv.index("--")+1:]
def option(k):return os.path.abspath(argv[argv.index(k)+1])
parent=option("--base");output_dir=option("--out")
os.makedirs(output_dir,exist_ok=True)
def filehash(path):
    h=hashlib.sha256()
    with open(path,"rb") as f:
        for data in iter(lambda:f.read(1<<20),b""):h.update(data)
    return h.hexdigest()
PINNED="36d6508d431cb10c2f085707658af556a8a311fd12506567d0276bff8769081a"
assert filehash(parent)==PINNED
bpy.ops.wm.open_mainfile(filepath=parent)
scene=bpy.context.scene
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
cams={}
for mode,t in (("control",11307),("ultra",11341)):
    a=[x for x in rig.objects if x.type=="CAMERA" and str(t) in x.name]
    assert len(a)==1
    cams[mode]=a[0]
roadcollections={}
othercollections={}
road={}
for mode in ("control","ultra"):
    c=bpy.data.collections["K4AY SOURCE B48 | "+mode.upper()+" | TRUE TESSELLATED ROAD5"]
    assert len(c.objects)==1
    roadcollections[mode]=c
    road[mode]=next(iter(c.objects))
    othercollections[mode]=bpy.data.collections[
        "K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | "+mode.upper()]
    assert len(othercollections[mode].objects)==6
def fingerprint(obj):
    h=hashlib.sha256()
    for v in obj.data.vertices:
        h.update(struct.pack("<3d",*[float(a) for a in v.co]))
    for face in obj.data.polygons:
        h.update(struct.pack("<3i",*[int(i) for i in face.vertices]))
    return h.hexdigest()
geometry_before={m:fingerprint(x) for m,x in road.items()}
assert set(geometry_before.values())=={
    "f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"}
cameras_before={m:(tuple(x.location),tuple(x.rotation_euler),float(x.data.lens)) for m,x in cams.items()}
C=cams["control"].location.copy()
forward=cams["control"].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((forward.x,forward.y,0)).normalized()
R=Vector((-F.y,F.x,0))
def P(d,s,z):return C+F*d+R*s+Vector((0,0,z))
def ray(d,s):
    obj=road["control"]
    inv=obj.matrix_world.inverted()
    origin=inv@P(d,s,650)
    direction=(inv.to_3x3()@Vector((0,0,-1))).normalized()
    valid,point,normal,index=obj.ray_cast(origin,direction,distance=1800)
    if not valid:return None
    q=obj.matrix_world@point
    return (float(q.z-C.z),int(index))
def road_height(d,s):
    a=ray(d,s)
    if a is None:raise ValueError("No genuine B48 Road5 ground at "+str((d,s)))
    return a[0]

# Confirm real B48 road scale before designing anything. This is an actual
# mesh measurement, not visual reference guesses.
survey=[]
stations=[-25,0,25,50,75,100,125,150,170]
for distance in stations:
    xs=[float(v) for v in range(-75,102,2) if ray(distance,v) is not None]
    assert len(xs)>=25,(distance,"No source road cross section")
    lo,hi=min(xs),max(xs)
    assert -60<lo<-18 and 38<hi<100,(distance,lo,hi)
    survey.append({"d":distance,"roadLeft":lo,"roadRight":hi,
                   "roadCenterHeight":road_height(distance,0),
                   "roadLeftHeight":road_height(distance,lo+6),
                   "roadRightHeight":road_height(distance,hi-6),
                   "rayHits":len(xs)})
def interp(d,key):
    if d<=survey[0]["d"]:return survey[0][key]
    if d>=survey[-1]["d"]:return survey[-1][key]
    for a,b in zip(survey,survey[1:]):
        if a["d"]<=d<=b["d"]:
            t=(d-a["d"])/(b["d"]-a["d"])
            return a[key]*(1-t)+b[key]*t
    raise RuntimeError("Interpolation fail")
def road_l(d):return interp(d,"roadLeft")
def road_r(d):return interp(d,"roadRight")
def hleft(d):return interp(d,"roadLeftHeight")
def hright(d):return interp(d,"roadRightHeight")

# Original rejected architecture is retained but render-hidden.
hidden=[]
for c in bpy.data.collections:
    if c.name.startswith(("K4BJ |","K4BI |","K4BH |")):
        assert c is not rig and c not in roadcollections.values() and c not in othercollections.values()
        c.hide_render=True
        hidden.append(c.name)

def group(name):
    x=bpy.data.collections.new("K4BK | "+name)
    scene.collection.children.link(x)
    return x
west=group("01 WEST CERAMIC EXCHANGE | real B48 scale")
east=group("02 EAST HARBOR TERMINAL | real B48 scale")
corridor=group("03 NATIVE B48 EDGE + STONE LANDSCAPE")
canopy=group("04 SPANNING TIDAL ATRIUM | real d=145m")
far=group("05 DISTANT SCALED CITY + TERRACE")
lighting=group("06 DAYLIGHT + OCCUPIED ROOMS")
created=[]
def material(name,color,metal=.0,rough=.58,emission=0):
    m=bpy.data.materials.new("K4BK / "+name)
    m.use_nodes=True
    bs=m.node_tree.nodes.get("Principled BSDF")
    bs.inputs["Base Color"].default_value=(*color,1)
    bs.inputs["Metallic"].default_value=metal
    bs.inputs["Roughness"].default_value=rough
    if emission:
        bs.inputs["Emission Color"].default_value=(*color,1)
        bs.inputs["Emission Strength"].default_value=emission
    return m
chalk=material("ivory fired stone ceramic",(.56,.53,.43),.10,.47)
charcoal=material("deep charcoal articulated basalt",(.019,.030,.039),.16,.82)
black=material("physically recessed glass negative aperture",(.007,.015,.023),.14,.65)
bronze=material("hand-polished smoked titanium bronze",(.27,.21,.14),.69,.32)
steel=material("bead-blasted champagne steel",(.43,.47,.43),.65,.42)
green=material("weathered copper verdigris",(.045,.18,.17),.68,.51)
glass=material("panoramic blue-green transparent glazing",(.019,.112,.142),.39,.24)
warm=material("actually occupied amber library",(.79,.39,.16),.04,.46,1.2)
lamplit=material("warm linear architectural fixtures",(.96,.65,.35),.06,.30,1.7)
stripe=material("delicate sea-glass guidance line",(.06,.46,.51),.15,.36,.8)
terrace=material("limestone salt resistant public walkway",(.37,.33,.26),.04,.79)
plant=material("living coastal vegetation",(.065,.155,.093),.04,.90)
darkblue=material("dark sapphire civic cladding",(.035,.087,.127),.31,.57)
def mesh(name,vertices,faces,ma,col,role,smooth=False):
    data=bpy.data.meshes.new("K4BK | "+name+" editable surface")
    data.from_pydata([tuple(x) for x in vertices],[],faces)
    data.update(calc_edges=True)
    obj=bpy.data.objects.new("K4BK / "+name,data)
    col.objects.link(obj)
    obj.data.materials.append(ma)
    obj["DCC_RESEARCH_ONLY"]=True
    obj["NEW_GAME_COLLIDER"]=False
    obj["SOURCE_B48_B51_CLEARANCE"]="NOT_TESTED"
    obj["ART_JUDGEMENT"]="UNJUDGED"
    obj["BUILDING_FUNCTION"]=role
    for p in data.polygons:p.use_smooth=smooth
    created.append(obj)
    return obj
def loft(name,rows,ma,col,role,smooth=True):
    n=len(rows[0]);assert n>=3 and len(rows)>=2 and all(len(row)==n for row in rows)
    verts=[p for row in rows for p in row]
    faces=[(i*n+j,(i+1)*n+j,(i+1)*n+(j+1)%n,i*n+(j+1)%n)
           for i in range(len(rows)-1) for j in range(n)]
    faces.extend([tuple(range(n-1,-1,-1)),
                  tuple((len(rows)-1)*n+i for i in range(n))])
    return mesh(name,verts,faces,ma,col,role,smooth)
def solid(name,d0,d1,s0,s1,z0,z1,ma,col,role):
    return loft(name,[
        [P(d,s,z) for s,z in ((s0,z0),(s1,z0),(s1,z1),(s0,z1))]
        for d in (d0,d1)],ma,col,role,False)
def pipe(name,points,radius,ma,col,role,sides=8):
    pts=[Vector(v) for v in points]; assert len(pts)>=2
    rings=[]
    for i,q in enumerate(pts):
        direction=(pts[min(len(pts)-1,i+1)]-pts[max(0,i-1)]).normalized()
        ref=Vector((0,0,1))
        if abs(ref.dot(direction))>.87:ref=Vector((1,0,0))
        a=direction.cross(ref).normalized()
        b=direction.cross(a).normalized()
        rings.append([q+radius*(a*cos(2*pi*k/sides)+b*sin(2*pi*k/sides))
                      for k in range(sides)])
    return loft(name,rings,ma,col,role)

# Native Road5 mesh untouched; position-aware authored road shader.
# The previous thick centre stripes were visually crude. Replace with narrow
# purposeful three-lane markers, track edge, and high-end mineral surfacing.
def make_road_material():
    m=bpy.data.materials.new("K4BK / physically surveyed B48 asphalt shader DCC-only")
    m.use_nodes=True
    nodes=m.node_tree.nodes;nodes.clear()
    link=m.node_tree.links
    out=nodes.new("ShaderNodeOutputMaterial")
    bs=nodes.new("ShaderNodeBsdfPrincipled")
    bs.inputs["Roughness"].default_value=.77
    bs.inputs["Metallic"].default_value=.035
    link.new(bs.outputs["BSDF"],out.inputs["Surface"])
    ge=nodes.new("ShaderNodeNewGeometry")
    def mathnode(op,a=None,b=None):
        x=nodes.new("ShaderNodeMath");x.operation=op
        for i,v in enumerate((a,b)):
            if v is None:continue
            if isinstance(v,(int,float)):x.inputs[i].default_value=float(v)
            else:link.new(v,x.inputs[i])
        return x.outputs[0]
    def scalar_axis(vec):
        dot=nodes.new("ShaderNodeVectorMath");dot.operation="DOT_PRODUCT"
        link.new(ge.outputs["Position"],dot.inputs[0])
        dot.inputs[1].default_value=tuple(vec)
        return mathnode("SUBTRACT",dot.outputs["Value"],float(C.dot(vec)))
    X=scalar_axis(R);D=scalar_axis(F)
    noise=nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value=.27
    noise.inputs["Detail"].default_value=4.2
    noise.inputs["Roughness"].default_value=.72
    link.new(ge.outputs["Position"],noise.inputs["Vector"])
    ramp=nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position=.20
    ramp.color_ramp.elements[0].color=(.010,.018,.023,1)
    ramp.color_ramp.elements[-1].position=.82
    ramp.color_ramp.elements[-1].color=(.071,.075,.068,1)
    link.new(noise.outputs["Fac"],ramp.inputs["Fac"])
    col=ramp.outputs["Color"]
    def layer(color,mask):
        nonlocal col
        mix=nodes.new("ShaderNodeMixRGB");mix.blend_type="MIX"
        link.new(mask,mix.inputs[0]);link.new(col,mix.inputs[1])
        mix.inputs[2].default_value=(*color,1)
        col=mix.outputs["Color"]
    def widthline(offset,halfwidth):
        delta=mathnode("SUBTRACT",X,offset)
        return mathnode("LESS_THAN",mathnode("ABSOLUTE",delta),halfwidth)
    # Empirical left boundary -39m, right ~53..73m from source survey.
    # Guidance is DCC paint only, not safe lane or road width certification.
    lane_center=mathnode("ADD",6.5,mathnode("MULTIPLY",D,.060))
    for offset,color,width in (
            (-33,(.63,.67,.59),.28),
            (49,(.63,.68,.59),.38)):
        if offset>0:
            xx=mathnode("ADD",offset,mathnode("MULTIPLY",D,.085))
        else:xx=offset
        layer(color,widthline(xx,width))
    for shift in (-19,18):
        place=mathnode("ADD",lane_center,shift)
        where=widthline(place,.28)
        dash=mathnode("LESS_THAN",mathnode("MODULO",mathnode("ADD",D,7),18),7)
        layer((.71,.69,.55),mathnode("MULTIPLY",where,dash))
    layer((.55,.64,.61),widthline(lane_center,.25))
    # Fine aggregate bands and expansion joints, low visual strength.
    joint=mathnode("LESS_THAN",mathnode("MODULO",mathnode("ADD",D,11),37),.14)
    layer((.025,.030,.031),mathnode("MULTIPLY",joint,.35))
    link.new(col,bs.inputs["Base Color"])
    micro=nodes.new("ShaderNodeTexNoise")
    micro.inputs["Scale"].default_value=12
    micro.inputs["Detail"].default_value=3
    link.new(ge.outputs["Position"],micro.inputs["Vector"])
    bump=nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value=.14
    bump.inputs["Distance"].default_value=.006
    link.new(micro.outputs["Fac"],bump.inputs["Height"])
    link.new(bump.outputs["Normal"],bs.inputs["Normal"])
    return m
roadmaterial=make_road_material()
for obj in road.values():
    obj.data.materials.clear()
    obj.data.materials.append(roadmaterial)

# --- Site-true continuous offroad ledges, never built on a guessed +/-157m
# road edge.  For each d, place 9m *outside* measured B48 mesh bounds.
# Absolute art structures do NOT become colliders or pass clearance.
samples=list(range(-25,171,5))
leftside=[(d,road_l(d)-9,hleft(d)) for d in samples]
rightside=[(d,road_r(d)+9,hright(d)) for d in samples]
for side,values in (("WEST",leftside),("EAST",rightside)):
    sign=-1 if side=="WEST" else 1
    col=corridor
    rows=[]
    for d,s,z in values:
        rows.append([P(d,s,z-5),P(d,s+sign*16,z-10),
                     P(d,s+sign*17,z+3),P(d,s,z+2.1)])
    loft(side+" continuous measured roadside cut-stone retaining parapet",
         rows,terrace,col,"OFFROAD_PREMIUM_RETENTION_NOT_TESTED",False)
    # one long thin hand-finished seawater glass reveal follows ACTUAL
    # surveyed edge including 3D slope. No vehicle-scale hazard added to game.
    pipe(side+" surveyed source-edge teal wayfinding light",
         [P(d,s+sign*0.9,z+2.25) for d,s,z in values],
         .28,stripe,col,"SOURCE_FOLLOWING_DCC_INLAY_NO_COLLIDER")
    # Few physically anchored landscaped terraces, cut to long site gradient.
    for a,b in ((-18,16),(48,79),(104,140)):
        section=[(d,s,z) for d,s,z in values if a<=d<=b]
        shape=[[P(d,s+sign*5,z+1),P(d,s+sign*39,z-8),
                P(d,s+sign*40,z+2),P(d,s+sign*4,z+5)]
               for d,s,z in section]
        loft(side+" developed sea-facing public terraced garden "+str(a),
             shape,plant,col,"PEDESTRIAN_LANDSCAPED_ZONE_DCC_ONLY")
        # furniture scale: rail height genuinely 1.3m, not 40m toy tubes
        pipe(side+" planted terrace bronze handrail "+str(a),
             [P(d,s+sign*38,z+4.2) for d,s,z in section],
             .13,bronze,col,"HUMAN_SCALE_HARBOR_RAIL")
# --- Close-range architecturally authored WEST facade, not a kilometer away.
# Strong asymmetric roof section, three uniquely sized recesses, legible
# columns, glazed interior, real plaza. Height is SOURCE camera-relative.
leftstations=[(-38,43,71,11),(4,44,81,16),(31,47,92,34),
              (55,46,102,48),(88,45,109,39),(114,46,106,46),
              (145,46,110,43),(168,48,103,24)]
loft("WEST single sweeping basalt-and-ceramic station roof",
    [[P(d,-inner,hleft(d)+height+1),P(d,-outer,hleft(d)+height+3),
      P(d,-outer,hleft(d)+height+11),
      P(d,-(inner+21),hleft(d)+height+18),
      P(d,-inner,hleft(d)+height+12)]
     for d,inner,outer,height in leftstations],
     chalk,west,"FUNCTIONAL_CIVIC_LIBRARY_AND_TRANSIT_ROOF")
# Interior / large sculpted deep negative space with no wall of boxes
atriums=[(-21,16,6,28),(26,67,2,36),(90,148,8,39)]
for i,(a,b,lower,upper) in enumerate(atriums):
    s0=-51-2*i
    # Open dark interior bay and inset translucent span with glowing rooms
    zbase=(hleft(a)+hleft(b))/2
    solid("WEST dark-shadowed colonnade atrium "+str(i),a,b,s0,s0-3,
          zbase+lower-4,zbase+upper+7,black,west,"ACTUAL_MUSEUM_PUBLIC_OPENING")
    solid("WEST panoramic sapphire glass room "+str(i),a+3,b-3,s0-4,s0-7,
          zbase+lower+1,zbase+upper+1,glass,west,"GALLERY_AND_CAFE")
    solid("WEST warm human occupied interior "+str(i),a+5,b-5,s0-9,s0-10,
          zbase+lower+4,zbase+upper-4,warm,west,"REAL_INTERIOR_VISIBLE")
    solid("WEST ceramic deep casting canopy "+str(i),a-1,b+2,s0+4,s0-8,
          zbase+upper+8,zbase+upper+11,chalk,west,"SHADOW_CASTING_OVERHANG")
    for fraction in (.26,.72):
        dd=a+(b-a)*fraction
        pipe("WEST load-bearing slender bronzed mullion "+str(i)+"/"+str(fraction),
             [P(dd,s0+1,zbase+lower-7),P(dd,s0+1,zbase+upper+11)],
             .75,bronze,west,"HUMAN_SCALE_BRACED_FACADE")
    solid("WEST actual public walking balcony "+str(i),a,b,s0-8,s0-39,
          zbase+lower-5,zbase+lower-4,terrace,west,"PUBLIC_LIBRARY_TERRACE")
    pipe("WEST terrace continuous curtain rail "+str(i),
         [P(d,s0-35,zbase+lower-1.9) for d in range(a,b+1,3)],
         .22,bronze,west,"DCC_BALCONY_GUARD")
# Clear large diagonal public architecture expressing local slope
pipe("WEST singular 3D exposed diagonal flying buttress",
     [P(3,-39,hleft(3)-9),P(24,-43,hleft(24)+10),
      P(50,-59,hleft(50)+49),P(79,-76,hleft(79)+61),
      P(114,-76,hleft(114)+51)],
     3.4,chalk,west,"PUBLIC_STRUCTURE_SINGULAR_ARCHITECTURE")

# EAST is a different design: warm stone, glass terraces with a copper
# fan canopy; avoid making both sides copy-pasted towers.
righthalls=[(4,40,14,44),(49,99,8,53),(110,166,12,57)]
for i,(a,b,low,top) in enumerate(righthalls):
    h0=(hright(a)+hright(b))/2
    edge0=road_r((a+b)/2)+12
    off=edge0
    solid("EAST shadowed waterside ferry lounge "+str(i),a,b,off,off+5,
          h0+low,h0+top,black,east,"PUBLIC_HARBOR_PASSENGER_TERMINAL")
    solid("EAST deep glazed passenger lounge "+str(i),a+3,b-4,off+6,off+10,
          h0+low+3,h0+top-3,glass,east,"OCCUPIED_HARBOR_TERMINAL")
    solid("EAST inhabited warm ticket and seating hall "+str(i),a+5,b-7,off+12,off+16,
          h0+low+8,h0+top-8,warm,east,"FUNCTIONAL_TRANSIT_INTERIOR")
    # Sweeping copper sail thick roof with different station parameter,
    # not a thin ring and not a triangle floating in front of road.
    tvals=[0,.18,.45,.73,1]
    rows=[]
    for t in tvals:
        d=a+(b-a)*t
        edge_s=road_r(d)+8
        basez=hright(d)
        topz=basez+top+13+12*sin(pi*t)
        rows.append([P(d,edge_s,topz-19),
                     P(d,edge_s+44,topz-17),
                     P(d,edge_s+55,topz-7),
                     P(d,edge_s+24,topz+8),
                     P(d,edge_s-2,topz+4)])
    loft("EAST unique patinated-copper unfolded canopy "+str(i),
         rows,green,east,"PUBLIC_MARINE_STATION_SAIL_ROOF")
    box_a=a+4;box_b=b-4
    solid("EAST public harbor-side walkway "+str(i),box_a,box_b,off+17,off+58,
          h0+low-5,h0+low-3,terrace,east,"OUTDOOR_PASSENGER_TERRACE")
    pipe("EAST cantilevered terminal outline "+str(i),
         [P(d,road_r(d)+19,hright(d)+top+14+10*sin(pi*(d-a)/(b-a)))
          for d in range(a,b+1,3)],
         .67,steel,east,"ARCHITECTURAL_RIB")
# --- Road-scale landmark: one asymmetric aerial transit station physically
# situated on visible source road at d ~124-157m.  The high transverse
# open-span is set above source road (not safety cleared), not at d=550m.
d0,d1=152,169
floor_z=max(road_height(156,0),road_height(156,32))+20
# visually strong but not a monochrome solid: a suspended transparent public
# sky concourse that shades the road, with asymmetrical load structures.
skyrows=[]
for dd in (d0,d0+5,d0+11,d1):
    t=(dd-d0)/(d1-d0)
    z=floor_z+5*sin(pi*t)
    sl=road_l(dd)-8
    sr=road_r(dd)+11
    skyrows.append([P(dd,sl,z),P(dd,sr,z-1),
                    P(dd,sr+2,z+4),
                    P(dd,sl-4,z+7)])
loft("CENTER occupied blue-glass elevated skybridge not a hollow arch",
     skyrows,glass,canopy,"DISTINCTIVE_HARBOR_SKY_TRANSIT")
pipe("CENTER left machined champagne upper roof spar",
     [P(dd,road_l(dd)-12,floor_z+9+3*sin(pi*(dd-d0)/(d1-d0)))
      for dd in range(d0,d1+1,3)],1.55,chalk,canopy,"SCULPTURAL_CIVIC_ROOF_SPAR")
pipe("CENTER right contrasting bronze upper roof spar",
     [P(dd,road_r(dd)+14,floor_z+6+3*sin(pi*(dd-d0)/(d1-d0)))
      for dd in range(d0,d1+1,3)],1.65,bronze,canopy,"SCULPTURAL_CIVIC_ROOF_SPAR")
# NOT source road on which collision could happen—visible only in DCC.
for side,nm in ((-1,"WEST"),(1,"EAST")):
    dd=160
    base_s=road_l(dd)-17 if side<0 else road_r(dd)+19
    hbase=hleft(dd) if side<0 else hright(dd)
    pipe("CENTER "+nm+" external asymmetrical leg outside Road5",
         [P(dd-22,base_s+side*5,hbase-14),
          P(dd-15,base_s+side*6,hbase+19),
          P(dd-4,base_s+side*2,floor_z-4),
          P(dd+9,base_s+side*8,floor_z+3)],
         3.7,chalk if side<0 else bronze,canopy,
         "NOT_SAFE_FOR_GAME_COLLISION_ARCHITECTURE")
# Publicly legible tall vertical beacon behind main bridge, not a thin needle
beaconrows=[]
for j,z in enumerate([12,20,36,54,71,95,119]):
    d=180+2.5*sin(j*.7)
    s=road_r(170)+48+4*sin(j*.4)
    radius=9*(1-j*.075)
    beaconrows.append([P(d+radius*cos(2*pi*i/8),s+radius*sin(2*pi*i/8),
                          hright(170)+z) for i in range(8)])
loft("FAR single luminous inhabited seaward navigation pavilion",
     beaconrows,darkblue,far,"HARBOR_FUNCTIONAL_LANDMARK")
# deep, distinctive sea-facing remote terraces without massive block facade
for i,(a,b,s0) in enumerate([(160,186,115),(180,214,-125)]):
    z=hright(170) if s0>0 else hleft(170)
    # beyond Road5: skyline and architecture context only.
    solid("FAR marine archive layered civic platform "+str(i),
          a,b,s0,s0+(36 if s0>0 else -34),z-17,z-10,
          terrace,far,"DISTANT_CIVIC_BACKDROP")
    solid("FAR translucent occupied public observatory "+str(i),
          a+5,b-5,s0,s0+(18 if s0>0 else -18),z-10,z+19,
          glass,far,"INHABITED_CITY_FARFIELD")

# Camera-facing crafted civic facades. These are genuinely separated dark
# gallery apertures on the SURVEYED off-road boundary, not walls or billboard
# cards generated at arbitrary +/-170m. They expose the interior and use
# independent editable glass / structural elements.
for side,name,col,mat_struct in [
    (-1,"WEST READING ARCADES",west,bronze),
    (1,"EAST TRANSIT CONCOURSE",east,steel)]:
    bays=(
      [(-16,18,14,32),(25,68,9,39),(79,119,13,36),(125,165,7,33)]
      if side<0 else
      [(-7,30,10,35),(40,90,8,43),(102,146,12,37)]
    )
    for i,(start,end,zlower,ztop) in enumerate(bays):
        mid=(start+end)/2
        grounded=hleft(mid) if side<0 else hright(mid)
        inner=road_l(mid)-8 if side<0 else road_r(mid)+8
        outer=inner+side*8
        z0=grounded+zlower
        z1=grounded+ztop
        # The dark recessed void reads against brighter ceramic shell
        solid(name+" deep occupied foyer cavity "+str(i),start,end,
              inner,inner+side*1.4,z0,z1,black,col,"ACTUAL_CIVIC_RECESSED_FACADE")
        solid(name+" dark reflective curved glass face "+str(i),start+1,end-1,
              inner+side*1.8,inner+side*2.5,z0+2,z1-2,glass,col,
              "VISUALLY_LEGIBLE_GLAZED_PUBLIC_SPACE")
        solid(name+" distant warmer human room "+str(i),start+3,end-3,
              outer,outer+side*.9,z0+4,z1-4,warm,col,
              "OCCUPIED_INTERIOR_NOT_DUMMY_WINDOW")
        # Diagonal 3-D framing, deep-overhang and human-scale mullions
        pipe(name+" irregular continuous entrance canopy "+str(i),
             [P(start-1,inner-side*2,z1+4),
              P(mid,inner-side*3,z1+6+(4 if i%2 else 0)),
              P(end+2,inner+side*1,z1+3)],
             1.05,mat_struct,col,"SHADOW_CASTER_FACADE_DETAIL")
        for t in (.26,.72):
            dd=start+(end-start)*t
            pipe(name+" bronze and ceramic structural post "+str(i)+"/"+str(t),
                 [P(dd,inner-side*1,z0-3),P(dd,inner-side*1,z1+7)],
                 .59,mat_struct,col,"HUMAN_READABLE_STRUCTURE")
        if i in (0,2):
            # sheltered doorway and occupancy have real proportions
            solid(name+" exterior canopied visitor entrance "+str(i),
                  start+5,start+12,inner-side*1.7,inner+side*.4,
                  z0-5,z0+12,black,col,"FULL_HEIGHT_PUBLIC_ENTRANCE")
# Realistic parallax and human-scale material cadence along actual road line:
# NOT the existing oversized toy guardrails from the rejected previous study.
for side,name in [(-1,"WEST"),(1,"EAST")]:
    for d0 in (0,34,67,96,125,150):
        ss=(road_l(d0)-7 if side<0 else road_r(d0)+7)
        zz=(hleft(d0) if side<0 else hright(d0))
        solid(name+" machined coastal paving bracket "+str(d0),
              d0-1,d0+1,ss,ss+side*2,zz+.25,zz+1.5,
              charcoal,corridor,"GROUNDED_ARCHITECTURAL_DETAIL_NO_COLLIDER")

# Real-world-ish atmospheric lighting; no fake pictorial background.
world=scene.world
world.use_nodes=True
for n in world.node_tree.nodes:
    if n.type=="TEX_SKY":
        n.sky_type="NISHITA"
        n.sun_elevation=math.radians(16)
        n.sun_rotation=math.radians(238)
    if n.type=="BACKGROUND":n.inputs["Strength"].default_value=.43
for obj in bpy.data.objects:
    if obj.type=="LIGHT":obj.hide_render=True
def sunlamp(name,energy,euler,angle):
    data=bpy.data.lights.new("K4BK "+name,"SUN")
    data.energy=energy;data.angle=math.radians(angle)
    obj=bpy.data.objects.new("K4BK "+name,data);lighting.objects.link(obj)
    obj.rotation_euler=tuple(math.radians(t) for t in euler)
sunlamp("deliberate natural warm directional sunlight",3.0,(33,-26,145),8)
for label,d,side,basez in (
        ("west library",43,-70,hleft(43)+22),
        ("west atrium",120,-69,hleft(120)+24),
        ("east marina",65,96,hright(65)+28),
        ("east hall",144,105,hright(144)+32)):
    data=bpy.data.lights.new("K4BK "+label+" genuine interior light","AREA")
    data.energy=9000;data.color=(1,.73,.49)
    data.shape="RECTANGLE";data.size=18;data.size_y=10
    obj=bpy.data.objects.new("K4BK / "+label+" area light",data)
    lighting.objects.link(obj);obj.location=P(d,side,basez)
scene.render.engine="CYCLES"
scene.cycles.samples=48
try:scene.cycles.use_denoising=False
except Exception:pass
try:bpy.context.view_layer.cycles.use_denoising=False
except Exception:pass
scene.render.resolution_x=1200
scene.render.resolution_y=800
scene.render.resolution_percentage=100
scene.render.image_settings.file_format="PNG"
try:scene.view_settings.view_transform="Filmic"
except Exception:pass
try:scene.view_settings.look="Medium High Contrast"
except Exception:pass
scene.view_settings.exposure=-.56

assert geometry_before=={m:fingerprint(x) for m,x in road.items()}
assert cameras_before=={m:(tuple(x.location),tuple(x.rotation_euler),float(x.data.lens)) for m,x in cams.items()}
def show(mode):
    for m,c in roadcollections.items():c.hide_render=m!=mode
    for m,x in road.items():x.hide_render=False
    for m,c in othercollections.items():c.hide_render=m!=mode
    for c in bpy.data.collections:
        if "K4AY SOURCE B51 OBB PROXIES" in c.name:c.hide_render=True
    bpy.context.view_layer.update()
shots=[]
for mode,tick in (("control",11307),("ultra",11341)):
    show(mode)
    scene.camera=cams[mode]
    fn="K4BK_"+mode.upper()+"_"+str(tick)+"_SOURCE_CAMERA_GROUND_TRUTH_ART_UNJUDGED.png"
    scene.render.filepath=os.path.join(output_dir,fn)
    bpy.ops.render.render(write_still=True)
    shots.append({"mode":mode,"tick":tick,"file":fn})
show("control")
scene.camera=cams["control"]
blend="K4BK_GROUND_TRUTHED_CIVIC_ROADSIDE_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(output_dir,blend))
files={}
for fn in [blend]+[p["file"] for p in shots]:
    p=os.path.join(output_dir,fn)
    n=os.stat(p).st_size
    assert n>10_000
    files[fn]={"sha256":filehash(p),"bytes":n}
report={
  "schema":"dopagaki.K4BK.true-source-road-calibrated-civic-art/1",
  "parentK4BJNativeBlenderSHA256":PINNED,
  "frozenOriginalGameBlob":"af076d67492a677d2235e4730aef8cdf4808e106",
  "sourceRoad5FingerprintPreserved":geometry_before=={m:fingerprint(x) for m,x in road.items()},
  "originalSourceCameraNumericsPreserved":cameras_before=={m:(tuple(x.location),tuple(x.rotation_euler),float(x.data.lens)) for m,x in cams.items()},
  "originalB48Roads":7,"originalB51Movers":28,"physicsHz":240,"ballRadiusMetres":.65,
  "trueOriginalRoad5MeasuredSections":survey,
  "legacyUnacceptedDCCCollectionsHiddenNotDeleted":hidden,
  "newIndependentlyEditableBlenderObjects":len(created),
  "originalSourceCameraNativeBlenderImages":shots,
  "actualWebGL2GameplayCapture":False,
  "gameCodeEdited":False,"newNativeColliderCount":0,
  "B51Clearance":"NOT_TESTED_HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD",
  "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"slope2DNAacceptedMetres":0,
  "HUMAN":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
  "files":files
}
with open(os.path.join(output_dir,"K4BK_GROUND_TRUTHED_SOURCE_CAMERA_PROVENANCE.json"),"w") as f:
    json.dump(report,f,ensure_ascii=False,indent=2)
print("K4BK_REAL_GROUND_TRUTHED_BLENDER_TECH_ONLY_NOT_ART_PASS",
      json.dumps({"raycastSurvey":survey,"objects":len(created),
                  "sourceGeometryUnchanged":report["sourceRoad5FingerprintPreserved"]}))

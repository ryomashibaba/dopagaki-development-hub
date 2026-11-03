"""K4BH | ART-FIRST real-road/camera-anchored coastal civic corridor.

THIS IS A BLENDER-DCC STUDY, NOT A WEBGL2 GAME PATCH OR A NEW ROAD.
K4BG is formally ART REJECT. Replace its visible architecture, do not
increase its apparent quality score by pixel count, tests, or object count.
Everything from original game, original B48 geometry, original cameras and
all source B51 collision references is read only.
"""
import bpy, math, json, os, sys, struct, hashlib
from math import sin, cos, pi
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view
from collections import defaultdict

args=sys.argv[sys.argv.index("--")+1:]
def arg(k): return os.path.abspath(args[args.index(k)+1])
base,out=arg("--base"),arg("--out")
os.makedirs(out,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=base)
scene=bpy.context.scene
ORIGINAL="af076d67492a677d2235e4730aef8cdf4808e106"
FINGERPRINT="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
src={}; other={}; cams={}
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
for mode,tick in (("control",11307),("ultra",11341)):
    col=bpy.data.collections["K4AY SOURCE B48 | "+mode.upper()+" | TRUE TESSELLATED ROAD5"]
    assert len(col.objects)==1
    src[mode]=next(iter(col.objects))
    other[mode]=bpy.data.collections["K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | "+mode.upper()]
    assert len(other[mode].objects)==6
    found=[x for x in rig.objects if x.type=="CAMERA" and str(tick) in x.name]
    assert len(found)==1
    cams[mode]=found[0]
def fingerprint(o):
    h=hashlib.sha256()
    for v in o.data.vertices:
        h.update(struct.pack("<3d",*[float(t) for t in v.co]))
    for face in o.data.polygons:
        h.update(struct.pack("<3i",*[int(k) for k in face.vertices]))
    return h.hexdigest()
original_fp={m:fingerprint(o) for m,o in src.items()}
assert set(original_fp.values())=={FINGERPRINT}
original_cameras={m:(tuple(cams[m].location),tuple(cams[m].rotation_euler),cams[m].data.lens) for m in cams}
old_road_materials={m:tuple(x.name for x in o.data.materials) for m,o in src.items()}
assert all(old_road_materials.values())
# ART correction: an old K4BC/K4AX/K4BE bridge and repeated facades survived
# earlier prefix-only render masks, and obscured genuine new art. In this DCC
# comparison, render ONLY original physics B48 sources, the numeric Camera rig,
# and explicitly the new K4BH collections. Retain every old collection in the
# editable .blend and NEVER remove original source vertices or game markup.
hide_names=[]
source_collections={
    "05_CAMERA | Authentic original source poses",
    "K4AY SOURCE B48 | CONTROL | TRUE TESSELLATED ROAD5",
    "K4AY SOURCE B48 | ULTRA | TRUE TESSELLATED ROAD5",
    "K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | CONTROL",
    "K4BC v2 | TRUE ORIGINAL SOURCE OTHER SIX B48 | ULTRA",
}
for c in bpy.data.collections:
    if c.name not in source_collections:
        c.hide_render=True
        hide_names.append(c.name)
assert len(hide_names)>9
# The authentic parent BLEND intentionally has ULTRA source collection hidden
# when saved on CONTROL. show(mode) below restores it per frame.
assert not bpy.data.collections["K4AY SOURCE B48 | CONTROL | TRUE TESSELLATED ROAD5"].hide_render
assert all(n in bpy.data.collections for n in source_collections)

def coll(name):
    c=bpy.data.collections.new("K4BH | "+name)
    scene.collection.children.link(c)
    return c
foundation=coll("01 tectonic continuous structural coast")
architecture=coll("02 sculptural civic section and open galleries")
interior=coll("03 truly recessed public rooms")
landscape=coll("04 occupied terraces and wet gardens")
details=coll("05 tectonic joints, railing, architectural glazing")
horizon=coll("06 distant district and deliberately designed skyline")
fixtures=coll("07 physically grounded lighting")
candidate=[]
def mesh(name,verts,faces,mat,col,smooth=False):
    assert len(verts)>2 and faces
    obm=bpy.data.meshes.new("K4BH mesh "+name)
    obm.from_pydata([tuple(v) for v in verts],[],faces)
    obm.update(calc_edges=True)
    ob=bpy.data.objects.new("K4BH "+name,obm);col.objects.link(ob)
    obm.materials.append(mat)
    for face in obm.polygons:face.use_smooth=smooth
    ob["DCC_ONLY_NO_GAME_COLLIDER"]=True
    ob["ART_ACCEPTED"]=False
    candidate.append(ob)
    return ob
def swept(name,rows,mat,col,smooth=False):
    """Closed continuous manifold through real architectural sections."""
    N=len(rows[0])
    assert len(rows)>1 and N>=3 and all(len(x)==N for x in rows)
    verts=[v for row in rows for v in row];faces=[]
    for i in range(len(rows)-1):
        for j in range(N):
            k=(j+1)%N
            faces.append((i*N+j,(i+1)*N+j,(i+1)*N+k,i*N+k))
    faces += [tuple(range(N-1,-1,-1)),
              tuple((len(rows)-1)*N+j for j in range(N))]
    return mesh(name,verts,faces,mat,col,smooth)
def spline(name,points,material,col,radius=.25):
    curve=bpy.data.curves.new("K4BH 3D profile "+name,"CURVE")
    curve.dimensions="3D"
    curve.resolution_u=16
    curve.bevel_depth=radius
    curve.bevel_resolution=2
    spl=curve.splines.new("BEZIER")
    spl.bezier_points.add(len(points)-1)
    for p,xyz in zip(spl.bezier_points,points):
        p.co=tuple(xyz)
        p.handle_left_type="AUTO";p.handle_right_type="AUTO"
    ob=bpy.data.objects.new("K4BH "+name,curve);col.objects.link(ob)
    curve.materials.append(material)
    ob["DCC_ONLY_NO_GAME_COLLIDER"]=True
    candidate.append(ob)
    return ob
def material(name,color,metal=0,rough=.7,emit=0):
    m=bpy.data.materials.new("K4BH | "+name)
    m.diffuse_color=(*color,1)
    m.use_nodes=True
    p=m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value=(*color,1)
    p.inputs["Roughness"].default_value=rough
    p.inputs["Metallic"].default_value=metal
    if emit:
        p.inputs["Emission Color"].default_value=(*color,1)
        p.inputs["Emission Strength"].default_value=emit
    return m
dark_stone=material("wet basalt retaining stratum",(.048,.077,.081),rough=.84)
warm_stone=material("white honed shell limestone",(.46,.43,.355),rough=.74)
alabaster=material("sculpted porcelain ceramic fins",(.58,.56,.49),rough=.47)
bronze=material("marine anodised bronze structural ribs",(.31,.19,.115),metal=.78,rough=.37)
patina=material("salt-aged copper-green parapets",(.075,.29,.265),metal=.55,rough=.4)
glass=material("dark mirror blue-green facade",(.035,.13,.16),metal=.32,rough=.22)
lamp=material("inhabited warm gallery light",(.98,.47,.18),rough=.35,emit=2)
leaf=material("salt-tolerant habitat vegetation",(.095,.21,.14),rough=.91)

# Preserve the parent source-B48 material along with immutable source geometry.
# K4BH first experiment replaced the panelized K4BG road with an excessively
# white/speckled aggregate. That genuinely rendered image is ART REJECT.
# The revised DCC uses the superior existing source-road appearance, and
# transfers all visual effort to coherent new large-scale architecture.
assert all(tuple(m.name for m in src[k].data.materials)==old_road_materials[k]
           for k in ("control","ultra"))

# World coordinates derived from actual original source camera pose; altitude
# and offroad edge dynamically surveyed using the ORIGINAL source B48 vertices.
C=cams["control"].location.copy()
f=cams["control"].matrix_world.to_quaternion() @ Vector((0,0,-1))
F=Vector((f.x,f.y,0)).normalized()
R=Vector((-F.y,F.x,0)) # genuine road-left basis, not a new driving route
V=[v.co.copy() for v in src["control"].data.vertices]
proj=[]
for v in V:
    q=v-Vector((C.x,C.y,0))
    proj.append((q.dot(F),q.dot(R),v.z))
def road_top_at(d):
    near=sorted(proj,key=lambda p:abs(p[0]-d))
    return sorted(x[2] for x in near[:20])[10]
def outside(d,sign):
    band=[sign*s for t,s,z in proj if abs(t-d)<=17 and abs(z-road_top_at(d))<30]
    if len(band)<3: return 100.0
    return max(90.0,max(band)+22.0)
def P(d,s,z):
    return Vector((C.x,C.y,0))+F*d+R*s+Vector((0,0,z))
def pt(d,sign,offset,h):
    return P(d,sign*(outside(d,sign)+offset),road_top_at(d)+h)
# City-specific continuous structural ground: blended long sections with
# explicit OFFROAD footprint, no fake playable surfaces.
for sign,label,phase in [(-1,"LOWER HARBOR LIBRARY",.2),(1,"UPPER TIDAL CONSERVATORY",1.1)]:
    stations=list(range(-105,361,11))
    base=[]; roofs=[]; screen=[]; parapet=[]
    for d in stations:
        crest=68+11*sin(d*.017+phase)+7*cos(d*.033+phase)
        # Strong continuous cliff silhouette, not tiled boxes or thin sheets.
        base.append([pt(d,sign,27,-105),pt(d,sign,148,-105),
                     pt(d,sign,149,-9),pt(d,sign,111,13),
                     pt(d,sign,37,11)])
        roofs.append([pt(d,sign,22,crest-8),pt(d,sign,160,crest-7),
                      pt(d,sign,170,crest+3+7*sin(d*.018)),
                      pt(d,sign,145,crest+14),
                      pt(d,sign,17,crest+5)])
        screen.append([pt(d,sign,38,13),pt(d,sign,49,13),
                       pt(d,sign,49,crest-15),pt(d,sign,38,crest-15)])
        parapet.append([pt(d,sign,155,crest+9),pt(d,sign,166,crest+9),
                        pt(d,sign,168,crest+12),pt(d,sign,153,crest+12)])
    swept(label+" one-piece dressed heavy cliff foundations",base,dark_stone,foundation)
    swept(label+" flowing ceramic museum roof",roofs,alabaster,architecture,smooth=True)
    swept(label+" colonnade recessed glass behind stone",screen,glass,interior)
    swept(label+" oxidised upper promenade civic edge",parapet,patina,architecture)
    # Very large irregular stone arches cut the frontage visually. The
    # curving ROOF, differentiated opaque plinth and deeply recessed glass
    # read as nested real rooms; these arches are profiles, not cuboid facades.
    for k,(start,width) in enumerate([(-85,58),(-12,71),(84,96),(205,68)]):
        crown=62+12*sin(start*.016+phase)
        points=[]
        for i in range(19):
            t=i/18
            d=start+width*t
            z=road_top_at(d)+10+(crown-10)*(1-(2*t-1)**2)**.58
            points.append(P(d,sign*(outside(d,sign)+25),z))
        spline(label+" arched thick bronze mullion "+str(k),points,bronze,details,.72)
        # Ambient, occupied rooms set BACK from translucent glazing,
        # with warm amber interior frame and no fake playable corridors.
        for t in (.12,.50,.88):
            d=start+width*t
            h=27+13*sin(t*pi)
            spline(label+" deep interior door frame "+str(k)+"/"+str(t),
                   [pt(d-3,sign,51,h-9),pt(d-3,sign,51,h+9),
                    pt(d+3,sign,51,h+9),pt(d+3,sign,51,h-9)],
                   lamp,interior,.2)
    # Architecture follows the actual source edge and crest; organic
    # rain gardens are LARGE public strata, not decorative grass spam.
    for i,(start,end,height) in enumerate([(-60,21,9),(65,161,18),(211,319,24)]):
        rows=[]
        for d in range(start,end+1,7):
            rows.append([pt(d,sign,150,height-6),pt(d,sign,207,height-6),
                         pt(d,sign,210,height),pt(d,sign,147,height)])
        swept(label+" stepped inhabited rain garden "+str(i),rows,leaf,landscape)
        for d in range(start+8,end,22):
            # Physical-size rail/parapet, all far from the racing corridor.
            spline(label+" garden balustrade "+str(i)+"/"+str(d),
                   [pt(d,sign,146,height+1),pt(d+12,sign,146,height+1)],
                   bronze,details,.3)

# Signature split-ocean architecture: a monumental tectonic shell, open in
# center so the genuine B48 roadway and hazard sightline stay legible.
for sign,tag in [(-1,"LIBRARY EMBRACE"),(1,"CONSERVATORY WING")]:
    rows=[]
    for d in (178,194,211,232,253,269,286):
        swell=sin(pi*(d-178)/(286-178))
        h=89+28*swell+(10 if sign==-1 else -7)
        rows.append([pt(d,sign,23,h-19),pt(d,sign,113,h-10),
                     pt(d,sign,128,h+9),pt(d,sign,92,h+28),
                     pt(d,sign,17,h+8)])
    swept("MONUMENT "+tag+" deep carved structural arch",rows,warm_stone,architecture,smooth=True)
    spline("MONUMENT "+tag+" expressive bronze crown light seam",
           [pt(d,sign,104,119+24*sin(pi*(d-178)/108)) for d in range(178,287,9)],
           patina,details,.48)

# Future city beyond the main monument: distinct, non-repeated skyline
# silhouettes, including an asymmetric twisted museum tower and carved
# terraces on the horizon. DCC-only research; no sources modified.
def tapered_tower(name,d,s,ground,height,base_radius,material,twist):
    N=13;layers=23;vs=[];fs=[]
    for k in range(layers):
        t=k/(layers-1)
        radial=base_radius*(.93-.70*t)*(1+.07*sin(8*t))
        spin=twist*t+sin(t*pi)*.18
        center=P(d+13*sin(t*pi),s+9*sin(2*pi*t),ground+height*t)
        for i in range(N):
            a=2*pi*i/N+spin
            rr=radial*(.87+.12*cos(3*a+3*t))
            vs.append(center+F*(cos(a)*rr)+R*(sin(a)*rr))
    for k in range(layers-1):
        for i in range(N):
            x=k*N+i;y=k*N+(i+1)%N
            fs.append((x,y,y+N,x+N))
    fs.append(tuple(range(N-1,-1,-1)))
    fs.append(tuple((layers-1)*N+i for i in range(N)))
    return mesh(name,vs,fs,material,horizon,smooth=True)
for i,(d,s,height,radius,twist) in enumerate([
    (460,-140,185,34,1.3),(535,95,220,30,-.9),
    (640,-235,190,36,.7),(735,205,225,33,1.05),
    (840,-55,235,46,-1.2)
]):
    # Skyline ground grounded against a source road reference; no new roads.
    z=road_top_at(min(d,350))-120
    tapered_tower("distant asymmetrical civic skyline "+str(i),d,s,z,height,radius,
                  [warm_stone,bronze,dark_stone,patina,alabaster][i],twist)
# Atmospheric horizon without fake physical road, fake B51, or black emptiness.
world=scene.world
assert world is not None
world.use_nodes=True
wn=world.node_tree.nodes;wl=world.node_tree.links
bg=wn.get("Background")
sky=wn.new("ShaderNodeTexSky")
sky.sky_type="NISHITA"
sky.sun_elevation=math.radians(10)
sky.sun_rotation=math.radians(130)
sky.air_density=1.3;sky.dust_density=1.5;sky.ozone_density=1.0
wl.new(sky.outputs["Color"],bg.inputs["Color"])
bg.inputs["Strength"].default_value=.37
sun=bpy.data.lights.new("K4BH low-angle architectural daylight","SUN")
sun.energy=1.2;sun.angle=math.radians(12)
lampob=bpy.data.objects.new("K4BH sun",sun);fixtures.objects.link(lampob)
lampob.rotation_euler=(math.radians(28),math.radians(-24),math.radians(155))
scene.render.engine="CYCLES"
scene.cycles.samples=80
scene.cycles.use_denoising=False
scene.render.resolution_x=1013
scene.render.resolution_y=698
scene.render.resolution_percentage=88
scene.render.image_settings.file_format="PNG"
try:scene.view_settings.view_transform="AgX"
except Exception:pass
scene.view_settings.exposure=-.46

# Never confuse source CAMERA values with original WebGL2 game frames.
def show(mode):
    for m,o in src.items():
        c=bpy.data.collections["K4AY SOURCE B48 | "+m.upper()+" | TRUE TESSELLATED ROAD5"]
        c.hide_render=(m!=mode)
        o.hide_render=False
    for m,c in other.items():c.hide_render=(m!=mode)
    for c in bpy.data.collections:
        if c.name.startswith("K4AY SOURCE B51 OBB PROXIES"): c.hide_render=True
    bpy.context.view_layer.update()
def camera_checks():
    result={}
    for mode,cam in cams.items():
        spots=[]
        for d,s,h in ((160,-120,90),(220,120,115),(460,-140,230),(510,80,220),(800,-75,380)):
            co=P(d,s,h)
            proj2=world_to_camera_view(scene,cam,co)
            spots.append({"worldSample":[d,s,h],"uv":[round(proj2.x,4),round(proj2.y,4)],
                          "inFront":bool(proj2.z>0),
                          "inFrame":bool(proj2.z>0 and 0<proj2.x<1 and 0<proj2.y<1)})
        result[mode]=spots
    return result
checks=camera_checks()
after_fp={m:fingerprint(o) for m,o in src.items()}
assert after_fp==original_fp
assert len(candidate)>30
assert all(tuple(cams[m].location)==original_cameras[m][0] and
           tuple(cams[m].rotation_euler)==original_cameras[m][1] and
           cams[m].data.lens==original_cameras[m][2] for m in cams)
shots=[]
for mode,tick in (("control",11307),("ultra",11341)):
    show(mode)
    fn="K4BH_"+mode.upper()+"_"+str(tick)+"_SOURCE_DCC_ART_UNJUDGED.png"
    scene.camera=cams[mode]
    scene.render.filepath=os.path.join(out,fn)
    bpy.ops.render.render(write_still=True)
    shots.append({"mode":mode,"tick":tick,"file":fn})
show("control")
scene.camera=cams["control"]
blend="K4BH_ART_DIRECTED_CIVIC_CORRIDOR_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,blend))
hashes={}
for fn in [blend]+[s["file"] for s in shots]:
    data=open(os.path.join(out,fn),"rb").read()
    assert len(data)>4096
    hashes[fn]={"bytes":len(data),"sha256":hashlib.sha256(data).hexdigest()}
report={
    "schema":"dopagaki.K4BH.source-camera-art-directed-civic-corridor-v2/1",
    "parentArtifact":13274862071,
    "parentBlenderSHA256":"b665c84a88d719c4615638cfeb95ab5fe92a84a3a07d3ebe096dd540dd749b2f",
    "frozenOriginalSourceGameGitBlob":ORIGINAL,
    "B48Roads":7,"B51OriginalBodies":28,"sourcePhysicsHz":240,
    "originalBallRadiusM":.65,
    "road5OriginalGeometryFingerprintBefore":original_fp,
    "road5OriginalGeometryFingerprintAfter":after_fp,
    "sourceRoad5PhysicalGeometryUnchanged":original_fp==after_fp,
    "sourceCamerasNumericsUnchanged":True,
    "sourceRoad5MaterialsDCCOnlyChanged":False,
    "oldRoadMaterialNamesPreservedInReport":old_road_materials,
    "oldRejectedArtCollectionsRetainedHidden":hide_names,
    "editableDCCCandidateCount":len(candidate),
    "sourceCameraVisibilityProjections":checks,
    "sourceCameraRenderedTwoOfSix":shots,
    "nativeWebGL2Rendered":False,
    "newPhysicalGameRoadOrCollider":False,
    "realFullGameCCD":"HOLD","SAT":"HOLD","B48B51NewArchitectureBVH":"NOT_RUN",
    "HUMAN":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
    "ART":"UNJUDGED_HOLD","formalArtAccepted":0,"slope2DNARecognizedMetres":0,
    "files":hashes
}
with open(os.path.join(out,"K4BH_SOURCE_CAMERA_ART_PROVENANCE.json"),"w") as f:
    json.dump(report,f,indent=2,ensure_ascii=False)
print("K4BH_SOURCE_DCC_MESH_PROVENANCE_PASS_NOT_ART",
      json.dumps({"newEditables":len(candidate),"twoCameras":len(shots),
                  "sourceRoadsGeometryUnchanged":report["sourceRoad5PhysicalGeometryUnchanged"],
                  "art":report["ART"]}))

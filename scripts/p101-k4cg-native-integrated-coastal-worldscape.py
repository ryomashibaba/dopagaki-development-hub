"""K4CG: one coherent true-3D coastal worldscape.
Re-grade visible existing K4CF research rock as fractured limestone, build an
actual offshore escarpment and connected tidal-sea basin to give the whole
CHASE view geographic scale. Research DCC ONLY; original game/source/frozen
Road5/cameras/tress/lights/buildings/boat may never be modified. No fake image.
"""
import bpy,hashlib,json,math,struct,sys
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

args=sys.argv[sys.argv.index("--")+1:]
def arg(name): return Path(args[args.index(name)+1]).resolve()
parent=arg("--base");out=arg("--out");out.mkdir(parents=True,exist_ok=True)
PARENT="1a17dc522b4d7df85c92023df5b580f1e5fe155b27264dfcb9d7a511d99d8533"
GAME="af076d67492a677d2235e4730aef8cdf4808e106"
ROAD="f7c6091d5b6ca1498ac8bfc7808242ba05477d0a8c798cb41753c2e016ec58d2"
def sha(path):
 h=hashlib.sha256()
 with open(path,"rb") as f:
  for part in iter(lambda:f.read(1<<20),b""):h.update(part)
 return h.hexdigest()
assert sha(parent)==PARENT,("K4CG_INCORRECT_REAL_K4CF_PARENT",sha(parent))
bpy.ops.wm.open_mainfile(filepath=str(parent))
sc=bpy.context.scene
assert (sc.render.resolution_x,sc.render.resolution_y,sc.render.resolution_percentage)==(768,480,100)
rig=bpy.data.collections["05_CAMERA | Authentic original source poses"]
def poses():
 return {o.name:(tuple(o.location),tuple(o.rotation_euler),float(o.data.lens))
         for o in rig.objects if o.type=="CAMERA"}
locked_poses=poses()
assert len(locked_poses)>=6
chases=[o for o in bpy.data.objects if o.type=="CAMERA" and o.name.startswith("K4BP | EXPERIMENT CAMERA | CHASE_NARROW |")]
assert len(chases)==1 and sc.camera==chases[0]
cam=chases[0];chase_locked=(tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))
def project(p):
 q=world_to_camera_view(sc,cam,p)
 return (float(q.x),float(q.y),float(q.z))
def on_screen(p):return p[2]>0. and 0<=p[0]<=1. and 0<=p[1]<=1.
roads=[]
for mode in ("CONTROL","ULTRA"):
 col=bpy.data.collections["K4AY SOURCE B48 | "+mode+" | TRUE TESSELLATED ROAD5"]
 assert len(col.objects)==1
 roads.append(next(iter(col.objects)))
def roadsha(obj):
 h=hashlib.sha256()
 for v in obj.data.vertices:h.update(struct.pack("<3d",*[float(q) for q in v.co]))
 for p in obj.data.polygons:h.update(struct.pack("<3i",*[int(q) for q in p.vertices]))
 return h.hexdigest()
assert {roadsha(o) for o in roads}=={ROAD}
bad=bpy.data.objects.get("K4BY | actual source raycast 1m road surface | NO GAME COLLIDER")
good=bpy.data.objects.get("K4BQ / physically variegated 26m curved material research test")
assert bad and bad.hide_render and bad.get("NOT_GAME_COLLIDER") is True
assert good and not good.hide_render
tree_names=("K4BS | genuine CC0 scanned pine tree ","K4BV | TRUE WIND SHAPED CC0 COASTAL CANOPY",
            "K4CA | actual Poly Haven island_tree_02")
trees=[o for o in bpy.data.objects if o.name.startswith(tree_names)]
assert len(trees)==11
tree_state={o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}
lights={o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}
original={o.name:(bool(o.hide_render),bool(o.hide_viewport),tuple(tuple(row) for row in o.matrix_world),
                  len(o.data.vertices) if o.type=="MESH" else -1)
          for o in bpy.data.objects}
def fingerprint(obj):
 h=hashlib.sha256()
 for v in obj.data.vertices:h.update(struct.pack("<3d",*[float(k) for k in v.co]))
 for p in obj.data.polygons:
  h.update(struct.pack("<I",len(p.vertices)))
  for idx in p.vertices:h.update(struct.pack("<I",int(idx)))
 return h.hexdigest()
coast=bpy.data.objects.get("K4CF | warm layered cliff and wind-eroded headland A")
assert coast and coast.type=="MESH" and not coast.hide_render
assert coast.get("DCC_RESEARCH_ONLY") is True and coast.get("NOT_GAME_COLLIDER") is True
assert len(coast.data.vertices)==13426
coast_original_sha=fingerprint(coast)
sea=bpy.data.objects.get("K4CD | single coherent physical tidal water inlet")
assert sea and sea.type=="MESH" and not sea.hide_render and sea.get("NOT_GAME_COLLIDER") is True
sea_original_sha=fingerprint(sea)
sealevel=sum((sea.matrix_world@v.co).z for v in sea.data.vertices)/len(sea.data.vertices)
roof=[o for o in bpy.data.objects if o.name.startswith("K4BW | folded coastal museum and boat service canopy shell")]
piers=[o for o in bpy.data.objects if o.name.startswith("K4BW | galvanized slender structural pier")]
assert len(roof)==1 and len(piers) in (12,14)
rpts=[roof[0].matrix_world@v.co for v in roof[0].data.vertices]
basez=min((o.matrix_world@v.co).z for o in piers for v in o.data.vertices)
base=Vector((sum(p.x for p in rpts)/len(rpts),sum(p.y for p in rpts)/len(rpts),basez))
src_cam=[o for o in rig.objects if o.type=="CAMERA" and "11307" in o.name]
assert len(src_cam)==1
dir3=src_cam[0].matrix_world.to_quaternion()@Vector((0,0,-1))
F=Vector((dir3.x,dir3.y,0)).normalized()
S=Vector((-F.y,F.x,0))
def at(along,side,z=0.):return base+F*along+S*side+Vector((0,0,z))
sfront=min((-5.85,5.85),key=lambda q:(at(0,q)-cam.location).length)
sgn=1 if sfront>0 else -1
def point(u,t,z):return at(u,sfront+sgn*t,z)
coll=bpy.data.collections.new("K4CG | integrated real-world sea escarpment and coastal strata | ART HOLD")
sc.collection.children.link(coll)
created=[]
def addmesh(name,verts,faces,material,role,flat=False):
 me=bpy.data.meshes.new("K4CG | "+name)
 me.from_pydata([tuple(v) for v in verts],[],[tuple(f) for f in faces])
 me.update()
 obj=bpy.data.objects.new("K4CG | "+name,me)
 coll.objects.link(obj)
 me.materials.append(material)
 for poly in me.polygons:poly.use_smooth=not flat
 obj["DCC_RESEARCH_ONLY"]=True
 obj["NOT_GAME_COLLIDER"]=True
 obj["REAL_WORLDSCAPE_FUNCTION"]=role
 created.append(obj)
 return obj
def rockmat(label,colors,scale=.23,rough=.86):
 m=bpy.data.materials.new("K4CG | "+label)
 m.use_nodes=True
 ns=m.node_tree.nodes;ns.clear();ln=m.node_tree.links
 end=ns.new("ShaderNodeOutputMaterial")
 bs=ns.new("ShaderNodeBsdfPrincipled")
 bs.inputs["Roughness"].default_value=rough
 bs.inputs["Metallic"].default_value=0
 ln.new(bs.outputs["BSDF"],end.inputs["Surface"])
 geometry=ns.new("ShaderNodeNewGeometry")
 noise=ns.new("ShaderNodeTexNoise")
 noise.inputs["Scale"].default_value=scale
 noise.inputs["Detail"].default_value=5.
 noise.inputs["Roughness"].default_value=.71
 ln.new(geometry.outputs["Position"],noise.inputs["Vector"])
 ramp=ns.new("ShaderNodeValToRGB")
 ramp.color_ramp.elements.remove(ramp.color_ramp.elements[1])
 for i,(loc,col) in enumerate(colors):
  el=ramp.color_ramp.elements[0] if i==0 else ramp.color_ramp.elements.new(loc)
  el.position=loc;el.color=(*col,1.)
 ln.new(noise.outputs["Fac"],ramp.inputs["Fac"])
 ln.new(ramp.outputs["Color"],bs.inputs["Base Color"])
 grain=ns.new("ShaderNodeTexNoise")
 grain.inputs["Scale"].default_value=2.9
 grain.inputs["Detail"].default_value=3
 ln.new(geometry.outputs["Position"],grain.inputs["Vector"])
 bump=ns.new("ShaderNodeBump")
 bump.inputs["Strength"].default_value=.24
 bump.inputs["Distance"].default_value=.095
 ln.new(grain.outputs["Fac"],bump.inputs["Height"])
 ln.new(bump.outputs["Normal"],bs.inputs["Normal"])
 return m
natural=rockmat("warm grey maritime rock with eroded fissures",
                [(.13,(.17,.19,.19)),(.30,(.26,.28,.28)),
                 (.49,(.38,.39,.37)),(.67,(.47,.47,.43)),(.87,(.54,.52,.47))],.21)
islandmat=rockmat("muted distant offshore sandstone escarpment",
                 [(.12,(.11,.16,.18)),(.30,(.20,.26,.27)),
                  (.50,(.29,.34,.33)),(.70,(.37,.40,.37)),(.86,(.46,.46,.40))],.16)
watermat=rockmat("physically continuous tidal sea surface slate blue",
                [(.10,(.025,.070,.083)),(.35,(.045,.11,.127)),
                 (.60,(.105,.19,.201)),(.83,(.17,.255,.265))],.13,.27)
# Seam-free, true native editable duplicate of the existing parent left
# geological terrain. Former parent remains untouched and recoverable.
rock=coast.copy();rock.data=coast.data.copy()
rock.name="K4CG | physically fractured coastal grey limestone headland"
coll.objects.link(rock);created.append(rock)
rock["DCC_RESEARCH_ONLY"]=True;rock["NOT_GAME_COLLIDER"]=True
rock["REAL_WORLDSCAPE_FUNCTION"]="ONE_CONNECTED_LEFT_FOREGROUND_COASTAL_MASS"
rock.data.materials.clear();rock.data.materials.append(natural)
# Rework surface normals at actual mesh polygon scale, not via a drawn overlay.
# Natural faces are flatter near structural ridges while scree remains smooth.
flatcount=0
for poly in rock.data.polygons:
 if abs(poly.normal.z)<.67 and poly.area>0.055:
  poly.use_smooth=False
  flatcount+=1
coast.hide_render=True
assert not rock.hide_render and fingerprint(coast)==coast_original_sha
# Distant sea-facing capes: genuine 3D raised rock above *the same existing*
# parent maritime water level. Their position is selected using 3D world
# locations and the frozen source camera, not generated in pixel space.
def land_vertices(u0,t0,half_long,half_wide,height):
 vert=[]
 Nu=48;Nv=22
 for i in range(Nu+1):
  u=2*i/Nu-1
  for j in range(Nv+1):
   v=2*j/Nv-1
   a=max(0.,1-u*u)
   b=max(0.,1-v*v)
   ridge=(a**1.33)*(b**1.63)
   ridge*=.73+.16*math.sin(6.9*u+1.2*v)+.12*math.sin(11.8*u-7.2*v)
   fracture=.09*math.exp(-((v-.23-.09*math.sin(5*u))/.15)**2)*(a**1.4)
   h=max(0.,height*(ridge-fracture))
   h+=height*.025*math.sin(u*16.0+v*5.7)*a*b
   z=(sealevel-basez)-2.4+h
   vert.append(point(u0+u*half_long,t0+v*half_wide,z))
 return vert,Nu,Nv
def faces(Nu,Nv):
 q=[]
 for i in range(Nu):
  for j in range(Nv):
   a=i*(Nv+1)+j;b=(i+1)*(Nv+1)+j
   q.append((a,b,b+1,a+1))
 return q
# Search physical sea-world coordinates for a headland that fills the empty
# right horizon without ever entering the road's fixed screen region.
options=[]
for u0 in (120,170,240,320,420,520,680):
 for t0 in (-75,-105,-145,-190,-250,-320,-420,-530):
  for h in (25,40,58,72):
   for wid in (32,48,64):
    verts,nu,nv=land_vertices(u0,t0,82,wid,h)
    screens=[project(p) for p in verts[::13]]
    if not screens or not all(q[2]>0 for q in screens):continue
    xx=[q[0] for q in screens];yy=[q[1] for q in screens]
    xmin,xmax=min(xx),max(xx)
    ymin,ymax=min(yy),max(yy)
    if not (.55<xmin and xmax<.995 and .42<ymin and ymax<.88):continue
    span=(xmax-xmin)*(ymax-ymin)
    if span<.004 or span>.16:continue
    cx=(xmin+xmax)/2;cy=(ymin+ymax)/2
    score=abs(cx-.805)*2+abs(cy-.637)+abs(span-.038)*1.7 + .0001*u0
    options.append((score,u0,t0,h,wid,verts,(xmin,ymin,xmax,ymax)))
assert options,("K4CG_NO_GENUINE_OFFSHORE_ISLAND_OUTSIDE_ROAD_FOCAL_ZONE",
                "seaLevel",sealevel,"sourceForward",tuple(F))
options.sort(key=lambda k:k[0])
_,island_u,island_t,island_h,island_w,iv,screen_rect=options[0]
island=addmesh("one broad true offshore eroded peninsula with contoured ridge",
               iv,faces(48,22),islandmat,"REAL_WORLD_SCALE_OFFSHORE_LANDSCAPE",True)
# Extend the sea from the parent quay basin to the far landscape. Its 3D
# surface follows the SAME parent sea level and lives on the outer, ferry side
# of the actual road. No backdrop screens, no overlay and no camera changes.
su=70;sv=42
sea_v=[]
for i in range(su+1):
 u=-100.+850*i/su
 for j in range(sv+1):
  t=-29-620*j/sv
  h=-.085+.092*math.sin(.065*u+.15*t)*math.sin(.12*u-.09*t)
  h+=.032*math.sin(.31*u+.22*t)
  sea_v.append(point(u,t,sealevel-basez+h))
extended=addmesh("actual 3D world-scale connected offshore tidal water",
                 sea_v,faces(su,sv),watermat,
                 "REAL_COAST_TO_OFFSHORE_OCEAN_LEVEL_CONTINUITY",False)
# Geometric authoring is technically honest: no flat world-aligned billboard.
assert len(created)==3 and all(ob.get("NOT_GAME_COLLIDER") is True for ob in created)
assert original[coast.name][0] is False and coast.hide_render
assert fingerprint(coast)==coast_original_sha and fingerprint(sea)==sea_original_sha
assert poses()==locked_poses
assert (tuple(cam.location),tuple(cam.rotation_euler),float(cam.data.lens))==chase_locked
assert {roadsha(o) for o in roads}=={ROAD}
assert {o.name:tuple(tuple(row) for row in o.matrix_world) for o in trees}==tree_state
assert {o.name:(bool(o.hide_render),float(o.data.energy)) for o in bpy.data.objects if o.type=="LIGHT"}==lights
for name,state in original.items():
 obj=bpy.data.objects[name]
 if obj is coast:
  assert obj.hide_render and not state[0]
  assert (bool(obj.hide_viewport),tuple(tuple(row) for row in obj.matrix_world),
          len(obj.data.vertices))==state[1:]
 else:
  assert (bool(obj.hide_render),bool(obj.hide_viewport),
          tuple(tuple(row) for row in obj.matrix_world),
          len(obj.data.vertices) if obj.type=="MESH" else -1)==state,(name,"PARENT_OBJECT_MUTATED")
assert bad.hide_render and not good.hide_render
assert sha(parent)==PARENT
sc.camera=cam;sc.render.engine="BLENDER_EEVEE"
sc.render.resolution_x=768;sc.render.resolution_y=480;sc.render.resolution_percentage=100
sc.render.image_settings.file_format="PNG"
try:sc.eevee.taa_render_samples=8
except AttributeError:pass
blend=out/"K4CG_INTEGRATED_COASTAL_WORLD_GEOMETRY_EDITABLE_ART_HOLD.blend"
bpy.ops.wm.save_as_mainfile(filepath=str(blend))
png=out/"K4CG_TRUE_CHASE_INTEGRATED_COASTAL_WORLDSCAPE_NOT_GAME.png"
sc.render.filepath=str(png);bpy.ops.render.render(write_still=True)
assert blend.stat().st_size>230_000_000 and png.stat().st_size>30000
audit={
 "schema":"dopagaki.k4cg.real-integrated-coastal-worldscape/1",
 "parentK4CFR2ExactSHA256":PARENT,
 "originalGameGitBlob":GAME,"originalRoad5FullVertexFaceSHA256":ROAD,
 "originalSixCameraPosesUnchanged":True,"originalCHASEUnchanged":True,
 "originalElevenTreeTransformsUnchanged":True,"originalLightsUnchanged":True,
 "originalParentObjectsAndGeometryUnchanged":True,
 "parentResearchCliffHiddenOnlyInStudy":coast.name,
 "originalResearchCoastMeshFingerprint":coast_original_sha,
 "originalMaritimeSeaMeshFingerprint":sea_original_sha,
 "K4BZ_bad_duplicate_road_hidden":True,
 "sourceGameEdited":False,"sourcePhysicsEdited":False,"newGameColliders":0,
 "genuineResearchEditableNewObjectCount":len(created),
 "realForegroundFlatRockFacetCount":flatcount,
 "realOffshoreLandformWorldCentre":[island_u,island_t,island_h],
 "realOffshoreLandformScreenBoundsNotArtScore":[round(q,6) for q in screen_rect],
 "realOffshoreWorldMeshVertices":len(island.data.vertices),
 "realOceanExtensionWorldMeshVertices":len(extended.data.vertices),
 "trueParentSeaSurfaceWorldZ":sealevel,
 "genuine3DNoBillboard":True,"renderEngine":"BLENDER_EEVEE",
 "originalChase768x480":True,
 "ART":"UNJUDGED_HOLD","formalARTAccepted":0,"formalSlope2DNAMetres":0,
 "HUMAN":"HOLD","SAT":"HOLD","CCD":"HOLD","FPS":"HOLD","RELEASE":"HOLD","MERGE":"HOLD",
 "files":{p.name:{"bytes":p.stat().st_size,"sha256":sha(p)} for p in (blend,png)}
}
(out/"K4CG_REAL_NATIVE_AUDIT.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n")
print("K4CG_REAL_EDITABLE_WORLD_DCC_TRUE_CHASE_ART_HOLD",json.dumps({
 "island":audit["realOffshoreLandformWorldCentre"],
 "islandScreen":audit["realOffshoreLandformScreenBoundsNotArtScore"],
 "flatRockFacets":flatcount,"totalNewMeshes":len(created)}),flush=True)

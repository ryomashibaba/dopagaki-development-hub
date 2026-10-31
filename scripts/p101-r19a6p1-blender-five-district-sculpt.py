"""R19 A6 P1: actual Blender import/sculpt/export of five original A5 city objects.
PRIVATE visual study only. Original game roads, physics, camera, HUD unchanged.
"""
import bpy,sys,os,json,hashlib,math
from mathutils import Vector
from math import sin,cos,pi
def arg(k):
    a=sys.argv[sys.argv.index("--")+1:]
    return a[a.index(k)+1]
def sha(p):
    with open(p,"rb") as f:return hashlib.sha256(f.read()).hexdigest()
src,out,blend,rep,mode=(os.path.abspath(arg(k)) for k in ("--source","--output","--blend","--report"))+(arg("--mode"),)
assert mode in ("ultra","control")
os.makedirs(os.path.dirname(out),exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=src)
groups=sorted([x for x in bpy.context.scene.objects if x.type=="MESH"],key=lambda x:x.name)
assert len(groups)==5
def bounds(o):
    pts=[o.matrix_world@v.co for v in o.data.vertices]
    return (Vector(tuple(min(p[i] for p in pts) for i in range(3))),
            Vector(tuple(max(p[i] for p in pts) for i in range(3))))
original_faces=sum(len(o.data.polygons) for o in groups)
log=[]
for idx,obj in enumerate(groups):
    lo,hi=bounds(obj);mid=(lo+hi)*.5;hspan=max(hi.z-lo.z,1)
    wspan=max(hi.x-lo.x,hi.y-lo.y,1);inv=obj.matrix_world.inverted()
    displacements=[]
    for v in obj.data.vertices:
        p=obj.matrix_world@v.co;h=(p.z-lo.z)/hspan
        x,y=p.x-mid.x,p.y-mid.y
        phase=idx*1.27
        phi=.025*sin(pi*h+.65*phase);scale=1-.065*h
        target=Vector((mid.x+scale*(x*cos(phi)-y*sin(phi))+4.2*sin(2*pi*h+phase)*(1-h)*.6,
                       mid.y+scale*(x*sin(phi)+y*cos(phi))+3.2*cos(2*pi*h+phase)*(1-h)*.6,
                       p.z+2.2*sin((x/max(wspan,1))*4.1+phase)*sin(pi*h)))
        move=(target-p).length
        assert move<max(34,wspan*.10)
        displacements.append(move);v.co=inv@target
    attr=obj.data.color_attributes.active_color
    if attr:
        palette=[(.83,1,1),(.90,1,.95),(1,.94,.81),(.92,.93,1),(1,.96,.89)][idx]
        for item in attr.data:
            c=list(item.color)
            item.color=tuple(min(1,c[i]*palette[i]) for i in range(3))+(c[3],)
    log.append({"name":obj.name,"source_vertices":len(obj.data.vertices),
                "faces":len(obj.data.polygons),"max_offset_m":max(displacements)})
hero=groups[0];lo,hi=bounds(hero)
cx=(lo.x+hi.x)*.5;cy=(lo.y+hi.y)*.5
sx=max((hi.x-lo.x)*.42,24);sy=max((hi.y-lo.y)*.36,24)
hz=max(hi.z-lo.z,35)
verts=[];faces=[];N=40
for i in range(N+1):
    t=i/N;x=cx+sx*(t-.5)*1.5
    y=cy+sy*(.22*sin(2*pi*t)+.35*t-.18)
    z=lo.z+hz*(.21+.51*sin(pi*t)**1.4)+8*sin(3*pi*t)
    width=7+18*sin(pi*t)**2;depth=3.6+3.8*sin(pi*t)**2
    tang=Vector((sx*1.5,sy*(.44*pi*cos(2*pi*t)+.35),0)).normalized()
    across=Vector((-tang.y,tang.x,0));p=Vector((x,y,z))
    for dz,sd in ((0,-1),(0,1),(-depth,1),(-depth,-1)):
        verts.append(tuple(p+across*(sd*width*.5)+Vector((0,0,dz))))
    if i:
        k=4*(i-1)
        for side in range(4):
            j=(side+1)%4
            faces.append((k+side,k+j,k+4+j,k+4+side))
faces.extend([(3,2,1,0),tuple(4*N+k for k in range(4))])
mesh=bpy.data.meshes.new("P1 thick asymmetric sail")
mesh.from_pydata(verts,[],faces);mesh.update()
sail=bpy.data.objects.new("P1 sculpted civic sail",mesh)
bpy.context.collection.objects.link(sail)
layer=mesh.color_attributes.new(name="COLOR_0",type="FLOAT_COLOR",domain="CORNER")
for polygon in mesh.polygons:
    color=(.28,.65,.68,1) if polygon.index%5 else (.78,.74,.53,1)
    for loop in polygon.loop_indices:layer.data[loop].color=color
material=bpy.data.materials.new("P1 visual study metal-ceramic")
material.diffuse_color=(.30,.60,.65,1);material.metallic=.34;material.roughness=.47
mesh.materials.append(material)
bpy.ops.object.select_all(action='DESELECT')
hero.select_set(True);sail.select_set(True)
bpy.context.view_layer.objects.active=hero
bpy.ops.object.join()
after=sorted([x for x in bpy.context.scene.objects if x.type=="MESH"],key=lambda x:x.name)
assert len(after)==5
edited_faces=sum(len(o.data.polygons) for o in after)
assert edited_faces>original_faces+100
bpy.ops.wm.save_as_mainfile(filepath=blend)
bpy.ops.export_scene.gltf(filepath=out,export_format='GLB',use_selection=False)
assert os.path.getsize(out)>100000
report={"schema":"dopagaki.r19a6p1-blender-sculpt/1","mode":mode,
 "source_glb_sha256":sha(src),"edited_glb_sha256":sha(out),"blend_sha256":sha(blend),
 "blender":bpy.app.version_string,"editable_districts":len(after),
 "source_faces":original_faces,"edited_faces":edited_faces,
 "added_faces":edited_faces-original_faces,"districts":log,
 "ART":"HOLD","GAMEPLAY":"HOLD","HUMAN":"HOLD","PERFORMANCE":"HOLD",
 "real_source_ground_contact":"UNVERIFIED","new_colliders":0,"PBR_game":"NOT_IMPLEMENTED"}
with open(rep,"w",encoding="utf8") as f:json.dump(report,f,indent=2,ensure_ascii=False)
print("R19_A6P1_BLENDER_CITY",json.dumps(report,ensure_ascii=False))

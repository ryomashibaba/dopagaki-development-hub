"""R19 A6 P2: replace A5 box/portal skyline with a source-road-anchored
five-district bifurcated terraced city made INSIDE actual Blender.
Each new district remains a real editable mesh; every coordinate is derived
from the unchanged 7-B48/28-B51 W9-C1 original road sample.
No playable/colliding shapes, no new road. Never claim ART or terrain contact.
"""
import bpy,sys,os,json,hashlib,math
from mathutils import Vector
from math import sin,cos,pi
def arg(k):
    a=sys.argv[sys.argv.index("--")+1:]
    return a[a.index(k)+1]
def sha(p):
    with open(p,"rb") as f:return hashlib.sha256(f.read()).hexdigest()
src,out,blend,rep,anchor=[os.path.abspath(arg(k)) for k in ("--source","--output","--blend","--report","--anchors")]
mode=arg("--mode");assert mode in ("ultra","control")
os.makedirs(os.path.dirname(out),exist_ok=True)
geo=json.load(open(anchor,encoding="utf8"))
assert geo["mode"]==mode
assert geo["sourceBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
assert geo["roadCount"]==7 and geo["realB51"]==28 and geo["addedColliders"]==0
bpy.ops.object.select_all(action="SELECT");bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=src)
objects=sorted([o for o in bpy.context.scene.objects if o.type=="MESH"],key=lambda o:o.name)
assert len(objects)==5 and len(set(o.name for o in objects))==5
original_triangles=sum(len(o.data.polygons) for o in objects)
assert original_triangles==10566,"unexpected A5 true architecture source"
# glTF original (X,Y-up,Z) -> Blender (X,-Z,Y), preserving source geometry.
def bvec(web):
    return Vector((web[0],-web[2],web[1]))
def sample(road,u):
    v=max(0,min(80.0,u*80.0));i=min(79,int(v));t=v-i
    a=geo["roads"][road]["stations"][i]
    c=geo["roads"][road]["stations"][i+1]
    return {key:Vector(a[key]).lerp(Vector(c[key]),t) for key in ("center","left","right","forward")}
def roadframe(road,side,u):
    st=sample(road,u)
    center=st["center"];edge=st["left" if side<0 else "right"]
    outward=edge-center;outward.y=0
    forward=st["forward"];forward.y=0
    forward.normalize()
    outward-=forward*outward.dot(forward)
    outward.normalize()
    assert outward.length>.95
    return bvec(edge),bvec(outward),bvec(forward),bvec((0,1,0))
def colblend(a,b,t):
    return tuple(a[i]*(1-t)+b[i]*t for i in range(3))
# No broad overhead portal, square facade, painted-on void, fake road layer.
SITES=[
 # Two long, real-source road1 horizon districts on distinct sides:
 {"name":"SPLIT DELTA civic heart — roadside left", "road":1,"side":-1,"start":.04,"end":.95,
  "offset":48,"sway":21,"ribbons":4,"height":30,"rise":55,"warm":.0},
 {"name":"Road0 arrival habitat — lower left terraces","road":0,"side":-1,"start":.08,"end":.73,
  "offset":48,"sway":16,"ribbons":4,"height":17,"rise":34,"warm":.32},
 {"name":"Road0 narrow approach — recessed far-right skyline","road":0,"side":1,"start":.19,"end":.90,
  "offset":126,"sway":20,"ribbons":4,"height":15,"rise":48,"warm":.60},
 {"name":"Road1 elevated civic promenade — lower left","road":1,"side":-1,"start":.27,"end":.98,
  "offset":93,"sway":20,"ribbons":4,"height":48,"rise":47,"warm":.84},
 {"name":"Road1 tidal observation campus — right","road":1,"side":1,"start":.08,"end":.92,
  "offset":68,"sway":20,"ribbons":4,"height":25,"rise":72,"warm":.18}
]
assert len(SITES)==5
# Nonrepeated architectural material family, not the rejected pure-gray boxes.
PALETTE=[
 (.16,.41,.52),(.22,.53,.59),(.41,.66,.69),(.64,.68,.60),
 (.18,.32,.49),(.85,.66,.35),(.56,.79,.73),(.24,.50,.62)
]
counts=[];all_nominal_offsets=[]
for idx,(obj,site) in enumerate(zip(objects,SITES)):
    name=obj.name
    local_inv=obj.matrix_world.inverted()
    verts=[];faces=[];colors=[]
    def emit_face(indices,color):
        assert len(indices) in (3,4)
        faces.append(indices);colors.append(color)
    def loft(rings,facets,palette,phase=0):
        for j in range(len(rings)):
            assert len(rings[j])==facets
            for v in rings[j]:
                assert all(math.isfinite(float(x)) for x in v)
                verts.append(tuple(local_inv @ v))
        base=len(verts)-len(rings)*facets
        for j in range(len(rings)-1):
            for k in range(facets):
                a=base+j*facets+k;bb=base+j*facets+(k+1)%facets
                cc=base+(j+1)*facets+(k+1)%facets;d=base+(j+1)*facets+k
                emit_face((a,bb,cc,d),palette[(k+j//7+phase)%len(palette)])
        emit_face(tuple(base+k for k in reversed(range(facets))),palette[0])
        emit_face(tuple(base+(len(rings)-1)*facets+k for k in range(facets)),palette[-1])
    for ribbon in range(site["ribbons"]):
        rings=[]
        N=68
        for k in range(N+1):
            t=k/N
            u=site["start"]+(site["end"]-site["start"])*t
            edge,side,tangent,up=roadframe(site["road"],site["side"],u)
            phase=idx*.83+ribbon*.73
            sway=site["sway"]*sin(pi*t)*sin(2*pi*t+phase)
            out=site["offset"]+ribbon*23+sway+10*(t-.5)**2
            assert out>=40,"scenic city must be outward from actual B48 edge"
            all_nominal_offsets.append(out)
            # The skyline sweeps through a broad, hollow upper structure;
            # five layers of differing height create true open air volumes.
            height=site["height"]+ribbon*24+site["rise"]*(.36+.64*sin(pi*t)**1.4)
            height+=14*sin(2.4*pi*t+.32*idx+ribbon*.56)
            height-=9*(ribbon%2)
            width=17+9*sin(pi*t)**2+5*((idx+ribbon)%3)
            thickness=7+4*sin(2*pi*t+phase)**2
            center=edge+side*out+up*height+tangent*(3.8*sin(3*pi*t+phase))
            # Sculpted thick eight-sided architectural cross section.
            ring=[]
            for q in range(8):
                a=q*pi/4
                # Unlike a hollow wireframe, every wall has real 3D thickness.
                transverse=side*(width*.5*cos(a))
                vertical=up*(thickness*sin(a)+2.4*cos(2*a+phase))
                fore=tangent*(2.0*sin(a*2+phase))
                ring.append(center+transverse+vertical+fore)
            rings.append(ring)
        # One continuous expression per ribbon: no identical portals.
        local=[PALETTE[(idx+ribbon)%len(PALETTE)],
               PALETTE[(idx+ribbon+1)%len(PALETTE)],
               PALETTE[(idx+ribbon+2)%len(PALETTE)],
               PALETTE[5],PALETTE[6],PALETTE[(idx+ribbon+4)%len(PALETTE)],
               PALETTE[2],PALETTE[0]]
        loft(rings,8,local,idx+ribbon)
    # Three genuinely tapered, twisted vertical habitat cores,
    # attached to existing source-road longitudinal corridors.
    for spike in range(3):
        u=site["start"]+(site["end"]-site["start"])*(.22+.26*spike)
        edge,side,tangent,up=roadframe(site["road"],site["side"],u)
        outward=site["offset"]+72+spike*22
        all_nominal_offsets.append(outward)
        base=edge+side*outward+up*(site["height"]-24)
        rings=[]
        N=48
        for k in range(N+1):
            t=k/N
            center=base+up*(t*(118+idx*10+spike*19))
            center+=side*((7+idx)*sin(1.5*pi*t+idx*1.2)*t)
            center+=tangent*(18*sin(pi*t)**1.6)
            radius=17*(1-t)**1.5+2.3
            ring=[]
            for q in range(8):
                a=2*pi*q/8+t*1.8+idx*.28
                v=center+side*radius*cos(a)+tangent*radius*.62*sin(a)
                ring.append(v)
            rings.append(ring)
        loft(rings,8,[PALETTE[(idx+2)%8],PALETTE[0],PALETTE[6],PALETTE[5]],spike)
    mesh=bpy.data.meshes.new("P2 true curved urban fabric - "+str(idx+1))
    mesh.from_pydata(verts,[],faces);mesh.update()
    assert len(mesh.polygons)>=2100
    # Per-face corner color is REAL glTF COLOR_0, not postprocess fake scenery.
    layer=mesh.color_attributes.new(name="COLOR_0",type="FLOAT_COLOR",domain="CORNER")
    for poly,c in zip(mesh.polygons,colors):
        rgba=(*c,1.)
        for loop in poly.loop_indices:layer.data[loop].color=rgba
    old=obj.data;obj.data=mesh
    if old.users==0:bpy.data.meshes.remove(old)
    # Export glTF keeps the original five object source IDs.
    mat=bpy.data.materials.new("P2 design-only ceramic titanium / deep glass "+str(idx))
    mat.diffuse_color=(*PALETTE[(idx+1)%len(PALETTE)],1)
    mat.metallic=.28;mat.roughness=.5
    mesh.materials.append(mat)
    obj.name=name
    counts.append({"district":name,"road":site["road"],"side":site["side"],
       "station_span":[site["start"],site["end"]],"faces":len(mesh.polygons),
       "true_ribbon_count":site["ribbons"],"twisted_building_cores":3,
       "nominal_outboard_min_m":min(all_nominal_offsets)})
assert len([x for x in bpy.context.scene.objects if x.type=="MESH"])==5
edited=sum(len(o.data.polygons) for o in objects)
assert 10566<edited<45000
assert min(all_nominal_offsets)>=40
bpy.ops.wm.save_as_mainfile(filepath=blend)
bpy.ops.export_scene.gltf(filepath=out,export_format="GLB",use_selection=False)
assert os.stat(out).st_size>100_000
report={"schema":"dopagaki.r19a6p2-source-road-anchored-spatial-redesign/1",
 "mode":mode,"source_glb_sha256":sha(src),"edited_glb_sha256":sha(out),
 "blend_sha256":sha(blend),"source_anchors_sha256":sha(anchor),
 "blender":bpy.app.version_string,"editable_districts":5,
 "source_faces":original_triangles,"edited_faces":edited,
 "added_faces":edited-original_triangles,"districts":counts,
 "min_local_nominal_outboard_m":min(all_nominal_offsets),
 "globalB48B51ClearanceVerified":False,
 "actualTerrainContactVerified":False,"new_colliders":0,
 "ART":"HOLD","HUMAN":"HOLD","GAMEPLAY":"HOLD","PERFORMANCE":"HOLD",
 "PBR_game":"NOT_IMPLEMENTED","humanArchitecturalAccess":"NOT_VERIFIED"}
with open(rep,"w",encoding="utf8") as f:json.dump(report,f,indent=2,ensure_ascii=False)
print("R19_A6P2_ACTUAL_SOURCE_ROAD_DESIGNED_BLENDER_CITY",json.dumps(report,ensure_ascii=False))

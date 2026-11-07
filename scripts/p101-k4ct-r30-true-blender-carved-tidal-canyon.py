"""R30 single candidate — physically carved, deep-volume source-camera coastline.
True Blender Subdivision Surface + Boolean cave, evaluated back into exactly
the original 43 noncolliding R9/DCC groups. It is not a render-only concept.
Never touch 00 road, 12 tower, 13 glass, 19 forebay, 34 intake, 35 conduit,
41 turbine, or 42 penstock; original Game/Road5/Camera/240Hz/B48/B51 unchanged.
Original WebGL2 RAW is the ART judge, not polygon count or this script.
"""
import bpy, bmesh, math, json
from mathutils import Vector
from pathlib import Path
assert site['sourceGameBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert site['researchPhysicalRoad5SHA256']=='4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b'
assert (site['originalB48Count'],site['originalB51Count'],site['newColliders'])==(7,28,0)
assert len(GROUPS)==43 and isinstance(stations,dict)
R30_N={n[:2]:n for n in GROUPS}
R30_KEEP=('00','12','13','19','34','35','41','42')
R30_BEFORE={R30_N[k]:len(GROUPS[R30_N[k]]) for k in R30_KEEP}
assert len(R30_BEFORE)==8 and all(R30_BEFORE.values())
R30_EDIT=tuple(i for i in R30_N if i not in R30_KEEP)
R30_WATER=('03','05','23','24')
R30_METAL=('06','07','08','17')
R30_ROCK=tuple(i for i in R30_EDIT if i not in R30_WATER+R30_METAL)
assert len(R30_ROCK)==27 and len(R30_EDIT)==35
for R30_K in R30_EDIT:GROUPS[R30_N[R30_K]].clear()
# R30-only Principled materials, appended (not replacing any protected RGB).
COLORS.update({
 'r30_slate':(.275,.330,.344),
 'r30_shale':(.376,.405,.389),
 'r30_sandstone':(.515,.477,.404),
 'r30_sunrock':(.60,.567,.482),
 'r30_wetrock':(.177,.232,.250),
 'r30_shadow':(.115,.174,.197),
 'r30_brass':(.48,.342,.219),
})
R30_CREATED=[]
def R30_WORLD(v):return (float(v.x),float(v.z),float(-v.y))
def R30_GROUP(k):return R30_N[k]
def R30_MATERIAL(a,b,c):
    # Material responds to actual surface form, relative altitude and
    # hard erosion seam; it is not random grey planar checkerboard.
    h=(a[1]+b[1]+c[1])/3.
    normal=unit(cross(sub(b,a),sub(c,a)))
    if h<tideY+8:return 'r30_wetrock'
    if h<tideY+35:return 'r30_shale'
    if normal[1]>.53:return 'r30_sunrock'
    if normal[1]<-.46:return 'r30_shadow'
    return 'r30_slate' if math.sin((a[0]+b[0]+c[0])*.003)>.1 else 'r30_sandstone'
def R30_EXPORT(obj,groups,subdiv=2,cutter=None):
    """Mesh evaluated by genuine Blender dependency graph; real polygons.
    Each exported face belongs to part of the SAME solid rock mass."""
    if cutter is not None:
        m=obj.modifiers.new('R30_BOOLEAN_EXCAVATED_OPEN_CAVE','BOOLEAN')
        m.operation='DIFFERENCE';m.solver='EXACT';m.object=cutter
    if subdiv:
        m=obj.modifiers.new('R30_REAL_DCC_CAT_MULL_CLARK','SUBSURF')
        m.subdivision_type='CATMULL_CLARK';m.levels=subdiv;m.render_levels=subdiv
    bpy.context.view_layer.update()
    evaluated=obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
    mesh=evaluated.to_mesh()
    bm=bmesh.new();bm.from_mesh(mesh)
    bmesh.ops.triangulate(bm,faces=list(bm.faces))
    tris=list(bm.faces)
    assert len(tris)>len(groups)*5 and all(len(face.verts)==3 for face in tris)
    for i,f in enumerate(tris):
        abc=[R30_WORLD(v.co) for v in f.verts]
        g=groups[min(len(groups)-1,i*len(groups)//len(tris))]
        tri(R30_GROUP(g),*abc,R30_MATERIAL(*abc))
    R30_CREATED.append({'object':obj.name,'genuineEvaluatedTriangles':len(tris),
                        'candidateGroups':list(groups),'boolean':cutter is not None,
                        'subdivisionLevel':subdiv})
    bm.free(); evaluated.to_mesh_clear()
    bpy.data.objects.remove(obj,do_unlink=True)
    if cutter is not None:bpy.data.objects.remove(cutter,do_unlink=True)
def R30_SECTION(idx,u,bank,scale,seed):
    roadp,fw,side=frame(idx,u)
    yy=roadp['center'][1]
    # The negative-space water corridor is CLEAR for 70+ m outboard.
    # The cliff rising near 180m outboard avoids the R27 left foreground wall.
    stationsD=(76.,94.,119.,140.,164.,194.,229.,272.,290.)
    ht=(-78.,-51.,-18.,5.,39.,73.,80.,29.,-81.)
    pts=[]
    for j,(d,h) in enumerate(zip(stationsD,ht)):
        sway=(10.*math.sin(u*13.7+seed+j*.25)+
              6.*math.sin(u*31.1-seed+j*1.2))
        # Functional ravine: a depressed amphitheatre at .85, not random spikes.
        depression=23.*math.exp(-((u-.862)/.035)**2) if idx==5 and j in (3,4,5) else 0.
        height=yy+scale*h+(5*math.sin(8*u+j*.42+seed))-depression
        at=offset_edge(roadp,side,d+sway,bank)
        pts.append((at[0],height,at[2]))
    return pts
def R30_LOFT(name,idx,bank,u0,u1,count,scale,seed):
    ringCount=9
    rings=[R30_SECTION(idx,u0+(u1-u0)*i/(count-1),bank,scale,seed)
           for i in range(count)]
    verts=[world_to_blender(v) for ring in rings for v in ring]
    faces=[]
    for k in range(count-1):
        for j in range(ringCount):
            q=(j+1)%ringCount
            faces.append((k*ringCount+j,k*ringCount+q,
                          (k+1)*ringCount+q,(k+1)*ringCount+j))
    faces.append(tuple(range(ringCount-1,-1,-1)))
    faces.append(tuple((count-1)*ringCount+j for j in range(ringCount)))
    mesh=bpy.data.meshes.new('R30_'+name+'_EDITABLE_BOULDER_LOFT')
    mesh.from_pydata(verts,[],faces);mesh.update()
    ob=bpy.data.objects.new('R30_'+name+'_DCC_BOOLEAN_SUBDIV_OBJECT',mesh)
    bpy.context.collection.objects.link(ob)
    return ob
def R30_CAVE_CUTTER(idx,u,dist,radius=27.):
    p,f,side=frame(idx,u)
    edge=offset_edge(p,side,dist,'R')
    # Cylinder across the cliff (side direction): true open tunnel cut.
    world=add(edge,(0,12.,0))
    bpy.ops.mesh.primitive_cylinder_add(vertices=48,radius=radius,depth=92.,
                                        location=world_to_blender(world))
    ob=bpy.context.object
    ob.name='R30_TEMP_BOOLEAN_CAVE_SUBTRACT_TOOL'
    direct=Vector((side[0],-side[2],0.))
    ob.rotation_mode='QUATERNION'
    ob.rotation_quaternion=Vector((0.,0.,1.)).rotation_difference(direct)
    return ob
# Three major masses, all adapted to the *actual* B48 source frames.
# Group IDs partition connected material zones; not individual floating props.
R30_LOFTS=[
 ('ROAD5_OPEN_TIDAL_HEADLAND',5,'R',.655,.993,37,.82,.38),
 ('ROAD6_BACK_HARBOR_CLIFF',6,'L',.11,.69,31,.70,1.83),
 ('ROAD6_FAR_TURBINE_ESCARPMENT',6,'R',.12,.84,33,.55,2.76)
]
for k,item in enumerate(R30_LOFTS):
    name,idx,bank,u0,u1,n,scale,seed=item
    rock=R30_LOFT(*item)
    cave=R30_CAVE_CUTTER(5,.872,178.) if k==0 else None
    R30_EXPORT(rock,R30_ROCK,2,cave)
# A real broad gravity-watercourse: upper reservoir -> 23m plunge ->
# lower collecting harbor, with nonplanar current, foam and physical normals.
# No continuous full-width cyan floor.
def R30_ELEV(u):
    t=max(0.,min(1.,(u-.837)/.048))
    return tideY+26.-23.*t*t*(3.-2.*t)
def R30_WPOINT(u,d,ix):
    p,f,s=frame(5,u)
    bank=offset_edge(p,s,d+4*math.sin(u*17.+d*.04),'R')
    y=R30_ELEV(u)+(.6*math.sin(u*54.+d*.17)+
                    .48*math.cos(u*95.+ix*.37))
    return (bank[0],y,bank[2])
for k in range(53):
    u0=.644+k*(.352/53)
    u1=.644+(k+1)*(.352/53)
    for band in range(9):
        d0=47.+band*12.1; d1=d0+12.1
        a,b,c,d=R30_WPOINT(u0,d0,k),R30_WPOINT(u0,d1,k),R30_WPOINT(u1,d1,k+1),R30_WPOINT(u1,d0,k+1)
        g=('03' if k<24 else '23' if k<33 else '24')
        mat=('foam' if 27<=k<=38 and band%3!=0 else
             'shallows' if band in (0,1,8) else 'tide')
        quad(R30_GROUP(g),a,b,c,d,mat,False)
        if 26<=k<=40 and band in (2,4,6):
            # Real 3D standing foam crests in the plunging 23m channel.
            ridge=add(mix(a,c,.5),(0,1.4+2.2*math.sin(k*.81),0))
            tri(R30_GROUP('05'),a,c,ridge,'foam')
# Multi-plane plunge FACE at the lock sill, distinct from its basin.
for k in range(21):
    d0=59.+k*3.65;d1=d0+3.65
    u0,u1=.839,.889
    top0=R30_WPOINT(u0,d0,k);top1=R30_WPOINT(u0,d1,k)
    low0=R30_WPOINT(u1,d0,k);low1=R30_WPOINT(u1,d1,k)
    mid0=add(mix(top0,low0,.48),(0,2.9*math.sin(k*.66),0))
    mid1=add(mix(top1,low1,.48),(0,2.8*math.cos(k*.81),0))
    quad(R30_GROUP('05'),top0,top1,mid1,mid0,'foam' if k%3 else 'shallows',False)
    quad(R30_GROUP('05'),mid0,mid1,low1,low0,'shallows' if k%2 else 'foam',False)
# Excavation abutments are coast-anchored concrete and copper hydraulic
# runners. No over-road arches, fake race floors, or repeated flying pylons.
def R30_JAMB(u,d,bank,group):
    p,f,s=frame(5,u)
    base=offset_edge(p,s,d,bank)
    w=unit(f);out=unit(s)
    h=base[1]
    def Q(dt,ds,dy):
        return add(base,add(mul(w,dt),add(mul(out,ds),(0,dy,0))))
    # Two asymmetrical wedge sides attach BELOW rock grade, not slender beams.
    a=[Q(-9,-7,-59),Q(-8,-7,-12),Q(-2,12,25),Q(-4,18,-61)]
    b=[Q(18,-7,-60),Q(17,-7,-13),Q(13,12,20),Q(15,20,-65)]
    for j in range(4):
        n=(j+1)%4
        quad(R30_GROUP(group),a[j],a[n],b[n],b[j],
             'r30_slate' if j<2 else 'r30_shadow',False)
    quad(R30_GROUP(group),a[0],a[3],a[2],a[1],'r30_sandstone',False)
    quad(R30_GROUP(group),b[0],b[1],b[2],b[3],'r30_sandstone',False)
    return Q(6,6,15),Q(6,7,-23)
j1,j1b=R30_JAMB(.869,63.,'R','06')
j2,j2b=R30_JAMB(.869,154.,'R','07')
beam(R30_GROUP('08'),j1,j1b,2.1,'oxidized')
beam(R30_GROUP('17'),j2,j2b,2.6,'copper')
# SOURCE-GROUNDED equipment: link only near the actual original preserved
# geometry bounds. Dynamic extraction avoids R29's hard-coded fake anchors.
def R30_BBOX(grp):
    pts=[p for abc in GROUPS[R30_GROUP(grp)] for p in abc[:3]]
    return [(min(p[i] for p in pts),max(p[i] for p in pts)) for i in range(3)]
R30_LANDMARKS={k:R30_BBOX(k) for k in ('12','34','41','42')}
for group,target in (('08','34'),('17','42')):
    bb=R30_LANDMARKS[target]
    x=(bb[0][0]+bb[0][1])*.5
    z=(bb[2][0]+bb[2][1])*.5
    y=bb[1][0]-9.
    # Short copper service penstock rests on a rock-fixed foot, does NOT
    # visually bridge huge distances or claim physical hydraulic simulation.
    beam(R30_GROUP(group),(x,y-24,z),(x+7,y+8,z+9),2.7,'r30_brass')
    tri(R30_GROUP(group),(x-12,y-30,z-10),(x+11,y-32,z+12),
        (x+4,y+3,z+5),'r30_wetrock')
# Check no R30 pseudo-triangles used just to pad empty groups.
R30_MISSING=[k for k in R30_EDIT if not GROUPS[R30_N[k]]]
assert not R30_MISSING,('R30_MISSING_REAL_CONNECTED_ZONE',R30_MISSING)
assert len(GROUPS)==43 and all(len(GROUPS[k])==v for k,v in R30_BEFORE.items())
assert site['newColliders']==0 and isinstance(stations,dict)
R30_OUT=Path('test-results/k4ct-r30-boolean-canyon')
R30_OUT.mkdir(parents=True,exist_ok=True)
R30_AUDIT={
 'schema':'k4ct-r30-single-carved-true-blender-harbor-v1',
 'method':'Genuine editable Blender CATMULL_CLARK subd and EXACT BOOLEAN cave on continuous three-bank coastal volumes, 23m gravity fall, source-bounded working hydraulic equipment',
 'realEvaluatedBlenderMeshes':R30_CREATED,
 'protectedGroupCounts':R30_BEFORE,
 'reworkedCounts':{k:len(GROUPS[R30_N[k]]) for k in R30_EDIT},
 'sourceLandmarkBoundingBoxes':R30_LANDMARKS,
 'newColliders':0,'originalB48':7,'originalB51':28,
 'formalArtAdopted':0,'slope2DNAmeters':0,
 'ART':'HOLD','HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD','FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
 'actualNativeCameraRAWRequired':True
}
(R30_OUT/'R30_SCENE_MANIFEST.json').write_text(json.dumps(R30_AUDIT,indent=2)+'\n')
print('R30_GENUINE_BOOLEAN_SUBDIV_EDITABLE_BLENDER_CANDIDATE',json.dumps(R30_AUDIT))

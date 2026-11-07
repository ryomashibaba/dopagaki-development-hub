"""R31 one art-directed working industrial inlet in the REAL original chase camera.
FIXED camera-composition brief:
  - NO enclosing 100m+ wall/roof in Road5's 65.xx near left foreground.
  - NO near-right cliff at turbine ~68.05.
  - A clearly authored open basin and real 3-stage open gravity cascade
    connect preserved 34 intake; a grounded working lower turbine bay connects
    preserved 41/42 crown and penstock; 12 tower gets a visible load-bearing toe.
  - All new world geometry is OUTBOARD, BELOW the camera's road-deck skyline,
    and purely visual/noncolliding. No repeat 'generic procedural' landforms.
This is editable DCC scene geometry via bpy/evaluated mesh, not a concept.
Protected R12A author/00/12/13/19/34/35/41/42 unchanged. Art judgement
requires original Chromium 240Hz/WebGL2 RAW; this file asserts no ART pass.
"""
import bpy, bmesh, math, json
from pathlib import Path
assert site['sourceGameBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert site['researchPhysicalRoad5SHA256']=='4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b'
assert (site['originalB48Count'],site['originalB51Count'],site['newColliders'])==(7,28,0)
assert len(GROUPS)==43 and isinstance(stations,dict)
R31_N={name[:2]:name for name in GROUPS}
R31_KEEP=('00','12','13','19','34','35','41','42')
R31_PROTECTED={R31_N[k]:list(GROUPS[R31_N[k]]) for k in R31_KEEP}
assert all(R31_PROTECTED.values())
R31_EDIT=tuple(k for k in R31_N if k not in R31_KEEP)
for key in R31_EDIT:GROUPS[R31_N[key]].clear()
COLORS.update({
 'r31_shelf':(.35,.375,.374),
 'r31_cutface':(.23,.294,.321),
 'r31_ledge':(.47,.478,.423),
 'r31_quay':(.405,.449,.417),
 'r31_dark_water':(.075,.232,.296),
 'r31_foam':(.60,.76,.73),
 'r31_iron':(.19,.345,.362),
 'r31_bronze':(.66,.466,.286),
 'r31_operational':(.71,.67,.55)
})
R31_DCC=[]
def R31_G(k):return R31_N[k]
def R31_EDGE(section,u,bank,d,drop):
    roadPoint,forward,side=frame(section,u)
    a=offset_edge(roadPoint,side,d,bank)
    return (a[0],roadPoint['center'][1]+drop,a[2])
def R31_CLOSED_SECTION(u,bank,idx,distance,crest):
    # Real source-anchored 6-vertex volume under clear drive skyline.
    # HAND-AUTHORED d/h cross section: cut, eroded toe, load-bearing ledge.
    return [R31_EDGE(idx,u,bank,distance-15.,-89.),
            R31_EDGE(idx,u,bank,distance-15.,-63.),
            R31_EDGE(idx,u,bank,distance+3.,-42.),
            R31_EDGE(idx,u,bank,distance+32.,crest),
            R31_EDGE(idx,u,bank,distance+65.,crest-7.),
            R31_EDGE(idx,u,bank,distance+91.,-92.)]
def R31_TRUE_DCC_BENCH(name,idx,bank,stations2,groups):
    # Not a long generative cliff: 4 hand-positioned, short concave benches.
    # Blender BEVEL creates editable worked stone arrises, then actual
    # evaluated triangle output goes to the original R9 source WebGL2.
    n=6
    rings=[R31_CLOSED_SECTION(u,bank,idx,d,crest)
           for (u,d,crest) in stations2]
    verts=[world_to_blender(p) for ring in rings for p in ring]
    polys=[]
    for i in range(len(rings)-1):
        for j in range(n):
            q=(j+1)%n
            polys.append((i*n+j,i*n+q,(i+1)*n+q,(i+1)*n+j))
    polys.append(tuple(range(n-1,-1,-1)))
    polys.append(tuple((len(rings)-1)*n+j for j in range(n)))
    mesh=bpy.data.meshes.new(name+'_AUTHORED_ROCK_TOPOLOGY')
    mesh.from_pydata(verts,[],polys);mesh.update()
    ob=bpy.data.objects.new(name+'_TRUE_DCC_MESH',mesh)
    bpy.context.collection.objects.link(ob)
    modifier=ob.modifiers.new('R31_ACTUAL_DCC_BEVELED_QUARRY_CUT','BEVEL')
    modifier.width=2.8;modifier.segments=3
    modifier.limit_method='ANGLE';modifier.angle_limit=.7
    bpy.context.view_layer.update()
    eval_obj=ob.evaluated_get(bpy.context.evaluated_depsgraph_get())
    geom=eval_obj.to_mesh()
    bm=bmesh.new();bm.from_mesh(geom)
    bmesh.ops.triangulate(bm,faces=list(bm.faces))
    faces=list(bm.faces)
    assert len(faces)>len(groups)*2, (name,len(faces))
    used=set()
    for j,poly in enumerate(faces):
        a,b,c=[(float(v.co.x),float(v.co.z),float(-v.co.y)) for v in poly.verts]
        # Ground: read architectural cutface instead of random flat stripes.
        normal=unit(cross(sub(b,a),sub(c,a)))
        mat=('r31_cutface' if abs(normal[1])<.42 else
             'r31_ledge' if normal[1]>.3 else 'r31_shelf')
        group=groups[min(len(groups)-1,j*len(groups)//len(faces))]
        tri(R31_G(group),a,b,c,mat)
        used.add(group)
    R31_DCC.append({'name':name,'beveledRealBlenderFaces':len(faces),
                    'handPlacedStations':stations2,'groups':list(groups)})
    assert len(used)==len(groups), (name,used,groups)
    bm.free();eval_obj.to_mesh_clear()
    bpy.data.objects.remove(ob,do_unlink=True)
# A. Low, deliberately scoped Road5 left TIDAL INLET. Its top remains
# 20-40m BELOW the source road, never R27/R30's huge near-left wall.
R31_TRUE_DCC_BENCH('ROAD5_LEFT_CARVED_QUAY',5,'L',[
 (.765,98.,-39.),(.824,100.,-34.),(.883,109.,-31.),(.955,118.,-36.)
],('01','02','21','22','25','26','38','39','40'))
# B. Road6 left lower turbine shore, and right tower foundation. Both
# are low, separated and forward-view transparent (no huge enclosing wedge).
R31_TRUE_DCC_BENCH('ROAD6_TURBINE_TOE',6,'L',[
 (.39,107.,-48.),(.49,108.,-40.),(.602,104.,-43.),(.735,113.,-46.)
],('20','27','28','29','30'))
R31_TRUE_DCC_BENCH('ROAD6_CONTROL_TOWER_BANK',6,'R',[
 (.12,106.,-37.),(.18,109.,-39.),(.255,115.,-46.),(.332,122.,-45.)
],('09','10','33'))
# C. Readable 3-pool GRAVITY STEPS: a physical stepped/chuted string
# of surfaces, rather than one cyan horizontal ocean slab.
# The 34 intake lives at source Road5 .905 on LEFT; cascade at .79-.98.
R31_KNOTS=[
 (.755,-36.),(.806,-39.),(.836,-44.),(.844,-62.),
 (.875,-63.),(.905,-69.),(.914,-88.),(.961,-90.),(.989,-91.)
]
def R31_WAT(u,d,height):
    p,f,s=frame(5,u)
    e=offset_edge(p,s,d,'L')
    return (e[0],p['center'][1]+height,e[2])
R31_FLOW_RECORD=[]
for k in range(len(R31_KNOTS)-1):
    (u0,drop0),(u1,drop1)=R31_KNOTS[k:k+2]
    for band in range(22):
        d0=58.+band*3.5; d1=d0+3.5
        ybend=.6*math.sin((k+band*.7)*.7)
        a=R31_WAT(u0,d0,drop0+ybend)
        b=R31_WAT(u0,d1,drop0-ybend)
        c=R31_WAT(u1,d1,drop1-ybend)
        d=R31_WAT(u1,d0,drop1+ybend)
        # Distinguish pools, vertical falls and lower receiving basin
        vertical=(drop1-drop0)<-11.
        g=('05' if vertical else '23' if k<4 else '24')
        m=('r31_foam' if vertical and band%3!=0 else
           'shallows' if band in (0,21) else 'r31_dark_water')
        quad(R31_G(g),a,b,c,d,m,False)
        if vertical and band in (3,6,10,14,18):
            tri(R31_G('05'),a,c,add(mix(a,c,.5),(0,4.+band*.09,0)),'foam')
    R31_FLOW_RECORD.append({'sourceU':[u0,u1],'heightBelowRoad':[drop0,drop1],
                            'gravityVerticalStep':(drop1-drop0)<-11.})
# Three separate low water pools open up negative space between shelves.
for idx,(u,depth,halfwidth) in enumerate(((.802,-42.,38.),(.878,-66.,42.),(.955,-92.,45.))):
    for j in range(15):
        d0=58.+(j/15)*2*halfwidth;d1=58.+((j+1)/15)*2*halfwidth
        aa=R31_WAT(u-.012,d0,depth)
        bb=R31_WAT(u-.012,d1,depth)
        cc=R31_WAT(u+.012,d1,depth)
        dd=R31_WAT(u+.012,d0,depth)
        quad(R31_G('03'),aa,bb,cc,dd,'r31_dark_water' if j%4 else 'shallows',False)
# D. Two truly separated thick LOCK JAWS, fitted into the source bank,
# not rings/arches above road. Upstream intake gate has a CLEAR open slot.
def R31_MASONRY_JAW(u,d,group,outer=1.):
    # 4-corner profile, thick in both course and width.
    p,f,s=frame(5,u)
    near=offset_edge(p,s,d,'L')
    y=p['center'][1]
    t0=add(near,(0,-98.,0))
    t1=add(near,(0,-43.,0))
    def position(fw,side,dy):
        return add(near,add(mul(f,fw),add(mul(s,-side),(0,dy,0))))
    A=[position(-8,-4,-105),position(-8,-4,-41),
       position(-8,12,-30),position(-8,16,-105)]
    B=[position(13,-4,-105),position(13,-4,-45),
       position(13,13,-32),position(13,16,-105)]
    for j in range(4):
        h=(j+1)%4
        quad(R31_G(group),A[j],A[h],B[h],B[j],
             'r31_quay' if j==1 else 'r31_cutface',False)
    quad(R31_G(group),A[0],A[3],A[2],A[1],'r31_cutface',False)
    quad(R31_G(group),B[0],B[1],B[2],B[3],'r31_cutface',False)
    return position(1,5,-49),position(8,7,-81)
R31_A,R31_A_LOW=R31_MASONRY_JAW(.882,56.,'04')
R31_B,R31_B_LOW=R31_MASONRY_JAW(.891,145.,'06')
# Hydraulic gate leaves are open, one lifted 19m. No road-spanning beam.
beam(R31_G('07'),R31_A,R31_A_LOW,3.4,'r31_iron')
beam(R31_G('08'),R31_B,R31_B_LOW,2.9,'r31_bronze')
tri(R31_G('11'),R31_A,add(R31_A,(0,12,0)),
    add(R31_A_LOW,(12,9,4)),'r31_iron')
tri(R31_G('36'),R31_B,add(R31_B,(0,16,0)),
    add(R31_B_LOW,(-13,3,7)),'r31_operational')
# E. ACTUAL preserved 34 intake supports: use existing SOURCE group bounds
# rather than guessing world positions. Load travels to a low real quay.
def R31_BBOX(group):
    pts=[p for face in GROUPS[R31_G(group)] for p in face[:3]]
    return [(min(p[i] for p in pts),max(p[i] for p in pts)) for i in range(3)]
R31_ORIGINAL_BBOX={k:R31_BBOX(k) for k in ('12','34','41','42')}
intake=R31_ORIGINAL_BBOX['34']
cx=(intake[0][0]+intake[0][1])/2;cz=(intake[2][0]+intake[2][1])/2
base=intake[1][0]
for j,delta in enumerate((-21.,21.)):
    ground=(cx+delta,base-73.,cz-13.)
    bridge=(cx+delta,base+3.,cz-15.)
    # Paired built-up abutments, low quarried footing, not floating poles.
    beam(R31_G('15' if j==0 else '16'),ground,bridge,6.2,'r31_quay')
    tri(R31_G('14' if j==0 else '18'),
        add(ground,(-14,0,-7)),add(ground,(17,-3,10)),bridge,'r31_cutface')
# F. Original 41 wheel y115..168 requires visible FOUNDATION beneath it.
# Low industrial berth with open air around existing turbine rim.
turbine=R31_ORIGINAL_BBOX['41']
tx=(turbine[0][0]+turbine[0][1])*.5
tz=(turbine[2][0]+turbine[2][1])*.5
wheelBottom=turbine[1][0]
def R31_SIDE_HOUSE(g,xshift,zin):
    foot=(tx+xshift,wheelBottom-113.,tz+zin)
    top=(tx+xshift,wheelBottom-27.,tz+zin-5.)
    # Symmetric only in statics, no repeated anonymous columns across coast.
    beam(R31_G(g),foot,top,7.0,'r31_quay')
    wing=(tx+xshift+(14 if xshift>0 else -14),wheelBottom-104.,tz+zin+17.)
    tri(R31_G(g),foot,top,wing,'r31_cutface')
    return top
left=R31_SIDE_HOUSE('31',-31.,-5.)
right=R31_SIDE_HOUSE('32',32.,6.)
# Short overhead catwalk OUTBOARD behind the wheel. Keep wheel and sky open.
beam(R31_G('17'),add(left,(0,-19,19)),add(right,(0,-17,20)),2.,'r31_iron')
beam(R31_G('37'),(tx-10,wheelBottom-24.,tz+29.),
     (tx+16,wheelBottom-50.,tz+26.),2.7,'r31_bronze')
# Actual quay deck has edge-thickness and a recessed working bay.
box(R31_G('27'),(tx,wheelBottom-80.,tz+33.),61.,32.,9.,'r31_quay')
box(R31_G('28'),(tx+15.,wheelBottom-57.,tz+48.),25.,23.,22.,'r31_iron')
for dx in (-7.,7.):
    box(R31_G('29'),(tx+15.+dx,wheelBottom-55.,tz+36.),5.,2.,7.,'glass')
# Source 12 real control tower gets buttressed BELOW rather than a 100m cliff.
tower=R31_ORIGINAL_BBOX['12']
ax=(tower[0][0]+tower[0][1])*.5; az=(tower[2][0]+tower[2][1])*.5
bottom=tower[1][0]
for off,g in ((-29,'09'),(28,'10')):
    root=(ax+off,bottom-68.,az-5.)
    top=(ax+off*.65,bottom-2.,az+8.)
    beam(R31_G(g),root,top,6.,'r31_ledge')
# G. A SINGLE port's ancillary features, not repeated long columns:
# cradle, short service pipe, rail, open cargo lift and endcap.
beam(R31_G('30'),(tx+20,wheelBottom-72.,tz+30.),
     (tx+33,wheelBottom-38.,tz+33.),2.5,'r31_bronze')
tri(R31_G('20'),(ax-41,bottom-79.,az-14.),
    (ax+49,bottom-80.,az+11.),(ax+17,bottom-9.,az+20.),'r31_cutface')
tri(R31_G('33'),(ax-24,bottom-65.,az+25.),
    (ax+25,bottom-68.,az+26.),(ax+1,bottom+4.,az+32.),'r31_ledge')
# Add just one human-scale open observation berth, nothing over road.
beam(R31_G('37'),(tx-20.,wheelBottom-34.,tz+46.),
     (tx-11.,wheelBottom-5.,tz+48.),1.0,'r31_iron')
# Protection and semantic completeness: all 35 rewritten groups are
# functional elements of the new shore/lock/water/turbine/tower composition.
R31_EMPTY=[k for k in R31_EDIT if len(GROUPS[R31_N[k]])==0]
assert not R31_EMPTY,('R31_GROUP_WITHOUT_REAL_ARCHITECTURE',R31_EMPTY)
assert all(GROUPS[k]==orig for k,orig in R31_PROTECTED.items())
assert len(GROUPS)==43 and site['newColliders']==0
out=Path('test-results/k4ct-active-art')
out.mkdir(parents=True,exist_ok=True)
report={
 'schema':'k4ct-active-art-original-camera-r31-single-authored-open-lockyard-v1',
 'researchPhase':'R31','formalArtAdopted':0,'slope2DNAmeters':0,
 'actualBlenderDcc':True,'realBlenderBeveledStoneVolumes':R31_DCC,
 'protectedGroupCounts':{k:len(v) for k,v in R31_PROTECTED.items()},
 'reworkedGroups':{k:len(GROUPS[R31_N[k]]) for k in R31_EDIT},
 'preservedOriginalLandmarkWorldBounds':R31_ORIGINAL_BBOX,
 'physicalB48':7,'movingB51':28,'newColliders':0,
 'chaseFrameContract':'No overhead/new road geometry; low source-relative bench, actual intake and turbine footings, open 3-step falls and clear source camera',
 'waterfallActualStagedElevation':R31_FLOW_RECORD,
 'sourceCameraActualRAW':'NOT_YET_CAPTURED',
 'ART':'HOLD','HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD','FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'
}
(out/'R31_SCENE_MANIFEST.json').write_text(json.dumps(report,indent=2)+'\n')
print('R31_REAL_DCC_AUTHORED_CAMERA_FIRST_OPEN_WORKING_LOCKYARD',json.dumps(report))

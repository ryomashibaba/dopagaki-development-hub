"""R32 source camera continuation of R31 art-directed working industrial inlet in the REAL original chase camera.
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


# R32 — ONE functional waterpower vertical-slice revision of the R31 camera-
# clear candidate. R31 protected silhouettes/functional source groups stay
# exactly unchanged. Replace *water only*, then add precisely situated
# excavated working weirs, intake-fed supply and the actual wheel outfall.
# No blanket cliff regeneration, no repeated skyline columns.
R32_ORIGINAL_LOCKYARD_OPEN_VIEW=True
R32_WATER_KEYS=('03','05','23','24')
for R32_ID in R32_WATER_KEYS:GROUPS[R31_G(R32_ID)].clear()
R32_SOURCE_Y=sample(5,.755)['center'][1]
R32_DROPS=[
 (.749,-18.),(.789,-22.),(.819,-24.),(.836,-26.),
 (.843,-52.),(.880,-55.),(.901,-58.),(.911,-84.),
 (.955,-86.),(.992,-88.)]
R32_WATER_SECTIONS=[]
def R32_WATER(u,d,height,j=0):
    p,f,s=frame(5,u)
    pos=offset_edge(p,s,d+1.5*math.sin(u*31.+d*.11),'L')
    # Absolute world gravity head, not grade-relative offset that follows
    # source road slopes. Water cannot climb between weirs.
    return (pos[0],R32_SOURCE_Y+height+0.33*math.sin(u*53.+j*.82),pos[2])
def R32_AT(u,sideOffset,worldHeight):
    p,f,s=frame(5,u)
    x,y,z=offset_edge(p,s,sideOffset,'L')
    return (x,worldHeight,z)
for R32_K in range(len(R32_DROPS)-1):
    (ua,ha),(ub,hb)=R32_DROPS[R32_K:R32_K+2]
    waterfall=hb-ha<=-20.
    sector=('23' if R32_K<4 else '24' if R32_K>6 else '03')
    for strip in range(20):
        d0=61.+strip*4.5
        d1=d0+4.5
        a=R32_WATER(ua,d0,ha,strip)
        b=R32_WATER(ua,d1,ha,strip+1)
        c=R32_WATER(ub,d1,hb,strip+1)
        d=R32_WATER(ub,d0,hb,strip)
        m=('r31_foam' if waterfall and strip%4!=0 else
           'shallows' if strip in (0,19) else 'r31_dark_water')
        quad(R31_G('05' if waterfall else sector),a,b,c,d,m,False)
        if waterfall and strip in (1,4,7,11,15,18):
            mid=mix(a,c,.49)
            # Shape of a falling curtain with foaming air pocket visibly
            # projected toward camera, not a same-height sea flat.
            tri(R31_G('05'),a,c,add(mid,(0,2.8+strip*.06,0)),'foam')
            tri(R31_G('05'),b,d,add(mid,(0,5.0+math.sin(strip),0)),'r31_foam')
    R32_WATER_SECTIONS.append({
      'road5U':[ua,ub],'upperAbsoluteWorldY':R32_SOURCE_Y+ha,
      'lowerAbsoluteWorldY':R32_SOURCE_Y+hb,'realDropM':ha-hb,
      'visibleCurtain':waterfall})
assert sum(x['visibleCurtain'] for x in R32_WATER_SECTIONS)==2
assert sum(x['realDropM'] for x in R32_WATER_SECTIONS)==70.
# Hydraulic cutaway bed under both falling water sheets. This creates
# a dark dimensional scarp behind the visible foam, not transparent water
# hovering over turquoise background.
for ua,ub,upper,lower in ((.833,.846,-24.,-54.),(.899,.914,-58.,-86.)):
    for k in range(14):
        d0=61.+k*6.3;d1=d0+6.3
        topa=R32_AT(ua,d0,R32_SOURCE_Y+upper-2.)
        topb=R32_AT(ua,d1,R32_SOURCE_Y+upper-2.)
        lowa=R32_AT(ub,d0,R32_SOURCE_Y+lower-11.)
        lowb=R32_AT(ub,d1,R32_SOURCE_Y+lower-11.)
        quad(R31_G('02' if ua<.85 else '22'),topa,topb,lowb,lowa,
             'r31_cutface' if k%3 else 'r31_shelf',False)
# Two locally massive gate abutment pairs flank the actual 90m wide water
# corridor, anchored under the pool bed. NOT over Road5 B48.
def R32_CAISSON(u,d,group,crest):
    p,forward,side=frame(5,u)
    anchor=offset_edge(p,side,d,'L')
    y0=R32_SOURCE_Y+crest
    def q(t,delta,above):
        return (anchor[0]+forward[0]*t-side[0]*delta,
                y0+above,
                anchor[2]+forward[2]*t-side[2]*delta)
    a=[q(-5,-5,-52),q(-5,-5,9),q(-5,13,17),q(-5,16,-54)]
    b=[q(18,-5,-54),q(18,-5,7),q(18,12,13),q(18,16,-55)]
    for n in range(4):
        m=(n+1)%4
        quad(R31_G(group),a[n],a[m],b[m],b[n],
             'r31_cutface' if n in (0,2) else 'r31_quay',False)
    quad(R31_G(group),a[0],a[3],a[2],a[1],'r31_quay',False)
    quad(R31_G(group),b[0],b[1],b[2],b[3],'r31_quay',False)
    # mechanical lift slot, not an empty decorative highway gate
    beam(R31_G('08'),q(5,7,-45),q(6,7,12),2.2,'r31_iron')
    return q(10,5,-9),q(10,5,-33)
R32_GATE_ANCHORS=[]
for u,crest in ((.837,-26.),(.905,-58.)):
    a,ab=R32_CAISSON(u,57.,'04',crest)
    c,cb=R32_CAISSON(u,157.,'06',crest)
    R32_GATE_ANCHORS.extend((a,c))
    # Inboard-to-outboard water lip is placed only across the water, far
    # beyond the true road edge. No roof/bridge over drivable surface.
    beam(R31_G('07'),add(a,(0,12,0)),add(c,(0,12,0)),1.9,'r31_bronze')
    for origin in (a,c):
        beam(R31_G('11'),origin,add(origin,(0,27,0)),1.35,'r31_iron')
        # flood control hinge plate with its lower edge in the channel
        tri(R31_G('36'),origin,add(origin,(0,22,0)),
            add(origin,(8,3,5)),'r31_operational')
# Lower basin is recognizable as a collecting pool by dark water, angled
# piers, impact foam and an outfall; NEVER one uniform cyan wall.
for u,level in ((.857,-54.),(.925,-84.)):
    for s in range(10):
        du=.006*s/10
        for k in range(5):
            d0=70.+k*14.; d1=d0+14.
            a=R32_WATER(u+du,d0,level,k)
            b=R32_WATER(u+du,d1,level,k)
            c=R32_WATER(u+du+.006,d1,level,k+1)
            d=R32_WATER(u+du+.006,d0,level,k+1)
            quad(R31_G('03' if u<.9 else '24'),a,b,c,d,
                 'r31_dark_water' if (s+k)%4 else 'shallows',False)
# Intake 34 isn't movable and cannot be reauthored. Its actual source
# bounding box anchors a short industrial penstock into the HIGH water.
R32_INTAKE=R31_ORIGINAL_BBOX['34']
R32_I_X=sum(R32_INTAKE[0])*.5
R32_I_Z=sum(R32_INTAKE[2])*.5
R32_I_Y=R32_INTAKE[1][0]
for dx,g in ((-9.,'14'),(10.,'18')):
    top=(R32_I_X+dx,R32_I_Y+11.,R32_I_Z-9.)
    R32_SERVICE_END=(R32_I_X+dx+12.,R32_I_Y-21.,R32_I_Z-34.)
    beam(R31_G(g),top,R32_SERVICE_END,3.5,'r31_bronze')
    tri(R31_G(g),top,(R32_SERVICE_END[0]+9.,R32_SERVICE_END[1]-16.,R32_SERVICE_END[2]-5.),
        (R32_SERVICE_END[0]-7.,R32_SERVICE_END[1]-27.,R32_SERVICE_END[2]+7.),'r31_cutface')
# EXISTING turbine 41/42 is untouched. Architect a real lower-basin
# outfall in its local coordinate bounds, not disconnected isolated sticks.
R32_T=R31_ORIGINAL_BBOX['41']
R32_X=sum(R32_T[0])*.5
R32_Z=sum(R32_T[2])*.5
R32_B=R32_T[1][0]
R32_CHANNEL=[
 (R32_X-37.,R32_B-66.,R32_Z+50.),
 (R32_X-21.,R32_B-74.,R32_Z+28.),
 (R32_X+22.,R32_B-78.,R32_Z+21.),
 (R32_X+37.,R32_B-70.,R32_Z+44.)
]
# Open-top powerhouse outfall with thick cut stone side cheeks.
for i,g in ((0,'31'),(3,'32')):
    base=R32_CHANNEL[i]
    top=add(base,(0,41.,0))
    beam(R31_G(g),base,top,6.5,'r31_quay')
    tri(R31_G('28'),add(base,(-9,-18,-4)),add(base,(11,-19,7)),
        add(top,(0,1,9)),'r31_cutface')
quad(R31_G('30'),R32_CHANNEL[0],R32_CHANNEL[1],R32_CHANNEL[2],
     R32_CHANNEL[3],'r31_dark_water',False)
for i in range(7):
    u=i/7.
    p=mix(R32_CHANNEL[1],R32_CHANNEL[2],u)
    q=add(p,(0,8.0+2*math.sin(i*.8),0))
    tri(R31_G('29'),add(p,(-4,0,-7)),add(p,(4,0,-6)),q,'r31_foam')
beam(R31_G('17'),(R32_X+17.,R32_B-17.,R32_Z+16.),
     (R32_X+31.,R32_B-58.,R32_Z+21.),3.0,'r31_iron')
# This scene is necessarily a visual research candidate. R32 does not
# replace fluid dynamics, B51 collisions, gameplay or HUMAN judgement.
assert all(GROUPS[k]==orig for k,orig in R31_PROTECTED.items())
assert len(GROUPS)==43 and all(GROUPS[R31_G(k)] for k in R31_EDIT)
assert site['newColliders']==0 and site['originalB51Count']==28
R32_MANIFEST={
 'schema':'k4ct-active-art-r32-camera-anchored-double-drop-intake-turbine-v1',
 'candidate':'ONE_LOW_OPEN_SOURCE_VISIBLE_TWO_STAGE_INTAKE_TO_TURBINE',
 'R31OriginalChaseViewPreserved':R32_ORIGINAL_LOCKYARD_OPEN_VIEW,
 'sameOriginalBlenderAuthorIsolated':True,
 'sourceRelativeWaterReferenceY':R32_SOURCE_Y,
 'stagedWatercourse':R32_WATER_SECTIONS,
 'visualWorldDropTotalM':70.,
 'realGravityFluidSimulation':False,
 'source34ActualXYZBoundingBox':R32_INTAKE,
 'source41ActualXYZBoundingBox':R32_T,
 'functionalGateAnchorCount':len(R32_GATE_ANCHORS),
 'hydraulicPurpose':'Source intake gallery, two open sluices, recessed receiving water and lower turbine outfall; visual-only',
 'protectedGroupCounts':{k:len(v) for k,v in R31_PROTECTED.items()},
 'reworkedGroups':{k:len(GROUPS[R31_G(k)]) for k in R31_EDIT},
 'realBlenderBeveledStoneVolumes':R31_DCC,
 'newColliders':0,'originalB48':7,'originalB51':28,
 'formalArtAdopted':0,'slope2DNAmeters':0,
 'originalWebGL2ActualRAWRequired':True,
 'ART':'HOLD','HUMAN':'HOLD','SAT':'HOLD',
 'CCD':'HOLD','FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'
}
(out/'R32_SCENE_MANIFEST.json').write_text(
 json.dumps(R32_MANIFEST,indent=2)+'\n')
print('R32_TIDAL_DOUBLE_DROP_SOURCE_BOUNDED_MECHANICAL_HARBOR_REAL_DCC',
      json.dumps(R32_MANIFEST))

"""R29 — one geological harbour slice, NOT a cosmetic R28 retry.
Research-only Blender injection into a temporary copy of unchanged R12A author.
Built from original Road5/6 section frames and 34/12/41/42 protected landmark
coordinates. Rock bases, deep throat, visible falling water, asymmetrical
natural headlands and embedded load paths. No new physics or safety surfaces.
Reality of geometry, visibility and ART can ONLY be judged in source GL RAW.
"""
import json,math
from pathlib import Path
assert site['sourceGameBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert site['researchPhysicalRoad5SHA256']=='4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b'
assert (site['originalB48Count'],site['originalB51Count'],site['newColliders'])==(7,28,0)
assert len(GROUPS)==43 and isinstance(stations,dict)
R29_NAME={name[:2]:name for name in GROUPS}
R29_KEEP=('00','12','13','19','34','35','41','42')
R29_OLD={R29_NAME[k]:len(GROUPS[R29_NAME[k]]) for k in R29_KEEP}
assert len(R29_NAME)==43 and all(R29_OLD.values())
R29_EDIT=tuple(k for k in R29_NAME if k not in R29_KEEP)
for R29_ID in R29_EDIT:GROUPS[R29_NAME[R29_ID]].clear()
def R29_G(k):return R29_NAME[k]
def R29_W(g,a,b,c,d,top='basalt',bottom='deepstone'):
    """A closed four-vertex near/far sculpted rock section with true depth."""
    for k in range(4):
        q=(k+1)%4
        quad(g,a[k],a[q],b[q],b[k],
             top if k==1 else bottom if k==3 else 'shale',False)
    quad(g,a[3],a[2],a[1],a[0],bottom,False)
    quad(g,b[0],b[1],b[2],b[3],bottom,False)
def R29_EDGE(idx,u,bank,out,y_delta):
    p,f,side=frame(idx,u)
    anchor=offset_edge(p,side,out,bank)
    return add(anchor,(0,y_delta,0))
def R29_SECTION(idx,u,bank,inner,outer,rise,base):
    """Outboard sculpted headland; near edge always outside B48 clearance."""
    p,f,side=frame(idx,u)
    h=p['center'][1]
    return [
        R29_EDGE(idx,u,bank,inner,base-h),
        R29_EDGE(idx,u,bank,inner+13.,rise*.27-h),
        R29_EDGE(idx,u,bank,inner+(outer-inner)*.68,rise-h),
        R29_EDGE(idx,u,bank,outer,(rise-16.)-h)
    ]
# A. Remove every unprotected inherited prop group (those caused R28's
# repeated left columns, detached factory parts, floating waterfront spans).
# No old repeating bridge / box / model survives the research candidate.
# Actual ORIGINAL physical road mesh, B51, tower, intake and turbine are kept.
# Carve positive two-bank geological ROOTS instead of replacing them with
# planar triangles and horizontal long beams.
R29_CUTS=[
    (5,'L','01','02',[(.57,54,128,79),(.665,49,144,85),(.765,58,175,96),(.86,64,183,91),(.965,55,172,102)]),
    (5,'R','20','21',[(.63,47,119,46),(.73,51,155,55),(.83,46,171,64),(.91,48,178,61),(.985,62,194,75)]),
    (6,'L','25','26',[(.045,50,138,69),(.19,54,167,84),(.33,61,183,79),(.49,64,197,93),(.67,66,175,97)]),
    (6,'R','27','30',[(.055,51,121,73),(.20,57,149,84),(.38,63,168,99),(.55,55,162,95),(.74,61,172,87),(.91,70,183,96)]),
]
for R29_RD,R29_BANK,R29_G0,R29_G1,R29_KNOTS in R29_CUTS:
    R29_PROFILES=[]
    for R29_I,(R29_U,R29_INNER,R29_OUTER,R29_HEIGHT) in enumerate(R29_KNOTS):
        # Depth/recession is volumetric, and each chapter has a deliberately
        # different crest profile. Near rim is lower than race-camera eye.
        R29_RIDGE=R29_HEIGHT+10*math.sin(R29_I*.73+R29_RD*.4)
        R29_PROFILES.append(R29_SECTION(R29_RD,R29_U,R29_BANK,
                                         R29_INNER,R29_OUTER,R29_RIDGE,-58.))
    for R29_I in range(len(R29_PROFILES)-1):
        R29_A,R29_B=R29_PROFILES[R29_I:R29_I+2]
        R29_W(R29_G(R29_G0 if R29_I%2==0 else R29_G1),
              R29_A,R29_B,'shale' if R29_I%2 else 'dunestone','deepstone')
        # Distinct exposed fault planes are inset into real cliff, with visible
        # dark cross section, NOT regular stone columns.
        if R29_I in (0,2):
            tri(R29_G('22'),R29_A[1],R29_A[2],R29_B[1],'deepstone')
            tri(R29_G('22'),R29_B[1],R29_A[2],R29_B[2],'basalt')
# B. One separated broad watercourse. Main channel is inset inside newly
# cut stone; open negative space and TWO noncoplanar water levels explain
# gravity. Dark salt water is broken by short real-volume cataract, not a
# continuous bright cyan horizontal backdrop.
R29_U=[.66,.69,.73,.775,.82,.86,.899,.927,.952,.984]
def R29_WAT(u,depth,span):
    p,f,s=frame(5,u)
    a=offset_edge(p,s,depth,'R')
    # Separate upper water from the darker lower receiving basin.
    t=max(0.,min(1.,(u-.825)/.115))
    fall=t*t*(3-2*t)
    h=85.-24.*fall+1.1*math.sin(u*41.+span*2.6)
    return (a[0],h,a[2])
for R29_K in range(len(R29_U)-1):
    R29_A,R29_B=R29_U[R29_K:R29_K+2]
    for R29_J in range(5):
        R29_D0=63.+14.*R29_J
        R29_D1=63.+14.*(R29_J+1)
        R29_MAT='tide' if R29_K in (0,1,7,8) else (
            'foam' if R29_K in (4,5) and R29_J in (1,3) else 'shallows')
        quad(R29_G('03'),R29_WAT(R29_A,R29_D0,R29_J),
             R29_WAT(R29_A,R29_D1,R29_J+1),
             R29_WAT(R29_B,R29_D1,R29_J+1),
             R29_WAT(R29_B,R29_D0,R29_J),R29_MAT,False)
        if R29_K in (3,4,5) and R29_J in (1,2,3):
            a=R29_WAT(R29_A,R29_D0,R29_J)
            b=R29_WAT(R29_B,R29_D0,R29_J)
            c=R29_WAT((R29_A+R29_B)/2,R29_D0+6,R29_J)
            tri(R29_G('05'),add(a,(0,1.6,0)),add(b,(0,1.,0)),
                add(c,(0,5.3,0)),'foam')
# C. Source intake 34 is at (1050,122,-326), not at R28's
# (882,24,-418) scenic construction. Its real physical hillside base is
# a deep notched basalt excavation with a solid load path BELOW equipment.
def R29_RIDGE_MASS(g,cx,cz,base,crest,radx,radz,seed,upper_material):
    """One asymmetric layered solid with visibly grounded canyon flanks."""
    N=13
    rings=[]
    for level in range(3):
        r=(1.22,.91,.51)[level]
        y=(base,base+(crest-base)*.66,crest)[level]
        ring=[]
        for n in range(N):
            a=2*math.pi*n/N
            phase=.11*math.sin(n*.93+seed)+.07*math.cos(n*2.1-seed)
            radius=r*(1.+phase)
            x=cx+radx*radius*math.cos(a)
            z=cz+radz*radius*math.sin(a)
            # World-size features: high eroded shoulders and a lower opening.
            jy=(5.*math.sin(n*1.43+seed)+3.*math.cos(n*.61-seed))*level/2
            ring.append((x,y+jy,z))
        rings.append(ring)
    for level in range(2):
        for n in range(N):
            k=(n+1)%N
            quad(g,rings[level][n],rings[level][k],
                 rings[level+1][k],rings[level+1][n],
                 ('basalt' if level==0 else upper_material),False)
    # Unequal, thick upper face. Do not block wheel/tower above crest.
    cap=(cx+radx*.09,crest-3.,cz-radz*.07)
    for n in range(N):
        tri(g,rings[2][n],rings[2][(n+1)%N],cap,
            upper_material if n%4 else 'deepstone')
    return {'center':[cx,cz],'radius':[radx,radz],'base':base,'crest':crest}
R29_FOUNDATIONS={}
R29_FOUNDATIONS['intake34']=R29_RIDGE_MASS(R29_G('04'),1050.,-326.,
                                     -55.,67.,61.,51.,.4,'dunestone')
R29_FOUNDATIONS['tower12']=R29_RIDGE_MASS(R29_G('09'),1121.,-628.,
                                     -58.,66.,80.,63.,1.6,'shale')
# The turbine is ~87m outboard of original Road6 and its wheel is y=115..168.
# Carve a real footing BELOW the wheel (not a 140m scenery wall).
R29_FOUNDATIONS['turbine41']=R29_RIDGE_MASS(R29_G('28'),1521.,-495.,
                                     -63.,78.,54.,52.,2.3,'basalt')
# Basalt plinths bridge the turbine's actual penstock to the ground.
for R29_K,(a,b) in enumerate((
    ((1497.,-31.,-518.),(1518.,66.,-499.)),
    ((1551.,-37.,-502.),(1534.,69.,-477.)),
    ((1527.,-58.,-542.),(1521.,47.,-516.)))):
    # Large triangular rock load paths rather than thin isolated stilts.
    d=(-15. if R29_K==0 else 17.)
    tri(R29_G('29'),a,b,(a[0]+d,a[1]-2.,a[2]+15.),'basalt')
    tri(R29_G('29'),b,(b[0]+d,b[1]-4.,b[2]+17.),
        (a[0]+d,a[1]-2.,a[2]+15.),'deepstone')
# D. Only a small number of working infrastructure details, each supported
# by its own rock foundation: carved intake sill, buried water penstock and
# recessed open quay. NEVER decorative repetitive beams.
R29_A=(1040.,68.,-343.);R29_B=(1072.,64.,-329.)
beam(R29_G('08'),R29_A,R29_B,2.4,'oxidized')
beam(R29_G('11'),(1056.,62.,-337.),(1083.,37.,-349.),3.5,'copper')
beam(R29_G('17'),(1522.,68.,-494.),(1548.,53.,-491.),3.0,'oxidized')
# Arched excavated sink: TWO irregular sidewalls and a void, no decorative ring.
R29_SIDE_A=[(1009.,-37.,-379.),(1016.,39.,-369.),
            (1033.,58.,-357.),(1043.,-44.,-361.)]
R29_SIDE_B=[(1076.,-42.,-357.),(1084.,45.,-346.),
            (1100.,66.,-335.),(1114.,-45.,-341.)]
R29_W(R29_G('06'),R29_SIDE_A,R29_SIDE_B,'deepstone','basalt')
# One broad dark horizontal drainage face is split by genuine ravine holes;
# do not connect banks with a fake roadway, bridge or safe floor.
for R29_K,(x,z) in enumerate(((1082.,-373.),(1119.,-392.),(1172.,-439.))):
    tri(R29_G('07'),(x-9.,24.,z),(x+18.,12.,z-13.),(x+6.,-28.,z+11.),'deepstone')
    tri(R29_G('23'),(x-10.,26.,z-6.),(x+6.,-29.,z+11.),(x-17.,-34.,z+2.),'shale')
# Deep raw stone segments binding shoreline against level-19 retained forebay.
for R29_K,(u,g) in enumerate(((.43,'10'),(.56,'14'),(.69,'15'),(.81,'16'),(.93,'18'))):
    p,f,s=frame(6,u)
    q=offset_edge(p,s,94+R29_K*7,'R')
    x,y,z=q
    tri(R29_G(g),(x-25,y-62,z-19),(x+26,y-66,z+17),(x+9,y-11,z+38),'basalt')
    tri(R29_G(g),(x-25,y-62,z-19),(x+9,y-11,z+38),(x-12,y+6,z+20),'dunestone')
# Short terminal outlets and dark bay wall BELOW original turbine/shore.
for R29_K,g in enumerate(('24','31','32','33','36','37','38','39','40')):
    theta=-2.3+.53*R29_K
    cx=1521.+(58.+(R29_K%3)*8.)*math.cos(theta)
    cz=-495.+(67.+(R29_K%2)*7.)*math.sin(theta)
    low=(cx,-54.,cz)
    high=(cx+9.*math.sin(theta),34.+7.*math.sin(theta*2),cz+14.*math.cos(theta))
    wing=(cx+26.*math.cos(theta),-20.,cz+20.*math.sin(theta))
    tri(R29_G(g),low,high,wing,'basalt' if R29_K%2 else 'shale')
    tri(R29_G(g),wing,high,(cx+6.,-57.,cz+7.),'deepstone')
# Wet, low promontory tips and an actual receiving basin of smaller facets.
for R29_K,(u,g) in enumerate(((.26,'27'),(.47,'30'),(.74,'21'),(.84,'25'))):
    p,f,s=frame(6,u)
    a=offset_edge(p,s,78.,'R')
    b=offset_edge(p,s,129.,'R')
    tri(R29_G(g),add(a,(0,-61.,0)),add(b,(0,-57.,0)),
        add(b,(0,-25.-R29_K*3.,0)),'deepstone')
# Functional short drainage lip, NOT a continuous shallow cyan ocean plane.
for R29_K,u in enumerate((.52,.62,.72)):
    p,f,s=frame(6,u)
    a=offset_edge(p,s,98.,'R')
    b=offset_edge(p,s,146.,'R')
    tri(R29_G('24'),(a[0],tideY+3.,a[2]),(b[0],tideY+1.2,b[2]),
        (b[0]+16.,tideY+.7,b[2]-8.),'tide')
# Distinct loadbearing sections in the R6 cliff, not many independent props.
for R29_K,g in enumerate(('02','04','05','08','11','20','22','26')):
    u=.13+R29_K*.107
    p,f,s=frame(6,min(u,.98))
    root=offset_edge(p,s,75.+(R29_K%3)*12.,'L')
    high=add(root,(0,-15.+5.*math.sin(R29_K),0))
    foot=add(root,(0,-72.,0))
    tri(R29_G(g),foot,high,
        add(foot,add(mul(s,-26.),(0,-8.,0))),'deepstone')
# Prevent fake group visibility: every group must contain genuine visible mesh.
R29_EMPTY=[k for k in R29_EDIT if not GROUPS[R29_G(k)]]
assert not R29_EMPTY,('R29_FAILED_UNINTEGRATED_GROUPS',R29_EMPTY)
assert len(GROUPS)==43
assert all(len(GROUPS[k])==count for k,count in R29_OLD.items())
assert site['newColliders']==0 and isinstance(stations,dict)
R29_OUTPUT=Path('test-results/k4ct-r29-geology-integrated')
R29_OUTPUT.mkdir(parents=True,exist_ok=True)
R29_REPORT={
 'schema':'k4ct-r29-true-blender-geological-original-camera-candidate-v1',
 'candidate':'ONE_NATURAL_QUARRY_BASIN_WITH_GROUNDED_INTAKE_TOWER_TURBINE',
 'intent':'replace legacy unprotected repeating props with volumetric rock rooted in original Road5/6 geology and protected structures',
 'protectedGroupCounts':R29_OLD,'reworkedGroupCounts':{k:len(GROUPS[R29_G(k)]) for k in R29_EDIT},
 'actualSourceLandmarkFootingWorldXYZ':R29_FOUNDATIONS,
 'realGameBlob':site['sourceGameBlob'],
 'road5Sha256':site['researchPhysicalRoad5SHA256'],
 'originalB48':7,'originalB51':28,'newColliders':0,
 'editableBlender':True,'originalGameCamera':'UNCHANGED',
 'formalArtAdopted':0,'slope2DNAmeters':0,'ART':'HOLD','HUMAN':'HOLD',
 'SAT':'HOLD','CCD':'HOLD','FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
 'needsFiveOriginalRawBeforeART':True
}
(R29_OUTPUT/'R29_SCENE_MANIFEST.json').write_text(
    json.dumps(R29_REPORT,ensure_ascii=False,indent=2)+'\n')
print('R29_SINGLE_GEOLOGICAL_HARBOR_GENUINE_BLEND_RESEARCH',
      json.dumps(R29_REPORT))

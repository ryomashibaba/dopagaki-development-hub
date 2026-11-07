"""R28 research-only: one source-camera-aware quarry / gravity harbor as volumetric Blender geometry.
Injected into a throwaway copy of the protected R12A artist. Never adopted or physical.
The empty channel is designed first: its banks are separate true rock volumes; the sluice
is a gap, NOT a decorative ring across the roadway. Real camera RAW is the verdict.
"""
import math, json
from pathlib import Path
assert site['sourceGameBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert site['researchPhysicalRoad5SHA256']=='4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b'
assert (site['originalB48Count'],site['originalB51Count'],site['newColliders'])==(7,28,0)
assert len(GROUPS)==43
R28N={k[:2]:k for k in GROUPS}
KEEP=('00','12','13','19','34','35','41','42')
KEEP_COUNTS={R28N[k]:len(GROUPS[R28N[k]]) for k in KEEP}
assert all(KEEP_COUNTS.values()) and len(R28N)==43
REWORK=('01','02','03','04','05','06','07','08','15','16','17','21','25')
for k in REWORK: GROUPS[R28N[k]].clear()
def G(k):return R28N[k]
# Road5 at the genuine R26 site15. Its actual LEFT-SCREEN frontage is R bank.
roadPoint,F,S=frame(5,.875)
edge=roadPoint['right']
def P(t,d,h):
    # t follows source race, d is STRICTLY OUTBOARD. Y is actual world height.
    return add(add(edge,mul(F,t)),add(mul(S,d),(0,tideY+h-edge[1],0)))
def wedge(g,near,far,matTop,matFront,matBack):
    # Two longitudinal profiles, each 4 corners; sealed genuine thickness.
    for j in range(4):
        k=(j+1)%4
        quad(g,near[j],near[k],far[k],far[j],
             (matFront if j==0 else matTop if j==1 else matBack),False)
    quad(g,near[3],near[2],near[1],near[0],matBack,False)
    quad(g,far[0],far[1],far[2],far[3],matBack,False)
def channel_level(t):
    # Legitimate upper-to-lower gravitational descent, not a horizontal cyan band.
    x=max(0.,min(1.,(t+12.)/32.))
    smooth=x*x*(3.-2.*x)
    return 28.0-21.0*smooth
def mouth_width(t):
    return 58.+13.*math.sin((t+121.)/242.*math.pi)
# CRITICAL: A continuous sculpted rear rock MASS, enclosing the open water void.
# Its five large asymmetric structural silhouette beats are NOT rows of flat bands.
# No gray near-camera slope inside 55m of the original road edge.
R28_T_STATIONS=(-131.,-105.,-72.,-43.,-20.,0.,26.,53.,84.,118.)
profiles=[]
for i,t in enumerate(R28_T_STATIONS):
    curl=math.sin(t*.019)*11. + math.sin(t*.047)*4.
    inner=140. + curl
    crest=inner+43.+11.*math.sin(.5+i*.77)
    far=crest+52.+6.*math.cos(i*.8)
    top=56.+25.*math.sin(.59+i*.64)+12.*math.sin(.3+i*1.62)
    bottom=channel_level(t)-38.
    profiles.append((P(t,inner,bottom),
                     P(t,inner,channel_level(t)+17.+8.*math.cos(i*.7)),
                     P(t,crest,top),
                     P(t,far,top-16.)))
for i in range(len(R28_T_STATIONS)-1):
    g=G('21') if i<5 else G('25')
    wedge(g,profiles[i],profiles[i+1],
          ('chalk','saltstone','shale','moss')[i%4],
          ('basalt','deepstone','shale')[i%3],'deepstone')
    # Deep rock-cut ravines are real openings between buttresses, not noisy wallpaper.
    if i in (1,4,7):
        a,b=profiles[i],profiles[i+1]
        tri(G('01'),a[0],b[0],a[2],'deepstone')
        tri(G('01'),a[2],b[0],b[1],'basalt')
# Waterway exists as a broad sinuous 65-90m channel with visible base/fall.
# The near bank is physically LOWER than the camera road, leaving air/sky.
ts=[-132.+i*(252./28.) for i in range(29)]
for i in range(28):
    a,b=ts[i:i+2]
    for j in range(7):
        def flow(t,strip):
            alpha=strip/7.
            d=62.+mouth_width(t)*alpha+4.*math.sin(t*.018+alpha*2.4)
            h=channel_level(t)+.6*math.sin(.22*t+alpha*10.)+1.1*math.sin(t*.06+alpha*13.)
            return P(t,d,h)
        u,v,w,z=flow(a,j),flow(a,j+1),flow(b,j+1),flow(b,j)
        mat=('foam' if -15<a<35 and j%2==0 else
             'shallows' if j in (0,6) else 'tide')
        quad(G('03'),u,v,w,z,mat,False)
        if -16<a<35 and j in (1,3,5):
            # Triangular plunging froth with physical normals, not decal texture.
            tri(G('05'),P(a,65.+j*8.,channel_level(a)+1.),
                P(b,69.+j*8.,channel_level(b)+2.5),
                P((a+b)*.5,69.+j*8.,channel_level((a+b)*.5)+3.),'foam')
# Low discontinuous shoreline bedrock foundations near the B48, not a gray ramp.
# Longitudinally-separated rock fingers lead into water, preserving open view.
for i,(t,l,r,peak) in enumerate((
    (-108.,-120.,-84.,8.),(-48.,-59.,-25.,14.),
    (37.,20.,63.,12.),(99.,86.,113.,9.))):
    A=[P(l,43.,-18.),P(l,54.,3.),P(l,72.,peak),P(l,81.,-19.)]
    B=[P(r,44.,-18.),P(r,53.,5.),P(r,74.,peak-3.),P(r,82.,-19.)]
    wedge(G('01'),A,B,'dunestone','basalt','deepstone')
    # Rooted darker toe gives depth instead of a diagonal gray plane to the sky.
    tri(G('02'),P(l,68.,-20.),P(r,71.,-20.),P(r,77.,-12.),'shale')
# Single excavated hydraulic THROAT: its walls are paired rock caissons
# 100m apart (one roadside, one cliff-side); there is NO roof/lintel.
for t0,t1,d0,d1,top in (
    (-14.,20.,51.,67.,40.),
    (-14.,20.,138.,160.,57.)):
    a=[P(t0,d0,-39.),P(t0,d0,top),P(t0,d1,top+5.),P(t0,d1,-40.)]
    b=[P(t1,d0,-39.),P(t1,d0,top-4.),P(t1,d1,top+2.),P(t1,d1,-40.)]
    wedge(G('06'),a,b,'saltstone','basalt','deepstone')
    # Hydraulic footing actually reaches the river bed.
    quad(G('04'),P(t0,d0,-35.),P(t1,d0,-35.),
         P(t1,d0,channel_level(t1)+1.),P(t0,d0,channel_level(t0)+1.),
         'weathered_iron',False)
# A visibly descending broken spill, between wall-founded gate jambs.
for k in range(15):
    d0=68.+(65.*k/15.); d1=68.+(65.*(k+1)/15.)
    a=P(-12.,d0,channel_level(-12.)+1.)
    b=P(-12.,d1,channel_level(-12.)+1.)
    c=P(23.,d1,channel_level(23.)+1.)
    d=P(23.,d0,channel_level(23.)+1.)
    quad(G('05'),a,b,c,d, 'foam' if k%3!=0 else 'shallows',False)
# Keep open movable-leaf geometry attached to its real caissons and above water.
# It is scenery only, not a new physical B51 device.
for d,sign in ((61.,-1.),(148.,1.)):
    root=P(3.,d,-20.)
    head=P(3.,d,49.)
    beam(G('07'),root,head,2.6,'oxidized')
    beam(G('08'),P(-3.,d,-12.),P(7.,d,42.),1.5,'copper')
    tri(G('07'),P(1.,d,10.),P(1.,d,35.),P(9.,d+sign*8.,23.),'darksteel')
# Quay: thick longitudinal buttressed embankment rooted INTO outer cliff.
# Not an isolated warehouse box or decorative floating arch.
for t0,t1 in ((36.,70.),(70.,106.)):
    a=[P(t0,149.,-29.),P(t0,149.,12.),P(t0,182.,18.),P(t0,191.,-32.)]
    b=[P(t1,150.,-29.),P(t1,149.,12.),P(t1,187.,20.),P(t1,197.,-34.)]
    wedge(G('15'),a,b,'oxidized','basalt','deepstone')
    # Short robust industrial hydraulic pipes, not horizontal frame beams.
    beam(G('17'),P(t0+8.,184.,7.),P(t0+16.,150.,4.),1.6,'copper')
# Interpretive gap above the harbor: only TWO asymmetrical rooted pylons.
for t,d,h in ((-32.,164.,64.),(93.,181.,55.)):
    base=P(t,d,-35.)
    apex=P(t+9.,d+14.,h)
    beam(G('16'),base,apex,3.2,'weathered_iron')
    beam(G('16'),P(t,d,-12.),P(t-11.,d+31.,15.),1.8,'oxidized')
# No other added colliders; all existing original landmark groups preserved.
assert all(len(GROUPS[R28N[k]])>0 for k in REWORK)
assert all(len(GROUPS[k])==v for k,v in KEEP_COUNTS.items())
assert len(GROUPS)==43 and isinstance(stations,dict) and 'a13-machine-13' in stations
out=Path('test-results/k4ct-r28-one-harbor')
out.mkdir(parents=True,exist_ok=True)
audit={
 'schema':'k4ct-r28-single-integrated-true-blender-harbor-source-v1',
 'source':'R26_GL_site15_Road5_U0.875_Rbank',
 'openSkyAndRoadBufferMeters':43,
 'geometry':'One sinuous broad gravity watercourse, sealed asymmetric rock masses, two separated open sluice caissons, cliff-founded quay',
 'reworkedGroups':{k:len(GROUPS[R28N[k]]) for k in REWORK},
 'protectedGroups':KEEP_COUNTS,
 'originalB48':7,'originalB51':28,'newColliders':0,
 'formalARTAdopted':0,'slope2DNAmeters':0,
 'ART':'HOLD','HUMAN':'HOLD','SAT':'HOLD','CCD':'HOLD','FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD',
 'needsOriginalGameRAW':True
}
(out/'R28_SCENE_MANIFEST.json').write_text(json.dumps(audit,indent=2)+'\n')
print('R28_REAL_DCC_VOLUME_SOURCE_RESEARCH_ONLY',json.dumps(audit))

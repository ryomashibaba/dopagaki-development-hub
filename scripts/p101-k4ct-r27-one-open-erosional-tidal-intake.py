"""R27 research-only: ONE source-camera visible, open, carved tidal intake.
The geometry is genuine Blender polygons generated in an ISOLATED temporary
copy of the verified R12A author. No image mockups, camera changes, B51 edits,
new colliders or formal ART approval. Reject on actual Chromium source RAW.
"""
import json, math
from pathlib import Path

assert site['sourceGameBlob']=='af076d67492a677d2235e4730aef8cdf4808e106'
assert site['researchPhysicalRoad5SHA256']=='4957a0e1ffb1a394c4bbaa2c502caad3fdec219c9713073f5236d7bbb6ab4e2b'
assert site['originalB48Count']==7 and site['originalB51Count']==28 and site['newColliders']==0
assert len(GROUPS)==43
N={name[:2]:name for name in GROUPS}
protected_ids=('00','12','13','19','34','35','41','42')
protected={N[i]:len(GROUPS[N[i]]) for i in protected_ids}
assert all(protected.values())
rework_ids=('03','04','05','06','07','08','15','16','17','21','25')
for i in rework_ids: GROUPS[N[i]].clear()
G=lambda i:N[i]

def shore(idx,u,bank,d,y=0):
    p,fw,side=frame(idx,max(.002,min(.998,u)))
    return add(offset_edge(p,side,d,bank),(0,y,0))

def vec(idx,u,bank):
    p,fw,side=frame(idx,u)
    return fw, side if bank=='R' else mul(side,-1)

def triangulated_bank(g,idx,bank):
    # Single continuous, irregular non-coplanar sculpted rock mass, no stacked
    # slab ribbons or repeated horizontal cliff ledges.
    count=25
    strips=(24,42,69,104,149)
    for i in range(count):
        for j in range(len(strips)-1):
            def point(si,sj):
                u=(si+.015)/count
                d=strips[sj]+6*math.sin(u*(8.7+sj*.39)+idx*.83+sj*1.3)
                p,fw,side=frame(idx,u)
                edge=p['right' if bank=='R' else 'left']
                h=(-24 + .31*d +
                   8*math.sin(u*7.9+sj*.41+idx*.19) +
                   6*math.sin(u*17.6-sj*.73+idx*1.5) +
                   (3 if sj==3 else 0))
                return add(offset_edge(p,side,d,bank),(0,h,0))
            a=point(i,j);b=point(i+1,j);c=point(i+1,j+1);d=point(i,j+1)
            m=('basalt','slate','shale','dunestone')[(i//4+j+idx)%4]
            if (i+j)%2:
                tri(g,a,b,d,m);tri(g,b,c,d,m)
            else:
                tri(g,a,b,c,m);tri(g,a,c,d,m)
    # The shore is anchored to the live original physical road edge, but
    # no independent road surface or imaginary safe lane is added.

for index in (5,6):
    triangulated_bank(G('21'),index,'L')
    triangulated_bank(G('25'),index,'R')

# A genuine 3D undulating tidal reach: broad connected nonplanar triangles,
# with faceted reflective and shallow zones, rather than a flat cyan strip.
for idx in (5,6):
    segments=36
    offsets=(61,96,151,248,370)
    for k in range(segments):
        for band in range(len(offsets)-1):
            def wpt(t,j):
                u=.015+.970*t/segments
                d=offsets[j]+8*math.sin(5.5*u+idx*.9+j*.7)
                p,fw,side=frame(idx,u)
                bank=edge=offset_edge(p,side,d,'R')
                level=tideY+11+2.8*math.sin(u*19+j*1.67)+1.6*math.sin(u*47-j*2)
                return (bank[0],level,bank[2])
            a,b,c,d=wpt(k,band),wpt(k+1,band),wpt(k+1,band+1),wpt(k,band+1)
            mat=('shallows','tide','tide','deepstone')[band]
            if (k+band)%2:
                tri(G('03'),a,b,d,mat);tri(G('03'),b,c,d,mat)
            else:
                tri(G('03'),a,b,c,mat);tri(G('03'),a,c,d,mat)
# Shore erosion seam only where source current changes direction.
for idx,u in ((5,.65),(5,.86),(6,.26),(6,.69)):
    a=shore(idx,u,'R',39,-23)
    b=shore(idx,u,'R',81,-7)
    c=shore(idx,min(.996,u+.035),'R',104,8)
    tri(G('04'),a,b,c,'shale')
    tri(G('04'),a,c,shore(idx,min(.996,u+.035),'R',41,-17),'basalt')

# SINGLE functional hero follows actual R26 GL-proven site 15 65.25-65.60s.
# R26 32m amber solid blocked left foreground (11.4%). Here there is NO solid
# box or lintel: a hollow inclined floodway portal, low, irregular, and founded.
index,u,bank=5,.89,'R'
p,forward,side=frame(index,u)
landward=offset_edge(p,side,42,bank)
upstream=add(landward,(0,2,0))
axis=side
def apoint(theta, radius, depth, drop=0):
    return add(upstream,add(mul(forward,radius*math.cos(theta)),
       add(mul(axis,depth),
       (0,drop+radius*.82*math.sin(theta)-6))))
# A multi-faceted, thick, open arch with a negative-space throat. The light
# beneath stays unobstructed to preserve original intake/control landmarks.
archSegments=28
for i in range(archSegments):
    a=math.pi*i/archSegments;b=math.pi*(i+1)/archSegments
    # Four tapered surfaces at each segment actually enclose an arched 3D rib.
    quad(G('06'),apoint(a,18,0),apoint(b,18,0),
        apoint(b,22,0),apoint(a,22,0),'saltstone',False)
    quad(G('06'),apoint(a,18,11),apoint(b,18,11),
        apoint(b,22,11),apoint(a,22,11),'weathered_iron',False)
    quad(G('06'),apoint(a,22,0),apoint(b,22,0),
        apoint(b,22,11),apoint(a,22,11),'basalt',False)
    quad(G('06'),apoint(a,18,0),apoint(b,18,0),
        apoint(b,18,11),apoint(a,18,11),'slate',False)
# Rock-founded buttresses are raked rather than vertical floating pillars.
for sign in (-1,1):
    root=add(upstream,add(mul(forward,sign*19),(0,-34,0)))
    crown=add(upstream,add(mul(forward,sign*18),
                               add(mul(axis,6),(0,2,0))))
    beam(G('06'),root,crown,2.3,'basalt')
    cap=add(upstream,add(mul(forward,sign*20),
                              add(mul(axis,8),(0,8,0))))
    beam(G('15'),crown,cap,1.1,'weathered_iron')
# Sculpted asymmetric caisson cheek blocks, always on the shore not over road.
for sign in (-1,1):
    b=add(upstream,add(mul(forward,sign*24),
                           add(mul(axis,8),(0,-13,0))))
    c=add(b,add(mul(axis,19),(0,-12,0)))
    e=add(b,add(mul(forward,sign*6),(0,9,0)))
    f=add(e,add(mul(axis,19),(0,-8,0)))
    tri(G('15'),b,c,e,'slate')
    tri(G('15'),c,f,e,'dunestone')
    tri(G('15'),e,f,add(e,(0,-28,0)),'basalt')

# Flow descends INSIDE the actual portal, not far offshore where R24 failed.
# Each water strip is sloped, has real cross-flow variation and independently
# shaded turbulence, yet adds no physical collider.
flowStart=add(upstream,add(mul(axis,6),(0,-7,0)))
flowEnd=add(upstream,add(mul(axis,50),(0,-28,0)))
for i in range(24):
    q0=-13+26*i/24;q1=-13+26*(i+1)/24
    def flow(t,q):
        curl=.8*math.sin(t*10+q*.45)
        return add(mix(flowStart,flowEnd,t),
                   add(mul(forward,q),(0,curl,0)))
    a,b=flow(0,q0),flow(0,q1)
    c,d=flow(1,q1),flow(1,q0)
    quad(G('05'),a,b,c,d,'shallows' if i%4 else 'foam',False)

# TWO actuating flood leaves are open, slender and actually connected to arch;
# no obstacle spawns, new moving hazards, long artificial lintels or fake doors.
for sign in (-1,1):
    hinge=add(upstream,add(mul(forward,sign*14),(0,-11,0)))
    tip=add(hinge,add(mul(axis,12),(0,13,0)))
    fin=add(tip,add(mul(forward,sign*4),(0,-7,0)))
    tri(G('07'),hinge,tip,fin,'oxidized')
    beam(G('08'),add(hinge,(0,-8,0)),tip,1.0,'copper')

# Short true pressure connection toward the PRESERVED original intake group34
# (not a decorative second turbine or another moving B51 hazard).
pipeA=add(upstream,add(mul(axis,10),(0,-9,0)))
pipeB=shore(5,.916,'R',64,-6)
beam(G('17'),pipeA,pipeB,2.2,'copper')
for t in (.27,.73):
    support=mix(pipeA,pipeB,t)
    beam(G('17'),add(support,(0,-21,0)),support,1.5,'weathered_iron')

# Small open control catwalk beside intake, no roofed shipping sheds or slabs.
f1=add(upstream,add(mul(forward,-17),
                    add(mul(axis,22),(0,2,0))))
f2=add(upstream,add(mul(forward,17),
                    add(mul(axis,22),(0,2,0))))
beam(G('16'),f1,f2,1.1,'oxidized')
beam(G('16'),add(f1,(0,-7,0)),f1,1.4,'basalt')
beam(G('16'),add(f2,(0,-7,0)),f2,1.4,'basalt')
# A single tiny signal linked to the operated gate, subordinate to tower12.
signal=add(upstream,add(mul(forward,-20),
                        add(mul(axis,25),(0,8,0))))
tri(G('15'),signal,add(signal,(0,3,0)),
    add(signal,mul(axis,2)),'amber')

assert len(GROUPS)==43
assert all(len(GROUPS[N[i]])>0 for i in rework_ids)
assert all(len(GROUPS[name])==n for name,n in protected.items())
assert site['newColliders']==0
print('R27_ONE_HOLLOW_FOUNDED_TIDAL_INTAKE_BLENDER_SCENE',
 json.dumps({'sourceRoad5U':u,'bank':bank,'siteMarkerRealGL':15,
 'edited':{i:len(GROUPS[N[i]]) for i in rework_ids},
 'protected':protected,'originalB48':7,'originalB51':28,
 'newColliders':0,'formalARTAdopted':0,'needsActualGameRAWReview':True}))

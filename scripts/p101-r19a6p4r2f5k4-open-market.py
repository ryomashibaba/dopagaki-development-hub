"""K4: one Road0 OPEN MARKET geometry study in native Blender, not ART approval.
Physical source road stays immutable. Shapes join existing editable city mesh.
Coordinates use the actual Road0 B48 tangent/edge at u=.75, right +70m.
Neither original game collider nor a fake player surface is added.
"""
import math

def add_open_market(addloft, frame):
    edge, side, along, up = frame({"road":0,"side":1},.75)
    origin=edge+side*70.0
    count=0
    points=[]
    def p(x,y,z):
        assert -45<=x<=45 and -32.5<=y<=32.5 and -2<=z<=32.0,(x,y,z)
        points.append((x,y,z))
        return origin+along*x+side*y+up*z
    def quad(x0,x1,y0,y1,z):
        return [p(x0,y0,z),p(x1,y0,z),p(x1,y1,z),p(x0,y1,z)]
    def block(x0,x1,y0,y1,z0,z1,color):
        nonlocal count
        assert x1>x0 and y1>y0 and z1>z0
        addloft([quad(x0,x1,y0,y1,z0),quad(x0,x1,y0,y1,z1)],color)
        count+=1
    def folded_roof(tag,x0,x1,y0,y1,z_front,z_back,crest,color):
        nonlocal count
        n=20
        sections=[]
        for i in range(n+1):
            t=i/n;x=x0+(x1-x0)*t
            lift=crest*math.sin(math.pi*t)**1.4
            front=z_front+lift
            rear=z_back+.42*lift
            sections.append([p(x,y0,front),p(x,y1,rear),
              p(x,y1,rear-1.1),p(x,y0,front-1.1)])
        addloft(sections,color)
        count+=1
    # Genuine open-to-sky 20m central walk: not an overhead roof or painted hole.
    # Floor exists only as two disconnected outboard retail grounds + rear crossing.
    block(-44,-11,-29.5,29,-1.2,.85,0)
    block(12,43,-28.5,29,-1.2,.85,0)
    block(-11,12,19,29,-1.2,.85,1)
    # Two substantially unequal inhabitable market wings, not paired cottages.
    # Wide fronts face the road: only REAR portions carry solid walls.
    for k,(x0,x1,y0,y1,roof,peak,color) in enumerate((
        (-42,-12,5,29,14.2,9.0,4),
        (13,42,7,30,19.6,10.8,1))):
        folded_roof("wing"+str(k),x0,x1,y0,y1,roof,roof+2.6,peak,color)
        block(x0,x1,y1-2.2,y1,1,roof-4.2,2)
        # Inhabited staggered balconies: no all-front high wall.
        block(x0+3,x1-3,y0+5,y1-4,5.6,7.0,3 if k==0 else 4)
        # Only two genuine supports per wing, leave front arcade visibly open.
        for x in (x0+3.1,x1-3.1):
            block(x-.75,x+.75,y0+2,y0+3.5,.85,roof-1.3,0)
    # A THIRD, lower curved maker shed counters the two-wing silhouette.
    folded_roof("maker", -32,-12,-27,-9,8.6,12.0,4.9,3)
    block(-32,-4,-27,-25.5,.85,7.1,2)
    block(-29,-10,-22,-14,2.1,3.25,4)
    # Irregular street market counters with actual passable gaps between units.
    for x0,x1,y0,y1,h,c in (
       (-39,-32,-15,-8,3.3,4),(-29,-20,-6,0,4.1,1),
       (19,28,-15,-9,3.6,3),(30,40,-3,4,2.9,4)):
        block(x0,x1,y0,y1,.85,h,c)
        block(x0,x1,y1-1,y1,h,h+2.9,2)
    # Terraced edge, split and curved in plan instead of a long flat portal.
    for i in range(8):
        x0=-44+i*5.1;x1=x0+5.2
        y=29.0+.7*math.sin(i*.79)
        block(x0,x1,y-1.3,y,0,3.0+1.2*math.sin(i*.46)**2,1)
    # Actual architectural void: no candidate mesh within the open-air
    # central x[-10,10], y[-15,15], above 3m. No proof of human access.
    assert not any(-10<x<10 and -15<y<15 and z>3 for x,y,z in points)
    assert count>=24
    assert min(q[0] for q in points)>=-44 and max(q[0] for q in points)<=43.1
    return {
       "programme":"ROAD0_OPEN_MARKET_SINGLE_CANDIDATE",
       "originalRoad":0,"originalRoadU":.75,"side":"right",
       "offsetFromOriginalEdgeM":70,"nominalEnvelopeM":[90,65,32],
       "meshModules":count,"generatedControlVertices":len(points),
       "minLocalXYZ":[min(q[j] for q in points) for j in range(3)],
       "maxLocalXYZ":[max(q[j] for q in points) for j in range(3)],
       "actuallyRooflessCentralCourt":True,
       "candidateSpecificB48SAT":"NOT_RUN",
       "candidateSpecificB51CCD":"NOT_RUN",
       "terrainAndHumanWalkability":"NOT_VERIFIED",
       "actualPixelSemantics":"NOT_REVIEWED",
       "ART":"HOLD","sourcePhysicsChanged":False,
       "newColliders":0
    }

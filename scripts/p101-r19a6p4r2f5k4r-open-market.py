"""K4R: one architectural redesign of the SAME Road0 market, not additional candidates.
The source Road0 B48 @u=.75 right edge +70m, camera, B51, 240Hz physics,
collision, original GLB city geometry and all previous rejected studies are immutable.
All geometry is genuine editable native Blender world geometry: NOT walkability proof.
"""
import math

def add_open_market(addloft, frame):
    edge, side, along, up = frame({"road":0,"side":1},.75)
    origin=edge+side*70.0
    modules=0
    pts=[]
    programme=[]
    def p(x,y,z):
        assert -45<=x<=45 and -32.5<=y<=32.5 and -1.5<=z<=32,(x,y,z)
        pts.append((x,y,z))
        return origin+along*x+side*y+up*z
    def quad(x0,x1,y0,y1,z):
        return [p(x0,y0,z),p(x1,y0,z),p(x1,y1,z),p(x0,y1,z)]
    def block(x0,x1,y0,y1,z0,z1,c,tag):
        nonlocal modules
        assert x1>x0 and y1>y0 and z1>z0
        addloft([quad(x0,x1,y0,y1,z0),quad(x0,x1,y0,y1,z1)],c)
        modules+=1
        programme.append(tag)
    def shell(x0,x1,y0,y1,zfront,zrear,crest,c,tag):
        nonlocal modules
        assert x1>x0 and y1>y0
        rings=[]
        for i in range(31):
            t=i/30
            x=x0+(x1-x0)*t
            s=math.sin(t*math.pi)
            shift=2.2*s*s
            zf=zfront+crest*s**1.3
            zr=zrear+0.33*crest*s**1.7
            rings.append([
                p(x,y0+shift,zf), p(x,y1-1.3*s,zr),
                p(x,y1-1.3*s,zr-2.7),
                p(x,y0+shift,zf-2.7)])
        addloft(rings,c)
        modules+=1
        programme.append(tag)
    # Continuous VISUAL (noncolliding) plaza floor: three programmatic bands
    # and a physically open-to-sky center; public walking is NOT certified.
    block(-44,-11,-30,30,-1.2,.85,0,"western-visible-plaza-deck")
    block(11,44,-30,30,-1.2,.85,0,"eastern-visible-plaza-deck")
    block(-11,11,-30,-15,-1.2,.85,1,"forecourt-visible-connection")
    block(-11,11,-15,15,-1.2,.85,1,"roofless-center-visible-ground")
    block(-11,11,15,30,-1.2,.85,1,"rear-visible-connection")
    # A distinctly asymmetrical sculptural pair of inhabitable, lifted
    # folding building ROOFS: one tall overhang, one low/deep canopy.
    # Their CENTER gap is a real 23m wide opening, not a shader cutout.
    shell(-44,-13,2,29,21.8,11.2,6.3,3,"western-30m-folded-deep-shell")
    shell(12,44,-5,30,27.0,15.0,4.3,4,"eastern-31m-high-terraced-shell")
    # Separate short low apron wings, WITHOUT a continuous giant transverse
    # portal, curtain wall, artificial roof across the court, or column row.
    shell(-43,-19,-30,-19,11.3,7.8,3.2,1,"low-western-trading-terrace")
    shell(22,43,-30,-19,15.2,10.0,2.3,2,"southern-eastern-terrace")
    # Three different elevations of OBSERVABLE inhabited architectural strata.
    # Independent offsets visibly expose under-roof depth from a moving camera.
    for x0,x1,y0,y1,z0,z1,c,tag in (
      (-43,-17,-18,21,3.4,4.8,1,"west-raised-first-street"),
      (-42,-23,-10,25,8.3,9.7,2,"west-cutback-gallery"),
      (-38,-28,3,27,13.3,14.6,0,"west-high-inhabited-bridge"),
      (16,44,-24,23,4.2,5.8,3,"east-long-market-street"),
      (20,44,-13,28,10.4,11.9,1,"east-interior-upper-deck"),
      (30,44,2,28,16.6,17.8,2,"east-short-open-terrace"),
      (-43,-21,-30,-21,1.8,3.2,4,"western-roadside-walk"),
      (20,43,-30,-23,2.7,4.1,3,"eastern-roadside-walk"),
    ):
        block(x0,x1,y0,y1,z0,z1,c,tag)
    # Large NON-REPETITIVE concave/stepped front volumes, enough elevation to
    # read buildings rather than tiny freestanding kiosks under old frames.
    for x0,x1,y0,y1,z0,z1,c,tag in (
      (-43,-34,13,29,.85,18.8,2,"west-deep-back-volume"),
      (-23,-14,16,29,.85,13.5,0,"west-cutback-volume"),
      (33,43,14,30,.85,24.5,2,"east-upper-inhabited-core"),
      (15,23,10,29,.85,14.3,4,"east-asymmetric-inner-core"),
      (-41,-33,-22,-18,.85,9.2,3,"west-foreground-inhabited-block"),
      (33,42,-21,-16,.85,12.3,2,"east-south-inhabited-block"),
    ):
        block(x0,x1,y0,y1,z0,z1,c,tag)
    # Visual circulation: split geometrically into a non-symmetric set of
    # terraces and broad steps, not a decorative line or repeated colonnade.
    for x0,x1,y0,y1,z0,z1,c,tag in (
      (-44,-29,-17,-7, .85,2.2,1,"west-plaza-step-one"),
      (-42,-28,-8, 1, 2.2,3.7,1,"west-plaza-step-two"),
      (-40,-29,0, 9, 3.7,4.9,1,"west-plaza-step-three"),
      (26,44,-23,-12,.85,2.5,4,"east-deck-step-one"),
      (29,43,-12,-4,2.5,4.2,4,"east-deck-step-two"),
      (31,44,-3,6,4.2,5.8,4,"east-deck-step-three"),
      (-11,11,19,30,.85,1.3,3,"rear-exposed-public-link"),
    ):
        block(x0,x1,y0,y1,z0,z1,c,tag)
    # Different-scale trading frontage, consciously NOT cottage/shed roofs.
    for x0,x1,y0,y1,z0,z1,c,tag in (
      (-32,-22,-29,-25,.85,4.1,4,"west-stall-counter"),
      (-18,-13,-28,-21,.85,5.1,2,"west-maker-unit"),
      (13,20,-29,-24,.85,3.8,3,"east-shade-counter"),
      (24,33,-26,-22,.85,4.8,1,"east-shade-counter-large"),
    ):
        block(x0,x1,y0,y1,z0,z1,c,tag)
    # No modelled high geometry anywhere in the central accessible-look
    # region. Vertex test is necessary but insufficient for full collision.
    assert not any(-10<x<10 and -15<y<15 and z>3.0 for x,y,z in pts)
    assert len(programme)==modules and modules>=29
    assert max(v[2] for v in pts)<=32
    return {
      "programme":"ROAD0_SAME_ONE_OPEN_MARKET_K4R_ARCHITECTURAL_REDESIGN",
      "originalRoad":0,"originalRoadU":.75,"side":"right",
      "offsetFromOriginalEdgeM":70,"nominalEnvelopeM":[90,65,32],
      "meshModules":modules,"generatedControlVertices":len(pts),
      "architecturalProgramme":programme,
      "minLocalXYZ":[min(v[j] for v in pts) for j in range(3)],
      "maxLocalXYZ":[max(v[j] for v in pts) for j in range(3)],
      "actuallyRooflessCentralCourt":True,
      "visibleFloorIsNotCollisionSurface":True,
      "candidateSpecificB48SAT":"NOT_RUN",
      "candidateSpecificB51CCD":"NOT_RUN",
      "terrainAndHumanWalkability":"NOT_VERIFIED",
      "actualPixelSemantics":"NOT_REVIEWED",
      "ART":"HOLD","sourcePhysicsChanged":False,"newColliders":0
    }

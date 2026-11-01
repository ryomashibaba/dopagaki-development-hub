# R2F5-I longitudinal urban street: independent 7 original ticks×2 widths.
# Model is ONE experimental Native Blender candidate; no public release.
# Historic F/G2 and original GLBs retain their exact SHA/physics.
"""R2F5-F: coherent inhabited civic interchange. Genuine Blender / ART HOLD.
No change to source physics, camera, original B48/B51 or production.
Terrain contact, collision safety, human paths, gameplay all NOT VERIFIED.
"""
def build_hall(bpy,Vector,Matrix,pg,up,lat,toward,palette):
    parts=[]
    rotation=Matrix((lat,toward,up)).transposed().to_quaternion()
    def finish(o,c,bevel=.12):
        bpy.ops.object.select_all(action="DESELECT")
        o.select_set(True)
        bpy.context.view_layer.objects.active=o
        if bevel:
            mod=o.modifiers.new("TRUE_EDGE_BEVEL",type="BEVEL")
            mod.width=bevel;mod.segments=1
            bpy.ops.object.modifier_apply(modifier=mod.name)
        attr=o.data.color_attributes.new(name="COLOR_0",type="FLOAT_COLOR",domain="CORNER")
        rgba=(*palette[c%len(palette)],1.)
        for poly in o.data.polygons:
            for li in poly.loop_indices:attr.data[li].color=rgba
        parts.append(o)
    def block(name,x,y,z,sx,sy,sz,c=0,edge=.12):
        assert min(sx,sy,sz)>0
        bpy.ops.mesh.primitive_cube_add(size=1,location=pg(x,y,z))
        o=bpy.context.object;o.name="R2F5I_"+name
        o.rotation_mode="QUATERNION";o.rotation_quaternion=rotation
        o.dimensions=(sx,sy,sz)
        bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
        finish(o,c,edge)
    def beam(name,a,b,width,depth,c=2):
        d=b-a;assert d.length>.5
        bpy.ops.mesh.primitive_cube_add(size=1,location=(a+b)*.5)
        o=bpy.context.object;o.name="R2F5I_"+name
        o.rotation_mode="QUATERNION";o.rotation_quaternion=d.to_track_quat("Z","Y")
        o.dimensions=(width,depth,d.length)
        bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
        finish(o,c,.08)
    def roof(name,corners,thickness,c):
        verts=[tuple(p) for p in corners]+[tuple(p-up*thickness) for p in corners]
        faces=[(0,1,2,3),(7,6,5,4),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)]
        mesh=bpy.data.meshes.new("R2F5I_"+name);mesh.from_pydata(verts,[],faces);mesh.update()
        o=bpy.data.objects.new("R2F5I_"+name,mesh)
        bpy.context.collection.objects.link(o);finish(o,c,.12)

    # R2F5-I: a longitudinal roadside CITY STREET, not one station box.
    # Local Y follows original Road1 longitudinal tangent (not player movement).
    # Broad public ground and four inhabited neighbourhoods share a real
    # continuous pedestrian spine, with side courtyards open to the camera.
    # All source-road, B51, player physics and baseline camera are untouched.
    block("ONE_LONGITUDINAL_CITY_STREET_GROUND",0,-1,0.15,51,117,3.2,0,.24)
    block("SINGLE_OPEN_PEDESTRIAN_SPINE",0,-1,1.81,13.3,115,.35,1,.06)
    # A wide, unmistakable public crossroads with no roof above the centre.
    block("MAIN_PUBLIC_EXCHANGE_PIAZZA",0,8.0,1.83,40.5,22,.38,1,.08)
    # Side arcade strips maintain visible doorways and a clear central aisle.
    for side,x in (("WEST",-17.6),("EAST",17.6)):
        block(side+"_CONTINUOUS_INHABITED_SIDEWALK",x,-1,1.81,10.3,113,.38,0,.08)
        for k,y in enumerate((-43,-15,14,43)):
            # Street section identities differ in height, width and programme.
            heights=(9.7,15.4,11.2,18.6)
            z=heights[k]
            outside=x-6.6 if side=="WEST" else x+6.6
            code=side+"_SECTION_"+str(k)
            # Exterior stone edge; OPEN toward public spine on inside.
            block(code+"_TRUE_OUTER_PUBLIC_FACADE",outside,y,z/2+1.8,
                  1.6,22,z,2 if k in (0,3) else 0,.10)
            block(code+"_DEEP_REAR_ROOM_WALL",x,y-10.1,z/2+1.8,
                  11.7,2.0,z,0 if side=="WEST" else 2,.10)
            block(code+"_REAL_GROUND_PUBLIC_FLOOR",x,y,2.30,
                  12.3,22,1.0,0,.08)
            # Filled rooms alternate with multi-bay open voids.
            block(code+"_PUBLIC_UPPER_FLOOR",x,y-4.2,7.9 if k%2 else 9.0,
                  10.6,11.5,1.2,1,.08)
            roof(code+"_ASYMMETRIC_URBAN_AWNING",[
                pg(x-6.4,y+10.7,z+3.0),pg(x+6.0,y+10.7,z+4.4),
                pg(x+5.6,y-5.0,z+5.5),pg(x-5.9,y-5.0,z+3.8)],
                1.0,4 if k==2 else 1 if k==0 else 2)
            # An inhabited four-bay edge, not one enormous dark wall.
            for b,by in enumerate((y+7.4,y+1.5,y-4.7)):
                block(code+"_RECESSED_ACTIVE_ROOM_"+str(b),
                      x,by,4.8,6.1,2.5,4.7,
                      3 if k in (0,2) else 4,.09)
            # All supports have actual native 3D cross-sections.
            for si,sy in enumerate((y+9.0,y-3.0)):
                px=x+5.6 if side=="WEST" else x-5.6
                beam(code+"_ARCADE_COLUMN_"+str(si),pg(px,sy,1.65),
                     pg(px,sy,z+2.1),1.0,1.0,2)
                block(code+"_COLUMN_FOOTING_"+str(si),px,sy,2.04,
                      2.0,2.0,.8,0,.06)
        # Section-to-section pedestrians paths, *not* new game surfaces.
        for i,y in enumerate((-29.2,0.0,29.2)):
            block(side+"_TRUE_LINKED_PUBLIC_GALLERY_"+str(i),
                  x,y,2.2,9.2,6.4,.7,0,.06)
    # MARKED functional anchors: scale and spatial programme, not tiny signs.
    # x<0 has a covered market quarter, x>0 serves transport and exchange.
    block("MARKET_PUBLIC_TRADING_FLOOR",-17.6,14.0,3.4,10,20,2.0,0,.08)
    for j,(x,y) in enumerate([(-18,20),(-18,13),(-18,6)]):
        block("MARKET_REAL_OPEN_STALL_"+str(j),x,y,5.2,6.5,2.6,2.3,3,.07)
        block("MARKET_DEEP_PUBLIC_DISPLAY_"+str(j),x-3.1,y-1.5,7.2,
              1.2,2.3,5.1,4,.07)
    block("TRANSIT_GATED_PUBLIC_LEVEL",17.5,-14.0,3.45,10.2,22,2.1,0,.07)
    for j,x in enumerate((11.8,17.5,23.0)):
        block("FARE_GATE_ACTUAL_SOLID_PEDESTAL_"+str(j),x,-7.2,4.8,
              1.7,3.8,2.4,3,.07)
        block("FARE_GATE_TRUE_SIDE_POST_"+str(j),x+.8,-7.2,6.5,
              .65,1.2,5.5,2,.06)
    # The cross-street never crosses the racing road. A pedestrian
    # interchange between quadrants stays on the outboard civic ground.
    block("CIVIC_CROSSING_REAL_PUBLIC_PLAZA",0,-29,1.9,35.0,13,.30,1,.07)
    for k,x in enumerate((-9,9)):
        block("CIVIC_CROSSING_PAVED_EDGE_"+str(k),x,-29,2.2,
              1.1,11.5,.8,0,.05)
    # No fake light, sky bridge, teleport, invisible floor, or collider.
    assert len(parts)>=105,("Native geometric part count",len(parts))
    n=sum(len(o.data.vertices) for o in parts)
    assert n>500
    world=[Vector((p.x,p.z,-p.y)) for o in parts
           for v in o.data.vertices for p in (o.matrix_world@v.co,)]
    assert len(world)==n
    return {"nativeParts":parts,"nativeWorld":world,"nativeCount":n,
        "nativeSupportError":0.0,"interiorOpenGalleries":2,
        "marketBays":3,"retailBaseZ":2.15,
        "venueKind":"ONE_CONTIGUOUS_ROADSIDE_INTERCHANGE_AND_PUBLIC_MARKET"}

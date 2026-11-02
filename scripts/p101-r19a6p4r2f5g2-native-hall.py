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
        o=bpy.context.object;o.name="R2F5G2_"+name
        o.rotation_mode="QUATERNION";o.rotation_quaternion=rotation
        o.dimensions=(sx,sy,sz)
        bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
        finish(o,c,edge)
    def beam(name,a,b,width,depth,c=2):
        d=b-a;assert d.length>.5
        bpy.ops.mesh.primitive_cube_add(size=1,location=(a+b)*.5)
        o=bpy.context.object;o.name="R2F5G2_"+name
        o.rotation_mode="QUATERNION";o.rotation_quaternion=d.to_track_quat("Z","Y")
        o.dimensions=(width,depth,d.length)
        bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
        finish(o,c,.08)
    def roof(name,corners,thickness,c):
        verts=[tuple(p) for p in corners]+[tuple(p-up*thickness) for p in corners]
        faces=[(0,1,2,3),(7,6,5,4),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)]
        mesh=bpy.data.meshes.new("R2F5G2_"+name);mesh.from_pydata(verts,[],faces);mesh.update()
        o=bpy.data.objects.new("R2F5G2_"+name,mesh)
        bpy.context.collection.objects.link(o);finish(o,c,.12)

    # PRESELECTED G2: no 49m cross-roof or central back wall.
    # Low plaza, deep market and transit on the sides, open central sightline.
    block("CONTIGUOUS_LOW_CIVIC_FOUNDATION",0,0,0,49,35,3,0,.22)
    block("GROUNDED_PUBLIC_FRONT_PLAZA",0,13,1.75,21,8,.4,1,.06)
    block("CLEAR_CENTRAL_PASSAGE",0,-3,1.75,16.8,24,.35,1,.06)
    block("BACK_PEDESTRIAN_CONTINUITY",0,-12,3.2,17,12,1.2,1,.08)
    # True open-air WEST MARKET, differentiated from the eastern fare gates.
    block("MARKET_WEST_INHABITED_SIDE_WALL",-23.1,-5.3,7.3,1.3,22,11.5,2,.12)
    block("MARKET_EAST_OPEN_ARCADE_PIER",-11.3,-5.8,6.1,1.2,21,9.4,2,.12)
    block("MARKET_DEEP_BACK_CORE",-20,-15.4,7.1,7.3,4,11,2,.12)
    block("MARKET_PHYSICAL_LOWER_FLOOR",-17.5,-7.1,2.3,12.7,23.5,.9,0,.09)
    block("MARKET_RECESSED_UPPER_GALLERY",-17.9,-10.2,11.8,11.9,14.1,1.4,1,.10)
    roof("MARKET_OFFSET_ROOF",[
        pg(-24.1,10.9,16),pg(-9.8,10.9,16.8),
        pg(-10,-2.6,18),pg(-24.1,-2.6,16.7)],1.4,4)
    for index,(x,y) in enumerate([(-22.7,8.6),(-10.5,8.6),(-22.7,-2.5),(-10.5,-2.5)]):
        beam("MARKET_TRUE_ROOF_BEARER_"+str(index),pg(x,y,1.5),pg(x,y,14.9),1.05,1.05,2)
        block("MARKET_REAL_FOOTING_"+str(index),x,y,2.05,2.2,2.2,1.1,0,.08)
    for index,y in enumerate((10.2,3.2,-4.8)):
        block("MARKET_VISIBLE_COUNTER_"+str(index),-17.1,y,4.35,6.9,2.5,2.1,3,.09)
        block("MARKET_INHABITED_REAR_BAY_"+str(index),-20.6,y-2.0,6.55,2.1,1.2,4.6,4,.08)
        block("MARKET_OPEN_CANOPY_LEDGE_"+str(index),-16.9,y+.75,5.6,7.4,1.1,.4,1,.05)
    # EAST TRANSIT: open frontage and real ticket-control posts.
    block("TRANSIT_RIGHT_REAR_SERVICE_CORE",20.5,-14,7.6,3.4,7.5,11,2,.12)
    block("TRANSIT_OPEN_EXTERNAL_PIER",22.3,-7.6,6.8,1.3,18.5,10,0,.12)
    block("TRANSIT_REAL_PASSENGER_PLATFORM",16.2,-7.9,2.5,13.1,21.3,1.3,0,.09)
    block("TRANSIT_UPPER_OCCUPIED_GALLERY",17.3,-12.3,12.7,10,10,1.4,1,.12)
    roof("EAST_TERMINAL_OFFSET_CANOPY",[
        pg(9.5,11,12.6),pg(22.3,11,13.7),
        pg(22.3,-4,14),pg(9.5,-4,12.9)],1.3,1)
    for x in (11.4,21.4):
        for y in (8.1,-2.1):
            beam("TRANSIT_TRUE_ROOF_SUPPORT_%.2f_%.2f"%(x,y),
                 pg(x,y,1.5),pg(x,y,11.75),.95,.95,2)
    for index,x in enumerate((11.2,15.9,20.4)):
        block("ACTUAL_FARE_GATE_HOUSING_"+str(index),x,9.6,3.35,2.6,2.9,2.1,3,.09)
        block("ACTUAL_FARE_GATE_POST_"+str(index),x+1,10.1,5,.55,1.2,3.3,2,.05)
    block("PUBLIC_TRANSIT_WAYFINDING_VOLUME",16.1,4.1,10,12.7,1,1.9,4,.08)
    # Behind the unobstructed entry the exchange stands RIGHT of the camera
    # view axis; no opaque 39m centre back-wall is allowed.
    block("OFFSET_REAR_EXCHANGE_REAL_FLOOR",16.3,-19,4,17,8,1.1,0,.10)
    block("REAR_RIGHT_LOBBY_INHABITED_CORE",21.4,-21.2,8.8,6.8,5.2,8.6,2,.11)
    block("REAR_EXCHANGE_WEST_OPEN_POST",9.1,-21,7.8,1,2.1,10.5,2,.09)
    block("REAR_EXCHANGE_EAST_OPEN_POST",23,-20.6,7.8,1,2.1,10.5,2,.09)
    roof("OFFSET_TRANSFER_WAITING_CANOPY",[
        pg(8.5,-14.7,13.1),pg(24.4,-14.7,14),
        pg(24.4,-23.4,14),pg(8.5,-23.4,13.4)],1,4)
    # Genuine low public walkway boundaries, not a solid back wall.
    for index,y in enumerate((7.5,-.3,-8.2)):
        block("WEST_OPEN_COURT_EDGE_"+str(index),-8.35,y,2.32,.9,4.4,.8,0,.05)
        block("EAST_OPEN_COURT_EDGE_"+str(index),8.35,y,2.32,.9,4.4,.8,0,.05)
    for index in range(4):
        block("MARKET_TERRACE_REAL_STEP_"+str(index),-13.1,6-index*1.5,
              2.04+.36*index,2.4,1.6,.45+.2*index,0,.06)
    assert len(parts)>=45,("Native geometric part count",len(parts))
    n=sum(len(o.data.vertices) for o in parts)
    assert n>500
    world=[Vector((p.x,p.z,-p.y)) for o in parts
           for v in o.data.vertices for p in (o.matrix_world@v.co,)]
    assert len(world)==n
    return {"nativeParts":parts,"nativeWorld":world,"nativeCount":n,
        "nativeSupportError":0.0,"interiorOpenGalleries":2,
        "marketBays":3,"retailBaseZ":2.15,
        "venueKind":"ONE_CONTIGUOUS_ROADSIDE_INTERCHANGE_AND_PUBLIC_MARKET"}

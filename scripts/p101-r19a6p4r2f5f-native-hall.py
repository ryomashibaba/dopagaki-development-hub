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
        o=bpy.context.object;o.name="R2F5F_"+name
        o.rotation_mode="QUATERNION";o.rotation_quaternion=rotation
        o.dimensions=(sx,sy,sz)
        bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
        finish(o,c,edge)
    def beam(name,a,b,width,depth,c=2):
        d=b-a;assert d.length>.5
        bpy.ops.mesh.primitive_cube_add(size=1,location=(a+b)*.5)
        o=bpy.context.object;o.name="R2F5F_"+name
        o.rotation_mode="QUATERNION";o.rotation_quaternion=d.to_track_quat("Z","Y")
        o.dimensions=(width,depth,d.length)
        bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
        finish(o,c,.08)
    def roof(name,corners,thickness,c):
        verts=[tuple(p) for p in corners]+[tuple(p-up*thickness) for p in corners]
        faces=[(0,1,2,3),(7,6,5,4),(0,4,5,1),(1,5,6,2),(2,6,7,3),(3,7,4,0)]
        mesh=bpy.data.meshes.new("R2F5F_"+name);mesh.from_pydata(verts,[],faces);mesh.update()
        o=bpy.data.objects.new("R2F5F_"+name,mesh)
        bpy.context.collection.objects.link(o);finish(o,c,.12)

    # A connected true landform, not separated 3-D towers.
    block("SINGLE_INHABITED_PUBLIC_PLINTH",0,0,.2,50.5,36.5,3.2,0,.26)
    block("OPEN_ROADSIDE_MARKET_PLAZA",0,12,1.74,17,10,.38,1,.06)
    block("CONTINUOUS_SOURCE_ENTRANCE_COURT",0,-2,1.73,16.5,24,.38,1,.06)
    block("REAR_INTEGRATED_TRANSFER_TERRACE",0,-15.5,1.9,32,5,.8,0,.1)
    # One 49-metre skyline crossing the architectural ensemble:
    # actually solid thickness, with a 15m clear portal below.
    roof("ONE_UNIFIED_DIAGONAL_STATION_ROOF",[
        pg(-24.5,13.7,15.9),pg(24.3,13.7,18.9),
        pg(23.5,-7.5,21.4),pg(-23.6,-7.5,19.0)],1.55,2)
    block("WEST_INHABITED_TRANSIT_MARKET",-18.4,-.4,8.4,12.8,28.5,12.8,2,.16)
    block("EAST_INHABITED_TRANSIT_LOBBY",17.7,-1.6,8.9,13.2,28.2,13.8,0,.16)
    block("SHARED_PUBLIC_REAR_EXCHANGE",0,-12.2,13.8,39,6.0,2.2,0,.1)
    block("CONTINUOUS_GALLERY_PARAPET",0,-8.8,15.2,39,.9,1.4,1,.09)
    block("WEST_CIVIC_INHABITED_UPPER_LOFT",-14.8,-7.1,18.8,17.8,13.2,6.4,0,.17)
    block("EAST_MARKET_INHABITED_UPPER_LOFT",14.3,-7.1,19.0,18.0,12.2,6.8,2,.17)
    roof("CONNECTED_ASYMMETRIC_CIVIC_ROOF_RETURN",[
        pg(-23.0,-8.0,21.2),pg(23.1,-8.0,22.3),
        pg(19.4,-17.0,20.1),pg(-19.1,-17.0,19.5)],1.18,4)

    # Deep occupied arcade and physically separate entrance openings.
    for code,x,sign in [("WEST",-18,-1),("EAST",17.6,1)]:
        block(code+"_ARCADE_HEAVY_PIER",x+sign*4.7,12.7,6.6,2.9,5.4,9.2,2,.11)
        block(code+"_OPEN_GALLERY_LINTEL",x,12.0,13.1,12.8,5.3,2.0,1,.1)
        block(code+"_ARRIVALS_FLOOR",x,9.0,2.72,12.5,7,.6,0,.07)
        block(code+"_PUBLIC_MARKET_COUNTER",x,7.5,4.65,8.0,2.4,2.3,3,.08)
        block(code+"_CIVIC_MARKET_KIOSK",x,1.1,4.8,7.8,2.3,2.6,4,.08)
        block(code+"_RECESSED_REAR_PUBLIC_ROOM",x,-12,8.2,9.7,1.1,5.5,1,.08)
        block(code+"_TRUE_ARRIVAL_STAIR",x,6.0,2.38,7.5,3.4,.65,0,.04)
        block(code+"_SHARED_INTERIOR_GALLERY",x,-2.4,12.4,10,13.5,1.6,1,.08)
    # Actual structural supports, not floating visual shell.
    for x in (-22.8,22.2):
        for y in (-10.7,7.6):
            beam("CANOPY_SUPPORT_%s_%s"%(x,y),pg(x,y,1.3),pg(x,y,15.0),1.4,1.4,2)
            block("STRUCTURAL_FOOTING_%s_%s"%(x,y),x,y,2.3,2.6,2.6,1.7,0,.08)
    # A spatially open 15m forecourt is left empty between true jambs.
    for k,(x,y) in enumerate([(-9.0,8.1),(9.0,8.1),(-9.0,-5.5),(9.0,-5.5)]):
        block("REAL_INNER_ATRIUM_JAMB_"+str(k),x,y,7.2,1.3,2.0,9.2,1,.07)
    beam("INNER_TRANSFER_EXCHANGE_LINTEL",
        pg(-9.3,-5.5,13.1),pg(9.3,-5.5,13.1),1.1,1.5,2)
    for k,(x,y,w) in enumerate([(-10.4,14,6),(11.0,14,6),(-12,-15,9),(11,-15,9)]):
        block("ACTUAL_GROUND_WAYFINDING_"+str(k),x,y,3,w,1.5,1.7,3,.06)
    for k,x in enumerate((-7.1,-2.4,2.4,7.1)):
        block("ONE_COURT_FLOOR_JOINT_"+str(k),x,11.3,2,2,9,.3,0,.04)
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

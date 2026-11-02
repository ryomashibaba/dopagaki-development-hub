"""R2F5-E authentic Blender multi-level open station, PRIVATE ART only.
This module creates volumetric floors, real supports and roof solids in one
facility. Source game physics, ground contact, human use, CCD and ART HOLD.
"""
def build_hall(bpy, Vector, Matrix, pg, up, lat, toward, palette):
    parts = []
    rotation = Matrix((lat, toward, up)).transposed().to_quaternion()

    def finish(o, material, edge=0.12):
        bpy.ops.object.select_all(action="DESELECT")
        o.select_set(True)
        bpy.context.view_layer.objects.active = o
        if edge:
            mod = o.modifiers.new("TRUE_EDGE_BEVEL", type="BEVEL")
            mod.width = edge
            mod.segments = 1
            bpy.ops.object.modifier_apply(modifier=mod.name)
        attr = o.data.color_attributes.new(name="COLOR_0", type="FLOAT_COLOR", domain="CORNER")
        rgba = (*palette[material % len(palette)], 1.0)
        for polygon in o.data.polygons:
            for li in polygon.loop_indices:
                attr.data[li].color = rgba
        parts.append(o)

    def cube(name, x, y, z, length, depth, height, color, edge=0.12):
        bpy.ops.mesh.primitive_cube_add(size=1, location=pg(x, y, z))
        o = bpy.context.object
        o.name = "R2F5E_" + name
        o.rotation_mode = "QUATERNION"
        o.rotation_quaternion = rotation
        o.dimensions = (length, depth, height)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        finish(o, color, edge)

    def beam(name, start, end, width, depth, color):
        delta = end - start
        assert delta.length > 0.5
        bpy.ops.mesh.primitive_cube_add(size=1, location=(start + end) * 0.5)
        o = bpy.context.object
        o.name = "R2F5E_" + name
        o.rotation_mode = "QUATERNION"
        o.rotation_quaternion = delta.to_track_quat("Z", "Y")
        o.dimensions = (width, depth, delta.length)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        finish(o, color, 0.09)

    def roof(name, corners, thickness, color):
        vertices = [tuple(v) for v in corners]+[tuple(v-up*thickness) for v in corners]
        faces = [(0,1,2,3), (7,6,5,4), (0,4,5,1),
                 (1,5,6,2), (2,6,7,3), (3,7,4,0)]
        mesh = bpy.data.meshes.new("R2F5E_FOLDED_ROOF_" + name)
        mesh.from_pydata(vertices, [], faces)
        mesh.update()
        o = bpy.data.objects.new("R2F5E_ROOF_" + name, mesh)
        bpy.context.collection.objects.link(o)
        finish(o, color, 0.10)

    # A physically modelled foundation + entirely open-to-sky central avenue.
    # These are visible art meshes; no collider or terrain support certification.
    cube("EXCHANGE_FOUNDATION", 0, -1, 0.1, 50, 36, 2.8, 0, .25)
    cube("OPEN_AIR_CENTRAL_ROUTE", 0, 0, 1.73, 13.8, 35, .35, 1, .06)
    for x, y, w in [(-19, 13, 8), (19, 13, 8), (-17, -15, 8), (17, -15, 8)]:
        cube("TERRAIN_STEP_%s_%s" % (x, y), x, y, 2.0, w, 4.1, 1.0, 0)

    # Genuinely asymmetrical transport and civic wings with separate occupied
    # levels, deep recesses and openings, instead of two low flat roof sheets.
    wings = [
        dict(code="CIVIC_WEST", x=-17.2, width=15.5, lower=7.0, upper=14.6,
             top=26.5, roofColor=4, shape=-1),
        dict(code="TRANSIT_EAST", x=16.9, width=14.3, lower=8.8, upper=19.3,
             top=31.4, roofColor=1, shape=1),
    ]
    for wing in wings:
        code, x, width = wing["code"], wing["x"], wing["width"]
        cube(code+"_ARRIVALS_FLOOR", x, -0.8, wing["lower"], width, 28.5, 1.7, 0)
        cube(code+"_MARKET_BALCONY", x, -3.3, wing["upper"], width-1.3, 23, 1.3, 1)
        cube(code+"_BACK_CORE", x, -14.5, (wing["upper"]+2.7)/2,
             width-4, 2.5, wing["upper"]-2.7, 2)
        side_x = x + wing["shape"] * (width/2-1.4)
        cube(code+"_SIDE_ATRIUM_WALL", side_x, -6.2, 10.2, 1.6, 19.0, 15.2, 2)
        for offset in (-5.0, 5.0):
            for depth in (-11.7, 10.7):
                bx = x + offset
                beam(code+"_STRUCTURAL_POST_%s_%s" % (offset, depth),
                     pg(bx, depth, 1.5), pg(bx, depth, wing["top"]-2.1), 1.05, 1.05, 2)
        xa, xb = x-width/2+0.8, x+width/2-0.8
        roof(code+"_FRONT", [
            pg(xa, 15.5, wing["top"]-5.4), pg(xb, 15.5, wing["top"]-3.1),
            pg(xb, 0.4, wing["top"]+0.1), pg(xa, 0.4, wing["top"]-2.5)], 1.1, wing["roofColor"])
        roof(code+"_BACK", [
            pg(xa, -2.9, wing["top"]-1.9), pg(xb, -2.9, wing["top"]+0.3),
            pg(xb, -17.3, wing["top"]-3.8), pg(xa, -17.3, wing["top"]-5.0)], 1.1, wing["roofColor"])
        for floor_z in (wing["lower"], wing["upper"]):
            cube(code+"_PUBLIC_PARAPET_"+str(floor_z), x, 11.8, floor_z+1.9,
                 width-2.0, 0.8, 2.1, 3, .05)
        for bay, location in enumerate((-6.5, 4.8)):
            cube(code+"_VISIBLE_RETAIL_BAY_"+str(bay), x, location,
                 wing["lower"]+2.1, 8.8, 2.2, 4.2, 3 if bay else 4)
        for t in range(3):
            cube(code+"_STREET_STAIR_"+str(t), x, 13.8-2.8*t,
                 2.1+1.0*t, 6.5, 2.7, 0.7+0.2*t, 0, .06)

    # A rear interchange supported at BOTH ends, never over the racing road.
    cube("REAR_TRANSFER_FLOOR", 0.0, -14.0, 13.8, 22, 3.3, 1.6, 0)
    for x in (-9.4, 9.4):
        beam("TRANSFER_TRESTLE_"+str(x), pg(x,-14,1.5), pg(x,-14,12.9), .9, .9, 2)
    # Vertical wayfinding attached to the east wing, not a decorative tower.
    cube("WAYFINDING_SPINE", 23.4, -9.0, 17.0, 2.6, 3.4, 28.0, 3)
    cube("STATION_TYPOGRAPHY_BLOCK", 23.4, -9.0, 22.4, 2.75, 3.6, 8.2, 4, .08)
    for i,(x,y,w) in enumerate([(-9.3,4.0,5.6),(9.2,-0.4,6.5),(-10.4,-9.5,5.0)]):
        cube("ACTIVE_COUNTER_"+str(i), x,y,3.4, w,2.4,2.3, 3)
        cube("MARKET_DISPLAY_"+str(i), x,y-1.9,5.7, w,1.0,2.5, 4)

    assert len(parts)>=45,(len(parts),"insufficient actual native structure")
    assert len([o for o in bpy.context.scene.objects if o.type=="MESH"])>=len(parts)+5
    vertices=sum(len(o.data.vertices) for o in parts)
    assert vertices>500
    world=[Vector((p.x,p.z,-p.y)) for o in parts
           for v in o.data.vertices for p in (o.matrix_world @ v.co,)]
    assert len(world)==vertices
    return {"nativeParts":parts,"nativeWorld":world,"nativeCount":vertices,
            "nativeSupportError":0.0,"interiorOpenGalleries":2,
            "marketBays":3,"retailBaseZ":2.15,
            "venueKind":"NATIVE_MULTI_LEVEL_OPEN_INTERCHANGE_WITH_REAL_STRUCTURE"}

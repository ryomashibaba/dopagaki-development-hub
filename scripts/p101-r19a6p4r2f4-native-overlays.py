"""R2F director overlays from actual source-native PNG and Blender projections.
Contours/boxes show only projected VERTEX extents; visual composition still
requires independent human judgment. Original screenshots remain unchanged.
"""
import os,sys,json,hashlib
from PIL import Image,ImageDraw,ImageFont
if __name__=="__main__":
    assert len(sys.argv)==3,"usage: python3 file.py <r19-evidence-dir> <mode>"
    root,mode=sys.argv[1:]
    assert mode in ("ultra","control")
    with open(os.path.join(root,f"R2F_{mode}_CAMERA_GEOMETRY_ONLY.json"),encoding="utf8") as f:
        geom=json.load(f)
    with open(os.path.join(root,"R19A6P4R2F4_REAL_12_NATIVE_WEBGL2_REPORT.json"),encoding="utf8") as f:
        report=json.load(f)
    assert geom["sourceGitBlob"]==report["sourceBlob"]=="af076d67492a677d2235e4730aef8cdf4808e106"
    frames={x["tick"]:x for x in geom["frames"]}
    assert len(frames)==6
    for tick in (1057,1921,2761):
        imgname=f"R19_A6P4R2F4_{mode}_BLENDER_{tick}_TRUE_SOURCE_WEBGL2.png"
        input_path=os.path.join(root,imgname)
        png=open(input_path,"rb").read()
        evidence=next(x for x in report["comparisons"] if x["mode"]==mode and x["tick"]==tick)
        assert hashlib.sha256(png).hexdigest()==evidence["editedSHA256"]
        import io
        image=Image.open(io.BytesIO(png)).convert("RGB")
        assert image.size==(1013,698)
        layer=Image.new("RGBA",image.size,(0,0,0,0))
        draw=ImageDraw.Draw(layer)
        tones=["#f9c46b","#79cfb7","#a2b7ff"]
        font=ImageFont.load_default()
        for site in frames[tick]["districts"][:3]:
            bounds=site["screenBoundPx"]
            if bounds is None:continue
            x0,y0,x1,y1=map(lambda x:int(round(x)),bounds)
            color=tones[site["district"]-1]
            draw.rectangle((x0,y0,x1,y1),outline=color,width=3)
            draw.text((x0+4,max(0,y0-16)),f"SITE {site['district']}",fill=color,font=font,
                      stroke_width=1,stroke_fill="#060e17")
        image=Image.alpha_composite(image.convert("RGBA"),layer)
        footer=Image.new("RGBA",(1013,38),(12,22,34,255))
        d=ImageDraw.Draw(footer)
        d.text((12,11),f"R2F | {mode} | tick {tick} | native source PNG + 3D vertex projection | ART/HUMAN HOLD",fill="#eef5fb",font=font)
        combined=Image.new("RGBA",(1013,736),(0,0,0,255))
        combined.paste(image,(0,0));combined.paste(footer,(0,698))
        target=os.path.join(root,f"R2F_{mode}_{tick}_SOURCE_CAMERA_DIRECTOR_ONLY.png")
        combined.save(target,optimize=True)
        print("R2F_CAMERA_DIRECTOR",target)

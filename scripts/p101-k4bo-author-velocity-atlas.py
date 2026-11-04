"""K4BO genuine racing surface graphic: author with known B48 camera coords.

High information density at true physical road distances d=0..180m, rather
than merely tracing a few tiny phrases close to the horizon. No borrowed
logos, imagery, gameplay collider nor modification to the seven B48 roads.
"""
import os,sys,json,hashlib,random,math
from PIL import Image,ImageDraw,ImageFont
from math import sin,pi
out=os.path.abspath(sys.argv[sys.argv.index("--out")+1]);os.makedirs(out,exist_ok=True)
W,H=2048,4096
# WORLD ROAD COORDINATES: d is forward from immutable source camera,
# s is camera-lateral. V is bottom-up in Blender texture node, while Pillow
# image Y is top-down, so atlas raster Y=(205-d)/265.
S0=-75.;SPAN_S=180.;D_MAX=205.;SPAN_D=265.
im=Image.new('RGBA',(W,H),(0,0,0,0))
paint=ImageDraw.Draw(im,'RGBA')
def xy(d,s):return (round((s-S0)/SPAN_S*W),round((D_MAX-d)/SPAN_D*H))
def ppoly(coords,color):paint.polygon([xy(d,s) for d,s in coords],fill=color)
def pline(coords,color,width=3):paint.line([xy(d,s) for d,s in coords],fill=color,width=width,joint="curve")
cyan=(56,200,194);amber=(249,158,67);ivory=(221,225,207)
rng=random.Random(740005)
# Authored longitudinal paired speed-channel graphics. Widths adapt to
# reference road right edge (50m at d0, +72m at d170).
for side,center in ((-1,-27),(1,44)):
    for offset,alpha,width in ((0,200,11),(3.5,85,4),(6.3,47,3)):
        curve=[]
        for d in range(-22,201,2):
            # Don't accidentally use a screen-space fixed pixel line as
            # though it were a physical 3D track boundary.
            road_s=center+(.09*d if side>0 else .008*d)
            curve.append((d,road_s+side*offset))
        color=cyan if side<0 else amber
        pline(curve,(*color,alpha),width)
# Road-course diagonal "velocity wakes" are purposefully hand-arranged:
# scale and spacing are in metres in actual original 3D coordinates.
for i,(d,length) in enumerate(((7,9),(19,13),(34,14),(49,16),
                                (65,18),(83,19),(104,19),
                                (124,17),(145,17),(167,15))):
    width=8.1+1.5*sin(i*.8)
    for side,s0 in ((-1,-9),(1,29)):
        jitter=1.8*sin(i*.7+side)
        col=cyan if side<0 else amber
        # Chevron/swept fin rather than rectangular painting.
        ppoly([(d,s0-width+jitter),
               (d+length*.61,s0-2+jitter),
               (d+length,s0+jitter),
               (d+length-3.0,s0+width*.52+jitter),
               (d+length*.45,s0+width*.17+jitter),
               (d-2,s0-width*.58+jitter)],(*col,70+i%3*12))
        # Fine luminous negative-space border within swoop.
        pline([(d+1,s0-width*.65+jitter),
               (d+length*.5,s0+jitter),
               (d+length-2,s0+width*.33+jitter)],
              (*col,140),5)
# Human-readable sector guide graphic at exactly the focus of the near
# screen, not behind the camera and not giant single logo spanning road.
for i,d in enumerate((3,38,73,108,145)):
    band=[]
    for s in range(-28,63,7):
        offs=sin(.11*s+i*.9)*1.2
        band.append([(d+offs,s),(d+1.7+offs,s),
                     (d+1.7+offs,s+4.6),(d+offs,s+4.6)])
    for k,coords in enumerate(band):
        color=ivory if k%3==0 else (cyan if k%3==1 else amber)
        ppoly(coords,(*color,87))
# Camera-tuned track numerals and styling. The actual source camera's
# lateral projection mirrors the raster horizontal axis; flipping only text
# locally preserves the intended road line placements.
fontpath="/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf"
regular="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def word(d,s,title,height_m,rgba):
    font=ImageFont.truetype(fontpath if len(title)<12 else regular,max(16,int(height_m*H/SPAN_D)))
    bounds=paint.textbbox((0,0),title,font=font,anchor="lt")
    width=bounds[2]-bounds[0]+4;h=bounds[3]-bounds[1]+4
    layer=Image.new('RGBA',(max(1,width),max(1,h)),(0,0,0,0))
    ld=ImageDraw.Draw(layer)
    ld.text((-bounds[0]+1,-bounds[1]+1),title,fill=rgba,font=font)
    x,y=xy(d,s)
    if x>=0 and y>=0 and x+width<=W and y+h<=H:
        im.alpha_composite(layer.transpose(Image.Transpose.FLIP_LEFT_RIGHT),(x,y))
# Keep near-camera lettering small and repeated with art-direction hierarchy.
word(12,-16,"05",3.8,(232,232,215,185))
word(17,-15,"S E C T O R",1.7,(91,204,196,165))
word(50,18,"HYPER",3.1,(220,224,218,150))
word(61,19,"RUSH",3.1,(220,224,218,150))
word(102,-16,"QUAY 05",2.1,(240,180,103,144))
word(142,6,"COASTAL",1.6,(99,202,185,127))
# Asymmetric race rhythm on margin, actually visible beside near road:
# low-color pinstripes and numerical marker ticks.
for side in (-1,1):
  for k in range(34):
    d=-12+5.7*k
    s=(-32+.007*d if side<0 else 48+.108*d)
    col=cyan if side<0 else amber
    ppoly([(d,s),(d+3.8,s+side*.8),
           (d+4.6,s+side*1.5),(d+.9,s+side*.7)],(*col,124))
  for d in (15,45,75,105,135,165):
    base=(-35+.007*d if side<0 else 53+.1*d)
    for k in range(7):
      ds=d+k*.8
      ppoly([(ds,base),(ds+.33,base+side*2.4),
             (ds+.8,base+side*2.4),(ds+.47,base)],(240,227,201,84))
# Fine distressed original mask, sparse; avoid random colorful confetti.
pix=im.load()
for k in range(47000):
    x=rng.randrange(W);y=rng.randrange(H)
    if pix[x,y][3]>50 and rng.random()<.24:
        rr=rng.choice((1,1,2))
        paint.ellipse((x-rr,y-rr,x+rr,y+rr),fill=(0,0,0,0))
name="K4BO_ORIGINAL_NEAR_CAMERA_VELOCITY_ATLAS_RGBA.png"
path=os.path.join(out,name)
im.save(path,optimize=True)
h=hashlib.sha256(open(path,'rb').read()).hexdigest()
metadata={
 "schema":"dopagaki.k4bo.source-road-original-velocity-atlas/1",
 "image":name,"size":[W,H],"sha256":h,
 "coordinateMap":{"u":"(camera_lateral_s+75)/180","v":"(camera_forward_d+60)/265"},
 "authoredVisibleForwardRangeM":[-22,200],
 "frameNearGraphicDistanceM":[3,19,34,49,65,83,104],
 "originalSourceCameraMustStayUnchanged":True,
 "sourceGameUnchanged":True,"nativeRoad5GeometryUnchanged":True
}
with open(os.path.join(out,"K4BO_ORIGINAL_ATLAS_METADATA.json"),'w') as f:json.dump(metadata,f,indent=2)
print("K4BO_GENUINE_ORIGINAL_EDITABLE_PAINT_ATLAS",h)

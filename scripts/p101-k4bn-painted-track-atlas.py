"""Original DOPAGAKI K4BN course paint atlas. 100% newly-authored research material.

Mapping from immutable B48 original camera: U=(s+60)/150; V=(d+65)/275.
This is paint in Blender DCC shading only, not an altered game/source road.
"""
import os,random,argparse,json,hashlib
from PIL import Image,ImageDraw,ImageFont
p=argparse.ArgumentParser()
p.add_argument('--out',required=True)
a=p.parse_args()
os.makedirs(a.out,exist_ok=True)
W,H=2048,4096
im=Image.new('RGBA',(W,H),(0,0,0,0))
draw=ImageDraw.Draw(im,'RGBA')
random.seed(428133)
def pt(d,s):return (round((s+60)/150*W),round((210-d)/275*H))
def polygon(x,col):draw.polygon([pt(d,s) for d,s in x],fill=col)
def line(x,col,width):draw.line([pt(d,s) for d,s in x],fill=col,width=width)
cool=(70,197,182,188)
warm=(240,156,74,194)
line([(-60,-30),(195,-29)],(192,213,199,135),5)
line([(-60,55),(195,75)],(192,213,199,135),5)
for s in (-22,21):
 for d in range(-55,193,15):
  q=.055*d
  polygon([(d,s+q-.13),(d+5,s+q-.13),(d+5,s+q+.13),(d,s+q+.13)],(207,214,203,110))
font_bold='/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf'
font_regular='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def stencil(d,s,name,hm,col,bold=True):
 size=max(12,round(hm/275*H))
 font=ImageFont.truetype(font_bold if bold else font_regular,size)
 # The fixed authentic source camera views camera-lateral S from the
 # opposite image direction. Flip GLYPHS locally (not entire atlas/lanes),
 # so the game-course typography reads correctly without camera editing.
 bbox=draw.textbbox((0,0),name,font=font,anchor='lt')
 width=max(2,bbox[2]-bbox[0]+2)
 height=max(2,bbox[3]-bbox[1]+2)
 word=Image.new('RGBA',(width,height),(0,0,0,0))
 label_draw=ImageDraw.Draw(word)
 label_draw.text((-bbox[0],-bbox[1]),name,fill=col,font=font)
 x,y=pt(d,s)
 im.alpha_composite(word.transpose(Image.Transpose.FLIP_LEFT_RIGHT),(x,y))
stencil(50,-20,'HYPER',4.6,(225,227,207,174))
stencil(41,-20,'RUSH',4.3,(234,232,216,173))
stencil(35,-21,'S E C T O R   0 5',1.5,(77,190,174,158),False)
stencil(77,-16,'QUAY 05',5.3,(237,224,186,126))
stencil(108,-12,'01 / COASTLINE',2.0,(191,217,212,131),False)
for side in (-1,1):
 center=-32 if side<0 else 62
 for k,d in enumerate((1,18,39,57,86,105,127,145,164)):
  s=center+.045*d*side
  col=cool if k%3 else warm
  polygon([(d,s),(d+5.3,s+side*2),(d+7,s+side*2),(d+1.8,s)],col)
  polygon([(d+8.1,s),(d+13.4,s+side*2),(d+14.6,s+side*2),(d+9.3,s)],col)
for d in (49,122,157):
 for s in range(-29,44,8):
  polygon([(d,s),(d+1.5,s),(d+1.5,s+4.6),(d,s+4.6)],(218,223,214,95))
for d in (-17,65,137):
 for s in (-13,4,21):
  polygon([(d,s),(d+4,s+4.3),(d+4,s+6.7),(d-.5,s+2.4)],(55,176,168,121))
for d in (30,60,90,120,150):
 stencil(d,-27,f'{d:03d}M',1.25,(230,231,216,111),False)
pix=im.load()
for k in range(23000):
 x=random.randrange(W)
 y=random.randrange(H)
 if pix[x,y][3]>85 and random.random()<.65:
  rad=random.choice((1,1,2,2,3))
  draw.ellipse((x-rad,y-rad,x+rad,y+rad),fill=(0,0,0,0))
file='K4BN_ORIGINAL_TRACK_MARKING_ATLAS_RGBA.png'
path=os.path.join(a.out,file)
im.save(path,optimize=True)
info={'schema':'dopagaki.original_road_5_shade_only/1',
 'atlas':file,'width':W,'height':H,
 'source_camera_mapping':{'u':'(lateral_s_metres+60)/150','v':'(forward_d_metres+65)/275'},
 'game_source_modified':False,'native_road_collision_modified':False,
 'sha256':hashlib.sha256(open(path,'rb').read()).hexdigest()}
with open(os.path.join(a.out,'K4BN_ATLAS_METADATA.json'),'w') as f:
 json.dump(info,f,indent=2)
print('ORIGINAL_PAINT_ATLAS_OK',info['sha256'])
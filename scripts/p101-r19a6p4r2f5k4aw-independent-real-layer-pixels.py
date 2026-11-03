#!/usr/bin/env python3
"""K4AW genuine original paused Road5 GPU layer-by-layer art root-cause audit.

Independent raw PNG SHA/camera proof. Per-pixel colors are measured objectively,
but NOT attributed to one semantic HUD/road object solely from HSV.
Muting protected B51 warning graphics in research does not authorize shipping.
"""
import argparse, json, hashlib
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

SOURCE='af076d67492a677d2235e4730aef8cdf4808e106'
TICKS={'control':11259,'ultra':11320}
MASKS=('none','noW9C1','noP100','noB5','noXZCues','noEdgeLines',
       'noHazardGates','noA13Decor')
ROLE={
 'noW9C1':'W9C1_MARKS','noP100':'P100_ROAD_READABILITY',
 'noB5':'B5_ROAD_OPTICS','noXZCues':'XZC_WARNING_CUES',
 'noEdgeLines':'SOURCE_EDGE_AND_FLOW_LINES',
 'noHazardGates':'SOURCE_B51_HAZARD_GUIDES',
 'noA13Decor':'A13_NONPHYSICAL_DECOR'
}
def check(ok, msg):
    if not ok: raise AssertionError('K4AW_'+msg)
def read_image(root,item):
    info=item['png'];fname=info['file']
    check(fname==Path(fname).name and fname.endswith('.png'),'BAD_IMAGE_PATH')
    raw=(root/fname).read_bytes()
    check(len(raw)==info['bytes'],'PNG_BYTES')
    check(hashlib.sha256(raw).hexdigest()==info['sha256'],'PNG_SHA256')
    with Image.open(root/fname) as im:
        check(im.format=='PNG','UNSUPPORTED_FORMAT')
        rgb=im.convert('RGB')
        check(rgb.width>=800 and rgb.height>=500,'FRAME_SIZE')
        return rgb
def palette_areas(img, region):
    a=np.array(img,dtype=np.uint8);h,w=a.shape[:2]
    x0,x1=int(w*.10),int(w*.90)
    y0,y1=int(h*.22),int(h*.58)
    a=a[y0:y1,x0:x1,:].astype(np.int16)
    r,g,b=a[:,:,0],a[:,:,1],a[:,:,2]
    pink=((r>150)&(b>125)&(g<165)&((r-g)>48))
    cyan=((g>120)&(b>130)&(r<145)&((b-r)>42))
    return int(pink.sum()),int(cyan.sum()),int(a.shape[0]*a.shape[1])
def difference(a,b):
    aa=np.array(a,dtype=np.int16);bb=np.array(b,dtype=np.int16)
    check(aa.shape==bb.shape,'FRAMEBUFFER_DRIFT')
    h,w=aa.shape[:2]
    y0,y1=int(h*.22),int(h*.58)
    x0,x1=int(w*.10),int(w*.90)
    region=np.max(np.abs(aa[y0:y1,x0:x1]-bb[y0:y1,x0:x1]),axis=2)
    return int((region>32).sum()),int(region.size)
def inspect(root):
    source=json.loads((root/'K4AW_TRUE_SOURCE_DRAW_LAYER_REPORT.json').read_text())
    check(source.get('schema')=='dopagaki.K4AW.authentic-native-Road5-individual-GPU-visual-layers/1','SOURCE_SCHEMA')
    check(source.get('sourceBlob')==SOURCE and source.get('sourceNativeHz')==240,'SOURCE_BLOB_NATIVE_HZ')
    check(source.get('sourceRoads')==7 and source.get('sourceB51')==28,'PHYSICAL_B48_B51')
    check(source.get('errors')==[] and len(source.get('modes',[]))==2,'RUN_FAILED')
    check(source.get('ART')=='NOT_TESTED_HOLD' and source.get('officialARTAccepted')==source.get('slope2DNAMetres')==0,'ILLEGAL_ART_PROMOTION')
    check(all(source.get(k)=='HOLD' for k in ('HUMAN','SAT','CCD','FPS','RELEASE','MERGE')),'GATES_NOT_HOLD')
    out=[];all_images={}
    for run in source['modes']:
        mode=run['mode'];tick=run['tick']
        check(mode in TICKS and TICKS[mode]==tick,'INVALID_ROAD5_TIME')
        check(run['errors']==[] and run['pageErrors']==[],'CHROMIUM_PAGE_ERRORS')
        shots=run['masks']
        check([x['mask'] for x in shots]==list(MASKS),'MISSING_OR_DUPLICATE_MASK')
        base=read_image(root,shots[0]);p0,c0,area=palette_areas(base,'road')
        check(shots[0]['suppressedRealGpuDrawCalls']==0,'SOURCE_ORIGINAL_SUPPRESSION')
        color_rows=[]
        for item in shots:
            st=item['nativeState'];mask=item['mask']
            check(st['tick']==tick and st['paused']==tick and st['maskTick']==tick,
                  'NATIVE_PHYSICS_TIME_CHANGE')
            check(st['road']=='p93-PRISM_CREST-01' and st['status']=='running','ROAD_OR_STATUS')
            check(st['b51']==28 and st['sourceRoads']==7 and st['sourceBlob']==SOURCE,'ORIGINAL_B51_SOURCE_BLOB')
            check(st['physicsWrites']=='0' and st['safetyStatus']=='HOLD','PHYSICAL_OR_SAFETY_GUARD')
            check(st['sourceAudit']['sourceBlob']==SOURCE and st['sourceAudit']['mask']=='none',
                  'SOURCE_AUDIT_MOVED')
            check(item['suppressedRealGpuDrawCalls']>=0,'NEGATIVE_DRAW_CALLS')
            if mask!='none':
                category=ROLE[mask]
                expected=int(st['drawGroups'].get(category,{}).get('suppressedCalls',0))
                check(expected==item['suppressedRealGpuDrawCalls'],
                      'SOURCE_MASK_GROUP_CENSUS')
            canvas=read_image(root,item)
            px,roi=difference(base,canvas)
            pink,cyan,_=palette_areas(canvas,'road')
            color_rows.append({'mask':mask,
               'correspondingSourceGroup':ROLE.get(mask,'SOURCE_ALL'),
               'suppressedActualGpuDrawCalls':item['suppressedRealGpuDrawCalls'],
               'colorPixelDifferenceOver32':px,
               'fractionOfRoadFacingROI':round(px/roi,6),
               'brightPinkPixelCount':pink,'brightCyanPixelCount':cyan,
               'brightPinkRemovedFromROI':p0-pink,
               'brightCyanRemovedFromROI':c0-cyan,
               'inference':'PIXEL_DIFFERENCE_NOT_SOURCE_SEMANTIC_OR_SAFETY_PASS',
               'productionRemovalAuthorized':False})
            all_images[(mode,mask)]=canvas
        out.append({'mode':mode,'nativeTick':tick,'roiPixels':area,'layers':color_rows})
    check({d['mode'] for d in out}==set(TICKS),'DUPLICATE_MODE')
    # raw screenshots: 4 columns x 4 rows, 2 modes x 8 masks.
    width,height=430,305
    board=Image.new('RGB',(4*width,4*height),(17,19,25))
    draw=ImageDraw.Draw(board)
    for row,(mode,mask) in enumerate([(m,mask) for m in TICKS for mask in MASKS]):
        i=row//4;j=row%4
        im=all_images[(mode,mask)].copy()
        im.thumbnail((width-10,height-28))
        board.paste(im,(j*width+5,i*height+24))
        draw.text((j*width+9,i*height+5),mode+' '+str(TICKS[mode])+' | '+mask,
             fill=(234,234,228))
    board.save(root/'K4AW_ORIGINAL_NATIVE_SOURCE_LAYER_CONTACT.png')
    return {
      'schema':'dopagaki.K4AW.independent-16-real-source-native-layer-provenance/1',
      'originalSourceBlob':SOURCE,'sourceB48':7,'sourceB51':28,'nativeHz':240,
      'trueSourcePNGs':16,'sameNativePausedSourceTimes':list(TICKS.values()),
      'originalRoad5LayerEvidence':out,'artInterpretation':'INDEPENDENT_HUMAN_VIEW_REQUIRED',
      'hazardSafeToMute':'NOT_VERIFIED_NO_AUTOMATIC_REMOVAL',
      'formalARTAccepted':0,'slope2DNAMetres':0,
      'ART':'NOT_TESTED_HOLD','HUMAN':'HOLD',
      'SAT':'HOLD','CCD':'HOLD','FPS':'HOLD','RELEASE':'HOLD','MERGE':'HOLD'}
if __name__=='__main__':
    cli=argparse.ArgumentParser()
    cli.add_argument('--root',type=Path,default=Path('r19-evidence/k4aw'))
    d=inspect(cli.parse_args().root)
    root=cli.parse_args().root
    (root/'K4AW_INDEPENDENT_REAL_SOURCE_LAYER_PIXEL_CAUSALITY.json').write_text(
        json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('K4AW_SOURCE_VISUAL_LAYER_INDIVIDUAL_NATIVE_CAMERA_PROOF_ART_HOLD')

/**
 * W9-C2 G4E-7K: experiment to subtract oversized center chevrons
 * only from 0.40-0.77 of first REAL GLIDE road, without adding fake geometry.
 */
export const G4E7K_WINDOW=Object.freeze({section:0,uStart:.28,uEnd:.85});
export function g4e7kAllowed(doc){
 return doc?.stageForge?.recordStageId==='VB-P101-A13-W9C2-G4E7G-GLIDE'&&
  doc.stageForge?.g4e7gVisualTrial?.kind==='glide'&&
  doc.stageForge?.g4e7fPhysicalStudy?.variant==='glide'&&
  doc.stageForge?.productionPromoted===false&&
  doc.surfaces?.length===7&&doc.movingObstacles?.length===28;
}
export function createG4E7KControls({canvas,parent}){
 if(!canvas||!parent)throw Error('G4E7K comparison DOM missing');
 let permitted=false,quiet=false;
 const button=document.createElement('button');button.type='button';
 button.id='g4e7kQuietToggle';
 button.setAttribute('aria-label','非公開 G4E-7K 既存道路の中央chevronsの削減／復元');
 const publish=()=>{
  button.hidden=!permitted;button.disabled=!permitted;
  button.textContent=quiet?'G4E-7K SKYLINE QUIET：ON（内側chevron削減）':
   'G4E-7K SKYLINE BASELINE（元の模様）';
  button.setAttribute('aria-pressed',String(quiet));
  canvas.dataset.g4e7kMode=!permitted?'off':quiet?'quiet':'baseline';
 };
 const setStage=allowed=>{permitted=Boolean(allowed);quiet=false;publish();};
 button.addEventListener('click',()=>{if(!permitted)return;quiet=!quiet;publish();});
 parent.append(button);publish();
 return {button,setStage,get quiet(){return permitted&&quiet;}};
}

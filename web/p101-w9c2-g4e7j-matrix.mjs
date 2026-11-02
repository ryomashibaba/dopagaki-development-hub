/**
 * W9-C2 G4E-7J: separate HUD legibility / true-road contour visual effects.
 * Exactly 4 observable factors at same real runner pose. No camera or physics.
 */
export const G4E7J_CONDITIONS=Object.freeze([
 Object.freeze({id:'none',typography:false,contours:false,label:'00 FOCUSのみ'}),
 Object.freeze({id:'type',typography:true,contours:false,label:'10 文字のみ'}),
 Object.freeze({id:'contour',typography:false,contours:true,label:'01 路肩のみ'}),
 Object.freeze({id:'both',typography:true,contours:true,label:'11 文字＋路肩'})
]);
export function g4e7jCondition(id){
 const match=G4E7J_CONDITIONS.find(c=>c.id===id);
 if(!match)throw Error('G4E-7J unknown factor condition '+id);
 return match;
}
export function createG4E7JMatrix({canvas,parent,readability,focusButton}){
 if(!canvas||!parent||!readability||!focusButton)throw Error('G4E-7J controls missing');
 const viewport=canvas.closest('.viewport');
 if(!viewport)throw Error('G4E-7J true WebGL viewport required');
 let enabled=false,selected='none';
 const holder=document.createElement('section');
 holder.id='g4e7jFactors';
 holder.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:5px;margin:8px 0;padding:6px;border:1px solid #2f8290;border-radius:10px';
 holder.setAttribute('aria-label','G4E-7J 文字と路肩の独立4条件・非公開');
 const buttons=new Map();
 const ready=()=>enabled&&viewport.dataset.g4e7hMode==='focus';
 const apply=(id)=>{
  g4e7jCondition(id);
  if(!ready())throw Error('G4E-7J cannot change physical or default-stage HUD');
  const f=g4e7jCondition(id);
  readability.setComparisonAxes({typography:f.typography,contours:f.contours});
  selected=id;
  canvas.dataset.g4e7jFactor=id;
  canvas.dataset.g4e7jTypography=String(f.typography);
  canvas.dataset.g4e7jContours=String(f.contours);
  for(const [key,btn] of buttons)btn.setAttribute('aria-pressed',String(key===id));
 };
 const reset=()=>{
  selected='none';
  canvas.dataset.g4e7jFactor=ready()?'none':'off';
  canvas.dataset.g4e7jTypography='false';
  canvas.dataset.g4e7jContours='false';
  if(ready())apply('none');
  else readability.endComparison();
 };
 const update=()=>{
  holder.hidden=!enabled;
  holder.style.display=enabled?'grid':'none'; // Inline display:grid otherwise overrides UA [hidden].
  const active=ready();
  for(const button of buttons.values())button.disabled=!active;
  reset();
 };
 for(const f of G4E7J_CONDITIONS){
  const button=document.createElement('button');
  button.id='g4e7j-'+f.id;button.type='button';
  button.textContent=f.label;button.dataset.factor=f.id;
  button.setAttribute('aria-label','非公開G4E-7J '+f.label);
  button.addEventListener('click',()=>{if(ready())apply(f.id);});
  buttons.set(f.id,button);holder.append(button);
 }
 focusButton.addEventListener('click',()=>update());
 parent.append(holder);
 const setStage=allowed=>{enabled=Boolean(allowed);update();};
 update();
 return {holder,setStage,select:apply,get factor(){return selected;},
  get typographyOn(){return ready()&&g4e7jCondition(selected).typography;},
  get contoursOn(){return ready()&&g4e7jCondition(selected).contours;}};
}

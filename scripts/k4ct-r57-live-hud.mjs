/** R57 research PRIVATE-only live HUD. Presentation-only.
 * Never commands steering, modifies source Runner, impacts rewards, or certifies safe lanes.
 * Reversible at runtime: window.__k4ctR57HudMode='BASE'|'CANDIDATE'.
 */
const BONUS_RX=/^NEAR\s+MISS\b/i;
let savedBonus=null,savedValue='',savedPriority='';
function candidateBonus(canvas) {
 const r=canvas.getBoundingClientRect();
 const all=Array.from(document.querySelectorAll('div,aside,output')).filter(el=>{
  const t=(el.innerText||el.textContent||'').trim(),b=el.getBoundingClientRect();
  return BONUS_RX.test(t)&&t.length<130&&b.width>160&&b.height>22&&b.height<180&&
   b.left>=r.left&&b.right<=r.right+5;
 });
 all.sort((a,b)=>{
  const A=a.getBoundingClientRect(),B=b.getBoundingClientRect();
  return B.width*B.height-A.width*A.height;
 });
 return all[0]||null;
}
function restoreSavedBonus(){
 if(savedBonus&&document.contains(savedBonus)){
  if(savedValue)savedBonus.style.setProperty('visibility',savedValue,savedPriority);
  else savedBonus.style.removeProperty('visibility');
 }
 savedBonus=null;savedValue='';savedPriority='';
}
export function applyK4CTR57Hud(canvas,panel,dual){
 const mode=window.__k4ctR57HudMode??'CANDIDATE';
 if(mode!=='BASE'&&mode!=='CANDIDATE')throw Error('R57 HUD mode not BASE/CANDIDATE');
 const bounds=canvas.getBoundingClientRect();
 const eligible=bounds.width>=950;
 const active=mode==='CANDIDATE'&&eligible;
 let css=document.getElementById('k4ctR57LiveHudCSS');
 if(active){
  if(!css){css=document.createElement('style');css.id='k4ctR57LiveHudCSS';document.head.append(css);}
  const left=(bounds.left+bounds.width*.418).toFixed(1);
  const rule='#k4ctOriginalTwoB51Panel{width:440px!important;max-width:440px!important;box-sizing:border-box!important;left:'+left+'px!important;font-size:12px!important;line-height:1.35!important;padding:6px 9px!important;}';
  if(css.textContent!==rule)css.textContent=rule;
 }else if(css)css.remove();
 const next=dual?.rows?.[0]||null;
 const eta=next?.etaSeconds;
 const immediate=Number.isFinite(eta)&&eta<=.75;
 if(savedBonus&&(!document.contains(savedBonus)||!BONUS_RX.test((savedBonus.innerText||savedBonus.textContent||'').trim())))
  restoreSavedBonus();
 if(active&&immediate){
  if(!savedBonus){
   const found=candidateBonus(canvas);
   if(found){
    savedBonus=found;
    savedValue=found.style.getPropertyValue('visibility');
    savedPriority=found.style.getPropertyPriority('visibility');
   }
  }
  if(savedBonus)savedBonus.style.setProperty('visibility','hidden','important');
 }else restoreSavedBonus();
 // R66 PRIVATE-only placement, retaining original practice instructions and state.
 const placement=window.__k4ctPracticePlacement??'CANDIDATE';
 if(placement!=='BASE'&&placement!=='CANDIDATE')throw Error('R66 PRACTICE placement not BASE/CANDIDATE');
 const practice=document.getElementById('practiceBanner');
 const practiceActive=placement==='CANDIDATE'&&eligible&&Boolean(practice)&&!practice.hidden;
 let practiceCSS=document.getElementById('k4ctR66PracticeCSS');
 if(practiceActive){
  if(!practiceCSS){practiceCSS=document.createElement('style');practiceCSS.id='k4ctR66PracticeCSS';document.head.append(practiceCSS);}
  const rule='#practiceBanner{left:auto!important;right:14px!important;bottom:12px!important;transform:none!important;min-width:0!important;max-width:234px!important;padding:6px 9px!important;text-align:left!important;box-shadow:0 0 12px #21ffc51a!important;}'+
   '#practiceBanner strong{font-size:11px!important;letter-spacing:.03em!important;}'+
   '#practiceBanner span{font-size:10px!important;line-height:1.25!important;}'+
   '#practiceBanner small{font-size:9px!important;line-height:1.2!important;}';
  if(practiceCSS.textContent!==rule)practiceCSS.textContent=rule;
 }else if(practiceCSS)practiceCSS.remove();
 canvas.dataset.k4ctR66PracticePlacement=placement;
 canvas.dataset.k4ctR66PracticeActive=String(practiceActive);
 canvas.dataset.k4ctR66PresentationOnly='true';
 canvas.dataset.k4ctR57HudMode=mode;
 canvas.dataset.k4ctR57HudEligible=String(eligible);
 canvas.dataset.k4ctR57ImmediateHazard=String(immediate);
 canvas.dataset.k4ctR57BonusFound=String(Boolean(savedBonus));
 canvas.dataset.k4ctR57BonusSuppressed=String(Boolean(active&&immediate&&savedBonus));
 canvas.dataset.k4ctR57ProtectedPresentationOnly='true';
 return {mode,active,immediate,bonusSuppressed:Boolean(active&&immediate&&savedBonus),practicePlacement:placement,practiceActive};
}

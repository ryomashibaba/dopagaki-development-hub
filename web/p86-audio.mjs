/**
 * P86 — original, synthesized dark/euphoric arcade soundscape.
 * Requires a deliberate player click. Zero external media/assets or licensing.
 * Designed to be entirely isolated from 240Hz native Runner/B51-C.
 */
export const TEMPO=134;
export const BEAT_SECONDS=60/TEMPO;
export const MOTIF_MIDI=Object.freeze([64,67,71,69,66,62]); // E G B A F# D
export const midiHz=n=>440*Math.pow(2,(n-69)/12);
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function soundEvent(step,velocity=44){
 if(!Number.isSafeInteger(step)||step<0)throw Error('Invalid sound step');
 const gain=clamp((Math.max(0,velocity)-25)/115,0,1);
 const intro=step<10;
 const beat=step%16;
 const motifIndex=Math.floor((step-10)/2)%MOTIF_MIDI.length;
 return {intro,beat,accent:beat%4===0,hat:step%2===1,
  melodic:!intro&&step%2===0,
  pitch:midiHz(MOTIF_MIDI[Math.max(0,motifIndex)]+(gain>.7?12:0)),
  intensity:gain};
}
export function createArcadeAudio(contextFactory){
 let ctx=null,master=null,enabled=false,nextStep=0,nextAt=0,muted=false;
 let queued=0,events=0,tailUntil=0;
 const factory=contextFactory||(()=>new (globalThis.AudioContext||globalThis.webkitAudioContext)());
 function oscillator(frequency,when,duration,amplitude,type='triangle'){
  const osc=ctx.createOscillator(),amp=ctx.createGain();
  osc.type=type;osc.frequency.setValueAtTime(Math.max(15,frequency),when);
  amp.gain.setValueAtTime(.00001,when);
  amp.gain.exponentialRampToValueAtTime(Math.max(.00002,amplitude),when+.012);
  amp.gain.exponentialRampToValueAtTime(.00001,when+duration);
  osc.connect(amp);amp.connect(master);
  osc.start(when);osc.stop(when+duration+.018);
  return {osc,amp};
 }
 function tone(freq,when,length,gain,type='triangle'){
  if(!enabled||!ctx)return;
  oscillator(freq,when,length,gain,type);
  events++;
 }
 async function enable(){
  if(!ctx){
   try{
    ctx=factory();
    if(!ctx||typeof ctx.createOscillator!=='function')throw Error('Web Audio unavailable');
    master=ctx.createGain();master.gain.value=.25;master.connect(ctx.destination);
   }catch(e){ctx=null;master=null;enabled=false;return false;}
  }
  try{
   if(typeof ctx.resume==='function')await ctx.resume();
   enabled=true;muted=false;nextAt=ctx.currentTime+.025;nextStep=0;tailUntil=0;
   master.gain.setValueAtTime(0,ctx.currentTime);
   return true;
  }catch{return false;}
 }
 async function disable(){
  enabled=false;muted=true;
  try{master?.gain.setTargetAtTime?.(0,ctx.currentTime,.012);await ctx?.suspend?.();}catch{}
  return false;
 }
 function reset(){
  nextStep=0;nextAt=ctx?ctx.currentTime+.035:0;tailUntil=0;
  // Pause/restart cancels next scheduled tails through the shared envelope.
 }
 function effect(name){
  if(!enabled||!ctx)return false;
  const t=ctx.currentTime+.012;
  if(name==='finish'||name==='failed')tailUntil=t+1.1;
  if(name==='near-miss'){
   tone(523,t,.17,.15,'sine');
   tone(784,t+.075,.22,.12,'triangle');
  }else if(name==='jump'){
   tone(185,t,.36,.12,'sawtooth');
   tone(370,t+.065,.3,.10,'triangle');
  }else if(name==='land'){
   tone(130,t,.14,.18,'triangle');
   tone(195,t+.08,.16,.09,'sine');
  }else if(name==='finish'){
   for(let i=0;i<4;i++)tone([330,440,554,659][i],t+.12*i,.38,.12,'triangle');
  }else if(name==='failed'){
   tone(185,t,.36,.15,'sawtooth');tone(117,t+.09,.45,.12,'sine');
  }else return false;
  return true;
 }
 function tick({velocity=44,running=true,paused=false,visible=true}={}){
  if(!enabled||!ctx)return {scheduled:0,enabled:false};
  const active=running&&!paused&&visible;
  master.gain.setTargetAtTime((active||(visible&&ctx.currentTime<tailUntil)) ? .25 : 0,ctx.currentTime,.035);
  if(!active){nextAt=ctx.currentTime+.035;return {scheduled:0,enabled:true};}
  const now=ctx.currentTime;
  if(nextAt<now-.1){nextAt=now+.025;} // skip stale clock, not the native physics
  let scheduled=0;
  while(nextAt<now+.17&&scheduled<3){
   const event=soundEvent(nextStep,velocity);
   if(event.accent)tone(55,nextAt,.21,.12+event.intensity*.08,'sine');
   if(event.hat)tone(390+event.intensity*130,nextAt,.045,.018+event.intensity*.02,'square');
   if(event.melodic){
    tone(event.pitch,nextAt,.26,.09+event.intensity*.05,'triangle');
    tone(event.pitch/2,nextAt,.39,.035,'sine');
   }
   if(event.intro&&nextStep===0)tone(midiHz(40),nextAt,1.7,.045,'sine');
   nextStep++;nextAt+=BEAT_SECONDS/2;scheduled++;
  }
  queued+=scheduled;
  return {scheduled,enabled:true};
 }
 return {enable,disable,reset,tick,effect,
  get state(){return {enabled,muted,step:nextStep,scheduled:queued,voices:events,available:Boolean(ctx)};}};
}

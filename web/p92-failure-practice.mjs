/**
 * P92 — Select the nearest *earlier* physical practice entry following a failed
 * manual EP-P66 run. This never restores a failed Runner or teleports the ball:
 * P79 restarts at spawn 00 and simulates the original 240Hz reference steering
 * up to the selected authored surface before giving the player control.
 *
 * Pure selection logic; no DOM / storage / native Runner modifications.
 */
export function failurePracticeChapter({stageId,mode,status,surface,lastSurface,records=[]}={}){
 if(stageId!=='EP-P66'||mode!=='manual'||status!=='failed')return null;
 // A failed airborne run may have no current surface. Recover the last
 // physically recorded ground contact, never infer progress from world X/Z.
 const history=Array.isArray(records)
  ?[...records].reverse().find(x=>x?.grounded&&typeof x.surface==='string')?.surface
  :null;
 const id=[surface,lastSurface,history].find(x=>typeof x==='string'&&/^p66-[A-Z_]+-\d{2}$/.test(x));
 if(!id)return null;
 const part=id.match(/^p66-([A-Z_]+)-(\d{2})$/);
 if(!part)return null;
 const [,section,piece]=part;
 if(section==='PIPE_RETURN')return 'return';
 if(section==='SPIRAL_CATHEDRAL')return Number(piece)===6?'spiral-exit':'return';
 if(['FORK_APPROACH','FORK_L','FORK_R'].includes(section))return 'fork';
 if(section==='FORK_REJOIN')return 'rejoin';
 if(section==='MACHINE_CHAMBER')return 'machines';
 if(['GAP_TAKEOFF','GAP_LANDING'].includes(section))return 'jump';
 return null; // Intake failure or unknown section -> normal restart only.
}

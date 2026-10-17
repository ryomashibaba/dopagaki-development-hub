import {test,expect} from '@playwright/test';

test('P65 WebGL2 drives frozen P62 with actual B48 Runner on two stages',async({page})=>{
 test.setTimeout(110000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.url().includes('/generated/')&&!r.ok())errors.push('JSON '+r.status())});
 await page.goto('/drive3d/');
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:60000});
 await expect(page.locator('#spawn option').first()).toBeAttached();
 await expect(page.locator('#speed')).not.toHaveText('--');
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(350);await page.keyboard.up('ArrowRight');
 await expect(page.locator('#simTime')).not.toHaveText('0.00 s');
 await page.getByRole('button',{name:'再スタート'}).click();
 await expect(page.locator('#appStatus')).toContainText('3D ready');
 await page.locator('#stage').selectOption('HS-001');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:60000});
 await expect(page.locator('#spawn option').first()).toBeAttached();
 await page.locator('#pause').click();
 await expect(page.locator('#pause')).toContainText('再開');
 expect(errors).toEqual([]);
});


test('P79: full native route, chapter training and original four stages coexist',async({page})=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('response',response=>{if(response.url().includes('P66_ECHO_RUSH')&&!response.ok())errors.push('P66 JSON HTTP '+response.status())});
 await page.goto('/drive3d/');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await expect(page.locator('#stage option:checked')).toContainText('P91 ECHO PIPE');
 await expect(page.locator('#spawn option')).toHaveCount(7);
 const newCourse=await page.evaluate(async()=>await(await fetch('../generated/P66_ECHO_RUSH.json')).json());
 expect(newCourse.surfaces.length).toBe(23);
 expect(newCourse.surfaces.filter(s=>s.id.startsWith('p66-PIPE_RETURN')).length).toBe(2);
 expect(newCourse.visualBlueprint.returnHoops.length).toBe(9);
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','6');
 await expect(page.locator('#view')).toHaveAttribute('data-mega-world','enabled');
 await expect(page.locator('#view')).toHaveAttribute('data-mega-section-count','4');
 const massive=Number(await page.locator('#view').getAttribute('data-mega-triangle-count'));
 expect(massive).toBeGreaterThan(5000);
 await page.locator('#megaWorld').click();
 await expect(page.locator('#view')).toHaveAttribute('data-mega-world','disabled');
 await page.locator('#megaWorld').click();
 await expect(page.locator('#view')).toHaveAttribute('data-mega-world','enabled');
 await expect(page.locator('#nearMissCount')).toHaveText('0');
 await expect(page.locator('#runScore')).toHaveText(/^\d[\d,]*$/);
 await expect(page.locator('#bestSurvival')).toBeVisible();
 await expect(page.locator('#runResult')).toBeHidden();
 await expect(page.locator('#nearMissBurst')).toBeHidden();
 await expect(page.locator('#view')).toHaveAttribute('data-near-miss-count','0');
 await expect(page.locator('#view')).toBeVisible();
 await expect(page.locator('#view')).toHaveAttribute('data-camera-mode','ball-lock-interpolated');
 expect(await page.locator('#view').evaluate(c=>Boolean(c.getContext('webgl2')))).toBe(true);
 await page.locator('#spawn').selectOption('2');
 await expect(page.locator('#appStatus')).toContainText('P91 EXPERIMENTAL');
 // The real P69 machine chamber includes three physical movement mechanisms.
 // Heads-up cues are derived from sampled B51 motion, not a fake preset label.
 await page.locator('#spawn').selectOption('4');
 await expect(page.locator('#machineCue')).toBeVisible({timeout:10000});
 await expect(page.locator('#machineCue')).toContainText(/SLIDER|ROTATOR|PISTON/);
 await expect(page.locator('#machineCue')).toHaveAttribute('data-mode',/fail|bounce|push/);
 // Compare raw and filtered heading without restarting or touching B48 Runner.
 await expect(page.locator('#cameraCompare')).toHaveAttribute('aria-pressed','false');
 await page.locator('#cameraCompare').click();
 await expect(page.locator('#view')).toHaveAttribute('data-camera-mode','ball-lock-unfiltered-heading');
 await expect(page.locator('#cameraCompare')).toHaveAttribute('aria-pressed','true');
 await page.locator('#cameraCompare').click();
 await expect(page.locator('#view')).toHaveAttribute('data-camera-mode','ball-lock-interpolated');
 await expect(page.locator('#cameraCompare')).toHaveAttribute('aria-pressed','false');
 await page.locator('#pause').click();
 await expect(page.locator('#pause')).toContainText('再開');
 await page.waitForTimeout(650);
 const stopped=await page.locator('#simTime').textContent();
 await page.waitForTimeout(650);
 expect(await page.locator('#simTime').textContent()).toBe(stopped);
 await expect(page.locator('#view')).toHaveAttribute('data-camera-mode','ball-lock-interpolated');
 await expect(page.locator('#cameraInfo')).toBeVisible();
 await page.locator('#pause').click();
 await expect(page.locator('#pause')).toContainText('一時停止');
 await page.locator('#spawn').selectOption('5');
 await expect(page.locator('#nearMissCount')).toHaveText('0');
 await expect(page.locator('#nearMissBurst')).toBeHidden();
 await expect(page.locator('#runResult')).toBeHidden();
 await page.keyboard.down('KeyA');await page.waitForTimeout(500);await page.keyboard.up('KeyA');
 await expect(page.locator('#simTime')).not.toHaveText('0.00 s');
 expect(errors).toEqual([]);
});

test('P75 actual 240Hz machine failure settles score, saves local best and retries',async({page})=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await page.locator('#spawn').selectOption('4');
 await expect(page.locator('#runResult')).toBeVisible({timeout:30000});
 await expect(page.locator('#resultTitle')).toContainText('RUN ENDED');
 await expect(page.locator('#resultScore')).toContainText('PTS');
 const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('dopagaki:survival:1:EP-P66:4')));
 expect(record).not.toBeNull();
 expect(record.schema).toBe('dopagaki.survival-record/1');
 expect(record.outcome).toBe('failed');
 expect(record.seconds).toBeGreaterThan(0);
 expect(record.bonus/(record.total||1)).toBeLessThanOrEqual(.05);
 const best=record.seconds.toFixed(2)+' s';
 await page.locator('#retryRun').click();
 await expect(page.locator('#runResult')).toBeHidden();
 await expect(page.locator('#view')).toHaveAttribute('data-run-outcome','running');
 await expect(page.locator('#runScore')).toHaveText(/^\d[\d,]*$/);
 await expect(page.locator('#bestSurvival')).toHaveText(best);
 await page.reload();
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await page.locator('#spawn').selectOption('4');
 await expect(page.locator('#bestSurvival')).toHaveText(best);
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#bestSurvival')).toHaveText('—');
 expect(errors).toEqual([]);
});

test('P78 explicitly separated spectator demo resets to manual and cannot save or alter best records',async({page})=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await expect(page.locator('#demoRun')).toBeEnabled();
 await expect(page.locator('#demoBanner')).toBeHidden();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await page.locator('#demoRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','spectator-demo');
 await expect(page.locator('#demoRun')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#demoBanner')).toBeVisible();
 await expect(page.locator('#spawn')).toHaveValue('0');
 await expect(page.locator('#demoElapsed')).not.toContainText('0.0s',{timeout:10000});
 // Spectator frames must never commit a player's personal best.
 const bestDuringDemo=await page.evaluate(()=>localStorage.getItem('dopagaki:survival:1:EP-P66:0'));
 expect(bestDuringDemo).toBeNull();
 await page.locator('#demoSpeed').selectOption('1');
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','spectator-demo');
 await page.locator('#demoRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await expect(page.locator('#demoBanner')).toBeHidden();
 await expect(page.locator('#demoRun')).toHaveAttribute('aria-pressed','false');
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:60000});
 await expect(page.locator('#demoRun')).toBeDisabled();
 expect(errors).toEqual([]);
});

test('P79 fast native replay gives manual control at real HALO RETURN and never stores records',async({page})=>{
 test.setTimeout(150000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await expect(page.locator('#practiceRun')).toBeEnabled();
 await expect(page.locator('#practiceChapter option')).toHaveCount(7);
 await expect(page.locator('#practiceBanner')).toBeHidden();
 await page.locator('#practiceChapter').selectOption('return');
 await page.locator('#practiceRun').click();
 await expect(page.locator('#practiceBanner')).toBeVisible();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','practice',{timeout:90000});
 await expect(page.locator('#practiceProgress')).toContainText('自分で操作中');
 const resumed=await page.locator('#simTime').textContent();
 expect(parseFloat(resumed)).toBeGreaterThan(5);
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(250);await page.keyboard.up('ArrowRight');
 await expect(page.locator('#runScore')).toHaveText(/^\d[\d,]*$/);
 const recorded=await page.evaluate(()=>localStorage.getItem('dopagaki:survival:1:EP-P66:0'));
 expect(recorded).toBeNull();
 await page.locator('#practiceRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await expect(page.locator('#practiceBanner')).toBeHidden();
 // Spectator takeover preserves native Runner instead of creating a practice checkpoint.
 // The displayed time must synchronously reset with the NEW Runner; a stale
 // previous-practice clock caused a false apparent time reversal under slower GPUs.
 const instantDemoClock=await page.locator('#demoRun').evaluate(button=>{
  button.click();return document.getElementById('simTime').textContent;
 });
 expect(instantDemoClock).toBe('0.00 s');
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','spectator-demo');
 await expect(page.locator('#takeoverRun')).toBeVisible();
 const demoClock=parseFloat(await page.locator('#simTime').textContent());
 await page.locator('#takeoverRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','practice');
 await expect(page.locator('#takeoverRun')).toBeHidden();
 await expect(page.locator('#practiceBanner')).toBeVisible();
 const takeoverClock=parseFloat(await page.locator('#simTime').textContent());
 expect(takeoverClock).toBeGreaterThanOrEqual(demoClock);
 expect(await page.evaluate(()=>localStorage.getItem('dopagaki:survival:1:EP-P66:0'))).toBeNull();
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#practiceRun')).toBeDisabled();
 await expect(page.locator('#practiceChapter')).toBeDisabled();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 expect(errors).toEqual([]);
});

test('P80 authentic road-skin neon chevrons and live eight-section progress preserve input, camera and P62 isolation',async({page})=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-flow-markers',/^[1-9]\d*$/);
 const count=Number(await page.locator('#view').getAttribute('data-flow-markers'));
 expect(count).toBeGreaterThan(40);
 await expect(page.locator('#flowProgress')).toBeVisible();
 await expect(page.locator('#flowProgress span')).toHaveCount(8);
 await expect(page.locator('#view')).toHaveAttribute('data-flow-chapter','PIPE');
 await expect(page.locator('#flowProgress span[data-state="current"]')).toHaveText('PIPE');
 await page.locator('#spawn').selectOption('1');
 await expect(page.locator('#view')).toHaveAttribute('data-flow-chapter','SPIRAL');
 await expect(page.locator('#flowProgress span[data-state="current"]')).toHaveText('SPIRAL');
 await page.locator('#spawn').selectOption('4');
 await expect(page.locator('#view')).toHaveAttribute('data-flow-chapter','MACHINES');
 await expect(page.locator('#flowProgress span[data-state="current"]')).toHaveText('MACHINES');
 await expect(page.locator('#view')).toHaveAttribute('data-camera-mode','ball-lock-interpolated');
 await page.locator('#practiceChapter').selectOption('return');
 await page.locator('#practiceRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','practice',{timeout:90000});
 await expect(page.locator('#view')).toHaveAttribute('data-flow-chapter',/HALO|SPIRAL/);
 await page.locator('#practiceRun').click();
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:60000});
 await expect(page.locator('#flowProgress')).toBeHidden();
 expect(errors).toEqual([]);
});

test('P81 real banked-road edge radar tracks native contact and hides during airborne flight',async({page})=>{
 test.setTimeout(130000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await expect(page.locator('#edgeRadar')).toBeVisible({timeout:20000});
 await expect(page.locator('#view')).toHaveAttribute('data-edge-status',/clear|caution|danger/);
 await expect(page.locator('#edgeRadar')).toHaveAttribute('data-v',/^-?\d+\.\d{3}$/);
 await expect(page.locator('#edgeTilt')).toContainText('面傾斜');
 await expect(page.locator('#edgeLabel')).not.toHaveText('');
 await page.locator('#pause').click();
 await expect(page.locator('#pause')).toContainText('再開');
 await page.locator('#spawn').selectOption('1');
 await expect(page.locator('#edgeRadar')).toBeVisible();
 await expect(page.locator('#view')).toHaveAttribute('data-flow-chapter','SPIRAL');
 await expect(page.locator('#view')).toHaveAttribute('data-edge-status',/clear|caution|danger/);
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:60000});
 await expect(page.locator('#edgeRadar')).toBeVisible({timeout:15000});
 expect(errors).toEqual([]);
});


test('P83 real WebGL2 framebuffer quality modes preserve playable physics and giant city toggle',async({page})=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await expect(page.locator('#renderQuality')).toHaveValue('auto');
 await expect(page.locator('#view')).toHaveAttribute('data-render-mode','auto');
 await expect(page.locator('#view')).toHaveAttribute('data-render-scale','1.00');
 const read=()=>page.locator('#view').evaluate(c=>({
  w:c.width,h:c.height,cssW:c.clientWidth,cssH:c.clientHeight,
  dpr:Math.min(2,devicePixelRatio||1),physics:c.dataset.runMode,mega:c.dataset.megaWorld
 }));
 const full=await read();
 await page.locator('#renderQuality').selectOption('performance');
 await expect(page.locator('#view')).toHaveAttribute('data-render-mode','performance');
 await expect(page.locator('#view')).toHaveAttribute('data-render-scale','0.60');
 await expect(page.locator('#renderScaleInfo')).toContainText('60%');
 const fast=await read();
 expect(fast.w).toBeLessThan(full.w);
 expect(fast.h).toBeLessThan(full.h);
 expect(fast.cssW).toBe(full.cssW);
 expect(fast.cssH).toBe(full.cssH);
 expect(Math.abs(fast.w-Math.floor(fast.cssW*fast.dpr*.6))).toBeLessThanOrEqual(2);
 await page.locator('#megaWorld').click();
 await expect(page.locator('#view')).toHaveAttribute('data-mega-world','disabled');
 await page.locator('#renderQuality').selectOption('quality');
 await expect(page.locator('#view')).toHaveAttribute('data-render-scale','1.00');
 await page.locator('#renderQuality').selectOption('balanced');
 await expect(page.locator('#view')).toHaveAttribute('data-render-scale','0.80');
 await page.locator('#renderQuality').selectOption('auto');
 await expect(page.locator('#view')).toHaveAttribute('data-render-mode','auto');
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await expect(page.locator('#simTime')).not.toHaveText('0.00 s');
 await page.locator('#spawn').selectOption('1');
 await expect(page.locator('#view')).toHaveAttribute('data-flow-chapter','SPIRAL');
 await expect(page.locator('#renderQuality')).toHaveValue('auto');
 expect(errors).toEqual([]);
});

test('P84 real sampled road shoulder visibility and atmospheric fog toggles do not affect native racing',async({page})=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-visibility-fx','enabled');
 await expect(page.locator('#view')).toHaveAttribute('data-shoulder-beacons',/^[1-9][0-9]*$/);
 const count=Number(await page.locator('#view').getAttribute('data-shoulder-beacons'));
 expect(count).toBeGreaterThan(120);
 await expect(page.locator('#visibilityFx')).toHaveAttribute('aria-pressed','true');
 await page.locator('#visibilityFx').click();
 await expect(page.locator('#view')).toHaveAttribute('data-visibility-fx','disabled');
 await expect(page.locator('#visibilityFx')).toHaveAttribute('aria-pressed','false');
 await page.locator('#visibilityFx').click();
 await expect(page.locator('#view')).toHaveAttribute('data-visibility-fx','enabled');
 await page.locator('#renderQuality').selectOption('performance');
 await expect(page.locator('#view')).toHaveAttribute('data-render-scale','0.60');
 await page.locator('#megaWorld').click();
 await expect(page.locator('#view')).toHaveAttribute('data-mega-world','disabled');
 await page.locator('#spawn').selectOption('1');
 await expect(page.locator('#view')).toHaveAttribute('data-flow-chapter','SPIRAL');
 await expect(page.locator('#simTime')).not.toHaveText('0.00 s');
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:60000});
 await expect(page.locator('#view')).toHaveAttribute('data-shoulder-beacons','0');
 await expect(page.locator('#view')).toHaveAttribute('data-visibility-fx','enabled');
 expect(errors).toEqual([]);
});


test('P85 real WebGL2 luminous energy ball and velocity trails stay visual-only and user-toggleable',async({page})=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await expect(page.locator('#energyFx')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#view')).toHaveAttribute('data-energy-mode','enhanced');
 await expect(page.locator('#view')).toHaveAttribute('data-energy-trail','active');
 const vertices=Number(await page.locator('#view').getAttribute('data-energy-vertices'));
 expect(vertices).toBeGreaterThan(4000);
 expect(vertices).toBeLessThan(13500);
 const before=await page.locator('#view').evaluate(c=>({
  speed:document.getElementById('speed').textContent,
  spawn:document.getElementById('spawn').value,
  physics:c.dataset.runMode,
  camera:c.dataset.cameraMode
 }));
 await page.locator('#energyFx').click();
 await expect(page.locator('#energyFx')).toHaveAttribute('aria-pressed','false');
 await expect(page.locator('#view')).toHaveAttribute('data-energy-mode','classic');
 await expect(page.locator('#view')).toHaveAttribute('data-energy-trail','inactive');
 await page.locator('#energyFx').click();
 await expect(page.locator('#view')).toHaveAttribute('data-energy-mode','enhanced');
 await page.locator('#renderQuality').selectOption('performance');
 await expect(page.locator('#view')).toHaveAttribute('data-render-scale','0.60');
 await expect(page.locator('#view')).toHaveAttribute('data-energy-trail','inactive');
 await page.locator('#renderQuality').selectOption('quality');
 await expect(page.locator('#view')).toHaveAttribute('data-energy-trail','active');
 await page.locator('#pause').click();
 await expect(page.locator('#pause')).toContainText('再開');
 const paused=await page.locator('#simTime').textContent();
 await page.waitForTimeout(650);
 expect(await page.locator('#simTime').textContent()).toBe(paused);
 await expect(page.locator('#view')).toHaveAttribute('data-energy-mode','enhanced');
 await page.locator('#pause').click();
 await page.locator('#spawn').selectOption('1');
 await expect(page.locator('#view')).toHaveAttribute('data-energy-mode','enhanced');
 await expect(page.locator('#view')).toHaveAttribute('data-camera-mode',before.camera);
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode',before.physics);
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:60000});
 await expect(page.locator('#view')).toHaveAttribute('data-energy-mode','enhanced');
 expect(errors).toEqual([]);
});

test('P86 live native chapter timing enters HALO, demo cannot save best and practice begins its own clock',async({page})=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await expect(page.locator('#chapterTiming')).toBeVisible();
 await expect(page.locator('#splitCurrent')).toContainText('PIPE');
 await expect(page.locator('#view')).toHaveAttribute('data-completed-splits','0');
 await page.locator('#demoRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','spectator-demo');
 await expect(page.locator('#view')).toHaveAttribute('data-completed-splits',/^[1-8]$/,{timeout:45000});
 await expect(page.locator('#splitLast')).toContainText('PIPE');
 await expect(page.locator('#splitCurrent')).toContainText('HALO');
 const stored=await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('dopagaki:chapter:1:')));
 expect(stored).toEqual([]);
 await page.locator('#takeoverRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','practice');
 await expect(page.locator('#chapterTiming')).toBeVisible();
 await expect(page.locator('#view')).toHaveAttribute('data-completed-splits','0');
 await expect(page.locator('#splitCurrent')).toContainText('HALO');
 await expect(page.locator('#splitLast')).toContainText('区間通過で計測');
 const noPracticeRecord=await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('dopagaki:chapter:1:')));
 expect(noPracticeRecord).toEqual([]);
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#chapterTiming')).toBeHidden();
 expect(errors).toEqual([]);
});


test('P87 opt-in native reference ghost is visible only in manual full-start play, never spectator or P62',async({page})=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await expect(page.locator('#ghostToggle')).toBeEnabled();
 await expect(page.locator('#ghostToggle')).toHaveAttribute('aria-pressed','false');
 await expect(page.locator('#view')).toHaveAttribute('data-ghost-mode','off');
 await page.locator('#ghostToggle').click();
 await expect(page.locator('#ghostToggle')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#view')).toHaveAttribute('data-ghost-mode','reference-visible');
 await expect(page.locator('#simTime')).not.toHaveText('0.00 s',{timeout:10000});
 const time=Number((await page.locator('#simTime').textContent()).replace(' s',''));
 expect(time).toBeGreaterThan(0);
 // Ghost is a wireframe draw only; physical run stays manual and scores normally.
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await page.locator('#spawn').selectOption('1');
 await expect(page.locator('#ghostToggle')).toBeDisabled();
 await expect(page.locator('#view')).toHaveAttribute('data-ghost-mode','off');
 await page.locator('#spawn').selectOption('0');
 await expect(page.locator('#ghostToggle')).toBeEnabled();
 await expect(page.locator('#view')).toHaveAttribute('data-ghost-mode','reference-visible');
 await page.locator('#demoRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','spectator-demo');
 await expect(page.locator('#ghostToggle')).toBeDisabled();
 await expect(page.locator('#view')).toHaveAttribute('data-ghost-mode','off');
 await page.locator('#demoRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await expect(page.locator('#ghostToggle')).toBeEnabled();
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:60000});
 await expect(page.locator('#ghostToggle')).toBeDisabled();
 await expect(page.locator('#view')).toHaveAttribute('data-ghost-mode','off');
 expect(errors).toEqual([]);
});

test('P90 player vs native sector ghost racecard uses real crossings, not same-clock distance',async({page})=>{
 test.setTimeout(125000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await expect(page.locator('#ghostPace')).toBeHidden();
 await expect(page.locator('#view')).toHaveAttribute('data-ghost-pace-status','off');
 await page.locator('#ghostToggle').click();
 await expect(page.locator('#view')).toHaveAttribute('data-ghost-mode','reference-visible');
 await expect(page.locator('#view')).toHaveAttribute('data-completed-splits',/^[1-8]$/,{timeout:48000});
 await expect(page.locator('#ghostPace')).toBeVisible();
 await expect(page.locator('#ghostRacecard')).toBeVisible();
 await expect(page.locator('.racecardRow')).toHaveCount(8);
 await expect(page.locator('#racecardProgress')).toContainText('/8 SECTORS');
 await expect(page.locator('#ghostPace')).toContainText('同じ区間');
 await expect(page.locator('#ghostPace')).toHaveAttribute('data-status',/ahead|behind|tie/);
 await expect(page.locator('#ghostGap')).toBeVisible();
 await page.locator('#ghostToggle').click();
 await expect(page.locator('#ghostPace')).toBeHidden();
 await expect(page.locator('#ghostGap')).toBeHidden();
 await page.locator('#ghostToggle').click();
 await expect(page.locator('#ghostPace')).toBeVisible();
 await page.locator('#demoRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','spectator-demo');
 await expect(page.locator('#ghostPace')).toBeHidden();
 await page.locator('#spawn').selectOption('2');
 await expect(page.locator('#ghostToggle')).toBeDisabled();
 await expect(page.locator('#ghostPace')).toBeHidden();
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:60000});
 await expect(page.locator('#ghostPace')).toBeHidden();
 expect(errors).toEqual([]);
});


test('P91 visible physical-road approach markers guide human decisions without changing physics or P62',async({page})=>{
 test.setTimeout(110000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#appStatus')).toContainText('P91 EXPERIMENTAL',{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-approach-regions','FORK,MACHINES,NATURAL_GAP');
 await expect(page.locator('#view')).toHaveAttribute('data-approach-beacons','68');
 await expect(page.locator('body')).toContainText('P91：分岐前は左右2色の路面矢印');
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-approach-regions','none');
 await expect(page.locator('#view')).toHaveAttribute('data-approach-beacons','0');
 await page.locator('#stage').selectOption('EP-P66');
 await expect(page.locator('#view')).toHaveAttribute('data-approach-beacons','68',{timeout:75000});
 expect(errors).toEqual([]);
});

test('P92 failed manual run offers instant native-replayed chapter practice with best record isolation',async({page})=>{
 test.setTimeout(150000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await expect(page.locator('#appStatus')).toContainText('P91 EXPERIMENTAL',{timeout:75000});
 await expect(page.locator('#retryPractice')).toBeHidden();
 await page.locator('#spawn').selectOption('4');
 await expect(page.locator('#runResult')).toBeVisible({timeout:40000});
 await expect(page.locator('#resultTitle')).toHaveText('RUN ENDED');
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await expect(page.locator('#view')).toHaveAttribute('data-failure-practice','machines');
 await expect(page.locator('#retryPractice')).toBeVisible();
 const original=await page.evaluate(()=>localStorage.getItem('dopagaki:survival:1:EP-P66:4'));
 expect(original).not.toBeNull();
 await page.locator('#retryPractice').click();
 await expect(page.locator('#retryPractice')).toBeHidden();
 await expect(page.locator('#runResult')).toBeHidden();
 await expect(page.locator('#practiceBanner')).toBeVisible();
 await expect(page.locator('#practiceChapter')).toHaveValue('machines');
 await expect(page.locator('#spawn')).toHaveValue('0');
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode',/practice(-seek)?/);
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','practice',{timeout:85000});
 await expect(page.locator('#practiceProgress')).toContainText('自分で操作中');
 const store=await page.evaluate(()=>({
  original:localStorage.getItem('dopagaki:survival:1:EP-P66:4'),
  spawn0:localStorage.getItem('dopagaki:survival:1:EP-P66:0')
 }));
 expect(store.original).toBe(original);
 expect(store.spawn0).toBeNull();
 await page.locator('#practiceRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await expect(page.locator('#retryPractice')).toBeHidden();
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:75000});
 await expect(page.locator('#retryPractice')).toBeHidden();
 expect(errors).toEqual([]);
});

test('P93 independent 3990m VOID BREAKER is an actual native B48 playable 3D world; P66/P62 remain selectable',async({page})=>{
 test.setTimeout(140000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.url().includes('P93_VOID_BREAKER')&&!r.ok())errors.push('P93 stage HTTP '+r.status())});
 await page.goto('/drive3d/');
 await expect(page.locator('#stage')).toHaveValue('EP-P66');
 await page.locator('#stage').selectOption('VB-P93');
 await expect(page.locator('#appStatus')).toContainText('P94 VOID BREAKER',{timeout:75000});
 await expect(page.locator('#spawn option')).toHaveCount(6);
 await expect(page.locator('#view')).toHaveAttribute('data-mega-section-count','7');
 await expect(page.locator('#view')).toHaveAttribute('data-mega-world','enabled');
 await expect(page.locator('#view')).toHaveAttribute('data-camera-mode','ball-lock-interpolated');
 expect(Number(await page.locator('#view').getAttribute('data-mega-triangle-count'))).toBeGreaterThan(3000);
 await expect(page.locator('#demoRun')).toBeEnabled();
 await expect(page.locator('#practiceRun')).toBeDisabled();
 const candidate=await page.evaluate(async()=>await(await fetch('../generated/P93_VOID_BREAKER.json')).json());
 expect(candidate.stageForge.id).toBe('VB-P93');
 expect(candidate.stageForge.humanPlaytest).toBe('NOT_RUN');
 expect(candidate.surfaces).toHaveLength(7);
 expect(candidate.stageForge.fullStartToFinish).toBe('NATIVE_SCRIPTED_240HZ_7_OF_7_PASS_P94');
 await page.locator('#spawn').selectOption('2');
 await expect(page.locator('#appStatus')).toContainText('P94 VOID BREAKER');
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await expect(page.locator('#simTime')).not.toHaveText('0.00 s',{timeout:25000});
 await expect(page.locator('#runResult')).toBeHidden();
 await page.locator('#megaWorld').click();
 await expect(page.locator('#view')).toHaveAttribute('data-mega-world','disabled');
 await page.locator('#megaWorld').click();
 await expect(page.locator('#view')).toHaveAttribute('data-mega-world','enabled');
 await page.locator('#stage').selectOption('EP-P66');
 await expect(page.locator('#spawn option')).toHaveCount(7,{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-mega-section-count','4');
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-mega-section-count','0');
 expect(errors).toEqual([]);
});

test('P94 real native 240Hz spectator completes the entire seven-road VOID BREAKER without modifying player bests',async({page})=>{
 test.setTimeout(115000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/drive3d/');
 await page.locator('#stage').selectOption('VB-P93');
 await expect(page.locator('#appStatus')).toContainText('P94 VOID BREAKER',{timeout:75000});
 await expect(page.locator('#demoRun')).toBeEnabled();
 await expect(page.locator('#practiceRun')).toBeDisabled();
 const original=await page.evaluate(()=>JSON.stringify({...localStorage}));
 await page.locator('#demoSpeed').selectOption('2');
 await page.locator('#demoRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','spectator-demo');
 await expect(page.locator('#demoBanner')).toBeVisible();
 await expect(page.locator('#resultTitle')).toHaveText('DEMO COMPLETE',{timeout:85000});
 await expect(page.locator('#view')).toHaveAttribute('data-run-outcome','finished');
 await expect(page.locator('#resultScore')).toContainText('実物理');
 const afterwards=await page.evaluate(()=>JSON.stringify({...localStorage}));
 expect(afterwards).toBe(original);
 await page.locator('#demoRun').click();
 await expect(page.locator('#view')).toHaveAttribute('data-run-mode','manual');
 await expect(page.locator('#runResult')).toBeHidden();
 expect(errors).toEqual([]);
});

test('P95 12 physically animated hazards render in independent stage, while original P94 proof and all P62 remain',async({page})=>{
 test.setTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.url().includes('P95_VOID_HAZARD')&&!r.ok())errors.push('P95 stage HTTP '+r.status())});
 await page.goto('/drive3d/');
 await page.locator('#stage').selectOption('VB-P95');
 await expect(page.locator('#appStatus')).toContainText('P96 VOID BREAKER',{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','12');
 await expect(page.locator('#view')).toHaveAttribute('data-mega-section-count','7');
 await expect(page.locator('#view')).toHaveAttribute('data-mega-world','enabled');
 await expect(page.locator('#spawn option')).toHaveCount(6);
 await expect(page.locator('#demoRun')).toBeEnabled();
 await expect(page.locator('#practiceRun')).toBeDisabled();
 const candidate=await page.evaluate(async()=>await(await fetch('../generated/P95_VOID_HAZARD_CANDIDATE.json')).json());
 expect(candidate.stageForge.id).toBe('VB-P95');
 expect(candidate.stageForge.fullStartToFinish).toBe('SCRIPTED_240HZ_12_ACTIVE_7_OF_7_PASS_P96');
 expect(candidate.stageForge.inheritedP94Evidence).toBe(false);
 expect(candidate.movingObstacles).toHaveLength(12);
 expect(new Set(candidate.movingObstacles.map(o=>o.type))).toEqual(new Set(['slider','rotator','piston']));
 await page.locator('#stage').selectOption('VB-P93');
 await expect(page.locator('#appStatus')).toContainText('P94 VOID BREAKER',{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-machine-count','0');
 await expect(page.locator('#demoRun')).toBeEnabled();
 const original=await page.evaluate(async()=>await(await fetch('../generated/P94_VOID_NATIVE_ACCEPTANCE.json')).json());
 expect(original.corrective.runnerStatus).toBe('finished');
 expect(original.corrective.visited).toHaveLength(7);
 await page.locator('#stage').selectOption('EP-001');
 await expect(page.locator('#appStatus')).toContainText('3D ready',{timeout:75000});
 await expect(page.locator('#view')).toHaveAttribute('data-mega-section-count','0');
 expect(errors).toEqual([]);
});

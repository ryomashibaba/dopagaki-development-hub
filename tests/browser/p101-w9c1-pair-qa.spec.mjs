import {test,expect} from '@playwright/test';
import {createB5ManualAudit,recordB5ManualSample,observeW9C1ManualCue,
 finalizeB5ManualAudit,exportB5ManualAudit} from '../../web/p101-b5-manual-qa.mjs';

function trial(kind,seconds){
 const id='VB-P101-A13-W9C1-'+kind;
 const a=createB5ManualAudit({stageId:id,spawnIndex:0,profile:'OVERDRIVE',startSpeed:52});
 recordB5ManualSample(a,{time:0,speed:52,fps:60,frameDelta:.016,input:0,
  grounded:true,hazard:'none',urgency:'none',edge:'safe'});
 observeW9C1ManualCue(a,{phase:'approach'},1.1);
 observeW9C1ManualCue(a,{phase:'core',speedMps:83},4.1);
 finalizeB5ManualAudit(a,{status:'failed',time:seconds,surface:'p93-void-breaker-01',
  contacts:2,nearMisses:1,failure:'コースから落下'});
 return JSON.parse(exportB5ManualAudit(a,{note:'do-not-expose-in-combined-output',
  w9c1Feedback:{warningSeenEarly:4,edgeReadability:3,failureFairness:2}}));
}
const localFile=(name,report)=>({name,mimeType:'application/json',buffer:Buffer.from(JSON.stringify(report))});

test('G5-C2 local manual reports: compare real file input, no false fairness promotion',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/w9c1-pair-qa/');
 await expect(page.getByRole('heading',{name:'28mと14mの手動試走を比較'})).toBeVisible();
 const control=trial('CONTROL',12.5),ultra=trial('ULTRA',10.5);
 await page.locator('#controlFile').setInputFiles(localFile('control.json',control));
 await page.locator('#ultraFile').setInputFiles(localFile('ultra.json',ultra));
 await page.locator('#compare').click();
 await expect(page.locator('#result')).toBeVisible();
 await expect(page.locator('#quality')).toContainText('正式な優劣は判定しません');
 await expect(page.locator('#rows tr')).toHaveCount(16);
 await expect(page.locator('#rows tr').first().locator('td')).toHaveText(['実道路の狭路幅 (m)','28','14']);
 await expect(page.locator('#warnings')).toContainText('操作・障害物タイミング');
 await expect(page.locator('#save')).toBeEnabled();
 expect(await page.locator('#result').innerText()).not.toContain('do-not-expose-in-combined-output');
 const save=page.waitForEvent('download');
 await page.locator('#save').click();
 const file=await save;expect(file.suggestedFilename()).toBe('DOPAGAKI_W9C1_28m_vs_14m_G5C2_COMPARISON.json');
 await page.screenshot({path:info.outputPath('w9c1-g5c2-pair-qa-live-browser.png'),fullPage:true});
 // File mix-up must fail closed without leaking the previous comparison.
 await page.locator('#controlFile').setInputFiles(localFile('wrong-control.json',ultra));
 await page.locator('#compare').click();
 await expect(page.locator('#message')).toContainText('wrong trial JSON');
 await expect(page.locator('#result')).toBeHidden();
 await expect(page.locator('#save')).toBeDisabled();
 expect(errors).toEqual([]);
});

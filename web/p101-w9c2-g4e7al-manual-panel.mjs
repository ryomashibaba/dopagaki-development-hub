/** Isolated localhost G4E-7AL manual trial panel. No network or storage. */
export function createG4E7ALPanel(parent,{onNext,onDownload}){
 const root=document.createElement('section');root.id='g4e7alPanel';
 root.style.cssText='border:1px solid #6ae4c5;border-radius:10px;margin:12px 0;padding:14px;color:#e7ffff;background:#082536';
 root.setAttribute('aria-label','G4E-7AL 独立人間試走とローカル記録');
 const heading=document.createElement('h3');
 heading.textContent='G4E-7AL｜本物の11m級B48・B51-C 2候補';
 const step=document.createElement('p');step.id='g4e7alStep';
 const guidance=document.createElement('p');
 guidance.textContent='A/Dまたは左右矢印で実240Hz走行。自動操舵・チェックポイント移動なし。Rで再走した試走も最大12回分をブラウザメモリに一時保持し、次のJSON保存に含めます（古い試走は件数付きで整理）。ゲームオーバーからもJSONを直接保存できます。';
 const live=document.createElement('p');live.id='g4e7alLive';live.textContent='実物理入力待ち';
 root.append(heading,step,guidance,live);
 const addSelect=(id,title,choices)=>{
  const label=document.createElement('label');label.textContent=title+' ';
  const s=document.createElement('select');s.id=id;
  for(const [value,name] of choices){const o=document.createElement('option');o.value=value;o.textContent=name;s.append(o)}
  label.append(s);root.append(label);return s;
 };
 const noticed=addSelect('g4e7alNoticed','障害物を回避操作前に認識できた？',
  [['unsure','判断できない'],['yes','はい'],['no','いいえ']]);
 const fairness=addSelect('g4e7alFairness','道路幅・曲線・左右操舵で公平に回避できそう？',
  [['unsure','判断できない'],['yes','はい'],['no','いいえ']]);
 const enjoyment=addSelect('g4e7alEnjoyment','走行の楽しさ（任意）',
  [['','未評価'],['1','1/5'],['2','2/5'],['3','3/5'],['4','4/5'],['5','5/5']]);
 const label=document.createElement('label');label.textContent='視界・難易度・落下箇所・その他（任意）';
 const note=document.createElement('textarea');note.id='g4e7alNote';note.rows=3;note.maxLength=450;
 label.append(note);root.append(label);
 const next=document.createElement('button');next.id='g4e7alNext';next.type='button';
 next.textContent='この走行を記録して次へ';
 const download=document.createElement('button');download.id='g4e7alDownload';download.type='button';
 download.textContent='現在までの計測JSONを保存';
 const notice=document.createElement('p');notice.id='g4e7alNotice';
 root.append(next,download,notice);parent.append(root);
 const feedback=()=>({noticed:noticed.value,fairness:fairness.value,
  enjoyment:enjoyment.value?Number(enjoyment.value):null,note:note.value});
 next.addEventListener('click',()=>onNext(feedback()));
 download.addEventListener('click',()=>onDownload(feedback()));
 return {root,feedback,
  render(index){step.textContent=index>=2?'比較2/2記録完了・JSON保存してください':
   `${index+1}/2 ${index===0?'TRUE-PINCH':'PINCH-SWITCH'}・正規00開始／52m/s・手動のみ`;
   next.disabled=index>=2;
   notice.textContent=index>=2?'データは端末内のみ。人間評価は自動認定されません。':
    '失敗した場合も次へ進めます。JSONは端末に明示的に保存するまで保持されません。';},
  live(t){live.textContent=t;},
  reset(){noticed.value='unsure';fairness.value='unsure';enjoyment.value='';note.value='';},
  notice(t){notice.textContent=t;}
 };
}

/** G4E-7O controls outside the moving WebGL view; visible on private localhost only. */
export function createG4E7OManualPanel(parent,{onNext,onDownload}){
 const root=document.createElement('section');root.id='g4e7oPanel';
 root.style.cssText='border:1px solid #62d7c2;border-radius:10px;margin:12px 0;padding:12px;color:#ecfcff;background:#0c2532;';
 root.setAttribute('aria-label','G4E-7O 真のB48細道・人間試走 計測');
 const title=document.createElement('h3');title.textContent='G4E-7O｜超細道の実機手動2走';
 const step=document.createElement('p');step.id='g4e7oStep';
 const help=document.createElement('p');
 help.textContent='正規00から52m/s・A/Dまたは左右矢印で手動操舵。自動操舵なし。FPS・本物の路肩余裕を測定します。Rで同じ走行を再開。';
 const live=document.createElement('p');live.id='g4e7oLive';live.textContent='物理計測待ち';
 root.append(title,step,help,live);
 const selector=(id,caption,values)=>{
  const label=document.createElement('label');label.textContent=caption+' ';
  const s=document.createElement('select');s.id=id;
  for(const [value,text] of values){const o=document.createElement('option');o.value=value;o.textContent=text;s.append(o);}
  label.append(s);root.append(label);return s;
 };
 const visible=selector('g4e7oVisibility','急カーブ・細道を2秒以上前に確認できた？',
  [['unsure','判断できない'],['yes','はい（自己申告）'],['no','いいえ']]);
 const enjoyment=selector('g4e7oEnjoyment','走行の楽しさ（任意）',
  [['','未評価'],['1','1 / 5'],['2','2 / 5'],['3','3 / 5'],['4','4 / 5'],['5','5 / 5']]);
 const noteLabel=document.createElement('label');noteLabel.textContent='違和感・不自然な反発・視界・操作の所感（任意）';
 const note=document.createElement('textarea');note.id='g4e7oNote';note.rows=2;note.maxLength=450;
 note.placeholder='例：先の下りが見えない／道路端の警告が遅い';
 noteLabel.append(note);root.append(noteLabel);
 const next=document.createElement('button');next.id='g4e7oNext';next.type='button';
 next.textContent='今の試走を記録して次へ';
 const download=document.createElement('button');download.id='g4e7oDownload';download.type='button';
 download.textContent='計測JSONを直接保存';
 const status=document.createElement('p');status.id='g4e7oNotice';
 root.append(next,download,status);parent.append(root);
 next.addEventListener('click',()=>onNext({visibility:visible.value,
  enjoyment:enjoyment.value?Number(enjoyment.value):null,note:note.value}));
 download.addEventListener('click',onDownload);
 return {root,
  render(index){step.textContent=index>=2?'2/2 保存準備完了（技術研究・人間評価HOLD）':
    (index+1)+'/2 '+['THREAD｜細道15.4m級','PRECIPICE｜細道13.1m級'][index]+' · 正規00スタート';
   next.disabled=index>=2;status.textContent=index>=2?'JSONを保存してください。結果の自動送信・正式採用なし。':
    '失敗・中断した試走も保存します。画面は実ゲームの物理と視界を使用。';},
  live(data){live.textContent=data;},
  reset(){visible.value='unsure';enjoyment.value='';note.value='';},
  notice(msg){status.textContent=msg;}};
}

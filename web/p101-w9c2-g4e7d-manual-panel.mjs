/**
 * G4E-7D voluntary human QA UI only. No auto-input or background uploads.
 * Controls live in the ordinary settings panel, not over the moving road.
 */
export function makeG4E7DPanel(parent,{onNext,onDownload}){
 const root=document.createElement('section');
 root.id='g4e7dPanel';root.setAttribute('aria-label','G4E-7D 人間の手動試走');
 root.style.cssText='border:1px solid #61d6c5;border-radius:10px;margin:12px 0;padding:12px;background:#102b39;color:#eaffff;';
 const heading=document.createElement('h3');heading.textContent='G4E-7D 手動4走比較';
 const progress=document.createElement('p');progress.id='g4e7dStep';
 const help=document.createElement('p');help.textContent='A/D・左右矢印で手動操舵。Rで同じ試走をやり直せます。失敗・中断もそのまま記録。';
 const makeSelect=(id,title,options)=>{
  const label=document.createElement('label');label.textContent=title;
  const control=document.createElement('select');control.id=id;
  for(const [value,text] of options){
   const option=document.createElement('option');option.value=value;option.textContent=text;control.append(option);
  }
  label.append(control);root.append(label);return control;
 };
 root.append(heading,progress,help);
 const visible=makeSelect('g4e7dVisibility','離陸2秒以上前に実ギャップが見えましたか？',
  [['unsure','わからない'],['yes','はい（自己申告）'],['no','いいえ']]);
 const rating=makeSelect('g4e7dEnjoyment','楽しさ（任意）',
  [['','未評価'],['1','1/5'],['2','2/5'],['3','3/5'],['4','4/5'],['5','5/5']]);
 const label=document.createElement('label');label.textContent='違和感・落下理由（任意）';
 const note=document.createElement('textarea');note.id='g4e7dNote';note.rows=2;
 note.maxLength=450;note.placeholder='例：穴が急に見えた';label.append(note);root.append(label);
 const next=document.createElement('button');next.id='g4e7dNext';
 next.type='button';next.textContent='今の試走を記録して次へ';
 const download=document.createElement('button');download.id='g4e7dDownload';
 download.type='button';download.textContent='記録JSONを端末へ保存';
 const status=document.createElement('p');status.id='g4e7dMessage';
 root.append(next,download,status);parent.append(root);
 next.addEventListener('click',()=>onNext({
  visibility:visible.value,rating:rating.value?Number(rating.value):null,note:note.value
 }));
 download.addEventListener('click',onDownload);
 return {
  root,render({index,count,id,cue}){
   const completed=index>=count;
   progress.textContent=completed?'4/4 記録済み（JSONを保存）':
    (index+1)+'/'+count+'：'+id+'・ライン '+(cue?'ON':'OFF')+'・開始00';
   next.disabled=completed;
   status.textContent=completed?'終了。公平性・面白さの採用判断はHOLD。':
    'A/D手動のみ。自動操舵OFF／ラインの切替はこの1走中固定。';
  },
  reset(){visible.value='unsure';rating.value='';note.value='';},
  notice(message){status.textContent=message;}
 };
}

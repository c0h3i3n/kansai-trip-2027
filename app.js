const KEY = 'kansai-winter-2027-v1';
let state = {checks:{},budget:{},rate:'',notes:''};
let storageOK = true;
try { const saved=JSON.parse(localStorage.getItem(KEY)||'null'); if(saved&&typeof saved==='object') { for(const k of ['checks','budget']) if(saved[k]&&typeof saved[k]==='object') state[k]=saved[k]; for(const k of ['rate','notes']) if(typeof saved[k]==='string') state[k]=saved[k]; } } catch { storageOK=false; }
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch{storageOK=false;return false;}}
const $ = id=>document.getElementById(id);
const fmt = n=>new Intl.NumberFormat('zh-TW',{maximumFractionDigits:0}).format(n);
const valid = v=>typeof v==='string'&&v.trim()!==''&&Number.isFinite(Number(v))&&Number(v)>=0;
function totals(){let jpy=0,twd=0,count=0,jpyCount=0;for(const k of ['flight','airbnb','mimaru','apa','car','road','ski','train','food']){const v=state.budget[k];if(valid(v)){count++;if(k==='flight')twd+=Number(v);else{jpy+=Number(v);jpyCount++;}}}const r=Number(state.rate);return{jpy,twd,count,text:!count?'尚未填寫':(jpyCount===0||Number.isFinite(r)&&r>0)?'NT$ '+fmt(twd+jpy*(r||0)):'請填入換算匯率'};}
function renderBudget(){const t=totals();if($('budget-total')){$('budget-total').textContent=t.text;$('budget-count').textContent=t.count+' / 9 項已填寫';$('currency-totals').textContent=t.count?'已填金額：JPY '+fmt(t.jpy)+' + TWD '+fmt(t.twd):'尚未填寫金額';}if($('home-total')){$('home-total').textContent=t.text;$('home-total-note').textContent=t.count?t.count+' / 9 項已填寫 · 僅本機紀錄':'不將未知金額視為 0 元';}}
const boxes=[...document.querySelectorAll('[data-check]')];
function renderChecks(){const n=boxes.filter(x=>x.checked).length;if($('check-count'))$('check-count').textContent=n+' / '+boxes.length;if($('check-progress')){$('check-progress').value=n;$('check-progress').max=boxes.length;}}
boxes.forEach(el=>{el.checked=state.checks[el.dataset.check]===true;el.addEventListener('change',()=>{state.checks[el.dataset.check]=el.checked;const ok=save();renderChecks();if(!ok)$('storage-info').textContent='瀏覽器無法保存資料；本次勾選將在離開頁面後遺失。';});});
$('day-select')?.addEventListener('change',e=>{const id=e.target.value;if(id){location.hash=id;const target=$(id);target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}});
document.querySelectorAll('[data-budget]').forEach(el=>{el.value=valid(state.budget[el.dataset.budget])?state.budget[el.dataset.budget]:'';el.addEventListener('input',()=>{if(!el.validity.valid){$('budget-save').textContent='請輸入 0 或以上的整數金額。';return;}state.budget[el.dataset.budget]=el.value;const ok=save();renderBudget();$('budget-save').textContent=ok?'已儲存於此瀏覽器':'無法保存；請另外備份金額。';});});
if($('rate')){$('rate').value=state.rate;$('rate').addEventListener('input',e=>{if(!e.target.validity.valid){$('budget-save').textContent='請輸入大於 0、最多四位小數的匯率。';return;}state.rate=e.target.value;const ok=save();renderBudget();$('budget-save').textContent=ok?'已儲存於此瀏覽器':'無法保存；請另外備份匯率。';});}
if($('notes')){$('notes').value=state.notes;$('notes').addEventListener('input',e=>{state.notes=e.target.value;$('notes-save').textContent=save()?'已儲存於此瀏覽器':'無法保存；請複製筆記另存。';});}
$('print')?.addEventListener('click',()=>window.print());
if(!storageOK&&$('storage-info'))$('storage-info').textContent='瀏覽器儲存空間目前不可用；清單只保留在這次開啟的頁面。';
renderChecks();renderBudget();

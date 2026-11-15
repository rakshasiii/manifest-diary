const $=id=>document.getElementById(id), KEY='manifest-local-v1';
let db={intent:'',scripts:[],photos:[],thanks:[],affirmations:['Я могу постепенно воплощать свои мечты в жизнь.','Я достойна уважения и доброго отношения.','Я могу делать маленькие шаги к важным целям.'],wishes:[],days:{},cycleStart:null,cycleDays:[],settings:{reminders:false,morning:'08:00',evening:'20:00'}};
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x)db={...db,...x}}catch(e){}}
function save(){localStorage.setItem(KEY,JSON.stringify(db));render()}
function showTab(t){document.querySelectorAll('.panel').forEach(x=>x.classList.toggle('active',x.id===t));document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x.dataset.tab===t));if(t==='calendar')renderCalendar();window.scrollTo(0,0)}
$('nav').addEventListener('click',e=>{let b=e.target.closest('button[data-tab]');if(b)showTab(b.dataset.tab)});
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const today=()=>new Date().toISOString().slice(0,10);
function render(){
$('wishCount').textContent=db.wishes.length;$('doneCount').textContent=db.wishes.filter(w=>w.done).length;
$('intent').value=db.intent||'';$('scriptList').innerHTML=db.scripts.map((s,i)=>`<div class="card"><div class="small">${esc(s.date)}</div><h3>${esc(s.title||'Моя запись')}</h3><p>${esc(s.text).replace(/\n/g,'<br>')}</p><button class="danger" onclick="del('scripts',${i})">Удалить</button></div>`).join('');
$('photoGrid').innerHTML=db.photos.map((p,i)=>`<div class="photo"><img src="${p.data}" alt=""><div>${esc(p.caption)} <button class="danger" onclick="del('photos',${i})">Удалить</button></div></div>`).join('');
$('thanksList').innerHTML=db.thanks.map((g,i)=>`<div class="card"><div class="small">${g.date}</div>${g.items.map(x=>`<p>♡ ${esc(x)}</p>`).join('')}<button class="danger" onclick="del('thanks',${i})">Удалить</button></div>`).join('');
$('affirmList').innerHTML=db.affirmations.map((a,i)=>`<div class="item"><span>${esc(a)}</span><button class="danger" onclick="del('affirmations',${i})">×</button></div>`).join('');
$('wishList').innerHTML=db.wishes.map((w,i)=>`<div class="card"><label><input type="checkbox" style="width:auto" ${w.done?'checked':''} onchange="toggleWish(${i},this.checked)"> ${esc(w.name)}</label><p class="help">Следующий шаг: ${esc(w.step||'Пока не указан')}</p><button class="danger" onclick="del('wishes',${i})">Удалить</button></div>`).join('');
$('cycleInfo').textContent=db.cycleStart?`День ${Math.min(33,Math.floor((new Date(today())-new Date(db.cycleStart))/86400000)+1)} из 33 · Начало: ${db.cycleStart}`:'Цикл ещё не начат.';
$('affirmText').value='';$('morning').value=db.settings.morning;$('evening').value=db.settings.evening;$('reminders').checked=db.settings.reminders;
render369();
}
window.del=(k,i)=>{db[k].splice(i,1);save()};window.toggleWish=(i,v)=>{db.wishes[i].done=v;save()};
$('saveIntent').onclick=()=>{db.intent=$('intent').value;save();alert('Намерение сохранено')};
$('start33').onclick=()=>{if(!db.intent.trim())return alert('Сначала напиши намерение.');if(!db.cycleStart||confirm('Начать новый 33-дневный цикл?')){db.cycleStart=today();db.cycleDays=[];save()}};
function render369(){let d=db.cycleStart?Math.min(33,Math.floor((new Date(today())-new Date(db.cycleStart))/86400000)+1):0;let done=db.cycleDays.includes(today());$('369areas').innerHTML=`<p class="help">Сегодня: ${d?`день ${d} из 33`:'цикл не начат'}</p>${['Утро · 3 раза','День · 6 раз','Вечер · 9 раз'].map((n,i)=>`<div class="item"><span>${n}</span><span>${i===0?'3':i===1?'6':'9'} повторений</span></div>`).join('')}<button ${!db.cycleStart?'disabled':''} id="mark369">${done?'Сегодня отмечено ✓':'Отметить практику за сегодня'}</button>`;let b=$('mark369');if(b)b.onclick=()=>{if(!db.cycleDays.includes(today()))db.cycleDays.push(today());db.days[today()]=true;save()}}
$('saveScript').onclick=()=>{let text=$('scriptText').value.trim();if(!text)return alert('Добавь текст записи.');db.scripts.unshift({title:$('scriptTitle').value,text,date:today()});$('scriptText').value='';$('scriptTitle').value='';save()};
$('addPhoto').onclick=()=>{let f=$('photoInput').files[0];if(!f)return alert('Выбери фотографию.');if(f.size>2*1024*1024)return alert('Выбери фото до 2 МБ для этого прототипа.');let r=new FileReader();r.onload=()=>{db.photos.push({data:r.result,caption:$('photoCaption').value});$('photoInput').value='';$('photoCaption').value='';save()};r.readAsDataURL(f)};
$('saveThanks').onclick=()=>{let items=[...document.querySelectorAll('.gratitude')].map(x=>x.value.trim()).filter(Boolean);if(!items.length)return alert('Запиши хотя бы одну вещь.');db.thanks.unshift({date:today(),items});document.querySelectorAll('.gratitude').forEach(x=>x.value='');save()};
$('addAffirm').onclick=()=>{let a=$('affirmText').value.trim();if(a){db.affirmations.unshift(a);save()}};
$('addWish').onclick=()=>{let name=$('wishText').value.trim();if(!name)return alert('Напиши желание или цель.');db.wishes.unshift({name,step:$('wishStep').value.trim(),done:false});$('wishText').value='';$('wishStep').value='';save()};
$('newAff').onclick=()=>{if(db.affirmations.length){let a=db.affirmations[Math.floor(Math.random()*db.affirmations.length)];$('dailyAffirm').textContent=a}};
let month=new Date();function renderCalendar(){let y=month.getFullYear(),m=month.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0);$('monthName').textContent=first.toLocaleDateString('ru-RU',{month:'long',year:'numeric'});let html=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<div class="day">${x}</div>`).join('');let offset=(first.getDay()+6)%7;for(let i=0;i<offset;i++)html+='<div></div>';for(let d=1;d<=last.getDate();d++){let k=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;html+=`<div class="day ${db.days[k]?'done':''}">${d}</div>`}$('calendarGrid').innerHTML=html}
$('prevMonth').onclick=()=>{month.setMonth(month.getMonth()-1);renderCalendar()};$('nextMonth').onclick=()=>{month.setMonth(month.getMonth()+1);renderCalendar()};
$('reminders').onchange=e=>{db.settings.reminders=e.target.checked;save()};$('morning').onchange=e=>{db.settings.morning=e.target.value;save()};$('evening').onchange=e=>{db.settings.evening=e.target.value;save()};
$('askNotify').onclick=async()=>{if(!('Notification'in window))return $('notifyStatus').textContent='Этот браузер не поддерживает уведомления.';let p=await Notification.requestPermission();$('notifyStatus').textContent=p==='granted'?'Разрешение получено. Для надёжных уведомлений при закрытом приложении нужна установленная PWA с push-сервисом.':'Разрешение не предоставлено.'};
$('exportData').onclick=()=>{let a=document.createElement('a'),blob=new Blob([JSON.stringify(db)],{type:'application/json'});a.href=URL.createObjectURL(blob);a.download='manifest-backup.json';a.click();URL.revokeObjectURL(a.href)};
$('importData').onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader();r.onload=()=>{try{let x=JSON.parse(r.result);if(!x||!Array.isArray(x.wishes)||!Array.isArray(x.scripts))throw 0;db={...db,...x};save();alert('Копия восстановлена.')}catch(_){alert('Не удалось прочитать резервную копию.')}};r.readAsText(f)};
$('clearData').onclick=()=>{if(confirm('Точно удалить все записи? Сначала скачай резервную копию, если она нужна.')){localStorage.removeItem(KEY);location.reload()}};
load();render();

if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});

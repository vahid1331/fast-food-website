const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const LS=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch{return d}},SV=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>(+n).toLocaleString('fa-IR')+' تومان',fa=n=>(+n).toLocaleString('fa-IR');
const U=p=>(window.DATA&&DATA[p])||p;
const MEDIA=['v/v3.mp4','v/v4.mp4','v/v2.mp4','i/burger.webp','i/meat.webp'];
const DEF=[
{id:1,n:'برگر مخصوص اندیشه',p:189000,c:'برگر',m:'i/burger.webp'},
{id:2,n:'پیتزا پپرونی',p:245000,c:'پیتزا',m:'v/v3.mp4'},
{id:3,n:'پیتزا گوشت و قارچ',p:265000,c:'پیتزا',m:'v/v3.mp4'},
{id:4,n:'فتوچینی آلفردو',p:225000,c:'پاستا',m:'v/v4.mp4'},
{id:5,n:'اسپاگتی پنیری',p:205000,c:'پاستا',m:'v/v4.mp4'},
{id:6,n:'سیب‌زمینی سرخ‌شده',p:85000,c:'سیب‌زمینی',m:'v/v2.mp4'},
{id:7,n:'سیب‌زمینی ویژه',p:115000,c:'سیب‌زمینی',m:'v/v2.mp4'},
{id:8,n:'خوراک گوشت',p:295000,c:'غذای اصلی',m:'i/meat.webp'}];
let P=LS('ao_p',DEF),O=LS('ao_o',[]),C=LS('ao_c',{}),S=LS('ao_s',{pw:'1234',wa:'989385494107'}),cat='همه';
const toast=t=>{const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),2400)};
const media=m=>/\.mp4$/.test(m)?`<video src="${esc(U(m))}" muted loop playsinline preload="none" data-v></video>`:`<img src="${esc(U(m))}" alt="" loading="lazy">`;
/* video play only when visible */
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?e.target.play().catch(()=>{}):e.target.pause()),{threshold:.3});
const watch=()=>$$('video[data-v]').forEach(v=>io.observe(v));
/* menu */
function menu(){const cs=['همه',...new Set(P.map(p=>p.c))];
$('#tabs').innerHTML=cs.map(c=>`<button class="${c==cat?'on':''}" data-c="${esc(c)}">${esc(c)}</button>`).join('');
$('#grid').innerHTML=P.filter(p=>cat=='همه'||p.c==cat).map(p=>`<article class="card"><div class="m">${media(p.m)}</div><div class="t"><h3>${esc(p.n)}</h3><span class="c">${esc(p.c)}</span><div class="r"><b>${fmt(p.p)}</b><button class="btn" data-a="${p.id}">افزودن</button></div></div></article>`).join('');watch()}
$('#tabs').onclick=e=>{const c=e.target.dataset.c;if(c){cat=c;menu()}};
$('#grid').onclick=e=>{const a=e.target.dataset.a;if(a){C[a]=(C[a]||0)+1;SV('ao_c',C);cart();toast('به سبد اضافه شد')}};
$('#grid').onpointermove=e=>{const c=e.target.closest('.card');if(!c||e.pointerType!='mouse')return;const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`rotateY(${x*14}deg) rotateX(${-y*14}deg) translateZ(10px)`};
$('#grid').onpointerout=e=>{const c=e.target.closest('.card');if(c)c.style.transform=''};
/* cart */
const open=o=>{$('#dr').classList.toggle('on',o);$('#sh').classList.toggle('on',o)};
$('#cb').onclick=()=>open(1);$('#dx').onclick=$('#sh').onclick=()=>open(0);
const items=()=>Object.keys(C).map(id=>({p:P.find(x=>x.id==id),q:C[id]})).filter(x=>x.p);
function cart(){const l=items();$('#cn').textContent=fa(l.reduce((s,x)=>s+x.q,0));$('#ct').textContent=fmt(l.reduce((s,x)=>s+x.q*x.p.p,0));
$('#ci').innerHTML=l.length?l.map(x=>`<div class="it">${media(x.p.m).replace(' data-v','')}<div>${esc(x.p.n)}<br><small>${fmt(x.p.p)}</small></div><div class="q"><button data-d="${x.p.id}" data-s="1">+</button>${fa(x.q)}<button data-d="${x.p.id}" data-s="-1">−</button></div></div>`).join(''):'<p style="color:var(--mu)">سبد خالی است. از منو یک غذای خوشمزه انتخاب کنید.</p>'}
$('#ci').onclick=e=>{const d=e.target.dataset.d;if(!d)return;C[d]=(C[d]||0)+ +e.target.dataset.s;if(C[d]<1)delete C[d];SV('ao_c',C);cart()};
$('#fs').onclick=()=>{const l=items(),n=$('#fn').value.trim(),p=$('#fp').value.trim(),a=$('#fa').value.trim();
if(!l.length)return toast('سبد خالی است');if(!n||!/^[0-9۰-۹+]{10,14}$/.test(p)||!a)return alert('نام، شماره موبایل معتبر و آدرس را کامل وارد کنید.');
const t=l.reduce((s,x)=>s+x.q*x.p.p,0),o={id:Date.now(),n,p,a,t,st:'جدید',d:new Date().toLocaleString('fa-IR'),l:l.map(x=>({n:x.p.n,q:x.q,p:x.p.p}))};
O.unshift(o);SV('ao_o',O);C={};SV('ao_c',C);cart();open(0);
const tx=`سفارش جدید #${o.id}\n${o.l.map(x=>`${x.n} × ${x.q}`).join('\n')}\nجمع: ${fmt(t)}\nنام: ${n}\nموبایل: ${p}\nآدرس: ${a}`;
window.open(`https://wa.me/${S.wa}?text=${encodeURIComponent(tx)}`,'_blank');toast('سفارش ثبت شد')};
/* hero: all-intra H.264 video (-g 1), scroll maps to currentTime with slow damping */
const hv=$('#hv'),hc=$('#hc'),HS='v/hero.mp4',FPS=30,NF=249,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;let cur=0,last=-1,ready=0;
const hs=(window.DATA&&DATA[HS])||HS;
hv.onloadedmetadata=()=>{ready=1;hv.currentTime=.001};
fetch(hs).then(r=>r.blob()).then(b=>hv.src=URL.createObjectURL(b)).catch(()=>hv.src=hs);
(function loop(){const h=$('#hero'),r=h.getBoundingClientRect();
if(ready&&r.bottom>0&&r.top<innerHeight){const t=Math.min(1,Math.max(0,-r.top/(h.offsetHeight-innerHeight)));cur+=(t-cur)*(reduce?1:.04);if(Math.abs(t-cur)<.0004)cur=t;
const i=Math.round(cur*(NF-1));if(i!==last&&!hv.seeking){hv.currentTime=(i+.5)/FPS;last=i}
if(!reduce){hv.style.transform=`scale(${1.04+cur*.1})`;const o=Math.max(0,1-cur*2.4);hc.style.opacity=o;hc.style.transform=`translateY(${-cur*90}px)`;hc.style.pointerEvents=o<.15?'none':''}}
requestAnimationFrame(loop)})();
/* admin */
const A=$('#adm'),B=$('#ab2'),ST=['جدید','در حال آماده‌سازی','ارسال شد','تحویل شد','لغو شد'];
$('#ab').onclick=()=>{const p=prompt('رمز مدیر را وارد کنید:');if(p===S.pw){A.classList.add('on');adm('o')}else if(p!==null)alert('رمز اشتباه است.')};
$('#ax').onclick=()=>A.classList.remove('on');
function adm(t,ed){const tb=`<div class="tabs"><button class="${t=='o'?'on':''}" data-t="o">سفارش‌ها (${fa(O.length)})</button><button class="${t=='p'?'on':''}" data-t="p">محصولات</button><button class="${t=='s'?'on':''}" data-t="s">تنظیمات</button></div>`;let h='';
if(t=='o')h=O.length?O.map(o=>`<div class="row"><div><b>#${o.id}</b> ${esc(o.n)} · ${esc(o.p)}<br><small>${esc(o.d)} | ${esc(o.a)}<br>${o.l.map(x=>esc(x.n)+' × '+fa(x.q)).join('، ')}</small></div><b>${fmt(o.t)}</b><select data-st="${o.id}">${ST.map(s=>`<option${s==o.st?' selected':''}>${s}</option>`).join('')}</select><button class="btn o" data-do="${o.id}">حذف</button></div>`).join(''):'<p style="color:var(--mu)">هنوز سفارشی ثبت نشده.</p>';
if(t=='p'){const e=P.find(x=>x.id==ed)||{n:'',p:'',c:'',m:MEDIA[0]};
h=`<form id="pf"><input name="n" placeholder="نام محصول" value="${esc(e.n)}" required><input name="p" type="number" placeholder="قیمت (تومان)" value="${esc(e.p)}" required><input name="c" placeholder="دسته‌بندی" value="${esc(e.c)}" required><input name="m" list="ml" placeholder="مسیر ویدئو یا تصویر" value="${esc(e.m)}"><datalist id="ml">${MEDIA.map(m=>`<option value="${m}">`).join('')}</datalist><button class="btn">${ed?'ذخیره تغییرات':'افزودن محصول'}</button></form>`+P.map(p=>`<div class="row"><div>${esc(p.n)} · ${esc(p.c)}</div><b>${fmt(p.p)}</b><button class="btn b" data-e="${p.id}">ویرایش</button><button class="btn o" data-dp="${p.id}">حذف</button></div>`).join('')}
if(t=='s')h=`<form id="sf"><input name="pw" placeholder="رمز جدید مدیر" value="${esc(S.pw)}"><input name="wa" placeholder="شماره واتساپ با 98" value="${esc(S.wa)}"><button class="btn">ذخیره</button></form>`;
B.innerHTML=tb+h;B.dataset.ed=ed||''}
B.onclick=e=>{const d=e.target.dataset;if(d.t)adm(d.t);if(d.e)adm('p',d.e);
if(d.do&&confirm('این سفارش حذف شود؟')){O=O.filter(o=>o.id!=d.do);SV('ao_o',O);adm('o')}
if(d.dp&&confirm('این محصول حذف شود؟')){P=P.filter(p=>p.id!=d.dp);SV('ao_p',P);menu();cart();adm('p')}};
B.onchange=e=>{if(e.target.dataset.st){O.find(o=>o.id==e.target.dataset.st).st=e.target.value;SV('ao_o',O);toast('وضعیت ذخیره شد')}};
B.onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));
if(e.target.id=='pf'){const id=+B.dataset.ed,o={n:f.n,p:+f.p,c:f.c,m:f.m||MEDIA[0]};
if(id)Object.assign(P.find(x=>x.id==id),o);else P.push({id:Date.now(),...o});SV('ao_p',P);menu();cart();adm('p')}
else{S={pw:f.pw||'1234',wa:f.wa.replace(/\D/g,'')||S.wa};SV('ao_s',S);$('#wa').href='https://wa.me/'+S.wa;toast('تنظیمات ذخیره شد')}};
$$('video[src]').forEach(v=>v.src=U(v.getAttribute('src')));$('#wa').href='https://wa.me/'+S.wa;menu();cart();watch();

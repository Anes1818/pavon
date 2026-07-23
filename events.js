/* ===== Flowers Pavon — Seasonal Events Engine (ROBUSTE module) =====
   One-line install on any page: <script src="events.js" defer></script>

   What it does, automatically:
   - Computes the next US floral holiday (fixed + floating dates, any year).
   - 7 days before: gift tab appears, the whole site re-themes (CSS vars),
     and the catalog section renames itself to the event collection and
     filters to matching bouquets. Ends automatically after the event day.
   - DEMO mode (DEMO=true below): tab always visible + one-button event
     switcher inside the tab panel. Set DEMO=false for the live site.
   - Manual preview also works via URL: index.html?event=valentine
*/
(function(){
"use strict";

var DEMO = true;          // <- set to false in production
var WINDOW_DAYS = 7;      // tab + theme appear this many days before the event

function nth(y,mon,dow,n){ var d=new Date(y,mon,1); var off=(dow-d.getDay()+7)%7; return new Date(y,mon,1+off+(n-1)*7); }

var EVENTS=[
 {id:'valentine', icon:'💘', filter:'love', date:function(y){return new Date(y,1,14);},
  name:{en:"Valentine's Day",es:"San Valentín"},
  kicker:{en:"THE VALENTINE COLLECTION",es:"COLECCIÓN SAN VALENTÍN"},
  h:{en:"Say it with roses. Loudly. ❤️",es:"Dilo con rosas. Bien fuerte. ❤️"},
  p:{en:"Hand-sculpted ramos buchón for the biggest declarations — Valentine slots sell out every year, order early.",es:"Ramos buchón esculpidos a mano para las grandes declaraciones — los cupos de San Valentín vuelan cada año, pide temprano."},
  cta:{en:"💘 Shop Valentine bouquets",es:"💘 Ver ramos de San Valentín"},
  live:{en:"It's Valentine's Day! Order by 1PM for same-day delivery.",es:"¡Es San Valentín! Pide antes de la 1PM para entrega hoy."},
  theme:{'--rose':'#c11f45','--terra':'#a5173a','--blush':'#f2b8c6','--blush2':'#e895a8','--sand':'#f9e7e9'}, annc:'#4a0e1d'},

 {id:'womensday', icon:'💜', filter:'arreglos', date:function(y){return new Date(y,2,8);},
  name:{en:"Women's Day",es:"Día de la Mujer"},
  kicker:{en:"THE WOMEN'S DAY COLLECTION",es:"COLECCIÓN DÍA DE LA MUJER"},
  h:{en:"For the women who light every room. 💜",es:"Para las mujeres que lo iluminan todo. 💜"},
  p:{en:"Bright, elegant arrangements for March 8 — delivered same-day across Northern Virginia.",es:"Arreglos brillantes y elegantes para el 8 de marzo — entrega el mismo día en el norte de Virginia."},
  cta:{en:"💜 Shop the collection",es:"💜 Ver la colección"},
  live:{en:"Happy Women's Day! Order by 1PM for same-day delivery.",es:"¡Feliz Día de la Mujer! Pide antes de la 1PM."},
  theme:{'--rose':'#8e4d9e','--terra':'#7a3f8a','--blush':'#e3c6ec','--blush2':'#cfa3dd','--sand':'#f3ecf7'}, annc:'#3a2144'},

 {id:'mothersday', icon:'🌷', filter:'madre', date:function(y){return nth(y,4,0,2);},
  name:{en:"Mother's Day",es:"Día de la Madre"},
  kicker:{en:"THE MOTHER'S DAY COLLECTION",es:"COLECCIÓN DÍA DE LA MADRE"},
  h:{en:"Mamá deserves the whole garden. 🌷",es:"Mamá se merece el jardín entero. 🌷"},
  p:{en:"Our Mother's Day signatures — sunflower buchones and blooming domes she will never forget.",es:"Nuestras firmas del Día de la Madre — buchones de girasol y domos en flor que nunca olvidará."},
  cta:{en:"🌷 Shop Mother's Day",es:"🌷 Ver Día de la Madre"},
  live:{en:"It's Mother's Day! Order by 1PM for same-day delivery.",es:"¡Es el Día de la Madre! Pide antes de la 1PM."},
  theme:{'--rose':'#d4527b','--terra':'#b13a60','--blush':'#f6c6d4','--blush2':'#eda4b8','--sand':'#fbeaee'}, annc:'#5a1f33'},

 {id:'fathersday', icon:'🌻', filter:'buchon', date:function(y){return nth(y,5,0,3);},
  name:{en:"Father's Day",es:"Día del Padre"},
  kicker:{en:"THE FATHER'S DAY COLLECTION",es:"COLECCIÓN DÍA DEL PADRE"},
  h:{en:"Bold ramos for the man of the house. 🌻",es:"Ramos con carácter para papá. 🌻"},
  p:{en:"Sunflowers, structure and statement wraps — nothing shy about these buchones.",es:"Girasoles, estructura y envolturas imponentes — buchones sin timidez."},
  cta:{en:"🌻 Shop Father's Day",es:"🌻 Ver Día del Padre"},
  live:{en:"It's Father's Day! Order by 1PM for same-day delivery.",es:"¡Es el Día del Padre! Pide antes de la 1PM."},
  theme:{'--rose':'#2e5d8a','--terra':'#1f4668','--blush':'#c5d5e4','--blush2':'#a8c0d6','--sand':'#e9eef2'}, annc:'#16324a'},

 {id:'thanksgiving', icon:'🍂', filter:'arreglos', date:function(y){return nth(y,10,4,4);},
  name:{en:"Thanksgiving",es:"Acción de Gracias"},
  kicker:{en:"THE THANKSGIVING COLLECTION",es:"COLECCIÓN ACCIÓN DE GRACIAS"},
  h:{en:"A table that says thank you. 🍂",es:"Una mesa que dice gracias. 🍂"},
  p:{en:"Warm autumn arrangements for the gathering season — centerpieces that host the table with you.",es:"Arreglos otoñales cálidos para la temporada de reuniones — centros de mesa que reciben contigo."},
  cta:{en:"🍂 Shop Thanksgiving",es:"🍂 Ver Acción de Gracias"},
  live:{en:"Happy Thanksgiving! Order by 1PM for same-day delivery.",es:"¡Feliz Acción de Gracias! Pide antes de la 1PM."},
  theme:{'--rose':'#b96a2f','--terra':'#9a4f1e','--blush':'#eed3b8','--blush2':'#dfb98f','--sand':'#f6e8d6'}, annc:'#4a2a10'},

 {id:'christmas', icon:'🎄', filter:'eternas', date:function(y){return new Date(y,11,25);},
  name:{en:"Christmas",es:"Navidad"},
  kicker:{en:"THE CHRISTMAS COLLECTION",es:"COLECCIÓN NAVIDEÑA"},
  h:{en:"Roses that outlast the season. 🎄",es:"Rosas que duran más que diciembre. 🎄"},
  p:{en:"Preserved eternal roses and festive arrangements — gifts that keep blooming into the new year.",es:"Rosas eternas preservadas y arreglos festivos — regalos que siguen floreciendo en el año nuevo."},
  cta:{en:"🎄 Shop Christmas gifts",es:"🎄 Ver regalos de Navidad"},
  live:{en:"Merry Christmas! Order by 1PM for same-day delivery.",es:"¡Feliz Navidad! Pide antes de la 1PM."},
  theme:{'--rose':'#b3223f','--terra':'#1e5b38','--blush':'#cfe3d2','--blush2':'#a8cdb0','--sand':'#e9f0e6'}, annc:'#12331f'}
];

var T={
 next:{en:'NEXT EVENT',es:'PRÓXIMO EVENTO'},
 now:{en:'HAPPENING NOW',es:'ES HOY'},
 switch_:{en:'⟳ Switch event',es:'⟳ Cambiar evento'},
 auto:{en:'auto (real calendar)',es:'auto (calendario real)'},
 days:{en:'d',es:'d'}
};

function lang(){ try{ return (localStorage.getItem('pavonLang')||'en')==='es'?'es':'en'; }catch(e){ return 'en'; } }
function q(s){ return document.querySelector(s); }

/* ---- resolve which event is next / active ---- */
var DAY=86400000;
function startOf(e){ var now=new Date(), y=now.getFullYear(); var d=e.date(y); var end=new Date(d.getTime()+DAY); if(now>=end){ d=e.date(y+1); } return d; }
function nextEvent(){ var best=null,bd=null; EVENTS.forEach(function(e){ var d=startOf(e); if(!bd||d<bd){bd=d;best=e;} }); return best; }

var override=null;
try{
  var qs=new URLSearchParams(location.search).get('event');
  var ls=localStorage.getItem('pavonEventDemo')||'';
  var pick=qs!==null?qs:ls;
  if(pick){ EVENTS.forEach(function(e){ if(e.id===pick) override=e; }); }
}catch(e){}

var nextEv=nextEvent();
var activeEv=null;
if(override){ activeEv=override; }
else{ var st=startOf(nextEv); if(new Date().getTime() >= st.getTime()-WINDOW_DAYS*DAY){ activeEv=nextEv; } }
var showTab = DEMO || !!activeEv;
if(!showTab) return;

/* ---- inject styles ---- */
var css=''+
'#evTab{position:fixed;right:0;top:42%;z-index:96;background:var(--card);border:3px solid var(--ink);border-right:none;border-radius:14px 0 0 14px;padding:10px 11px 8px;cursor:pointer;box-shadow:-4px 4px 0 rgba(51,49,42,.16);display:flex;flex-direction:column;align-items:center;gap:4px;animation:evPulse 3.2s ease-in-out infinite}'+
'#evTab .ico{font-size:22px;line-height:1}'+
'#evTab .cnt{font-family:var(--px);font-size:8.5px;color:var(--rose);letter-spacing:.04em}'+
'@keyframes evPulse{0%,100%{transform:scale(1)}6%{transform:scale(1.09)}12%{transform:scale(1)}}'+
'#evPanel{position:fixed;right:14px;top:42%;transform:translateY(-12px);z-index:97;width:274px;max-width:calc(100vw - 28px);background:var(--card);border:3px solid var(--ink);box-shadow:6px 6px 0 rgba(51,49,42,.16);padding:20px 18px 12px;display:none}'+
'#evPanel.open{display:block}'+
'#evPanel .evx{position:absolute;top:8px;right:10px;background:none;border:none;font-size:15px;cursor:pointer;color:var(--muted)}'+
'#evPanel .evico{font-size:34px;line-height:1;margin-bottom:8px}'+
'#evPanel .evkick{font-family:var(--px);font-size:8.5px;letter-spacing:.14em;color:var(--terra);margin-bottom:6px}'+
'#evPanel h3{font-family:var(--serif);font-size:22px;margin:0 0 10px;color:var(--ink)}'+
'#evPanel .evcd{font-family:var(--px);font-size:15px;color:var(--rose);margin:0 0 14px;letter-spacing:.04em}'+
'#evPanel .evlive{font-size:13.5px;font-weight:600;color:var(--ink);margin:0 0 14px;line-height:1.5}'+
'#evPanel .btn{display:block;text-align:center;text-decoration:none;font-weight:700;font-size:14px;padding:11px 12px;border-radius:12px}'+
'#evPanel .evdemo{margin-top:14px;padding-top:10px;border-top:2px dashed var(--line);display:flex;align-items:center;gap:8px;flex-wrap:wrap}'+
'#evPanel .evdemo .tag{font-family:var(--px);font-size:7.5px;background:var(--ink);color:#fff;padding:3px 6px;border-radius:4px}'+
'#evPanel .evdemo button{font-family:var(--sans);font-weight:700;font-size:12px;background:var(--sand);border:2px solid var(--ink);border-radius:9px;padding:5px 9px;cursor:pointer}'+
'#evPanel .evdemo small{flex-basis:100%;color:var(--muted);font-size:11px}'+
'.fbtn.ev-glow{outline:3px solid var(--rose);outline-offset:2px}'+
'@media(max-width:720px){#evTab{top:34%}#evPanel{top:34%}}';
var st_=document.createElement('style'); st_.textContent=css; document.head.appendChild(st_);

/* ---- inject tab + panel ---- */
var tab=document.createElement('button'); tab.id='evTab'; tab.setAttribute('aria-label','Upcoming event');
tab.innerHTML='<span class="ico">🎁</span><span class="cnt" id="evTabCnt"></span>';
var panel=document.createElement('div'); panel.id='evPanel';
panel.innerHTML='<button class="evx" id="evClose" aria-label="Close">✕</button>'+
'<div class="evico" id="evIco"></div><div class="evkick" id="evKick"></div><h3 id="evName"></h3>'+
'<div class="evcd" id="evCd"></div><div class="evlive" id="evLive" style="display:none"></div>'+
'<a class="btn btn-rose" id="evCta" href="#catalog"></a>'+
(DEMO?'<div class="evdemo"><span class="tag">DEMO</span><button id="evSwitch"></button><small id="evMode"></small></div>':'');
document.body.appendChild(tab); document.body.appendChild(panel);

tab.addEventListener('click',function(){ panel.classList.toggle('open'); });
q('#evClose').addEventListener('click',function(){ panel.classList.remove('open'); });
try{ if(sessionStorage.getItem('pavonEvPanel')==='1'){ panel.classList.add('open'); sessionStorage.removeItem('pavonEvPanel'); } }catch(e){}

/* ---- demo switcher: one button cycles auto -> each event -> auto ---- */
if(DEMO){
  q('#evSwitch').addEventListener('click',function(){
    var ids=EVENTS.map(function(e){return e.id;});
    var cur=''; try{ cur=localStorage.getItem('pavonEventDemo')||''; }catch(e){}
    var list=[''].concat(ids);
    var nxt=list[(list.indexOf(cur)+1)%list.length];
    try{ if(nxt)localStorage.setItem('pavonEventDemo',nxt); else localStorage.removeItem('pavonEventDemo'); sessionStorage.setItem('pavonEvPanel','1'); }catch(e){}
    var u=location.pathname+location.hash; location.href=u; // drop ?event= param, reload with new mode
  });
}

/* ---- theme + catalog transform when an event is active ---- */
function applyTheme(e){
  document.body.setAttribute('data-event',e.id);
  var root=document.documentElement.style;
  Object.keys(e.theme).forEach(function(k){ root.setProperty(k,e.theme[k]); });
  var a=q('#annc'); if(a){ a.style.background=e.annc; }
}
function transformCatalog(e){
  var k=q('#catalog .sec-head .kicker'), h=q('#catalog .sec-head h2'), p=q('#catalog .sec-head p');
  var l=lang();
  if(k){ k.removeAttribute('data-i18n'); k.textContent='✦ '+e.kicker[l]; }
  if(h){ h.removeAttribute('data-i18n'); h.textContent=e.h[l]; }
  if(p){ p.removeAttribute('data-i18n'); p.textContent=e.p[l]; }
  var fb=document.querySelector('.fbtn[data-f="'+e.filter+'"]');
  if(fb){ fb.click(); document.querySelectorAll('.fbtn').forEach(function(b){b.classList.remove('ev-glow');}); fb.classList.add('ev-glow'); }
}
if(activeEv){ applyTheme(activeEv); }

/* ---- render loop (countdown + language sync) ---- */
var lastLang=null;
function pad(n){ return (n<10?'0':'')+n; }
function render(){
  var l=lang();
  var ev=activeEv||nextEv;
  var start=override?startOf(ev):startOf(ev); // same resolver either way
  var now=new Date();
  var end=new Date(start.getTime()+DAY);
  var isLive=now>=start&&now<end;
  var ms=start-now;
  var d=Math.floor(ms/DAY), hh=Math.floor(ms%DAY/3600000), mm=Math.floor(ms%3600000/60000), ss=Math.floor(ms%60000/1000);
  q('#evTabCnt').textContent=isLive?ev.icon:(d>0?d+T.days[l]:pad(hh)+':'+pad(mm));
  q('#evCd').textContent=isLive?'🎉':(d>0? d+T.days[l]+' '+pad(hh)+':'+pad(mm)+':'+pad(ss) : pad(hh)+':'+pad(mm)+':'+pad(ss));
  q('#evCd').style.display=isLive?'none':'block';
  var lv=q('#evLive'); lv.style.display=isLive?'block':'none'; if(isLive)lv.textContent=ev.live[l];
  if(l!==lastLang){
    lastLang=l;
    q('#evIco').textContent=ev.icon;
    q('#evKick').textContent=(activeEv?T.now:T.next)[l];
    if(!isLive&&activeEv)q('#evKick').textContent=T.next[l];
    if(isLive)q('#evKick').textContent=T.now[l];
    q('#evName').textContent=ev.name[l];
    q('#evCta').textContent=ev.cta[l];
    if(DEMO){ q('#evSwitch').textContent=T.switch_[l]; q('#evMode').textContent=override?('event: '+override.id):T.auto[l]; }
    if(activeEv){ transformCatalog(activeEv); }
  }
}
render();
setInterval(render,1000);
})();

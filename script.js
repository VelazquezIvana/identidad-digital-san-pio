'use strict';
const $ = id => document.getElementById(id);
const colors = ['#f65ac5','#47d9ff','#a877ff','#48e6ac','#ffae4f','#ff6a79'];
const hairs = [...Array.from({length:26},(_,i)=>`long${String(i+1).padStart(2,'0')}`),...Array.from({length:19},(_,i)=>`short${String(i+1).padStart(2,'0')}`)];
const palettes={hairColor:[['Castaño','#593a2b'],['Negro','#221b24'],['Rubio','#e8bb72'],['Rojizo','#a85138'],['Rosa','#ee71ad'],['Violeta','#8754bb'],['Azul','#438cc7']],skin:[['Claro','#f5d4b4'],['Beige','#e6b98d'],['Trigueño','#c99165'],['Moreno','#9c6249'],['Oscuro','#65402f']],eyes:[...Array(26)].map((_,i)=>[`Ojos ${i+1}`,`variant${String(i+1).padStart(2,'0')}`]),mouth:[...Array(30)].map((_,i)=>[`Expresión ${i+1}`,`variant${String(i+1).padStart(2,'0')}`])};
const state={alias:'PLAYER 01',role:'PROGRAMADOR/A WEB',hair:'long01',hairColor:'593a2b',skin:'e6b98d',eyes:'variant01',mouth:'variant01',glasses:'0',accent:colors[0]};
function populate(id,items){const el=$(id);for(const [label,value] of items){const opt=document.createElement('option');opt.value=value;opt.textContent=label;el.append(opt)}}
populate('hair',hairs.map((x,i)=>[`${x.startsWith('long')?'Largo':'Corto'} ${x.slice(-2)}`,x]));for(const k of ['hairColor','skin','eyes','mouth'])populate(k,palettes[k].map(([a,b])=>[a,b.replace('#','')]));
function setForm(){for(const id of ['alias','role','hair','hairColor','skin','eyes','mouth','glasses'])$(id).value=state[id];document.querySelectorAll('.swatch').forEach(x=>x.classList.toggle('active',x.dataset.color===state.accent))}
for(const color of colors){const btn=document.createElement('button');btn.className='swatch';btn.style.background=color;btn.dataset.color=color;btn.setAttribute('aria-label','Elegir color '+color);btn.onclick=()=>{state.accent=color;setForm();render()};$('palette').append(btn)}
for(const id of ['alias','role','hair','hairColor','skin','eyes','mouth','glasses'])$(id).addEventListener(id==='alias'?'input':'change',e=>{state[id]=e.target.value;render()});
 function avatarUrl() {
    const p = new URLSearchParams({
        seed: 'SanPio2026',
        hair: state.hair,
        hairColor: state.hairColor,
        skinColor: state.skin,
        eyes: state.eyes,
        mouth: state.mouth,
        glassesProbability: state.glasses === '1' ? '100' : '0',
        size: '512'
    });

    return 'https://api.dicebear.com/9.x/adventurer/svg?' + p.toString();
}



let loadedUrl='',pending=0;


function render()
    {state.alias=state.alias.slice(0,22);$('displayAlias').textContent=state.alias.trim()||'PLAYER 01';$('displayRole').textContent=state.role;$('card').style.setProperty('--accent',state.accent);$('qrPanel').hidden=true;const url=avatarUrl();if(url===loadedUrl)return;const request=++pending;$('loading').hidden=false;$('status').textContent='Cargando personaje desde DiceBear…';const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{if(request!==pending)return;$('avatar').src=url;loadedUrl=url;$('loading').hidden=true;$('status').textContent='¡Listo! Personalizá y descargá tu credencial.'};

    img.onerror=()=>
        {if(request!==pending)return;$('loading').textContent='No se pudo cargar el avatar';$('status').textContent='Para mostrar los avatares DiceBear necesitás conexión a internet.'};img.src=url}
        

function randomItem(a){return a[Math.floor(Math.random()*a.length)]}
$('random').onclick=()=>{state.hair=randomItem(hairs);state.hairColor=randomItem(palettes.hairColor)[1].slice(1);state.skin=randomItem(palettes.skin)[1].slice(1);state.eyes=randomItem(palettes.eyes)[1];state.mouth=randomItem(palettes.mouth)[1];state.glasses=Math.random()>.6?'1':'0';state.accent=randomItem(colors);setForm();render()};
$('reset').onclick=()=>{Object.assign(state,{alias:'PLAYER 01',role:'PROGRAMADOR/A WEB',hair:'long01',hairColor:'593a2b',skin:'e6b98d',eyes:'variant01',mouth:'variant01',glasses:'0',accent:colors[0]});setForm();render()};
function roundRect(ctx,x,y,w,h,r,fill){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill()}
async function drawCard(){const canvas=document.createElement('canvas');canvas.width=900;canvas.height=1320;const c=canvas.getContext('2d');const bg=c.createLinearGradient(0,0,900,1320);bg.addColorStop(0,'#18264e');bg.addColorStop(1,'#080d21');c.fillStyle=bg;c.fillRect(0,0,900,1320);c.strokeStyle=state.accent;c.lineWidth=9;c.strokeRect(22,22,856,1276);c.fillStyle='#85e9ff';c.font='bold 25px Arial';c.fillText('INSTITUTO DE EDUCACIÓN SUPERIOR SAN PÍO DE PIETRELCINA ',70,95);c.fillStyle='#fff';c.font='bold 55px Arial';c.fillText('FERIA DE CIENCIAS 2026',70,167);roundRect(c,65,205,770,715,28,'#202d59');const glow=c.createRadialGradient(450,555,10,450,555,350);glow.addColorStop(0,state.accent+'99');glow.addColorStop(1,'#202d5900');c.fillStyle=glow;c.fillRect(65,205,770,715);
const img=await loadImage(avatarUrl());c.drawImage(img,120,255,660,660);
c.fillStyle='#ff85d7';c.font='bold 21px Arial';c.fillText('IDENTIDAD DESBLOQUEADA',70,965);c.fillStyle='#fff';let alias=state.alias.trim()||'PLAYER 01';c.font=`bold ${alias.length>17?42:56}px Arial`;c.fillText(alias,70,1030,750);c.fillStyle=state.accent;c.font='bold 27px Arial';c.fillText(state.role,70,1080,750);roundRect(c,65,1110,770,135,18,'#21375e');c.fillStyle='#fff';c.font='bold 25px Arial';c.fillText('¡YO PARTICIPÉ EN LA',93,1159);c.fillText('FERIA DE CIENCIAS 2026!TECNICATURA SUPERIOR EN DESARROLLO DE SOFTWARE ',93,1193);c.fillStyle='#b8c8e5';c.font='17px Arial';c.fillText('LO QUE IMAGINÁS, PODÉS PROGRAMARLO.',93,1224);return canvas}
function loadImage(url){return new Promise((resolve,reject)=>{const img=new Image();img.crossOrigin='anonymous';img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('No se pudo descargar la ilustración'));img.src=url})}
$('download').onclick=async()=>{try{$('status').textContent='Preparando imagen…';const canvas=await drawCard();const a=document.createElement('a');a.download='Identidad_Digital_San_Pio_2026.png';a.href=canvas.toDataURL('image/png');a.click();$('status').textContent='¡Credencial descargada!'}catch(e){$('status').textContent='No se pudo exportar. Revisá tu conexión o probá con el sitio publicado en GitHub Pages.';console.error(e)}};
function shareUrl(){if(location.protocol==='file:')return null;const url=new URL(location.href);url.search='';const data={};for(const key of Object.keys(state))data[key]=state[key];url.searchParams.set('avatar',encodeURIComponent(JSON.stringify(data)));return url.href}
$('share').onclick=()=>{const url=shareUrl();if(!url){alert('Para generar un QR que abra tu credencial en el celular, primero publicá esta carpeta en GitHub Pages.');return}const qr='https://api.qrserver.com/v1/create-qr-code/?size=240x240&data='+encodeURIComponent(url);$('qr').src=qr;$('qrPanel').hidden=false;$('qrPanel').scrollIntoView({behavior:'smooth',block:'nearest'})};
$('copy').onclick=async()=>{const url=shareUrl();if(!url)return;try{await navigator.clipboard.writeText(url);$('copy').textContent='✓ Enlace copiado'}catch{prompt('Copiá el enlace:',url)}};
try{const q=new URLSearchParams(location.search).get('avatar');if(q){const data=JSON.parse(decodeURIComponent(q));for(const key of Object.keys(state)){if(typeof data[key]==='string')state[key]=data[key].slice(0,key==='alias'?22:100)}if(!colors.includes(state.accent))state.accent=colors[0];if(!hairs.includes(state.hair))state.hair='long01';if(!palettes.eyes.some(v=>v[1]===state.eyes))state.eyes='variant01';if(!palettes.mouth.some(v=>v[1]===state.mouth))state.mouth='variant01';if(!['0','1'].includes(state.glasses))state.glasses='0'}}catch(e){console.warn('Enlace de avatar inválido',e)}setForm();render();

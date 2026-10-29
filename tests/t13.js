const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,x??'')}else console.log('ok',n)};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();await pg.setViewport({width:412,height:915,deviceScaleFactor:2,isMobile:true,hasTouch:true});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await pg.evaluate(()=>localStorage.setItem('rp_age','ok'));await pg.reload();await w(500);
const ov=()=>pg.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1);
ok('chats no overflow',await ov());
await pg.evaluate(()=>nav('chars'));await w(300);ok('chars cards',await pg.evaluate(()=>document.querySelectorAll('.ccard').length>=2&&!!document.querySelector('#genc')));ok('chars no overflow',await ov());
// no key empty state
const r=await pg.evaluate(async()=>{const o={};S.apiKey='';const c=(await all('chars')).find(x=>/Mara/.test(x.name));await newChat(c.id);await new Promise(z=>setTimeout(z,400));
o.inchat=document.body.classList.contains('inchat');o.navHidden=getComputedStyle(document.querySelector('nav')).display==='none'||document.querySelector('nav').hidden||document.querySelector('nav').getBoundingClientRect().height===0;
o.nokey=!!document.querySelector('#nokey');S.apiKey='x';
const RF=window.fetch;window.fetch=async(u,op)=>{u=String(u);if(u.startsWith('data:'))return RF(u);if(u.includes('chat/completions'))return new Response(JSON.stringify({error:{message:'boom'}}),{status:500});return RF(u,op)};
document.querySelector('#composer textarea').value='Hello there';document.querySelector('#composer button:last-child').click();await new Promise(z=>setTimeout(z,900));
o.retry=!!document.querySelector('[data-a=retry]');
document.querySelector('.msg [data-a=more]').click();await new Promise(z=>setTimeout(z,550));o.sheet=!!document.querySelector('#asheet .arow[data-k=del]');
o.rowsH=Math.min(...[...document.querySelectorAll('#asheet .arow')].map(x=>x.getBoundingClientRect().height));
o.delRed=getComputedStyle(document.querySelector('#asheet .arow[data-k=del]')).color;
document.querySelector('#asheet .arow.cancel').click();await new Promise(z=>setTimeout(z,200));o.closed=!document.querySelector('#asheet');
const n0=curChat.messages.length;window.confirm=()=>true;document.querySelector('.msg [data-a=more]').click();await new Promise(z=>setTimeout(z,550));document.querySelector('#asheet .arow[data-k=del]').click();await new Promise(z=>setTimeout(z,400));
o.deleted=curChat.messages.length===n0-1;o.undo=!!document.querySelector('#undob');document.querySelector('#undob').click();await new Promise(z=>setTimeout(z,400));o.restored=curChat.messages.length===n0&&document.querySelectorAll('.msg').length===n0;
const el=document.querySelector('.msg');el.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true}));await new Promise(z=>setTimeout(z,550));o.ctx=!!document.querySelector('#asheet');document.querySelector('#asheet .arow.cancel').click();
return o});
for(const k in r)ok(k,k==='rowsH'?r[k]>=48:k==='delRed'?/248, 113, 113/.test(r[k]):r[k],r[k]);
ok('chat no overflow',await ov());
await pg.evaluate(()=>{document.querySelectorAll('#toast,#undo').forEach(x=>x.hidden=true);document.querySelector('.msg').scrollIntoView({block:'center'})});await w(200);
const bx=await pg.evaluate(()=>{const r=document.querySelector('.msg').getBoundingClientRect();return{x:r.left+30,y:r.top+20}});
await pg.touchscreen.touchStart(bx.x,bx.y);await w(800);await pg.touchscreen.touchEnd();await w(200);ok('long-press sheet',await pg.evaluate(()=>!!document.querySelector('#asheet')));await pg.evaluate(()=>document.querySelector('#asheet .arow.cancel')?.click());
// image failure + cancel
const im=await pg.evaluate(async()=>{const o={};S.imgFlow='quick';S.imgProvider='runware';S.runKey='x';let hang;const RF=window.fetch;
window.fetch=async(u,op)=>{u=String(u);if(u.startsWith('data:'))return RF(u);if(u.includes('runware'))return new Response(JSON.stringify({errors:[{message:'bad model'}]}),{status:400});return RF(u,op)};
const c=await get('chars',curChat.charId);const i=curChat.messages.findIndex(m=>m.role==='assistant');await sceneImage(i,c,false,'test prompt').catch(()=>{});await new Promise(z=>setTimeout(z,300));o.retryimg=!!document.querySelector('[data-a=retryimg]');
window.fetch=async(u,op)=>{u=String(u);if(u.includes('runware'))return new Promise(()=>{});return RF(u,op)};const pr=sceneImage(i,c,false,'test prompt').catch(()=>{});await new Promise(z=>setTimeout(z,300));o.ph=!!document.querySelector('.ph [data-a=cancelimg]');document.querySelector('.ph [data-a=cancelimg]')?.click();await Promise.race([pr,new Promise(z=>setTimeout(z,1500))]);await new Promise(z=>setTimeout(z,200));o.cancelled=!document.querySelector('.ph');return o});
for(const k in im)ok(k,im[k]);
// back + settings
await pg.evaluate(()=>nav('settings'));await w(400);
const s=await pg.evaluate(async()=>{const o={};o.navBack=!document.body.classList.contains('inchat');const adv=document.querySelector('details.sec[data-sec=adv]');o.advClosed=adv&&!adv.open;const ch=document.querySelector('details.sec[data-sec=chat]');ch.querySelector('summary').click();await new Promise(z=>setTimeout(z,100));o.collapsed=!ch.open;o.saved=/chat/.test(localStorage.getItem('rp_secs')||'');
const f=document.querySelector('#sfind');f.value='video';f.dispatchEvent(new Event('input'));o.filter=[...document.querySelectorAll('details.sec')].filter(d=>getComputedStyle(d).display!=='none').map(d=>d.dataset.sec).join();f.value='';f.dispatchEvent(new Event('input'));
o.masked=[...document.querySelectorAll('input[data-badge],.keyrow input')].every(i=>i.type==='password');return o});
for(const k in s)ok(k,k==='filter'?/^(images,)?video$/.test(s[k]):s[k],s[k]);
ok('settings no overflow',await ov());
await pg.reload();await w(500);await pg.evaluate(()=>nav('settings'));await w(300);ok('rp_secs remembered',await pg.evaluate(()=>!document.querySelector('details.sec[data-sec=chat]').open));
ok('no page errors',errs.length===0,errs);await ctx.close()}
console.log(F?'FAILURES '+F:'ALL PASS');await b.close()})();

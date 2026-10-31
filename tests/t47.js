const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??'').slice(0,900))}else console.log('ok',n)};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();await pg.setViewport({width:412,height:915,deviceScaleFactor:1,hasTouch:true,isMobile:true});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await pg.evaluate(()=>{localStorage.setItem('rp_age','ok');localStorage.setItem('rp_settings',JSON.stringify({apiKey:'FAKE',baseUrl:'https://api.x.ai/v1',model:'m',runKey:'FAKE',imgProvider:'runware'}))});await pg.reload();await w(800);
// ---- prompts, narrator, note, stall fallback ----
let r=await pg.evaluate(async()=>{window.B=[];window.REPLY='Let us go to the listing now.';window.NOTE='STORY SO FAR (facts established in this chat; treat as true)\nNow: evening, Brittany SUV\nPlaces: 14 Elm St listing, blue door\nOpen threads: lockbox';window.fetch=async(u,o)=>{const bd=JSON.parse(o.body);B.push(bd);if(bd.stream===false)return new Response(JSON.stringify({choices:[{message:{content:NOTE}}]}),{status:200,headers:{'content-type':'application/json'}});return new Response(`data: {"choices":[{"delta":{"content":${JSON.stringify(REPLY)}}}]}\n\ndata: [DONE]\n\n`,{status:200,headers:{'content-type':'text/event-stream'}})};
 await addPm(['pm-brittany']);const c=await get('chars','c-pm-brittany');const ch={id:'n1',charId:c.id,title:'t',updated:Date.now(),messages:[{id:'a',role:'assistant',text:'hi'},{id:'u',role:'user',text:'lets go to the listing on Elm'}]};await put('chats',ch);curChat=await get('chats','n1');view='chat';await render();
 const sysL=buildMessages(c,2)[0].content;curChat.narr='active';const sysA=buildMessages(c,2)[0].content;curChat.narr='off';const sysO=buildMessages(c,2)[0].content;curChat.narr=undefined;curChat.note='STORY SO FAR (facts established in this chat; treat as true)\nNow: car';const sysN=buildMessages(c,2)[0].content;curChat.note='';
 // generate 4 replies with identical text -> stall fallback + note update
 const outs=[];for(let i=0;i<4;i++){curChat.messages.push({id:'x'+i,role:'user',text:'ok'});await generate(c);await new Promise(z=>setTimeout(z,150))}
 const streams=B.filter(x=>x.stream);const lastSys=streams.at(-1).messages.filter(m=>m.role==='system').map(m=>m.content);const side=B.filter(x=>x.stream===false);
 const saved=await get('chats','n1');curChat.narr='off';curChat.messages.push({id:'y',role:'user',text:'ok'});B.length=0;await generate(c);const offSys=B.filter(x=>x.stream)[0].messages.filter(m=>m.role==='system').map(m=>m.content);
 return{sysL,sysA,sysO,sysN,lastSys,side,saved:{note:saved.note,noteN:saved.noteN},offSys,hooks:c.hooks,rev:c.pmRev}});
ok('light narrator in prompt',/Scene progress: when the scene has stalled/.test(r.sysL)&&!/every reply must change/.test(r.sysL),r.sysL.slice(0,600));
ok('active narrator',/every reply must change something concrete/.test(r.sysA)&&/never write .*actions, words or feelings/.test(r.sysA)&&/At most one advance/.test(r.sysA));
ok('off has no narrator',!/Scene progress/.test(r.sysO));
ok('facts rule always',[r.sysL,r.sysA,r.sysO].every(s=>/Established facts: everything in the Story So Far note/.test(s)&&/Never ask whether something exists/.test(s)));
ok('never-speak-for-user intact',[r.sysL,r.sysA,r.sysO].every(s=>/never speak for/i.test(s)));
ok('note after card, last',r.sysN.trim().endsWith('Now: car')&&r.sysN.indexOf('STORY SO FAR')>r.sysN.indexOf('Personality:')&&!/STORY SO FAR \(facts/.test(r.sysL));
ok('stall -> fallback line not old hint (narrator on)',r.lastSys.some(s=>/If the last two replies shared the same goal, resolve it/.test(s))&&!r.lastSys.some(s=>/Break the loop/.test(s)),r.lastSys);
ok('stall -> old hint when narrator off',r.offSys.some(s=>/Break the loop/.test(s))&&!r.offSys.some(s=>/resolve it in this reply/.test(s)),r.offSys);
ok('side call every 4 replies',r.side.length===1&&r.side[0].temperature===0.7&&r.side[0].top_p===0.95&&/You maintain a story-so-far note/.test(r.side[0].messages[0].content),r.side.map(x=>[x.temperature,x.top_p]));
ok('note stored with chat',/14 Elm St/.test(r.saved.note)&&r.saved.noteN>=4,r.saved);
ok('brittany hooks',/signed offer on the 3\/2/.test(r.hooks)&&/patio/.test(r.hooks)&&r.rev===2);
// resume triggers update; failure silent; auto-off respected
r=await pg.evaluate(async()=>{B.length=0;curChat.messages.push({id:'z',role:'assistant',text:'new thing'});await put('chats',curChat);await openChat('n1');await new Promise(z=>setTimeout(z,300));const a=B.filter(x=>x.stream===false).length;
 window.fetch=async()=>{throw Error('net')};curChat.messages.push({id:'z2',role:'assistant',text:'x'});await put('chats',curChat);await openChat('n1');await new Promise(z=>setTimeout(z,300));
 S.noteAuto=false;let n=0;window.fetch=async()=>{n++;return new Response('{}')};curChat.messages.push({id:'z3',role:'assistant',text:'y'});await put('chats',curChat);await openChat('n1');await new Promise(z=>setTimeout(z,300));S.noteAuto=true;
 return{a,n,note:curChat.note,toast:$('#toast').hidden||!/error|fail/i.test($('#toast').textContent)}});
ok('resume updates once',r.a===1,r);ok('failure silent, note kept',/14 Elm/.test(r.note)&&r.toast,r);ok('auto-off: no side call',r.n===0,r);
// chat menu: note view/edit/clear, narrator setting
r=await pg.evaluate(async()=>{const W=t=>new Promise(z=>setTimeout(z,t));curChat.narr=undefined;$('#chmenu').click();await W(500);const lbls=[...document.querySelectorAll('#asheet .arow span')].map(x=>x.textContent);document.querySelector('#asheet [data-k=note]').click();await W(100);const tx=$('#notetx').value;$('#notetx').value='Now: patio';$('#notesv').click();await W(100);const ed=(await get('chats','n1')).note;
 $('#chmenu').click();await W(500);document.querySelector('#asheet [data-k=note]').click();await W(100);$('#noteclr').click();await W(100);const cl=(await get('chats','n1')).note;
 $('#chmenu').click();await W(500);document.querySelector('#asheet [data-k=narr]').click();await W(500);document.querySelector('#asheet [data-k=active]').click();await W(100);const nr=(await get('chats','n1')).narr;
 nav('settings');await W(300);const tog=!!$('#s_noteAuto');return{lbls,tx,ed,cl,nr,tog}});
ok('menu items',/Story so far/.test(r.lbls[0])&&/Narrator: Light/.test(r.lbls[1]),r.lbls);ok('note view',/14 Elm/.test(r.tx));ok('note edit keeps header',/^STORY SO FAR/.test(r.ed)&&/Now: patio/.test(r.ed),r.ed);ok('note clear',r.cl==='');ok('narrator per chat',r.nr==='active');ok('settings toggle',r.tog);
r=await pg.evaluate(async()=>{let blob;window.download=(n,o)=>{blob=o};const ch=await get('chats','n1');ch.note='STORY SO FAR (facts established in this chat; treat as true)\nNow: x';await put('chats',ch);await exportAll(false);return blob.chats.find(c=>c.id==='n1')?.note});ok('export includes note',/Now: x/.test(r||''),r);
// ---- characters list: swipe ----
await pg.evaluate(async()=>{localStorage.removeItem('rp_swhint');$('#toast').hidden=true;await addPm(['pm-hazel']);for(let i=0;i<8;i++)await put('chars',{id:'f'+i,name:'Filler '+i,description:'adult',fav:false});await put('chats',{id:'h1',charId:'c-pm-hazel',title:'a',updated:1,messages:[{id:'m',role:'assistant',text:'hi',media:[{id:'med1',type:'image'}]}]});await put('chats',{id:'h2',charId:'c-pm-hazel',title:'b',updated:2,messages:[]});await put('media',{id:'med1',type:'image',blob:new Blob(['x'])});nav('chars')});await w(700);
r=await pg.evaluate(()=>({hint:$('#toast').textContent,flag:localStorage.getItem('rp_swhint'),tr:document.querySelector('.ccwrap .ccard').style.transform}));ok('first-use hint',/Swipe a row left to delete/.test(r.hint)&&r.flag==='1'&&/-56px/.test(r.tr),r);
const box=async id=>pg.evaluate(id=>{const e=document.querySelector(`.ccwrap[data-wid="${id}"]`);e.scrollIntoView({block:'center'});const b=e.getBoundingClientRect();return{x:b.x,y:b.y,w:b.width,h:b.height}},id);
const st=id=>pg.evaluate(id=>{const e=document.querySelector(`.ccwrap[data-wid="${id}"]`);return{open:e.classList.contains('open'),tr:e.querySelector('.ccard').style.transform,view}},id);
const drag=async(x0,y0,dx,dy,steps=10,ms=20)=>{await pg.mouse.move(x0,y0);await pg.mouse.down();for(let i=1;i<=steps;i++){await pg.mouse.move(x0+dx*i/steps,y0+dy*i/steps);await w(ms)}await pg.mouse.up();await w(250)};
let bb=await box('c-pm-hazel');const cx=bb.x+bb.w/2,cy=bb.y+bb.h/2;
await drag(cx,cy,-4,160,16,40);r=await st('c-pm-hazel');ok('slow vertical scroll does not open',!r.open&&r.view==='chars',r);
bb=await box('c-pm-hazel');await drag(bb.x+bb.w/2,bb.y+bb.h/2,-40,-40,10,30);r=await st('c-pm-hazel');ok('diagonal drag does not open',!r.open&&r.view==='chars',r);
bb=await box('c-pm-hazel');await drag(412-18,bb.y+bb.h/2,-150,0,3,5);r=await st('c-pm-hazel');ok('fast flick near right edge ignored',!r.open&&r.view==='chars',r);
bb=await box('c-pm-hazel');await drag(bb.x+bb.w/2,bb.y+bb.h/2,-30,0,4,10);r=await st('c-pm-hazel');ok('short slow drag snaps back',!r.open,r);
bb=await box('c-pm-hazel');await drag(bb.x+bb.w/2,bb.y+bb.h/2,-200,0,20,15);r=await st('c-pm-hazel');ok('drag opens to 88, no full-swipe delete',r.open&&/-88px/.test(r.tr)&&!!(await pg.evaluate(()=>get('chars','c-pm-hazel'))),r);
r=await pg.evaluate(()=>{const b=document.querySelector('.ccwrap.open .swdel');const cs=getComputedStyle(b);return{bg:cs.backgroundColor,w:b.offsetWidth,fs:getComputedStyle(b.querySelector('span')).fontSize,fw:getComputedStyle(b.querySelector('span')).fontWeight,al:b.getAttribute('aria-label'),hid:b.getAttribute('aria-hidden'),ta:getComputedStyle(b.parentElement).touchAction}});await require('fs').promises.mkdir('/workspace/handoff',{recursive:true});await pg.screenshot({path:'/workspace/handoff/v42-swipe-open-row.png'});ok('delete button spec',r.bg==='rgb(217, 45, 32)'&&r.w===88&&r.fs==='16px'&&+r.fw>=700&&r.al==='Delete Hazel Quinn'&&r.hid==null&&r.ta==='pan-y',r);
bb=await box('f1');await drag(bb.x+bb.w/2,bb.y+bb.h/2,-120,0,12,15);r={a:await st('c-pm-hazel'),b:await st('f1')};ok('opening another closes first',!r.a.open&&r.b.open,r);
bb=await box('f1');await pg.mouse.click(bb.x+40,bb.y+bb.h/2);await w(250);r=await st('f1');ok('tap on open row closes, no chat',!r.open&&r.view==='chars',r);
bb=await box('f1');await drag(bb.x+bb.w/2,bb.y+bb.h/2,-120,0,12,15);await drag(bb.x+bb.w/2-88,bb.y+bb.h/2,100,0,10,15);r=await st('f1');ok('swipe right closes',!r.open,r);
// tap star right after drag: drag that ends on star must not toggle it
bb=await box('f2');const starX=await pg.evaluate(()=>{const s=document.querySelector('.ccwrap[data-wid="f2"] [data-fav]').getBoundingClientRect();return s.x+s.width/2});await drag(starX+60,bb.y+bb.h/2,-60,0,8,15);await drag(starX-60+0,bb.y+bb.h/2,60,0,8,15);
r=await pg.evaluate(async()=>(await get('chars','f2')).fav);ok('drag ending on star does not toggle it',r===false,r);
bb=await box('f2');await pg.mouse.click(starX,bb.y+bb.h/2);await w(300);r=await pg.evaluate(async()=>(await get('chars','f2')).fav);ok('plain tap on star still works',r===true,r);
// scroll closes
bb=await box('f3');await drag(bb.x+bb.w/2,bb.y+bb.h/2,-120,0,12,15);await pg.evaluate(()=>window.scrollBy(0,40));await w(250);r=await st('f3');ok('scroll closes open row',!r.open,r);
// ---- delete premade via swipe, toast, undo restores chats ----
bb=await box('c-pm-hazel');await drag(bb.x+bb.w/2,bb.y+bb.h/2,-200,0,20,15);bb=await box('c-pm-hazel');await pg.mouse.click(bb.x+bb.w-44,bb.y+bb.h/2);await w(400);
r=await pg.evaluate(async()=>{const u=$('#undo');return{t:u?.querySelector('span').textContent,role:u?.getAttribute('role'),btn:u?.querySelector('button')?.tagName,list:!!document.querySelector('.ccwrap[data-wid="c-pm-hazel"]'),chats:(await all('chats')).filter(c=>c.charId==='c-pm-hazel').length,raw:!!((await get('chars','c-pm-hazel'))?.id),med:!!((await get('media','med1'))?.id),trash:JSON.parse(localStorage.rp_trash||'[]').length}});
ok('premade toast text',r.t==='Deleted Hazel Quinn and 2 chats. You can add Hazel Quinn again from Premade characters (starts from the original).',r);ok('toast a11y',r.role==='status'&&r.btn==='BUTTON');ok('hidden but media kept during undo window',!r.list&&r.chats===0&&r.raw&&r.med&&r.trash===1,r);
await pg.screenshot({path:'/workspace/handoff/v42-undo-toast.png'});
r=await pg.evaluate(async()=>{$('#undob').click();await new Promise(z=>setTimeout(z,300));return{list:!!document.querySelector('.ccwrap[data-wid="c-pm-hazel"]'),chats:(await all('chats')).filter(c=>c.charId==='c-pm-hazel').length,trash:JSON.parse(localStorage.rp_trash||'[]').length}});ok('undo restores character and chats',r.list&&r.chats===2&&r.trash===0,r);
// toast pause while touched, then expire -> finalize
r=await pg.evaluate(async()=>{const W=t=>new Promise(z=>setTimeout(z,t));await softDeleteChar('c-pm-hazel');const u=$('#undo');u.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));await W(8600);const still=!!$('#undo');u.dispatchEvent(new PointerEvent('pointerup',{bubbles:true}));await W(1200);const ex=!$('#undo');await W(7600);const gone=!$('#undo');await W(300);return{still,ex,gone,raw:!!((await get('chars','c-pm-hazel'))?.id),chat:!!((await get('chats','h1'))?.id),med:!!((await get('media','med1'))?.id)}});
ok('toast paused while touched',r.still&&!r.ex,r);ok('after window: finalized, media deleted',r.gone&&!r.raw&&!r.chat&&!r.med,r);
r=await pg.evaluate(async()=>{const pm=document.createElement('div');await addPm(['pm-hazel']);const c=await get('chars','c-pm-hazel');return{ok:!!c&&!c.deleted,name:c?.name}});ok('re-add premade from Premade characters',r.ok,r);
// starters: no premade line; long-press sheet delete; editor delete without confirm
r=await pg.evaluate(async()=>{const W=t=>new Promise(z=>setTimeout(z,t));const inPm=PREMADE.some(p=>/Mara Voss|Elias Thorn/.test(p.name));let cf=0;window.confirm=()=>{cf++;return true};nav('chars');await W(300);await softDeleteChar('sample-mara');const t1=$('#undo span').textContent;
 editId='sample-elias';view='edit';await render();await W(200);const top=$('#dl')&&$('#dl').closest('.edhead');$('#dl').click();await W(400);const t2=$('#undo span').textContent;return{inPm,t1,t2,cf,top:!!top,v:view}});
ok('starters not premade, no re-add line',!r.inPm&&r.t1==='Deleted Captain Mara Voss.'&&/^Deleted Elias Thorn/.test(r.t2)&&!/Premade/.test(r.t2),r);ok('editor delete at top, no confirm',r.top&&r.cf===0&&r.v==='chars',r);
bb=await box('f4');await pg.mouse.move(bb.x+60,bb.y+bb.h/2);await pg.mouse.down();await w(800);await pg.mouse.up();await w(600);
r=await pg.evaluate(()=>({t:[...document.querySelectorAll('#asheet .arow span')].map(x=>x.textContent),v:view}));ok('long-press opens sheet',JSON.stringify(r.t)==='["Open chat","Edit","Favorite","Delete","Cancel"]'.replace(',"Cancel"','')||r.t.slice(0,4).join('|')==='Open chat|Edit|Favorite|Delete',r);
r=await pg.evaluate(async()=>{document.querySelector('#asheet [data-k=del]').click();await new Promise(z=>setTimeout(z,300));return{t:$('#undo span').textContent,v:view}});ok('sheet delete soft-deletes, no chat opened',r.t==='Deleted Filler 4.'&&r.v==='chars',r);
// keyboard focus slides open
r=await pg.evaluate(async()=>{const b=document.querySelector('.ccwrap[data-wid="f5"] .swdel');b.focus();await new Promise(z=>setTimeout(z,250));return document.querySelector('.ccwrap[data-wid="f5"]').classList.contains('open')});ok('focus on delete button opens row',r);
// chat list trash: soft delete pattern
r=await pg.evaluate(async()=>{let cf=0;window.confirm=()=>{cf++;return true};await put('chats',{id:'q1',charId:'f6',title:'q',updated:Date.now(),messages:[]});nav('chats');await new Promise(z=>setTimeout(z,300));document.querySelector('[data-del="q1"]').click();await new Promise(z=>setTimeout(z,300));return{cf,t:$('#undo span').textContent,shown:!!document.querySelector('.row[data-id="q1"]'),raw:!!((await get('chats','q1'))?.id),q:[...document.querySelectorAll('#main b')].some(b=>b.textContent==='?')}});ok('chat trash soft-deletes with undo',r.cf===0&&r.t==='Chat deleted'&&!r.shown&&r.raw,r);ok('no "?" orphan rows',!r.q,r);
// finalize on relaunch: pending trash survives reload then is finalized
await pg.evaluate(async()=>{await softDeleteChar('f7')});await pg.reload();await w(1200);
r=await pg.evaluate(async()=>({c:!!((await get('chars','f7'))?.id),q:!!((await get('chats','q1'))?.id),t:JSON.parse(localStorage.rp_trash||'[]').length}));ok('finalize on relaunch',!r.c&&!r.q&&r.t===0,r);
ok('no page errors',!errs.length,errs);await ctx.close()}
await b.close();console.log(F?F+' FAILED':'ALL PASS');process.exit(F?1:0)})();

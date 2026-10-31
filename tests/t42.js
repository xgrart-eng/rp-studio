const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??'').slice(0,700))}else console.log('ok',n)};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await w(700);
const g=await pg.evaluate(()=>({gate:!document.querySelector('#gate').hidden,main:document.querySelector('#main').innerHTML.trim().length,toast:document.querySelector('#toast').hidden?'':document.querySelector('#toast').textContent}));
ok('gate before render',g.gate&&g.main===0,g);ok('no startup toast',!/Novita|fal model|empty/.test(g.toast),g);
ok('no 18+ text',await pg.evaluate(()=>!/18\+|18 or older/.test(document.body.innerText+document.documentElement.innerHTML)));
await pg.click('#gyes');await w(700);ok('renders after gate',await pg.evaluate(()=>document.querySelector('#main').innerHTML.length>0));
ok('chars top',await pg.evaluate(()=>{nav('chars')}).then(()=>w(400)).then(()=>pg.evaluate(()=>!!$('#newc')&&!!$('#genc')&&!!$('#cmore')&&!$('#pmlib')&&!/✨|📚/.test($('#main .bigbtns').textContent))));
const row=await pg.evaluate(async()=>{const c={id:'ch',name:'Hazel',description:'d'};await put('chars',c);curChat={id:'c42',charId:'ch',lastImgPrompt:'x',messages:[{role:'user',text:'hi',id:'u'},{role:'assistant',text:'hey',id:'a'}]};await put('chats',curChat);view='chat';await render();await new Promise(r=>setTimeout(r,300));const t=[...document.querySelectorAll('#msgs .msg:last-child .tools button')];return t.map(x=>(x.dataset.a||'')+':'+x.textContent.trim())});
ok('button row',row.join('|')==='regen:Regenerate|cont:Continue|img:',row);
const del=await pg.evaluate(async()=>{window.confirm=()=>{throw Error('confirm used')};curChat=null;nav('chats');await new Promise(r=>setTimeout(r,400));const d=document.querySelector('[data-del="c42"]');if(!d)return 'nobtn';d.click();await new Promise(r=>setTimeout(r,400));const has=async()=>(await all('chats')).some(x=>x.id==='c42');const gone=!(await has());const u=document.querySelector('#undob');u?.click();await new Promise(r=>setTimeout(r,400));return [gone,!!u,await has()].join()==='true,true,true'});
ok('chat delete undo',del===true,del);
const rm=await pg.evaluate(async()=>{S.favModels=[{id:'f1',name:'M1',provider:'runware',model:'civitai:1@1'}];saveS();nav('settings');await new Promise(r=>setTimeout(r,400));const x=document.querySelector('[data-fmrm="f1"]');if(!x)return 'nobtn';x.click();await new Promise(r=>setTimeout(r,200));const gone=!S.favModels.length;document.querySelector('#undob')?.click();return gone&&S.favModels.length===1});
ok('model remove undo',rm===true,rm);
ok('no page errors',!errs.length,errs);await ctx.close()}
await b.close();console.log(F?F+' FAILED':'ALL PASS')})();

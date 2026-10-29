const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??'').slice(0,600))}else console.log('ok',n)};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();await pg.setViewport({width:412,height:915,isMobile:true,hasTouch:true});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await pg.evaluate(()=>{localStorage.setItem('rp_age','ok');localStorage.setItem('rp_settings',JSON.stringify({apiKey:'FAKE',baseUrl:'https://api.x.ai/v1',model:'grok-main',favModels:[{id:'fmA',name:'Broken One',provider:'runware',model:'civitai:1@1',params:{}},{id:'fmB',name:'Good One',provider:'runware',model:'runware:101@1',params:{}}]}))});await pg.reload();await w(700);
// Maddie data
const md=await pg.evaluate(()=>PREMADE.find(x=>x.id==='pm-maddie'));ok('maddie adult',md.age>=21&&md.age<=28&&/met as adults|no shared childhood/.test(md.description),md);ok('maddie leads',md.leads&&/makes the first move/.test(md.personality)&&/back off/.test(md.personality),md.personality);ok('maddie opens with a move',/knee/.test(md.first_mes)&&!/kisses you/.test(md.first_mes)&&!/\bor\b[^.]*\?/.test(md.first_mes),md.first_mes);
const q=await pg.evaluate(()=>PREMADE.filter(x=>x.leads).filter(x=>/\?\s*"?\s*$/.test(x.first_mes.trim())).map(x=>x.id));ok('assertive firsts dont end in question',!q.length,q);
// request messages
await pg.evaluate(async()=>{window._bodies=[];window.fetch=async(u,o)=>{_bodies.push(JSON.parse(o.body));return new Response('data: {"choices":[{"delta":{"content":"ok"}}]}\n\ndata: [DONE]\n\n',{status:200,headers:{'content-type':'text/event-stream'}})};
 const c={id:'cm',name:'Maddie',description:'d',personality:'p',scenario:'s',leads:true};await put('chars',c);curChat={id:'c25',charId:'cm',messages:[{role:'assistant',text:'hi',id:'a0'},{role:'user',text:'hey',id:'u1'}]};view='chat';await render();await generate(c);await new Promise(z=>setTimeout(z,300));await generate(c,{regen:true,nudge:true});await new Promise(z=>setTimeout(z,300))});
let r=await pg.evaluate(()=>_bodies.map(b=>b.messages));const m0=r[0];
ok('agency rule in system',/Agency rules/.test(m0[0].content)&&/either\/or/.test(m0[0].content)&&/Maddie/.test(m0[0].content),m0[0].content.slice(0,300));ok('lead rule',/TAKES THE LEAD/.test(m0[0].content));
ok('late reminder last',m0.at(-1).role==='system'&&/Reminder/.test(m0.at(-1).content)&&/either\/or/.test(m0.at(-1).content),m0.at(-1));
ok('nudge present',r[1]&&r[1].some(x=>/takes the initiative/.test(x.content)),r[1]&&r[1].slice(-2));
await pg.evaluate(async()=>{S.lateReminder=false;_bodies=[];await generate({id:'cm',name:'Maddie'},{regen:true});await new Promise(z=>setTimeout(z,300))});r=await pg.evaluate(()=>_bodies[0].messages.at(-1));ok('reminder toggle off',!/Reminder/.test(r.content||''),r);
// nudge in sheet
ok('nudge in sheet code',await pg.evaluate(()=>typeof NUDGE==='string'));
// fav removal in image prompt editor
await pg.evaluate(()=>{editPrompt('Image prompt','',"1girl",'Generate')});await w(400);
r=await pg.evaluate(()=>({n:document.querySelectorAll('#pefav [data-fmrm]').length}));ok('x on fav chips',r.n===2,r);
await pg.click('#pefav [data-fmrm=fmA]');await w(300);
r=await pg.evaluate(()=>({chips:[...document.querySelectorAll('#pefav .fmchip')].map(x=>x.dataset.fmid),s:S.favModels.map(f=>f.id),ls:JSON.parse(localStorage.getItem('rp_settings')).favModels.map(f=>f.id),open:!!document.querySelector('#pedit')}));
ok('fav removed',r.chips.join()==='fmB'&&r.s.join()==='fmB'&&r.ls.join()==='fmB'&&r.open,r);
await pg.click('#pefav [data-fmrm=fmB]');await w(300);r=await pg.evaluate(()=>({s:S.favModels.length,pefav:!!document.querySelector('#pefav')}));ok('last fav removed',r.s===0&&!r.pefav,r);
await pg.evaluate(()=>document.querySelector('#pecn')?.click());
// update copy
r=await pg.evaluate(async()=>{const p=PREMADE.find(x=>x.id==='pm-maddie');await put('chars',{...pmChar(p),personality:'old shy',avatarId:'av1',fav:true});const n=await updPm('pm-maddie');const c=(await all('chars')).find(x=>x.premadeId==='pm-maddie');return{n,per:c.personality,av:c.avatarId,fav:c.fav,leads:c.leads}});ok('update my copy',r.n===1&&/first move/.test(r.per)&&r.av==='av1'&&r.fav&&r.leads,r);
// editor toggle
await pg.evaluate(()=>{editId='cm';view='edit';render()});await w(500);r=await pg.evaluate(()=>!!document.querySelector('#f_leads')?.checked);ok('editor Takes the lead toggle',r);
ok('no page errors',!errs.length,errs);await ctx.close()}
await b.close();console.log(F?F+' FAILED':'ALL PASS')})();

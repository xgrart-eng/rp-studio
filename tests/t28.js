const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??'').slice(0,700))}else console.log('ok',n)};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();await pg.setViewport({width:412,height:915,isMobile:true,hasTouch:true});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await pg.evaluate(()=>{localStorage.setItem('rp_age','ok');localStorage.setItem('rp_settings',JSON.stringify({apiKey:'FAKE',baseUrl:'https://api.x.ai/v1',model:'m',imgProvider:'runware',runKey:'RK',runPreset:'pony',runModel:'civitai:257749@290640'}))});await pg.reload();await w(700);
let r=await pg.evaluate(async()=>{window._chat=[];window.fetch=async(u,o)=>{const bd=JSON.parse(o.body);_chat.push(bd);const out='1girl, 1boy, straddling, half-lidded eyes, parted lips, blush, aroused, biting lip, couch, close-up, firelight';return new Response(`data: {"choices":[{"delta":{"content":${JSON.stringify(out)}}}]}\n\ndata: [DONE]\n\n`,{status:200,headers:{'content-type':'text/event-stream'}})};
 const am=pmChar(PREMADE.find(x=>x.id==='pm-amara')),md=pmChar(PREMADE.find(x=>x.id==='pm-maddie')),yk=pmChar(PREMADE.find(x=>x.id==='pm-yuki'));await put('chars',am);curChat={id:'c28',charId:am.id,messages:[{role:'assistant',text:'She climbs into your lap, eyes heavy with want.',id:'a0'}]};
 const pa=await directivePrompt(am,0,'she straddles me on the couch');const pm=await directivePrompt(md,0,'kissing');const py=await directivePrompt(yk,0,'sitting');
 const sys=_chat[0].messages[0].content;
 const td=tidyTags(['straddling','half-lidded eyes','parted lips','blush','aroused','couch','close-up','firelight','lip biting']);const cl=classify(td);
 return{pa,pm,py,sys,simple:SIMPLE_SYS,td,expr:cl.expr,all:PREMADE.every(p=>p.ethnicity)}});
const idx=(s,t)=>s.indexOf(t);
ok('all premades have ethnicity',r.all);
ok('amara: black woman early',idx(r.pa,'black woman')>0&&idx(r.pa,'black woman')<idx(r.pa,'braids')&&idx(r.pa,'black woman')<idx(r.pa,'straddling'),r.pa);
ok('maddie caucasian/pale + copper hair',/caucasian/.test(r.pm)&&/pale skin|freckl/.test(r.pm)&&/copper-red hair/.test(r.pm)&&idx(r.pm,'caucasian')<idx(r.pm,'hair'),r.pm);
ok('yuki asian/japanese',/asian woman/.test(r.py)&&/japanese/.test(r.py),r.py);
ok('expression tags survive in prompt',['half-lidded eyes','parted lips','blush','aroused'].every(t=>r.pa.includes(t)),r.pa);
ok('expr survives tidy/classify',r.expr.length>=4,r);
ok('writer instructions ask for expression',/FACIAL EXPRESSION/.test(r.sys)&&/FACIAL EXPRESSION/.test(r.simple)&&/enticed/.test(r.simple),r.sys.slice(0,200));
// chip
r=await pg.evaluate(async()=>{_chat=[];const am=(await all('chars'))[0];const pr=editPrompt('Image prompt','','x','Generate',{action:[],cloth:[],expr:[],place:[],light:[],frame:[]},{c:am,i:0,auto:'x',builtFor:null});await new Promise(z=>setTimeout(z,150));const ch=document.querySelectorAll('.facechip[data-ex]').length;document.querySelector('#pe_dir').value='on the couch';document.querySelector('[data-ex=enticed]').click();await new Promise(z=>setTimeout(z,300));const d1=document.querySelector('#pe_dir').value;document.querySelector('[data-ex=upset]').click();await new Promise(z=>setTimeout(z,300));const o={ch,d1,d2:document.querySelector('#pe_dir').value,n:_chat.length,pet:document.querySelector('#pet').value,ae:document.activeElement.tagName};document.querySelector('#pecn').click();await pr;return o});
ok('chips present',r.ch===9,r);ok('chip adds tags + rebuilds locally (v31: no LLM call)',/on the couch, enticed, seductive, half-lidded eyes/.test(r.d1)&&r.n===0&&/upset/.test(r.pet),r);ok('chip replaces previous expression',/upset, furrowed brow/.test(r.d2)&&!/seductive/.test(r.d2)&&/on the couch/.test(r.d2),r);ok('no focus',!/TEXTAREA|INPUT/.test(r.ae),r);
// update fills ethnicity, editor field
r=await pg.evaluate(async()=>{const p=PREMADE.find(x=>x.id==='pm-maddie');const c=pmChar(p);delete c.ethnicity;await put('chars',c);await updPm('pm-maddie');const u=(await all('chars')).find(x=>x.premadeId==='pm-maddie');editId=u.id;view='edit';await render();await new Promise(z=>setTimeout(z,300));return{e:u.ethnicity,f:document.querySelector('#f_ethnicity')?.value}});ok('update fills ethnicity + editor field',/Caucasian/.test(r.e)&&r.f===r.e,r);
ok('no page errors',!errs.length,errs);await ctx.close()}
await b.close();console.log(F?F+' FAILED':'ALL PASS')})();

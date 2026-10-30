const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??'').slice(0,600))}else console.log('ok',n)};
const AIRS=['civitai:827184@2883731','civitai:140272@2615702','civitai:376130@2940478','civitai:1318945@3218603','civitai:439889@2114187','civitai:288584@324619','civitai:833294@1190596'];
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){
// fresh install
let ctx=await b.createBrowserContext();let pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));await pg.goto(url);await pg.evaluate(()=>localStorage.setItem('rp_age','ok'));await pg.reload();await w(800);
let r=await pg.evaluate(()=>({m:S.favModels.map(f=>f.model),fl:S.seededModelsV33,ls:JSON.parse(localStorage.getItem('rp_settings')||'{}').seededModelsV33}));ok('fresh has 7 seeded',AIRS.every(a=>r.m.includes(a))&&r.m.length===7&&r.fl&&r.ls,r);
r=await pg.evaluate(()=>S.favModels.find(f=>f.model==='civitai:833294@1190596'));ok('noob label+params',/experimental/.test(r.name)&&r.params.imgCFG===4.5&&r.params.imgSched==='EulerDiscreteScheduler'&&/newest, absurdres/.test(r.params.imgPrefix)&&/child, loli, young/.test(r.params.negPrompt),r);
r=await pg.evaluate(()=>S.favModels.filter(f=>/pony|autism/i.test(f.name)).every(f=>f.params.imgCFG===6&&f.params.clipSkip===2&&/^score_9/.test(f.params.imgPrefix)));ok('pony params',r);
r=await pg.evaluate(()=>S.favModels.filter(f=>/wai|hassaku|nova|obsession/i.test(f.name)).every(f=>f.params.imgCFG===5.5&&f.params.clipSkip===2&&f.params.imgSched==='EulerAncestralDiscreteScheduler'&&/amazing quality/.test(f.params.imgPrefix)&&/loli/.test(f.params.negPrompt)));ok('illustrious params',r);
r=await pg.evaluate(()=>['140272','376130','1318945','833294','827184'].map(i=>modelArch('civitai:'+i+'@1')).concat(['439889','288584'].map(i=>modelArch('civitai:'+i+'@1'))));ok('arch detect',r.join()==='illustrious,illustrious,illustrious,illustrious,illustrious,pony,pony',r);
ok('hassaku preset relabeled',await pg.evaluate(()=>/Hassaku XL v2\.2/.test(RW_PRESETS.illus.label)&&RW_PRESETS.wai.runModel==='civitai:827184@2514310'));
// remove sticks
await pg.evaluate(()=>{rmFM(S.favModels.find(f=>/Nova/.test(f.name)).id)});await pg.reload();await w(800);
r=await pg.evaluate(()=>S.favModels.map(f=>f.model));ok('removal sticks across reload',r.length===6&&!r.includes('civitai:376130@2940478'),r);
await pg.evaluate(()=>{view='settings';render()});await w(400);r=await pg.evaluate(()=>({n:document.querySelectorAll('#fmlist .fmchip').length,t:document.querySelector('#fmlist')?.textContent||''}));ok('settings shows favs',r.n>=6&&/Hassaku/.test(r.t),r);
await pg.evaluate(()=>{editPrompt('Image prompt','','1girl','Generate')});await w(400);r=await pg.evaluate(()=>document.querySelectorAll('#pefav .fmchip').length);ok('prompt editor shows favs',r===6,r);
ok('no page errors',!errs.length,errs);await ctx.close();
// existing user
ctx=await b.createBrowserContext();pg=await ctx.newPage();await pg.evaluateOnNewDocument(()=>{if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('rp_age','ok');localStorage.setItem('rp_settings',JSON.stringify({runKey:'FAKE',favModels:[{id:'mine1',name:'My Flux',provider:'runware',model:'runware:101@1',params:{}},{id:'mine2',name:'My WAI17',provider:'runware',model:'civitai:827184@2883731',params:{imgCFG:7}}]}))}});await pg.goto(url);await w(900);
r=await pg.evaluate(()=>S.favModels.map(f=>f.id+'|'+f.model+'|'+(f.params.imgCFG??'')));ok('existing kept first, no dup',r[0]==='mine1|runware:101@1|'&&r[1]==='mine2|civitai:827184@2883731|7'&&r.length===8&&r.filter(x=>x.includes('827184@2883731')).length===1,r);
const before=r.join();await pg.evaluate(()=>{migrateFavModels();migrateFavModels()});await pg.reload();await w(800);r=await pg.evaluate(()=>S.favModels.map(f=>f.id+'|'+f.model+'|'+(f.params.imgCFG??'')).join());ok('idempotent',r===before,r);
ok('key kept',await pg.evaluate(()=>S.runKey==='FAKE'));await ctx.close()}
await b.close();console.log(F?F+' FAILED':'ALL PASS')})();

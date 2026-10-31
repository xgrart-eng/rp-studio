const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??'').slice(0,700))}else console.log('ok',n)};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await pg.evaluate(()=>{localStorage.setItem('rp_age','ok');localStorage.setItem('rp_settings',JSON.stringify({apiKey:'FAKE',runKey:'FAKE',imgProvider:'runware'}))});await pg.reload();await w(700);
const r=await pg.evaluate(async()=>{window.B=[];window.fetch=async(u,o)=>{B.push(JSON.parse(o.body));return new Response(JSON.stringify({data:[{taskType:'modelSearch',totalResults:2,results:[
 {air:'civitai:1@2',name:'TestMix',version:'v1',architecture:'illustrious',defaultWidth:896,defaultHeight:1152,defaultSteps:30,defaultCFG:6,defaultScheduler:'Euler',positiveTriggerWords:'tmx style, glossy',nsfwLevel:4},
 {air:'civitai:3@4',name:'Loli Bad',architecture:'pony'}]}]}),{status:200})};
 nav('settings');await new Promise(z=>setTimeout(z,300));const lbl=document.querySelector('#rwfind')?.textContent||'';document.querySelector('#rwfind').click();await new Promise(z=>setTimeout(z,200));
 const opts=[...document.querySelectorAll('#mba option')].map(o=>o.value);document.querySelector('#mbq').value='mix';document.querySelector('#mbgo').click();await new Promise(z=>setTimeout(z,400));
 const t=B[0][0];const rows=[...document.querySelectorAll('#mbl .mrow')].map(x=>x.textContent);const st=document.querySelector('#mbst').textContent;
 document.querySelector('#mbl [data-mstar]').click();const f=S.favModels.find(x=>x.model==='civitai:1@2');return{lbl,opts,t,rows,st,f}});
ok('button renamed',/Browse Runware models/.test(r.lbl),r.lbl);
ok('arch options',JSON.stringify(r.opts)==='["","illustrious","pony","noobai","sdxl"]',r.opts);
ok('search task',r.t.taskType==='modelSearch'&&r.t.visibility==='public'&&r.t.sort==='popularity'&&r.t.limit===50&&r.t.category==='checkpoint'&&r.t.search==='mix',r.t);
ok('blocked hidden, nsfw shown',r.rows.length===1&&/NSFW 4/.test(r.rows[0])&&/hidden/.test(r.st),r);
const pp=r.f&&r.f.params;ok('star stores defaults',pp&&pp.imgW===896&&pp.imgH===1152&&pp.imgSched==='Euler'&&pp.imgSteps===30&&pp.imgCFG===6&&/tmx style/.test(pp.imgPrefix)&&/glossy/.test(pp.imgPrefix)&&r.f.model==='civitai:1@2',r.f);
ok('no errors',!errs.length,errs);await ctx.close()}
await b.close();console.log(F?F+' FAILED':'ALL PASS')})();

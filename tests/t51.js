const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let F=0;const tap=(pg,sel)=>pg.$eval(sel,e=>e.click());const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??'').slice(0,600))}else console.log('ok',n)};
const PNG='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.setViewport({width:412,height:915,deviceScaleFactor:2});
const sent=[];await pg.setRequestInterception(true);pg.on('request',r=>{const u=r.url();
 const CH={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'POST'};if((u==='https://api.runware.ai/v1'||u.startsWith('https://img.test/'))&&r.method()==='OPTIONS')return r.respond({status:204,headers:CH});
 if(u==='https://api.runware.ai/v1'){const t=JSON.parse(r.postData())[0];sent.push(t);if(t.model==='civitai:1@2')return r.respond({status:400,headers:CH,contentType:'application/json',body:JSON.stringify({errors:[{code:'invalidModel',message:'bad model'}]})});
  return r.respond({status:200,contentType:'application/json',headers:CH,body:JSON.stringify({data:Array.from({length:t.numberResults},(_,i)=>({taskType:'imageInference',taskUUID:t.taskUUID,imageURL:'https://img.test/'+t.model+'/'+i+'.png',seed:t.seed,cost:0.0021}))})})}
 if(u.startsWith('https://img.test/'))return r.respond({status:200,contentType:'image/png',headers:{'access-control-allow-origin':'*'},body:Buffer.from(PNG,'base64')});r.continue()});
await pg.goto(url);await pg.evaluate(()=>{localStorage.setItem('rp_age','ok');localStorage.setItem('rp_settings',JSON.stringify({runKey:'k'}))});await pg.reload();await w(800);
ok('nav has lab',await pg.$('nav button[data-v=lab]'));await pg.click('nav button[data-v=lab]');await w(400);
ok('lab renders',await pg.$eval('#main h1',e=>e.textContent)==='Image Lab');
await pg.$eval('#lb_p',e=>{e.value='1girl, adult woman, teen, schoolgirl, red dress';e.dispatchEvent(new Event('change'))});
await pg.$eval('#lb_seed',e=>{e.value='777';e.dispatchEvent(new Event('change'))});await tap(pg,'#lb_lock');
await pg.select('#lb_sz','1216x832');await pg.select('#lb_n1','2');
await tap(pg,'#lb_go');await w(1500);
let t=sent.at(-1);ok('one task',sent.length===1,sent.length);ok('size',t.width===1216&&t.height===832,t);ok('seed locked',t.seed===777,t.seed);ok('n',t.numberResults===2);
ok('age stripped',!/teen|schoolgirl/i.test(t.positivePrompt),t.positivePrompt);ok('age neg',/child/i.test(t.negativePrompt)&&/teen/i.test(t.negativePrompt),t.negativePrompt);ok('no safety by default',!t.safety);
ok('two cards',(await pg.$$('#lb_out .labc')).length===2);ok('cost shown',/\$0\.0021/.test(await pg.$eval('#lb_out',e=>e.textContent)));
ok('removed note',/Removed by adult-only/.test(await pg.$eval('#lb_out',e=>e.textContent)));
// compare
await tap(pg,'#lb_cmp');await w(300);await pg.$eval('#lb_air',e=>e.value='civitai:827184@2883731');await tap(pg,'#lb_add');await w(300);
await pg.$eval('#lb_air',e=>e.value='civitai:1@2');await tap(pg,'#lb_add');await w(300);await pg.select('#lb_n1','1');
const n0=sent.length;await tap(pg,'#lb_go');await w(1500);const cs=sent.slice(n0);
ok('compare 3 models',cs.length===3,cs.map(x=>x.model));ok('same seed',new Set(cs.map(x=>x.seed)).size===1&&cs[0].seed===777);
ok('error shown',/invalidModel/.test(await pg.$eval('#lb_out',e=>e.textContent)));ok('bad air rejected',await pg.evaluate(()=>{try{labTask('nope',{prompt:'x'});return false}catch{return true}}));
// history, reuse, regen, clear
const hn=(await pg.$$('#lb_hist .labc')).length;ok('history',hn===4,hn);
const n1=sent.length;await tap(pg,'#lb_hist [data-lregen]');await w(1200);ok('regen same seed',sent.length===n1+1&&sent.at(-1).seed===777);
await tap(pg,'#lb_hist [data-lreuse]');await w(500);ok('reuse',!(await pg.$eval('#lb_cmp',e=>e.checked))&&await pg.$eval('#lb_seed',e=>e.value)==='777');
await tap(pg,'#lb_hist [data-full]');await w(200);ok('fullsize',await pg.$('.labfull img'));await pg.click('.labfull');
ok('prune cap',await pg.evaluate(()=>LAB_CAP===40));
await pg.evaluate(()=>{S.rwCheckContent=true});ok('safety toggle respected',await pg.evaluate(()=>!!labTask('civitai:827184@2883731',{prompt:'x',w:832,h:1216}).safety));
pg.on('dialog',d=>d.accept());await tap(pg,'#lb_clr');await w(500);ok('cleared',(await pg.$$('#lb_hist .labc')).length===0);
ok('model not changed globally',await pg.evaluate(()=>S.runModel!=='civitai:1@2'));
ok('no page errors',!errs.length,errs);await ctx.close()}
await b.close();console.log(F?'FAILED '+F:'ALL PASS')})();

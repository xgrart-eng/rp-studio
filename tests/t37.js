const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??'').slice(0,600))}else console.log('ok',n)};
const V27=[{name:'quick-fal',s:{skipEditor:true,sceneFirst:true,imgStyle:'simple',imgProvider:'fal',imgModel:'fal-ai/flux-lora',falKey:'FK',runKey:'RK',apiKey:'AK',baseUrl:'https://api.x.ai/v1',model:'grok-4',runPreset:'pony',runModel:'civitai:257749@290640',favModels:[{id:'f1',name:'Pony',provider:'runware',model:'civitai:257749@290640',preset:'pony',params:{imgCFG:7}},{id:'f2',name:'Flux fal',provider:'fal',model:'fal-ai/flux-lora',preset:'',params:{}}]},flow:'quick'},
 {name:'manual-runware',s:{skipEditor:true,sceneFirst:false,imgStyle:'manual',imgProvider:'runware',runKey:'RK',apiKey:'AK',favModels:[{id:'f1',name:'Pony',provider:'runware',model:'civitai:257749@290640',preset:'pony',params:{}}]},flow:'review'},
 {name:'detailed-novita',s:{skipEditor:false,imgStyle:'detailed',imgProvider:'novita',novKey:'NK',apiKey:'AK'},flow:'review'}];
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html'])for(const fx of V27){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await pg.evaluate(s=>{localStorage.clear();localStorage.setItem('rp_age','ok');localStorage.setItem('rp_settings',JSON.stringify(s))},fx.s);await pg.reload();await w(500);
const a=await pg.evaluate(()=>({S:JSON.parse(JSON.stringify(S)),raw:localStorage.getItem('rp_settings')}));
await pg.reload();await w(400);const raw2=await pg.evaluate(()=>localStorage.getItem('rp_settings'));await pg.reload();await w(400);const raw3=await pg.evaluate(()=>localStorage.getItem('rp_settings'));
const S=a.S,n=fx.name+' '+url.slice(-12)+' ';
ok(n+'flow',S.imgFlow===fx.flow,S.imgFlow);ok(n+'old flags gone',!('skipEditor' in S)&&!('sceneFirst' in S)&&!('imgStyle' in S));ok(n+'runware',S.imgProvider==='runware');
ok(n+'keys kept',['falKey','runKey','apiKey','novKey'].every(k=>!fx.s[k]||S[k]===fx.s[k]),S);ok(n+'favs kept',JSON.stringify((fx.s.favModels||[]).map(f=>f.id))===JSON.stringify(S.favModels.slice(0,(fx.s.favModels||[]).length).map(f=>f.id))&&S.favModels.slice((fx.s.favModels||[]).length).every(f=>/^fmv33_/.test(f.id))&&(fx.s.favModels||[]).every((f,i)=>S.favModels[i].model===f.model));
ok(n+'idempotent',a.raw===raw2&&raw2===raw3);ok(n+'no errs',!errs.length,errs);await ctx.close()}
console.log(F?'FAILURES '+F:'ALL PASS');await b.close()})();

const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let fail=0;
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){
 for(const stale of [null,{runModel:'civitai:257749@290640\u200B '},{runModel:101},{imgProvider:'runware',runPreset:'pony'},{imgExtra:'{"model":"fal-ai/flux-lora"}'}]){
 const ctx=await b.createBrowserContext();const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('dialog',d=>d.accept());
 await pg.goto(url);await pg.evaluate(s=>{localStorage.setItem('rp_age','ok');if(s)localStorage.setItem('rp_settings',JSON.stringify(s))},stale);await pg.reload();await w(300);
 const res=await pg.evaluate(async()=>{const out=[];const RF=window.fetch;const sent=[];const card={name:'Rhea',description:'A 36-year-old firefighter.',personality:'x',scenario:'x',first_mes:'hi',mes_example:'',appearance:'adult woman, 30s'};
  window.fetch=async(u,op)=>{u=String(u);if(u.startsWith('data:'))return RF(u);if(u.includes('runware')){sent.push(JSON.parse(op.body)[0]);return new Response(JSON.stringify({data:[{taskType:'imageInference',imageURL:'data:image/png;base64,iVBORw0KGgo='}]}))}
   const msgs=JSON.parse(op.body).messages;const txt=/character cards/.test(msgs[0].content)?JSON.stringify(card):'adult woman, tavern';return new Response('data: '+JSON.stringify({choices:[{delta:{content:txt}}]})+'\n\ndata: [DONE]\n\n')};
  const sl=ms=>new Promise(z=>setTimeout(z,ms));
  window.editPrompt=(t,n,d)=>Promise.resolve(window.prompt(t,d));
  window.offerVerify=()=>{};window.confirm=()=>false;
  for(const key of Object.keys(RW_PRESETS).filter(k=>k!=='custom')){
   nav('settings');await sl(150);document.querySelector(`[data-sug="${key}"]`).click();await sl(150);
   document.querySelector('#s_runKey').value='fake';document.querySelector('#s_apiKey').value='fake';document.querySelector('#ssave').click();await sl(100);
   const exp=RW_PRESETS[key].runModel;const got={};
   sent.length=0;await genImage('test');got.direct=sent[0]?.model;
   // editor avatar
   sent.length=0;editId=null;draftChar=null;nav('edit');await sl(200);document.querySelector('#f_name').value='Rhea';document.querySelector('#f_appearance').value='adult woman, 30s';document.querySelector('#avgen').click();await sl(400);got.avatar=sent[0]?.model;
   // generator avatar
   sent.length=0;await runGen({idea:'adult firefighter',genre:'',tone:'',avatar:true});await sl(300);got.genAvatar=sent[0]?.model;
   // chat message image
   sent.length=0;const chars=await all('chars');let c=chars[0];curChat={id:'t'+key,charId:c.id,messages:[{role:'assistant',content:'*She smiles.*'}]};window.prompt=(a,d)=>d;await sceneImage(0,c);got.scene=sent[0]?.model;
   out.push({key,exp,got,ok:Object.values(got).every(v=>v===exp)});}
  return out});
 for(const r of res){if(!r.ok)fail++;console.log(url.slice(22)||'/',JSON.stringify(stale),r.key,r.ok?'OK':'FAIL '+JSON.stringify(r.got))}
 if(errs.length){fail++;console.log('ERRS',errs)}await ctx.close()}}
await b.close();console.log(fail?'FAILURES '+fail:'ALL PASS')})();

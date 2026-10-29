const p=require('puppeteer-core');let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??'').slice(0,600))}else console.log('ok',n)};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await pg.evaluate(()=>{localStorage.setItem('rp_age','ok');localStorage.setItem('rp_settings',JSON.stringify({apiKey:'FAKE',baseUrl:'https://api.x.ai/v1',model:'m',imgProvider:'runware',runKey:'RK',runPreset:'pony',runModel:'civitai:257749@290640',imgPrefix:'score_9, score_8_up, score_7_up, adult, '}))});await pg.reload();await new Promise(r=>setTimeout(r,700));
const r=await pg.evaluate(async()=>{let OUT=[];window.fetch=async(u,o)=>{const out=OUT.shift()||'';return new Response(`data: {"choices":[{"delta":{"content":${JSON.stringify(out)}}}]}\n\ndata: [DONE]\n\n`,{status:200,headers:{'content-type':'text/event-stream'}})};
 const o={};lastTrace=null;o.q1=withQuality('1girl, solo, green eyes','');lastTrace=null;o.q2=withQuality('1girl, adult woman, 30 years old, masterpiece, score_9','score_9, score_8_up, adult, ');lastTrace=null;o.q3=withQuality('1girl, adult, adult','');
 o.neg=buildNeg('1girl, completely nude');
 const c=pmChar(PREMADE.find(x=>x.id==='pm-sofia'));await put('chars',c);curChat={id:'t30',charId:c.id,messages:[{role:'assistant',text:'hi',id:'a'}]};
 OUT=['1girl, 1boy, girl on top, straddling, sitting on lap, grin, smirk, smile, completely nude, topless, undressing, couch, pov'];o.p=await directivePrompt(c,0,'on the couch, pov, smile');o.tr=traceText(lastTrace,o.p);
 return o});
ok('adult added when missing',/^adult, 1girl/.test(r.q1),r.q1);ok('bare adult dropped + quality once',r.q2.split(', ').filter(x=>x==='score_9').length===1&&!/(^|, )adult(,|$)/.test(r.q2)&&!/masterpiece/.test(r.q2)&&/adult woman/.test(r.q2),r.q2);ok('adult kept once',r.q3==='1girl, adult',r.q3);
ok('safety negative kept',/child/.test(r.neg)&&/loli/.test(r.neg)&&/young/.test(r.neg),r.neg);
ok('pose group collapsed to one',(r.p.match(/girl on top|straddling|sitting on lap/g)||[]).length===1&&/girl on top/.test(r.p),r.p);
ok('user-picked smile kept over grin/smirk',/\bsmile\b/.test(r.p)&&!/grin|smirk/.test(r.p),r.p);
ok('nude dupes removed',/completely nude/.test(r.p)&&!/topless|undressing/.test(r.p),r.p);
ok('skin: one tone',(r.p.match(/skin\b/g)||[]).length===1,r.p);
ok('trace shows sources+dropped',/\(user\)/.test(r.tr)&&/\(LLM\)/.test(r.tr)&&/\(appearance\)/.test(r.tr)&&/grin \(same as smile\)/.test(r.tr),r.tr);
// editor details line
const d=await pg.evaluate(async()=>{const c=(await all('chars'))[0];const pr=editPrompt('Image prompt','','1girl, solo','Generate',null,{c,i:0,auto:'x',builtFor:null});await new Promise(z=>setTimeout(z,100));const x=document.querySelector('#pe_dbg');x.open=true;await new Promise(z=>setTimeout(z,100));const o={has:!!x,txt:document.querySelector('#pe_dbgx').textContent,ae:document.activeElement.tagName};document.querySelector('#pecn').click();await pr;return o});
ok('editor has Show prompt details',d.has&&/Sources:/.test(d.txt)&&/Dropped:/.test(d.txt),d);ok('no focus',!/TEXTAREA|INPUT/.test(d.ae),d);
ok('no page errors',!errs.length,errs);await ctx.close()}
await b.close();console.log(F?F+' FAILED':'ALL PASS')})();

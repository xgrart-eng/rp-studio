const p=require('puppeteer-core');let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??'').slice(0,600))}else console.log('ok',n)};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await pg.evaluate(()=>{localStorage.setItem('rp_age','ok');localStorage.setItem('rp_settings',JSON.stringify({apiKey:'FAKE',baseUrl:'https://api.x.ai/v1',model:'m',imgProvider:'runware',runKey:'RK',runPreset:'pony',runModel:'civitai:257749@290640',imgPrefix:'score_9, adult, '}))});await pg.reload();await new Promise(r=>setTimeout(r,700));
const r=await pg.evaluate(async()=>{let OUT=[];window.fetch=async()=>{const o=OUT.shift()||'';return new Response(`data: {"choices":[{"delta":{"content":${JSON.stringify(o)}}}]}\n\ndata: [DONE]\n\n`,{status:200,headers:{'content-type':'text/event-stream'}})};const T=[];window.toast=m=>T.push(m);
 const c=pmChar(PREMADE.find(x=>x.id==='pm-yuki'));curChat={id:'d',charId:c.id,messages:[{role:'assistant',text:'hi',id:'a'}]};const o={};
 o.cl=classify(['living room']).place;
 OUT=['1girl, solo, on back, lying on bed, lingerie, looking at viewer, from above, bedroom, soft lighting'];o.a=await directivePrompt(c,0,'lying on bed, lingerie, from above');
 OUT=['1girl, solo, standing, smile, wide eyes, open mouth, blush, aroused, excited, kitchen, bedroom, window, cowboy shot, pov, soft lighting, sunlight'];o.b=await directivePrompt(c,0,'standing, wide eyes, open mouth, blush, aroused, excited, kitchen, window, cowboy shot, pov');
 OUT=['1girl, solo, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14'];T.length=0;o.c=await directivePrompt(c,0,'a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14');o.t=[...T];return o});
ok('living room is place',r.cl.length===1,r.cl);ok('from above kept over auto framing',/from above/.test(r.a)&&!/looking at viewer/.test(r.a)&&!/on back/.test(r.a),r.a);
ok('user expr/place/frame bypass caps',['wide eyes','open mouth','blush','aroused','excited','kitchen','window','cowboy shot','pov'].every(t=>r.b.includes(t))&&!/\bsmile\b|sunlight|bedroom/.test(r.b),r.b);
ok('>12 user tags warns',r.t.some(x=>/12/.test(x)),r);
ok('no page errors',!errs.length,errs);await ctx.close()}
await b.close();console.log(F?F+' FAILED':'ALL PASS')})();

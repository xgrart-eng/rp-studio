const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??'').slice(0,700))}else console.log('ok',n)};
const LOOP=["Hazel's blush spreads down her throat and she tugs her cardigan tighter. She taps the book's spine with one fingertip. \"Chapter six always lingers in my mind.\" She slips the novel from your grasp and tucks it into her satchel. \"Come on. The east wing is quieter.\"",
"Hazel lets out a soft laugh as she leads the way down the corridor. The low lamplight catches the gold rims of her glasses. In the alcove she pulls the novel back out, opens it to chapter six and reads a line aloud before she snaps it shut and tucks it under her arm.",
"She adjusts the lamp and draws the curtain, then opens the book again to chapter six, runs a finger down the page and snaps it closed. \"Restraint,\" she murmurs, tucking the novel against her chest.",
"Hazel pushes her glasses up, sets the lamp straight and lifts the novel once more. She opens to chapter six, reads silently, snaps it shut and tucks it beneath her arm. \"Where was I?\""];
const VAR=["\"Bold. Wrong room for it, but bold.\" Hazel folds her arms. \"Do you try that on every librarian, or am I special?\"",
"\"Fine. You want a real story? A man once returned a cookbook with a fried egg pressed inside like a flower.\" Her mouth twitches. \"Your turn. Worst thing you ever did to a book.\"",
"\"The board wants to turn this room into a 'flex space'.\" She says it like a swear word. \"I have a pitch Friday and nothing to say. Tell me what you'd fight for.\"",
"She laughs despite herself. \"That's a terrible argument and I might steal it.\" A beat. \"What do you actually do, when you're not ambushing librarians?\""];
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await pg.evaluate(()=>{localStorage.setItem('rp_age','ok');localStorage.setItem('rp_settings',JSON.stringify({apiKey:'FAKE',baseUrl:'https://api.x.ai/v1',model:'grok-main'}))});await pg.reload();await w(700);
const run=async(as,o)=>pg.evaluate(async(as,o)=>{window._b=[];window.fetch=async(u,x)=>{_b.push(JSON.parse(x.body));return new Response('data: {"choices":[{"delta":{"content":"ok"}}]}\n\ndata: [DONE]\n\n',{status:200,headers:{'content-type':'text/event-stream'}})};
 const c={id:'ch',name:'Hazel',description:'d',personality:'p',scenario:'s'};await put('chars',c);const ms=[];as.forEach((t,i)=>{ms.push({role:'assistant',text:t,id:'a'+i});ms.push({role:'user',text:['6','Haha lets go','ok','hm'][i%4],id:'u'+i})});curChat={id:'c40'+Math.random(),charId:'ch',messages:ms};view='chat';await render();await generate(c,o||{});await new Promise(z=>setTimeout(z,300));return _b[0].messages},as,o);
ok('detector: loop',await pg.evaluate(L=>{const d=propLoop(L.map(t=>({role:'assistant',content:t})));return d.length>=2&&d.includes('novel')&&d.includes('chapter')},LOOP));
ok('detector: varied',await pg.evaluate(V=>propLoop(V.map(t=>({role:'assistant',content:t}))).length<2,VAR),await pg.evaluate(V=>propLoop(V.map(t=>({role:'assistant',content:t}))),VAR));
let m=await run(LOOP);const h=m.find(x=>/repeated the same physical business/.test(x.content));ok('prop hint injected',h&&/novel/.test(h.content)&&/Do NOT touch those props/.test(h.content)&&/dialogue and a new subject/.test(h.content),m.slice(-3));
m=await run(VAR);ok('no prop hint on varied',!m.some(x=>/physical business/.test(x.content)),m.slice(-3));
const sys=m[0].content;ok('rules: one beat, props, length',/At most ONE short physical beat/.test(sys)&&/not a conversational move/.test(sys)&&/60-150 words/.test(sys)&&/just SAID/.test(sys)&&/Stay alive in the moment/.test(sys),sys.slice(-900));
ok('late reminder short',/60-150 words/.test(m.at(-1).content),m.at(-1));
await pg.evaluate(()=>{S.stallBreaker=false});m=await run(LOOP);ok('toggle off',!m.some(x=>/physical business/.test(x.content)));
const hz=await pg.evaluate(()=>PREMADE.find(x=>x.id==='pm-hazel'));ok('hazel not book-centric',!/\bbooks?\b|novel|chapter/i.test(hz.first_mes.replace(/rare-books/g,''))&&!/novel/i.test(hz.scenario)&&/does not fiddle with props; she talks/.test(hz.personality)&&/does not fiddle with props/.test(hz.hooks)&&hz.age>=21,hz);
ok('no page errors',!errs.length,errs);await ctx.close()}
await b.close();console.log(F?F+' FAILED':'ALL PASS')})();

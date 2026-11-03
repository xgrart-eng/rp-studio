const p=require('puppeteer-core');const fs=require('fs');const w=t=>new Promise(r=>setTimeout(r,t));let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??''))}else console.log('ok',n)};
const TAIL='The engine is idling and the light is breaking over the water. Cast off the stern line now before the tide pulls us into something we can\'t fix.';
const R1='You threaten to call the patrol like that makes the papers real and the gold suddenly yours. The Tallow Jane still answers to my name on every log. '+TAIL;
const R2='You stand there with the patrol nodding along like the papers make this real. The gold is still locked below and the engine is still idling under my feet. The engine is still idling and the light is breaking over the water. Cast off the stern line now before the tide pulls us into something we cannot fix.';
const GOOD='Dez kills the engine and the patrol boat bumps the fender. "Fine. Show them the papers, Landlubber. If Colt forged a single page, I want to watch his face when they read it."';
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await pg.evaluate(()=>localStorage.setItem('rp_age','ok'));await pg.reload();await w(800);
await pg.evaluate(()=>addPm(['pm-dez']));await w(400);
const r=await pg.evaluate(async(R1,R2,GOOD)=>{S.replyStyle='short';const c=(await all('chars')).find(x=>x.premadeId==='pm-dez');
 const U1='I tell you the salvage papers are mine and I\'ll call the patrol.',U2='*the patrol arrives. I explain the situation and show them my evidence...*';
 curChat={id:'t49',charId:c.id,messages:[{role:'assistant',text:c.first_mes},{role:'user',text:U1},{role:'assistant',text:R1},{role:'user',text:U2},{role:'assistant',text:''}],note:'STORY SO FAR (facts established in this chat; treat as true)\nNow: dawn, Port Marrow docks, Dez and Windier'};
 const sys=buildMessages(c,4)[0].content;
 // capture generate ctx with mocked stream
 S.apiKey='k';let cap=null;const orig=streamChat;streamChat=async function*(m){cap=m;yield GOOD};curChat.messages=curChat.messages.slice(0,4);curChat.messages.splice(2,0);
 curChat.messages=[{role:'assistant',text:c.first_mes},{role:'user',text:U1},{role:'assistant',text:R1},{role:'user',text:'okay'},{role:'assistant',text:R2},{role:'user',text:U2}];
 await generate(c);streamChat=orig;const hints=cap.filter(m=>m.role==='system').slice(1).map(m=>m.content);
 const clean=[{role:'assistant',content:GOOD},{role:'user',content:'x'},{role:'assistant',content:'"Ruben would have hated this," she says, and the radio crackles.'}];
 return{sys,last:curChat.messages.at(-1).text,lastUser:cap.filter(m=>m.role==='user').at(-1).content,hints,
  det:{r1:youNarr(R1),r2:youNarr(R2),good:youNarr(GOOD),q:youNarr('"You stand there and I leave," she says.'),your:youNarr('Dez grabs your wrist. Your hand is cold.'),tail:tailLoop([{role:'assistant',content:R1},{role:'assistant',content:R2}]),tailClean:tailLoop(clean),un:userNarration(clean),sp:speechless([{role:'assistant',content:R1},{role:'assistant',content:R2}]),spClean:speechless(clean)},
  note:NOTE_SYS,narr:NARR_LIGHT+NARR_ACTIVE}},R1,R2,GOOD);
if(url.endsWith('/'))fs.writeFileSync('/tmp/dez_prompt_v44.txt',r.sys);
const s=r.sys;
ok('old you-in-narration rule gone',!/both dialogue and narration/.test(s)&&!/dialogue and narration/.test(r.hints.join(' ')));
ok('never narrate user rule',/Never narrate \w+\. Do not write what/.test(s)&&/"You stand\.\.\."/.test(s));
ok('user move already happened',/already happened/.test(s)&&/italic actions/.test(s)&&/Respond to that move first/.test(s));
ok('quoted speech required',/at least one line of .*actual speech in quotes/.test(s));
ok('narrator third person',/third-person line about the world/.test(s)&&!/Start the reply with that change/.test(r.narr));
ok('note third person',/third person with names/.test(r.note)&&/never "you"/.test(r.note));
ok('age rule kept',/All characters are adults/.test(s));
ok('char speaks first person',/first person as herself/.test(s));
const d=r.det;ok('detect R1/R2',d.r1>=1&&d.r2>=1,d);ok('no false positive quoted/your/good',d.good===0&&d.q===0&&d.your===0,d);
ok('tail loop caught',/Cast off the stern line/.test(d.tail),d);ok('clean tail not flagged',d.tailClean===''&&!d.un&&!d.spClean,d);ok('speechless caught',d.sp,d);
ok('generate pushes you-hint',r.hints.some(h=>/narrated the user/.test(h)),r.hints);
ok('generate pushes tail hint',r.hints.some(h=>/ended the same way/.test(h)&&/stern line/.test(h)),r.hints);
ok('generate pushes speech hint',r.hints.some(h=>/no dialogue/.test(h)),r.hints);
ok('late reminder updated',r.hints.some(h=>/Never narrate .*actions/.test(h)),r.hints);
ok('user italic msg passed verbatim',/patrol arrives/.test(r.lastUser));ok('mock reply stored',/patrol boat/.test(r.last));
ok('no page errors',!errs.length,errs);await ctx.close()}
await b.close();console.log(F?F+' FAILED':'ALL PASS')})();

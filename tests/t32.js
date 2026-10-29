const p=require('puppeteer-core');let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??'').slice(0,500))}else console.log('ok',n)};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();await pg.goto(url);await pg.evaluate(()=>localStorage.setItem('rp_age','ok'));await pg.reload();await new Promise(r=>setTimeout(r,600));
const r=await pg.evaluate(()=>({A:AGENCY_RULE,L:LEAD_RULE,R:LATE_REMINDER,N:NUDGE,P:PREMADE.map(x=>({id:x.id,leads:x.leads,per:x.personality,fm:x.first_mes}))}));const all=r.A+r.L+r.R+r.N;
ok('no escalate-every-reply pressure',!/every reply advances|giving instructions, escalating|bold, decisive move|advance the scene/i.test(all),all);
ok('permission/preference ban kept',/permission/.test(r.A)&&/either\/or/.test(r.A)&&/what do you want/.test(r.A)&&/would you like/.test(r.A)&&/either\/or/.test(r.R),r.A);
ok('pacing by personality',/shy or reserved/i.test(r.A)&&/build-up/.test(r.A)&&/believable reason/.test(r.A)&&/Never jump straight to sex/.test(r.A));
ok('agency = refuse/tease/delay',/refuses?/.test(r.A)&&/teases?/.test(r.A)&&/delays?/.test(r.A)&&/conditions/.test(r.A));
ok('follows through once she moves',/follows through/.test(r.A)&&/follows through/.test(r.L));
const shy=['pm-claire','pm-jess','pm-yuki','pm-elena','pm-hazel'];ok('shy personas not pushed',r.P.filter(x=>shy.includes(x.id)).every(x=>!/never retreats|pushes through and acts|takes the lead/i.test(x.per)),r.P.filter(x=>shy.includes(x.id)));
ok('no premade opens with a kiss or lap',r.P.every(x=>!/kisses you|into your lap|straddles|pulls you in\b/i.test(x.fm)),r.P.filter(x=>/kisses you|into your lap|straddles|pulls you in\b/i.test(x.fm)).map(x=>x.id));
ok('no first message ends with a question',r.P.filter(x=>x.leads).every(x=>!/\?\s*"?\s*$/.test(x.fm.trim())));
const md=r.P.find(x=>x.id==='pm-maddie');ok('maddie still first move, slower',md.leads&&/makes the first move/.test(md.per)&&/back off/.test(md.per)&&/tension/.test(md.per)&&/knee/.test(md.fm));
ok('editor/nudge labels',await pg.evaluate(()=>!document.body.innerHTML.includes('bolder move')));await ctx.close()}
await b.close();console.log(F?F+' FAILED':'ALL PASS')})();

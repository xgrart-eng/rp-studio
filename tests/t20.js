const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let F=0;const ok=(n,c,x)=>{if(!c){F++;console.log('FAIL',n,JSON.stringify(x??''))}else console.log('ok',n)};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){const ctx=await b.createBrowserContext();const pg=await ctx.newPage();await pg.setViewport({width:412,height:915,isMobile:true,hasTouch:true});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await pg.evaluate(()=>{localStorage.setItem('rp_age','ok');localStorage.setItem('rp_settings',JSON.stringify({runKey:'FAKE-TEST-KEY',safetyOff:true}))});await pg.reload();await w(500);
const r=await pg.evaluate(async()=>{const sent=[];let polls=0;window.fetch=async(u,o)=>{const body=JSON.parse(o.body);sent.push({u,body,auth:o.headers.Authorization});const t=body[0];
  if(t.taskType==='imageUpload')return new Response(JSON.stringify({data:[{taskType:'imageUpload',taskUUID:t.taskUUID,imageUUID:'uuid-1'}]}),{status:200});
  if(t.taskType==='videoInference')return new Response(JSON.stringify({data:[{taskType:'videoInference',taskUUID:t.taskUUID}]}),{status:200});
  polls++;return new Response(JSON.stringify({data:[polls<2?{taskUUID:t.taskUUID,status:'processing',progress:40}:{taskUUID:t.taskUUID,status:'success',videoURL:'https://vm.runware.ai/x.mp4',cost:0.47}]}),{status:200})};
 const st=[];const v=await rwVideo('slow smile','data:image/jpeg;base64,AAAA',s=>st.push(s));
 window.fetch=async(u,o)=>new Response(JSON.stringify({errors:[{code:'invalidDuration',message:'Duration 7 not supported',parameter:'duration',taskUUID:'abc'}]}),{status:400});
 let em='';try{await rwVideo('x','data:image/jpeg;base64,AAAA')}catch(e){em=e.message}
 S.vidDuration='7';const t2=rwVidTask('runware:201@1','p','u');S.vidDuration='30';const t3=rwVidTask('lightricks:ltx@2.3-fast','p','u');
 const mod=MOD_RE.test('Runware HTTP 400: providerError | responded with HTTP DataInspectionFailed'),filt=isVidFiltered('runware:201@1')&&!isVidFiltered('lightricks:ltx@2.3');
 curChat={charId:'none',messages:[{role:'assistant',text:'hi',id:'m1',vidErr:'providerError DataInspectionFailed',vidBlocked:true,media:[]}]};let card='';try{if(!document.querySelector('#msgs')){const x=document.createElement('div');x.id='msgs';document.body.append(x)}await drawMsgs();card=document.querySelector('#msgs').innerHTML}catch(e){card='ERR '+e.message}
 return{v,st,sent,em,prov:vidProv(),t2,t3,mod,filt,card:/blocked the image/.test(card)&&/data-a="?vidunf/.test(card)?true:card.slice(0,300),wan:rwVidTask('runware:201@1','p','u')}});
const t=r.sent[1].body[0];ok('upload first',r.sent[0].body[0].taskType==='imageUpload');ok('uses imageUUID',t.inputs.frameImages[0].image==='uuid-1');ok('ltx wh',t.width%64===0&&t.height%64===0&&t.width>0&&!t.resolution,t);ok('default provider runware',r.prov==='runware');ok('video url',r.v==='https://vm.runware.ai/x.mp4');ok('model default ltx2.3-fast',t.model==='lightricks:ltx@2.3-fast');
ok('frameImages first',t.inputs.frameImages[0].frame==='first'&&true);ok('async',t.deliveryMethod==='async');ok('safety off',!t.safety);ok('dur 5',t.duration===5,t);
ok('polled getResponse',r.sent[2].body[0].taskType==='getResponse'&&r.sent[2].body[0].taskUUID===t.taskUUID);ok('progress shown',r.st.some(s=>/40%/.test(s)),r.st);
ok('error has code+param',/invalidDuration/.test(r.em)&&/parameter: duration/.test(r.em));ok('error has request json',/Request sent \(key hidden\)/.test(r.em)&&/videoInference/.test(r.em));ok('no key in error',!/FAKE-TEST-KEY/.test(r.em));ok('data uri truncated',!/AAAA"/.test(r.em)||/chars\]/.test(r.em));
ok('wan dur snaps 5/10',[5,10].includes(r.t2.duration),r.t2.duration);ok('moderation detected',r.mod);ok('filtered flags',r.filt);ok('blocked card+button',r.card===true,r.card);ok('wan promptExtend off',r.wan.providerSettings?.alibaba?.promptExtend===false&&r.wan.resolution==='720p'&&!r.wan.width);ok('ltx clamps 20, no resolution',r.t3.duration===20&&!r.t3.resolution,r.t3);
// UI
await pg.evaluate(()=>{const b=[...document.querySelectorAll('button,a')].find(x=>/settings/i.test(x.getAttribute('aria-label')||x.textContent||x.dataset.v||''));b&&b.click()});await w(600);
const ui=await pg.evaluate(()=>{const d=document.querySelector('details.sec [id=s_vidProvider]')?.closest('details');if(d)d.open=true;const vis=x=>x&&!x.closest('[hidden]');return{has:!!d,rw:vis(document.querySelector('#s_rwVidModel')),fal:vis(document.querySelector('#s_vidModel')),opts:[...document.querySelectorAll('#s_rwVidModel option')].length,sw:document.documentElement.scrollWidth}});
ok('video section',ui.has);ok('runware fields shown, fal hidden',ui.rw&&!ui.fal,ui);ok('model options',ui.opts>=5);ok('no overflow 412',ui.sw<=412,ui.sw);
await pg.evaluate(()=>{document.querySelector('#s_rwVidModel').value='lightricks:ltx@2.3-fast';document.querySelector('#s_rwVidModel').onchange();document.querySelector('#vidstar').click()});
await pg.evaluate(()=>document.querySelector('#vidtest').click());await w(800);ok('test diag shown, key masked',await pg.evaluate(()=>{const t=document.querySelector('#vidtestout').textContent;return /Request:/.test(t)&&!/FAKE-TEST-KEY/.test(t)}));
ok('fav saved',await pg.evaluate(()=>S.vidFavs.includes('lightricks:ltx@2.3-fast')));
ok('no page errors',!errs.length,errs);await ctx.close()}
await b.close();console.log(F?'FAILURES '+F:'ALL PASS')})();

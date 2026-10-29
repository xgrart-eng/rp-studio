const p=require('puppeteer-core');const w=t=>new Promise(r=>setTimeout(r,t));let fail=0;const ck=(n,c,x)=>{console.log(c?'OK  ':'FAIL',n,c?'':JSON.stringify(x));if(!c)fail++};
(async()=>{const b=await p.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
for(const url of['http://localhost:8787/','http://localhost:8787/rp-studio-single.html']){console.log('==',url);
const pg=await (await b.createBrowserContext()).newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto(url);await pg.evaluate(()=>{localStorage.setItem('rp_age','ok');localStorage.setItem('rp_settings',JSON.stringify({apiKey:'fake',imgProvider:'runware',runKey:'fake',imgPrefix:'score_9, ',imgExclude:'clothes, shirt',imgInclude:'soft lighting'}))});await pg.reload();await w(300);
const r=await pg.evaluate(async()=>{window.editPrompt=(t,n,d)=>Promise.resolve(window.prompt(t,d));const o={},sl=ms=>new Promise(z=>setTimeout(z,ms));o.defStyle=S.imgFlow;o.oldGone=!('imgStyle' in S)&&!('skipEditor' in S)&&!('sceneFirst' in S);o.defN=S.sceneN;
 const llm=[];window.streamChat=async function*(msgs){llm.push(msgs);yield 'nude, lying on bed, adult woman, '; yield 'soft smile, dim bedroom, lamp light, full body shot'};
 const sent=[];window.fetch=async(u,op)=>{const t=JSON.parse(op.body)[0];sent.push(t);return new Response(JSON.stringify({data:[{taskType:'imageInference',imageURL:'data:image/png;base64,iVBORw0KGgo='}]}),{status:200})};
 const c={id:'cx',name:'Rhea',appearance:'adult woman, 30s, athletic build, long dark brown hair, green eyes, wearing high-waisted leggings and a cropped hoodie, silver necklace'};await put('chars',c);
 curChat={id:'ch1',charId:'cx',messages:[{role:'assistant',text:'*She laces her sneakers in the gym.*'},{role:'user',text:'Later, at home.'},{role:'assistant',text:'*Rhea slips out of everything and lies back on the bed, completely nude, smiling softly.*'}]};
 o.traits=stableTraits(c);let shown;window.prompt=(m,d)=>{shown=d;return d};
 await sceneImage(2,c);o.shown=shown;o.llmUser=llm[0][1].content;o.sys=llm[0][0].content;o.final=sent[0].positivePrompt;o.neg=sent[0].negativePrompt;o.last=curChat.lastImgPrompt;
 // quick regen: no prompt dialog
 let asked=0;window.prompt=()=>{asked++;return 'x'};sent.length=0;await sceneImage(2,c,true);o.quick={asked,p:sent[0]?.positivePrompt};
 // edited prompt reused
 window.prompt=(m,d)=>d+', from above';await sceneImage(2,c);window.prompt=()=>{asked++};sent.length=0;await sceneImage(2,c,true);o.quickEdited=sent[0].positivePrompt;
 // imgTags override
 o.tagsP=await scenePrompt({...c,imgTags:'adult woman, green eyes, long dark brown hair, athletic'},2);
 // manual
 
 o.det=await scenePrompt(c,2);
 // sceneN
 S.sceneN='1';llm.length=0;await scenePrompt(c,2);o.n1=llm[0][1].content;
 // UI
 nav('settings');await sl(200);o.ui=['#s_imgFlow','#s_sceneN','#s_imgInclude','#s_imgExclude'].every(q=>document.querySelector(q));o.styleVal=document.querySelector('#s_imgFlow').value;
 nav('edit');await sl(200);o.tagField=!!document.querySelector('#f_imgTags');
 o.genKeys=FIELDS_KEYS.map(x=>x[0]).includes('imgTags')&&/imgTags/.test(GEN_SYS);
 return o});
console.log(JSON.stringify(r,null,1).slice(0,2500));
ck('defaults simple/4',r.defStyle==='review'&&r.oldGone&&r.defN=='4',r.defN);
ck('traits strip outfit',!/legging|hoodie|necklace|wearing/i.test(r.traits)&&/green eyes/.test(r.traits)&&/dark brown hair/.test(r.traits),r.traits);
ck('LLM input has no outfit',!/legging|hoodie/i.test(r.llmUser),r.llmUser);ck('sys says ignore outfit',/IGNORE any outfit/.test(r.sys));
ck('editor shows generated prompt',r.shown&&r.shown.startsWith('solo, adult woman, 30s, athletic build, long dark brown hair, green eyes, lying on bed'),r.shown);
ck('final order: prefix, traits, scene, include',/^score_9, solo, adult woman, 30s, athletic build, long dark brown hair, green eyes, lying on bed, soft smile, completely nude, full body, dim bedroom, lamp light, soft lighting$/.test(r.final),r.final);
ck('no clothing in final',!/legging|hoodie|sneaker|necklace/i.test(r.final),r.final);ck('exclude to negative',/clothes, shirt$/.test(r.neg||''),r.neg);
ck('quick regen no dialog, same prompt',r.quick.asked===0&&r.quick.p===r.final,r.quick);ck('quick regen reuses edit',/from above$/.test(r.quickEdited),r.quickEdited);
ck('imgTags used',/^solo, .*lying on bed, soft smile, completely nude, full body, dim bedroom, lamp light, soft lighting$/.test(r.tagsP)&&!/30s/.test(r.tagsP),r.tagsP);

ck('detailed: scene nude overrides outfit',!/high-waisted|hoodie/.test(r.det)&&/nude/.test(r.det),r.det);ck('sceneN=1 only last msg',!/Later, at home/.test(r.n1)&&/nude/.test(r.n1),r.n1);
ck('settings UI',r.ui&&r.styleVal==='review');ck('editor imgTags field',r.tagField);ck('generator fills imgTags',r.genKeys);ck('no page errors',!errs.length,errs)}
await b.close();console.log(fail?'FAILURES '+fail:'ALL PASS')})();

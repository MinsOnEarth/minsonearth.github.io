/* GitHub Pages inline editor: user-supplied, repo-scoped token kept in memory only. */
(() => {
'use strict';
function boot(){
 if(!window.researchCMS){setTimeout(boot,40);return;}
 init().catch(e=>console.error('Could not start CMS editor',e));
}
const h = (tag,attributes={},value) => {
 const el=document.createElement(tag);
 Object.entries(attributes).forEach(([k,v])=>{
   if(k==='className')el.className=v;
   else if(k==='textContent')el.textContent=v;
   else if(k==='type')el.type=v;
   else el.setAttribute(k,String(v));
 });
 if(value!==undefined)el.textContent=value;
 return el;
};
async function init(){
 await window.researchCMS.ready;
 let draft=window.researchCMS.get();
 let baseline=JSON.stringify(draft), token='', owner='', repo='', branch='main', sha=null, connected=false, selected=null, publishing=false;
 let open=true;
 let activeTab='text';
 const shell=h('div',{className:'cms-admin'});
 shell.innerHTML=`<button type="button" class="cms-launch" id="cmsLaunch" aria-expanded="true">✎ 편집 도구 <span>−</span></button>
 <section class="cms-panel" id="cmsPanel" aria-label="홈페이지 편집 도구">
  <div class="cms-panel-header"><span>THE EDITOR'S DESK <b>✳</b></span><a href="./" target="_blank" rel="noopener noreferrer">방문자 화면 ↗</a></div>
  <div class="cms-headline">내 연구 노트<br/><em>직접 고치기.</em></div>
  <p class="cms-panel-info">연결하면 책 안의 글을 클릭해 바로 수정할 수 있어요. 코드를 수정할 필요가 없습니다.</p>
  <div id="cmsLogin">
   <label>GitHub 사용자명<input id="cmsOwner" autocomplete="off" placeholder="your-username"></label>
   <label>저장소 이름<input id="cmsRepo" autocomplete="off" placeholder="your-username.github.io"></label>
   <label>배포 브랜치<input id="cmsBranch" autocomplete="off" value="main"></label>
   <label>Fine-grained access token<input id="cmsToken" type="password" autocomplete="off" spellcheck="false" placeholder="github_pat_…"></label>
   <p class="cms-security">🔒 토큰은 이 브라우저 탭의 메모리에서만 사용하며 사이트 파일에 저장하지 않아요. 다른 사람과 공유하지 마세요.</p>
   <button type="button" id="cmsConnect" class="cms-primary">GitHub 연결하기 →</button>
  </div>
  <div id="cmsConnected" hidden>
    <div class="cms-status-line"><span class="cms-led"></span><span id="cmsLinkedRepo"></span><button id="cmsDisconnect" type="button">연결 해제</button></div>
    <div class="cms-tabs" role="tablist" aria-label="편집 메뉴"><button type="button" class="active" data-cms-tab="text">✎ 글</button><button type="button" data-cms-tab="records">＋ 프로젝트·논문</button><button type="button" data-cms-tab="media">▧ 사진·CV</button></div>
    <div class="cms-pane" data-cms-pane="text">
      <p class="cms-instruction">① 왼쪽 목차에서 챕터를 선택<br>② 책 안의 <b>점선 테두리 글</b>을 클릭하고 직접 타이핑<br>③ 아래 <b>변경 내용 게시하기</b> 클릭</p>
      <div class="cms-selected"><span>선택한 문장</span><div id="cmsSelection">아직 선택하지 않았어요.<br>본문의 제목이나 설명을 클릭해 보세요.</div></div>
      <div class="cms-format-guide">제목의 <em>기울임</em>, 줄바꿈 등 서식은 유지할 수 있어요. 붙여넣기는 일반 텍스트로 처리됩니다.</div>
    </div>
    <div class="cms-pane" data-cms-pane="records" hidden>
      <div class="cms-subhead">새 프로젝트 추가</div>
      <label>프로젝트 제목<input id="cmsProjectTitle" placeholder="예: AI Symptom Assessment Study"></label>
      <label>연도 / 종류<input id="cmsProjectYear" placeholder="2026 · RESEARCH PROJECT"></label>
      <label>설명<textarea id="cmsProjectSummary" rows="3" placeholder="프로젝트 소개를 입력하세요."></textarea></label>
      <label>링크 (선택)<input id="cmsProjectUrl" placeholder="https://..."></label>
      <button id="cmsProjectAdd" type="button" class="cms-secondary">+ 프로젝트 목록에 추가</button>
      <div class="cms-records" id="cmsProjectList"></div>
      <div class="cms-subhead">논문 / 발표 목록에 추가</div>
      <label>제목<input id="cmsPubTitle" placeholder="Paper title"></label>
      <label>연도<input id="cmsPubYear" placeholder="2026"></label>
      <label>상태<input id="cmsPubStatus" placeholder="Published / Accepted / In preparation"></label>
      <label>저자 · 학회 · 설명<textarea id="cmsPubCitation" rows="3" placeholder="실제 확인된 서지정보만 입력하세요."></textarea></label>
      <label>논문 링크 (선택)<input id="cmsPubUrl" placeholder="https://..."></label>
      <button id="cmsPubAdd" type="button" class="cms-secondary">+ 논문 목록에 추가</button>
      <div class="cms-records" id="cmsPubList"></div>
    </div>
    <div class="cms-pane" data-cms-pane="media" hidden>
      <div class="cms-subhead">프로필 사진 바꾸기</div>
      <p class="cms-hint">JPG, PNG, WEBP · 2MB 이하. 선택 후 업로드 버튼을 누르세요. 파일은 공개 저장소에 올라갑니다.</p>
      <input id="cmsPhoto" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp">
      <button type="button" id="cmsUploadPhoto" class="cms-secondary">사진 업로드하기 ↗</button>
      <div class="cms-subhead">CV PDF 연결</div>
      <p class="cms-hint">공개 가능한 최신 CV PDF를 선택하세요 (5MB 이하). Chapter 06 링크가 PDF로 연결됩니다.</p>
      <input id="cmsCvFile" type="file" accept=".pdf,application/pdf">
      <button type="button" id="cmsUploadCV" class="cms-secondary">CV 업로드하기 ↗</button>
      <p class="cms-hint cms-warn">이미지·PDF 업로드 자체는 GitHub에 즉시 기록됩니다. 공개 페이지의 링크를 바꾸려면 마지막에 게시 버튼도 눌러 주세요.</p>
    </div>
    <div class="cms-publish-area"><div id="cmsUnsaved" class="cms-dirty">● 게시할 변경 사항 없음</div>
       <button type="button" id="cmsPublish" class="cms-primary">변경 내용 게시하기 ↗</button>
       <button type="button" id="cmsReset" class="cms-text-button">변경 사항 취소하고 새로고침</button></div>
  </div>
  <div id="cmsFeedback" class="cms-feedback" role="status" aria-live="polite"></div>
  <div class="cms-footer">PERSONAL WEBSITE · GITHUB PAGES</div>
 </section>`;
 document.body.appendChild(shell);
 document.body.classList.add('cms-edit-page');
 const $ = (id) => shell.querySelector('#'+id);
 const btn = (id, cb)=>$(id).addEventListener('click',cb);
 const status=(message,kind='info')=>{
   $('cmsFeedback').textContent=message;
   $('cmsFeedback').dataset.kind=kind;
 };
 function guessRepo(){
   const host=location.hostname;
   if(host.endsWith('.github.io')){
     const user=host.split('.')[0];
     $('cmsOwner').value=user;
     let bits=location.pathname.split('/').filter(Boolean);
     if (bits[bits.length-1]?.endsWith('.html'))bits.pop();
     $('cmsRepo').value=bits.length ? bits[0] : `${user}.github.io`;
   }
 }
 guessRepo();
 btn('cmsLaunch',()=>{
   open=!open; $('cmsPanel').hidden=!open;
   $('cmsLaunch').setAttribute('aria-expanded',String(open));
   $('cmsLaunch').querySelector('span').textContent=open?'−':'+';
 });
 function updateDirty(){
   const dirty = JSON.stringify(draft)!==baseline;
   $('cmsUnsaved').textContent=dirty?'● 저장하지 않은 변경 사항 있음':'● 게시할 변경 사항 없음';
   $('cmsUnsaved').classList.toggle('has-edits',dirty);
   $('cmsPublish').disabled=publishing || !dirty;
 }
 const allowedUrl = val => !val || /^https?:\/\//i.test(val);
 const jsonApi = path=>`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path}`;
 async function api(url, options={}){
   const resp=await fetch(url,{
     ...options,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:`Bearer ${token}`,'Content-Type':'application/json',...(options.headers||{})},
     cache:'no-store'
   });
   let value;try{value=await resp.json();}catch(_){value={};}
   if(!resp.ok) {
     const message = typeof value?.message==='string'?value.message:'GitHub API 요청 실패';
     throw new Error(`${resp.status} · ${message}`);
   }
   return value;
 }
 function decode64(base64){
   const binary=atob(base64.replace(/\s/g,''));
   return new TextDecoder().decode(Uint8Array.from(binary,c=>c.charCodeAt(0)));
 }
 function encode64(raw){
   const bytes=new TextEncoder().encode(raw);
   let binary='';
   for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
   return btoa(binary);
 }
 async function getFile(path){
   const url=jsonApi(path)+`?ref=${encodeURIComponent(branch)}`;
   const response=await fetch(url,{headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:`Bearer ${token}`},cache:'no-store'});
   if(response.status===404)return null;
   const result=await response.json().catch(()=>({}));
   if(!response.ok)throw new Error(`${response.status} · ${result.message||'파일 읽기 오류'}`);
   return result;
 }
 async function connect(){
   if(connected)return;
   const v=$('cmsToken').value.trim();
   owner=$('cmsOwner').value.trim();repo=$('cmsRepo').value.trim();branch=$('cmsBranch').value.trim()||'main';
   if(!owner||!repo||!v){status('사용자명, 저장소 이름, GitHub 토큰을 입력해 주세요.','error');return;}
   if(!/^[A-Za-z0-9_-]+$/.test(owner)||! /^(?!\.)[A-Za-z0-9_.-]+$/.test(repo)||!/^[A-Za-z0-9_.\/-]+$/.test(branch)) {status('저장소 정보를 확인해 주세요.','error');return;}
   token=v;
   $('cmsConnect').disabled=true;status('GitHub 연결 및 현재 콘텐츠를 확인하는 중…');
   try {
     const r=await api(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
     if(!r.permissions?.push){ /* token permission checked on save; viewers may not have push property */ }
     const result=await getFile('content.json');
     if(!result)throw new Error('저장소에 content.json이 없습니다. 새 업로드용 ZIP의 모든 파일을 GitHub에 먼저 올려 주세요.');
     sha=result.sha;
     draft=JSON.parse(decode64(result.content));
     if(!draft.fields||typeof draft.fields!=='object'||!Array.isArray(draft.projects)||!Array.isArray(draft.publications))throw new Error('content.json의 데이터 형식을 확인해 주세요.');
     draft=window.researchCMS.apply(draft) || window.researchCMS.get();
     baseline=JSON.stringify(draft);
     connected=true;
     $('cmsLinkedRepo').textContent=`${owner}/${repo}`;
     $('cmsLogin').hidden=true;
     $('cmsConnected').hidden=false;
     $('cmsToken').value='';
     document.body.classList.add('cms-can-edit');
     document.querySelectorAll('[data-cms-key]').forEach(el=>{
       el.contentEditable='true';el.spellcheck=true;el.setAttribute('tabindex','0');
       el.setAttribute('title','클릭해서 글을 수정하세요');
     });
     updateDirty();renderLists();
     status('연결되었습니다. 책 안의 글을 클릭해 수정하세요.','success');
   } catch(e){ token='';sha=null;status(`연결 실패: ${e.message}`,'error'); }
   finally{$('cmsConnect').disabled=false;}
 }
 btn('cmsConnect',connect);
 btn('cmsDisconnect',()=>{
   if(JSON.stringify(draft)!==baseline&&!confirm('게시하지 않은 변경 사항이 있습니다. 편집을 종료할까요?'))return;
   token='';sha=null;connected=false;selected=null;
   document.querySelectorAll('[data-cms-key]').forEach(el=>{el.removeAttribute('contenteditable');el.removeAttribute('tabindex');el.removeAttribute('title');});
   document.body.classList.remove('cms-can-edit');
   $('cmsConnected').hidden=true;$('cmsLogin').hidden=false;
   status('연결이 해제됐습니다. 토큰은 이 페이지에 보관하지 않습니다.');
   window.researchCMS.apply(JSON.parse(baseline));draft=window.researchCMS.get();
 });
 function updateText(e){
   if(!connected)return;
   const el=e.target.closest('[data-cms-key]');
   if(!el)return;
   draft.fields[el.dataset.cmsKey]=window.researchCMS.safeInline(el.innerHTML);
   updateDirty();
 }
 document.addEventListener('input',updateText);
 function select(el){
   if(selected)selected.classList.remove('cms-currently-editing');
   selected=el;selected.classList.add('cms-currently-editing');
   const chapter=el.closest('[data-page]');
   const number=chapter?String(Number(chapter.dataset.page)).padStart(2,'0'):'—';
   $('cmsSelection').textContent=`CHAPTER ${number} · ${el.tagName.toLowerCase()}\n${el.textContent.trim().slice(0,110)}`;
 }
 document.addEventListener('focusin',e=>{
   if(!connected)return;
   const el=e.target.closest('[data-cms-key]');
   if(el)select(el);
 });
 document.addEventListener('focusout',e=>{
   if(!connected)return;
   const el=e.target.closest('[data-cms-key]');
   if(!el)return;
   const key=el.dataset.cmsKey;
   const sanitized=window.researchCMS.safeInline(el.innerHTML);
   el.innerHTML=sanitized;
   draft.fields[key]=sanitized;
   updateDirty();
 });
 document.addEventListener('paste',e=>{
   if(!connected||!e.target.closest('[data-cms-key]'))return;
   e.preventDefault();
   const s=e.clipboardData.getData('text/plain');
   const sel=window.getSelection();if(!sel?.rangeCount)return;
   const range=sel.getRangeAt(0);range.deleteContents();
   const node=document.createTextNode(s);range.insertNode(node);range.setStartAfter(node);range.collapse(true);sel.removeAllRanges();sel.addRange(range);
   updateText(e);
 });
 shell.querySelectorAll('[data-cms-tab]').forEach(b=>b.addEventListener('click',()=>{
   activeTab=b.dataset.cmsTab;
   shell.querySelectorAll('[data-cms-tab]').forEach(el=>el.classList.toggle('active',el===b));
   shell.querySelectorAll('[data-cms-pane]').forEach(el=>el.hidden=el.dataset.cmsPane!==activeTab);
 }));
 function renderLists(){
   function each(type,id,label){
     const box=$(id);box.replaceChildren();
     (draft[type]||[]).forEach((item,index)=>{
       const row=h('div',{className:'cms-record'});
       const text=h('div');text.appendChild(h('strong',{},item.title||'No title'));
       text.appendChild(h('small',{},item.year||item.status||''));
       const controls=h('div',{className:'cms-record-actions'});
       const edit=h('button',{type:'button'},'수정');
       edit.addEventListener('click',()=>{
         const prefix=type==='projects'?'cmsProject':'cmsPub';
         const keys=type==='projects'?['Title','Year','Summary','Url']:['Title','Year','Status','Citation','Url'];
         keys.forEach(k=>$(prefix+k).value=item[k.toLowerCase()]||'');
         $(prefix+'Add').dataset.editing=String(index);
         $(prefix+'Add').textContent=`✓ ${label} 수정 적용`;
       });
       const remove=h('button',{type:'button'},'삭제');
       remove.addEventListener('click',()=>{
         if(!confirm('이 항목을 삭제할까요? (게시 전에는 외부에 반영되지 않습니다.)'))return;
         draft[type].splice(index,1);renderLists();refreshRecords();
       });
       controls.append(edit,remove);row.append(text,controls);box.appendChild(row);
     });
   }
   each('projects','cmsProjectList','프로젝트');each('publications','cmsPubList','논문');
 }
 function refreshRecords(){
   window.researchCMS.apply(draft);updateDirty();
 }
 function addRecord(type,prefix,keys,label){
   const input={}; keys.forEach(k=>input[k.toLowerCase()]=$(prefix+k).value.trim());
   if(!input.title){status(`${label} 제목을 입력하세요.`,'error');return;}
   if(!allowedUrl(input.url)){status('링크는 https:// 또는 http:// 로 시작해야 합니다.','error');return;}
   if(input.title.length>240 || (input.summary||'').length>1500 || (input.citation||'').length>1500){status('텍스트가 너무 깁니다. 내용을 조금 줄여 주세요.','error');return;}
   const index=$(prefix+'Add').dataset.editing;
   if(index!==undefined){draft[type][Number(index)]=input;delete $(prefix+'Add').dataset.editing;}
   else draft[type].push(input);
   keys.forEach(k=>$(prefix+k).value='');
   $(prefix+'Add').textContent=`+ ${label} 목록에 추가`;
   renderLists();refreshRecords();
   status(`${label} 목록에 반영되었습니다. 아래 게시 버튼을 눌러야 공개됩니다.`,'success');
 }
 btn('cmsProjectAdd',()=>addRecord('projects','cmsProject',['Title','Year','Summary','Url'],'프로젝트'));
 btn('cmsPubAdd',()=>addRecord('publications','cmsPub',['Title','Year','Status','Citation','Url'],'논문'));
 async function uploadBlob(path,file,button){
   const before=button.textContent;button.disabled=true;button.textContent='업로드 중…';
   try {
     const prev=await getFile(path);
     const buffer=await file.arrayBuffer();
     const bytes=new Uint8Array(buffer);
     let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
     const result=await api(jsonApi(path),{method:'PUT',body:JSON.stringify({message:`Update ${path} from website editor`,content:btoa(binary),branch,...(prev?{sha:prev.sha}:{})})});
     return result;
   }finally{button.disabled=false;button.textContent=before;}
 }
 btn('cmsUploadPhoto',async()=>{
   const file=$('cmsPhoto').files?.[0];if(!file){status('사진 파일을 선택해 주세요.','error');return;}
   const ext={'image/jpeg': 'jpg','image/png':'png','image/webp':'webp'}[file.type];
   if(!ext || file.size>2*1024*1024){status('JPG/PNG/WEBP (2MB 이하) 파일만 업로드해 주세요.','error');return;}
   try{const path=`assets/profile.${ext}`;await uploadBlob(path,file,$('cmsUploadPhoto'));draft.profileImage=path;refreshRecords();status('사진 업로드 완료! 아래 게시 버튼으로 사진 변경을 공개해 주세요.','success');}
   catch(e){status(`사진 업로드 실패: ${e.message}`,'error');}
 });
 btn('cmsUploadCV',async()=>{
   const file=$('cmsCvFile').files?.[0];if(!file){status('PDF를 먼저 선택해 주세요.','error');return;}
   if(file.type!=='application/pdf' && !/\.pdf$/i.test(file.name)){status('PDF 파일만 업로드할 수 있어요.','error');return;}
   if(file.size>5*1024*1024){status('CV 파일은 5MB 이하로 준비해 주세요.','error');return;}
   try{const path='assets/cv.pdf';await uploadBlob(path,file,$('cmsUploadCV'));draft.cvPdf=path;refreshRecords();status('CV 업로드 완료! 아래 게시 버튼으로 링크를 공개해 주세요.','success');}
   catch(e){status(`CV 업로드 실패: ${e.message}`,'error');}
 });
 async function publish(){
   if(!connected || publishing)return;
   document.activeElement?.blur();
   if(JSON.stringify(draft)===baseline){status('새로 게시할 변경 사항이 없어요.');return;}
   publishing=true;updateDirty();status('GitHub에 변경 사항을 게시하는 중…');
   try{
     const latest=await getFile('content.json');
     if(!latest)throw new Error('content.json 파일을 찾을 수 없습니다.');
     if(latest.sha!==sha)throw new Error('다른 곳에서 수정된 새 버전이 있습니다. 게시하지 않았어요. 현재 편집 내용을 따로 복사한 뒤 페이지를 새로고침해 주세요.');
     const raw=JSON.stringify(draft,null,2)+'\n';
     const result=await api(jsonApi('content.json'),{method:'PUT',body:JSON.stringify({message:'Update research website content via visual editor',content:encode64(raw),sha,branch})});
     sha=result.content.sha;
     baseline=JSON.stringify(draft);
     status('✓ 게시 완료! GitHub Pages 반영에는 보통 몇 분 정도 걸릴 수 있어요.','success');
   }catch(e){status(`게시 실패: ${e.message}`,'error');}
   finally{publishing=false;updateDirty();}
 }
 btn('cmsPublish',publish);
 btn('cmsReset',()=>{
   if(JSON.stringify(draft)!==baseline && !confirm('게시하지 않은 수정 내용이 사라집니다. 취소할까요?'))return;
   location.reload();
 });
 updateDirty();
 window.addEventListener('beforeunload',e=>{
   if(connected && JSON.stringify(draft)!==baseline){e.preventDefault();e.returnValue='';}
 });
 status('GitHub 토큰을 연결하면 글을 클릭해서 수정할 수 있어요.');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

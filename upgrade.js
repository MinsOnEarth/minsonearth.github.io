(function(){
'use strict';
// Backward-compatible migration for existing v3 content.json, keeping edits intact.
window.upgradeAcademicContent=function(raw){
 const d=structuredClone(raw||{});
 if(!d.home || !Array.isArray(d.home.education))return d;
 if(d.home.education.length){
  const first=d.home.education[0];
  if(first.lab===undefined)first.lab=d.home.lab||'';
  if(first.advisor===undefined)first.advisor=String(d.home.advisor||'').replace(/^Advised by\s*/i,'');
  if(first.detail==='DEHUB · Advisor: Prof. Daeho Lee'&&first.lab&&first.advisor)first.detail='';
 }
 for(const e of d.home.education){if(e.lab===undefined)e.lab='';if(e.advisor===undefined)e.advisor=''}
 if(!d.pageSections||typeof d.pageSections!=='object')d.pageSections={};
 for(const key of ['about','work','research','personal'])if(!Array.isArray(d.pageSections[key]))d.pageSections[key]=[];
 if(!Array.isArray(d.pageSections.career)){
  const awardEntries=(d.awards||[]).map(a=>({id:'cv-'+a.id,period:a.year||'',title:a.title||'',organization:a.organization||'',description:a.detail||'',link:a.link||'',image:a.image||'',attachment:''}));
  const expEntries=(d.experience||[]).map(e=>({id:'cv-'+e.id,period:e.period||'',title:e.role||'',organization:e.organization||'',description:e.description||'',link:e.link||'',image:e.image||'',attachment:'',isTeaching:/teach/i.test((e.category||'')+' '+(e.role||''))}));
  const otherEntries=(d.other||[]).map(e=>({id:'cv-'+e.id,period:e.period||'',title:e.title||'',organization:e.organization||'',description:e.description||'',link:e.link||'',image:e.image||'',attachment:'',isVolunteer:/volunteer/i.test((e.title||'')+' '+(e.description||''))}));
  const group=(id,title,items)=>({id,title,intro:'',visible:true,entries:items.map(x=>{const y={...x};delete y.isTeaching;delete y.isVolunteer;return y})});
  d.pageSections.career=[
   group('cv-awards','Selected Awards',awardEntries),
   group('cv-research','Research & Industry Experience',expEntries.filter(x=>!x.isTeaching)),
   group('cv-teaching','Teaching Experience',expEntries.filter(x=>x.isTeaching)),
   group('cv-scholarships','Scholarships',[]),
   group('cv-volunteer','Volunteer Experience',otherEntries.filter(x=>x.isVolunteer)),
   group('cv-licenses','Licenses & Certificates',[]),
   group('cv-skills','Technical Skills',[]),
   group('cv-leadership','Leadership Activities',otherEntries.filter(x=>!x.isVolunteer)),
   group('cv-honors','Selected Honors',[])
  ];
 }
 for(const key of ['about','work','career','research','personal']){
  for(const section of d.pageSections[key]){
   if(!section.id)section.id='section-'+Math.random().toString(36).slice(2,10);
   if(section.visible===undefined)section.visible=true;
   if(!Array.isArray(section.entries))section.entries=[];
  }
 }
 return d;
};
})();

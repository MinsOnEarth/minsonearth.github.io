/* Loads the visual editor only when requested; visit ?edit=1. */
if(new URLSearchParams(location.search).has('edit')){const e=document.createElement('script');e.src='editor.js';e.defer=true;document.head.appendChild(e);const c=document.createElement('link');c.rel='stylesheet';c.href='editor.css';document.head.appendChild(c);}

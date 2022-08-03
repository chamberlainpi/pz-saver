var oe=Object.defineProperty,ne=Object.defineProperties;var ae=Object.getOwnPropertyDescriptors;var H=Object.getOwnPropertySymbols;var le=Object.prototype.hasOwnProperty,re=Object.prototype.propertyIsEnumerable;var Y=(l,a,t)=>a in l?oe(l,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[a]=t,q=(l,a)=>{for(var t in a||(a={}))le.call(a,t)&&Y(l,t,a[t]);if(H)for(var t of H(a))re.call(a,t)&&Y(l,t,a[t]);return l},K=(l,a)=>ne(l,ae(a));import{r as b,a as T,c as B,d as A,o as u,b as d,n as g,e as P,w as F,v as X,u as n,f as e,i as ie,g as $,h as x,j as U,k as Z,l as J,F as O,m as G,p as R,_ as N,q as Q,t as V,s as ce,x as ue,y as de,z as pe,A as me,B as he}from"./vendor.4a5c47c0.js";const _e=function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerpolicy&&(r.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?r.credentials="include":o.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(o){if(o.ep)return;o.ep=!0;const r=t(o);fetch(o.href,r)}};_e();globalThis.trace=console.log.bind(console);const ve=(l,a)=>{const t=b(l);async function s(){const{data:o}=await T.get(a);t.value=o[0]}return s(),t},be=(l,a,t="modelValue")=>B({get:()=>l[t],set:s=>a(`update:${t}`,s)}),I=(l,a)=>A.duration((a||A()).diff(A(l))).format("D[d] HH:mm:ss [ago]").replace("0d ","");const fe={props:{name:String},setup(l){return(a,t)=>(u(),d("i",{class:g("fa fa-"+l.name)},null,2))}},ge={class:"hbox items-center text-xs p-2 select-none cursor-pointer"},xe={key:0},ye={key:1,class:"abs right-2"},we={props:{color:String,modelValue:Boolean},setup(l,{emit:a}){const s=be(l,a);return(o,r)=>{const i=P("icon");return u(),d("label",ge,[F(e("input",{type:"checkbox",class:"hidden","onUpdate:modelValue":r[0]||(r[0]=y=>ie(s)?s.value=y:null)},null,512),[[X,n(s)]]),e("div",{class:g(["hbox items-center px-2 pt-1 w-14 h-7 rel rounded-full m-0 text-white leading-5",[n(s)?"bg-green-500":"bg-red-900"]])},[n(s)?$("",!0):(u(),d("i",xe,"OFF")),x(i,{name:"circle",class:g(["abs right-1 top-0 text-lg transition-all opacity-80",[n(s)?"-translate-x-7":""]])},null,8,["class"]),n(s)?(u(),d("i",ye,"ON")):$("",!0)],2)])}}},C=ve({pzRoot:""},"/config");async function ke(){const{data:l}=await T.post("/config",C.value);trace(l)}const ee=b({isBaselineSnapped:!1,isCurrentSnapped:!1});async function te(){let{data:l}=await T.get("/status");ee.value=l,setTimeout(te,3e3)}var W;const v=b((W=U.exports.cookies.isCompact)!=null?W:!0);Z(v,l=>U.exports.cookies.isCompact=l);const Se={class:"game-folders panel"},$e={class:"hbox all-center font-bold"},Ce={class:"nowrap"},Pe=R("Folders"),Ve={class:"ml-auto"},Te=["disabled"],Me=R(" Refresh "),Be={class:"hbox items-center w-full text-2xl px-2"},Ae=e("i",{class:"font-bold"},"Filters:",-1),Re=["value"],Ee={class:"hbox all-center text-lg gap-2 px-2 py-1"},Ue=["onUpdate:modelValue"],Le={class:"flex-shrink hbox all-center"},Ne={key:0,class:"small-tag bg-green-600"},Fe=["title"],Oe={setup(l){const a="All, Builder, Survivor, Sandbox".split(", "),t=b(U.exports.cookies.filter||"All"),s=b([]),o=B(()=>s.value.filter(c=>c.isSelected)),r=B(()=>o.value.length===1?o.value[0]:null),i=c=>C.value.current===c.path,y=()=>s.value.forEach(c=>c.isSelected=!1),M=B(()=>{if(U.exports.cookies.filter=t.value,t.value==="All")return s.value;const c=`/${t.value}/`;return s.value.filter(h=>h.path.includes(c)).map(h=>(h.shorterPath=h.shortPath.split("/").pop(),h))});async function _(){C.value.current=o.value[0].path,await ke()}async function m(){let{data:c}=await T.get("/load-game-folders");const h=A();c=c.filter(w=>!w.path.includes("Multiplayer")).map(w=>K(q({},w),{shortPath:w.path.split("/Saves/").pop(),isSelected:!1,date:N.mapValues(w.stat,p=>A(p).format("YYYY-MM-DD HH:mm:ss")),ago:N.mapValues(w.stat,p=>I(p,h))})),c=N.sortBy(c,"stat.mtimeMs").reverse(),s.value=c}return J(()=>{m(),te()}),(c,h)=>{const w=P("icon");return u(),d("div",Se,[e("div",$e,[e("h1",Ce,[x(w,{name:"folder-open p-2"}),Pe]),e("div",Ve,[n(o).length?(u(),d("button",{key:0,class:"btn bg-red-600 text-white",onClick:y},[x(w,{name:"ban"})])):$("",!0),e("button",{class:g(["path-current btn bg-green-600 text-white",{"opacity-50":!n(r)}]),disabled:!n(r),onClick:_}," Set Current ",10,Te),e("button",{class:"btn bg-orange-400 text-white",onClick:m},[x(w,{name:"sync"}),Me])])]),e("div",Be,[Ae,(u(!0),d(O,null,G(n(a),p=>(u(),d("label",{key:p,class:"px-2 btn nowrap"},[F(e("input",{type:"radio",value:p,"onUpdate:modelValue":h[0]||(h[0]=E=>t.value=E)},null,8,Re),[[Q,t.value]]),R(" "+V(p),1)]))),128))]),(u(!0),d(O,null,G(n(M),p=>(u(),d("div",{key:p.path},[e("label",Ee,[F(e("input",{type:"checkbox",class:"rel scale-150 -top-1 btn","onUpdate:modelValue":E=>p.isSelected=E},null,8,Ue),[[X,p.isSelected]]),e("i",Le,[e("i",{class:g({"text-green-600":i(p)})},V(t.value==="All"?p.shortPath:p.shorterPath),3),i(p)?(u(),d("i",Ne,"C")):$("",!0)]),e("i",{class:"ml-auto opacity-50 font-mono",title:p.date.mtimeMs},V(p.ago.mtimeMs),9,Fe)])]))),128))])}}},ze={class:"timed-snapshot mt-3 panel border-red-600border border-red-500"},De={class:"hbox items-center pb-4"},Ze={class:"mr-4"},Ge=R("Timed Snapshot"),Ie={class:"hbox items-center ml-auto"},je=e("i",{class:"b ml-3"},"Enabled",-1),He={class:"hbox border border-black rounded-md mb-2 p-1"},Ye={class:"hbox items-center text-xl"},qe=e("i",{class:"mr-2"},"Every:",-1),Ke=["value"],We=e("i",null,"SAVE PREVIOUS",-1),Xe=e("i",{class:"text-xs opacity-50"},"I've just been bitten / died / lost all my XP and I don't like it!",-1),Je={class:"text-xs opacity-50"},Qe=e("i",null,"SAVE NOW!",-1),et=e("i",{class:"text-xs opacity-50"},"I'm satisfied with my progress and wish to save now.",-1),tt={class:"text-xs opacity-50"},st={key:0,class:"border-4 border-double border-red-600 p-2"},ot={setup(l,{emit:a}){var j;var t=null;const s=b([]),o=b(!1),r=B(()=>s.value.length==2),i=b(!1),y=b((j=U.exports.cookies.isAutoStart)!=null?j:!1),M="2s 10s 30s 5m 20m 60m".split(" "),_=b("5m"),m=b(""),c=B(()=>ee.value.isPZRunning);Z(y,S=>(U.exports.cookies.isAutoStart=S,h(S))),Z(c,S=>h(S));const h=S=>y.value&&(i.value=S);Z(i,S=>{p()});const w={s:1,m:60};async function p(){if(!i.value){TweenMax.set("#progress",{width:"0%"}),t&&t.kill();return}const[S,f,z]=_.value.match(/([0-9]*)([a-z]*)/),D=f*w[z];o.value=!0,TweenMax.set("#progress",{width:"100%"});let{data:k}=await T.post("/buffer-snapshot");s.value=N.sortBy(k.pair,"dateZippedMS"),trace(s.value.map(L=>L.name).join(`
`)),o.value=!1,t=TweenMax.fromTo("#progress",D,{width:"0%"},{width:"100%",ease:L=>L,onComplete:p})}async function E(S){m.value="";let{data:f}=await T.post("/buffer-write-current",{which:S});if(f.isError){m.value=f.isError,setTimeout(()=>m.value="",3e3);return}trace("onSaveBufferNow",f),a("save-buffer")}return ce(()=>{trace("Killing the tween..."),t&&t.kill()}),(S,f)=>{const z=P("icon"),D=P("ToggleButton");return u(),d("div",ze,[e("div",De,[e("h1",Ze,[x(z,{name:"camera p-2"}),Ge]),e("div",Ie,[e("i",{class:g(["b px-1 border rounded-md border-transparent transition-colors duration-200",{"border-green-700":n(c)&&y.value}])}," Auto-Start ",2),x(D,{modelValue:y.value,"onUpdate:modelValue":f[0]||(f[0]=k=>y.value=k)},null,8,["modelValue"]),je,x(D,{modelValue:i.value,"onUpdate:modelValue":f[1]||(f[1]=k=>i.value=k)},null,8,["modelValue"])])]),e("div",He,[e("div",{id:"progress",class:g(["h-3 rounded-md",o.value?"bg-yellow-400":"bg-green-600"])},null,2)]),e("div",Ye,[x(z,{name:"clock mr-1"}),qe,(u(!0),d(O,null,G(n(M),k=>(u(),d("label",{key:k,class:g(["btn border-2 border-gray-400 px-3 py-1 rounded-xl text-white text-center mx-0 mr-1",_.value==k?"bg-green-500 border-green-200":"bg-blue-400 border-blue-200"])},[F(e("input",{type:"radio",class:"hidden",value:k,"onUpdate:modelValue":f[2]||(f[2]=L=>_.value=L)},null,8,Ke),[[Q,_.value]]),e("i",null,V(k),1)],2))),128))]),e("div",{class:g(n(v)?"hbox":"vbox")},[e("button",{class:g(["btn w-full bg-red-900 text-white vbox all-center",n(v)?"h-28":"h-48"]),onClick:f[3]||(f[3]=k=>E("prev"))},[We,Xe,e("i",Je,V(n(r)?n(I)(s.value[0].dateZippedMS):"[not ready yet]"),1)],2),e("button",{class:g(["btn w-full bg-green-900 text-white vbox all-center",n(v)?"h-28":"h-20"]),onClick:f[4]||(f[4]=k=>E("now"))},[Qe,et,e("i",tt,V(n(r)?n(I)(s.value[1].dateZippedMS):"[not ready yet]"),1)],2)],2),m.value?(u(),d("i",st,V(m.value),1)):$("",!0)])}}},nt={class:"file-backups p-2 panel"},at={class:"hbox items-center"},lt=R("Saved Snapshots"),rt={class:"break-words"},it=["onClick"],ct={key:0,class:"ml-1"},ut=["onClick"],dt={key:0,class:"ml-1"},pt={setup(l,{expose:a}){const t=b(!1),s=b([]),o=B(()=>v.value?s.value.slice(s.value.length-3):s.value),r=_=>{const m=_.split("__").pop();return v.value?m.split(".")[0].replace("_"," "):m};async function i(){let{data:_}=await T.get("/backups");s.value=_}async function y(_){if(t.value)return;t.value=!0;let{data:m}=await T.put("/backup-restore/"+_.key);trace(m),t.value=!1}async function M(_){if(t.value)return;t.value=!0;let{data:m}=await T.delete("/backup-delete/"+_.key);trace(m),await i(),t.value=!1}return a({updateBackupsList:i}),i(),(_,m)=>{const c=P("icon");return u(),d("div",nt,[e("div",at,[e("h1",null,[x(c,{name:"camera p-2"}),lt])]),e("div",{class:g(["backup-list vbox border border-gray-300 rounded-md my-1",[n(v)?"text-sm grid grid-cols-3 p-1":"p-3",{"opacity-50":t.value}]])},[(u(!0),d(O,null,G(n(o),h=>(u(),d("div",{key:h.key,class:"hbox all-center"},[e("i",rt,V(r(h.value)),1),e("div",{class:g(["backup-buttons",{"ml-auto":!n(v)}])},[e("button",{class:g(["btn bg-blue-600 text-white",{"sml-btn":n(v)}]),onClick:w=>y(h)},[x(c,{name:"trash-arrow-up"}),n(v)?$("",!0):(u(),d("i",ct,"Restore"))],10,it),e("button",{class:g(["btn bg-red-600 text-white",{"sml-btn":n(v)}]),onClick:w=>M(h)},[x(c,{name:"trash"}),n(v)?$("",!0):(u(),d("i",dt,"Delete"))],10,ut)],2)]))),128))],2)])}}},mt={icon:fe,PanelConfigGameFolders:Oe,PanelTimedSnapshot:ot,PanelSavedSnapshots:pt,ToggleButton:we};var ht={install(l,a){const t=[];N.forOwn(mt,(s,o)=>{l.component(o,s),t.push(o)}),trace("VUE - Registered: ",t.join(" "))}},_t="/assets/PzLogo.8f013a5d.png";function vt(l,a,t){const s={progress:0};TweenMax.to(s,a,{progress:1,onUpdate(){const{progress:o}=s;TweenMax.set(l,{rotation:Math.cos(o*20)*t*(1-o)})}})}const bt={class:"main-app vbox bg-gray-400 w-screen h-screen overflow-y-auto"},ft=e("div",{class:"abs inset-0 scanlines from-transparent to-black opacity-30 z-0"},null,-1),gt={class:"rel w-72 h-32 self-center"},xt={class:"vbox rel z-10 bg-white bg-opacity-80"},yt={class:"vbox p-4 gap-2"},wt={class:"hbox nowrap"},kt={key:0,class:"hbox items-center gap-2"},St=e("i",null,"PZ Root:",-1),$t=R(" Save "),Ct={key:1,class:"ml-auto"},Pt={setup(l){const a=b(null);b(null);const t=b(null),s=b(null);async function o(){!t||!t.value||await t.value.updateBackupsList()}return J(()=>{gsap.to(".scanlines",.45,{"--scanline-y":"5px",repeat:-1,ease:r=>r})}),(r,i)=>{const y=P("icon"),M=P("PanelTimedSnapshot"),_=P("PanelConfigGameFolders"),m=P("PanelSavedSnapshots");return u(),d("div",bt,[ft,e("div",gt,[e("img",{class:"logo btn",alt:"PZ logo",src:_t,onClick:i[0]||(i[0]=c=>n(vt)(".logo",.5,10))})]),e("div",xt,[e("div",yt,[e("div",wt,[n(v)?$("",!0):(u(),d("div",kt,[St,F(e("input",{class:"rounded-md p-2 shadow-inner shadow-gray-500 bg-opacity-70 bg-white w-full",type:"text","onUpdate:modelValue":i[1]||(i[1]=c=>n(C).pzRoot=c)},null,512),[[ue,n(C).pzRoot]]),e("button",{class:"btn bg-green-800 text-white w-48",onClick:i[2]||(i[2]=(...c)=>r.setConfig&&r.setConfig(...c))},[x(y,{name:"save mr-2"}),$t])])),n(C).pzRoot?(u(),d("div",Ct,[e("button",{class:"btn w-36 bg-gray-700 text-white",onClick:i[3]||(i[3]=c=>v.value=!n(v))},[x(y,{name:"gear"}),R(" "+V(n(v)?"Advanced":"Compact"),1)])])):$("",!0)]),n(C).pzRoot?(u(),d(O,{key:0},[x(M,{ref_key:"panelTimedSnapshot",ref:s,config:n(C),onSaveBuffer:o},null,8,["config"]),n(v)?$("",!0):(u(),de(_,{key:0,ref_key:"panelConfigGameFolders",ref:a,config:n(C)},null,8,["config"])),x(m,{ref_key:"panelSavedSnapshots",ref:t},null,512)],64)):$("",!0)])])])}}};A.extend(pe);A.extend(me);const se=he(Pt);se.use(ht);se.mount("#app");
var oe=Object.defineProperty,ne=Object.defineProperties;var ae=Object.getOwnPropertyDescriptors;var H=Object.getOwnPropertySymbols;var le=Object.prototype.hasOwnProperty,re=Object.prototype.propertyIsEnumerable;var Y=(l,a,t)=>a in l?oe(l,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[a]=t,q=(l,a)=>{for(var t in a||(a={}))le.call(a,t)&&Y(l,t,a[t]);if(H)for(var t of H(a))re.call(a,t)&&Y(l,t,a[t]);return l},K=(l,a)=>ne(l,ae(a));import{r as b,a as T,c as A,d as R,o as u,b as d,n as g,e as P,w as O,v as X,u as o,f as e,i as ie,g as $,h as x,j as U,k as Z,l as J,F as z,m as G,p as M,_ as F,q as Q,t as V,s as ce,x as ue,y as de,z as pe,A as me,B as he}from"./vendor.bc7ab80e.js";const _e=function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerpolicy&&(i.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?i.credentials="include":n.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}};_e();globalThis.trace=console.log.bind(console);const ve=(l,a)=>{const t=b(l);async function s(){const{data:n}=await T.get(a);t.value=n[0]}return s(),t},be=(l,a,t="modelValue")=>A({get:()=>l[t],set:s=>a(`update:${t}`,s)}),I=(l,a)=>R.duration((a||R()).diff(R(l))).format("D[d] HH:mm:ss [ago]").replace("0d ","");const fe={props:{name:String},setup(l){return(a,t)=>(u(),d("i",{class:g("fa fa-"+l.name)},null,2))}},ge={class:"hbox items-center text-xs p-2 select-none cursor-pointer"},xe={key:0},ye={key:1,class:"abs right-2"},we={props:{color:String,modelValue:Boolean},setup(l,{emit:a}){const s=be(l,a);return(n,i)=>{const c=P("icon");return u(),d("label",ge,[O(e("input",{type:"checkbox",class:"hidden","onUpdate:modelValue":i[0]||(i[0]=w=>ie(s)?s.value=w:null)},null,512),[[X,o(s)]]),e("div",{class:g(["hbox items-center px-2 pt-1 w-14 h-7 rel rounded-full m-0 text-white leading-5",[o(s)?"bg-green-500":"bg-red-900"]])},[o(s)?$("",!0):(u(),d("i",xe,"OFF")),x(c,{name:"circle",class:g(["abs right-1 top-0 text-lg transition-all opacity-80",[o(s)?"-translate-x-7":""]])},null,8,["class"]),o(s)?(u(),d("i",ye,"ON")):$("",!0)],2)])}}},C=ve({pzRoot:""},"/config");async function ke(){const{data:l}=await T.post("/config",C.value);trace(l)}const ee=b({isBaselineSnapped:!1,isCurrentSnapped:!1});async function te(){let{data:l}=await T.get("/status");ee.value=l,setTimeout(te,3e3)}var W;const v=b((W=U.exports.cookies.isCompact)!=null?W:!0);Z(v,l=>U.exports.cookies.isCompact=l);const Se={class:"game-folders panel"},$e={class:"hbox all-center font-bold"},Ce={class:"nowrap"},Pe=M("Folders"),Ve={class:"ml-auto"},Te=["disabled"],Me=M(" Refresh "),Be={class:"hbox items-center w-full text-2xl px-2"},Ae=e("i",{class:"font-bold"},"Filters:",-1),Re=["value"],Ee={class:"hbox all-center text-lg gap-2 px-2 py-1"},Ue=["onUpdate:modelValue"],Le={class:"flex-shrink hbox all-center"},Ne={key:0,class:"small-tag bg-green-600"},Fe=["title"],Oe={setup(l){const a="All, Builder, Survivor, Sandbox".split(", "),t=b(U.exports.cookies.filter||"All"),s=b([]),n=A(()=>s.value.filter(r=>r.isSelected)),i=A(()=>n.value.length===1?n.value[0]:null),c=r=>C.value.current===r.path,w=()=>s.value.forEach(r=>r.isSelected=!1),B=A(()=>{if(U.exports.cookies.filter=t.value,t.value==="All")return s.value;const r=`/${t.value}/`;return s.value.filter(h=>h.path.includes(r)).map(h=>(h.shorterPath=h.shortPath.split("/").pop(),h))});async function _(){C.value.current=n.value[0].path,await ke()}async function m(){let{data:r}=await T.get("/load-game-folders");const h=R();r=r.filter(y=>!y.path.includes("Multiplayer")).map(y=>K(q({},y),{shortPath:y.path.split("/Saves/").pop(),isSelected:!1,date:F.mapValues(y.stat,p=>R(p).format("YYYY-MM-DD HH:mm:ss")),ago:F.mapValues(y.stat,p=>I(p,h))})),r=F.sortBy(r,"stat.mtimeMs").reverse(),s.value=r}return J(()=>{m(),te()}),(r,h)=>{const y=P("icon");return u(),d("div",Se,[e("div",$e,[e("h1",Ce,[x(y,{name:"folder-open p-2"}),Pe]),e("div",Ve,[o(n).length?(u(),d("button",{key:0,class:"btn bg-red-600 text-white",onClick:w},[x(y,{name:"ban"})])):$("",!0),e("button",{class:g(["path-current btn bg-green-600 text-white",{"opacity-50":!o(i)}]),disabled:!o(i),onClick:_}," Set Current ",10,Te),e("button",{class:"btn bg-orange-400 text-white",onClick:m},[x(y,{name:"sync"}),Me])])]),e("div",Be,[Ae,(u(!0),d(z,null,G(o(a),p=>(u(),d("label",{key:p,class:"px-2 btn nowrap"},[O(e("input",{type:"radio",value:p,"onUpdate:modelValue":h[0]||(h[0]=E=>t.value=E)},null,8,Re),[[Q,t.value]]),M(" "+V(p),1)]))),128))]),(u(!0),d(z,null,G(o(B),p=>(u(),d("div",{key:p.path},[e("label",Ee,[O(e("input",{type:"checkbox",class:"rel scale-150 -top-1 btn","onUpdate:modelValue":E=>p.isSelected=E},null,8,Ue),[[X,p.isSelected]]),e("i",Le,[e("i",{class:g({"text-green-600":c(p)})},V(t.value==="All"?p.shortPath:p.shorterPath),3),c(p)?(u(),d("i",Ne,"C")):$("",!0)]),e("i",{class:"ml-auto opacity-50 font-mono",title:p.date.mtimeMs},V(p.ago.mtimeMs),9,Fe)])]))),128))])}}},ze={class:"timed-snapshot mt-3 panel border-red-600border border-red-500"},De={class:"hbox items-center pb-4"},Ze={class:"mr-4"},Ge=M("Timed Snapshot"),Ie={class:"hbox items-center ml-auto"},je=M(" Auto-Start "),He=e("i",{class:"b ml-3"},"Enabled",-1),Ye={class:"hbox border border-black rounded-md mb-2 p-1"},qe={class:"hbox items-center text-xl"},Ke=e("i",{class:"mr-2"},"Every:",-1),We=["value"],Xe=e("i",null,"SAVE PREVIOUS",-1),Je=e("i",{class:"text-xs opacity-50"},"I've just been bitten / died / lost all my XP and I don't like it!",-1),Qe={class:"text-xs opacity-50"},et=e("i",null,"SAVE NOW!",-1),tt=e("i",{class:"text-xs opacity-50"},"I'm satisfied with my progress and wish to save now.",-1),st={class:"text-xs opacity-50"},ot={key:0,class:"border-4 border-double border-red-600 p-2"},nt={setup(l,{emit:a}){var j;var t=null;const s=b([]),n=b(!1),i=A(()=>s.value.length==2),c=b(!1),w=b((j=U.exports.cookies.isAutoStart)!=null?j:!1),B="2s 10s 30s 5m 20m 60m".split(" "),_=b("5m"),m=b(""),r=A(()=>ee.value.isPZRunning);Z(w,S=>(U.exports.cookies.isAutoStart=S,h(S))),Z(r,S=>h(S));const h=S=>w.value&&(c.value=S);Z(c,S=>{p()});const y={s:1,m:60};async function p(){if(!c.value){TweenMax.set("#progress",{width:"0%"}),t&&t.kill();return}const[S,f,L]=_.value.match(/([0-9]*)([a-z]*)/),D=f*y[L];n.value=!0,TweenMax.set("#progress",{width:"100%"});let{data:k}=await T.post("/buffer-snapshot");s.value=F.sortBy(k.pair,"dateZippedMS"),trace(s.value.map(N=>N.name).join(`
`)),n.value=!1,t=TweenMax.fromTo("#progress",D,{width:"0%"},{width:"100%",ease:N=>N,onComplete:p})}async function E(S){m.value="";let{data:f}=await T.post("/buffer-write-current",{which:S});if(f.isError){m.value=f.isError,setTimeout(()=>m.value="",3e3);return}trace("onSaveBufferNow",f),a("save-buffer")}return ce(()=>{trace("Killing the tween..."),t&&t.kill()}),(S,f)=>{const L=P("icon"),D=P("ToggleButton");return u(),d("div",ze,[e("div",De,[e("h1",Ze,[x(L,{name:"camera p-2"}),Ge]),e("div",Ie,[e("i",{class:g(["b px-2 py-1 border rounded-md border-transparent transition-colors duration-200",{"border-green-400":o(r)}])},[je,x(L,{name:"circle",class:g([o(r)?"animate-pulse duration-300 text-green-400":"text-gray-500 opacity-50"])},null,8,["class"])],2),x(D,{modelValue:w.value,"onUpdate:modelValue":f[0]||(f[0]=k=>w.value=k)},null,8,["modelValue"]),He,x(D,{modelValue:c.value,"onUpdate:modelValue":f[1]||(f[1]=k=>c.value=k)},null,8,["modelValue"])])]),e("div",Ye,[e("div",{id:"progress",class:g(["h-3 rounded-md",n.value?"bg-yellow-400":"bg-green-600"])},null,2)]),e("div",qe,[x(L,{name:"clock mr-1"}),Ke,(u(!0),d(z,null,G(o(B),k=>(u(),d("label",{key:k,class:g(["btn border-2 border-gray-400 px-3 py-1 rounded-xl text-white text-center mx-0 mr-1",_.value==k?"bg-green-500 border-green-200":"bg-blue-400 border-blue-200"])},[O(e("input",{type:"radio",class:"hidden",value:k,"onUpdate:modelValue":f[2]||(f[2]=N=>_.value=N)},null,8,We),[[Q,_.value]]),e("i",null,V(k),1)],2))),128))]),e("div",{class:g(o(v)?"hbox":"vbox")},[e("button",{class:g(["btn w-full bg-red-900 text-white vbox all-center",o(v)?"h-28":"h-48"]),onClick:f[3]||(f[3]=k=>E("prev"))},[Xe,Je,e("i",Qe,V(o(i)?o(I)(s.value[0].dateZippedMS):"[not ready yet]"),1)],2),e("button",{class:g(["btn w-full bg-green-900 text-white vbox all-center",o(v)?"h-28":"h-20"]),onClick:f[4]||(f[4]=k=>E("now"))},[et,tt,e("i",st,V(o(i)?o(I)(s.value[1].dateZippedMS):"[not ready yet]"),1)],2)],2),m.value?(u(),d("i",ot,V(m.value),1)):$("",!0)])}}},at={class:"file-backups p-2 panel"},lt={class:"hbox items-center"},rt=M("Saved Snapshots"),it={class:"break-words"},ct=["onClick"],ut={key:0,class:"ml-1"},dt=["onClick"],pt={key:0,class:"ml-1"},mt={setup(l,{expose:a}){const t=b(!1),s=b([]),n=A(()=>v.value?s.value.slice(s.value.length-3):s.value),i=_=>{const m=_.split("__").pop();return v.value?m.split(".")[0].replace("_"," "):m};async function c(){let{data:_}=await T.get("/backups");s.value=_}async function w(_){if(t.value)return;t.value=!0;let{data:m}=await T.put("/backup-restore/"+_.key);trace(m),t.value=!1}async function B(_){if(t.value)return;t.value=!0;let{data:m}=await T.delete("/backup-delete/"+_.key);trace(m),await c(),t.value=!1}return a({updateBackupsList:c}),c(),(_,m)=>{const r=P("icon");return u(),d("div",at,[e("div",lt,[e("h1",null,[x(r,{name:"camera p-2"}),rt])]),e("div",{class:g(["backup-list vbox border border-gray-300 rounded-md my-1",[o(v)?"text-sm grid grid-cols-3 p-1":"p-3",{"opacity-50":t.value}]])},[(u(!0),d(z,null,G(o(n),h=>(u(),d("div",{key:h.key,class:"hbox all-center"},[e("i",it,V(i(h.value)),1),e("div",{class:g(["backup-buttons",{"ml-auto":!o(v)}])},[e("button",{class:g(["btn bg-blue-600 text-white",{"sml-btn":o(v)}]),onClick:y=>w(h)},[x(r,{name:"trash-arrow-up"}),o(v)?$("",!0):(u(),d("i",ut,"Restore"))],10,ct),e("button",{class:g(["btn bg-red-600 text-white",{"sml-btn":o(v)}]),onClick:y=>B(h)},[x(r,{name:"trash"}),o(v)?$("",!0):(u(),d("i",pt,"Delete"))],10,dt)],2)]))),128))],2)])}}},ht={icon:fe,PanelConfigGameFolders:Oe,PanelTimedSnapshot:nt,PanelSavedSnapshots:mt,ToggleButton:we};var _t={install(l,a){const t=[];F.forOwn(ht,(s,n)=>{l.component(n,s),t.push(n)}),trace("VUE - Registered: ",t.join(" "))}},vt="/assets/PzLogo.8f013a5d.png";function bt(l,a,t){const s={progress:0};TweenMax.to(s,a,{progress:1,onUpdate(){const{progress:n}=s;TweenMax.set(l,{rotation:Math.cos(n*20)*t*(1-n)})}})}const ft={class:"main-app vbox bg-gray-400 w-screen h-screen overflow-y-auto"},gt=e("div",{class:"abs inset-0 scanlines from-transparent to-black opacity-30 z-0"},null,-1),xt={class:"rel w-72 h-32 self-center"},yt={class:"vbox rel z-10 bg-white bg-opacity-80"},wt={class:"vbox p-4 gap-2"},kt={class:"hbox nowrap"},St={key:0,class:"hbox items-center gap-2"},$t=e("i",null,"PZ Root:",-1),Ct=M(" Save "),Pt={key:1,class:"ml-auto"},Vt={setup(l){const a=b(null);b(null);const t=b(null),s=b(null);async function n(){!t||!t.value||await t.value.updateBackupsList()}return J(()=>{gsap.to(".scanlines",.45,{"--scanline-y":"5px",repeat:-1,ease:i=>i})}),(i,c)=>{const w=P("icon"),B=P("PanelTimedSnapshot"),_=P("PanelConfigGameFolders"),m=P("PanelSavedSnapshots");return u(),d("div",ft,[gt,e("div",xt,[e("img",{class:"logo btn",alt:"PZ logo",src:vt,onClick:c[0]||(c[0]=r=>o(bt)(".logo",.5,10))})]),e("div",yt,[e("div",wt,[e("div",kt,[o(v)?$("",!0):(u(),d("div",St,[$t,O(e("input",{class:"rounded-md p-2 shadow-inner shadow-gray-500 bg-opacity-70 bg-white w-full",type:"text","onUpdate:modelValue":c[1]||(c[1]=r=>o(C).pzRoot=r)},null,512),[[ue,o(C).pzRoot]]),e("button",{class:"btn bg-green-800 text-white w-48",onClick:c[2]||(c[2]=(...r)=>i.setConfig&&i.setConfig(...r))},[x(w,{name:"save mr-2"}),Ct])])),o(C).pzRoot?(u(),d("div",Pt,[e("button",{class:"btn w-36 bg-gray-700 text-white",onClick:c[3]||(c[3]=r=>v.value=!o(v))},[x(w,{name:"gear"}),M(" "+V(o(v)?"Advanced":"Compact"),1)])])):$("",!0)]),o(C).pzRoot?(u(),d(z,{key:0},[x(B,{ref_key:"panelTimedSnapshot",ref:s,config:o(C),onSaveBuffer:n},null,8,["config"]),o(v)?$("",!0):(u(),de(_,{key:0,ref_key:"panelConfigGameFolders",ref:a,config:o(C)},null,8,["config"])),x(m,{ref_key:"panelSavedSnapshots",ref:t},null,512)],64)):$("",!0)])])])}}};R.extend(pe);R.extend(me);const se=he(Vt);se.use(_t);se.mount("#app");

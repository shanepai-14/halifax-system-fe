import{a_ as Q,r as g,aP as T,a$ as j,g as A,a as H,s as k,P as V,m as B,b0 as Y,u as D,j as b,d as Z,e as N,b as h,b1 as tt,b2 as nt,b3 as et,b4 as ot}from"./index-DMPyTngB.js";function rt(t={}){const{autoHideDuration:n=null,disableWindowBlurListener:s=!1,onClose:r,open:i,resumeHideDuration:p}=t,l=Q();g.useEffect(()=>{if(!i)return;function e(o){o.defaultPrevented||o.key==="Escape"&&(r==null||r(o,"escapeKeyDown"))}return document.addEventListener("keydown",e),()=>{document.removeEventListener("keydown",e)}},[i,r]);const m=T((e,o)=>{r==null||r(e,o)}),u=T(e=>{!r||e==null||l.start(e,()=>{m(null,"timeout")})});g.useEffect(()=>(i&&u(n),l.clear),[i,n,u,l]);const d=e=>{r==null||r(e,"clickaway")},c=l.clear,f=g.useCallback(()=>{n!=null&&u(p??n*.5)},[n,p,u]),v=e=>o=>{const a=e.onBlur;a==null||a(o),f()},x=e=>o=>{const a=e.onFocus;a==null||a(o),c()},y=e=>o=>{const a=e.onMouseEnter;a==null||a(o),c()},S=e=>o=>{const a=e.onMouseLeave;a==null||a(o),f()};return g.useEffect(()=>{if(!s&&i)return window.addEventListener("focus",f),window.addEventListener("blur",c),()=>{window.removeEventListener("focus",f),window.removeEventListener("blur",c)}},[s,i,f,c]),{getRootProps:(e={})=>{const o={...j(t),...j(e)};return{role:"presentation",...e,...o,onBlur:v(o),onFocus:x(o),onMouseEnter:y(o),onMouseLeave:S(o)}},onClickAway:d}}function st(t){return H("MuiSnackbarContent",t)}A("MuiSnackbarContent",["root","message","action"]);const at=t=>{const{classes:n}=t;return N({root:["root"],action:["action"],message:["message"]},st,n)},it=k(V,{name:"MuiSnackbarContent",slot:"Root",overridesResolver:(t,n)=>n.root})(B(({theme:t})=>{const n=t.palette.mode==="light"?.8:.98,s=Y(t.palette.background.default,n);return{...t.typography.body2,color:t.vars?t.vars.palette.SnackbarContent.color:t.palette.getContrastText(s),backgroundColor:t.vars?t.vars.palette.SnackbarContent.bg:s,display:"flex",alignItems:"center",flexWrap:"wrap",padding:"6px 16px",borderRadius:(t.vars||t).shape.borderRadius,flexGrow:1,[t.breakpoints.up("sm")]:{flexGrow:"initial",minWidth:288}}})),ct=k("div",{name:"MuiSnackbarContent",slot:"Message",overridesResolver:(t,n)=>n.message})({padding:"8px 0"}),lt=k("div",{name:"MuiSnackbarContent",slot:"Action",overridesResolver:(t,n)=>n.action})({display:"flex",alignItems:"center",marginLeft:"auto",paddingLeft:16,marginRight:-8}),ut=g.forwardRef(function(n,s){const r=D({props:n,name:"MuiSnackbarContent"}),{action:i,className:p,message:l,role:m="alert",...u}=r,d=r,c=at(d);return b.jsxs(it,{role:m,square:!0,elevation:6,className:Z(c.root,p),ownerState:d,ref:s,...u,children:[b.jsx(ct,{className:c.message,ownerState:d,children:l}),i?b.jsx(lt,{className:c.action,ownerState:d,children:i}):null]})});function dt(t){return H("MuiSnackbar",t)}A("MuiSnackbar",["root","anchorOriginTopCenter","anchorOriginBottomCenter","anchorOriginTopRight","anchorOriginBottomRight","anchorOriginTopLeft","anchorOriginBottomLeft"]);const pt=t=>{const{classes:n,anchorOrigin:s}=t,r={root:["root",`anchorOrigin${h(s.vertical)}${h(s.horizontal)}`]};return N(r,dt,n)},z=k("div",{name:"MuiSnackbar",slot:"Root",overridesResolver:(t,n)=>{const{ownerState:s}=t;return[n.root,n[`anchorOrigin${h(s.anchorOrigin.vertical)}${h(s.anchorOrigin.horizontal)}`]]}})(B(({theme:t})=>({zIndex:(t.vars||t).zIndex.snackbar,position:"fixed",display:"flex",left:8,right:8,justifyContent:"center",alignItems:"center",variants:[{props:({ownerState:n})=>n.anchorOrigin.vertical==="top",style:{top:8,[t.breakpoints.up("sm")]:{top:24}}},{props:({ownerState:n})=>n.anchorOrigin.vertical!=="top",style:{bottom:8,[t.breakpoints.up("sm")]:{bottom:24}}},{props:({ownerState:n})=>n.anchorOrigin.horizontal==="left",style:{justifyContent:"flex-start",[t.breakpoints.up("sm")]:{left:24,right:"auto"}}},{props:({ownerState:n})=>n.anchorOrigin.horizontal==="right",style:{justifyContent:"flex-end",[t.breakpoints.up("sm")]:{right:24,left:"auto"}}},{props:({ownerState:n})=>n.anchorOrigin.horizontal==="center",style:{[t.breakpoints.up("sm")]:{left:"50%",right:"auto",transform:"translateX(-50%)"}}}]}))),mt=g.forwardRef(function(n,s){const r=D({props:n,name:"MuiSnackbar"}),i=tt(),p={enter:i.transitions.duration.enteringScreen,exit:i.transitions.duration.leavingScreen},{action:l,anchorOrigin:{vertical:m,horizontal:u}={vertical:"bottom",horizontal:"left"},autoHideDuration:d=null,children:c,className:f,ClickAwayListenerProps:v,ContentProps:x,disableWindowBlurListener:y=!1,message:S,onBlur:U,onClose:e,onFocus:o,onMouseEnter:a,onMouseLeave:ft,open:E,resumeHideDuration:gt,TransitionComponent:R=ot,transitionDuration:M=p,TransitionProps:{onEnter:O,onExited:L,...$}={},...I}=r,w={...r,anchorOrigin:{vertical:m,horizontal:u},autoHideDuration:d,disableWindowBlurListener:y,TransitionComponent:R,transitionDuration:M},F=pt(w),{getRootProps:W,onClickAway:G}=rt({...w}),[K,P]=g.useState(!0),q=nt({elementType:z,getSlotProps:W,externalForwardedProps:I,ownerState:w,additionalProps:{ref:s},className:[F.root,f]}),X=C=>{P(!0),L&&L(C)},_=(C,J)=>{P(!1),O&&O(C,J)};return!E&&K?null:b.jsx(et,{onClickAway:G,...v,children:b.jsx(z,{...q,children:b.jsx(R,{appear:!0,in:E,timeout:M,direction:m==="top"?"down":"up",onEnter:_,onExited:X,...$,children:c||b.jsx(ut,{message:S,action:l,...x})})})})});export{mt as S};

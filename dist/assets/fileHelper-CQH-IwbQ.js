import{a as f,g as v,r as c,s as d,ap as _,ai as tt,e as h,P as I,m as U,u as x,aq as ot,a4 as et,j as p,c as u,b,ar as at,T as st,al as X,am as L,h as it}from"./index-CmW0R-vW.js";function rt(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function nt(t){return parseFloat(t)}function lt(t){return f("MuiDialog",t)}const W=v("MuiDialog",["root","scrollPaper","scrollBody","container","paper","paperScrollPaper","paperScrollBody","paperWidthFalse","paperWidthXs","paperWidthSm","paperWidthMd","paperWidthLg","paperWidthXl","paperFullWidth","paperFullScreen"]),Y=c.createContext({}),pt=d(_,{name:"MuiDialog",slot:"Backdrop",overrides:(t,o)=>o.backdrop})({zIndex:-1}),ct=t=>{const{classes:o,scroll:e,maxWidth:a,fullWidth:s,fullScreen:i}=t,r={root:["root"],container:["container",`scroll${h(e)}`],paper:["paper",`paperScroll${h(e)}`,`paperWidth${h(String(a))}`,s&&"paperFullWidth",i&&"paperFullScreen"]};return b(r,lt,o)},dt=d(tt,{name:"MuiDialog",slot:"Root",overridesResolver:(t,o)=>o.root})({"@media print":{position:"absolute !important"}}),ut=d("div",{name:"MuiDialog",slot:"Container",overridesResolver:(t,o)=>{const{ownerState:e}=t;return[o.container,o[`scroll${h(e.scroll)}`]]}})({height:"100%","@media print":{height:"auto"},outline:0,variants:[{props:{scroll:"paper"},style:{display:"flex",justifyContent:"center",alignItems:"center"}},{props:{scroll:"body"},style:{overflowY:"auto",overflowX:"hidden",textAlign:"center","&::after":{content:'""',display:"inline-block",verticalAlign:"middle",height:"100%",width:"0"}}}]}),gt=d(I,{name:"MuiDialog",slot:"Paper",overridesResolver:(t,o)=>{const{ownerState:e}=t;return[o.paper,o[`scrollPaper${h(e.scroll)}`],o[`paperWidth${h(String(e.maxWidth))}`],e.fullWidth&&o.paperFullWidth,e.fullScreen&&o.paperFullScreen]}})(U(({theme:t})=>({margin:32,position:"relative",overflowY:"auto","@media print":{overflowY:"visible",boxShadow:"none"},variants:[{props:{scroll:"paper"},style:{display:"flex",flexDirection:"column",maxHeight:"calc(100% - 64px)"}},{props:{scroll:"body"},style:{display:"inline-block",verticalAlign:"middle",textAlign:"initial"}},{props:({ownerState:o})=>!o.maxWidth,style:{maxWidth:"calc(100% - 64px)"}},{props:{maxWidth:"xs"},style:{maxWidth:t.breakpoints.unit==="px"?Math.max(t.breakpoints.values.xs,444):`max(${t.breakpoints.values.xs}${t.breakpoints.unit}, 444px)`,[`&.${W.paperScrollBody}`]:{[t.breakpoints.down(Math.max(t.breakpoints.values.xs,444)+32*2)]:{maxWidth:"calc(100% - 64px)"}}}},...Object.keys(t.breakpoints.values).filter(o=>o!=="xs").map(o=>({props:{maxWidth:o},style:{maxWidth:`${t.breakpoints.values[o]}${t.breakpoints.unit}`,[`&.${W.paperScrollBody}`]:{[t.breakpoints.down(t.breakpoints.values[o]+32*2)]:{maxWidth:"calc(100% - 64px)"}}}})),{props:({ownerState:o})=>o.fullWidth,style:{width:"calc(100% - 64px)"}},{props:({ownerState:o})=>o.fullScreen,style:{margin:0,width:"100%",maxWidth:"100%",height:"100%",maxHeight:"none",borderRadius:0,[`&.${W.paperScrollBody}`]:{margin:0,maxWidth:"100%"}}}]}))),Tt=c.forwardRef(function(o,e){const a=x({props:o,name:"MuiDialog"}),s=ot(),i={enter:s.transitions.duration.enteringScreen,exit:s.transitions.duration.leavingScreen},{"aria-describedby":r,"aria-labelledby":n,"aria-modal":l=!0,BackdropComponent:m,BackdropProps:w,children:y,className:C,disableEscapeKeyDown:k=!1,fullScreen:E=!1,fullWidth:K=!1,maxWidth:O="sm",onBackdropClick:B,onClick:P,onClose:S,open:j,PaperComponent:z=I,PaperProps:N={},scroll:H="paper",TransitionComponent:V=at,transitionDuration:F=i,TransitionProps:q,...G}=a,D={...a,disableEscapeKeyDown:k,fullScreen:E,fullWidth:K,maxWidth:O,scroll:H},M=ct(D),R=c.useRef(),J=g=>{R.current=g.target===g.currentTarget},Q=g=>{P&&P(g),R.current&&(R.current=null,B&&B(g),S&&S(g,"backdropClick"))},$=et(n),Z=c.useMemo(()=>({titleId:$}),[$]);return p.jsx(dt,{className:u(M.root,C),closeAfterTransition:!0,components:{Backdrop:pt},componentsProps:{backdrop:{transitionDuration:F,as:m,...w}},disableEscapeKeyDown:k,onClose:S,open:j,ref:e,onClick:Q,ownerState:D,...G,children:p.jsx(V,{appear:!0,in:j,timeout:F,role:"presentation",...q,children:p.jsx(ut,{className:u(M.container),onMouseDown:J,ownerState:D,children:p.jsx(gt,{as:z,elevation:24,role:"dialog","aria-describedby":r,"aria-labelledby":$,"aria-modal":l,...N,className:u(M.paper,N.className),ownerState:D,children:p.jsx(Y.Provider,{value:Z,children:y})})})})})});function ht(t){return f("MuiDialogActions",t)}v("MuiDialogActions",["root","spacing"]);const mt=t=>{const{classes:o,disableSpacing:e}=t;return b({root:["root",!e&&"spacing"]},ht,o)},ft=d("div",{name:"MuiDialogActions",slot:"Root",overridesResolver:(t,o)=>{const{ownerState:e}=t;return[o.root,!e.disableSpacing&&o.spacing]}})({display:"flex",alignItems:"center",padding:8,justifyContent:"flex-end",flex:"0 0 auto",variants:[{props:({ownerState:t})=>!t.disableSpacing,style:{"& > :not(style) ~ :not(style)":{marginLeft:8}}}]}),At=c.forwardRef(function(o,e){const a=x({props:o,name:"MuiDialogActions"}),{className:s,disableSpacing:i=!1,...r}=a,n={...a,disableSpacing:i},l=mt(n);return p.jsx(ft,{className:u(l.root,s),ownerState:n,ref:e,...r})});function vt(t){return f("MuiDialogContent",t)}v("MuiDialogContent",["root","dividers"]);function xt(t){return f("MuiDialogTitle",t)}const bt=v("MuiDialogTitle",["root"]),yt=t=>{const{classes:o,dividers:e}=t;return b({root:["root",e&&"dividers"]},vt,o)},Ct=d("div",{name:"MuiDialogContent",slot:"Root",overridesResolver:(t,o)=>{const{ownerState:e}=t;return[o.root,e.dividers&&o.dividers]}})(U(({theme:t})=>({flex:"1 1 auto",WebkitOverflowScrolling:"touch",overflowY:"auto",padding:"20px 24px",variants:[{props:({ownerState:o})=>o.dividers,style:{padding:"16px 24px",borderTop:`1px solid ${(t.vars||t).palette.divider}`,borderBottom:`1px solid ${(t.vars||t).palette.divider}`}},{props:({ownerState:o})=>!o.dividers,style:{[`.${bt.root} + &`]:{paddingTop:0}}}]}))),Ut=c.forwardRef(function(o,e){const a=x({props:o,name:"MuiDialogContent"}),{className:s,dividers:i=!1,...r}=a,n={...a,dividers:i},l=yt(n);return p.jsx(Ct,{className:u(l.root,s),ownerState:n,ref:e,...r})}),kt=t=>{const{classes:o}=t;return b({root:["root"]},xt,o)},Dt=d(st,{name:"MuiDialogTitle",slot:"Root",overridesResolver:(t,o)=>o.root})({padding:"16px 24px",flex:"0 0 auto"}),Bt=c.forwardRef(function(o,e){const a=x({props:o,name:"MuiDialogTitle"}),{className:s,id:i,...r}=a,n=a,l=kt(n),{titleId:m=i}=c.useContext(Y);return p.jsx(Dt,{component:"h2",className:u(l.root,s),ownerState:n,ref:e,variant:"h6",id:i??m,...r})});function wt(t){return f("MuiSkeleton",t)}v("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);const St=t=>{const{classes:o,variant:e,animation:a,hasChildren:s,width:i,height:r}=t;return b({root:["root",e,a,s&&"withChildren",s&&!i&&"fitContent",s&&!r&&"heightAuto"]},wt,o)},T=X`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`,A=X`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`,Mt=typeof T!="string"?L`
        animation: ${T} 2s ease-in-out 0.5s infinite;
      `:null,Rt=typeof A!="string"?L`
        &::after {
          animation: ${A} 2s linear 0.5s infinite;
        }
      `:null,$t=d("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,o)=>{const{ownerState:e}=t;return[o.root,o[e.variant],e.animation!==!1&&o[e.animation],e.hasChildren&&o.withChildren,e.hasChildren&&!e.width&&o.fitContent,e.hasChildren&&!e.height&&o.heightAuto]}})(U(({theme:t})=>{const o=rt(t.shape.borderRadius)||"px",e=nt(t.shape.borderRadius);return{display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:it(t.palette.text.primary,t.palette.mode==="light"?.11:.13),height:"1.2em",variants:[{props:{variant:"text"},style:{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${e}${o}/${Math.round(e/.6*10)/10}${o}`,"&:empty:before":{content:'"\\00a0"'}}},{props:{variant:"circular"},style:{borderRadius:"50%"}},{props:{variant:"rounded"},style:{borderRadius:(t.vars||t).shape.borderRadius}},{props:({ownerState:a})=>a.hasChildren,style:{"& > *":{visibility:"hidden"}}},{props:({ownerState:a})=>a.hasChildren&&!a.width,style:{maxWidth:"fit-content"}},{props:({ownerState:a})=>a.hasChildren&&!a.height,style:{height:"auto"}},{props:{animation:"pulse"},style:Mt||{animation:`${T} 2s ease-in-out 0.5s infinite`}},{props:{animation:"wave"},style:{position:"relative",overflow:"hidden",WebkitMaskImage:"-webkit-radial-gradient(white, black)","&::after":{background:`linear-gradient(
                90deg,
                transparent,
                ${(t.vars||t).palette.action.hover},
                transparent
              )`,content:'""',position:"absolute",transform:"translateX(-100%)",bottom:0,left:0,right:0,top:0}}},{props:{animation:"wave"},style:Rt||{"&::after":{animation:`${A} 2s linear 0.5s infinite`}}}]}})),Pt=c.forwardRef(function(o,e){const a=x({props:o,name:"MuiSkeleton"}),{animation:s="pulse",className:i,component:r="span",height:n,style:l,variant:m="text",width:w,...y}=a,C={...a,animation:s,component:r,variant:m,hasChildren:!!y.children},k=St(C);return p.jsx($t,{as:r,ref:e,className:u(k.root,i),ownerState:C,...y,style:{width:w,height:n,...l}})}),jt=t=>{if(!t)return null;if(t.startsWith("http"))return t;const o="https://hgasims.site",e=t.replace(/^\/+/,"");return`${o}/storage/${e}`};export{Tt as D,Pt as S,Bt as a,Ut as b,At as c,jt as g};
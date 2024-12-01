import{a as F,g as O,d as W,j as t,s as y,P as J,e as D,m as B,r as x,u as E,ae as re,I as Se,c as q,b as H,aj as xe,ak as ve,i as te,al as je,am as Le,T as X,U as Me,an as Pe,ao as we,Q as Ie,q as Q,G as $,t as fe}from"./index-CmW0R-vW.js";import{c as Re,d as Ae,e as ke}from"./usePurchaseOrders-B_oMpWKo.js";import{D as $e,a as ze,b as Te,c as De,S as G,g as qe}from"./fileHelper-CQH-IwbQ.js";import{C as _e,T as K,c as Ne,d as Ue,e as Fe,a as he,b as T,f as Oe}from"./TextField-Dbf9w0KL.js";import{C as We}from"./Close-Bvv8PyxK.js";import{L as Be}from"./Link-DJES-v16.js";import{B as se}from"./InputLabel-DPT03u9u.js";function Ee(e){return F("MuiAlert",e)}const ge=O("MuiAlert",["root","action","icon","message","filled","colorSuccess","colorInfo","colorWarning","colorError","filledSuccess","filledInfo","filledWarning","filledError","outlined","outlinedSuccess","outlinedInfo","outlinedWarning","outlinedError","standard","standardSuccess","standardInfo","standardWarning","standardError"]),He=W(t.jsx("path",{d:"M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2, 4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0, 0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z"}),"SuccessOutlined"),Ve=W(t.jsx("path",{d:"M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"}),"ReportProblemOutlined"),Ge=W(t.jsx("path",{d:"M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"}),"ErrorOutline"),Qe=W(t.jsx("path",{d:"M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20, 12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10, 10 0 0,0 12,2M11,17H13V11H11V17Z"}),"InfoOutlined"),Ze=e=>{const{variant:r,color:o,severity:a,classes:s}=e,i={root:["root",`color${D(o||a)}`,`${r}${D(o||a)}`,`${r}`],icon:["icon"],message:["message"],action:["action"]};return H(i,Ee,s)},Ke=y(J,{name:"MuiAlert",slot:"Root",overridesResolver:(e,r)=>{const{ownerState:o}=e;return[r.root,r[o.variant],r[`${o.variant}${D(o.color||o.severity)}`]]}})(B(({theme:e})=>{const r=e.palette.mode==="light"?xe:ve,o=e.palette.mode==="light"?ve:xe;return{...e.typography.body2,backgroundColor:"transparent",display:"flex",padding:"6px 16px",variants:[...Object.entries(e.palette).filter(te(["light"])).map(([a])=>({props:{colorSeverity:a,variant:"standard"},style:{color:e.vars?e.vars.palette.Alert[`${a}Color`]:r(e.palette[a].light,.6),backgroundColor:e.vars?e.vars.palette.Alert[`${a}StandardBg`]:o(e.palette[a].light,.9),[`& .${ge.icon}`]:e.vars?{color:e.vars.palette.Alert[`${a}IconColor`]}:{color:e.palette[a].main}}})),...Object.entries(e.palette).filter(te(["light"])).map(([a])=>({props:{colorSeverity:a,variant:"outlined"},style:{color:e.vars?e.vars.palette.Alert[`${a}Color`]:r(e.palette[a].light,.6),border:`1px solid ${(e.vars||e).palette[a].light}`,[`& .${ge.icon}`]:e.vars?{color:e.vars.palette.Alert[`${a}IconColor`]}:{color:e.palette[a].main}}})),...Object.entries(e.palette).filter(te(["dark"])).map(([a])=>({props:{colorSeverity:a,variant:"filled"},style:{fontWeight:e.typography.fontWeightMedium,...e.vars?{color:e.vars.palette.Alert[`${a}FilledColor`],backgroundColor:e.vars.palette.Alert[`${a}FilledBg`]}:{backgroundColor:e.palette.mode==="dark"?e.palette[a].dark:e.palette[a].main,color:e.palette.getContrastText(e.palette[a].main)}}}))]}})),Je=y("div",{name:"MuiAlert",slot:"Icon",overridesResolver:(e,r)=>r.icon})({marginRight:12,padding:"7px 0",display:"flex",fontSize:22,opacity:.9}),Xe=y("div",{name:"MuiAlert",slot:"Message",overridesResolver:(e,r)=>r.message})({padding:"8px 0",minWidth:0,overflow:"auto"}),be=y("div",{name:"MuiAlert",slot:"Action",overridesResolver:(e,r)=>r.action})({display:"flex",alignItems:"flex-start",padding:"4px 0 0 16px",marginLeft:"auto",marginRight:-8}),ye={success:t.jsx(He,{fontSize:"inherit"}),warning:t.jsx(Ve,{fontSize:"inherit"}),error:t.jsx(Ge,{fontSize:"inherit"}),info:t.jsx(Qe,{fontSize:"inherit"})},Ye=x.forwardRef(function(r,o){const a=E({props:r,name:"MuiAlert"}),{action:s,children:i,className:v,closeText:c="Close",color:f,components:p={},componentsProps:u={},icon:d,iconMapping:h=ye,onClose:b,role:m="alert",severity:g="success",slotProps:w={},slots:I={},variant:R="standard",...A}=a,C={...a,color:f,severity:g,variant:R,colorSeverity:f||g},j=Ze(C),z={slots:{closeButton:p.CloseButton,closeIcon:p.CloseIcon,...I},slotProps:{...u,...w}},[M,P]=re("closeButton",{elementType:Se,externalForwardedProps:z,ownerState:C}),[L,Z]=re("closeIcon",{elementType:We,externalForwardedProps:z,ownerState:C});return t.jsxs(Ke,{role:m,elevation:0,ownerState:C,className:q(j.root,v),ref:o,...A,children:[d!==!1?t.jsx(Je,{ownerState:C,className:j.icon,children:d||h[g]||ye[g]}):null,t.jsx(Xe,{ownerState:C,className:j.message,children:i}),s!=null?t.jsx(be,{ownerState:C,className:j.action,children:s}):null,s==null&&b?t.jsx(be,{ownerState:C,className:j.action,children:t.jsx(M,{size:"small","aria-label":c,title:c,color:"inherit",onClick:b,...P,children:t.jsx(L,{fontSize:"small",...Z})})}):null]})});function et(e){return F("MuiCircularProgress",e)}O("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);const N=44,ce=je`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`,pe=je`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`,tt=typeof ce!="string"?Le`
        animation: ${ce} 1.4s linear infinite;
      `:null,rt=typeof pe!="string"?Le`
        animation: ${pe} 1.4s ease-in-out infinite;
      `:null,ot=e=>{const{classes:r,variant:o,color:a,disableShrink:s}=e,i={root:["root",o,`color${D(a)}`],svg:["svg"],circle:["circle",`circle${D(o)}`,s&&"circleDisableShrink"]};return H(i,et,r)},at=y("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(e,r)=>{const{ownerState:o}=e;return[r.root,r[o.variant],r[`color${D(o.color)}`]]}})(B(({theme:e})=>({display:"inline-block",variants:[{props:{variant:"determinate"},style:{transition:e.transitions.create("transform")}},{props:{variant:"indeterminate"},style:tt||{animation:`${ce} 1.4s linear infinite`}},...Object.entries(e.palette).filter(te()).map(([r])=>({props:{color:r},style:{color:(e.vars||e).palette[r].main}}))]}))),st=y("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(e,r)=>r.svg})({display:"block"}),nt=y("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(e,r)=>{const{ownerState:o}=e;return[r.circle,r[`circle${D(o.variant)}`],o.disableShrink&&r.circleDisableShrink]}})(B(({theme:e})=>({stroke:"currentColor",variants:[{props:{variant:"determinate"},style:{transition:e.transitions.create("stroke-dashoffset")}},{props:{variant:"indeterminate"},style:{strokeDasharray:"80px, 200px",strokeDashoffset:0}},{props:({ownerState:r})=>r.variant==="indeterminate"&&!r.disableShrink,style:rt||{animation:`${pe} 1.4s ease-in-out infinite`}}]}))),it=x.forwardRef(function(r,o){const a=E({props:r,name:"MuiCircularProgress"}),{className:s,color:i="primary",disableShrink:v=!1,size:c=40,style:f,thickness:p=3.6,value:u=0,variant:d="indeterminate",...h}=a,b={...a,color:i,disableShrink:v,size:c,thickness:p,value:u,variant:d},m=ot(b),g={},w={},I={};if(d==="determinate"){const R=2*Math.PI*((N-p)/2);g.strokeDasharray=R.toFixed(3),I["aria-valuenow"]=Math.round(u),g.strokeDashoffset=`${((100-u)/100*R).toFixed(3)}px`,w.transform="rotate(-90deg)"}return t.jsx(at,{className:q(m.root,s),style:{width:c,height:c,...w,...f},ownerState:b,ref:o,role:"progressbar",...I,...h,children:t.jsx(st,{className:m.svg,ownerState:b,viewBox:`${N/2} ${N/2} ${N} ${N}`,children:t.jsx(nt,{className:m.circle,style:g,ownerState:b,cx:N,cy:N,r:(N-p)/2,fill:"none",strokeWidth:p})})})});function lt(e){return F("MuiDialogContentText",e)}O("MuiDialogContentText",["root"]);const ct=e=>{const{classes:r}=e,a=H({root:["root"]},lt,r);return{...r,...a}},pt=y(X,{shouldForwardProp:e=>Me(e)||e==="classes",name:"MuiDialogContentText",slot:"Root",overridesResolver:(e,r)=>r.root})({}),dt=x.forwardRef(function(r,o){const a=E({props:r,name:"MuiDialogContentText"}),{children:s,className:i,...v}=a,c=ct(v);return t.jsx(pt,{component:"p",variant:"body1",color:"textSecondary",ref:o,ownerState:v,className:q(c.root,i),...a,classes:c})}),oe=x.createContext({}),ue=x.createContext({});function ut(e){return F("MuiStep",e)}O("MuiStep",["root","horizontal","vertical","alternativeLabel","completed"]);const mt=e=>{const{classes:r,orientation:o,alternativeLabel:a,completed:s}=e;return H({root:["root",o,a&&"alternativeLabel",s&&"completed"]},ut,r)},xt=y("div",{name:"MuiStep",slot:"Root",overridesResolver:(e,r)=>{const{ownerState:o}=e;return[r.root,r[o.orientation],o.alternativeLabel&&r.alternativeLabel,o.completed&&r.completed]}})({variants:[{props:{orientation:"horizontal"},style:{paddingLeft:8,paddingRight:8}},{props:{alternativeLabel:!0},style:{flex:1,position:"relative"}}]}),vt=x.forwardRef(function(r,o){const a=E({props:r,name:"MuiStep"}),{active:s,children:i,className:v,component:c="div",completed:f,disabled:p,expanded:u=!1,index:d,last:h,...b}=a,{activeStep:m,connector:g,alternativeLabel:w,orientation:I,nonLinear:R}=x.useContext(oe);let[A=!1,C=!1,j=!1]=[s,f,p];m===d?A=s!==void 0?s:!0:!R&&m>d?C=f!==void 0?f:!0:!R&&m<d&&(j=p!==void 0?p:!0);const z=x.useMemo(()=>({index:d,last:h,expanded:u,icon:d+1,active:A,completed:C,disabled:j}),[d,h,u,A,C,j]),M={...a,active:A,orientation:I,alternativeLabel:w,completed:C,disabled:j,expanded:u,component:c},P=mt(M),L=t.jsxs(xt,{as:c,className:q(P.root,v),ref:o,ownerState:M,...b,children:[g&&w&&d!==0?g:null,i]});return t.jsx(ue.Provider,{value:z,children:g&&!w&&d!==0?t.jsxs(x.Fragment,{children:[g,L]}):L})}),ft=W(t.jsx("path",{d:"M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-2 17l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"}),"CheckCircle"),ht=W(t.jsx("path",{d:"M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"}),"Warning");function gt(e){return F("MuiStepIcon",e)}const ne=O("MuiStepIcon",["root","active","completed","error","text"]);var Ce;const bt=e=>{const{classes:r,active:o,completed:a,error:s}=e;return H({root:["root",o&&"active",a&&"completed",s&&"error"],text:["text"]},gt,r)},ie=y(Pe,{name:"MuiStepIcon",slot:"Root",overridesResolver:(e,r)=>r.root})(B(({theme:e})=>({display:"block",transition:e.transitions.create("color",{duration:e.transitions.duration.shortest}),color:(e.vars||e).palette.text.disabled,[`&.${ne.completed}`]:{color:(e.vars||e).palette.primary.main},[`&.${ne.active}`]:{color:(e.vars||e).palette.primary.main},[`&.${ne.error}`]:{color:(e.vars||e).palette.error.main}}))),yt=y("text",{name:"MuiStepIcon",slot:"Text",overridesResolver:(e,r)=>r.text})(B(({theme:e})=>({fill:(e.vars||e).palette.primary.contrastText,fontSize:e.typography.caption.fontSize,fontFamily:e.typography.fontFamily}))),Ct=x.forwardRef(function(r,o){const a=E({props:r,name:"MuiStepIcon"}),{active:s=!1,className:i,completed:v=!1,error:c=!1,icon:f,...p}=a,u={...a,active:s,completed:v,error:c},d=bt(u);if(typeof f=="number"||typeof f=="string"){const h=q(i,d.root);return c?t.jsx(ie,{as:ht,className:h,ref:o,ownerState:u,...p}):v?t.jsx(ie,{as:ft,className:h,ref:o,ownerState:u,...p}):t.jsxs(ie,{className:h,ref:o,ownerState:u,...p,children:[Ce||(Ce=t.jsx("circle",{cx:"12",cy:"12",r:"12"})),t.jsx(yt,{className:d.text,x:"12",y:"12",textAnchor:"middle",dominantBaseline:"central",ownerState:u,children:f})]})}return f});function St(e){return F("MuiStepLabel",e)}const U=O("MuiStepLabel",["root","horizontal","vertical","label","active","completed","error","disabled","iconContainer","alternativeLabel","labelContainer"]),jt=e=>{const{classes:r,orientation:o,active:a,completed:s,error:i,disabled:v,alternativeLabel:c}=e;return H({root:["root",o,i&&"error",v&&"disabled",c&&"alternativeLabel"],label:["label",a&&"active",s&&"completed",i&&"error",v&&"disabled",c&&"alternativeLabel"],iconContainer:["iconContainer",a&&"active",s&&"completed",i&&"error",v&&"disabled",c&&"alternativeLabel"],labelContainer:["labelContainer",c&&"alternativeLabel"]},St,r)},Lt=y("span",{name:"MuiStepLabel",slot:"Root",overridesResolver:(e,r)=>{const{ownerState:o}=e;return[r.root,r[o.orientation]]}})({display:"flex",alignItems:"center",[`&.${U.alternativeLabel}`]:{flexDirection:"column"},[`&.${U.disabled}`]:{cursor:"default"},variants:[{props:{orientation:"vertical"},style:{textAlign:"left",padding:"8px 0"}}]}),Mt=y("span",{name:"MuiStepLabel",slot:"Label",overridesResolver:(e,r)=>r.label})(B(({theme:e})=>({...e.typography.body2,display:"block",transition:e.transitions.create("color",{duration:e.transitions.duration.shortest}),[`&.${U.active}`]:{color:(e.vars||e).palette.text.primary,fontWeight:500},[`&.${U.completed}`]:{color:(e.vars||e).palette.text.primary,fontWeight:500},[`&.${U.alternativeLabel}`]:{marginTop:16},[`&.${U.error}`]:{color:(e.vars||e).palette.error.main}}))),Pt=y("span",{name:"MuiStepLabel",slot:"IconContainer",overridesResolver:(e,r)=>r.iconContainer})({flexShrink:0,display:"flex",paddingRight:8,[`&.${U.alternativeLabel}`]:{paddingRight:0}}),wt=y("span",{name:"MuiStepLabel",slot:"LabelContainer",overridesResolver:(e,r)=>r.labelContainer})(B(({theme:e})=>({width:"100%",color:(e.vars||e).palette.text.secondary,[`&.${U.alternativeLabel}`]:{textAlign:"center"}}))),de=x.forwardRef(function(r,o){const a=E({props:r,name:"MuiStepLabel"}),{children:s,className:i,componentsProps:v={},error:c=!1,icon:f,optional:p,slots:u={},slotProps:d={},StepIconComponent:h,StepIconProps:b,...m}=a,{alternativeLabel:g,orientation:w}=x.useContext(oe),{active:I,disabled:R,completed:A,icon:C}=x.useContext(ue),j=f||C;let z=h;j&&!z&&(z=Ct);const M={...a,active:I,alternativeLabel:g,completed:A,disabled:R,error:c,orientation:w},P=jt(M),L={slots:u,slotProps:{stepIcon:b,...v,...d}},[Z,V]=re("label",{elementType:Mt,externalForwardedProps:L,ownerState:M}),[Y,ee]=re("stepIcon",{elementType:z,externalForwardedProps:L,ownerState:M});return t.jsxs(Lt,{className:q(P.root,i),ref:o,ownerState:M,...m,children:[j||Y?t.jsx(Pt,{className:P.iconContainer,ownerState:M,children:t.jsx(Y,{completed:A,active:I,error:c,icon:j,...ee})}):null,t.jsxs(wt,{className:P.labelContainer,ownerState:M,children:[s?t.jsx(Z,{...V,className:q(P.label,V==null?void 0:V.className),children:s}):null,p]})]})});de&&(de.muiName="StepLabel");function It(e){return F("MuiStepConnector",e)}O("MuiStepConnector",["root","horizontal","vertical","alternativeLabel","active","completed","disabled","line","lineHorizontal","lineVertical"]);const Rt=e=>{const{classes:r,orientation:o,alternativeLabel:a,active:s,completed:i,disabled:v}=e,c={root:["root",o,a&&"alternativeLabel",s&&"active",i&&"completed",v&&"disabled"],line:["line",`line${D(o)}`]};return H(c,It,r)},At=y("div",{name:"MuiStepConnector",slot:"Root",overridesResolver:(e,r)=>{const{ownerState:o}=e;return[r.root,r[o.orientation],o.alternativeLabel&&r.alternativeLabel,o.completed&&r.completed]}})({flex:"1 1 auto",variants:[{props:{orientation:"vertical"},style:{marginLeft:12}},{props:{alternativeLabel:!0},style:{position:"absolute",top:12,left:"calc(-50% + 20px)",right:"calc(50% + 20px)"}}]}),kt=y("span",{name:"MuiStepConnector",slot:"Line",overridesResolver:(e,r)=>{const{ownerState:o}=e;return[r.line,r[`line${D(o.orientation)}`]]}})(B(({theme:e})=>{const r=e.palette.mode==="light"?e.palette.grey[400]:e.palette.grey[600];return{display:"block",borderColor:e.vars?e.vars.palette.StepConnector.border:r,variants:[{props:{orientation:"horizontal"},style:{borderTopStyle:"solid",borderTopWidth:1}},{props:{orientation:"vertical"},style:{borderLeftStyle:"solid",borderLeftWidth:1,minHeight:24}}]}})),$t=x.forwardRef(function(r,o){const a=E({props:r,name:"MuiStepConnector"}),{className:s,...i}=a,{alternativeLabel:v,orientation:c="horizontal"}=x.useContext(oe),{active:f,disabled:p,completed:u}=x.useContext(ue),d={...a,alternativeLabel:v,orientation:c,active:f,completed:u,disabled:p},h=Rt(d);return t.jsx(At,{className:q(h.root,s),ref:o,ownerState:d,...i,children:t.jsx(kt,{className:h.line,ownerState:d})})});function zt(e){return F("MuiStepper",e)}O("MuiStepper",["root","horizontal","vertical","nonLinear","alternativeLabel"]);const Tt=e=>{const{orientation:r,nonLinear:o,alternativeLabel:a,classes:s}=e;return H({root:["root",r,o&&"nonLinear",a&&"alternativeLabel"]},zt,s)},Dt=y("div",{name:"MuiStepper",slot:"Root",overridesResolver:(e,r)=>{const{ownerState:o}=e;return[r.root,r[o.orientation],o.alternativeLabel&&r.alternativeLabel,o.nonLinear&&r.nonLinear]}})({display:"flex",variants:[{props:{orientation:"horizontal"},style:{flexDirection:"row",alignItems:"center"}},{props:{orientation:"vertical"},style:{flexDirection:"column"}},{props:{alternativeLabel:!0},style:{alignItems:"flex-start"}}]}),qt=t.jsx($t,{}),_t=x.forwardRef(function(r,o){const a=E({props:r,name:"MuiStepper"}),{activeStep:s=0,alternativeLabel:i=!1,children:v,className:c,component:f="div",connector:p=qt,nonLinear:u=!1,orientation:d="horizontal",...h}=a,b={...a,nonLinear:u,alternativeLabel:i,orientation:d,component:f},m=Tt(b),g=x.Children.toArray(v).filter(Boolean),w=g.map((R,A)=>x.cloneElement(R,{index:A,last:A+1===g.length,...R.props})),I=x.useMemo(()=>({activeStep:s,alternativeLabel:i,connector:p,nonLinear:u,orientation:d}),[s,i,p,u,d]);return t.jsx(oe.Provider,{value:I,children:t.jsx(Dt,{as:f,ownerState:b,className:q(m.root,c),ref:o,...h,children:w})})}),Nt=W(t.jsx("path",{d:"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"}),"ArrowBackOutlined"),Ut=W(t.jsx("path",{d:"M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3zm-1-4-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5z"}),"FileDownloadOutlined"),Ft=()=>t.jsxs(Q,{children:[t.jsx(G,{variant:"rectangular",width:40,height:40,sx:{mb:2}}),t.jsx(G,{variant:"rectangular",height:60,sx:{mb:4}}),t.jsx(G,{variant:"text",sx:{fontSize:"2rem",mb:2}}),t.jsxs($,{container:!0,spacing:3,children:[t.jsxs($,{item:!0,xs:12,children:[t.jsx(G,{variant:"text",sx:{fontSize:"1.2rem",mb:1}}),t.jsx(G,{variant:"text",sx:{fontSize:"1.2rem",mb:2}})]}),t.jsx($,{item:!0,xs:12,children:t.jsx(G,{variant:"rectangular",height:300})})]})]}),le=[{label:"Pending",value:"pending"},{label:"Partially Received",value:"partially_received"},{label:"Completed",value:"completed"}],Qt=()=>{var ee,me;const{id:e}=we(),r=Ie(),[o,a]=x.useState({items:[],invoice:"",attachment:""}),[s,i]=x.useState({}),[v,c]=x.useState(0),[f,p]=x.useState(!1),[u,d]=x.useState(""),[h,b]=x.useState(!1),{data:m,isLoading:g,refetch:w}=Re(e),I=Ae(),R=ke();x.useEffect(()=>{if(m){a({...m,items:m.items.map(l=>({...l,received_quantity:l.received_quantity||0}))});const n=le.findIndex(l=>l.value===m.status);c(n)}},[m]);const A=n=>{n.preventDefault();const l=document.createElement("a");l.href=qe(o.attachment),l.download=o.attachment.split("/").pop(),l.target="_blank",document.body.appendChild(l),l.click(),document.body.removeChild(l)},C=()=>{let n="";o.status==="pending"?n="partially_received":o.status==="partially_received"&&(n="completed"),d(n),p(!0)},j=async()=>{var _,k;i({});let n=!1;const l={};if(u==="completed"&&(o.invoice||(l.invoice="Invoice is required",n=!0),o.attachment||(l.attachment="Attachment is required",n=!0),o.items.forEach((S,ae)=>{!S.received_quantity||S.received_quantity<=0?(l[`items.${ae}.received_quantity`]="Received quantity is required",n=!0):S.received_quantity>S.requested_quantity&&(l[`items.${ae}.received_quantity`]="Cannot exceed requested quantity",n=!0),(!S.retail_price||S.retail_price<=0)&&(l[`items.${ae}.retail_price`]="Retail price is required",n=!0)}),n)){i(l),p(!1);return}try{b(!0),await I.mutateAsync({id:e,data:{...o,status:u}}),o.attachment instanceof File&&await R.mutateAsync({id:e,file:o.attachment}),p(!1),fe.success("Purchase Order updated successfully"),w()}catch(S){(k=(_=S.response)==null?void 0:_.data)!=null&&k.errors&&(i(S.response.data.errors),fe.error("Something went wrong please try again")),b(!1),p(!1)}finally{b(!1)}},z=(n,l,_)=>{const k=[...o.items];k[n]={...k[n],[l]:_},a(S=>({...S,items:k}))},M=o.status==="pending",P=o.status==="partially_received",L=o.status==="completed",Z=()=>M?"Mark as Partially Received":P?"Mark as Completed":"",V=()=>u==="partially_received"?"Are you sure you want to mark this Purchase Order as partially received? This will allow you to start recording received quantities.":u==="completed"?"Are you sure you want to mark this Purchase Order as completed? This action cannot be undone.":"",Y=n=>{switch(n){case"pending":return"warning";case"partially_received":return"info";case"completed":return"success";default:return"default"}};return g?t.jsx(Ft,{}):t.jsxs(_e,{maxWidth:"lg",sx:{mt:0,mb:4},children:[t.jsxs(Q,{sx:{mb:4},children:[t.jsx(Se,{onClick:()=>r("/app/purchase"),sx:{mb:2},color:"primary",children:t.jsx(Nt,{})}),t.jsx(_t,{activeStep:v,sx:{mb:4},children:le.map(n=>t.jsx(vt,{children:t.jsx(de,{children:n.label})},n.value))}),t.jsx(J,{elevation:0,sx:{p:0,mb:0},children:t.jsxs($,{container:!0,spacing:2,alignItems:"center",children:[t.jsx($,{item:!0,xs:12,md:8,children:t.jsxs(X,{variant:"h5",sx:{mb:1},children:["Purchase Order: ",m==null?void 0:m.po_number]})}),t.jsx($,{item:!0,xs:12,md:4,children:t.jsx(Q,{sx:{display:"flex",justifyContent:"flex-end"},children:t.jsxs(Ye,{severity:Y(o.status),sx:{mb:2},children:["Current Status:"," ",(ee=le.find(n=>n.value===o.status))==null?void 0:ee.label]})})})]})}),t.jsx(J,{elevation:0,sx:{p:0,mb:3},children:t.jsxs($,{container:!0,spacing:3,children:[t.jsx($,{item:!0,xs:12,md:6,children:t.jsxs(X,{variant:"subtitle1",sx:{mb:2},children:["Supplier: ",(me=m==null?void 0:m.supplier)==null?void 0:me.supplier_name]})}),t.jsx($,{item:!0,xs:12,md:6,sx:{display:"flex",justifyContent:"flex-end"},children:t.jsxs(X,{variant:"subtitle1",children:["PO Date: ",new Date(m==null?void 0:m.po_date).toLocaleDateString()]})})]})}),(P||L)&&t.jsx(J,{elevation:0,sx:{p:0,mb:3},children:t.jsxs($,{container:!0,spacing:3,children:[t.jsx($,{item:!0,xs:12,md:6,children:t.jsx(K,{fullWidth:!0,label:"Invoice Number",name:"invoice",value:o.invoice,onChange:n=>a(l=>({...l,invoice:n.target.value})),error:!!s.invoice,helperText:s.invoice,required:!0,disabled:L,sx:{mb:2}})}),t.jsx($,{item:!0,xs:12,md:6,children:o.attachment&&typeof o.attachment=="string"?t.jsxs(Q,{sx:{display:"flex",alignItems:"center",gap:2},children:[t.jsx(X,{children:"Current Attachment:"}),t.jsxs(Be,{href:"#",sx:{display:"flex",alignItems:"center",gap:1},onClick:A,children:[t.jsx(Ut,{})," Download Attachment"]})]}):t.jsx(K,{fullWidth:!0,type:"file",label:"Attachment",name:"attachment",InputLabelProps:{shrink:!0},inputProps:{accept:".pdf,.doc,.docx,.png,.jpg,.jpeg"},onChange:n=>{const l=n.target.files[0];if(l){if(!["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","image/png","image/jpeg"].includes(l.type)){i(S=>({...S,attachment:"File must be PDF, DOC, DOCX, PNG, or JPG format"})),n.target.value="";return}const k=5*1024*1024;if(l.size>k){i(S=>({...S,attachment:"File size must be less than 5MB"})),n.target.value="";return}a(S=>({...S,attachment:l}))}},error:!!s.attachment,helperText:s.attachment,disabled:L,required:!0})})]})}),t.jsxs(J,{elevation:0,sx:{p:0},children:[t.jsx(Ne,{children:t.jsxs(Ue,{children:[t.jsx(Fe,{children:t.jsxs(he,{children:[t.jsx(T,{children:"Product"}),t.jsx(T,{children:"Requested Quantity"}),(P||L)&&t.jsxs(t.Fragment,{children:[t.jsx(T,{children:"Received Quantity"}),t.jsx(T,{children:"Retail Price"})]}),t.jsx(T,{children:"Price"}),t.jsx(T,{children:"Total"})]})}),t.jsx(Oe,{children:o.items.map((n,l)=>{var _;return t.jsxs(he,{children:[t.jsx(T,{sx:{verticalAlign:"top"},children:(_=n.product)==null?void 0:_.product_name}),t.jsx(T,{sx:{verticalAlign:"top"},children:t.jsx(K,{sx:{width:215},type:"number",value:n.requested_quantity,onChange:k=>z(l,"requested_quantity",k.target.value),disabled:!M,size:"small",inputProps:{min:1}})}),(P||L)&&t.jsxs(t.Fragment,{children:[t.jsx(T,{sx:{verticalAlign:"top"},children:t.jsx(K,{sx:{width:215},type:"number",value:n.received_quantity,onChange:k=>z(l,"received_quantity",k.target.value),disabled:L,size:"small",required:!0,error:!!s[`items.${l}.received_quantity`],helperText:s[`items.${l}.received_quantity`],inputProps:{min:0,max:n.requested_quantity}})}),t.jsx(T,{sx:{verticalAlign:"top"},children:t.jsx(K,{sx:{width:215},type:"number",value:n.retail_price,onChange:k=>z(l,"retail_price",k.target.value),error:!!s[`items.${l}.retail_price`],disabled:L,size:"small",required:!0,helperText:s[`items.${l}.retail_price`],inputProps:{min:0,step:.01}})})]}),t.jsxs(T,{sx:{verticalAlign:"top"},children:["₱",n.price]}),t.jsxs(T,{sx:{verticalAlign:"top"},children:["₱",(n.price*(P||L?n.received_quantity||0:n.requested_quantity)).toFixed(2)]})]},l)})})]})}),t.jsx($,{item:!0,xs:12,md:4,children:t.jsx(Q,{sx:{display:"flex",mt:4,justifyContent:"flex-end"},children:(M||P)&&t.jsx(se,{variant:"contained",onClick:C,disabled:I.isPending,color:"primary",sx:{minWidth:200},children:Z()})})})]})]}),t.jsxs($e,{open:f,onClose:()=>p(!1),PaperProps:{sx:{borderRadius:2,minWidth:"500px",padding:2,boxShadow:"0 8px 32px rgba(0, 0, 0, 0.1)"}},children:[t.jsx(ze,{sx:{fontSize:"1.5rem",fontWeight:600,color:"#333",pb:1},children:"Confirm Status Update"}),t.jsx(Te,{sx:{pt:2},children:t.jsx(dt,{sx:{fontSize:"1.1rem",color:"#555",lineHeight:1.5},children:V()})}),t.jsxs(De,{sx:{padding:3,paddingTop:2,gap:2},children:[t.jsx(se,{onClick:()=>p(!1),sx:{fontSize:"1rem",minWidth:"100px",textTransform:"none"},children:"Cancel"}),t.jsx(se,{onClick:j,variant:"contained",color:"primary",disabled:h,sx:{fontSize:"1rem",minWidth:"100px",textTransform:"none",boxShadow:2},children:h?t.jsxs(Q,{sx:{display:"flex",alignItems:"center",gap:1},children:[t.jsx(it,{size:20,color:"inherit"}),t.jsx("span",{children:"Updating..."})]}):"Confirm"})]})]})]})};export{Qt as default};

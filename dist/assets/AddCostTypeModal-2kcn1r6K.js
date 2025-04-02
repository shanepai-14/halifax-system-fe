import{g as j,a as T,s as g,b as p,m,h as k,i as z,a2 as D,a3 as B,r as R,u as A,j as e,d as M,e as _,a4 as F}from"./index-CrSDUfpv.js";import{c as N,a as v,i as y,F as I,b as L,d as b}from"./index.esm-Dtg9eWO-.js";import{D as O}from"./Dialog-Ov5HwEb9.js";import{D as W,a as q}from"./DialogTitle-Cw6pjI73.js";import{T as x}from"./TextField-BZsMM0g7.js";import{S as E,F as f}from"./FormControlLabel-CFAYVsq5.js";import{D as U}from"./DialogActions-DYSyT2-7.js";import{B as $}from"./InputLabel-CrBhOIEx.js";function P(a){return T("MuiSwitch",a)}const o=j("MuiSwitch",["root","edgeStart","edgeEnd","switchBase","colorPrimary","colorSecondary","sizeSmall","sizeMedium","checked","disabled","input","thumb","track"]),X=a=>{const{classes:t,edge:s,size:i,color:r,checked:n,disabled:c}=a,d={root:["root",s&&`edge${p(s)}`,`size${p(i)}`],switchBase:["switchBase",`color${p(r)}`,n&&"checked",c&&"disabled"],thumb:["thumb"],track:["track"],input:["input"]},l=_(d,P,t);return{...t,...l}},V=g("span",{name:"MuiSwitch",slot:"Root",overridesResolver:(a,t)=>{const{ownerState:s}=a;return[t.root,s.edge&&t[`edge${p(s.edge)}`],t[`size${p(s.size)}`]]}})({display:"inline-flex",width:34+12*2,height:14+12*2,overflow:"hidden",padding:12,boxSizing:"border-box",position:"relative",flexShrink:0,zIndex:0,verticalAlign:"middle","@media print":{colorAdjust:"exact"},variants:[{props:{edge:"start"},style:{marginLeft:-8}},{props:{edge:"end"},style:{marginRight:-8}},{props:{size:"small"},style:{width:40,height:24,padding:7,[`& .${o.thumb}`]:{width:16,height:16},[`& .${o.switchBase}`]:{padding:4,[`&.${o.checked}`]:{transform:"translateX(16px)"}}}}]}),G=g(E,{name:"MuiSwitch",slot:"SwitchBase",overridesResolver:(a,t)=>{const{ownerState:s}=a;return[t.switchBase,{[`& .${o.input}`]:t.input},s.color!=="default"&&t[`color${p(s.color)}`]]}})(m(({theme:a})=>({position:"absolute",top:0,left:0,zIndex:1,color:a.vars?a.vars.palette.Switch.defaultColor:`${a.palette.mode==="light"?a.palette.common.white:a.palette.grey[300]}`,transition:a.transitions.create(["left","transform"],{duration:a.transitions.duration.shortest}),[`&.${o.checked}`]:{transform:"translateX(20px)"},[`&.${o.disabled}`]:{color:a.vars?a.vars.palette.Switch.defaultDisabledColor:`${a.palette.mode==="light"?a.palette.grey[100]:a.palette.grey[600]}`},[`&.${o.checked} + .${o.track}`]:{opacity:.5},[`&.${o.disabled} + .${o.track}`]:{opacity:a.vars?a.vars.opacity.switchTrackDisabled:`${a.palette.mode==="light"?.12:.2}`},[`& .${o.input}`]:{left:"-100%",width:"300%"}})),m(({theme:a})=>({"&:hover":{backgroundColor:a.vars?`rgba(${a.vars.palette.action.activeChannel} / ${a.vars.palette.action.hoverOpacity})`:k(a.palette.action.active,a.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}},variants:[...Object.entries(a.palette).filter(z(["light"])).map(([t])=>({props:{color:t},style:{[`&.${o.checked}`]:{color:(a.vars||a).palette[t].main,"&:hover":{backgroundColor:a.vars?`rgba(${a.vars.palette[t].mainChannel} / ${a.vars.palette.action.hoverOpacity})`:k(a.palette[t].main,a.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${o.disabled}`]:{color:a.vars?a.vars.palette.Switch[`${t}DisabledColor`]:`${a.palette.mode==="light"?D(a.palette[t].main,.62):B(a.palette[t].main,.55)}`}},[`&.${o.checked} + .${o.track}`]:{backgroundColor:(a.vars||a).palette[t].main}}}))]}))),H=g("span",{name:"MuiSwitch",slot:"Track",overridesResolver:(a,t)=>t.track})(m(({theme:a})=>({height:"100%",width:"100%",borderRadius:14/2,zIndex:-1,transition:a.transitions.create(["opacity","background-color"],{duration:a.transitions.duration.shortest}),backgroundColor:a.vars?a.vars.palette.common.onBackground:`${a.palette.mode==="light"?a.palette.common.black:a.palette.common.white}`,opacity:a.vars?a.vars.opacity.switchTrack:`${a.palette.mode==="light"?.38:.3}`}))),J=g("span",{name:"MuiSwitch",slot:"Thumb",overridesResolver:(a,t)=>t.thumb})(m(({theme:a})=>({boxShadow:(a.vars||a).shadows[1],backgroundColor:"currentColor",width:20,height:20,borderRadius:"50%"}))),S=R.forwardRef(function(t,s){const i=A({props:t,name:"MuiSwitch"}),{className:r,color:n="primary",edge:c=!1,size:d="medium",sx:l,...C}=i,u={...i,color:n,edge:c,size:d},h=X(u),w=e.jsx(J,{className:h.thumb,ownerState:u});return e.jsxs(V,{className:M(h.root,r),sx:l,ownerState:u,children:[e.jsx(G,{type:"checkbox",icon:w,checkedIcon:w,ref:s,ownerState:u,...C,classes:{...h,root:h.switchBase}}),e.jsx(H,{className:h.track,ownerState:u})]})}),K=N().shape({name:v().required("Name is required").min(2,"Too Short!").max(100,"Too Long!"),code:v().required("Code is required").max(50,"Too Long!"),description:v().nullable().max(255,"Too Long!"),is_active:y(),is_deduction:y()}),ia=({open:a,handleClose:t})=>{const s=F();return e.jsxs(O,{open:a,onClose:t,maxWidth:"sm",fullWidth:!0,children:[e.jsx(W,{children:"Add Cost Type"}),e.jsx(I,{initialValues:{name:"",code:"",description:"",is_active:!0,is_deduction:!1},validationSchema:K,onSubmit:async(i,{setSubmitting:r,resetForm:n})=>{try{await s.mutateAsync(i),n(),t()}catch(c){console.error("Error creating cost type:",c)}finally{r(!1)}},children:({errors:i,touched:r,isSubmitting:n,setFieldValue:c,values:d})=>e.jsxs(L,{children:[e.jsxs(q,{children:[e.jsx(b,{as:x,name:"name",label:"Name",fullWidth:!0,margin:"normal",error:r.name&&i.name,helperText:r.name&&i.name}),e.jsx(b,{as:x,name:"code",label:"Code",fullWidth:!0,margin:"normal",error:r.code&&i.code,helperText:r.code&&i.code}),e.jsx(b,{as:x,name:"description",label:"Description",fullWidth:!0,margin:"normal",multiline:!0,rows:3,error:r.description&&i.description,helperText:r.description&&i.description}),e.jsx(f,{control:e.jsx(S,{checked:d.is_active,onChange:l=>c("is_active",l.target.checked),color:"primary"}),label:"Active",sx:{mt:2}}),e.jsx(f,{control:e.jsx(S,{checked:d.is_deduction,onChange:l=>c("is_deduction",l.target.checked),color:"primary"}),label:"Is Deduction",sx:{mt:1}})]}),e.jsxs(U,{children:[e.jsx($,{onClick:t,children:"Cancel"}),e.jsx($,{type:"submit",disabled:n,variant:"contained",color:"primary",children:n?"Adding...":"Add Cost Type"})]})]})})]})};export{ia as A,S};

import{r as l,q as S,_ as w,j as e,h as B,o as m,T as V,G as d,n as b,p as k,P as F,I as y}from"./index-C1FoJucT.js";import{T as p,u as W,C as Q,b as D,a as N,c as G,d as K,e as U,f as A,g as a,h as J,R as X,i as Y}from"./SearchOutlined-BYroEoPk.js";import{B as j,u as P,a as g}from"./axios-DN3VifbS.js";var Z={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"defs",attrs:{},children:[{tag:"style",attrs:{}}]},{tag:"path",attrs:{d:"M899.1 869.6l-53-305.6H864c14.4 0 26-11.6 26-26V346c0-14.4-11.6-26-26-26H618V138c0-14.4-11.6-26-26-26H432c-14.4 0-26 11.6-26 26v182H160c-14.4 0-26 11.6-26 26v192c0 14.4 11.6 26 26 26h17.9l-53 305.6a25.95 25.95 0 0025.6 30.4h723c1.5 0 3-.1 4.4-.4a25.88 25.88 0 0021.2-30zM204 390h272V182h72v208h272v104H204V390zm468 440V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H416V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H202.8l45.1-260H776l45.1 260H672z"}}]},name:"clear",theme:"outlined"},ee=function(n,s){return l.createElement(S,w({},n,{ref:s,icon:Z}))},te=l.forwardRef(ee),ne={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"}}]},name:"edit",theme:"outlined"},se=function(n,s){return l.createElement(S,w({},n,{ref:s,icon:ne}))},re=l.forwardRef(se),ae={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"}}]},name:"eye",theme:"outlined"},le=function(n,s){return l.createElement(S,w({},n,{ref:s,icon:ae}))},ie=l.forwardRef(le);const oe={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:600,bgcolor:"background.paper",boxShadow:24,p:4},ce=({open:r,handleClose:n,handleAddSupplier:s})=>{const[i,c]=l.useState({supplier_name:"",contact_person:"",email:"",phone:"",address:""}),o=u=>{const{name:v,value:C}=u.target;c(x=>({...x,[v]:C}))},f=u=>{u.preventDefault(),s(i),n(),c({supplier_name:"",contact_person:"",email:"",phone:"",address:""})};return e.jsx(B,{open:r,onClose:n,"aria-labelledby":"add-supplier-modal-title",children:e.jsxs(m,{sx:oe,children:[e.jsx(V,{id:"add-supplier-modal-title",variant:"h6",component:"h2",gutterBottom:!0,children:"Add New Supplier"}),e.jsx("form",{onSubmit:f,children:e.jsxs(d,{container:!0,spacing:2,children:[e.jsx(d,{item:!0,xs:12,children:e.jsx(p,{fullWidth:!0,label:"Supplier Name",name:"supplier_name",value:i.supplier_name,onChange:o,required:!0})}),e.jsx(d,{item:!0,xs:12,children:e.jsx(p,{fullWidth:!0,label:"Contact Person",name:"contact_person",value:i.contact_person,onChange:o,required:!0})}),e.jsx(d,{item:!0,xs:12,children:e.jsx(p,{fullWidth:!0,label:"Email",name:"email",type:"email",value:i.email,onChange:o,required:!0})}),e.jsx(d,{item:!0,xs:12,children:e.jsx(p,{fullWidth:!0,label:"Phone",name:"phone",value:i.phone,onChange:o,required:!0})}),e.jsx(d,{item:!0,xs:12,children:e.jsx(p,{fullWidth:!0,label:"Address",name:"address",value:i.address,onChange:o,required:!0,multiline:!0,rows:3})}),e.jsx(d,{item:!0,xs:12,children:e.jsxs(m,{sx:{display:"flex",justifyContent:"flex-end",gap:2,mt:2},children:[e.jsx(j,{onClick:n,variant:"outlined",children:"Cancel"}),e.jsx(j,{type:"submit",variant:"contained",color:"primary",children:"Add Supplier"})]})})]})})]})})},de=()=>W({queryKey:["suppliers"],queryFn:async()=>(await g.get("/suppliers")).data.data}),ue=()=>{const r=b();return P({mutationFn:async n=>(await g.post("/suppliers",n)).data,onSuccess:()=>{r.invalidateQueries(["suppliers"])}})},pe=()=>{const r=b();return P({mutationFn:async({id:n,data:s})=>(await g.put(`/suppliers/${n}`,s)).data,onSuccess:()=>{r.invalidateQueries(["suppliers"])}})},he=()=>{const r=b();return P({mutationFn:async n=>(await g.delete(`/suppliers/${n}`)).data,onSuccess:()=>{r.invalidateQueries(["suppliers"])}})},ge=()=>{const[r,n]=l.useState(0),[s,i]=l.useState(10),[c,o]=l.useState(""),[f,u]=l.useState(!1),{data:v,isLoading:C,error:x}=de(),M=ue();pe();const R=he(),E=v.filter(t=>t.supplier_name.toLowerCase().includes(c.toLowerCase())||t.contact_person.toLowerCase().includes(c.toLowerCase())||t.email.toLowerCase().includes(c.toLowerCase())),z=(t,h)=>{n(h)},I=t=>{i(parseInt(t.target.value,10)),n(0)},T=async t=>{try{await R.mutateAsync(t)}catch(h){console.error("Error deleting supplier:",h)}},H=t=>{console.log("Edit supplier",t)},L=t=>{console.log("View supplier",t)},O=()=>{u(!0)},_=()=>{u(!1)},q=async t=>{try{await M.mutateAsync(t),_()}catch(h){console.error("Error creating supplier:",h)}},$=()=>{o("")};return C?e.jsx("div",{children:"Loading..."}):x?e.jsxs("div",{children:["Error: ",x.message]}):e.jsxs(Q,{maxWidth:"xxl",sx:{mt:0,px:"0!important"},children:[e.jsxs(m,{sx:{display:"flex",justifyContent:"space-between",alignItems:"center",mb:2},children:[e.jsx(p,{placeholder:"Search suppliers...",variant:"outlined",size:"small",value:c,onChange:t=>o(t.target.value),InputProps:{startAdornment:e.jsx(k,{position:"start",children:e.jsx(D,{})})}}),e.jsxs(m,{children:[e.jsx(j,{variant:"text",color:"error",sx:{mr:1},onClick:$,children:e.jsx(te,{})}),e.jsx(j,{variant:"contained",color:"error",startIcon:e.jsx(N,{}),onClick:O,children:"Add Supplier"})]})]}),e.jsx(G,{component:F,children:e.jsxs(K,{children:[e.jsx(U,{children:e.jsxs(A,{children:[e.jsx(a,{children:"Name"}),e.jsx(a,{children:"Contact Person"}),e.jsx(a,{children:"Email"}),e.jsx(a,{children:"Phone"}),e.jsx(a,{children:"Address"}),e.jsx(a,{align:"right",children:"Actions"})]})}),e.jsx(J,{children:E.slice(r*s,r*s+s).map(t=>e.jsxs(A,{children:[e.jsx(a,{children:t.supplier_name}),e.jsx(a,{children:t.contact_person}),e.jsx(a,{children:t.email}),e.jsx(a,{children:t.phone}),e.jsx(a,{children:t.address}),e.jsxs(a,{align:"right",children:[e.jsx(y,{onClick:()=>L(t.supplier_id),children:e.jsx(ie,{style:{fontSize:20}})}),e.jsx(y,{onClick:()=>H(t.supplier_id),children:e.jsx(re,{style:{fontSize:20}})}),e.jsx(y,{onClick:()=>T(t.supplier_id),children:e.jsx(X,{style:{fontSize:20}})})]})]},t.supplier_id))})]})}),e.jsx(Y,{rowsPerPageOptions:[5,10,25],component:"div",count:E.length,rowsPerPage:s,page:r,onPageChange:z,onRowsPerPageChange:I}),e.jsx(ce,{open:f,handleClose:_,handleAddSupplier:q})]})};export{ge as default};

import{Q as D,r,S as N,U as H,j as e,q as o,E as q,P as Q,T as U,y as G,I as b,H as J}from"./index-B4lmkI_6.js";import{u as K}from"./usePurchaseOrders-CStRGpMd.js";import{P as V}from"./PrintablePO-Dm5F97vg.js";import{l as X,P as Y}from"./Print-BfieSgVG.js";import{C as Z,T as p,c as ee,d as se,e as te,a as m,b as t,f as ae}from"./TextField-CUtW5_1o.js";import{R as re,M as l}from"./SearchOutlined-BYiwTQ9_.js";import{B as y}from"./InputLabel-DSTZXsCg.js";import{R as ne}from"./ClearOutlined-DWlcCpxG.js";import{R as le}from"./PlusOutlined-BnjNWR0G.js";import{f as ie}from"./format-BzRktsyD.js";import{R as oe}from"./EyeOutlined-pR4EkLyD.js";import{T as ce}from"./TablePagination-ay1VwrKN.js";import{S as n}from"./Skeleton-D0Q0LIOq.js";const de={pending:"warning",partially_received:"info",completed:"success",cancelled:"error"},ue=()=>e.jsxs(m,{children:[e.jsx(t,{children:e.jsx(n,{animation:"wave"})}),e.jsx(t,{children:e.jsx(n,{animation:"wave"})}),e.jsx(t,{children:e.jsx(n,{animation:"wave"})}),e.jsx(t,{children:e.jsx(n,{animation:"wave"})}),e.jsx(t,{children:e.jsx(n,{animation:"wave"})}),e.jsx(t,{children:e.jsx(n,{animation:"wave",width:80})}),e.jsx(t,{align:"right",children:e.jsxs(o,{sx:{display:"flex",justifyContent:"flex-end",gap:1},children:[e.jsx(n,{animation:"wave",variant:"circular",width:32,height:32}),e.jsx(n,{animation:"wave",variant:"circular",width:32,height:32})]})})]}),ye=()=>{const c=D(),[d,j]=r.useState(0),[i,R]=r.useState(10),[u,g]=r.useState(""),[h,S]=r.useState("All Suppliers"),[T,_]=r.useState({}),[A,I]=r.useState(null),[x,f]=r.useState("All Status"),P=r.useRef(),O=N(H),{data:k=[],isLoading:L}=K(T),z=X.useReactToPrint({contentRef:P}),B=["All Suppliers",...new Set(O.map(s=>s==null?void 0:s.supplier_name))].filter(Boolean),v=k.filter(s=>{var C,w;const a=s.po_number.toLowerCase().includes(u.toLowerCase())||((C=s.supplier)==null?void 0:C.supplier_name.toLowerCase().includes(u.toLowerCase())),E=h==="All Suppliers"||((w=s.supplier)==null?void 0:w.supplier_name)===h,W=x==="All Status"||s.status===x.toLowerCase().replace(" ","_");return a&&E&&W}),F=(s,a)=>{j(a)},M=s=>{R(parseInt(s.target.value,10)),j(0)},$=()=>{g(""),S("All Suppliers"),f("All Status"),_({})};return e.jsxs(Z,{maxWidth:"xxl",sx:{mt:0,px:"0!important"},children:[e.jsxs(o,{sx:{display:"flex",justifyContent:"space-between",alignItems:"center",mb:2,gap:2},children:[e.jsxs(o,{sx:{display:"flex",gap:2,flex:1},children:[e.jsx(p,{placeholder:"Search PO number",variant:"outlined",size:"small",value:u,onChange:s=>g(s.target.value),InputProps:{startAdornment:e.jsx(q,{position:"start",children:e.jsx(re,{})})},sx:{minWidth:200}}),e.jsx(p,{select:!0,size:"small",value:h,onChange:s=>S(s.target.value),label:"Filter by Supplier",sx:{minWidth:200},children:B.map(s=>e.jsx(l,{value:s,children:s},s))}),e.jsxs(p,{select:!0,size:"small",value:x,onChange:s=>f(s.target.value),label:"Filter by Status",sx:{minWidth:200},children:[e.jsx(l,{value:"All Status",children:"All Status"}),e.jsx(l,{value:"Pending",children:"Pending"}),e.jsx(l,{value:"Partially Received",children:"Partially Received"}),e.jsx(l,{value:"Completed",children:"Completed"}),e.jsx(l,{value:"Cancelled",children:"Cancelled"})]})]}),e.jsxs(o,{children:[e.jsx(y,{variant:"text",color:"error",sx:{mr:1},onClick:$,children:e.jsx(ne,{})}),e.jsx(y,{variant:"contained",color:"error",startIcon:e.jsx(le,{}),onClick:()=>c("/app/purchase/create"),children:"Create PO"})]})]}),e.jsx(ee,{component:Q,children:e.jsxs(se,{children:[e.jsx(te,{children:e.jsxs(m,{children:[e.jsx(t,{children:"PO Number"}),e.jsx(t,{children:"Date"}),e.jsx(t,{children:"Supplier"}),e.jsx(t,{children:"Total Amount"}),e.jsx(t,{children:"Status"}),e.jsx(t,{align:"right",children:"Actions"})]})}),e.jsx(ae,{children:L?[...Array(i)].map((s,a)=>e.jsx(ue,{},a)):v.slice(d*i,d*i+i).map(s=>{var a;return e.jsxs(m,{children:[e.jsx(t,{onClick:()=>c(`${s.po_number}/edit`),color:"primary",children:e.jsx(U,{color:"primary",children:s.po_number})}),e.jsx(t,{children:ie(new Date(s.po_date),"MMM dd, yyyy")}),e.jsx(t,{children:(a=s.supplier)==null?void 0:a.supplier_name}),e.jsxs(t,{children:["₱",Number(s.total_amount).toLocaleString()]}),e.jsx(t,{children:e.jsx(G,{label:s.status.replace("_"," "),color:de[s.status],size:"small"})}),e.jsxs(t,{align:"right",children:[e.jsx(b,{onClick:()=>c(`${s.po_number}/edit`),children:e.jsx(oe,{style:{fontSize:20}})}),e.jsx(J,{title:"Print Purchase Order",children:e.jsx(b,{onClick:()=>{I(s),setTimeout(z,100)},children:e.jsx(Y,{style:{fontSize:20}})})})]})]},s.po_id)})})]})}),e.jsx(ce,{rowsPerPageOptions:[5,10,25],component:"div",count:v.length,rowsPerPage:i,page:d,onPageChange:F,onRowsPerPageChange:M}),e.jsx(V,{purchaseOrder:A,contentRef:P})]})};export{ye as default};

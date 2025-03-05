import{Q as L,r as n,S as $,U as H,j as e,q as u,E as q,P as p,T as i,y as Q,H as w,I as C}from"./index-B4lmkI_6.js";import{b as V,c as G,d as J,E as K,P as X}from"./PrintableRR-CfquGk5C.js";import{l as Y,P as Z}from"./Print-BfieSgVG.js";import{R as ee}from"./Receipt-DuKTlNWh.js";import{C as ae,T as g,c as se,d as ie,e as te,a as m,b as s,f as ne}from"./TextField-CUtW5_1o.js";import{R as re,M as h}from"./SearchOutlined-BYiwTQ9_.js";import{B as T}from"./InputLabel-DSTZXsCg.js";import{R as le}from"./ClearOutlined-DWlcCpxG.js";import{T as ce}from"./TablePagination-ay1VwrKN.js";import{S as o}from"./Skeleton-D0Q0LIOq.js";import{f as oe}from"./format-BzRktsyD.js";const de=()=>e.jsxs(m,{children:[e.jsx(s,{children:e.jsx(o,{animation:"wave"})}),e.jsx(s,{children:e.jsx(o,{animation:"wave"})}),e.jsx(s,{children:e.jsx(o,{animation:"wave"})}),e.jsx(s,{children:e.jsx(o,{animation:"wave"})}),e.jsx(s,{align:"right",children:e.jsxs(u,{sx:{display:"flex",justifyContent:"flex-end",gap:1},children:[e.jsx(o,{animation:"wave",variant:"circular",width:32,height:32}),e.jsx(o,{animation:"wave",variant:"circular",width:32,height:32}),e.jsx(o,{animation:"wave",variant:"circular",width:32,height:32})]})})]}),xe=({stats:t})=>t?e.jsxs(u,{sx:{display:"flex",flexWrap:"wrap",gap:2,mb:3},children:[e.jsxs(p,{elevation:1,sx:{p:2,minWidth:"200px",flex:1},children:[e.jsx(i,{variant:"h6",sx:{mb:1},children:"Total Reports"}),e.jsx(i,{variant:"h4",children:t.total_reports})]}),e.jsxs(p,{elevation:1,sx:{p:2,minWidth:"200px",flex:1},children:[e.jsx(i,{variant:"h6",sx:{mb:1},children:"Paid Reports"}),e.jsx(i,{variant:"h4",color:"success.main",children:t.paid_reports})]}),e.jsxs(p,{elevation:1,sx:{p:2,minWidth:"200px",flex:1},children:[e.jsx(i,{variant:"h6",sx:{mb:1},children:"Unpaid Reports"}),e.jsx(i,{variant:"h4",color:"error.main",children:t.unpaid_reports})]}),e.jsxs(p,{elevation:1,sx:{p:2,minWidth:"250px",flex:1},children:[e.jsx(i,{variant:"h6",sx:{mb:1},children:"Total Received Value"}),e.jsxs(i,{variant:"h4",children:["₱",Number(t.total_received_value).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})]})]})]}):null,Re=()=>{const t=L(),[f,S]=n.useState(0),[j,A]=n.useState(10),[d,P]=n.useState(""),[x,b]=n.useState("All"),[l,y]=n.useState("All"),[I,R]=n.useState({}),[F,k]=n.useState(null),_=n.useRef(),v=$(H),{data:c,isLoading:W,refetch:D}=V({search:d,supplier_id:x||void 0,is_paid:l==="paid"?!0:l==="unpaid"?!1:"All",per_page:j,page:f+1,...I}),{data:E}=G(),B=J();n.useEffect(()=>{const a={};d&&(a.search=d),x&&(a.supplier_id=x),l&&(a.is_paid=l==="paid"?!0:l==="unpaid"?!1:"All"),R(a)},[d,x,l]);const z=Y.useReactToPrint({contentRef:_}),N=async(a,r)=>{try{await B.mutateAsync({id:a,isPaid:!r}),D()}catch{}},M=(a,r)=>{S(r)},U=a=>{A(parseInt(a.target.value,10)),S(0)},O=()=>{P(""),b("All"),y("All"),R({})};return e.jsxs(ae,{maxWidth:"xxl",sx:{mt:0,px:"0!important"},children:[e.jsx(xe,{stats:E}),e.jsxs(u,{sx:{display:"flex",justifyContent:"space-between",alignItems:"center",mb:2,gap:2},children:[e.jsxs(u,{sx:{display:"flex",gap:2,flex:1},children:[e.jsx(g,{placeholder:"Search by Batch # or PO #",variant:"outlined",size:"small",value:d,onChange:a=>P(a.target.value),InputProps:{startAdornment:e.jsx(q,{position:"start",children:e.jsx(re,{})})},sx:{minWidth:250}}),e.jsxs(g,{select:!0,size:"small",value:x,onChange:a=>b(a.target.value),label:"Filter by Supplier",sx:{minWidth:200},children:[e.jsx(h,{value:"All",children:"All Suppliers"}),v==null?void 0:v.map(a=>e.jsx(h,{value:a.supplier_id,children:a.supplier_name},a.supplier_id))]}),e.jsxs(g,{select:!0,size:"small",value:l,onChange:a=>y(a.target.value),label:"Filter by Status",sx:{minWidth:200},children:[e.jsx(h,{value:"All",children:"All Status"}),e.jsx(h,{value:"paid",children:"Paid"}),e.jsx(h,{value:"unpaid",children:"Unpaid"})]})]}),e.jsxs(u,{children:[e.jsx(T,{variant:"text",color:"error",sx:{mr:1},onClick:O,children:e.jsx(le,{})}),e.jsx(T,{variant:"contained",color:"primary",startIcon:e.jsx(ee,{}),onClick:()=>t("/app/purchase"),children:"Purchase Orders"})]})]}),e.jsx(se,{component:p,children:e.jsxs(ie,{children:[e.jsx(te,{children:e.jsxs(m,{children:[e.jsx(s,{children:"Batch Number"}),e.jsx(s,{children:"PO #"}),e.jsx(s,{children:"Supplier"}),e.jsx(s,{children:"Payment Status"}),e.jsx(s,{children:"Total"}),e.jsx(s,{align:"right",children:"Actions"})]})}),e.jsx(ne,{children:W?[...Array(j)].map((a,r)=>e.jsx(de,{},r)):!(c!=null&&c.data)||c.data.length===0?e.jsx(m,{children:e.jsx(s,{colSpan:6,align:"center",sx:{py:3},children:e.jsx(i,{variant:"body2",color:"text.secondary",children:"No receiving reports found"})})}):c.data.map(a=>{var r;return e.jsxs(m,{children:[e.jsxs(s,{children:[e.jsx(i,{children:a.batch_number}),e.jsx(i,{variant:"caption",color:"text.secondary",children:oe(new Date(a.created_at),"MMM dd, yyyy")})]}),e.jsx(s,{children:e.jsx(i,{color:"primary",sx:{cursor:"pointer"},onClick:()=>t(`/app/purchase/${a.po_number}/edit`),children:a.po_number})}),e.jsx(s,{children:(r=a.supplier)==null?void 0:r.supplier_name}),e.jsxs(s,{children:[e.jsx(Q,{label:a.is_paid?"PAID":"UNPAID",color:a.is_paid?"success":"error",size:"small",onClick:()=>N(a.rr_id,a.is_paid),sx:{cursor:"pointer"}}),a.invoice&&e.jsxs(i,{variant:"caption",display:"block",color:"text.secondary",children:["Invoice: ",a.invoice]})]}),e.jsxs(s,{children:["₱",Number(a.total_amount).toLocaleString(void 0,{minimumFractionDigits:2,maximumFractionDigits:2})]}),e.jsxs(s,{align:"right",children:[e.jsx(w,{title:"Edit Report",children:e.jsx(C,{onClick:()=>t(`/app/purchase/${a.po_number}/edit`,{state:{reportId:a.rr_id}}),children:e.jsx(K,{style:{fontSize:18}})})}),e.jsx(w,{title:"Print Receiving Report",children:e.jsx(C,{onClick:()=>{k(a),setTimeout(z,100)},children:e.jsx(Z,{style:{fontSize:18}})})})]})]},a.rr_id)})})]})}),c&&e.jsx(ce,{rowsPerPageOptions:[5,10,25,50],component:"div",count:c.total||0,rowsPerPage:j,page:f,onPageChange:M,onRowsPerPageChange:U}),e.jsx(X,{receivingReport:F,contentRef:_})]})};export{Re as default};

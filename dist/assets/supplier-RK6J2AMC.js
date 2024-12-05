import{r as n,H as O,J as U,K as Y,L as q,j as e,q as S,A as J,P as K,I as u}from"./index-D1JMdfBH.js";import{S as N}from"./SupplierModal-D9rWnMPN.js";import{S as x}from"./sweetalert2.esm.all-D3pEHXw3.js";import{C as V,T as W,c as G,d as Q,e as X,a as w,b as s,f as Z}from"./TextField-CqUPLGNT.js";import{R as ee,T as re}from"./SearchOutlined-B5QEumBV.js";import{B as P}from"./InputLabel-DwtkTGL1.js";import{R as te,a as se}from"./EyeOutlined-CoCxyZMs.js";import{R as ne}from"./PlusOutlined-CUASEOeT.js";import{R as ae}from"./EditOutlined-B3OTRA0j.js";import{R as oe}from"./DeleteOutlined-BXynkypd.js";const je=()=>{const[c,m]=n.useState(0),[i,y]=n.useState(10),[l,f]=n.useState(""),[R,j]=n.useState(!1),[_,A]=n.useState("create"),[T,b]=n.useState(null),{data:a,isLoading:I,error:g,refetch:d}=O(),v=U(),M=Y(),B=q(),C=a==null?void 0:a.filter(r=>r.supplier_name.toLowerCase().includes(l.toLowerCase())||r.contact_person.toLowerCase().includes(l.toLowerCase())||r.email.toLowerCase().includes(l.toLowerCase())),E=(r,t)=>{m(t)},L=r=>{y(parseInt(r.target.value,10)),m(0)},k=async r=>{x.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!",cancelButtonText:"Cancel"}).then(async t=>{if(t.isConfirmed)try{await B.mutateAsync(r),x.fire("Deleted!","Supplier has been deleted.","success"),d()}catch(o){x.fire("Error!","Failed to delete supplier. Please try again.","error"),console.error("Error deleting supplier:",o)}})},D=r=>{const t=a.find(o=>o.supplier_id===r);p("view",t)},$=r=>{const t=a.find(o=>o.supplier_id===r);p("edit",t)},p=(r,t=null)=>{A(r),b(t),j(!0)},z=async r=>{try{await M.mutateAsync({id:r.supplier_id,data:{supplier_name:r.supplier_name,contact_person:r.contact_person,email:r.email,phone:r.phone,address:r.address}}),d(),h()}catch(t){console.error("Error updating supplier:",t)}},F=async r=>{try{await v.mutateAsync(r),d(),h()}catch(t){console.error("Error creating supplier:",t)}},h=()=>{j(!1)},H=()=>{f("")};return I?e.jsx("div",{children:"Loading..."}):g?e.jsxs("div",{children:["Error: ",g.message]}):e.jsxs(V,{maxWidth:"xxl",sx:{mt:0,px:"0!important"},children:[e.jsxs(S,{sx:{display:"flex",justifyContent:"space-between",alignItems:"center",mb:2},children:[e.jsx(W,{placeholder:"Search suppliers...",variant:"outlined",size:"small",value:l,onChange:r=>f(r.target.value),InputProps:{startAdornment:e.jsx(J,{position:"start",children:e.jsx(ee,{})})}}),e.jsxs(S,{children:[e.jsx(P,{variant:"text",color:"error",sx:{mr:1},onClick:H,children:e.jsx(te,{})}),e.jsx(P,{variant:"contained",color:"error",startIcon:e.jsx(ne,{}),onClick:()=>p("create"),children:"Add Supplier"})]})]}),e.jsx(G,{component:K,children:e.jsxs(Q,{children:[e.jsx(X,{children:e.jsxs(w,{children:[e.jsx(s,{children:"Name"}),e.jsx(s,{children:"Contact Person"}),e.jsx(s,{children:"Email"}),e.jsx(s,{children:"Phone"}),e.jsx(s,{children:"Address"}),e.jsx(s,{align:"right",children:"Actions"})]})}),e.jsx(Z,{children:C.slice(c*i,c*i+i).map(r=>e.jsxs(w,{children:[e.jsx(s,{children:r.supplier_name}),e.jsx(s,{children:r.contact_person}),e.jsx(s,{children:r.email}),e.jsx(s,{children:r.phone}),e.jsx(s,{children:r.address}),e.jsxs(s,{align:"right",children:[e.jsx(u,{onClick:()=>D(r.supplier_id),children:e.jsx(se,{style:{fontSize:20}})}),e.jsx(u,{onClick:()=>$(r.supplier_id),children:e.jsx(ae,{style:{fontSize:20}})}),e.jsx(u,{onClick:()=>k(r.supplier_id),children:e.jsx(oe,{style:{fontSize:20}})})]})]},r.supplier_id))})]})}),e.jsx(re,{rowsPerPageOptions:[5,10,25],component:"div",count:C.length,rowsPerPage:i,page:c,onPageChange:E,onRowsPerPageChange:L}),e.jsx(N,{open:R,handleClose:h,handleAddSupplier:F,handleUpdateSupplier:z,mode:_,initialData:T})]})};export{je as default};
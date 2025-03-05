import{r as n,J as H,K as N,L as U,N as Y,j as e,q as S,E as q,P as J,I as u}from"./index-B4lmkI_6.js";import{S as K}from"./SupplierModal-DzJE3Ecl.js";import{S as m}from"./sweetalert2.esm.all-D3pEHXw3.js";import{C as V,T as W,c as G,d as Q,e as X,a as w,b as s,f as Z}from"./TextField-CUtW5_1o.js";import{R as ee}from"./SearchOutlined-BYiwTQ9_.js";import{B as P}from"./InputLabel-DSTZXsCg.js";import{R as re}from"./ClearOutlined-DWlcCpxG.js";import{R as te}from"./PlusOutlined-BnjNWR0G.js";import{R as se}from"./EyeOutlined-pR4EkLyD.js";import{R as ne}from"./EditOutlined-BbBcElsO.js";import{R as oe}from"./DeleteOutlined-C3turjY5.js";import{T as ae}from"./TablePagination-ay1VwrKN.js";import"./CloseOutlined-Dv1PHuEj.js";const Se=()=>{const[c,x]=n.useState(0),[i,y]=n.useState(10),[l,f]=n.useState(""),[R,j]=n.useState(!1),[_,T]=n.useState("create"),[b,A]=n.useState(null),{data:o,isLoading:I,error:g,refetch:d}=H(),v=N(),M=U(),B=Y(),C=o==null?void 0:o.filter(r=>r.supplier_name.toLowerCase().includes(l.toLowerCase())||r.contact_person.toLowerCase().includes(l.toLowerCase())||r.email.toLowerCase().includes(l.toLowerCase())),E=(r,t)=>{x(t)},L=r=>{y(parseInt(r.target.value,10)),x(0)},k=async r=>{m.fire({title:"Are you sure?",text:"You won't be able to revert this!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!",cancelButtonText:"Cancel"}).then(async t=>{if(t.isConfirmed)try{await B.mutateAsync(r),m.fire("Deleted!","Supplier has been deleted.","success"),d()}catch(a){m.fire("Error!","Failed to delete supplier. Please try again.","error"),console.error("Error deleting supplier:",a)}})},D=r=>{const t=o.find(a=>a.supplier_id===r);p("view",t)},$=r=>{const t=o.find(a=>a.supplier_id===r);p("edit",t)},p=(r,t=null)=>{T(r),A(t),j(!0)},z=async r=>{try{await M.mutateAsync({id:r.supplier_id,data:{supplier_name:r.supplier_name,contact_person:r.contact_person,email:r.email,phone:r.phone,address:r.address}}),d(),h()}catch(t){console.error("Error updating supplier:",t)}},F=async r=>{try{await v.mutateAsync(r),d(),h()}catch(t){console.error("Error creating supplier:",t)}},h=()=>{j(!1)},O=()=>{f("")};return I?e.jsx("div",{children:"Loading..."}):g?e.jsxs("div",{children:["Error: ",g.message]}):e.jsxs(V,{maxWidth:"xxl",sx:{mt:0,px:"0!important"},children:[e.jsxs(S,{sx:{display:"flex",justifyContent:"space-between",alignItems:"center",mb:2},children:[e.jsx(W,{placeholder:"Search suppliers...",variant:"outlined",size:"small",value:l,onChange:r=>f(r.target.value),InputProps:{startAdornment:e.jsx(q,{position:"start",children:e.jsx(ee,{})})}}),e.jsxs(S,{children:[e.jsx(P,{variant:"text",color:"error",sx:{mr:1},onClick:O,children:e.jsx(re,{})}),e.jsx(P,{variant:"contained",color:"error",startIcon:e.jsx(te,{}),onClick:()=>p("create"),children:"Add Supplier"})]})]}),e.jsx(G,{component:J,children:e.jsxs(Q,{children:[e.jsx(X,{children:e.jsxs(w,{children:[e.jsx(s,{children:"Name"}),e.jsx(s,{children:"Contact Person"}),e.jsx(s,{children:"Email"}),e.jsx(s,{children:"Phone"}),e.jsx(s,{children:"Address"}),e.jsx(s,{align:"right",children:"Actions"})]})}),e.jsx(Z,{children:C.slice(c*i,c*i+i).map(r=>e.jsxs(w,{children:[e.jsx(s,{children:r.supplier_name}),e.jsx(s,{children:r.contact_person}),e.jsx(s,{children:r.email}),e.jsx(s,{children:r.phone}),e.jsx(s,{children:r.address}),e.jsxs(s,{align:"right",children:[e.jsx(u,{onClick:()=>D(r.supplier_id),children:e.jsx(se,{style:{fontSize:20}})}),e.jsx(u,{onClick:()=>$(r.supplier_id),children:e.jsx(ne,{style:{fontSize:20}})}),e.jsx(u,{onClick:()=>k(r.supplier_id),children:e.jsx(oe,{style:{fontSize:20}})})]})]},r.supplier_id))})]})}),e.jsx(ae,{rowsPerPageOptions:[5,10,25],component:"div",count:C.length,rowsPerPage:i,page:c,onPageChange:E,onRowsPerPageChange:L}),e.jsx(K,{open:R,handleClose:h,handleAddSupplier:F,handleUpdateSupplier:z,mode:_,initialData:b})]})};export{Se as default};

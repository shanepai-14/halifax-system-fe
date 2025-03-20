import{r as o,a8 as T,a9 as q,Q as W,aA as $,R as J,j as e,q as x,T as r,P as R,G as l,D as K,a1 as X,aY as ee,aZ as te,aB as ne}from"./index-DMPyTngB.js";import{l as se}from"./index-OvYkGGpj.js";import{B as m}from"./InputLabel-Dma56rhx.js";import{R as re}from"./PrinterOutlined-BsBe2M7d.js";import{c as _,d as F,e as S,a as v,b as s,f as k,T as L}from"./TextField-DZyZK0vq.js";import{D as ae,a as ie,b as le}from"./DialogTitle-P729Siqj.js";import{D as oe}from"./DialogContentText-CoSPQovp.js";import{D as ce}from"./DialogActions-CI9nfQEj.js";import{S as de}from"./Snackbar-Cw1LZrHl.js";import{A as he}from"./Alert-DScCzCRQ.js";import{C as xe}from"./Container-BfGOL6TG.js";import{L as E}from"./Link-BKuoggdD.js";import{R as ue}from"./ArrowLeftOutlined-DJn-EZX1.js";import{C as me}from"./CircularProgress-CFXVLVCW.js";import"./Close-CLv_2-i5.js";var je={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494zM504 618H320c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM312 490v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H320c-4.4 0-8 3.6-8 8z"}}]},name:"file-text",theme:"outlined"},ge=function(c,d){return o.createElement(T,q({},c,{ref:d,icon:je}))},pe=o.forwardRef(ge),ve={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 00-44.4 0L77.5 505a63.9 63.9 0 00-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0018.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z"}}]},name:"home",theme:"outlined"},ye=function(c,d){return o.createElement(T,q({},c,{ref:d,icon:ve}))},Q=o.forwardRef(ye),fe={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M793 242H366v-74c0-6.7-7.7-10.4-12.9-6.3l-142 112a8 8 0 000 12.6l142 112c5.2 4.1 12.9.4 12.9-6.3v-74h415v470H175c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h618c35.3 0 64-28.7 64-64V306c0-35.3-28.7-64-64-64z"}}]},name:"rollback",theme:"outlined"},be=function(c,d){return o.createElement(T,q({},c,{ref:d,icon:fe}))},Ce=o.forwardRef(be);const V=n=>n?new Date(n).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):"",Re=({report:n})=>{var P,w,B;const[c,d]=o.useState(!1),[j,g]=o.useState([]),[y,C]=o.useState(""),[f,u]=o.useState({open:!1,message:"",type:"info"}),I=W(),b=o.useRef(),{createCreditMemo:p}=$();J.useEffect(()=>{n&&n.items&&g(n.items.map(t=>({...t,return_quantity:0,max_quantity:t.quantity})))},[n]);const G=se.useReactToPrint({contentRef:b}),U=()=>{d(!0)},D=()=>{d(!1)},N=(t,a)=>{const h=parseInt(a)||0;g(j.map(i=>i.id===t?{...i,return_quantity:Math.min(Math.max(0,h),i.max_quantity)}:i))},Y=async()=>{const t=j.filter(a=>a.return_quantity>0);if(t.length===0){u({open:!0,message:"Please specify at least one item to return",type:"error"});return}try{const a={sale_id:n.id,reason:y,items:t.map(i=>({product_id:i.product_id,quantity:i.return_quantity,price:i.sold_price}))};await p(a)&&(u({open:!0,message:"Credit memo created successfully!",type:"success"}),D())}catch(a){u({open:!0,message:a.message||"Failed to create credit memo",type:"error"})}},M=()=>{u(t=>({...t,open:!1}))};if(!n)return e.jsxs(x,{sx:{p:4,textAlign:"center"},children:[e.jsx(r,{variant:"h5",children:"No delivery report data available"}),e.jsx(m,{variant:"contained",startIcon:e.jsx(Q,{}),onClick:()=>I("/dashboard"),sx:{mt:2},children:"Go to Dashboard"})]});const A=n.items.reduce((t,a)=>t+parseFloat(a.sold_price)*a.quantity,0),O=n.items.reduce((t,a)=>{const i=parseFloat(a.sold_price)*a.quantity*(parseFloat(a.discount)/100);return t+i},0),Z=A-O;return e.jsxs(e.Fragment,{children:[e.jsxs(R,{elevation:2,sx:{p:3,mb:3},children:[e.jsxs(x,{sx:{display:"flex",justifyContent:"space-between",alignItems:"center",mb:2},children:[e.jsx(r,{variant:"h5",children:"Delivery Report Details"}),e.jsxs(x,{children:[e.jsx(m,{variant:"outlined",color:"primary",startIcon:e.jsx(re,{}),onClick:G,sx:{mr:1},children:"Print"}),e.jsx(m,{variant:"outlined",color:"secondary",startIcon:e.jsx(Ce,{}),onClick:U,disabled:n.status==="cancelled"||((P=n.returns)==null?void 0:P.length)>0,children:"Create Credit Memo"})]})]}),e.jsxs(x,{ref:b,sx:{p:2},children:[e.jsxs(x,{sx:{textAlign:"center",mb:2},children:[e.jsx(r,{variant:"h4",children:"DELIVERY REPORT"}),e.jsx(r,{variant:"h6",children:n.invoice_number})]}),e.jsxs(l,{container:!0,spacing:2,children:[e.jsx(l,{item:!0,xs:9,md:9,children:e.jsxs(x,{sx:{mb:2},children:[e.jsx(r,{variant:"subtitle2",children:"Customer Information"}),e.jsx(r,{variant:"body1",children:((w=n.customer)==null?void 0:w.customer_name)||"Walk-in Customer"}),e.jsx(r,{variant:"body2",children:n.address}),e.jsx(r,{variant:"body2",children:n.city}),e.jsxs(r,{variant:"body2",children:["Phone: ",n.phone]})]})}),e.jsx(l,{item:!0,xs:3,md:3,children:e.jsxs(x,{sx:{mb:2},children:[e.jsx(r,{variant:"subtitle2",children:"Order Details"}),e.jsxs(r,{variant:"body2",children:[e.jsx("strong",{children:"Order Date:"})," ",V(n.order_date)]}),e.jsxs(r,{variant:"body2",children:[e.jsx("strong",{children:"Delivery Date:"})," ",V(n.delivery_date)]}),e.jsxs(r,{variant:"body2",children:[e.jsx("strong",{children:"Payment Method:"})," ",n.payment_method.charAt(0).toUpperCase()+n.payment_method.slice(1)]}),e.jsxs(r,{variant:"body2",children:[e.jsx("strong",{children:"Status:"})," ",n.status.charAt(0).toUpperCase()+n.status.slice(1)]})]})})]}),e.jsx(K,{sx:{my:2}}),e.jsx(r,{variant:"subtitle1",gutterBottom:!0,children:"Order Items"}),e.jsx(_,{component:R,variant:"outlined",sx:{mb:2},children:e.jsxs(F,{size:"small",children:[e.jsx(S,{children:e.jsxs(v,{children:[e.jsx(s,{children:"Item"}),e.jsx(s,{children:"Code"}),e.jsx(s,{align:"right",children:"Price"}),e.jsx(s,{align:"center",children:"Quantity"}),e.jsx(s,{align:"right",children:"Discount (%)"}),e.jsx(s,{align:"right",children:"Subtotal"})]})}),e.jsx(k,{children:n.items.map(t=>{var H,z;const a=parseFloat(t.sold_price)*t.quantity,h=a*(parseFloat(t.discount)/100),i=a-h;return e.jsxs(v,{children:[e.jsx(s,{children:(H=t.product)==null?void 0:H.product_name}),e.jsx(s,{children:(z=t.product)==null?void 0:z.product_code}),e.jsxs(s,{align:"right",children:["₱",parseFloat(t.sold_price).toFixed(2)]}),e.jsx(s,{align:"center",children:t.quantity}),e.jsxs(s,{align:"right",children:[parseFloat(t.discount).toFixed(2),"%"]}),e.jsxs(s,{align:"right",children:["₱",i.toFixed(2)]})]},t.id)})})]})}),n.returns&&n.returns.length>0&&e.jsxs(e.Fragment,{children:[e.jsx(r,{variant:"subtitle1",gutterBottom:!0,sx:{mt:3},children:"Returns"}),e.jsx(_,{component:R,variant:"outlined",sx:{mb:2},children:e.jsxs(F,{size:"small",children:[e.jsx(S,{children:e.jsxs(v,{children:[e.jsx(s,{children:"Item"}),e.jsx(s,{children:"Code"}),e.jsx(s,{align:"right",children:"Price"}),e.jsx(s,{align:"center",children:"Quantity"}),e.jsx(s,{align:"right",children:"Total"}),e.jsx(s,{children:"Reason"})]})}),e.jsx(k,{children:n.returns.map(t=>{var a,h;return e.jsxs(v,{children:[e.jsx(s,{children:(a=t.product)==null?void 0:a.product_name}),e.jsx(s,{children:(h=t.product)==null?void 0:h.product_code}),e.jsxs(s,{align:"right",children:["₱",parseFloat(t.price).toFixed(2)]}),e.jsx(s,{align:"center",children:t.quantity}),e.jsxs(s,{align:"right",children:["₱",(parseFloat(t.price)*t.quantity).toFixed(2)]}),e.jsx(s,{children:t.reason})]},t.id)})})]})})]}),e.jsx(x,{sx:{display:"flex",justifyContent:"flex-end",mt:2},children:e.jsxs(l,{container:!0,spacing:1,sx:{maxWidth:"400px"},children:[e.jsx(l,{item:!0,xs:6,children:e.jsx(r,{variant:"body2",align:"right",children:"Subtotal:"})}),e.jsx(l,{item:!0,xs:6,children:e.jsxs(r,{variant:"body2",align:"right",children:["₱",A.toFixed(2)]})}),e.jsx(l,{item:!0,xs:6,children:e.jsx(r,{variant:"body2",align:"right",children:"Discount:"})}),e.jsx(l,{item:!0,xs:6,children:e.jsxs(r,{variant:"body2",align:"right",children:["₱",O.toFixed(2)]})}),e.jsx(l,{item:!0,xs:6,children:e.jsx(r,{variant:"body1",fontWeight:"bold",align:"right",children:"Total Amount:"})}),e.jsx(l,{item:!0,xs:6,children:e.jsxs(r,{variant:"body1",fontWeight:"bold",align:"right",children:["₱",Z.toFixed(2)]})}),e.jsx(l,{item:!0,xs:6,children:e.jsx(r,{variant:"body2",align:"right",children:"Amount Received:"})}),e.jsx(l,{item:!0,xs:6,children:e.jsxs(r,{variant:"body2",align:"right",children:["₱",parseFloat(n.amount_received).toFixed(2)]})}),e.jsx(l,{item:!0,xs:6,children:e.jsx(r,{variant:"body2",align:"right",children:"Change:"})}),e.jsx(l,{item:!0,xs:6,children:e.jsxs(r,{variant:"body2",align:"right",children:["₱",parseFloat(n.change).toFixed(2)]})})]})}),n.remarks&&e.jsxs(x,{sx:{mt:3},children:[e.jsx(r,{variant:"subtitle2",children:"Remarks:"}),e.jsx(r,{variant:"body2",children:n.remarks})]}),e.jsxs(x,{sx:{mt:3,display:"flex",justifyContent:"space-between"},children:[e.jsxs(r,{variant:"body2",children:[e.jsx("strong",{children:"Delivery Status:"})," ",n.is_delivered?"Delivered":"Pending Delivery"]}),e.jsxs(r,{variant:"body2",children:[e.jsx("strong",{children:"Created By:"})," ",(B=n.user)==null?void 0:B.name]})]})]})]}),e.jsxs(ae,{open:c,onClose:D,maxWidth:"md",fullWidth:!0,children:[e.jsx(ie,{children:"Create Credit Memo"}),e.jsxs(le,{children:[e.jsx(oe,{children:"Specify the items and quantities to be returned. Only items that are part of this delivery report can be returned."}),e.jsx(_,{sx:{mt:2},children:e.jsxs(F,{size:"small",children:[e.jsx(S,{children:e.jsxs(v,{children:[e.jsx(s,{children:"Item"}),e.jsx(s,{children:"Code"}),e.jsx(s,{align:"right",children:"Price"}),e.jsx(s,{align:"center",children:"Available"}),e.jsx(s,{align:"center",children:"Return Quantity"}),e.jsx(s,{align:"right",children:"Total"})]})}),e.jsx(k,{children:j.map(t=>{var a,h;return e.jsxs(v,{children:[e.jsx(s,{children:(a=t.product)==null?void 0:a.product_name}),e.jsx(s,{children:(h=t.product)==null?void 0:h.product_code}),e.jsxs(s,{align:"right",children:["₱",parseFloat(t.sold_price).toFixed(2)]}),e.jsx(s,{align:"center",children:t.max_quantity}),e.jsx(s,{align:"center",children:e.jsx(L,{type:"number",InputProps:{inputProps:{min:0,max:t.max_quantity}},value:t.return_quantity,onChange:i=>N(t.id,i.target.value),size:"small",sx:{width:"80px"}})}),e.jsxs(s,{align:"right",children:["₱",(parseFloat(t.sold_price)*t.return_quantity).toFixed(2)]})]},t.id)})})]})}),e.jsx(L,{margin:"dense",id:"returnReason",label:"Reason for Return",multiline:!0,rows:3,fullWidth:!0,variant:"outlined",value:y,onChange:t=>C(t.target.value),sx:{mt:3}})]}),e.jsxs(ce,{children:[e.jsx(m,{onClick:D,children:"Cancel"}),e.jsx(m,{onClick:Y,variant:"contained",color:"primary",children:"Create Credit Memo"})]})]}),e.jsx(de,{open:f.open,autoHideDuration:6e3,onClose:M,anchorOrigin:{vertical:"bottom",horizontal:"center"},children:e.jsx(he,{onClose:M,severity:f.type,sx:{width:"100%"},children:f.message})})]})},ze=()=>{const{id:n}=X(),c=ee(),d=W(),[j,g]=o.useState(!0),[y,C]=o.useState(null),{getSaleById:f}=$();o.useEffect(()=>{(async()=>{var b;if((b=c.state)!=null&&b.reportData){C(c.state.reportData),g(!1);return}if(n)try{const p=await f(n);p?C(p):console.error("Delivery report not found")}catch(p){console.error("Error fetching delivery report:",p)}finally{g(!1)}else g(!1)})()},[n,c.state]);const u=()=>{d("/app/sales")};return e.jsxs(xe,{maxWidth:"xxl",sx:{mt:4,mb:4},children:[e.jsxs(te,{sx:{mb:2},children:[e.jsxs(E,{underline:"hover",color:"inherit",sx:{display:"flex",alignItems:"center",cursor:"pointer"},onClick:()=>d("/app/dashboard"),children:[e.jsx(Q,{style:{marginRight:8}}),"Dashboard"]}),e.jsxs(E,{underline:"hover",color:"inherit",sx:{display:"flex",alignItems:"center",cursor:"pointer"},onClick:()=>d("/app/sales"),children:[e.jsx(pe,{style:{marginRight:8}}),"Sales"]}),e.jsx(r,{color:"text.primary",children:"Delivery Report"})]}),e.jsx(x,{sx:{mb:2},children:e.jsx(m,{variant:"outlined",startIcon:e.jsx(ue,{}),onClick:u,children:"Back to Sales"})}),j?e.jsx(ne,{open:j,sx:{color:"#fff",zIndex:9999},children:e.jsx(me,{color:"inherit"})}):y?e.jsx(Re,{report:y}):e.jsxs(R,{sx:{p:3,textAlign:"center"},children:[e.jsx(r,{variant:"h6",color:"error",children:"Delivery report not found or could not be loaded"}),e.jsx(m,{variant:"contained",sx:{mt:2},onClick:u,children:"Go to Sales List"})]})]})};export{ze as default};

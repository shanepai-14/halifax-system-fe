import{aw as o,ax as n,ay as t,az as a}from"./index-DSrAcRxp.js";const p=(e={})=>o({queryKey:["purchase-orders",e],queryFn:async()=>(await a.get("/purchase-orders",{params:e})).data.data}),d=e=>o({queryKey:["purchase-orders",e],queryFn:async()=>(await a.get(`/purchase-orders/${e}`)).data.data,enabled:!!e}),i=()=>{const e=n();return t({mutationFn:async s=>(await a.post("/purchase-orders",s)).data,onSuccess:()=>{e.invalidateQueries(["purchase-orders"])}})},h=()=>{const e=n();return t({mutationFn:async({id:s,data:r})=>(await a.put(`/purchase-orders/${s}`,r)).data,onSuccess:()=>{e.invalidateQueries(["purchase-orders"])}})},y=()=>{const e=n();return t({mutationFn:async({poNumber:s,status:r})=>(await a.put(`/purchase-orders/${s}/status`,{status:r})).data,onSuccess:()=>{e.invalidateQueries(["purchase-orders"])}})},m=()=>t({mutationFn:async({id:e,file:s})=>{const r=new FormData;return r.append("attachment",s),(await a.post(`/purchase-orders/${e}/attachment`,r,{headers:{"Content-Type":"multipart/form-data"}})).data}});export{i as a,d as b,h as c,y as d,m as e,p as u};

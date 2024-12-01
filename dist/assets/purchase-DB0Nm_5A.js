import{r as x,N as $,_ as z,Q as ie,j as s,q,A as se,P as oe,T as ce,S as ue,I as N}from"./index-CmW0R-vW.js";import{u as de,a as le}from"./usePurchaseOrders-B_oMpWKo.js";import{C as he,T as fe,c as me,d as ge,e as we,a as R,b as w,f as ye,M as be}from"./TextField-Dbf9w0KL.js";import{R as xe,T as Pe,M as _,a as Me}from"./SearchOutlined-rzr7sXJ5.js";import{B as L}from"./InputLabel-DPT03u9u.js";import{R as Oe,a as ve}from"./EyeOutlined-CzS9LoIB.js";import{R as ke}from"./PlusOutlined-ByE6885J.js";var Se={icon:{tag:"svg",attrs:{"fill-rule":"evenodd",viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm0 76c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zm128.01 198.83c.03 0 .05.01.09.06l45.02 45.01a.2.2 0 01.05.09.12.12 0 010 .07c0 .02-.01.04-.05.08L557.25 512l127.87 127.86a.27.27 0 01.05.06v.02a.12.12 0 010 .07c0 .03-.01.05-.05.09l-45.02 45.02a.2.2 0 01-.09.05.12.12 0 01-.07 0c-.02 0-.04-.01-.08-.05L512 557.25 384.14 685.12c-.04.04-.06.05-.08.05a.12.12 0 01-.07 0c-.03 0-.05-.01-.09-.05l-45.02-45.02a.2.2 0 01-.05-.09.12.12 0 010-.07c0-.02.01-.04.06-.08L466.75 512 338.88 384.14a.27.27 0 01-.05-.06l-.01-.02a.12.12 0 010-.07c0-.03.01-.05.05-.09l45.02-45.02a.2.2 0 01.09-.05.12.12 0 01.07 0c.02 0 .04.01.08.06L512 466.75l127.86-127.86c.04-.05.06-.06.08-.06a.12.12 0 01.07 0z"}}]},name:"close-circle",theme:"outlined"},De=function(e,n){return x.createElement($,z({},e,{ref:n,icon:Se}))},We=x.forwardRef(De),Ce={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M456 231a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0z"}}]},name:"more",theme:"outlined"},Te=function(e,n){return x.createElement($,z({},e,{ref:n,icon:Ce}))},je=x.forwardRef(Te);const V=6048e5,Ye=864e5,I=Symbol.for("constructDateFrom");function v(t,e){return typeof t=="function"?t(e):t&&typeof t=="object"&&I in t?t[I](e):t instanceof Date?new t.constructor(e):new Date(e)}function b(t,e){return v(e||t,t)}let pe={};function p(){return pe}function j(t,e){var u,l,h,f;const n=p(),r=(e==null?void 0:e.weekStartsOn)??((l=(u=e==null?void 0:e.locale)==null?void 0:u.options)==null?void 0:l.weekStartsOn)??n.weekStartsOn??((f=(h=n.locale)==null?void 0:h.options)==null?void 0:f.weekStartsOn)??0,a=b(t,e==null?void 0:e.in),i=a.getDay(),o=(i<r?7:0)+i-r;return a.setDate(a.getDate()-o),a.setHours(0,0,0,0),a}function Y(t,e){return j(t,{...e,weekStartsOn:1})}function J(t,e){const n=b(t,e==null?void 0:e.in),r=n.getFullYear(),a=v(n,0);a.setFullYear(r+1,0,4),a.setHours(0,0,0,0);const i=Y(a),o=v(n,0);o.setFullYear(r,0,4),o.setHours(0,0,0,0);const u=Y(o);return n.getTime()>=i.getTime()?r+1:n.getTime()>=u.getTime()?r:r-1}function H(t){const e=b(t),n=new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds()));return n.setUTCFullYear(e.getFullYear()),+t-+n}function Ee(t,...e){const n=v.bind(null,e.find(r=>typeof r=="object"));return e.map(n)}function B(t,e){const n=b(t,e==null?void 0:e.in);return n.setHours(0,0,0,0),n}function Fe(t,e,n){const[r,a]=Ee(n==null?void 0:n.in,t,e),i=B(r),o=B(a),u=+i-H(i),l=+o-H(o);return Math.round((u-l)/Ye)}function qe(t,e){const n=J(t,e),r=v(t,0);return r.setFullYear(n,0,4),r.setHours(0,0,0,0),Y(r)}function Ne(t){return t instanceof Date||typeof t=="object"&&Object.prototype.toString.call(t)==="[object Date]"}function Re(t){return!(!Ne(t)&&typeof t!="number"||isNaN(+b(t)))}function _e(t,e){const n=b(t,e==null?void 0:e.in);return n.setFullYear(n.getFullYear(),0,1),n.setHours(0,0,0,0),n}const Le={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},Ie=(t,e,n)=>{let r;const a=Le[t];return typeof a=="string"?r=a:e===1?r=a.one:r=a.other.replace("{{count}}",e.toString()),n!=null&&n.addSuffix?n.comparison&&n.comparison>0?"in "+r:r+" ago":r};function E(t){return(e={})=>{const n=e.width?String(e.width):t.defaultWidth;return t.formats[n]||t.formats[t.defaultWidth]}}const He={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},Be={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},Qe={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},Xe={date:E({formats:He,defaultWidth:"full"}),time:E({formats:Be,defaultWidth:"full"}),dateTime:E({formats:Qe,defaultWidth:"full"})},Ae={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},Ge=(t,e,n,r)=>Ae[t];function C(t){return(e,n)=>{const r=n!=null&&n.context?String(n.context):"standalone";let a;if(r==="formatting"&&t.formattingValues){const o=t.defaultFormattingWidth||t.defaultWidth,u=n!=null&&n.width?String(n.width):o;a=t.formattingValues[u]||t.formattingValues[o]}else{const o=t.defaultWidth,u=n!=null&&n.width?String(n.width):t.defaultWidth;a=t.values[u]||t.values[o]}const i=t.argumentCallback?t.argumentCallback(e):e;return a[i]}}const $e={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},ze={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},Ve={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},Je={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},Ue={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},Ke={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},Ze=(t,e)=>{const n=Number(t),r=n%100;if(r>20||r<10)switch(r%10){case 1:return n+"st";case 2:return n+"nd";case 3:return n+"rd"}return n+"th"},et={ordinalNumber:Ze,era:C({values:$e,defaultWidth:"wide"}),quarter:C({values:ze,defaultWidth:"wide",argumentCallback:t=>t-1}),month:C({values:Ve,defaultWidth:"wide"}),day:C({values:Je,defaultWidth:"wide"}),dayPeriod:C({values:Ue,defaultWidth:"wide",formattingValues:Ke,defaultFormattingWidth:"wide"})};function T(t){return(e,n={})=>{const r=n.width,a=r&&t.matchPatterns[r]||t.matchPatterns[t.defaultMatchWidth],i=e.match(a);if(!i)return null;const o=i[0],u=r&&t.parsePatterns[r]||t.parsePatterns[t.defaultParseWidth],l=Array.isArray(u)?nt(u,y=>y.test(o)):tt(u,y=>y.test(o));let h;h=t.valueCallback?t.valueCallback(l):l,h=n.valueCallback?n.valueCallback(h):h;const f=e.slice(o.length);return{value:h,rest:f}}}function tt(t,e){for(const n in t)if(Object.prototype.hasOwnProperty.call(t,n)&&e(t[n]))return n}function nt(t,e){for(let n=0;n<t.length;n++)if(e(t[n]))return n}function rt(t){return(e,n={})=>{const r=e.match(t.matchPattern);if(!r)return null;const a=r[0],i=e.match(t.parsePattern);if(!i)return null;let o=t.valueCallback?t.valueCallback(i[0]):i[0];o=n.valueCallback?n.valueCallback(o):o;const u=e.slice(a.length);return{value:o,rest:u}}}const at=/^(\d+)(th|st|nd|rd)?/i,it=/\d+/i,st={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},ot={any:[/^b/i,/^(a|c)/i]},ct={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},ut={any:[/1/i,/2/i,/3/i,/4/i]},dt={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},lt={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},ht={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},ft={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},mt={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},gt={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},wt={ordinalNumber:rt({matchPattern:at,parsePattern:it,valueCallback:t=>parseInt(t,10)}),era:T({matchPatterns:st,defaultMatchWidth:"wide",parsePatterns:ot,defaultParseWidth:"any"}),quarter:T({matchPatterns:ct,defaultMatchWidth:"wide",parsePatterns:ut,defaultParseWidth:"any",valueCallback:t=>t+1}),month:T({matchPatterns:dt,defaultMatchWidth:"wide",parsePatterns:lt,defaultParseWidth:"any"}),day:T({matchPatterns:ht,defaultMatchWidth:"wide",parsePatterns:ft,defaultParseWidth:"any"}),dayPeriod:T({matchPatterns:mt,defaultMatchWidth:"any",parsePatterns:gt,defaultParseWidth:"any"})},yt={code:"en-US",formatDistance:Ie,formatLong:Xe,formatRelative:Ge,localize:et,match:wt,options:{weekStartsOn:0,firstWeekContainsDate:1}};function bt(t,e){const n=b(t,e==null?void 0:e.in);return Fe(n,_e(n))+1}function xt(t,e){const n=b(t,e==null?void 0:e.in),r=+Y(n)-+qe(n);return Math.round(r/V)+1}function U(t,e){var f,y,M,k;const n=b(t,e==null?void 0:e.in),r=n.getFullYear(),a=p(),i=(e==null?void 0:e.firstWeekContainsDate)??((y=(f=e==null?void 0:e.locale)==null?void 0:f.options)==null?void 0:y.firstWeekContainsDate)??a.firstWeekContainsDate??((k=(M=a.locale)==null?void 0:M.options)==null?void 0:k.firstWeekContainsDate)??1,o=v((e==null?void 0:e.in)||t,0);o.setFullYear(r+1,0,i),o.setHours(0,0,0,0);const u=j(o,e),l=v((e==null?void 0:e.in)||t,0);l.setFullYear(r,0,i),l.setHours(0,0,0,0);const h=j(l,e);return+n>=+u?r+1:+n>=+h?r:r-1}function Pt(t,e){var u,l,h,f;const n=p(),r=(e==null?void 0:e.firstWeekContainsDate)??((l=(u=e==null?void 0:e.locale)==null?void 0:u.options)==null?void 0:l.firstWeekContainsDate)??n.firstWeekContainsDate??((f=(h=n.locale)==null?void 0:h.options)==null?void 0:f.firstWeekContainsDate)??1,a=U(t,e),i=v((e==null?void 0:e.in)||t,0);return i.setFullYear(a,0,r),i.setHours(0,0,0,0),j(i,e)}function Mt(t,e){const n=b(t,e==null?void 0:e.in),r=+j(n,e)-+Pt(n,e);return Math.round(r/V)+1}function c(t,e){const n=t<0?"-":"",r=Math.abs(t).toString().padStart(e,"0");return n+r}const O={y(t,e){const n=t.getFullYear(),r=n>0?n:1-n;return c(e==="yy"?r%100:r,e.length)},M(t,e){const n=t.getMonth();return e==="M"?String(n+1):c(n+1,2)},d(t,e){return c(t.getDate(),e.length)},a(t,e){const n=t.getHours()/12>=1?"pm":"am";switch(e){case"a":case"aa":return n.toUpperCase();case"aaa":return n;case"aaaaa":return n[0];case"aaaa":default:return n==="am"?"a.m.":"p.m."}},h(t,e){return c(t.getHours()%12||12,e.length)},H(t,e){return c(t.getHours(),e.length)},m(t,e){return c(t.getMinutes(),e.length)},s(t,e){return c(t.getSeconds(),e.length)},S(t,e){const n=e.length,r=t.getMilliseconds(),a=Math.trunc(r*Math.pow(10,n-3));return c(a,e.length)}},W={am:"am",pm:"pm",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},Q={G:function(t,e,n){const r=t.getFullYear()>0?1:0;switch(e){case"G":case"GG":case"GGG":return n.era(r,{width:"abbreviated"});case"GGGGG":return n.era(r,{width:"narrow"});case"GGGG":default:return n.era(r,{width:"wide"})}},y:function(t,e,n){if(e==="yo"){const r=t.getFullYear(),a=r>0?r:1-r;return n.ordinalNumber(a,{unit:"year"})}return O.y(t,e)},Y:function(t,e,n,r){const a=U(t,r),i=a>0?a:1-a;if(e==="YY"){const o=i%100;return c(o,2)}return e==="Yo"?n.ordinalNumber(i,{unit:"year"}):c(i,e.length)},R:function(t,e){const n=J(t);return c(n,e.length)},u:function(t,e){const n=t.getFullYear();return c(n,e.length)},Q:function(t,e,n){const r=Math.ceil((t.getMonth()+1)/3);switch(e){case"Q":return String(r);case"QQ":return c(r,2);case"Qo":return n.ordinalNumber(r,{unit:"quarter"});case"QQQ":return n.quarter(r,{width:"abbreviated",context:"formatting"});case"QQQQQ":return n.quarter(r,{width:"narrow",context:"formatting"});case"QQQQ":default:return n.quarter(r,{width:"wide",context:"formatting"})}},q:function(t,e,n){const r=Math.ceil((t.getMonth()+1)/3);switch(e){case"q":return String(r);case"qq":return c(r,2);case"qo":return n.ordinalNumber(r,{unit:"quarter"});case"qqq":return n.quarter(r,{width:"abbreviated",context:"standalone"});case"qqqqq":return n.quarter(r,{width:"narrow",context:"standalone"});case"qqqq":default:return n.quarter(r,{width:"wide",context:"standalone"})}},M:function(t,e,n){const r=t.getMonth();switch(e){case"M":case"MM":return O.M(t,e);case"Mo":return n.ordinalNumber(r+1,{unit:"month"});case"MMM":return n.month(r,{width:"abbreviated",context:"formatting"});case"MMMMM":return n.month(r,{width:"narrow",context:"formatting"});case"MMMM":default:return n.month(r,{width:"wide",context:"formatting"})}},L:function(t,e,n){const r=t.getMonth();switch(e){case"L":return String(r+1);case"LL":return c(r+1,2);case"Lo":return n.ordinalNumber(r+1,{unit:"month"});case"LLL":return n.month(r,{width:"abbreviated",context:"standalone"});case"LLLLL":return n.month(r,{width:"narrow",context:"standalone"});case"LLLL":default:return n.month(r,{width:"wide",context:"standalone"})}},w:function(t,e,n,r){const a=Mt(t,r);return e==="wo"?n.ordinalNumber(a,{unit:"week"}):c(a,e.length)},I:function(t,e,n){const r=xt(t);return e==="Io"?n.ordinalNumber(r,{unit:"week"}):c(r,e.length)},d:function(t,e,n){return e==="do"?n.ordinalNumber(t.getDate(),{unit:"date"}):O.d(t,e)},D:function(t,e,n){const r=bt(t);return e==="Do"?n.ordinalNumber(r,{unit:"dayOfYear"}):c(r,e.length)},E:function(t,e,n){const r=t.getDay();switch(e){case"E":case"EE":case"EEE":return n.day(r,{width:"abbreviated",context:"formatting"});case"EEEEE":return n.day(r,{width:"narrow",context:"formatting"});case"EEEEEE":return n.day(r,{width:"short",context:"formatting"});case"EEEE":default:return n.day(r,{width:"wide",context:"formatting"})}},e:function(t,e,n,r){const a=t.getDay(),i=(a-r.weekStartsOn+8)%7||7;switch(e){case"e":return String(i);case"ee":return c(i,2);case"eo":return n.ordinalNumber(i,{unit:"day"});case"eee":return n.day(a,{width:"abbreviated",context:"formatting"});case"eeeee":return n.day(a,{width:"narrow",context:"formatting"});case"eeeeee":return n.day(a,{width:"short",context:"formatting"});case"eeee":default:return n.day(a,{width:"wide",context:"formatting"})}},c:function(t,e,n,r){const a=t.getDay(),i=(a-r.weekStartsOn+8)%7||7;switch(e){case"c":return String(i);case"cc":return c(i,e.length);case"co":return n.ordinalNumber(i,{unit:"day"});case"ccc":return n.day(a,{width:"abbreviated",context:"standalone"});case"ccccc":return n.day(a,{width:"narrow",context:"standalone"});case"cccccc":return n.day(a,{width:"short",context:"standalone"});case"cccc":default:return n.day(a,{width:"wide",context:"standalone"})}},i:function(t,e,n){const r=t.getDay(),a=r===0?7:r;switch(e){case"i":return String(a);case"ii":return c(a,e.length);case"io":return n.ordinalNumber(a,{unit:"day"});case"iii":return n.day(r,{width:"abbreviated",context:"formatting"});case"iiiii":return n.day(r,{width:"narrow",context:"formatting"});case"iiiiii":return n.day(r,{width:"short",context:"formatting"});case"iiii":default:return n.day(r,{width:"wide",context:"formatting"})}},a:function(t,e,n){const a=t.getHours()/12>=1?"pm":"am";switch(e){case"a":case"aa":return n.dayPeriod(a,{width:"abbreviated",context:"formatting"});case"aaa":return n.dayPeriod(a,{width:"abbreviated",context:"formatting"}).toLowerCase();case"aaaaa":return n.dayPeriod(a,{width:"narrow",context:"formatting"});case"aaaa":default:return n.dayPeriod(a,{width:"wide",context:"formatting"})}},b:function(t,e,n){const r=t.getHours();let a;switch(r===12?a=W.noon:r===0?a=W.midnight:a=r/12>=1?"pm":"am",e){case"b":case"bb":return n.dayPeriod(a,{width:"abbreviated",context:"formatting"});case"bbb":return n.dayPeriod(a,{width:"abbreviated",context:"formatting"}).toLowerCase();case"bbbbb":return n.dayPeriod(a,{width:"narrow",context:"formatting"});case"bbbb":default:return n.dayPeriod(a,{width:"wide",context:"formatting"})}},B:function(t,e,n){const r=t.getHours();let a;switch(r>=17?a=W.evening:r>=12?a=W.afternoon:r>=4?a=W.morning:a=W.night,e){case"B":case"BB":case"BBB":return n.dayPeriod(a,{width:"abbreviated",context:"formatting"});case"BBBBB":return n.dayPeriod(a,{width:"narrow",context:"formatting"});case"BBBB":default:return n.dayPeriod(a,{width:"wide",context:"formatting"})}},h:function(t,e,n){if(e==="ho"){let r=t.getHours()%12;return r===0&&(r=12),n.ordinalNumber(r,{unit:"hour"})}return O.h(t,e)},H:function(t,e,n){return e==="Ho"?n.ordinalNumber(t.getHours(),{unit:"hour"}):O.H(t,e)},K:function(t,e,n){const r=t.getHours()%12;return e==="Ko"?n.ordinalNumber(r,{unit:"hour"}):c(r,e.length)},k:function(t,e,n){let r=t.getHours();return r===0&&(r=24),e==="ko"?n.ordinalNumber(r,{unit:"hour"}):c(r,e.length)},m:function(t,e,n){return e==="mo"?n.ordinalNumber(t.getMinutes(),{unit:"minute"}):O.m(t,e)},s:function(t,e,n){return e==="so"?n.ordinalNumber(t.getSeconds(),{unit:"second"}):O.s(t,e)},S:function(t,e){return O.S(t,e)},X:function(t,e,n){const r=t.getTimezoneOffset();if(r===0)return"Z";switch(e){case"X":return A(r);case"XXXX":case"XX":return S(r);case"XXXXX":case"XXX":default:return S(r,":")}},x:function(t,e,n){const r=t.getTimezoneOffset();switch(e){case"x":return A(r);case"xxxx":case"xx":return S(r);case"xxxxx":case"xxx":default:return S(r,":")}},O:function(t,e,n){const r=t.getTimezoneOffset();switch(e){case"O":case"OO":case"OOO":return"GMT"+X(r,":");case"OOOO":default:return"GMT"+S(r,":")}},z:function(t,e,n){const r=t.getTimezoneOffset();switch(e){case"z":case"zz":case"zzz":return"GMT"+X(r,":");case"zzzz":default:return"GMT"+S(r,":")}},t:function(t,e,n){const r=Math.trunc(+t/1e3);return c(r,e.length)},T:function(t,e,n){return c(+t,e.length)}};function X(t,e=""){const n=t>0?"-":"+",r=Math.abs(t),a=Math.trunc(r/60),i=r%60;return i===0?n+String(a):n+String(a)+e+c(i,2)}function A(t,e){return t%60===0?(t>0?"-":"+")+c(Math.abs(t)/60,2):S(t,e)}function S(t,e=""){const n=t>0?"-":"+",r=Math.abs(t),a=c(Math.trunc(r/60),2),i=c(r%60,2);return n+a+e+i}const G=(t,e)=>{switch(t){case"P":return e.date({width:"short"});case"PP":return e.date({width:"medium"});case"PPP":return e.date({width:"long"});case"PPPP":default:return e.date({width:"full"})}},K=(t,e)=>{switch(t){case"p":return e.time({width:"short"});case"pp":return e.time({width:"medium"});case"ppp":return e.time({width:"long"});case"pppp":default:return e.time({width:"full"})}},Ot=(t,e)=>{const n=t.match(/(P+)(p+)?/)||[],r=n[1],a=n[2];if(!a)return G(t,e);let i;switch(r){case"P":i=e.dateTime({width:"short"});break;case"PP":i=e.dateTime({width:"medium"});break;case"PPP":i=e.dateTime({width:"long"});break;case"PPPP":default:i=e.dateTime({width:"full"});break}return i.replace("{{date}}",G(r,e)).replace("{{time}}",K(a,e))},vt={p:K,P:Ot},kt=/^D+$/,St=/^Y+$/,Dt=["D","DD","YY","YYYY"];function Wt(t){return kt.test(t)}function Ct(t){return St.test(t)}function Tt(t,e,n){const r=jt(t,e,n);if(console.warn(r),Dt.includes(t))throw new RangeError(r)}function jt(t,e,n){const r=t[0]==="Y"?"years":"days of the month";return`Use \`${t.toLowerCase()}\` instead of \`${t}\` (in \`${e}\`) for formatting ${r} to the input \`${n}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`}const Yt=/[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,pt=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,Et=/^'([^]*?)'?$/,Ft=/''/g,qt=/[a-zA-Z]/;function Nt(t,e,n){var f,y,M,k;const r=p(),a=r.locale??yt,i=r.firstWeekContainsDate??((y=(f=r.locale)==null?void 0:f.options)==null?void 0:y.firstWeekContainsDate)??1,o=r.weekStartsOn??((k=(M=r.locale)==null?void 0:M.options)==null?void 0:k.weekStartsOn)??0,u=b(t,n==null?void 0:n.in);if(!Re(u))throw new RangeError("Invalid time value");let l=e.match(pt).map(g=>{const m=g[0];if(m==="p"||m==="P"){const D=vt[m];return D(g,a.formatLong)}return g}).join("").match(Yt).map(g=>{if(g==="''")return{isToken:!1,value:"'"};const m=g[0];if(m==="'")return{isToken:!1,value:Rt(g)};if(Q[m])return{isToken:!0,value:g};if(m.match(qt))throw new RangeError("Format string contains an unescaped latin alphabet character `"+m+"`");return{isToken:!1,value:g}});a.localize.preprocessor&&(l=a.localize.preprocessor(u,l));const h={firstWeekContainsDate:i,weekStartsOn:o,locale:a};return l.map(g=>{if(!g.isToken)return g.value;const m=g.value;(Ct(m)||Wt(m))&&Tt(m,e,String(t));const D=Q[m[0]];return D(u,m,a.localize,h)}).join("")}function Rt(t){const e=t.match(Et);return e?e[1].replace(Ft,"'"):t}const _t={pending:"warning",partially_received:"info",completed:"success",cancelled:"error"},Gt=()=>{const t=ie(),[e,n]=x.useState(0),[r,a]=x.useState(10),[i,o]=x.useState(""),[u,l]=x.useState({}),[h,f]=x.useState(null),[y,M]=x.useState(null),{data:k=[],isLoading:g}=de(u),m=le(),D=k.filter(d=>{var P;return d.po_number.toLowerCase().includes(i.toLowerCase())||((P=d.supplier)==null?void 0:P.supplier_name.toLowerCase().includes(i.toLowerCase()))}),Z=(d,P)=>{n(P)},ee=d=>{a(parseInt(d.target.value,10)),n(0)},te=(d,P)=>{f(d.currentTarget),M(P)},F=()=>{f(null),M(null)},ne=async()=>{try{await m.mutateAsync(y.po_id),F()}catch(d){console.error("Error cancelling PO:",d)}},re=()=>{o(""),l({})};return g?s.jsx("div",{children:"Loading..."}):s.jsxs(he,{maxWidth:"xxl",sx:{mt:0,px:"0!important"},children:[s.jsxs(q,{sx:{display:"flex",justifyContent:"space-between",alignItems:"center",mb:2},children:[s.jsx(fe,{placeholder:"Search PO number",variant:"outlined",size:"small",value:i,onChange:d=>o(d.target.value),InputProps:{startAdornment:s.jsx(se,{position:"start",children:s.jsx(xe,{})})}}),s.jsxs(q,{children:[s.jsx(L,{variant:"text",color:"error",sx:{mr:1},onClick:re,children:s.jsx(Oe,{})}),s.jsx(L,{variant:"contained",color:"error",startIcon:s.jsx(ke,{}),onClick:()=>t("/app/purchase/create"),children:"Create PO"})]})]}),s.jsx(me,{component:oe,children:s.jsxs(ge,{children:[s.jsx(we,{children:s.jsxs(R,{children:[s.jsx(w,{children:"PO Number"}),s.jsx(w,{children:"Date"}),s.jsx(w,{children:"Supplier"}),s.jsx(w,{children:"Invoice"}),s.jsx(w,{children:"Total Amount"}),s.jsx(w,{children:"Status"}),s.jsx(w,{align:"right",children:"Actions"})]})}),s.jsx(ye,{children:D.slice(e*r,e*r+r).map(d=>{var P;return s.jsxs(R,{children:[s.jsx(w,{onClick:()=>t(`${d.po_number}/edit`),color:"primary",children:s.jsx(ce,{color:"primary",children:d.po_number})}),s.jsx(w,{children:Nt(new Date(d.po_date),"MMM dd, yyyy")}),s.jsx(w,{children:(P=d.supplier)==null?void 0:P.supplier_name}),s.jsx(w,{children:d.invoice}),s.jsxs(w,{children:["₱",Number(d.total_amount).toLocaleString()]}),s.jsx(w,{children:s.jsx(ue,{label:d.status.replace("_"," "),color:_t[d.status],size:"small"})}),s.jsxs(w,{align:"right",children:[s.jsx(N,{onClick:()=>{},children:s.jsx(ve,{style:{fontSize:20}})}),s.jsx(N,{onClick:ae=>te(ae,d),disabled:d.status==="cancelled"||d.status==="completed",children:s.jsx(je,{style:{fontSize:20}})})]})]},d.po_id)})})]})}),s.jsx(Pe,{rowsPerPageOptions:[5,10,25],component:"div",count:D.length,rowsPerPage:r,page:e,onPageChange:Z,onRowsPerPageChange:ee}),s.jsxs(be,{anchorEl:h,open:!!h,onClose:F,children:[s.jsxs(_,{onClick:()=>{},children:[s.jsx(Me,{style:{marginRight:8}})," Edit"]}),s.jsxs(_,{onClick:ne,children:[s.jsx(We,{style:{marginRight:8}})," Cancel"]})]})]})};export{Gt as default};
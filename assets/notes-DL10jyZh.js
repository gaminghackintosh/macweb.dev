import{r as s,W as p,j as e}from"./finder-C2nJrQ1X.js";function x(){const{onClose:a,onMinimize:d,onZoom:l,onTitleMouseDown:c}=s.useContext(p),r=[{id:1,title:"Developer Life Plan",content:`# Roadmap 🚀

✔ Learn React
✔ Understand useEffect (sometimes)
✔ Stop breaking layouts by 2px
✔ Build something that looks like Apple UI

🔲 Become rich
🔲 Sleep 8 hours (optional feature)
🔲 Stop using console.log as a debugger framework`,modified:"Just now"},{id:2,title:"Debugging Thoughts",content:`useEffect(() => {
  // why is this running 17 times?
  // I didn't change anything
  // it just started working differently
}, [])

// 2 hours later:
// turns out I did change everything`,modified:"Yesterday"},{id:3,title:"Essential Survival Kit",content:`- Coffee ☕
- More coffee ☕☕
- Motivation (not found)
- npm install --force
- Hope
- 1% battery and blind confidence`,modified:"2 days ago"},{id:4,title:"JavaScript Summary",content:`let life = undefined;

setTimeout(() => {
  life = null;
}, 0);

console.log(life);

// expected: meaning
// actual: undefined`,modified:"Today"},{id:5,title:"Developer Philosophy",content:`If it works — don't touch it.

If it doesn't work — you didn't touch anything.

If everything breaks — it's webpack's fault.`,modified:"Today"},{id:6,title:"Git Commit Reality",content:`feat: added feature
fix: fixed feature
chore: touched something I don't understand
refactor: moved code around and prayed

// everything works until you push to production`,modified:"Today"}],[n,f]=s.useState(r),[i,m]=s.useState(1),u=n.find(t=>t.id===i),h=t=>{f(g=>g.map(o=>o.id===i?{...o,content:t,modified:"Just now"}:o))};return e.jsxs("div",{className:"notes",children:[e.jsxs("div",{className:"notes-titlebar",onMouseDown:t=>!t.target.closest(".notes-traffic-light")&&c(t),children:[e.jsxs("div",{className:"notes-traffic-lights",children:[e.jsx("button",{className:"notes-traffic-light notes-traffic-light--close",onClick:a,title:"Close"}),e.jsx("button",{className:"notes-traffic-light notes-traffic-light--minimize",onClick:d,title:"Minimize"}),e.jsx("button",{className:"notes-traffic-light notes-traffic-light--zoom",onClick:l,title:"Zoom"})]}),e.jsx("span",{className:"notes-title",children:"Notes"})]}),e.jsxs("div",{className:"notes-body",children:[e.jsxs("div",{className:"notes-sidebar",children:[e.jsxs("div",{className:"notes-sidebar-header",children:["ALL NOTES — ",n.length]}),e.jsx("div",{className:"notes-list",children:n.map(t=>e.jsxs("div",{className:`notes-list-item ${i===t.id?"active":""}`,onClick:()=>m(t.id),children:[e.jsx("div",{className:"notes-item-title",children:t.title}),e.jsx("div",{className:"notes-item-modified",children:t.modified})]},t.id))})]}),e.jsx("textarea",{className:"notes-editor",value:u?.content||"",onChange:t=>h(t.target.value),placeholder:"Start writing..."})]})]})}export{x as NotesContent};

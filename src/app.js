const TD=new Date();const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;const T0=iso(TD);const addD=(k,n)=>{const d=new Date(k+"T00:00");d.setDate(d.getDate()+n);return iso(d)};
const fd=k=>new Date(k+"T00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
const TR1=`Priya: Thanks everyone. Goal today is to lock the Q1 onboarding plan.
Marcus: The welcome email sequence is drafted. I will send it to legal by Friday.
Priya: Great. Are we still blocked on the help-center articles?
Lena: Yes, two are missing screenshots. I will update them by Wednesday.
Priya: We agreed to launch the new checklist on January 15.
Marcus: Decided: we drop the video tour for now and revisit in February.
Lena: Action item for Priya: confirm the budget for the in-app guide tool.
Priya: Sounds good. Who owns the metrics dashboard?
Marcus: I will build the activation dashboard by next Monday.`;
const TR2=`Jordan: Quick sync on the vendor renewal.
Ana: Current contract ends December 31. Usage is down 30 percent.
Jordan: We decided to negotiate a smaller tier instead of renewing as is.
Ana: I will pull the last 6 months of usage by Thursday.
Jordan: Can we ask for monthly billing?
Ana: Todo: draft the negotiation email for Jordan to review.
Jordan: Agreed. Let's reconvene next Tuesday.`;
const TR3=`Sam: Weekly creative standup. Three ads are in QA.
Kai: The holiday cut needs new captions. I will fix them by tomorrow.
Sam: Any risks for the launch?
Kai: Music licensing is still pending.
Sam: Action: Sam to follow up with the licensing team by Friday.
Mei: We agreed the thumbnail A/B test runs for one week.`;
const TR4=`Dana: Interview debrief for the operations coordinator role.
Rob: Strong process thinking, good automation examples.
Dana: Concern: limited experience with our CRM.
Rob: We decided to move her to the final round.
Dana: I will schedule the final interview by Wednesday.
Rob: Should we add a short take-home task?
Dana: Agreed, Rob will write the task brief by Monday.`;
function parse(tr){const turns=tr.split("\n").map(l=>l.trim()).filter(Boolean).map(l=>{const m=l.match(/^([A-Z][\w .'-]{0,24}):\s*(.*)$/);return m?{sp:m[1],tx:m[2]}:{sp:"Speaker",tx:l}});
 const acts=[],dec=[],qs=[];turns.forEach(t=>{const s=t.tx;
  if(/\?$/.test(s))qs.push({sp:t.sp,tx:s});
  if(/\b(decided|agreed|we agreed|decision)\b/i.test(s))dec.push(s.replace(/^(decided|agreed)[:,]?\s*/i,""));
  if(/\b(i will|i'll|will\b|action( item)?|todo|to-do|by (mon|tues|wednes|thurs|fri|satur|sun)day|by (tomorrow|next \w+|friday|eod))/i.test(s)&&!/\?$/.test(s)){
   let owner=t.sp;const mo=s.match(/(?:for|:)\s*([A-Z][a-z]+)\b[:,]?/)||s.match(/^(?:Action:\s*)?([A-Z][a-z]+) (?:to|will)\b/);if(mo&&!/^(I|We|Action|Todo|Decided|Yes)$/.test(mo[1]))owner=mo[1];
   const due=(s.match(/by ([A-Za-z]+(?: [A-Za-z]+)?)/i)||[])[1]||"";acts.push({t:s.replace(/^(action( item)?( for \w+)?|todo)[:,]?\s*/i,""),owner,due,done:false})}});
 const stop=new Set("the a an and or to of for in on is are we i it be by that this with will our as at us can lets let's so up just now still need new next what who any yes all".split(" "));
 const f={};turns.forEach(t=>t.tx.toLowerCase().match(/[a-z]{4,}/g)?.forEach(w=>{if(!stop.has(w))f[w]=(f[w]||0)+1}));
 const kw=Object.entries(f).sort((a,b)=>b[1]-a[1]).slice(0,6).map(x=>x[0]);
 const sp=[...new Set(turns.map(t=>t.sp))];
 const summary=`${sp.length} participants (${sp.join(", ")}) discussed ${kw.slice(0,3).join(", ")}. ${dec.length} decision${dec.length==1?"":"s"} made and ${acts.length} action item${acts.length==1?"":"s"} assigned.`;
 return{turns,acts,dec,qs,kw,summary,sp}}
function mk(id,title,date,time,tags,tr,src){const p=parse(tr);return{id,title,date,time,tags,src:src||"Zoom",dur:Math.max(8,p.turns.length*3),tr,...p}}
function SEED(){return{nid:5,me:"Priya",remindMin:10,autoNotes:true,
 meetings:[mk(1,"Q1 onboarding planning",addD(T0,-1),"10:00",["product","planning"],TR1,"Zoom"),mk(2,"Vendor renewal sync",addD(T0,-2),"14:30",["finance","vendors"],TR2,"Google Meet"),mk(3,"Creative standup",addD(T0,-3),"09:00",["creative","weekly"],TR3,"Zoom"),mk(4,"Interview debrief · Ops coordinator",addD(T0,-5),"16:00",["hiring"],TR4,"Teams")],
 upcoming:[{id:101,title:"Leadership weekly",date:T0,time:"15:00",src:"Zoom",remind:true},{id:102,title:"Client kickoff · Northbay",date:addD(T0,1),time:"09:30",src:"Google Meet",remind:true},{id:103,title:"1:1 with Marcus",date:addD(T0,2),time:"11:00",src:"Zoom",remind:false}],log:[]}}
const M=id=>S.meetings.find(m=>m.id==+id);
const allActs=()=>S.meetings.flatMap(m=>m.acts.map((a,i)=>({...a,mid:m.id,i,mt:m.title})));
const tagP=t=>`<span class="pill" style="background:var(--blush);color:var(--cocoa)">#${esc(t)}</span>`;
const V={};
V.dashboard=()=>{const up=S.upcoming.filter(u=>u.date>=T0).sort((a,b)=>(a.date+a.time)<(b.date+b.time)?-1:1),open=allActs().filter(a=>!a.done);
 return`<div class="hero"><span class="tag">MEETINGSCRIBE · WEB COMPANION</span><h1>Your meetings, already written up</h1><p>The desktop app records and transcribes on your computer. This page shows the notes, decisions and action items it produces.</p></div>
 <div class="card" style="margin-top:16px"><div class="kpi"><div><b>${S.meetings.length}</b>meetings captured</div><div><b>${open.length}</b>open action items</div><div><b>${up.length}</b>upcoming</div><div><b>${S.meetings.reduce((a,m)=>a+m.dur,0)}</b>minutes transcribed</div></div></div>
 <div class="grid"><div class="card"><h2>Next up</h2>${up.slice(0,4).map(u=>`<div style="padding:6px 0;border-bottom:1px solid var(--line)">🕒 <b>${esc(u.title)}</b><br><span class="muted">${fd(u.date)} · ${u.time} · ${u.src} ${u.remind?"· 🔔 "+S.remindMin+" min before":""}</span></div>`).join("")||"<p class='muted'>Nothing scheduled.</p>"}
 <h2 style="margin-top:14px">Recent notes</h2>${S.meetings.slice().sort((a,b)=>a.date<b.date?1:-1).slice(0,3).map(m=>`<div style="padding:5px 0"><a href="#/meeting?id=${m.id}">📝 ${esc(m.title)}</a> <span class="muted">${fd(m.date)}</span></div>`).join("")}</div>
 <div class="card"><h2>Open action items</h2>${open.slice(0,7).map(a=>`<label style="display:flex;gap:8px;align-items:flex-start;font-weight:500;color:var(--ink)"><input type="checkbox" style="width:auto;margin-top:3px" onchange="doneA(${a.mid},${a.i},this.checked)"><span>${esc(a.t)}<br><span class="muted">${esc(a.owner)}${a.due?" · due "+esc(a.due):""} · ${esc(a.mt)}</span></span></label>`).join("")||"<p class='muted'>All done 🎉</p>"}<button class="ghost" onclick="go('actions')">Open board</button></div></div>`};
function doneA(mid,i,v){M(mid).acts[i].done=v;L(`${v?"Completed":"Reopened"} action: ${M(mid).acts[i].t}`);if(v)toast("Action item done ✓");route()}
V.upcoming=()=>{const up=S.upcoming.slice().sort((a,b)=>(a.date+a.time)<(b.date+b.time)?-1:1);
 return`<div class="grid"><div class="card"><h2>Upcoming meetings</h2><table><tr><th>When</th><th>Meeting</th><th>Platform</th><th>Reminder</th><th></th></tr>${up.map(u=>`<tr><td>${fd(u.date)}<br><span class="muted">${u.time}</span></td><td>${esc(u.title)}</td><td>${u.src}</td><td><input type="checkbox" style="width:auto" ${u.remind?"checked":""} onchange="S.upcoming.find(x=>x.id==${u.id}).remind=this.checked;save()"></td><td><button class="ghost" style="margin:0;padding:3px 8px" onclick="S.upcoming=S.upcoming.filter(x=>x.id!=${u.id});route()">✕</button></td></tr>`).join("")}</table></div>
 <div class="card"><h2>Add meeting</h2><label>Title</label><input id="ut" placeholder="e.g. Design review"><div class="row"><div><label>Date</label><input id="ud" type="date" value="${T0}"></div><div><label>Time</label><input id="uh" type="time" value="13:00"></div></div><label>Platform</label><select id="us"><option>Zoom</option><option>Google Meet</option><option>Teams</option><option>In person</option></select><button onclick="addU()">Add meeting</button>
 <h2 style="margin-top:16px">Import from calendar (.ics)</h2><textarea id="ics" style="min-height:90px;font-family:monospace;font-size:12px" placeholder="Paste .ics text here">BEGIN:VEVENT
SUMMARY:Budget review
DTSTART:${addD(T0,3).replace(/-/g,"")}T140000
END:VEVENT</textarea><button class="ghost" onclick="impICS()">Import events</button></div></div>`};
function addU(){const t=$("ut").value.trim();if(!t)return toast("Give the meeting a title");if($("ud").value<T0)return toast("Pick today or a future date");S.upcoming.push({id:S.nid++ +1000,title:t,date:$("ud").value,time:$("uh").value,src:$("us").value,remind:true});L("Scheduled: "+t);toast("Meeting added · reminder on 🔔");route()}
function impICS(){const evs=$("ics").value.split("BEGIN:VEVENT").slice(1);let n=0;evs.forEach(e=>{const s=(e.match(/SUMMARY:(.*)/)||[])[1],d=(e.match(/DTSTART[^:]*:(\d{8})(?:T(\d{2})(\d{2}))?/)||[]);if(s&&d[1]){S.upcoming.push({id:S.nid++ +1000,title:s.trim(),date:`${d[1].slice(0,4)}-${d[1].slice(4,6)}-${d[1].slice(6,8)}`,time:d[2]?`${d[2]}:${d[3]}`:"09:00",src:"Calendar",remind:true});n++}});
 if(!n)return toast("No events found in that text");L(`Imported ${n} event(s) from .ics`);toast(`Imported ${n} event(s)`);route()}
V.library=()=>{const q=(S.q||"").toLowerCase(),tg=S.tag||"",tags=[...new Set(S.meetings.flatMap(m=>m.tags))];
 const ms=S.meetings.filter(m=>(!tg||m.tags.includes(tg))&&(!q||(m.title+" "+m.tr).toLowerCase().includes(q))).sort((a,b)=>a.date<b.date?1:-1);
 return`<div class="card"><div class="row"><input id="lq" placeholder="Search titles and transcripts…" value="${esc(S.q||"")}" onkeydown="if(event.key=='Enter'){S.q=this.value;route()}"><select style="max-width:180px" onchange="S.tag=this.value;route()"><option value="">All tags</option>${tags.map(t=>`<option ${t==tg?"selected":""}>${t}</option>`).join("")}</select><button style="margin:0;flex:0 0 auto" onclick="S.q=$('lq').value;route()">Search</button></div>
 <p class="muted">${ms.length} meeting(s)</p>${ms.map(m=>`<div style="border:1px solid var(--line);border-radius:12px;padding:12px;margin:8px 0;cursor:pointer" onclick="go('meeting?id=${m.id}')"><b>${esc(m.title)}</b> <span class="muted">${fd(m.date)} · ${m.time} · ${m.src} · ${m.dur} min</span><br>${m.tags.map(tagP).join("")}<p class="muted" style="margin:6px 0 0">${esc(m.summary)}</p>${q?`<p style="margin:4px 0 0;font-size:13px">…${esc((m.tr.toLowerCase().indexOf(q)>=0?m.tr.substr(Math.max(0,m.tr.toLowerCase().indexOf(q)-40),110):""))}…</p>`:""}</div>`).join("")||"<p class='muted'>No matches.</p>"}</div>`};
V.meeting=()=>{const id=(location.hash.match(/id=(\d+)/)||[])[1],m=M(id)||S.meetings[0];if(!m)return`<div class="card"><p class="muted">No meetings yet.</p></div>`;
 return`<div class="card"><a href="#/library" class="muted">← Library</a><h1 style="margin:6px 0">${esc(m.title)}</h1><span class="muted">${fd(m.date)} · ${m.time} · ${m.src} · ${m.dur} min · ${m.sp.join(", ")}</span><div>${m.tags.map(tagP).join("")} <button class="ghost" style="margin:0;padding:3px 10px" onclick="addTag(${m.id})">＋ tag</button> <button class="ghost" style="margin:0;padding:3px 10px" onclick="copyN(${m.id})">📋 Copy notes</button> <button class="ghost" style="margin:0;padding:3px 10px" onclick="if(confirm('Delete this meeting?')){S.meetings=S.meetings.filter(x=>x.id!=${m.id});go('library')}">🗑 Delete</button></div></div>
 <div class="grid"><div class="card"><h2>Summary</h2><p>${esc(m.summary)}</p><p class="muted">Keywords: ${m.kw.map(k=>`<b>${esc(k)}</b>`).join(", ")}</p>
 <h2>Decisions</h2><ul>${m.dec.map(d=>`<li>${esc(d)}</li>`).join("")||"<li class='muted'>None recorded</li>"}</ul>
 <h2>Open questions</h2><ul>${m.qs.map(q=>`<li>${esc(q.tx)} <span class="muted">(${esc(q.sp)})</span></li>`).join("")||"<li class='muted'>None</li>"}</ul>
 <h2>Action items</h2>${m.acts.map((a,i)=>`<div style="display:flex;gap:8px;align-items:center;padding:4px 0"><input type="checkbox" style="width:auto" ${a.done?"checked":""} onchange="doneA(${m.id},${i},this.checked)"><span style="flex:1;${a.done?"text-decoration:line-through;opacity:.6":""}">${esc(a.t)}</span><input value="${esc(a.owner)}" style="max-width:100px;padding:4px" onchange="M(${m.id}).acts[${i}].owner=this.value;save()"><input value="${esc(a.due)}" placeholder="due" style="max-width:110px;padding:4px" onchange="M(${m.id}).acts[${i}].due=this.value;save()"></div>`).join("")||"<p class='muted'>None</p>"}
 <button class="ghost" onclick="const t=prompt('New action item');if(t){M(${m.id}).acts.push({t,owner:S.me,due:'',done:false});route()}">＋ Add action item</button></div>
 <div class="card"><h2>Transcript</h2><div style="max-height:520px;overflow:auto">${m.turns.map(t=>`<div style="padding:6px 0;border-bottom:1px solid var(--line)"><b style="color:var(--cocoa)">${esc(t.sp)}</b><br>${esc(t.tx)}</div>`).join("")}</div></div></div>`};
function addTag(id){const t=prompt("Tag name");if(t&&t.trim()){M(id).tags.push(t.trim().toLowerCase().replace(/\s+/g,"-"));route()}}
function copyN(id){const m=M(id),txt=`${m.title} (${m.date})\n\nSummary: ${m.summary}\n\nDecisions:\n${m.dec.map(d=>"- "+d).join("\n")}\n\nAction items:\n${m.acts.map(a=>`- [${a.done?"x":" "}] ${a.t} (${a.owner}${a.due?", "+a.due:""})`).join("\n")}`;try{navigator.clipboard.writeText(txt);toast("Notes copied 📋")}catch(e){openM(`<pre>${esc(txt)}</pre>`)}}
V.new=()=>`<div class="grid"><div class="card"><h2>New notes from a transcript</h2><label>Meeting title</label><input id="nt" placeholder="e.g. Sprint planning"><div class="row"><div><label>Date</label><input id="ndt" type="date" value="${T0}"></div><div><label>Platform</label><select id="nsrc"><option>Zoom</option><option>Google Meet</option><option>Teams</option><option>In person</option></select></div></div>
 <label>Transcript (one line per speaker turn, "Name: text")</label><textarea id="ntr" style="min-height:220px">Alex: Let's review the launch checklist.
Bea: Landing page copy is done. I will publish it by Thursday.
Alex: We agreed to delay the webinar to next month.
Chris: Do we have the pricing page ready?
Bea: Action for Chris: finalize pricing by Monday.</textarea>
 <button onclick="prev()">Generate notes</button> <button class="ghost" onclick="saveN()">Save to library</button></div><div class="card"><h2>Preview</h2><div id="np" class="muted">Click Generate notes. Everything runs in your browser, so the transcript never leaves this page.</div></div></div>`;
function prev(){const tr=$("ntr").value.trim();if(tr.split("\n").length<2)return toast("Paste at least two lines of transcript");const p=parse(tr);
 $("np").innerHTML=`<p><b>Summary:</b> ${esc(p.summary)}</p><p><b>Decisions</b></p><ul>${p.dec.map(d=>`<li>${esc(d)}</li>`).join("")||"<li>None</li>"}</ul><p><b>Action items</b></p><ul>${p.acts.map(a=>`<li>${esc(a.t)} <span class="pill low">${esc(a.owner)}</span>${a.due?` <span class="pill medium">${esc(a.due)}</span>`:""}</li>`).join("")||"<li>None</li>"}</ul><p><b>Questions</b></p><ul>${p.qs.map(q=>`<li>${esc(q.tx)}</li>`).join("")||"<li>None</li>"}</ul><p class="muted">Keywords: ${p.kw.join(", ")}</p>`;return p}
function saveN(){const t=$("nt").value.trim(),tr=$("ntr").value.trim();if(!t)return toast("Add a meeting title");if(tr.split("\n").length<2)return toast("Paste a transcript first");const m=mk(S.nid++,t,$("ndt").value,new Date().toTimeString().slice(0,5),["new"],tr,$("nsrc").value);S.meetings.push(m);L("Notes created: "+t);toast("Saved to library ✓");go("meeting?id="+m.id)}
V.actions=()=>{const f=S.owner||"",as=allActs().filter(a=>!f||a.owner==f),owners=[...new Set(allActs().map(a=>a.owner))];
 const col=(done)=>as.filter(a=>a.done==done).map(a=>`<div style="border:1px solid var(--line);border-radius:10px;padding:10px;margin:6px 0;background:var(--card)"><label style="display:flex;gap:8px;font-weight:500;color:var(--ink)"><input type="checkbox" style="width:auto" ${a.done?"checked":""} onchange="doneA(${a.mid},${a.i},this.checked)">${esc(a.t)}</label><span class="pill low">${esc(a.owner)}</span>${a.due?`<span class="pill medium">due ${esc(a.due)}</span>`:""} <a class="muted" href="#/meeting?id=${a.mid}">${esc(a.mt)}</a></div>`).join("")||"<p class='muted'>Empty</p>";
 return`<div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><h2 style="margin:0">Action items</h2><select style="width:auto" onchange="S.owner=this.value;route()"><option value="">Everyone</option>${owners.map(o=>`<option ${o==f?"selected":""}>${esc(o)}</option>`).join("")}</select></div></div>
 <div class="grid"><div class="card"><h2>Open (${as.filter(a=>!a.done).length})</h2>${col(false)}</div><div class="card"><h2>Done (${as.filter(a=>a.done).length})</h2>${col(true)}</div></div>`};
V.desktop=()=>`<div class="grid"><div class="card"><h2>🖥 The MeetingScribe desktop app</h2><p>A small tray app for Windows and Mac that runs quietly in the background:</p><ul><li>🎙 Captures your microphone <b>and</b> system audio, so it works with Zoom (any account), Meet, Teams or in person</li><li>🧠 Transcribes locally with <b>faster-whisper</b></li><li>📝 Summarizes locally with <b>Ollama (Llama 3.1 8B)</b>: notes, decisions and action items</li><li>📅 Reads your calendar (.ics) and reminds you before meetings</li><li>📂 Saves notes to a folder you choose. Point it at a synced Drive folder to read them on a tablet</li></ul></div>
 <div class="card"><h2>🔒 Privacy by design</h2><p>Audio and transcripts never leave your computer. There are no cloud APIs and no per-minute costs. This web companion also runs entirely in your browser.</p><h2>Setup</h2><ol><li>Install Python 3.11 and Ollama, then run <code>ollama pull llama3.1:8b</code></li><li>Run the installer. It adds a Startup shortcut</li><li>Choose your notes folder and calendar link in <i>Settings</i></li><li>Join a meeting. The tray icon turns red while recording</li></ol></div></div>`;
V.settings=()=>`<div class="grid"><div class="card"><h2>Preferences</h2><label>Your name (default action-item owner)</label><input value="${esc(S.me)}" onchange="S.me=this.value;save();toast('Saved')"><label>Reminder lead time (minutes)</label><input type="number" min="1" max="60" value="${S.remindMin}" onchange="S.remindMin=Math.min(60,Math.max(1,+this.value));save();toast('Saved')">
 <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" style="width:auto" ${S.autoNotes?"checked":""} onchange="S.autoNotes=this.checked;save()"> Auto-generate notes when a recording ends</label></div>
 <div class="card"><h2>Data</h2><button onclick="const b=new Blob([JSON.stringify(S.meetings,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=window.URL.createObjectURL(b);a.download='meetingscribe-notes.json';a.click();toast('Exported')">Export all notes (JSON)</button><h2 style="margin-top:14px">Activity</h2>${S.log.slice(0,10).map(l=>`<div class="muted">${l.t} · ${esc(l.m)}</div>`).join("")||"<p class='muted'>—</p>"}</div></div>`;
function badge(r){if(r=="actions")return allActs().filter(a=>!a.done).length||"";if(r=="upcoming")return S.upcoming.filter(u=>u.date==T0).length||"";return""}
function onRoute(r){if(r=="meeting")document.querySelector('.side a[data-r="library"]').classList.add("on")}

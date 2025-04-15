(function(){"use strict";function span(t,e){return'<span class="'+e+'">'+t+"</span>"}function escapeHTML(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}const READY=Symbol("ready"),RUNNING=Symbol("running"),TERMINATED=Symbol("terminated"),ID=/[A-Za-z0-9_]/,SYM=/[^A-Za-z0-9_ \t]/,WS=/[ \t]/;class Output{constructor(t){this.content=t}str(){return this.content}print(){let t=document.createElement("pre");return t.textContent=this.content||"\n",t}items(){return[this]}}class RawOutput extends Output{print(){let t=document.createElement("pre");return t.innerHTML=this.str(),t}items(){return this.content.split("\n").map((t=>new RawOutput(t)))}}class TextOutput extends Output{items(){return this.content.split("\n").map((t=>new TextOutput(t)))}}class ArrayOutput extends Output{constructor(t,e=null){super(t),this.format=e}str(){return this.content.map((t=>t.str())).join("\n")}print(){let t=document.createElement("div");this.format&&t.classList.add(this.format);for(let e of this.content)t.appendChild(e.print());return t}items(){return this.content}}class ObjectOutput extends Output{str(){return String(this.content)}}const Async={timeout(t){let e,s=new Promise(((s,i)=>{e=setTimeout((()=>{s()}),t)}));return s.abort=()=>clearTimeout(e),s},request(t,e,s=0){let i,r=new Promise(((r,n)=>{i=new XMLHttpRequest,i.open(t,e,!0),s>0&&(i.timeout=s),i.onreadystatechange=()=>{4===i.readyState&&(200==i.status?r(i.responseText):n(i.status))},i.send(null)}));return r.abort=()=>i.abort(),r},read(t){let e=localStorage.getItem(t);return null!==e?Promise.resolve(e):Promise.reject(`${t}: no such file`)},write:(t,e)=>(localStorage.setItem(t,e),Promise.resolve()),append(t,e){let s=localStorage.getItem(t)||"";return localStorage.setItem(t,s+e),Promise.resolve()},list:t=>Promise.resolve(Object.keys(localStorage)),move(t,e){let s=localStorage.getItem(t);return null===s?Promise.reject(`${t}: no such file`):(localStorage.setItem(e,s),localStorage.removeItem(t),Promise.resolve())},remove:t=>(localStorage.removeItem(t),Promise.resolve())};class Program{constructor(t=null){this.prompt="",this.exitInput="",this.inputEnabled=!1,this.echo=!0,this.password=!1,this.rawInput=!1,this.history=[],this.historyIndex=0,this.parent=t,this.children=new Set,this.job=[this],this.variables=t?new Map(t.variables):new Map,this.state=READY,this.tty=!1,this.inputEnded=!1,t?(this.stdin=t.stdin,this.stdout=t.stdout,this.stderr=t.stderr):this.stdin=this.stdout=this.stderr=null}execute(t=[]){if(this.state!==READY)return;this.state=RUNNING,this.args=t,this.stdin.stdout=this,this.parent&&this.parent.children.add(this);let e=this.onExecute.apply(this,t);this.stdin.state===TERMINATED&&this.eof(),"number"==typeof e&&this.exit(e)}eof(){this.state!==RUNNING||this.inputEnded||(this.inputEnded=!0,this.onEOF())}interrupt(){this.state===RUNNING&&this.onInterrupt()}exit(t=0){if(this.state===RUNNING){this.state=TERMINATED,this.inputEnabled=!1;for(let t of this.children)t.exit();if(this.stdout.eof(),this.stderr.eof(),this.jobReturned()){let t=this.parent.stdin;t.stdout=this.parent,t.updateInput()}input.state===TERMINATED&&this.eof(),this.parent.children.delete(this),this.parent.state===RUNNING&&this.parent.onReturn(this,t)}}write(t){return!(this.state!==RUNNING||!this.inputEnabled)&&!1!==this.onWrite(t)}writeRaw(t){this.write(new RawOutput(t))}writeText(t){this.write(new TextOutput(t))}writeHistory(t,e){}clearHistory(){}clearInput(){}updateInput(){}jobReturned(){return this.job.every((t=>t.state===TERMINATED))}onExecute(){}onWrite(t){return!1}onInput(t){}onEOF(){this.inputEnabled&&this.exit()}onInterrupt(){this.parent&&this.parent.interrupt(),this.exit(130)}onReturn(t,e){}}class Term extends Program{constructor(){super(),this.inputEnabled=!0,this.tty=!0,this.stdin=this.stdout=this,this.stderr=new TermError(this),this.inputContent="",this.inputNewest="",this.inputCursor=0,this.scrollOnInput=!0,this.scrollOnOutput=!0,this.termElement=document.getElementById("term"),this.promptElement=document.getElementById("prompt"),this.inputElement=document.getElementById("input"),this.outputElement=document.getElementById("output"),this.uiElement=document.getElementById("ui"),this.stderr.execute(),document.addEventListener("keypress",(t=>{let e=this.stdout;if(e&&e.inputEnabled){if(13===t.keyCode){if(e.echo){let t=e.password?"*".repeat(this.inputContent.length):this.inputContent;this.writeHistory(e.prompt,t)}let t=this.inputContent;if(!e.password&&t.trim()){let s=e.history.indexOf(t);-1!==s&&e.history.splice(s,1),e.history.push(t)}e.writeText(this.inputContent),this.clearInput()}else this.inputNewest=this.inputContent=this.inputContent.substr(0,this.inputCursor)+String.fromCharCode(t.which)+this.inputContent.substr(this.inputCursor),++this.inputCursor;e.historyIndex=e.history.length,this.updateInput(),this.scrollOnInput&&(this.termElement.scrollTop=this.termElement.scrollHeight)}})),document.addEventListener("keydown",(t=>{let e=this.stdout;if(e.rawInput)e.onInput(t);else{if(t.ctrlKey){switch(t.key){case"c":this.clearInput();for(let t of e.job)t.interrupt();break;case"d":if(!e.inputEnabled||""!==this.inputContent)break;(e.echo||e.exitInput)&&this.writeHistory(e.prompt,e.exitInput),e.eof();break;case"l":this.clearHistory();break;case"u":if(!e.inputEnabled)break;this.clearInput()}return this.updateInput(),void t.preventDefault()}if(e.inputEnabled){switch(t.key){case"ArrowLeft":this.inputCursor>0&&(--this.inputCursor,this.updateInput());break;case"ArrowRight":this.inputCursor<this.inputContent.length&&(++this.inputCursor,this.updateInput());break;case"ArrowUp":e.historyIndex>0&&(--e.historyIndex,this.inputContent=e.history[e.historyIndex],this.inputCursor=this.inputContent.length,this.updateInput());break;case"ArrowDown":e.historyIndex<e.history.length&&(++e.historyIndex,this.inputContent=e.historyIndex===e.history.length?this.inputNewest:e.history[e.historyIndex],this.inputCursor=this.inputContent.length,this.updateInput());break;case"Backspace":this.inputCursor>0&&(this.inputNewest=this.inputContent=this.inputContent.substr(0,this.inputCursor-1)+this.inputContent.substr(this.inputCursor),--this.inputCursor,this.updateInput());break;case"Delete":this.inputCursor<this.inputContent.length&&(this.inputNewest=this.inputContent=this.inputContent.substr(0,this.inputCursor)+this.inputContent.substr(this.inputCursor+1),this.updateInput());break;case"Tab":break;default:return}t.preventDefault(),this.scrollOnInput&&(this.termElement.scrollTop=this.termElement.scrollHeight)}}}))}onExecute(t){this.sh=new t(this),this.sh.execute(),this.updateInput()}onWrite(t){this.outputElement.appendChild(t.print()),this.scrollOnOutput&&(this.termElement.scrollTop=this.termElement.scrollHeight)}onEOF(){}onReturn(t,e){this.writeText("[returned "+e.toString()+"]"),this.inputEnabled=!1}writeHistory(t,e){this.writeRaw(span(t,"prompt")+span(escapeHTML(e),"input"))}clearHistory(){for(;this.outputElement.lastChild;)this.outputElement.removeChild(this.outputElement.lastChild)}clearInput(){let t=this.stdout;this.inputNewest=this.inputContent="",this.inputCursor=0,t&&(t.historyIndex=t.history.length)}updateInput(){let t=this.stdout;if(t.ui!==this.uiElement.firstChild){for(;this.uiElement.lastChild;)this.uiElement.removeChild(this.uiElement.lastChild);t.ui&&this.uiElement.appendChild(t.ui)}this.promptElement.innerHTML=t.prompt;let e=this.inputContent;if(t.password&&(e="*".repeat(e.length)),!t.inputEnabled)return void(this.inputElement.innerHTML=e);let s=span(escapeHTML(e.substr(this.inputCursor,1)||" "),"cursor-block");this.inputElement.innerHTML=escapeHTML(e.substr(0,this.inputCursor))+s+escapeHTML(e.substr(this.inputCursor+1))}}class TermError extends Program{constructor(t){super(t),this.inputEnabled=!0,this.tty=!0,this.stderr=this}onEOF(){}onWrite(t){this.stdout.writeRaw(span(escapeHTML(t.str()),"error"))}}class Monitor extends Program{constructor(t,e,s=null){super(t),this.callback=e,this.ending=s,this.inputEnabled=!0}onEOF(){this.ending?this.ending(this):super.onEOF()}onWrite(t){this.callback(this,t)}}class Printer extends Program{constructor(t,e){super(t),this.content=e}onExecute(){return this.stdout.writeText(this.content),0}}class Caller extends Program{constructor(t,e){super(t),this.fn=e}onExecute(){return this.fn(this),0}}class Shell extends Program{constructor(t){super(t),this.exitInput="exit",this.setReturnCode(0),this.jobRunning=!1,this.jobs=[],this.historyPromise=void 0,this.loaded=!1,this.script=null}onExecute(t){t?(this.script=t,Async.read(t).then((t=>{this.inputEnabled=!0,this.executeCommand(t)}),(t=>{this.stderr.writeText("sh: "+t),this.exit(127)}))):this.stdin.tty?Async.read(".profile").then((t=>{this.inputEnabled=!0,this.executeCommand(t)}),(t=>{this.stdout.writeText("Welcome"),this.inputEnabled=!0,this.loaded=!0,this.stdin.updateInput()})):(this.script="-",this.inputEnabled=!0,this.loaded=!0)}onWrite(t){if(null===this.historyPromise){let t=this.history.slice(this.history.length-Number.parseInt(this.variables.get("HIST_SIZE"))||100);this.historyPromise=Async.write(this.variables.get("HIST_FILE"),t.join("\n")),this.historyPromise.then((()=>{this.historyPromise=null}),(t=>{console.log("failed to write history file")}))}this.executeCommand(t.str())}onEOF(){this.exit(this.exitCode)}onInterrupt(){this.stdin.tty||super.onInterrupt()}onReturn(t,e){if(t===t.job[t.job.length-1]&&this.setReturnCode(e),t.jobReturned())if(this.jobRunning=!1,0!==this.jobs.length)this.nextJob();else if(this.stdin.state===TERMINATED||this.script)this.exit(this.exitCode);else{if(this.stdin.updateInput(),this.loaded)return;this.loaded=!0;let t=this.variables.get("HIST_FILE");t&&Async.read(t).then((t=>{this.historyPromise=null,t&&(this.history=t.split(/\n/).concat(this.history),this.historyIndex=this.history.length)}),(t=>{this.historyPromise=null,console.log("failed to read history file")}))}}executeCommand(t){for(let e of t.split(/\n|;/))this.queueJob(e);this.nextJob()}queueJob(t){if(!t.trim())return;let e=t.split(/\|/).map((t=>t.trim().split(/\s+/)));if(e.some((t=>0===t.length)))return this.stderr.writeText("sh: invalid pipe"),void this.setReturnCode(1);this.jobs.push(e)}nextJob(){if(this.jobRunning||0===this.jobs.length)return;let t=this.jobs.shift(),e=t.map((t=>this.createProcess(t[0])));if(e.some((t=>!t)))return void this.setReturnCode(127);let s=t.map((t=>t.slice(1)));this.jobRunning=!0;for(let t=0;t<e.length;++t)e[t].job=e,t>0&&(e[t].stdin=e[t-1]),t<e.length-1&&(e[t].stdout=e[t+1]);for(let t=e.length-1;t>=0;--t)e[t].execute(s[t].map((t=>"$"===t[0]?this.variables.get(t.substr(1)):t)));this.stdin.updateInput()}setReturnCode(t){this.variables.set("?",t),this.prompt=t?span("$ ","error"):"$ ",this.exitCode=t}createProcess(t){switch(t){case"history":return new Printer(this,this.history.join("\n"));case"read":return new Monitor(this,((t,e)=>{this.variables.set(t.args[0],e.str()),t.exit()}));case"echo":return new Caller(this,(t=>{t.stdout.writeText(t.args.join(" "))}));case"set":return new Caller(this,(t=>{let e=t.args.slice(1).join(" ");this.variables.set(t.args[0],e),t.exit()}));case"exit":return new Caller(this,(t=>{let e=Number.parseInt(t.args[0]||0);Number.isNaN(e)&&(t.stderr.writeText("sh: exit: "+t.args[0]+": numeric argument required"),e=2),this.exit(e)}))}if(bin[t])return new bin[t](this);this.stderr.writeText("sh: command not found: "+t)}}class Editor extends Program{constructor(t){super(t),this.rawInput=!0,this.ui=document.createElement("div"),this.buffer=[],this.mode="n",this.ending=!1,this.promise=null}get line(){return this.buffer[this._cursorLine]}set line(t){this.buffer[this._cursorLine]=t}get cursorLine(){return this._cursorLine}set cursorLine(t){t<0?this._cursorLine=0:t>=this.buffer.length?this._cursorLine=this.buffer.length:this._cursorLine=t}get cursorColumn(){return this._cursorColumn}set cursorColumn(t){0===this.line.length||t<0?this._cursorColumn=0:t>=this.line.length?this._cursorColumn=this.buffer[this._cursorLine].length-("i"===this.mode?0:1):this._cursorColumn=t}get virtualColumn(){return this._virtualColumn}set virtualColumn(t){0===this.line.length||t<0?this._virtualColumn=this._cursorColumn=0:t>=this.line.length?this._virtualColumn=this._cursorColumn=this.line.length-("i"===this.mode?0:1):this._virtualColumn=this._cursorColumn=t}onExecute(t){if(!t)return this.stderr.writeText("vi: no file to edit"),1;this.file=t,Async.read(t).then((t=>{this.buffer=t.split(/\n/);for(let t=0;t<this.buffer.length;++t){let e=this.createLine(this.buffer[t]);this.ui.appendChild(e)}this.cursorLine=0,this.virtualColumn=0,this.updateLine(0),this.updateLineNumber(0)}))}onInput(t){if(!this.ending)if("i"!==this.mode){switch(t.key){case"a":this.mode="i",this.virtualColumn=this.cursorColumn+1,this.updateLine(this.cursorLine);break;case"i":this.mode="i",this.updateLine(this.cursorLine);break;case"o":this.mode="i",this.buffer.splice(this.cursorLine+1,0,""),this.ui.insertBefore(this.createLine(),this.ui.children[this.cursorLine+1]),++this.cursorLine,this.virtualColumn=0,this.updateLine(this.cursorLine-1),this.updateLine(this.cursorLine),this.updateLineNumber(this.cursorLine);break;case"j":this.cursorLine<this.buffer.length-1&&(++this.cursorLine,this.cursorColumn<this.virtualColumn?this.cursorColumn=this.virtualColumn:this.cursorColumn=this.cursorColumn,this.updateLine(this.cursorLine-1),this.updateLine(this.cursorLine));break;case"k":this.cursorLine>0&&(--this.cursorLine,this.cursorColumn<this.virtualColumn?this.cursorColumn=this.virtualColumn:this.cursorColumn=this.cursorColumn,this.updateLine(this.cursorLine+1),this.updateLine(this.cursorLine));break;case"l":this.cursorColumn<this.line.length-1&&(this.virtualColumn=this.cursorColumn+1,this.updateLine(this.cursorLine));break;case"h":this.cursorColumn>0&&(this.virtualColumn=this.cursorColumn-1,this.updateLine(this.cursorLine));break;case"w":{let t,e=!1;t=ID.test(this.line[this.cursorColumn])?ID:SYM.test(this.line[this.cursorColumn])?SYM:null;for(let s=this.cursorColumn;s<this.line.length;++s)if(!(t&&t.test(this.line[s])||(t=null,WS.test(this.line[s])))){this.virtualColumn=s,this.updateLine(this.cursorLine),e=!0;break}e||(this.cursorLine<this.buffer.length-1?(this.virtualColumn=0,++this.cursorLine):this.virtualColumn=this.line.length-1,this.updateLine(this.cursorLine-1),this.updateLine(this.cursorLine))}break;case"b":{if(0===this.cursorColumn){if(0===this.cursorLine)break;--this.cursorLine,this.virtualColumn=this.line.length-1,this.updateLine(this.cursorLine+1)}else this.virtualColumn=this.cursorColumn-1;let t=!1,e=null;for(let s=this.cursorColumn;s>=0;--s)if(e){if(!e.test(this.line[s])){this.virtualColumn=s+1,t=!0;break}}else ID.test(this.line[s])?e=ID:SYM.test(this.line[s])&&(e=SYM);t||(this.virtualColumn=0),this.updateLine(this.cursorLine)}break;case"$":this.virtualColumn=this.cursorColumn=this.line.length-1,this.updateLine(this.cursorLine);break;case"^":this.virtualColumn=this.cursorColumn=0,this.updateLine(this.cursorLine);break;case"q":this.exit();break;case"z":this.ending=!0,this.save();break;default:return}t.preventDefault()}else{switch(t.key){case"Enter":let e=this.line.substr(this.cursorColumn);this.line=this.line.substr(0,this.cursorColumn),this.buffer.splice(this.cursorLine+1,0,e),this.ui.insertBefore(this.createLine(e),this.ui.children[this.cursorLine+1]),++this.cursorLine,this.virtualColumn=0,this.updateLine(this.cursorLine-1),this.updateLine(this.cursorLine),this.updateLineNumber(this.cursorLine);break;case"Escape":this.mode="n",this.cursorColumn>0&&(this.virtualColumn=this.cursorColumn-1),this.updateLine(this.cursorLine);break;case"Backspace":if(this.cursorColumn>0)this.line=this.line.substr(0,this.cursorColumn-1)+this.line.substr(this.cursorColumn),this.virtualColumn=this.cursorColumn-1,this.updateLine(this.cursorLine);else if(this.cursorLine>0){let t=this.buffer[this.cursorLine-1].length;this.buffer[this.cursorLine-1]+=this.line,this.ui.removeChild(this.ui.children[this.cursorLine]),this.buffer.splice(this.cursorLine,1),--this.cursorLine,this.virtualColumn=t,this.updateLine(this.cursorLine),this.updateLineNumber(this.cursorLine+1)}break;default:if(1!==t.key.length)return;this.line=this.line.substr(0,this.cursorColumn)+t.key+this.line.substr(this.cursorColumn),this.virtualColumn=this.cursorColumn+1,this.updateLine(this.cursorLine)}t.preventDefault()}}createLine(t=""){let e=document.createElement("pre"),s=document.createElement("span"),i=document.createElement("span");return s.classList.add("prompt"),i.textContent=t,e.appendChild(s),e.appendChild(i),e}updateLine(t){let e=this.ui.children[t];if(this.cursorLine!==t)return void(e.lastChild.textContent=this.buffer[t]||"\n");let s=this.buffer[t],i=span(escapeHTML(s.substr(this.cursorColumn,1))||" ","i"===this.mode?"cursor-bar":"cursor-block");e.lastChild.innerHTML=escapeHTML(s.substr(0,this.cursorColumn))+i+escapeHTML(s.substr(this.cursorColumn+1));let r=e.getBoundingClientRect();r.top<0?e.scrollIntoView(!0):r.bottom>window.innerHeight&&e.scrollIntoView(!1)}updateLineNumber(t){let e=this.buffer.length.toString().length+1;if(e!==this.lnWidth)return this.lnWidth=e,this.updateLineNumber(0);for(;t<this.buffer.length;++t){let s=this.ui.children[t],i=(t+1).toString()+" ";for(;i.length<e;)i=" "+i;s.firstChild.textContent=i}}save(){if(this.promise)return;let t=this.buffer.join("\n");this.promise=Async.write(this.file,t),this.promise.then((()=>{this.promise=null,this.ending&&this.exit()}),(t=>{this.promise=null,this.ending=!1,this.stderr.writeText(`vi: ${t}`)}))}}class Interpreter extends Program{constructor(t){super(t),this.prompt="> ",this.inputEnabled=!0}onWrite(content){try{this.stdout.write(new ObjectOutput(eval(content.str())))}catch(t){this.stderr.writeText(t.stack)}}}class Cat extends Program{onExecute(){let t=this.args;0!==t.length?Promise.all(t.map(Async.read)).then((t=>{for(let e of t)this.stdout.writeText(e);this.exit()}),(t=>{this.stderr.writeText(`cat: ${t}`),this.exit(1)})):this.inputEnabled=!0}onWrite(t){this.stdout.write(t)}}class Tee extends Program{onExecute(t){this.content=[],this.file=t,this.inputEnabled=!0,this.promise=Async.write(t,""),this.promise.then((()=>this.promise=null))}onWrite(t){this.content.push(t.str()),this.stdout.write(t),this.appendNext()}appendNext(){if(this.state!==RUNNING||this.promise||0===this.content.length)return;let t=this.content.join("\n")+"\n";this.content=[],this.promise=Async.append(this.file,t),this.promise.then((()=>{this.promise=null,this.appendNext()}))}}class List extends Program{onExecute(){Async.list(".").then((t=>{let e=t.map((t=>new TextOutput(t)));this.stdout.write(new ArrayOutput(e,"multicolumn")),this.exit()}),(t=>{this.stderr.writeText(`ls: ${t}`),this.exit(1)}))}}class Move extends Program{onExecute(t,e){return t?e?void Async.move(t,e).then((()=>{this.exit()}),(t=>{this.stderr.writeText(`mv: ${t}`),this.exit(1)})):(this.stderr.writeText("mv: missing destination file operand"),1):(this.stderr.writeText("mv: missing file operand"),1)}}class Remove extends Program{onExecute(){let t=this.args;if(0===t.length)return this.stderr.writeText("rm: missing operand"),1;Promise.all(t.map(Async.remove)).then((()=>{this.exit()}))}}class Curl extends Program{onExecute(t){if(!t)return this.stderr.writeText("curl: missing url"),1;this.promise=Async.request("GET",t),this.promise.then((t=>{this.stdout.writeText(t),this.exit()}),(t=>{this.stderr.writeText(`curl: ${t}`),this.exit(1)}))}onInterrupt(){this.promise.abort(),super.onInterrupt()}}class Head extends Program{onExecute(t){return this.counter=Number.parseInt(t),Number.isNaN(this.counter)?(this.stderr.writeText("head: invalid number of items"),1):this.counter<=0?0:void(this.inputEnabled=!0)}onWrite(t){let e=t.items().slice(0,this.counter);this.stdout.write(new ArrayOutput(e))?(this.counter-=e.length,0!==this.counter||this.exit(0)):this.exit()}}class Tail extends Program{onExecute(t){return this.counter=Number.parseInt(t),Number.isNaN(this.counter)?(this.stderr.writeText("tail: invalid number of items"),1):this.counter<=0?0:(this.inputEnabled=!0,void(this.items=[]))}onWrite(t){for(let e of t.items())this.items.length===this.counter&&this.items.shift(),this.items.push(e)}onEOF(){this.stdout.write(new ArrayOutput(this.items)),this.exit(0)}}class Grep extends Program{onExecute(t){if(void 0===t)return this.stderr.writeText("grep: missing pattern"),2;this.inputEnabled=!0,this.pattern=new RegExp(t),this.matched=!1}onWrite(t){let e=t.items().filter((t=>this.pattern.test(t.str())));0!==e.length&&(this.stdout.write(new ArrayOutput(e)),this.matched=!0)}onEOF(){this.exit(this.matched?0:1)}}class Processes extends Program{onExecute(){this.tree=[];let t=this.stdin;return this.printTree(t,0),this.stdout.write(new ArrayOutput(this.tree.map((t=>new TextOutput(t))))),0}printTree(t,e){this.tree.push(" ".repeat(e)+t.constructor.name);for(let s of t.children)this.printTree(s,e+2)}}class Sleep extends Program{onExecute(t){let e=Number.parseFloat(t);if(Number.isNaN(e))return this.stderr.writeText("sleep: invalid time"),1;this.promise=Async.timeout(1e3*t),this.promise.then((()=>this.exit()))}onInterrupt(){this.promise.abort(),super.onInterrupt()}}class Clear extends Program{onExecute(){return this.stdout.clearHistory(),0}}const bin={sh:Shell,vi:Editor,js:Interpreter,cat:Cat,tee:Tee,ls:List,mv:Move,rm:Remove,curl:Curl,head:Head,tail:Tail,grep:Grep,sleep:Sleep,ps:Processes,clear:Clear};let term=null;term=new Term,term.execute([Shell])})();
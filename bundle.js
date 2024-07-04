(()=>{"use strict";var t,e,i,s,r={993:(t,e,i)=>{i.d(e,{A:()=>p});var s,r=i(992);class h{#t;#e;#i;#s;#r;#h;constructor(t,e){this.#i=Math.abs(e.x-t.x),this.#s=Math.abs(e.y-t.y),this.#r=this.#i/2,this.#h=this.#s/2,this.#t=new r.A(this.#r+t.x,this.#h+t.y),this.#e=this.#t.copy()}reset(){this.#e=this.#t.copy()}move(t){this.#e.add(t)}collide(t){return t.left<this.right&&t.right>this.left&&t.top<this.bottom&&t.bottom>this.top}get position(){return this.#e}get topLeft(){return r.A.subtract(this.#e,{x:this.#r,y:this.#h})}get bottomRight(){return r.A.add(this.#e,{x:this.#r,y:this.#h})}get top(){return this.#e.y-this.#h}get bottom(){return this.#e.y+this.#h}get left(){return this.#e.x-this.#r}get right(){return this.#e.x+this.#r}get x(){return this.#e.x}get y(){return this.#e.y}get width(){return this.#i}get height(){return this.#s}}class n extends h{#n;#o=0;#a=0;#l=null;constructor({position:t,size:e=20,brain:i}){const s=.5*e;super({x:t.x-s,y:t.y-s},{x:t.x+s,y:t.y+s}),this.#n=e,i&&(this.#l=i)}reset(){super.reset(),this.#o=0,this.#a=0}jump(){this.#o=n.#c}update(){this.#o=Math.max(Math.min(this.#o+n.#u,n.#d),n.#c);const t={x:0,y:this.#o};this.move(t)}incrementScore(){this.#a++}get normalizedVelocity(){return(this.#o-n.#c)/n.#d}get size(){return this.#n}get score(){return this.#a}get brain(){return this.#l}static#d=40;static#c=-8;static#u=.5}class o{#e;#p;#g;constructor(t,e){e=Math.min(o.#f-o.#y/2-o.#x,Math.max(o.#m+o.#y/2+o.#x,e)),this.#e=new r.A(t,e);const i=.5*o.#w,s=.5*o.#y;this.#p=new h({x:t-i,y:o.#m},{x:t+i,y:e-s}),this.#g=new h({x:t-i,y:e+s},{x:t+i,y:o.#f})}update(t,e){const i=r.A.multiply({x:-2,y:0},t*e);this.#p.move(i),this.#g.move(i),this.#e.add(i)}nextIfThereIsSpaceTo(t){const e=this.#b();return e.x<t+o.#w/2?new o(e.x,e.y):null}#b(){const t=this.#e.x+o.#w+o.#A,e=100*Math.random()+100,i=this.#e.y-e<o.#m+o.#y/2+o.#x,s=this.#e.y+e>o.#f-o.#y/2-o.#x;let r=this.#e.y;return i?r+=e:s?r-=e:r+=e*Math.sign(Math.random()-.5),{x:t,y:r}}get left(){return this.#e.x-o.#w/2}get right(){return this.#e.x+o.#w/2}get top(){return this.#p}get bottom(){return this.#g}static#y=150;static#w=50;static#A=300;static#m=0;static#f=0;static#x=20;static set TOP_BOUNDARY(t){o.#m=t}static set BOTTOM_BOUNDARY(t){o.#f=t}static get SIZE(){return o.#w}}class a{#v;constructor(){this.#v=2*Math.random()-1}mutate(t){const e=new a;var i;return e.#v=(i=this.#v)+(2*Math.random()-1-i)*t,e}toJSON(){return this.#v}get weight(){return this.#v}static create(t){const e=new a;return e.#v=t,e}}class l{#S=0;#T=0;#O=[];constructor(t,e){this.#T="number"==typeof e?e:2*Math.random()-1,this.#O=t}feedForward(t){const e=this.#O.reduce(((e,i,s)=>e+t[s].#S*i.weight),0);this.#S=1/(1+Math.exp(-e-this.#T))}mutate(t){return new l(this.#O.map((e=>e.mutate(t))),(e=this.#T)+(2*Math.random()-1-e)*t);var e}toJSON(){return{bias:this.#T,edges:this.#O.map((t=>t.toJSON()))}}set value(t){this.#S=t}get value(){return this.#S}get bias(){return this.#T}get edges(){return this.#O}static create({bias:t,edges:e}){return new l(e.map((t=>a.create(t))),t)}}class c{#P=[];constructor(t){this.#P=t}feedForward(t){for(const e of this.#P)e.feedForward(t.#P)}mutate(t){return new c(this.#P.map((e=>e.mutate(t))))}toJSON(){return this.#P.map((t=>t.toJSON()))}get nodes(){return this.#P}static create(t){return new c(t.map((t=>l.create(t))))}}class u{#I;#E;#N;#B;constructor(t,e,i){this.#I=t,this.#E=e,this.#N=i;const s=new c(Array.from({length:t},(()=>new l([],0)))),r=[new c(Array.from({length:e[0]},(()=>new l(Array.from({length:t},(()=>new a))))))];for(let i=1;i<e.length;i++)r.push(new c(Array.from({length:e[i-1]},(()=>new l(Array.from({length:t},(()=>new a)))))));const h=new c(Array.from({length:i},(()=>new l(Array.from({length:e[e.length-1]},(()=>new a))))));this.#B=[s,...r,h]}feedForward(t){this.#B[0].nodes.forEach(((e,i)=>{e.value=t[i]}));for(let t=1;t<this.#B.length;t++)this.#B[t].feedForward(this.#B[t-1]);return this.#B[this.#B.length-1].nodes.map((t=>t.value))}mutate(t){const e=new u(this.#I,this.#E,this.#N);for(let i=1;i<this.#B.length;i++)e.#B[i]=this.#B[i].mutate(t);return e}toJSON(){return{input:this.#I,hidden:this.#E,output:this.#N,layers:this.#B.map((t=>t.toJSON()))}}get layers(){return this.#B}static create(t){const{input:e,hidden:i,output:s,layers:r}=JSON.parse(t),h=new u(e,i,s);for(let t=0;t<r.length;t++)h.#B[t]=c.create(r[t]);return h}save(){localStorage.setItem(u.#_,JSON.stringify(this))}static load(t){let e=localStorage.getItem(this.#_);return e||(localStorage.setItem(this.#_,t),e=t),u.create(t)}static#_="brain"}class d{#M;#n;#D;#R=null;#k;#Y;constructor(t,e,i){this.#M=1,this.#n=t,this.#D=Array.from({length:t},e),this.#Y=e,this.#k=i}update(){if(0===this.remaining)return;const t=this.#D.reduce(((t,e)=>this.#k(e)>this.#k(t)?e:t),this.#D[0]),e=this.#k(t);e>0&&(!this.#R||e>this.#k(this.#R))&&(this.#R=t)}eliminate(t){this.#D.splice(t,1)}nextGeneration(){this.#M++;const t=[];for(let e=0;e<this.#n;e++)t.push(this.#Y(this.#R??void 0));this.#R&&(t[0]=this.#R),this.#D=t}get number(){return this.#M}get population(){return this.#D}get best(){return this.#R}get remaining(){return this.#D.length}}!function(t){t[t.TRAIN=0]="TRAIN",t[t.TEST=1]="TEST",t[t.COMPETE=2]="COMPETE",t[t.PLAY=3]="PLAY"}(s||(s={}));class p{#z;#G;#U=0;#L=[];#W=!1;#C;#H=!1;#p;#g;#F;#V;#Z;#J;#q;#K;#j=s.TEST;constructor(t,e){this.load(),this.#Z=u.load(e),this.#z=new h({x:0,y:0},{x:t.width,y:t.height}),this.#p=this.#z.top+20,this.#g=this.#z.bottom-20,this.#F=new h({x:0,y:0},{x:this.#z.right,y:this.#p}),this.#V=new h({x:0,y:this.#g},{x:this.#z.right,y:this.#z.bottom}),o.TOP_BOUNDARY=this.#p,o.BOTTOM_BOUNDARY=this.#g,this.#C=p.#$,this.#G=t,this.#L=this.#X(),this.#q=this.#Q(this.#Z),this.#K=this.#Q(),this.#J=new d(p.#tt,(t=>this.#Q(t&&t.brain?t.brain.mutate(p.#et):this.#Z?this.#Z.mutate(p.#et):new u(p.#it,p.#st,p.#rt))),(t=>t.score)),this.#J.population[0]=this.#Q(this.#Z)}#Q(t){return new n({position:this.#z.position.copy({x:100}),brain:t})}#X(){const t=[];let e=new o(this.#z.position.x,this.#z.position.y);for(t.push(e);;){const i=e.nextIfThereIsSpaceTo(this.#z.right);if(null===i)break;t.push(i),e=i}return t}reset(){this.save();let t=0;if(this.#j===s.TRAIN){const e=this.#J.best;e&&(t=e.score,e.reset()),this.#J.nextGeneration()}else this.#j===s.TEST?(t=this.#q.score,this.#q.reset()):this.#j===s.PLAY?(t=this.#K.score,this.#K.reset()):this.#j===s.COMPETE&&(t=Math.max(this.#K.score,this.#q.score),this.#K.reset(),this.#q.reset());t>this.#U&&(this.#U=t),this.#W=!1,this.#L=this.#X(),this.#C=p.#$}save(){localStorage.setItem(p.#ht,this.#U.toString()),this.#J.best&&this.#J.best.brain&&(this.#Z=this.#J.best.brain,this.#Z.save())}load(){this.#U=+(localStorage.getItem(p.#ht)??0)}update(t){this.#C+=1e-4;for(const e of this.#L)e.update(t,this.#C);this.#L[0].right<this.#z.left&&this.#L.shift();const e=this.#L.at(-1);if(e){const t=e.nextIfThereIsSpaceTo(this.#z.right);t&&this.#L.push(t)}const i=this.#nt();if(this.#j===s.TRAIN?(this.#J.population.forEach(((t,e)=>{this.#ot(t,i),(this.#F.collide(t)||this.#V.collide(t))&&this.#J.eliminate(e),this.#at(i,t)&&this.#J.eliminate(e)})),this.#J.update()):this.#j===s.TEST&&(this.#ot(this.#q,i),(this.#F.collide(this.#q)||this.#V.collide(this.#q))&&(this.#W=!0),this.#at(i,this.#q)&&(this.#W=!0)),i===this.#L[1]){if(!this.#H){if(this.#j===s.TRAIN)for(const t of this.#J.population)t.incrementScore();else this.#j===s.TEST&&this.#q.incrementScore();this.#H=!0}}else this.#H=!1;this.#j===s.TRAIN&&0===this.#J.remaining&&(this.#W=!0),this.#W&&this.reset()}#ot(t,e){t.update(),(t.brain?.feedForward([t.top/this.#z.height,t.bottom/this.#z.height,t.normalizedVelocity,e.top.bottom/this.#z.height,e.bottom.top/this.#z.height,e.left/this.#z.width,e.right/this.#z.width])||[0])[0]>.5&&t.jump()}#at({top:t,bottom:e},i){return t.collide(i)||e.collide(i)}#nt(){return[this.#L[0],this.#L[1]].find((t=>t.right>this.#J.population[0].left))}render(){if(this.#lt(),this.#ct(),this.#j===s.TRAIN){for(const t of this.#J.population)this.#ut(t);this.#ut(this.#J.best||this.#J.population[0],!0),this.#dt(this.#U,this.#J.best?this.#J.best.score:this.#J.population[0].score)}else this.#j===s.TEST&&(this.#ut(this.#q),this.#dt(this.#U,this.#q.score))}#lt(){this.#G.beginPath().rect(this.#F.topLeft,this.#F.width,this.#F.height).rect(this.#V.topLeft,this.#V.width,this.#V.height).closePath().fill("#0f0").stroke({color:"#000",width:2})}#ct(){for(const{top:t,bottom:e}of this.#L)this.#G.beginPath().rect(t.topLeft,t.width,t.height).rect(e.topLeft,e.width,e.height).closePath().fill("#0f0").stroke({color:"black",width:2})}#ut(t,e=!1){this.#G.beginPath().circle(t.position,.5*t.size).closePath().fill(e?"#f00":"#ff0").stroke({color:"black",width:2})}#dt(t,e){this.#G.text({text:`Best score: ${t}`,at:this.#G.center.copy().subtract({x:0,y:130}),fillStyle:"#fff",strokeStyle:"transparent"}).text({text:e.toString(),at:this.#G.center.copy().subtract({x:0,y:100}),size:36,fillStyle:"#fff",strokeStyle:"#fff"})}renderNetwork(t){if(this.#j===s.PLAY)return;let e;if(e=this.#j===s.TRAIN?this.#J.best||this.#J.population[0]:this.#q,!e.brain)return;const i=this.#j===s.TRAIN?60:10,r=t.width-80-20,h=t.height-i-10-20;this.#j===s.TRAIN&&t.text({text:`Generation: ${this.#J.number}`,at:{x:40,y:i-20},textAlign:"start",fillStyle:"#fff",strokeStyle:"transparent"}).text({text:`Population: ${this.#J.remaining}`,at:{x:40,y:i},textAlign:"start",fillStyle:"#fff",strokeStyle:"transparent"});const n=r/(e.brain.layers.length-1);let o=50;for(let s=1;s<e.brain.layers.length;s++){const r=e.brain.layers[s-1],a=e.brain.layers[s],l=o,c=o+n,u=h/r.nodes.length,d=h/a.nodes.length;let p=i+.5*u+10;for(let e=0;e<r.nodes.length;e++){let s=i+.5*d+10;for(let i=0;i<a.nodes.length;i++){const r=a.nodes[i].edges[e];t.beginPath().line({x:l,y:p},{x:c,y:s}).closePath().stroke({color:r.weight<0?"#f00":"#00f",width:Math.abs(2*r.weight)+1}),s+=d}p+=u}o+=n}o=50;for(const s of e.brain.layers){const e=h/s.nodes.length;let r=i+.5*e+10;for(const i of s.nodes)t.beginPath().circle({x:o,y:r},10).closePath().fill("#012").fill(`rgba(255, 255, 0, ${Math.abs(i.value).toFixed(2)})`).stroke({color:i.bias<0?"#f00":"#00f",width:2}),r+=e;o+=n}}get isOver(){return this.#W}static#$=1;static#ht="highscore";static#it=7;static#st=[4];static#rt=1;static#et=.01;static#tt=1e3}},156:(t,e,i)=>{i.a(t,(async(t,e)=>{try{var s=i(203),r=i(993);const h=new s.A("network",600,300);h.background("#012");const n=new s.A("canvas",innerWidth,innerHeight);n.background("skyblue");const o=await fetch("brain.json").then((t=>t.text())),a=new r.A(n,o);let l=0;function c(t){const e=(t-l)/15;l=t,a.update(e),n.clear(),a.render(),h.clear(),a.renderNetwork(h),requestAnimationFrame(c)}c(0),addEventListener("resize",(()=>{n.resize(innerWidth,innerHeight),a.render()})),e()}catch(u){e(u)}}),1)},203:(t,e,i)=>{i.d(e,{A:()=>r});var s=i(992);class r{#pt;#G;#gt;#ft=new s.A(0,0);#yt="#fff";#xt="#fff";#mt=1;#wt=[];#bt=0;#At="start";#vt="alphabetic";#St="10px sans-serif";#Tt=1;#Ot=1;constructor(t,e,i){this.#pt=t,this.#G=document.getElementById(t),this.#gt=this.#G.getContext("2d"),this.fillStyle="#fff",this.strokeStyle="#fff",this.lineWidth=1,this.lineDash=[],this.lineDashOffset=0,this.textAlign="start",this.textBaseline="alphabetic",this.font="10px sans-serif",this.globalAlpha=1,this.resize(e,i)}resize(t,e){return this.#G.width=t,this.#G.height=e,this.#Ot=t/e,this.#ft=new s.A(+(t/2).toFixed(4),+(e/2).toFixed(4)),this}drawImage(t,e,i,s){return this.context.drawImage(t,e.x,e.y,i,s),this}rotateAndDrawImage(t,e,i,s,r){return this.save().translate(e).rotate(-r).drawImage(t,{x:-i/2,y:-s/2},i,s).restore(),this}circle(t,e){return this.context.arc(t.x,t.y,e,0,2*Math.PI),this}rect(t,e,i){return this.context.rect(t.x,t.y,e,i),this}line(t,e){return this.context.moveTo(t.x,t.y),this.context.lineTo(e.x,e.y),this}moveTo(t){return this.context.moveTo(t.x,t.y),this}lineTo(t){return this.context.lineTo(t.x,t.y),this}text({text:t,at:e,textAlign:i="center",textBaseline:s="middle",fillStyle:r=this.#yt,strokeStyle:h=this.#xt,size:n=16,font:o="Arial"}){return this.save(),this.context.textAlign=i,this.context.textBaseline=s,this.context.fillStyle=r,this.context.strokeStyle=h,this.context.font=`${n}px ${o}`,this.context.fillText(t,e.x,e.y),this.context.strokeText(t,e.x,e.y),this.restore(),this}beginPath(){return this.context.beginPath(),this}closePath(){return this.context.closePath(),this}stroke({color:t=this.#xt,width:e=this.#mt,dash:i=this.#wt}={}){return this.save(),this.context.strokeStyle=t,this.context.lineWidth=e,this.context.setLineDash(Array.from(i)),this.context.stroke(),this.restore(),this}fill(t=this.#yt){return this.save(),this.context.fillStyle=t,this.context.fill(),this.restore(),this}background(t="#000"){return this.#G.style.backgroundColor=t,this}clear(){return this.#G.width=this.width,this.#G.height=this.height,this}translate(t){return this.context.translate(t.x,t.y),this}rotate(t){return this.context.rotate(t),this}save(){return this.context.save(),this}restore(){return this.context.restore(),this}requestPointerLock(){return this.#G.requestPointerLock(),this}set fillStyle(t){this.#yt=t,this.context.fillStyle=t}set strokeStyle(t){this.#xt=t,this.context.strokeStyle=t}set lineWidth(t){this.#mt=t,this.context.lineWidth=t}set lineDash(t){this.#wt=t,this.context.setLineDash(Array.from(t))}set lineDashOffset(t){this.#bt=t,this.context.lineDashOffset=t}set textAlign(t){this.#At=t,this.context.textAlign=t}set textBaseline(t){this.#vt=t,this.context.textBaseline=t}set font(t){this.#St=t,this.context.font=t}set globalAlpha(t){this.#Tt=t,this.context.globalAlpha=t}get id(){return this.#pt}get canvas(){return this.#G}get context(){if(!this.#gt)throw new Error("CanvasRenderingContext2D is null");return this.#gt}get center(){return this.#ft}get width(){return this.#G.width}get height(){return this.#G.height}get aspectRatio(){return this.#Ot}get fillStyle(){return this.#yt}get strokeStyle(){return this.#xt}get lineWidth(){return this.#mt}get lineDash(){return this.#wt}get lineDashOffset(){return this.#bt}get textAlign(){return this.#At}get textBaseline(){return this.#vt}get font(){return this.#St}get globalAlpha(){return this.#Tt}}},992:(t,e,i)=>{i.d(e,{A:()=>r});class s{#Pt;constructor(t,e,i,s,r,h,n,o,a){this.#Pt=[t,e,i,s,r,h,n,o,a]}set(t,e,i,s,r,h,n,o,a){return this.#Pt[0]=t,this.#Pt[1]=e,this.#Pt[2]=i,this.#Pt[3]=s,this.#Pt[4]=r,this.#Pt[5]=h,this.#Pt[6]=n,this.#Pt[7]=o,this.#Pt[8]=a,this}copy(){return new s(...this.#Pt)}multiply(t){const e=this.#Pt,i=t.#Pt,s=[0,0,0,0,0,0,0,0,0];return s[0]=e[0]*i[0]+e[1]*i[3]+e[2]*i[6],s[1]=e[0]*i[1]+e[1]*i[4]+e[2]*i[7],s[2]=e[0]*i[2]+e[1]*i[5]+e[2]*i[8],s[3]=e[3]*i[0]+e[4]*i[3]+e[5]*i[6],s[4]=e[3]*i[1]+e[4]*i[4]+e[5]*i[7],s[5]=e[3]*i[2]+e[4]*i[5]+e[5]*i[8],s[6]=e[6]*i[0]+e[7]*i[3]+e[8]*i[6],s[7]=e[6]*i[1]+e[7]*i[4]+e[8]*i[7],s[8]=e[6]*i[2]+e[7]*i[5]+e[8]*i[8],this.#Pt=s,this}get data(){return this.#Pt}static identity(){return new s(1,0,0,0,1,0,0,0,1)}static translation(t,e){return new s(1,0,t,0,1,e,0,0,1)}static rotation(t){const e=Math.cos(t),i=Math.sin(t);return new s(e,-i,0,i,e,0,0,0,1)}static scale(t,e){return new s(t,0,0,0,e,0,0,0,1)}}class r{#It=0;#Et=0;#Nt=0;#Bt=0;constructor(t,e){this.x=t,this.y=e}set(t){return this.x=t.x,this.y=t.y,this}copy({x:t=this.x,y:e=this.y}={}){return new r(t,e)}add(t){return this.x+=t.x,this.y+=t.y,this}subtract(t){return this.x-=t.x,this.y-=t.y,this}multiply(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t,this.y/=t,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}transform(t){const{x:e,y:i}=this,s=t.data;return this.x=e*s[0]+i*s[1]+1*s[2],this.y=e*s[3]+i*s[4]+1*s[5],this}translate(t){return this.transform(s.translation(t.x,t.y))}rotate(t){return this.transform(s.rotation(t))}scale(t){return this.transform(s.scale(t.x,t.y))}normalize(){const t=this.magnitude;return 0!==t&&this.divide(t),this}set x(t){this.#It=t,this.#Nt=Math.atan2(this.#Et,t),this.#Bt=Math.sqrt(t**2+this.#Et**2)}get x(){return this.#It}set y(t){this.#Et=t,this.#Nt=Math.atan2(t,this.#It),this.#Bt=Math.sqrt(this.#It**2+t**2)}get y(){return this.#Et}set theta(t){this.#Nt=t,this.#It=this.#Bt*Math.cos(t),this.#Et=this.#Bt*Math.sin(t)}get theta(){return this.#Nt}set magnitude(t){this.#Bt=t,this.#It=t*Math.cos(this.#Nt),this.#Et=t*Math.sin(this.#Nt)}get magnitude(){return this.#Bt}set r(t){this.magnitude=t}get r(){return this.magnitude}static add(t,e){return new r(t.x,t.y).add(e)}static subtract(t,e){return new r(t.x,t.y).subtract(e)}static multiply(t,e){return new r(t.x,t.y).multiply(e)}static divide(t,e){return new r(t.x,t.y).divide(e)}static dot(t,e){return new r(t.x,t.y).dot(e)}static cross(t,e){return new r(t.x,t.y).cross(e)}static transform(t,e){return new r(t.x,t.y).transform(e)}static translate(t,e){return new r(t.x,t.y).translate(e)}static rotate(t,e){return new r(t.x,t.y).rotate(e)}static scale(t,e){return new r(t.x,t.y).scale(e)}static normalize(t){return new r(t.x,t.y).normalize()}static fromPolar(t,e){return new r(e*Math.cos(t),e*Math.sin(t))}}}},h={};function n(t){var e=h[t];if(void 0!==e)return e.exports;var i=h[t]={exports:{}};return r[t](i,i.exports,n),i.exports}t="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",e="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",i="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",s=t=>{t&&t.d<1&&(t.d=1,t.forEach((t=>t.r--)),t.forEach((t=>t.r--?t.r++:t())))},n.a=(r,h,n)=>{var o;n&&((o=[]).d=-1);var a,l,c,u=new Set,d=r.exports,p=new Promise(((t,e)=>{c=e,l=t}));p[e]=d,p[t]=t=>(o&&t(o),u.forEach(t),p.catch((t=>{}))),r.exports=p,h((r=>{var h;a=(r=>r.map((r=>{if(null!==r&&"object"==typeof r){if(r[t])return r;if(r.then){var h=[];h.d=0,r.then((t=>{n[e]=t,s(h)}),(t=>{n[i]=t,s(h)}));var n={};return n[t]=t=>t(h),n}}var o={};return o[t]=t=>{},o[e]=r,o})))(r);var n=()=>a.map((t=>{if(t[i])throw t[i];return t[e]})),l=new Promise((e=>{(h=()=>e(n)).r=0;var i=t=>t!==o&&!u.has(t)&&(u.add(t),t&&!t.d&&(h.r++,t.push(h)));a.map((e=>e[t](i)))}));return h.r?l:n()}),(t=>(t?c(p[i]=t):l(d),s(o)))),o&&o.d<0&&(o.d=0)},n.d=(t,e)=>{for(var i in e)n.o(e,i)&&!n.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n(156)})();
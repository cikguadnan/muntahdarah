/* Cikgu K procedural 3D avatar — no downloaded character assets required. */
(async function(){
const host=document.getElementById('avatar3d'),fallback=document.getElementById('teacher');if(!host)return;
try{
const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js');
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,100);camera.position.set(0,1.8,8.3);camera.lookAt(0,.8,0);
const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0,0);host.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xfff5e7,0x5c6b73,2.2));const key=new THREE.DirectionalLight(0xffe7c6,3.3);key.position.set(-3,5,5);scene.add(key);const rim=new THREE.DirectionalLight(0xb7f5ec,1.8);rim.position.set(3,3,-2);scene.add(rim);
const mat=(c,r=.85)=>new THREE.MeshStandardMaterial({color:c,roughness:r});const skin=mat('#c98f6e'),shadowSkin=mat('#b97959'),hijab=mat('#426b60'),hijabDark=mat('#2b5049'),dress=mat('#557d72'),white=mat('#fff9f0'),iris=mat('#3a2c27'),black=mat('#1e1b22'),lip=mat('#9a5654'),gold=mat('#d4b16a'),glass=new THREE.MeshPhysicalMaterial({color:0xd5edff,transparent:true,opacity:.14,roughness:.05});
function mesh(g,m,p,parent=scene){const o=new THREE.Mesh(g,m);o.position.set(...p);parent.add(o);return o}
function ball(parent,m,p,s){const o=mesh(new THREE.SphereGeometry(1,32,20),m,p,parent);o.scale.set(...s);return o}
const body=new THREE.Group();scene.add(body);
const torso=mesh(new THREE.CylinderGeometry(.78,.92,1.75,36),dress,[0,-.45,0],body);torso.scale.z=.66;
ball(body,hijab,[0,1.18,-.14],[.74,1.03,.47]);ball(body,hijabDark,[0,1.25,-.22],[.65,.92,.42]);
const head=new THREE.Group();head.position.set(0,1.35,.27);body.add(head);
ball(head,skin,[0,0,.25],[.55,.72,.40]);
ball(head,hijab,[0,.57,.08],[.62,.22,.45]);
for(const side of [-1,1]){ball(head,hijab,[side*.52,-.02,.08],[.19,.69,.35]);ball(head,skin,[side*.53,-.03,.19],[.10,.16,.10]);}
const nose=ball(head,shadowSkin,[0,-.1,.64],[.105,.17,.13]);
const mouth=ball(head,lip,[0,-.40,.592],[.20,.045,.025]);const mouthInner=ball(head,mat('#5c1826'),[0,-.40,.62],[.16,.015,.025]);
const eyes=[],pupils=[],brows=[];
for(const side of [-1,1]){const x=side*.235;ball(head,white,[x,.105,.591],[.174,.112,.065]);const p=ball(head,iris,[x,.105,.652],[.076,.087,.029]);pupils.push(p);ball(p,black,[0,0,.028],[.55,.65,.35]);ball(p,white,[-.018,.032,.045],[.018,.018,.01]);eyes.push(ball(head,skin,[x,.235,.608],[.19,.025,.045]));const brow=ball(head,hijabDark,[x,.275,.59],[.20,.038,.04]);brows.push(brow)}
for(const side of [-1,1]){const x=side*.24;const lens=mesh(new THREE.TorusGeometry(.185,.018,8,40),black,[x,.11,.66],head);lens.scale.y=.78;ball(head,glass,[x,.11,.655],[.18,.13,.01])}
ball(head,black,[0,.125,.66],[.08,.018,.02]);
const arms=[];for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.69,.03,0);body.add(arm);const sleeve=ball(arm,dress,[side*.12,-.47,.03],[.28,.67,.27]);ball(arm,skin,[side*.14,-.96,.12],[.19,.22,.15]);arms.push(arm)}
const brooch=ball(body,gold,[.45,.52,.51],[.08,.08,.035]);ball(body,white,[.45,.52,.55],[.026,.026,.02]);
const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(host);resize();
let lookX=0,lookY=0,blink=0;window.addEventListener('pointermove',e=>{lookX=Math.max(-1,Math.min(1,(e.clientX-innerWidth/2)/(innerWidth/2)));lookY=Math.max(-1,Math.min(1,(e.clientY-innerHeight/2)/(innerHeight/2)))},{passive:true});window.addEventListener('pointerdown',e=>{lookX=Math.max(-1,Math.min(1,(e.clientX-innerWidth/2)/(innerWidth/2)));lookY=Math.max(-1,Math.min(1,(e.clientY-innerHeight/2)/(innerHeight/2)))},{passive:true});
fallback.style.visibility='hidden';host.style.display='block';const clock=new THREE.Clock();let nextBlink=2;
function frame(){requestAnimationFrame(frame);const t=clock.getElapsedTime(),stress=window.cikguStress||0,vomit=document.getElementById('scene').classList.contains('vomit');const mood=stress/100;body.position.y=Math.sin(t*2.1)*.022;body.rotation.z=Math.sin(t*(2+mood*4))*(.012+mood*.045);head.rotation.y+=(lookX*.18-head.rotation.y)*.055;head.rotation.x+=(-lookY*.12+(vomit?.28:0)-head.rotation.x)*.05;head.rotation.z=Math.sin(t*1.6)*(.018+mood*.06);pupils.forEach((p)=>{if(p.userData.baseX===undefined)p.userData.baseX=p.position.x;p.position.x=p.userData.baseX+lookX*.035;p.position.y=.105-lookY*.025});if(t>nextBlink){blink=1;nextBlink=t+2+Math.random()*3}blink=Math.max(0,blink-.12);eyes.forEach(e=>{e.position.y=.235-blink*.105;e.scale.y=.025+blink*.10});brows.forEach((b,i)=>{b.rotation.z=(i===0?1:-1)*mood*.3;b.position.y=.275+mood*.025});mouth.scale.y=.045*(vomit?4:1+mood*.45);mouthInner.scale.y=.015*(vomit?11:1+mood*2);arms.forEach((a,i)=>{a.rotation.z=(i===0?1:-1)*(mood*.8+(vomit?.4:0));a.rotation.x=-mood*.5});if(vomit)body.rotation.x=Math.sin(t*14)*.07;else body.rotation.x=0;renderer.render(scene,camera)}
frame();
}catch(e){console.warn('3D avatar unavailable; retaining animated fallback',e);host.style.display='none';fallback.style.visibility='visible'}
})();
/* Cikgu K GLB loader. Add assets/cikgu-k.glb to enable the real rigged avatar.
   If the asset is missing, the original 2D teacher remains visible.
   Requires GLB with embedded textures and ideally ARKit-named facial morph targets. */
(async()=>{
const host=document.getElementById('avatar3d'),fallback=document.getElementById('teacher');if(!host)return;
let renderer,scene,raf;
try{
const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js');
const {GLTFLoader}=await import('https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/loaders/GLTFLoader.js');
const url='./assets/cikgu-k.glb';
const response=await fetch(url,{method:'HEAD',cache:'no-cache'});if(!response.ok)throw new Error('Character GLB not yet uploaded');
const gltf=await new GLTFLoader().loadAsync(url);
scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(32,1,.1,100);camera.position.set(0,1.6,6.8);camera.lookAt(0,1.35,0);
renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;host.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xfff5e7,0x667b87,2));const light=new THREE.DirectionalLight(0xffe7cc,3);light.position.set(-3,5,5);scene.add(light);const rim=new THREE.DirectionalLight(0xc2f7f2,1.5);rim.position.set(3,3,-4);scene.add(rim);
const character=gltf.scene;scene.add(character);
const box=new THREE.Box3().setFromObject(character),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());if(size.y<.01)throw new Error('Invalid model bounds');
const scale=3.4/size.y;character.scale.setScalar(scale);character.position.set(-center.x*scale,-box.min.y*scale-1.55,-center.z*scale);
const morphs=[],bones={};character.traverse(o=>{if(o.isMesh&&o.morphTargetDictionary&&o.morphTargetInfluences)morphs.push(o);if(o.isBone)bones[o.name.toLowerCase()]=o});
const setMorph=(names,value)=>{for(const m of morphs){for(const n of names){const idx=m.morphTargetDictionary[n];if(idx!==undefined)m.morphTargetInfluences[idx]=Math.max(0,Math.min(1,value))}}};
const bone=(...names)=>{for(const n of names){const b=Object.entries(bones).find(([key])=>key===n||key.endsWith(n));if(b)return b[1]}return null};
const head=bone('head','mixamorighead'),neck=bone('neck','mixamorigneck'),eyeL=bone('lefteye','eye_l','mixamoriglefteye'),eyeR=bone('righteye','eye_r','mixamorigrighteye');
const base=new Map();for(const b of [head,neck,eyeL,eyeR])if(b)base.set(b,b.rotation.clone());
const mixer=new THREE.AnimationMixer(character);const idle=gltf.animations.find(a=>/idle|breath|stand/i.test(a.name))||gltf.animations[0];if(idle)mixer.clipAction(idle).play();
let pointerX=0,pointerY=0;const pointer=e=>{pointerX=Math.max(-1,Math.min(1,(e.clientX-innerWidth/2)/(innerWidth/2)));pointerY=Math.max(-1,Math.min(1,(e.clientY-innerHeight/2)/(innerHeight/2)))};window.addEventListener('pointermove',pointer,{passive:true});window.addEventListener('pointerdown',pointer,{passive:true});
const resize=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};const observer=new ResizeObserver(resize);observer.observe(host);resize();
host.style.display='block';fallback.style.visibility='hidden';const clock=new THREE.Clock();let elapsed=0,nextBlink=2,blink=0;
function tick(){raf=requestAnimationFrame(tick);const dt=Math.min(clock.getDelta(),.05);elapsed+=dt;mixer.update(dt);const stress=Math.min(100,window.cikguStress||0)/100,vomit=document.getElementById('scene').classList.contains('vomit');if(elapsed>nextBlink){blink=1;nextBlink=elapsed+2+Math.random()*3}blink=Math.max(0,blink-dt*8);setMorph(['eyeBlinkLeft'],blink);setMorph(['eyeBlinkRight'],blink);setMorph(['browDownLeft'],stress*.8);setMorph(['browDownRight'],stress*.8);setMorph(['mouthFrown'],stress*.65);setMorph(['eyeSquintLeft'],stress*.35);setMorph(['eyeSquintRight'],stress*.35);setMorph(['jawOpen'],vomit?.8:stress*.08);setMorph(['mouthSmile'],Math.max(0,.25-stress*.8));if(head){const r=base.get(head);head.rotation.y=r.y+pointerX*.15;head.rotation.x=r.x-pointerY*.08+(vomit?.25:0);head.rotation.z=r.z+Math.sin(elapsed*1.4)*(.01+stress*.04)}if(neck){const r=base.get(neck);neck.rotation.y=r.y+pointerX*.05}for(const b of [eyeL,eyeR])if(b){const r=base.get(b);b.rotation.y=r.y+pointerX*.11;b.rotation.x=r.x-pointerY*.07}character.rotation.z=Math.sin(elapsed*(2+stress*3))*(.007+stress*.02);renderer.render(scene,camera)}
tick();console.info('Cikgu K real rigged GLB loaded',url);
}catch(err){console.info('Realistic Cikgu K model not available yet; keeping original teacher.',err.message);if(raf)cancelAnimationFrame(raf);if(renderer){renderer.dispose();renderer.domElement.remove()}host.style.display='none';fallback.style.visibility='visible'}
})();
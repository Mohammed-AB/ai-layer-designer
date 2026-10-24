import { useState } from 'react';
import { LayersPanel } from '@/components/LayersPanel';
import { Toaster } from 'sonner';
import type { Layer } from '@/pages/Index';
import './demo.css';

// Deterministic drawing fixtures exercise the real browser PNG/PSD export path.
function fixtures(): Layer[] {
  const names = ['Background', 'Main Elements', 'Details', 'Final Polish'];
  return names.map((name, stage) => {
    const canvas = document.createElement('canvas');canvas.width = canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0,0,512,512);gradient.addColorStop(0,'#122043');gradient.addColorStop(1,'#5e48a2');ctx.fillStyle=gradient;ctx.fillRect(0,0,512,512);
    if(stage>=1){ctx.fillStyle='#edb477';ctx.beginPath();ctx.arc(260,220,100,0,Math.PI*2);ctx.fill();ctx.fillStyle='#111d3c';ctx.fillRect(0,380,512,132);}
    if(stage>=2){ctx.strokeStyle='#ceb1f2';ctx.lineWidth=2;for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse(256,390+i*14,180-i*8,24,0,0,Math.PI*2);ctx.stroke();}}
    if(stage>=3){ctx.fillStyle='#fff5df';[[80,80],[410,110],[130,200],[370,290]].forEach(([x,y])=>{ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();});ctx.font='16px sans-serif';ctx.fillText('ORBIT / SYNTHETIC EXPORT FIXTURE',30,475);}
    return {name,imageUrl:canvas.toDataURL('image/png'),description:`Synthetic drawing, stage ${stage+1}. Not an AI-generated result.`};
  });
}
export default function Demo(){
  const [layers,setLayers]=useState<Layer[]>([]);
  return <main className="demo-shell export-demo"><Toaster/><p className="demo-label">AI Layer Designer / export demo</p><h1>Four stages.<br/>One editable document.</h1><p className="demo-lead">Load four synthetic image stages, inspect them in the application's real layer panel, then export PNGs or a layered Photoshop file. No API keys, image-generation calls, or network backend are involved.</p><div className="demo-actions"><button onClick={()=>setLayers(fixtures())}>Load sample layers</button><button disabled={!layers.length} onClick={()=>setLayers([])}>Clear layers</button><a className="demo-link" href="/">Open generator</a></div><LayersPanel layers={layers} isGenerating={false} compact/><footer>The demo uses opaque progressive frames, matching the current export representation. These are not segmented transparent objects. Built by Mohammed Abumtary.</footer></main>;
}

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Compass, X } from "lucide-react";
import { useTour } from "@/context/TourContext";

type Rect = { left:number; top:number; width:number; height:number; right:number; bottom:number };
/** Opt-in native modal: keyboard containment, Escape and focus restoration are browser-managed. */
export function ProductTour() {
  const {isTourActive,currentStepIndex,steps,nextStep,prevStep,endTour}=useTour();
  const dialog=useRef<HTMLDialogElement>(null);
  const [target,setTarget]=useState<Rect|null>(null);
  const [position,setPosition]=useState({left:16,top:16});
  const step=steps[currentStepIndex];
  useEffect(()=>{
    const element=dialog.current;
    if(!isTourActive||!element)return;
    const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
    element.showModal();
    return ()=>{element.close();if(previous?.isConnected)previous.focus({preventScroll:true});};
  },[isTourActive]);
  useEffect(()=>{
    if(!isTourActive||!step)return;
    let targetElement:HTMLElement|null=null;
    let retry:ReturnType<typeof setTimeout>|undefined;
    let stopped=false;
    let observer:ResizeObserver|undefined;
    let attempts=0;
    function measure() {
      if(stopped||!dialog.current)return;
      const viewport=window.visualViewport;
      const width=viewport?.width??innerWidth;
      const height=viewport?.height??innerHeight;
      const card=dialog.current.getBoundingClientRect();
      const rect=targetElement?.getBoundingClientRect();
      const visible=rect && rect.width>0 && rect.height>0 && rect.right>0 && rect.left<width && rect.bottom>0 && rect.top<height;
      setTarget(visible?{left:Math.max(8,rect.left-6),top:Math.max(8,rect.top-6),right:Math.min(width-8,rect.right+6),bottom:Math.min(height-8,rect.bottom+6),width:Math.min(width-8,rect.right+6)-Math.max(8,rect.left-6),height:Math.min(height-8,rect.bottom+6)-Math.max(8,rect.top-6)}:null);
      let left=(width-card.width)/2;
      let top=(height-card.height)/2;
      if(visible&&width>=768){
        if(rect.right+24+card.width<=width-16){left=rect.right+24;top=rect.top;}
        else if(rect.left-24-card.width>=16){left=rect.left-24-card.width;top=rect.top;}
        else if(rect.bottom+24+card.height<=height-16){top=rect.bottom+24;}
      }
      setPosition({left:Math.max(16,Math.min(left,width-card.width-16)),top:Math.max(16,Math.min(top,height-card.height-16))});
    }
    function find() {
      if(stopped)return;
      targetElement=step.targetId==="center"?null:document.getElementById(step.targetId);
      if(targetElement&&targetElement.getBoundingClientRect().width>0){
        targetElement.scrollIntoView({behavior:"instant",block:"nearest",inline:"nearest"});
        observer?.observe(targetElement);
      } else if(step.targetId!=="center"&&attempts++<12)retry=setTimeout(find,100);
      measure();
    }
    observer=new ResizeObserver(measure);
    if(dialog.current)observer.observe(dialog.current);
    find();
    window.addEventListener("resize",measure);
    window.addEventListener("scroll",measure,true);
    window.visualViewport?.addEventListener("resize",measure);
    return ()=>{stopped=true;clearTimeout(retry);observer?.disconnect();window.removeEventListener("resize",measure);window.removeEventListener("scroll",measure,true);window.visualViewport?.removeEventListener("resize",measure);};
  },[isTourActive,step]);
  if(!isTourActive||!step)return null;
  return createPortal(<>
    <div className={target?"ayu-guide-spotlight":"ayu-guide-shade"} aria-hidden="true" style={target?{left:target.left,top:target.top,width:target.width,height:target.height}:undefined}/>
    <dialog ref={dialog} className="ayu-guide-dialog" style={position} aria-labelledby="ayu-guide-title" aria-describedby="ayu-guide-description" onCancel={(event)=>{event.preventDefault();endTour();}}>
      <header><span><Compass size={18}/> Workspace guide</span><button type="button" onClick={endTour} aria-label="Close guide"><X size={18}/></button></header>
      <p className="ayu-guide-progress">Step {currentStepIndex+1} of {steps.length}</p>
      <h2 id="ayu-guide-title">{step.title}</h2>
      <p id="ayu-guide-description">{step.content}</p>
      <footer><button type="button" onClick={prevStep} disabled={currentStepIndex===0}><ChevronLeft size={16}/> Back</button><button type="button" className="ayu-guide-next" onClick={nextStep}>{currentStepIndex===steps.length-1?"Finish guide":"Next"}<ChevronRight size={16}/></button></footer>
    </dialog>
  </>,document.body);
}

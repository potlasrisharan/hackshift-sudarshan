import { createContext, type ReactNode, useCallback, useContext, useState } from "react";

export interface TourStep { targetId: string; title: string; content: string; route?: string }
interface TourContextType {
  isTourActive: boolean; currentStepIndex: number; steps: TourStep[]; scope: string;
  startTour: (steps: TourStep[], scope?: string) => void;
  nextStep: () => void; prevStep: () => void; endTour: () => void;
}
const TourContext = createContext<TourContextType | undefined>(undefined);
export function TourProvider({ children }: { children: ReactNode }) {
  const [isTourActive,setIsTourActive] = useState(false);
  const [currentStepIndex,setCurrentStepIndex] = useState(0);
  const [steps,setSteps] = useState<TourStep[]>([]);
  const [scope,setScope] = useState("");
  const startTour = useCallback((tourSteps: TourStep[], workspace = "") => {
    if (!tourSteps.length) return;
    setSteps(tourSteps);setScope(workspace);setCurrentStepIndex(0);setIsTourActive(true);
  },[]);
  const endTour = useCallback(()=>{
    setIsTourActive(false);setCurrentStepIndex(0);
    try { if(scope)localStorage.setItem(`ayusetu_tour_completed:${scope}`,"true"); } catch { /* Guidance also works when browser storage is unavailable. */ }
  },[scope]);
  const nextStep = useCallback(()=>{
    if(currentStepIndex + 1 < steps.length)setCurrentStepIndex(index=>index+1);
    else endTour();
  },[currentStepIndex,steps.length,endTour]);
  const prevStep = useCallback(()=>setCurrentStepIndex(index=>Math.max(0,index-1)),[]);
  return <TourContext.Provider value={{isTourActive,currentStepIndex,steps,scope,startTour,nextStep,prevStep,endTour}}>{children}</TourContext.Provider>;
}
export function useTour() {
  const context=useContext(TourContext);
  if(!context)throw new Error("useTour must be used within a TourProvider");
  return context;
}

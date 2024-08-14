import { ReactNode, createContext, useEffect, useReducer, useState } from "react"
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import { act } from "react-dom/test-utils";
import { ActionTypes, addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { parse } from "date-fns";

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface CyclesContextType{
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle:() => void
}

export const CyclesContext = createContext({ } as CyclesContextType)

interface CyclesContextProviderProps{
    children: ReactNode 
}


export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps){
  const [cyclesState, dispatch] = useReducer(cyclesReducer,
    {
      cycles:[],
      activeCycleId: null,
    }, () => {
      const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0');

      if (storedStateAsJSON){
        return JSON.parse(storedStateAsJSON)
      }
    })

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    useEffect(() => {
      const stateJSON = JSON.stringify(cyclesState)

      localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
    },[cyclesState])

    const {cycles, activeCycleId} = cyclesState;
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function setSecondsPassed(seconds: number){
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished(){
      dispatch(markCurrentCycleAsFinishedAction())

    }


    function createNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime());
        const newCycle: Cycle = {
          id,
          task: data.task,
          minutesAmount: data.minutesAmount,
          startDate: new Date(),
        }

        dispatch(addNewCycleAction(newCycle))

        setAmountSecondsPassed(0)
      }
    
      function interruptCurrentCycle(){
        dispatch(interruptCurrentCycleAction())
      }
      

    return(
        <CyclesContext.Provider value={{ cycles, activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed, createNewCycle, interruptCurrentCycle}}>
            {children}
        </CyclesContext.Provider>
    )
}
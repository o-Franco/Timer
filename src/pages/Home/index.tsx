import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles"
import { HandPalm, Play } from "@phosphor-icons/react";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { createContext, useEffect, useState } from "react";
import {differenceInSeconds} from  "date-fns"
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/CountDown";

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date
  interruptedDate?: Date
  fineshedDate?: Date
}

interface CyclesContextType{
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    markCurrentCycleAsFinished: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished(){
    setCycles(state => state.map((cycle) => {
      if (cycle.id === activeCycleId){
        return {...cycle, fineshedDate: new Date()}
      } else {
        return cycle
      }
    }))
  }

  // function handleCreateNewCycle(data: NewCycleFormData) {
  //   const id = String(new Date().getTime());
  //   const newCycle: Cycle = {
  //     id,
  //     task: data.task,
  //     minutesAmount: data.minutesAmount,
  //     startDate: new Date(),
  //   }
  //   setCycles((state) => [...cycles, newCycle])
  //   setActiveCycleId(id)
  //   setAmountSecondsPassed(0)

  //   reset();
  // }

  function handleInterruptCycle(){
    setCycles(cycles.map(cycle => {
      if (cycle.id === activeCycleId){
        return {...cycle, interruptedDate: new Date()}
      } else {
        return cycle
      }
    }))
    setActiveCycleId(null)
  }

  // const task = watch('task');
  // const isSubmitDisabled = task === '';

  /**
   * Prop Drilling => quando tem muita propriedade apenas para comunicação entre componentes
   * para evitar o Prop Drilling temos o item abaixo
   * Context API => Permite compartilhar informações entre VARIOS componentes ao mesmo tempos
   */


  return (
    <HomeContainer>
      <form /*onSubmit={handleSubmit(handleCreateNewCycle)}*/  action="">
        <CyclesContext.Provider value={{activeCycle, activeCycleId, markCurrentCycleAsFinished}}>
          {/*<NewCycleForm/>*/}
          <Countdown
            activeCycle={activeCycle} 
            setCycles={setCycles} 
            activeCycleId={activeCycleId}
          />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ): (
          <StartCountdownButton /*disabled={isSubmitDisabled}*/ type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}

      </form>
    </HomeContainer>
  )
}

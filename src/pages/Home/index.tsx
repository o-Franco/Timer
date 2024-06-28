import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles"
import { HandPalm, Play } from "@phosphor-icons/react";
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useContext } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/CountDown";
import { CyclesContext } from "../../contexts/CyclesContext";

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>




const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5, 'O ciclo precisa ter mínimo de 5 minutos').max(60, 'O ciclo pode ter no máximo de 60 minutos.'),
})


export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })
  
  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData){
    createNewCycle(data)
    reset() 
  }

  const task = watch('task');
  const isSubmitDisabled = task === '';

  /**
   * Prop Drilling => quando tem muita propriedade apenas para comunicação entre componentes
   * para evitar o Prop Drilling temos o item abaixo
   * Context API => Permite compartilhar informações entre VARIOS componentes ao mesmo tempos
   */


  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}  action="">
          <FormProvider {...newCycleForm}>
            <NewCycleForm/>
          </FormProvider>
          <Countdown/>

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ): (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}

      </form>
    </HomeContainer>
  )
}

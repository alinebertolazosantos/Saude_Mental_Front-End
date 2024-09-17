import { CheckCircle2, Plus } from 'lucide-react'
import { Button } from '../components/ui/button'
import { DialogTrigger } from '../components/ui/dialog'
import { InOrbitIcon } from './in-orbit-icon'
import { Progress } from '../components/ui/progress-bar'
import { ProgressIndicator } from '../components/ui/progress-bar'
import { Separator } from '../components/ui/separator'
import { OutlineButton } from '../components/ui/outline-button'
import { useQuery } from '@tanstack/react-query'
import { getSummary } from '../http/get-summary'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-Br'

dayjs.locale(ptBr)
export function Summary() {
  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    staleTime: 1000 * 60, // 60 seconds
  })

  if (!data) {
    return null
  }

  const firstDayOfWeek = dayjs().startOf('week').format('DD MMM')
  const lastDayOfWeek = dayjs().endOf('week').format('DD MMM')

  const completedPorcentage = Math.round((data.completed * 100) / data.total)

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold capitalize">
            {firstDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>

        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress value={8} max={15}>
          <ProgressIndicator style={{ width: `${completedPorcentage}%` }} />
        </Progress>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou{' '}
            <span className="text-zinc-100">{data.completed}</span> de{' '}
            <span className="text-zinc-100">{data.total}</span> metas nessa
            semana.
          </span>
          <span>{completedPorcentage}%</span>
        </div>
      </div>

      <Separator />

      <div className="flex flex-wrap gap-3">
        <OutlineButton>
          <Plus className="size-4 text-zinc-600" />
          Meditar
        </OutlineButton>
        <OutlineButton>
          <Plus className="size-4 text-zinc-600" />
          Nadar
        </OutlineButton>
        <OutlineButton>
          <Plus className="size-4 text-zinc-600" />
          Praticar exercícios
        </OutlineButton>
        <OutlineButton>
          <Plus className="size-4 text-zinc-600" />
          Me alimentar bem
        </OutlineButton>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Sua semana</h2>
        {data.goalsPerDay &&
          Object.entries(data.goalsPerDay).map(([date, goals]) => {
            const weekDay = dayjs(date).format('dddd')
            const parsedDate = dayjs(date).format('D[ de ]MMM')

            return (
              <div key={date} className="flex flex-col gap-4">
                <h3 className="font-medium capitalize">
                  {weekDay}{' '}
                  <span className="text-zinc-400 text-xs">({parsedDate})</span>
                </h3>

                <ul className="flex flex-col gap-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-pink-500" />
                    <span className="text-sm text-zinc-400">
                      Você completou "
                      <span className="text-zinc-100">acordar cedo</span>"
                    </span>
                  </li>
                </ul>
              </div>
            )
          })}
      </div>
    </div>
  )
}

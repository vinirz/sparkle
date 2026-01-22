import { createClient } from "@/lib/supabase/server"
import { cookies } from 'next/headers'
import { redirect } from "next/navigation"
import { Separator } from "@/components/ui/separator";
import { Target, FolderPlus, Zap, Clock, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import CollectionModal from './_components/collection-modal';
import Link from "next/link";

type Pace = {
  name: string,
  value: number
}

const PaceChart = ({pace}: {pace: Pace[]}) => {
  return (
    <div className="flex items-end gap-1 h-8 mt-4 opacity-50">
      {
        pace.map((item, index) => {
          const isLastRecord = index === pace.length - 1
          return <div key={index} className={`flex-1 ${isLastRecord ? 'bg-emerald-500' : 'bg-emerald-200'} h-[${item.value}%] rounded-t-sm`}/>
        })
      }
    </div>
  )
}

const StreakChart = ({streak}: {streak: number}) => {
  const weekDaysCount = 7
  const streakDaysCount = streak % weekDaysCount || 0
  return (
    <div className="flex gap-1">
      {[...Array(weekDaysCount)].map((_, index) => (
        <div 
          key={index} 
          className={`w-3 h-8 rounded-sm ${index < streakDaysCount ? 'bg-yellow-400' : 'bg-zinc-200'} ${index === 13 ? 'opacity-50' : ''}`}
        ></div>
      ))}
    </div>
  )
}

export default async function Dashboard() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/sign-in')
  }

  const { data: collections } = await supabase.from('collections').select('*, questions(count)').order('created_at', { ascending: false }).limit(3)

  const now = new Date()
  const day = now.getDay() // 0 (Sun) - 6 (Sat)
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
  const startOfWeek = new Date(now.setDate(diff))
  startOfWeek.setHours(0, 0, 0, 0)

  const { data: weeklyQuestions } = await supabase
    .from('questions')
    .select('created_at')
    .gte('created_at', startOfWeek.toISOString())

  const weeklyCount = weeklyQuestions?.length ?? 0

  // Consistency and Focus Logic
  const { data: allQuestionsData } = await supabase
    .from('questions')
    .select('created_at, subject')
  
  const uniqueDates = new Set(
    allQuestionsData?.map(q => new Date(q.created_at).toLocaleDateString("en-CA")) // YYYY-MM-DD
  )

  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayStr = today.toLocaleDateString("en-CA")
  const yesterdayStr = yesterday.toLocaleDateString("en-CA")

  let streak = 0
  let currentCheckDate = new Date(today)

  if (uniqueDates.has(todayStr)) {
    streak++
    currentCheckDate = yesterday
  } else if (uniqueDates.has(yesterdayStr)) {
    streak++
    currentCheckDate = new Date(yesterday)
    currentCheckDate.setDate(currentCheckDate.getDate() - 1)
  } else {
    streak = 0
  }

  if (streak > 0) {
    while (uniqueDates.has(currentCheckDate.toLocaleDateString("en-CA"))) {
      streak++
      currentCheckDate.setDate(currentCheckDate.getDate() - 1)
    }
  }

  // Focus Logic
  const subjectCounts: Record<string, number> = {}
  allQuestionsData?.forEach(q => {
      if (q.subject) {
          subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1
      }
  })

  let topSubject = "Indisponível"
  let topSubjectCount = 0
  let totalSubjects = allQuestionsData?.length || 0

  for (const [subject, count] of Object.entries(subjectCounts)) {
      if (count > topSubjectCount) {
          topSubject = subject
          topSubjectCount = count
      }
  }

  const focusPercentage = totalSubjects > 0 ? Math.round((topSubjectCount / totalSubjects) * 100) : 0

  const daysMap = {
    0: 'domingo',
    1: 'segunda',
    2: 'terca',
    3: 'quarta',
    4: 'quinta',
    5: 'sexta',
    6: 'sabado'
  }

  const counts: Record<string, number> = {
    'segunda': 0, 'terca': 0, 'quarta': 0, 'quinta': 0, 'sexta': 0, 'sabado': 0, 'domingo': 0
  }

  weeklyQuestions?.forEach(q => {
    const date = new Date(q.created_at)
    const dayOfWeek = date.getDay()
    const dayName = daysMap[dayOfWeek as keyof typeof daysMap]
    if (counts[dayName] !== undefined) {
      counts[dayName]++
    }
  })

  const maxCount = Math.max(...Object.values(counts), 1) // Avoid division by zero

  const paceData: Pace[] = [
    { name: 'segunda', value: Math.round((counts['segunda'] / maxCount) * 100) },
    { name: 'terca', value: Math.round((counts['terca'] / maxCount) * 100) },
    { name: 'quarta', value: Math.round((counts['quarta'] / maxCount) * 100) },
    { name: 'quinta', value: Math.round((counts['quinta'] / maxCount) * 100) },
    { name: 'sexta', value: Math.round((counts['sexta'] / maxCount) * 100) },
    { name: 'sabado', value: Math.round((counts['sabado'] / maxCount) * 100) },
    { name: 'domingo', value: Math.round((counts['domingo'] / maxCount) * 100) },
  ]

  return (
    <div className="w-full h-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 p-8">
          <h1 className="text-2xl">
            Olá!,
            <span className="text-primary font-semibold">
              {` ${user.user_metadata?.name || user.email?.split("@")[0]}! `}
            </span> 
            <br />
            Seja bem vindo(a)
          </h1>

          <p className="text-neutral-500 mt-2">
            <br />
            Seu banco de questões inteligente. Organizado, rápido e focado.
            <br />
            <br />
            <span className="font-semibold text-primary"> O que vamos estudar hoje?</span>
          </p>
          
          <Separator className="my-8"/>

          <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <GlassCard status={topSubjectCount > 0 ? 'active' : 'inactive'} className="flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <Target className="h-5 w-5 text-yellow-600" />
                    </div>
                    <span className="text-xs font-bold bg-neutral-100 px-2 py-1 rounded text-neutral-500 uppercase tracking-wider">Foco</span>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 truncate" title={topSubject}>{topSubject}</h3>
                  <p className="text-sm text-neutral-500 mt-1">{focusPercentage}% das suas questões são desta matéria</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-neutral-500 mb-1">
                    <span>Domínio</span>
                    <span>{focusPercentage}%</span>
                  </div>
                  <ProgressBar value={focusPercentage} color="bg-yellow-500" />
                </div>
              </GlassCard>

              <GlassCard status={weeklyCount > 0 ? 'active' : 'inactive'} className="flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Zap className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="text-xs font-bold bg-neutral-100 px-2 py-1 rounded text-neutral-500 uppercase tracking-wider">Ritmo</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-3xl font-bold text-neutral-900">{String(weeklyCount).padStart(2, '0')}</h3>
                    {/* <span className="text-sm font-medium text-emerald-600">+12 hoje</span> */}
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">Questões capturadas esta semana</p>
                </div>

                <PaceChart pace={paceData}/>
              </GlassCard>

              <div className="md:col-span-2">
                  <GlassCard className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-neutral-50 rounded-full border border-neutral-100">
                        <Clock className="h-6 w-6 text-neutral-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900">Consistência</h4>
                        <p className="text-sm text-neutral-500">Você estudou {streak} {streak === 1 ? 'dia seguido' : 'dias seguidos'}.</p>
                      </div>

                    </div>
                    
                    <div className="flex gap-1">
                      <StreakChart streak={streak} />
                    </div>
                  </GlassCard>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-lg">Coleções</h3>
                  <Link href="/dashboard/collections" className="text-xs font-semibold text-yellow-600 hover:text-yellow-700">VER TODAS</Link>
              </div>

              <div className="space-y-3 flex flex-col h-full">
                  {collections?.map((collection) => (
                    <Link href={`/dashboard/collections/${collection.id}`} key={collection.id} className="group flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:border-yellow-400/50 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-neutral-300 group-hover:bg-yellow-400 transition-colors"></div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">{collection.name}</p>
                          <p className="text-[10px] text-neutral-400">{collection.questions?.[0]?.count ?? 0} {(collection.questions?.[0]?.count ?? 0) === 1 ? 'questão' : 'questões'}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                  
                  <CollectionModal>
                    <div className="w-full py-3 rounded-xl border-2 border-dashed border-neutral-300 text-neutral-400 text-sm font-medium hover:border-yellow-400 hover:text-yellow-600 hover:bg-yellow-50 transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <FolderPlus className="h-4 w-4" /> Nova Coleção
                    </div>
                  </CollectionModal>
              </div>
            </div>

          </section>
    </div>
  )
}
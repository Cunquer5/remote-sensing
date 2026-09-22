'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { FIELDS, STATS, STRESS_COLORS, ADVISORY_META } from '@/lib/data'
import Link from 'next/link'
import { MessageSquare, Send, AlertCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant' | 'coverage'
  content: string
  fields?: string[]
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to CaneSense Copilot! I can answer questions about the Baitul sugarcane dataset, including field-specific information, stress levels, irrigation priorities, and district summaries. What would you like to know?'
    }
  ])
  const [input, setInput] = useState('')

  const suggestedQuestions = [
    'Which sugarcane fields are under severe moisture stress?',
    'Which fields require irrigation priority?',
    'What is the current growth stage of Field BTL-024?',
    'How has Field BTL-024 changed over the last 60 days?',
    'Why has BTL-005 been classified as high stress?',
    'Show sugarcane fields with declining NDMI.'
  ]

  const answer = (question: string): Message => {
    const q = question.toLowerCase()
    
    // Field-specific queries
    const fieldMatch = q.match(/btl-(\d{3})/i)
    if (fieldMatch) {
      const fieldId = `BTL-${fieldMatch[1].padStart(3, '0')}`
      const field = FIELDS.find(f => f.id === fieldId)
      if (field) {
        if (q.includes('stage')) {
          return {
            role: 'assistant',
            content: `${field.id} is currently in the ${field.stage} stage with ${(field.stageConfidence * 100).toFixed(0)}% confidence. It has been in this stage for ${field.daysInStage} days.`,
            fields: [field.id]
          }
        }
        if (q.includes('60 day') || q.includes('trend') || q.includes('changed')) {
          const latestNdvi = field.series[field.series.length - 1].ndvi
          const previousNdvi = field.series[field.series.length - 9]?.ndvi || latestNdvi
          const trend = latestNdvi > previousNdvi ? 'increasing' : latestNdvi < previousNdvi ? 'declining' : 'stable'
          return {
            role: 'assistant',
            content: `${field.id} has shown ${trend} NDVI over the last 60 days (from ${previousNdvi.toFixed(3)} to ${latestNdvi.toFixed(3)}). Current stress level is ${field.stressLevel} with a score of ${field.stressScore.toFixed(0)}/100.`,
            fields: [field.id]
          }
        }
        if (q.includes('why') && (q.includes('stress') || q.includes('high'))) {
          return {
            role: 'assistant',
            content: `${field.id} is classified as ${field.stressLevel} stress primarily due to: ${field.stressFactors.slice(0, 3).map(f => f.label).join(', ')}. ${field.explanation}`,
            fields: [field.id]
          }
        }
        return {
          role: 'assistant',
          content: `${field.id} in ${field.village} is ${field.stage} with ${field.stressLevel} stress (score: ${field.stressScore.toFixed(0)}/100). Area: ${field.areaHa.toFixed(1)} ha. Advisory: ${ADVISORY_META[field.advisory].label}.`,
          fields: [field.id]
        }
      }
      return {
        role: 'coverage',
        content: `Field ${fieldId} not found in the Baitul dataset. Only fields BTL-001 through BTL-028 are available.`
      }
    }

    // Severe stress
    if (q.includes('severe') && q.includes('stress')) {
      const severeFields = FIELDS.filter(f => f.stressLevel === 'severe')
      return {
        role: 'assistant',
        content: `${severeFields.length} fields are under severe moisture stress: ${severeFields.map(f => f.id).join(', ')}. These fields require immediate irrigation attention.`,
        fields: severeFields.map(f => f.id)
      }
    }

    // Irrigation priority
    if (q.includes('irrigation') && (q.includes('priority') || q.includes('require') || q.includes('need'))) {
      const priorityFields = FIELDS.filter(f => f.advisory === 'IRRIGATION_REQUIRED').sort((a, b) => b.stressScore - a.stressScore)
      return {
        role: 'assistant',
        content: `${priorityFields.length} fields require irrigation priority: ${priorityFields.map(f => f.id).join(', ')}. Sorted by stress score from highest to lowest.`,
        fields: priorityFields.map(f => f.id)
      }
    }

    // Declining NDMI
    if (q.includes('declining') && q.includes('ndmi')) {
      const decliningFields = FIELDS.filter(f => {
        const latest = f.series[f.series.length - 1].ndmi
        const previous = f.series[f.series.length - 3]?.ndmi || latest
        return latest < previous - 0.05
      })
      return {
        role: 'assistant',
        content: `${decliningFields.length} fields show declining NDMI trends: ${decliningFields.map(f => f.id).join(', ')}. These fields may be experiencing drying conditions.`,
        fields: decliningFields.map(f => f.id)
      }
    }

    // High stress
    if (q.includes('high stress')) {
      const highStressFields = FIELDS.filter(f => f.stressLevel === 'high' || f.stressLevel === 'severe')
      return {
        role: 'assistant',
        content: `${highStressFields.length} fields are under high or severe stress: ${highStressFields.map(f => f.id).join(', ')}. Total stressed fields: ${STATS.stressedPct}% of the study area.`,
        fields: highStressFields.map(f => f.id)
      }
    }

    // Summary/overview
    if (q.includes('how many') || q.includes('total') || q.includes('area') || q.includes('summary') || q.includes('overview')) {
      return {
        role: 'assistant',
        content: `District summary: ${STATS.fieldCount} sugarcane fields covering ${STATS.sugarcaneHa.toFixed(1)} ha (${STATS.studyAreaKm2.toLocaleString()} km² study area). ${STATS.healthyPct}% healthy, ${STATS.stressedPct}% moisture-stressed. ${STATS.highStressCount} high-stress fields require irrigation priority. Average NDVI: ${STATS.avgNdvi.toFixed(3)}, Average NDMI: ${STATS.avgNdmi.toFixed(3)}.`
      }
    }

    // Rainfall
    if (q.includes('rain') || q.includes('rainfall')) {
      const driestFields = [...FIELDS].sort((a, b) => a.rainfall7d - b.rainfall7d).slice(0, 5)
      return {
        role: 'assistant',
        content: `The 5 driest fields (lowest 7-day rainfall) are: ${driestFields.map(f => `${f.id} (${f.rainfall7d.toFixed(1)}mm)`).join(', ')}. These fields may need irrigation attention.`,
        fields: driestFields.map(f => f.id)
      }
    }

    // NDVI/healthiest
    if (q.includes('ndvi') || q.includes('healthiest') || q.includes('best')) {
      const healthiestFields = [...FIELDS].sort((a, b) => b.ndvi - a.ndvi).slice(0, 5)
      return {
        role: 'assistant',
        content: `The 5 healthiest fields (highest NDVI) are: ${healthiestFields.map(f => `${f.id} (${f.ndvi.toFixed(3)})`).join(', ')}. These fields show good vegetation health.`,
        fields: healthiestFields.map(f => f.id)
      }
    }

    // Default - insufficient coverage
    return {
      role: 'coverage',
      content: 'I cannot answer that question from the available Baitul dataset. I can provide information about: field-specific details, stress levels, irrigation priorities, growth stages, time-series trends, district summaries, rainfall data, and NDVI/NDMI values. Try rephrasing your question or ask about one of these topics.'
    }
  }

  const handleSend = () => {
    if (!input.trim()) return
    
    const userMessage: Message = { role: 'user', content: input }
    const assistantMessage = answer(input)
    
    setMessages([...messages, userMessage, assistantMessage])
    setInput('')
  }

  return (
    <div className="min-h-screen bg-night-950 flex flex-col">
      <PageHeader
        title="CaneSense Copilot"
        subtitle="AI assistant for Baitul sugarcane dataset queries"
      />

      <div className="flex-1 px-8 py-6 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-cane-600/20 text-cane-100'
                    : msg.role === 'coverage'
                    ? 'border border-amber-500/50 bg-amber-500/10 text-slate-300'
                    : 'border border-night-700 bg-night-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {msg.role === 'assistant' ? (
                    <MessageSquare className="h-4 w-4 text-cane-400" />
                  ) : msg.role === 'coverage' ? (
                    <AlertCircle className="h-4 w-4 text-amber-400" />
                  ) : null}
                  <span className="text-xs font-semibold">
                    {msg.role === 'assistant' ? 'CaneSense Copilot' : msg.role === 'coverage' ? 'Coverage notice' : 'You'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                {msg.fields && msg.fields.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.fields.map(fieldId => (
                      <Link
                        key={fieldId}
                        href={`/fields/${fieldId}`}
                        className="inline-flex items-center gap-1 rounded-full border border-night-600 bg-night-700 px-2 py-1 text-xs hover:border-cane-600 hover:bg-cane-600/20 transition-colors"
                        style={{ color: STRESS_COLORS[FIELDS.find(f => f.id === fieldId)?.stressLevel || 'none'] }}
                      >
                        {fieldId}
                        <span className="text-[10px] text-slate-500">
                          ({FIELDS.find(f => f.id === fieldId)?.stressScore.toFixed(0)})
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="mb-4">
            <div className="text-xs text-slate-500 mb-2">Suggested questions:</div>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="rounded-full border border-night-700 bg-night-800 px-3 py-1.5 text-xs text-slate-300 hover:border-cane-600 hover:bg-cane-600/10 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about fields, stress, irrigation, or district summary..."
            className="flex-1 rounded-lg border border-night-700 bg-night-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cane-600 focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="rounded-lg bg-cane-600 px-4 py-3 text-white hover:bg-cane-700 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

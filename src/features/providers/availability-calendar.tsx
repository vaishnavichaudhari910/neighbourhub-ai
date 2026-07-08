"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, isBefore, startOfDay, getDay } from "date-fns"

interface CalendarProps {
  onSelect?: (date: Date) => void
  selectedDate?: Date | null
}

// Simulate unavailable days (Sunday + random past days)
const isUnavailable = (date: Date) => getDay(date) === 0

export function AvailabilityCalendar({ onSelect, selectedDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const today = startOfDay(new Date())

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const firstDayOfWeek = getDay(startOfMonth(currentMonth))

  const prevMonth = () =>
    setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1))
  const nextMonth = () =>
    setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1))

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-poppins font-semibold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button onClick={nextMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
          <div key={d} className="text-center text-xs text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for first week offset */}
        {Array(firstDayOfWeek).fill(null).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map(day => {
          const isPast = isBefore(startOfDay(day), today)
          const unavail = isUnavailable(day)
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
          const isToday = isSameDay(day, today)
          const disabled = isPast || unavail

          return (
            <motion.button
              key={day.toISOString()}
              whileHover={!disabled ? { scale: 1.1 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
              disabled={disabled}
              onClick={() => !disabled && onSelect?.(day)}
              className={cn(
                "h-9 w-full rounded-lg text-sm font-medium transition-colors relative",
                isSelected && "text-white",
                !isSelected && !disabled && "hover:bg-primary/10 hover:text-primary",
                isToday && !isSelected && "border border-primary text-primary",
                disabled && "text-muted-foreground/30 cursor-not-allowed",
                unavail && !isPast && "line-through",
              )}
              style={isSelected ? {
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)"
              } : {}}
            >
              {format(day, "d")}
            </motion.button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-3 h-3 rounded-sm"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }} />
          Selected
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-3 h-3 rounded-sm border border-primary" /> Today
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-3 h-3 rounded-sm bg-muted" /> Unavailable
        </span>
      </div>
    </div>
  )
}
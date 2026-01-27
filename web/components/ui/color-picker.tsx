'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'

type ColorPickerProps = {
  value: string
  onChange: (color: string) => void
  colors: readonly { value: string; label: string }[]
}

export function ColorPicker({ value, onChange, colors }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {colors.map((color) => {
        const selected = value === color.value

        return (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            title={color.label}
            className={cn(
              'h-10 w-10 rounded-md transition-all hover:cursor-pointer',
              selected
                ? 'ring-2 ring-ring ring-offset-2 ring-offset-background'
                : 'border border-border hover:scale-105',
            )}
            style={{ backgroundColor: color.value }}
          >
            {selected && (
              <Check
                className="mx-auto h-5 w-5 text-white drop-shadow-md"
                strokeWidth={3}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

// Versão alternativa: Uncontrolled Component (se preferir)
type UncontrolledColorPickerProps = {
  name?: string
  defaultValue?: string
  colors: readonly { value: string; label: string }[]
  externalValue?: string
}

export function UncontrolledColorPicker({
  name = 'color',
  defaultValue,
  colors,
  externalValue,
}: UncontrolledColorPickerProps) {
  const [value, setValue] = useState(defaultValue || colors[0]?.value || '')

  useEffect(() => {
    if (externalValue) {
      setValue(externalValue)
    }
  }, [externalValue])

  return (
    <div className="grid grid-cols-6 gap-2">
      <input type="hidden" name={name} value={value} />

      {colors.map((color) => {
        const selected = value === color.value

        return (
          <button
            key={color.value}
            type="button"
            onClick={() => setValue(color.value)}
            title={color.label}
            className={cn(
              'h-9 w-9 rounded-full transition-all hover:cursor-pointer',
              selected
                ? 'ring-2 ring-ring ring-offset-2 ring-offset-background'
                : 'border border-border hover:scale-105',
            )}
            style={{ backgroundColor: color.value }}
          >
            {selected && (
              <Check
                className="mx-auto h-5 w-5 text-white drop-shadow-md"
                strokeWidth={3}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

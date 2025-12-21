'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

type ColorPickerProps = {
  name?: string
  defaultValue?: string
  colors: readonly { value: string; label: string }[]
}

export function ColorPicker({
  name = 'color',
  defaultValue,
  colors,
}: ColorPickerProps) {
  const [value, setValue] = useState(defaultValue ?? colors[0]?.value)

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
              'h-7 w-7 rounded-full transition-all hover:cursor-pointer',
              selected
                ? 'ring-2 ring-ring ring-offset-2 ring-offset-background'
                : 'border border-border hover:scale-105'
            )}
            style={{ backgroundColor: color.value }}
          >
            {selected && (
              <Check
                className="mx-auto h-4 w-4 text-foreground drop-shadow-sm"
                strokeWidth={3}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

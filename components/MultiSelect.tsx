'use client'

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface MultiSelectProps {
  options: string[]
  selected: string[]
  setSelected: React.Dispatch<React.SetStateAction<string[]>>
  placeholder: string
}

export function MultiSelect({ options, selected, setSelected, placeholder }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (option: string) => {
    setSelected(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    )
  }

  const handleRemove = (option: string) => {
    setSelected(prev => prev.filter(item => item !== option))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex flex-wrap gap-1">
            {selected.length > 0 ? (
              selected.map(item => (
                <span key={item} className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-md text-sm flex items-center">
                  {item}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(item)
                    }}
                  />
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="p-2">
          <input
            type="text"
            placeholder="Search options..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <ul className="max-h-60 overflow-auto p-2">
          {filteredOptions.length === 0 ? (
            <li className="py-2 px-4 text-sm text-muted-foreground">No options found.</li>
          ) : (
            filteredOptions.map((option) => (
              <li
                key={option}
                className="py-2 px-4 cursor-pointer hover:bg-secondary flex items-center justify-between"
                onClick={() => handleSelect(option)}
              >
                <span>{option}</span>
                {selected.includes(option) && <Check className="h-4 w-4" />}
              </li>
            ))
          )}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
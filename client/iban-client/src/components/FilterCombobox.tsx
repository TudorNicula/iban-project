import React, { Fragment, useState, useEffect, useRef, FocusEventHandler } from 'react'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/24/solid'

type Props = {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  /** Optional focus handler for lazy loading or other effects */
  onFocus?: FocusEventHandler<HTMLInputElement>
  /** Infinite scroll: only render a window of options and load more on scroll */
  infinite?: boolean
  /** Number of items to load per chunk when infinite scroll is enabled */
  pageSize?: number
}

export default function FilterCombobox({
  label,
  options,
  value,
  onChange,
  disabled,
  onFocus,
  infinite = false,
  pageSize = 50,
}: Props) {
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const optionsRef = useRef<HTMLElement>(null)

  const filteredOptions = query === ''
    ? options
    : options.filter((opt) => opt.toLowerCase().includes(query.toLowerCase()))
  
  useEffect(() => {
    if (infinite) setVisibleCount(pageSize)
  }, [filteredOptions, pageSize, infinite])
  const displayOptions = infinite
    ? filteredOptions.slice(0, visibleCount)
    : filteredOptions

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (!infinite) return
    const target = e.currentTarget
    const { scrollTop, scrollHeight, clientHeight } = target
    
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setVisibleCount((prev) => Math.min(filteredOptions.length, prev + pageSize))
    }
  }

  return (
    <Combobox value={value} onChange={onChange} nullable>
      <div className="relative w-full">
        <ComboboxInput
          className={`w-full border border-gray-300 rounded px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-400 ${
            disabled ? 'bg-gray-100' : ''
          }`}
          onChange={(e) => {
            setQuery(e.target.value)
            onChange(e.target.value)
          }}
          onFocus={onFocus}
          placeholder={label}
          displayValue={(val: string) => val}
          disabled={disabled}
        />

        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-2">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-500" />
        </ComboboxButton>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ComboboxOptions
            ref={optionsRef}
            onScroll={handleScroll}
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            {displayOptions.length === 0 ? (
              <div className="cursor-default select-none px-4 py-2 text-gray-700">
                No results found.
              </div>
            ) : (
              displayOptions.map((opt, idx) => (
                <ComboboxOption
                  key={`${opt}-${idx}`}
                  value={opt}
                  className="cursor-pointer select-none px-4 py-2 hover:bg-blue-100 hover:text-blue-900 text-gray-900"
                >
                  {opt}
                </ComboboxOption>
              ))
            )}
            {infinite && displayOptions.length < filteredOptions.length && (
              <div className="cursor-default select-none px-4 py-2 text-center text-gray-500">
                Loading more...
              </div>
            )}
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  )
}

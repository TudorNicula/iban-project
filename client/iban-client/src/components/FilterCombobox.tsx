import { Fragment, useState } from 'react'
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
}

export default function FilterCombobox({
  label,
  options,
  value,
  onChange,
  disabled,
}: Props) {
  const [query, setQuery] = useState('')

  const filteredOptions =
    query === ''
      ? options
      : options.filter((opt) =>
          opt.toLowerCase().includes(query.toLowerCase())
        )

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
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {filteredOptions.length === 0 ? (
              <div className="cursor-default select-none px-4 py-2 text-gray-700">
                No results found.
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <ComboboxOption
                  key={opt}
                  value={opt}
                  className="cursor-pointer select-none px-4 py-2 hover:bg-blue-100 hover:text-blue-900 text-gray-900"
                >
                  {opt}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  )
}

import { useEffect, useId, useRef, useState } from 'react'
import './Dropdown.css'

export interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  label: string
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

function Dropdown({ label, options, value, onChange, disabled }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      options.findIndex((o) => o.value === value),
      0,
    ),
  )
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonId = useId()
  const listboxId = useId()

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  useEffect(() => {
    if (open) {
      setActiveIndex(
        Math.max(
          options.findIndex((o) => o.value === value),
          0,
        ),
      )
    }
  }, [open, value, options])

  const commitSelection = (index: number) => {
    const option = options[index]
    if (!option) return
    onChange(option.value)
    setOpen(false)
  }

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        e.preventDefault()
        setActiveIndex(options.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        commitSelection(activeIndex)
        break
      case 'Escape':
        e.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  return (
    <div className="dropdown" ref={rootRef}>
      <button
        type="button"
        id={buttonId}
        className={`dropdown__trigger${open ? ' dropdown__trigger--open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={label}
        aria-activedescendant={open ? `${listboxId}-${activeIndex}` : undefined}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="dropdown__value">{selected?.label ?? 'Select'}</span>
        <span className="dropdown__chevron" aria-hidden="true" />
      </button>

      {open && (
        <ul id={listboxId} role="listbox" aria-labelledby={buttonId} className="dropdown__list">
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listboxId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={`dropdown__option${index === activeIndex ? ' dropdown__option--active' : ''}${
                option.value === value ? ' dropdown__option--selected' : ''
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => commitSelection(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown

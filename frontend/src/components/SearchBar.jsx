import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

export default function SearchBar({ onSearch, placeholder = 'Buscar posts...' }) {
    const [value, setValue] = useState('')
    const timerRef = useRef(null)

    useEffect(() => {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            onSearch(value.trim())
        }, 400)
        return () => clearTimeout(timerRef.current)
    }, [value, onSearch])

    return (
        <Wrapper>
            <Icon>🔍</Icon>
            <Input
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={placeholder}
                aria-label="Buscar posts"
            />
            {value && (
                <ClearBtn onClick={() => setValue('')} aria-label="Limpar busca">✕</ClearBtn>
            )}
        </Wrapper>
    )
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`

const Icon = styled.span`
  position: absolute;
  left: 14px;
  font-size: 16px;
  pointer-events: none;
  opacity: 0.7;
`

const Input = styled.input`
  width: 100%;
  padding: 12px 44px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 15px;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}22;
  }
`

const ClearBtn = styled.button`
  position: absolute;
  right: 14px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

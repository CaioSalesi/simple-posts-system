import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

export default function PostForm({ initialData = {}, onSubmit, submitLabel = 'Publicar Post' }) {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        title: initialData.title || '',
        content: initialData.content || '',
        author: initialData.author || '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
        setError('')
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if (!form.title.trim() || !form.content.trim() || !form.author.trim()) {
            setError('Todos os campos são obrigatórios.')
            return
        }
        setLoading(true)
        try {
            await onSubmit(form)
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao salvar post.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form onSubmit={handleSubmit} noValidate>
            <Field>
                <Label htmlFor="title">Título</Label>
                <Input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Título do post"
                    required
                />
            </Field>

            <Field>
                <Label htmlFor="author">Autor</Label>
                <Input
                    id="author"
                    name="author"
                    type="text"
                    value={form.author}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    required
                />
            </Field>

            <Field>
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                    id="content"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Escreva o conteúdo do post aqui..."
                    rows={12}
                    required
                />
            </Field>

            {error && <ErrorMsg role="alert">⚠️ {error}</ErrorMsg>}

            <Actions>
                <CancelBtn type="button" onClick={() => navigate(-1)}>Cancelar</CancelBtn>
                <SubmitBtn type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : submitLabel}
                </SubmitBtn>
            </Actions>
        </Form>
    )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const inputBase = `
  padding: 12px 16px;
  background: transparent;
  border: 1px solid;
  border-radius: 12px;
  color: inherit;
  font-size: 15px;
  transition: all 0.2s ease;
  width: 100%;

  &::placeholder {
    opacity: 0.5;
  }

  &:focus {
    outline: none;
  }
`

const Input = styled.input`
  ${inputBase}
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}22;
  }
`

const Textarea = styled.textarea`
  ${inputBase}
  border-color: ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  resize: vertical;
  min-height: 220px;
  line-height: 1.7;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}22;
  }
`

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  background: ${({ theme }) => theme.colors.danger}15;
  border: 1px solid ${({ theme }) => theme.colors.danger}40;
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 10px 16px;
  font-size: 14px;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`

const CancelBtn = styled.button`
  padding: 10px 22px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

const SubmitBtn = styled.button`
  padding: 10px 28px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  color: white;
  transition: opacity 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

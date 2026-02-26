import { useEffect } from 'react'
import styled, { keyframes } from 'styled-components'

export default function ConfirmModal({ isOpen, title, message, confirmLabel = 'Excluir', cancelLabel = 'Cancelar', onConfirm, onCancel, danger = true }) {
    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return
        const handler = (e) => { if (e.key === 'Escape') onCancel() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [isOpen, onCancel])

    if (!isOpen) return null

    return (
        <Backdrop onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <Modal onClick={e => e.stopPropagation()}>
                <IconWrapper danger={danger}>
                    {danger ? '🗑️' : '❓'}
                </IconWrapper>
                <Title id="modal-title">{title}</Title>
                {message && <Message>{message}</Message>}
                <Actions>
                    <CancelBtn onClick={onCancel}>{cancelLabel}</CancelBtn>
                    <ConfirmBtn onClick={onConfirm} danger={danger}>{confirmLabel}</ConfirmBtn>
                </Actions>
            </Modal>
        </Backdrop>
    )
}

const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`
const slideUp = keyframes`from { transform: translateY(16px) scale(0.97); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; }`

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: ${fadeIn} 0.15s ease;
`

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  width: 100%;
  max-width: 400px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  animation: ${slideUp} 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  text-align: center;
`

const IconWrapper = styled.div`
  font-size: 40px;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme, danger }) => danger ? theme.colors.danger + '15' : theme.colors.primary + '15'};
  border: 1px solid ${({ theme, danger }) => danger ? theme.colors.danger + '40' : theme.colors.primary + '40'};
`

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const Message = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.xs};
`

const CancelBtn = styled.button`
  flex: 1;
  padding: 11px;
  border-radius: ${({ theme }) => theme.radii.md};
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

const ConfirmBtn = styled.button`
  flex: 1;
  padding: 11px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: ${({ theme, danger }) => danger ? theme.colors.danger : theme.colors.primary};
  transition: opacity 0.2s ease;
  &:hover { opacity: 0.85; }
`

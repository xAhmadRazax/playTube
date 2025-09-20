// Backdrop.tsx
interface BackdropProps {
  isOpen: boolean
  onClick: () => void
  zIndex?: string
  classes?: string
}

export const Backdrop = ({
  isOpen,
  onClick,
  zIndex = 'z-50',
  classes = '',
}: BackdropProps) => {
  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 bg-zinc-100/20 backdrop-blur-xs ${zIndex} ${classes}`}
      onClick={onClick}
    />
  )
}

import { createContext, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { Backdrop } from '@/components/Backdrop'

type BackdropSource = {
  value: null | 'sidebar' | 'model'
  cb?: null | (() => void)
}

interface OverlayContextType {
  backdropActive: boolean
  setBackdropActive: Dispatch<SetStateAction<boolean>>
  setClasses: Dispatch<SetStateAction<string>>
  classes: string
  backdrop: BackdropSource
  setBackdrop: Dispatch<SetStateAction<BackdropSource>>
  activeBackdrop: (type: BackdropSource) => void
  closeBackdrop: (cl?: () => void) => void
}

export const OverlayContext = createContext<OverlayContextType>({
  backdropActive: false,
  setBackdropActive: () => {}, // noop default,
  setClasses: () => {},
  classes: '',
  backdrop: { value: null },
  setBackdrop: () => {},
  activeBackdrop: () => {},
  closeBackdrop: () => {},
})

export const OverlayProvider = ({ children }: { children?: ReactNode }) => {
  const [backdropActive, setBackdropActive] = useState(false)
  const [backdrop, setBackdrop] = useState<BackdropSource>({ value: null })
  const [classes, setClasses] = useState<string>('')

  const activeBackdrop = (type: BackdropSource) => {
    setBackdrop(type)
  }
  const closeBackdrop = (cb?: () => void) => {
    setBackdrop({ value: null, cb: null })
    cb && cb()
  }

  console.log(!!backdrop)

  return (
    <OverlayContext.Provider
      value={{
        backdropActive,
        setBackdropActive,
        setClasses,
        classes,
        backdrop,
        setBackdrop,
        activeBackdrop,
        closeBackdrop,
      }}
    >
      {children}

      {
        // backdropActive
        !!backdrop.value &&
          createPortal(
            <Backdrop
              isOpen={
                // backdropActive
                !!backdrop.value
              }
              onClick={() => {
                // setBackdropActive(false)
                closeBackdrop(
                  typeof backdrop.cb === 'function' ? backdrop.cb : undefined,
                )
              }}
              classes={classes}
            />,
            document.getElementById('overlays') as HTMLElement,
          )
      }
    </OverlayContext.Provider>
  )
}
export const useOverlayContext = () => {
  const context = useContext(OverlayContext)
  return context
}

import { useEffect, useState } from 'react'
import { ExpendedSidebar } from './ExpendedSidebar'
import { CollapseSidebar } from './CollapseSidebar'

import type { Dispatch, SetStateAction } from 'react'
import { useOverlayContext } from '@/contexts/OverlayContext'
import { useSettings } from '@/contexts/SettingsContent'

export const Sidebar = ({
  isMenuOpen,
  setIsMenuOpen,
  toggleSidebar,
}: {
  toggleSidebar: () => void
  isMenuOpen: boolean
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const {
    backdropActive,
    setBackdropActive,
    setClasses,
    activeBackdrop,
    closeBackdrop,
  } = useOverlayContext()
  //   const [isMobile, setIsMobile] = useState(window.innerWidth < 786)

  let isMobile = window.innerWidth < 786

  //  so this is what for backdrop in case of menu
  //  -1 if it is mobile show backdrop
  // -1 if it is not then dont
  // seem like since state is changing i could use another/ derived state or useEffect...

  // but there are too many issues like what if like youtube when ur on some video u click on menu it shows backdrop in either case if ur on mobile/desktop
  // i think sol could be make the the root element (not the html i meant that one wrap the menu) as backdrop?
  useEffect(() => {
    const callback = () => {
      //   setIsMobile(window.innerWidth < 786)
      isMobile = window.innerWidth < 786

      setClasses('z-50')
    }

    window.addEventListener('resize', callback)
    return () => {
      window.removeEventListener('resize', callback)
      setClasses('')
    }
  }, [])

  useEffect(() => {
    console.log('im re-rendering component')
    console.log(isMenuOpen, 'is open')
    if (isMenuOpen && isMobile) {
      // setBackdropActive(true)
      activeBackdrop({ value: 'sidebar', cb: () => setIsMenuOpen(false) })
    } else {
      console.log('backdrop is removed')
      // setBackdropActive(false)
      closeBackdrop()
    }
  }, [isMenuOpen, isMobile])

  return (
    <>
      {isMenuOpen ? (
        <ExpendedSidebar
          toggleSidebar={toggleSidebar}
          classes="z-50"
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          hasBackdrop={false}
        />
      ) : (
        <CollapseSidebar />
      )}
    </>
  )
}

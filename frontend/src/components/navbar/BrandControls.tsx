import { Link } from '@tanstack/react-router'
import type { Dispatch, SetStateAction } from 'react'

export const BrandControls = ({
  isMenuOpen,
  setIsMenuOpen,
  siteLogoSVG,
  classes,
  toggleSidebar,
}: {
  classes?: string
  isMenuOpen: boolean
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>
  siteLogoSVG: string
  toggleSidebar: () => void
}) => {
  return (
    <div className={`flex items-center gap-8 ${classes ? classes : ''}`}>
      <div className="">
        <button
          onClick={toggleSidebar}
          className={`hidden md:block hamburger ${isMenuOpen ? 'active' : ''}`}
        >
          <div></div>
        </button>
      </div>

      {/* MAIN LOGO */}
      <Link
        className="h-14 place-self-start rounded-full outline-0 hover:scale-105 active:ring-2 active:ring-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-500 transition-all duration-100"
        to="/"
        dangerouslySetInnerHTML={{ __html: siteLogoSVG }}
      ></Link>
    </div>
  )
}

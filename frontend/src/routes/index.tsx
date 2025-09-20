import { useState } from 'react'

import { Outlet, createFileRoute } from '@tanstack/react-router'
import Header from '@/components/navbar/Header'
import { Sidebar } from '@/components/sidebar/Sidebar'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const openSidebar = () => {
    setIsMenuOpen(true)
  }

  const closeSidebar = () => {
    setIsMenuOpen(false)
  }

  const toggleSidebar = () => {
    setIsMenuOpen((v) => !v)
  }
  return (
    <>
      <Header
        toggleSidebar={toggleSidebar}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <div
        className={`  mt-[72px] max-w-screen-2xl mx-auto grid h-[calc(100vh-72px)] overflow-y-auto ${isMenuOpen ? `grid-cols-[200px_1fr]` : `grid-cols-[100px_1fr]`}`}
      >
        <Sidebar
          toggleSidebar={toggleSidebar}
          setIsMenuOpen={setIsMenuOpen}
          isMenuOpen={isMenuOpen}
        />
        <main className="min-h-0 h-[200vh] ">
          <Outlet />
        </main>
      </div>
    </>
  )
}

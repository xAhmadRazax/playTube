import { useEffect, useState } from 'react';

import type { ReactNode } from 'react';
import Header from '@/components/navbar/Header';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { useAuthStore } from '@/store/useAuth';

export const Layout = ({ children }: { children: ReactNode }) => {
  const { refreshUser } = useAuthStore();
  useEffect(() => {
    refreshUser();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const openSidebar = () => {
    setIsMenuOpen(true);
  };

  const closeSidebar = () => {
    setIsMenuOpen(false);
  };

  const toggleSidebar = () => {
    setIsMenuOpen((v) => !v);
  };
  return (
    <>
      <Header
        toggleSidebar={toggleSidebar}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <div
        className={`  mt-[72px] max-w-screen-2xl mx-auto grid h-[calc(100vh-72px)] overflow-y-auto  ${isMenuOpen ? `md:grid-cols-[200px_1fr] open` : `md:grid-cols-[100px_1fr] close`}`}
      >
        <Sidebar
          toggleSidebar={toggleSidebar}
          setIsMenuOpen={setIsMenuOpen}
          isMenuOpen={isMenuOpen}
        />
        <main className="h-screen md:col-start-2 md:col-end-3 ">
          {children}
        </main>
      </div>
    </>
  );
};

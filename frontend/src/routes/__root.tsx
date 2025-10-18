import { useEffect } from 'react';
import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ToastContainer } from 'react-toastify';
import type { SettingsProps } from '@/store/useSettings';
import { axios } from '@/utils/axios.util';
import { Layout } from '@/components/layout/Layout';
import { useSettingStore } from '@/store/useSettings';

const RootLayout = () => {
  const { settings } = Route.useLoaderData();

  useEffect(() => {
    useSettingStore.setState({ settings: settings });
  }, [settings]);

  const location = useLocation(); // ← This updates on navigation!
  const isAuthPage =
    location.pathname.includes('/auth/') ||
    location.pathname.includes('/studio/');
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {isAuthPage ? (
        <Outlet />
      ) : (
        <Layout>
          <Outlet />
        </Layout>
      )}
      {/* <TanStackRouterDevtools /> */}
    </>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  loader: async () => {
    const { data } = await axios.get('admin-settings/get-public-settings');
    return { settings: data.data as SettingsProps };
  },
});

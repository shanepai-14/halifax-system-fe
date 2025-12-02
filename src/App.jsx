import { Provider } from 'react-redux';
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom';
import ThemeCustomization from './themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from '@/store/store';
import ScrollTop from '@components/ScrollTop';
import router from './router';
import "./index.css";

// Detect Electron (works with contextIsolation: true)
const isElectron = typeof window !== 'undefined' &&
  (window.electronBridge || (window.process && window.process.type));

const appRouter = isElectron
  ? createHashRouter(router)     // <--- FIXES THE 404 ERROR
  : createBrowserRouter(router); // <--- For web/PWA use

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeCustomization>
          <ScrollTop>
            <RouterProvider router={appRouter} />
          </ScrollTop>
        </ThemeCustomization>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;

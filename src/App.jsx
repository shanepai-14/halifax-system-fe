import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ThemeCustomization from './themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from '@/store/store';
import ScrollTop from '@components/ScrollTop';
import router from './router';
import "./index.css";
// Create browser router with your routes
const browserRouter = createBrowserRouter(router);

const queryClient = new QueryClient();
function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
    <ThemeCustomization>
      <ScrollTop>
        <RouterProvider router={browserRouter} />
      </ScrollTop>
    </ThemeCustomization>
    <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ThemeCustomization from './themes';
import ScrollTop from '@components/ScrollTop';
import router from './router';

// Create browser router with your routes
const browserRouter = createBrowserRouter(router);

function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <RouterProvider router={browserRouter} />
      </ScrollTop>
    </ThemeCustomization>
  );
}

export default App;
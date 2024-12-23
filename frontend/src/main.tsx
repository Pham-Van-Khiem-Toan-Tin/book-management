import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import Login from './pages/login/Login.tsx'
import Dashboard from './pages/dashboard/Dashboard.tsx';
import LoginSuccess from './pages/login/LoginSuccess.tsx';
import { Provider } from 'react-redux';
import { store } from './apis/store.ts';
import CategoryList from './pages/category/list/CategoryList.tsx';
import CategoryCreate from './pages/category/create/CategoryCreate.tsx';
import CategoryDetail from './pages/category/detail/CategoryDetail.tsx';
import CategoryEdit from './pages/category/edit/CategoryEdit.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace={true} />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "categories/all",
        element: <CategoryList />
      },
      {
        path: "categories/create",
        element: <CategoryCreate />
      },
      {
        path: "categories/view/:id",
        element: <CategoryDetail />
      },
      {
        path: "categories/edit/:id",
        element: <CategoryEdit />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/login-success",
    element: <LoginSuccess />
  }
])

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)

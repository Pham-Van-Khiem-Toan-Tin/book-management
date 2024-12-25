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
import CategoryList from './pages/category/CategoryList.tsx';
import CategoryCreate from './pages/category/CategoryCreate.tsx';
import CategoryDetail from './pages/category/CategoryDetail.tsx';
import CategoryEdit from './pages/category/CategoryEdit.tsx';
import LibraryList from './pages/library/LibraryList.tsx';
import LibraryCreate from './pages/library/LibraryCreate.tsx';
import LibraryDetail from './pages/library/LibraryDetail.tsx';
import LibraryEdit from './pages/library/LibraryEdit.tsx';
import BookcaseList from './pages/bookcase/BookcaseList.tsx';
import BookcaseCreate from './pages/bookcase/BookcaseCreate.tsx';
import BookcaseDetail from './pages/bookcase/BookcaseDetail.tsx';
import BookcaseEdit from './pages/bookcase/BookcaseEdit.tsx';
import BookshelfList from './pages/bookshelf/BookshelfList.tsx';
import BookshelfCreate from './pages/bookshelf/BookshelfCreate.tsx';
import BookshelfDetail from './pages/bookshelf/BookshelfDetail.tsx';
import BookshelfEdit from './pages/bookshelf/BookshelfEdit.tsx';
import UserList from './pages/user/UserList.tsx';
import UserView from './pages/user/UserView.tsx';
import UserEdit from './pages/user/UserEdit.tsx';

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
        path: "users/all",
        element: <UserList />
      },
      {
        path: "users/view/:id",
        element: <UserView />
      },
      {
        path: "users/edit/:id",
        element: <UserEdit />
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
      },
      {
        path: "libraries/all",
        element: <LibraryList />
      },
      {
        path: "libraries/create",
        element: <LibraryCreate />
      },
      {
        path: "libraries/view/:id",
        element: <LibraryDetail />
      },
      {
        path: "libraries/edit/:id",
        element: <LibraryEdit />
      },
      {
        path: "bookcases/all",
        element: <BookcaseList />
      },
      {
        path: "bookcases/create",
        element: <BookcaseCreate />
      },
      {
        path: "bookcases/view/:id",
        element: <BookcaseDetail />
      },
      {
        path: "bookcases/edit/:id",
        element: <BookcaseEdit />
      },
      {
        path: "bookshelves/all",
        element: <BookshelfList />
      },
      {
        path: "bookshelves/create",
        element: <BookshelfCreate />
      },
      {
        path: "bookshelves/view/:id",	
        element: <BookshelfDetail />
      },
      {
        path: "bookshelves/edit/:id",
        element: <BookshelfEdit />
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

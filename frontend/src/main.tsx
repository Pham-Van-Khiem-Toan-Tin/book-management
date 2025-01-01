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
import AuthoritiesList from './pages/authority/AuthoritiesList.tsx';
import AuthorityDetail from './pages/authority/AuthorityDetail.tsx';
import FunctionsList from './pages/authority/FunctionsList.tsx';
import SubFunctionsList from './pages/authority/SubFunctionsList.tsx';
import SubFunctionCreate from './pages/authority/SubFunctionCreate.tsx';
import FunctionEdit from './pages/authority/FunctionEdit.tsx';
import AuthorityEdit from './pages/authority/AuthorityEdit.tsx';
import BookList from './pages/book/BookList.tsx';
import BookCreate from './pages/book/BookCreate.tsx';
import BookDetail from './pages/book/BookDetail.tsx';
import BookEdit from './pages/book/BookEdit.tsx';
import { BorrowList } from './pages/borrow/BorrowList.tsx';
import ProtectRouter from './common/protect-router/ProtectRouter.tsx';
import BorrowCreate from './pages/borrow/BorrowCreate.tsx';
import BookshelfAddBook from './pages/bookshelf/BookshelfAddBook.tsx';
import Error403 from './pages/error/error403.tsx';
import LoginFail from './pages/login/LoginFail.tsx';

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
        element: (
          <ProtectRouter>
            <Dashboard />
          </ProtectRouter>
        )
      },
      {
        path: "users/all",
        element:
          (
            <ProtectRouter>
              <UserList />
            </ProtectRouter>
          )
      },
      {
        path: "users/view/:id",
        element:
          (
            <ProtectRouter>
              <UserView />
            </ProtectRouter>
          )
      },
      {
        path: "users/edit/:id",
        element:
          (
            <ProtectRouter>
              <UserEdit />
            </ProtectRouter>
          )
      },
      {
        path: "authorities/all",
        element:
          (
            <ProtectRouter>
              <AuthoritiesList />
            </ProtectRouter>
          )
      },
      {
        path: "authorities/view/:id",
        element:
          (
            <ProtectRouter>
              <AuthorityDetail />
            </ProtectRouter>
          )
      },
      {
        path: "authorities/edit/:id",
        element:
          (
            <ProtectRouter>
              <AuthorityEdit />
            </ProtectRouter>
          )
      },
      {
        path: "functions/all",
        element:
          (
            <ProtectRouter>
              <FunctionsList />
            </ProtectRouter>
          )
      },
      {
        path: "functions/edit/:id",
        element:
          (
            <ProtectRouter>
              <FunctionEdit />
            </ProtectRouter>
          )
      },
      {
        path: "subfunctions/all",
        element:
          (
            <ProtectRouter>
              <SubFunctionsList />
            </ProtectRouter>
          )
      },
      {
        path: "subfunctions/create",
        element:
          (
            <ProtectRouter>
              <SubFunctionCreate />
            </ProtectRouter>
          )
      },
      {
        path: "categories/all",
        element:
          (
            <ProtectRouter>
              <CategoryList />
            </ProtectRouter>
          )
      },
      {
        path: "categories/create",
        element:
          (
            <ProtectRouter>
              <CategoryCreate />
            </ProtectRouter>
          )
      },
      {
        path: "categories/view/:id",
        element:
          (
            <ProtectRouter>
              <CategoryDetail />
            </ProtectRouter>
          )
      },
      {
        path: "categories/edit/:id",
        element:
          (
            <ProtectRouter>
              <CategoryEdit />
            </ProtectRouter>
          )
      },
      {
        path: "libraries/all",
        element:
          (
            <ProtectRouter>
              <LibraryList />
            </ProtectRouter>
          )
      },
      {
        path: "libraries/create",
        element:
          (
            <ProtectRouter>
              <LibraryCreate />
            </ProtectRouter>
          )
      },
      {
        path: "libraries/view/:id",
        element:
          (
            <ProtectRouter>
              <LibraryDetail />
            </ProtectRouter>
          )
      },
      {
        path: "libraries/edit/:id",
        element:
          (
            <ProtectRouter>
              <LibraryEdit />
            </ProtectRouter>
          )
      },
      {
        path: "bookcases/all",
        element:
          (
            <ProtectRouter>
              <BookcaseList />
            </ProtectRouter>
          )
      },
      {
        path: "bookcases/create",
        element:
          (
            <ProtectRouter>
              <BookcaseCreate />
            </ProtectRouter>
          )
      },
      {
        path: "bookcases/view/:id",
        element:
          (
            <ProtectRouter>
              <BookcaseDetail />
            </ProtectRouter>
          )
      },
      {
        path: "bookcases/edit/:id",
        element:
          (
            <ProtectRouter>
              <BookcaseEdit />
            </ProtectRouter>
          )
      },
      {
        path: "bookshelves/all",
        element:
          (
            <ProtectRouter>
              <BookshelfList />
            </ProtectRouter>
          )
      },
      {
        path: "bookshelves/create",
        element:
          (
            <ProtectRouter>
              <BookshelfCreate />
            </ProtectRouter>
          )
      },
      {
        path: "bookshelves/view/:id",
        element:
          (
            <ProtectRouter>
              <BookshelfDetail />
            </ProtectRouter>
          )
      },
      {
        path: "bookshelves/edit/:id",
        element:
          (
            <ProtectRouter>
              <BookshelfEdit />
            </ProtectRouter>
          )
      },
      {
        path: "/bookshelves/:id/book/add",
        element:
          (
            <ProtectRouter>
              <BookshelfAddBook />
            </ProtectRouter>
          )
      },
      {
        path: "books/all",
        element:
          (
            <ProtectRouter>
              <BookList />
            </ProtectRouter>
          )
      },
      {
        path: "/books/create",
        element:
          (
            <ProtectRouter>
              <BookCreate />
            </ProtectRouter>
          )
      },
      {
        path: "/books/view/:id",
        element:
          (
            <ProtectRouter>
              <BookDetail />
            </ProtectRouter>
          )
      },
      {
        path: "/books/edit/:id",
        element:
          (
            <ProtectRouter>
              <BookEdit />
            </ProtectRouter>
          )
      },
      {
        path: "/borrows/all",
        element:
          (
            <ProtectRouter>
              <BorrowList />
            </ProtectRouter>
          )
      },
      {
        path: "/borrows/create",
        element:
          (
            <ProtectRouter>
              <BorrowCreate />
            </ProtectRouter>
          )
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/login-fail/:message",
    element: <LoginFail />
  },
  {
    path: "/login-success",
    element: <LoginSuccess />
  },
  {
    path: "/403",
    element: <Error403 />
  }
])

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)

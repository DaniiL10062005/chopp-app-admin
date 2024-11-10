import { createBrowserRouter, Navigate } from 'react-router-dom';
import {
  SignInPage,
  UsersPage,
  RegisterPage,
  ChatsPage,
  ActivityPage,
  UserPage,
} from '@pages/index';
import { ROUTES } from '@shared/enum';
import { MainMenu } from '@shared/index';
import { GuardedRoute } from './guarded-route';
import { ChatsContextProvider } from '@pages/chats/chats-context';

export const router = createBrowserRouter([
  {
    path: ROUTES.SIGN_IN,
    element: <SignInPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.ROOT,
    element: (
      <GuardedRoute>
        <MainMenu />
      </GuardedRoute>
    ),
    children: [
      {
        path: '',
        element: <UsersPage />,
      },
      {
        path: ROUTES.CHATS,
        element: (
          <ChatsContextProvider>
            <ChatsPage />
          </ChatsContextProvider>
        ),
      },
      {
        path: ROUTES.ACTIVITY,
        element: <ActivityPage />,
      },
      {
        path: `${ROUTES.USERS}/:id`, // Updated path for user profiles
        element: <UserPage />,
      },
    ],
  },
  // {
  //   path: '*', // Wildcard route for unknown paths
  //   element: <Navigate to={ROUTES.USERS} replace />,
  // },
]);

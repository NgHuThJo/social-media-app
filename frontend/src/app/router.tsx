import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuthContextApi } from "@frontend/providers/auth-context";
import { AppRoot } from "./root";
import { chatAction } from "@frontend/features/chat/components/form/form";
import { chatLoader, ChatRoute } from "./routes/chat";
import { ErrorRoute } from "./routes/error";
import { FeedRoute, feedAction, feedLoader } from "./routes/feed";
import { FriendRoute, friendLoader } from "./routes/friend";
import { LandingRoute } from "./routes/landing";
import { LoginRoute } from "./routes/login";
import { loginAction } from "@frontend/features/auth/components/login/login-form";
import { PostRoute, postLoader, postAction } from "./routes/post";
import { ProfileRoute, profileLoader } from "./routes/profile";
import { ProtectedRoute } from "./routes/protected";
import { RegisterRoute } from "./routes/register";
import { registerAction } from "@frontend/features/auth/components/register/register-form";

export function Router() {
  const authContextApi = useAuthContextApi();

  const routesConfig = [
    {
      path: "/",
      element: <LandingRoute />,
      errorElement: <ErrorRoute />,
    },
    {
      path: "/auth/register",
      element: <RegisterRoute />,
      action: registerAction,
    },
    {
      path: "/auth/login",
      element: <LoginRoute />,
      action: loginAction(authContextApi),
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: ":userId",
          element: <AppRoot />,
          children: [
            {
              path: "profile",
              element: <ProfileRoute />,
              loader: profileLoader,
            },
            {
              path: "friends",
              element: <FriendRoute />,
              loader: friendLoader,
            },
            {
              path: "posts",
              element: <PostRoute />,
              loader: postLoader,
              action: postAction,
            },
            {
              path: "feeds",
              element: <FeedRoute />,
              loader: feedLoader,
              action: feedAction,
            },
            {
              path: "chat",
              element: <ChatRoute />,
              loader: chatLoader,
              action: chatAction,
            },
          ],
        },
      ],
    },
  ];

  const router = createBrowserRouter(routesConfig);

  return <RouterProvider router={router} />;
}

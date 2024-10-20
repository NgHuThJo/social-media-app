import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuthContextApi } from "#frontend/providers/auth-context";
import { AppRoot } from "./root";
import { chatAction } from "#frontend/features/chat/components/form/form";
import { chatLoader, ChatRoute } from "./routes/chat";
import { ErrorRoute } from "./routes/error";
import { FeedRoute, feedAction, feedLoader } from "./routes/feed";
import { FriendRoute, friendLoader } from "./routes/friend";
import { IndexRoute, indexLoader } from "./routes";
import { LandingRoute } from "./routes/landing";
import { LoginRoute } from "./routes/login";
import { loginAction } from "#frontend/features/auth/components/login/form";
import { NotFoundRoute } from "./routes/not-found";
import { PostRoute, postLoader, postAction } from "./routes/post";
import { PublicProfileRoute } from "./routes/public-profile";
import { ProfileRoute, profileLoader } from "./routes/profile";
import { ProtectedRoute } from "./routes/protected";
import { RegisterRoute } from "./routes/register";
import { registerAction } from "#frontend/features/auth/components/register/form/form";
import { SettingsRoute } from "./routes/settings";
import { settingsAction } from "#frontend/features/settings/components/settings";

export function Router() {
  const authContextApi = useAuthContextApi();

  const routesConfig = [
    {
      errorElement: <ErrorRoute />,
      children: [
        {
          path: "/",
          element: <LandingRoute />,
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
                  path: "index",
                  element: <IndexRoute />,
                  loader: indexLoader,
                },
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
                {
                  path: "settings",
                  element: <SettingsRoute />,
                  action: settingsAction(authContextApi),
                },
                {
                  path: "profile/:profileId",
                  element: <PublicProfileRoute />,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundRoute />,
    },
  ];

  const router = createBrowserRouter(routesConfig);

  return <RouterProvider router={router} />;
}

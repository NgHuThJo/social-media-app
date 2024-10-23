# Social media app

This is a social media app with basic features of Facebook. It leverages [React](https://react.dev) for the frontend, and [ExpressJS](https://expressjs.com), [tRPC](https://trpc.io/) and [Prisma ORM](https://www.prisma.io/) for the backend. For real-time chat and notification the library [Socket.io](https://socket.io/) is used.

## Features

### Authentication
+ Registration
+ Login with registration or guest account
+ Persistent user session until explicit logout

### Post
+ Create and edit posts
+ Give likes to posts
+ Comment on posts and other comments
+ Create feeds with images
+ Follow and unfollow other users
+ Send, accept and decline friend requests

### Profile
+ Profile view with your personal data
+ Profile view of other users
+ Change your profile picture

### Real-time
+ Create new chatrooms
+ Join chatrooms
+ Write messages with emoji selector
+ Persistent chat history

## Responsive Design

The app is responsive on various screen sizes, starting with 320px.

## Navigation

[React Router](https://reactrouter.com/en/main) is used for client-side routing.

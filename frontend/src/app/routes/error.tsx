import { Link, useRouteError } from "react-router-dom";

export function ErrorRoute() {
  const error = useRouteError();

  console.error(error);

  return (
    <div>
      <h1>Something went wrong.</h1>
      <p>{(error as Error).message || "No error message"}</p>
      <Link to="/" replace aria-label="Go to home">
        You can go back to the home page by clicking here, though!
      </Link>
    </div>
  );
}

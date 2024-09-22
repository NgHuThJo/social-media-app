import { useEffect, useState } from "react";
import { Link, useRouteError } from "react-router-dom";

export function ErrorRoute() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const error = useRouteError();

  useEffect(() => {
    if (error instanceof Response) {
      error.text().then((text) => {
        try {
          const json = JSON.parse(text);
          setErrorMessage(json.errors);
        } catch (error) {
          setErrorMessage(text);
        }
      });
    }
  }, [error]);

  return (
    <div>
      {error instanceof Response ? (
        <>
          <p>{error.status}</p>
          <p>{error.statusText}</p>
          <pre>{errorMessage}</pre>
        </>
      ) : (
        <h1>Something went wrong.</h1>
      )}
      <Link to="/" replace aria-label="Go to home">
        You can go back to the home page by clicking here, though!
      </Link>
    </div>
  );
}

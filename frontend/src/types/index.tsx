import { ActionFunction, LoaderFunction, Params } from "react-router-dom";

export type LoaderData<TLoaderFn extends LoaderFunction> =
  Awaited<ReturnType<TLoaderFn>> extends Response | infer R ? R : never;

export type ActionData<TActionFn extends ActionFunction> =
  Awaited<ReturnType<TActionFn>> extends Response | infer R ? R : never;

type DataFunctionValue = Response | NonNullable<unknown> | null;
type DataFunctionReturnValue = Promise<DataFunctionValue> | DataFunctionValue;

export type ActionDispatchFunction = (
  request: Request,
  params: Params,
  formData: FormData,
) => DataFunctionReturnValue;

export type Intent = "post" | "postComment" | "comment";

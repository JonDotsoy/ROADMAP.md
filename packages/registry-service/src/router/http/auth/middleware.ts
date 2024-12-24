import type { Middleware } from "artur/http/router";
import { auth } from "./auth";

export const middleware: Middleware<any> = (fetch) => {
  return async (req) => {
    const isAuthenticated = await auth.authRequest(req);
    if (!isAuthenticated) return new Response(null, { status: 401 });
    return fetch(req);
  };
};

import { Router } from "artur";
import { serverTimeAlive } from "./stores/server-time-alive";
import { middleware } from "./auth/middleware";
import { bootstrap } from "../../bootstrap";

const { webhook } = await bootstrap();
export const router = new Router();

router.use("POST", "/hook", {
  fetch: async (request) => {
    return await webhook.dispatchRequestHook(request);
  },
});

router.use("POST", "/aaa", {
  fetch: async (req) => {
    console.log("aaa:");
    console.log("  Method:", req.method);
    console.log("  Headers:", req.headers.toJSON());
    console.log("  Body:", await req.text());
    return Response.json({});
  },
});

router.use("GET", "/health", {
  fetch: () =>
    Response.json({
      timeAliveMs: Date.now() - serverTimeAlive.get(),
    }),
});

// router.use("GET", "/registry/:owner/:project_id", {
//   middlewares: [middleware],
//   fetch: () => Response.json("ok"),
// });
// router.use("GET", "/registry/:owner/:project_id/:version", {
//   middlewares: [middleware],
// });
// router.use("PUT", "/registry/:owner/:project_id/:version/:branch", {
//   middlewares: [middleware],
// });
// router.use("PUT", "/registry/:owner/:project_id/:version/:branch/deprecate", {
//   middlewares: [middleware],
// });

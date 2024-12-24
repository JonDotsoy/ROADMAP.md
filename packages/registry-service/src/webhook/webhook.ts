import type { WebhookEvent, PushEvent } from "@octokit/webhooks-types";
import type { Registry } from "../registry/registry";
import type { WebhookQueue } from "./queue/webhook-queue";

export class Webhook {
  constructor(
    readonly registry: Registry,
    readonly webhookQueue: WebhookQueue,
  ) { }

  async dispatchPushEvent(request: Request, pushEvent: PushEvent) {
    await this.webhookQueue.append(request, pushEvent);
  }

  dispatchRequestHook = async (request: Request) => {
    const githubEvent = request.headers.get("x-github-event");

    if (githubEvent === "ping") return new Response(null, { status: 204 });

    if (githubEvent === "push") {
      await this.dispatchPushEvent(request, await request.json());
      return new Response(null, { status: 200 });
    }

    return new Response(null, { status: 402 });
  };
}

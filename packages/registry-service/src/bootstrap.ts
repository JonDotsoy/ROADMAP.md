import { LocalStorage } from "./registry/provider/local-storage/local-storage";
import { providerFactory } from "./registry/provider/provider-factory";
import { Registry } from "./registry/registry";
import { settings } from "./settings";
import { WebhookQueue } from "./webhook/queue/webhook-queue";
import { Webhook } from "./webhook/webhook";

export const bootstrap = async () => {
  const storage = await providerFactory(settings.storageLocation);
  const registry = new Registry(storage);
  const webhookQueue = new WebhookQueue();
  const webhook = new Webhook(registry, webhookQueue);

  return {
    webhook,
    storage,
    registry,
  };
};

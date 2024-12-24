import { CloudTasksClient } from "@google-cloud/tasks";

export class WebhookQueue {
  private readonly client: CloudTasksClient;

  constructor() {
    this.client = new CloudTasksClient();
  }

  async append(request: Request, data: any) {
    await this.client.createTask({
      parent: this.client.queuePath(
        "jondotsoy",
        "us-central1",
        "roadmap-md-queue-0001",
      ),
      responseView: "FULL",
      task: {
        view: "FULL",
        httpRequest: {
          url: "https://readme-md-service-5656r4onda-uc.a.run.app",
          headers: {
            "Content-Type": "application/json",
          },
          body: Buffer.from(JSON.stringify(data)).toString("base64"),
        },
      },
    });
  }
}

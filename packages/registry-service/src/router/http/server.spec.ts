import { beforeAll, describe, expect, it, mock } from "bun:test";

describe("", () => {
  beforeAll(() => {
    mock.module(
      "../../settings",
      () =>
        ({
          settings: {
            auth: {
              staticToken: "aaaa",
            },
            http: {
              host: "0.0.0.0",
              port: 4000,
              basePath: undefined,
              url: undefined,
            },
          },
        }) as typeof import("../../settings"),
    );
  });

  it("", async () => {
    const { router } = await import("./router");

    const res = await router.fetch(new Request("http://localhost/health"));

    await res?.json();
  });

  it("", async () => {
    const { router } = await import("./router");

    const res = await router.fetch(
      new Request("http://localhost/registry/me/foo"),
    );

    expect(res?.status).toEqual(401);
  });

  it("", async () => {
    const { router } = await import("./router");

    const res = await router.fetch(
      new Request("http://localhost/registry/me/foo", {
        headers: {
          Authorization: "Bearer bbbb",
        },
      }),
    );

    expect(res?.status).toEqual(401);
  });

  it("", async () => {
    const { router } = await import("./router");

    const res = await router.fetch(
      new Request("http://localhost/registry/me/foo", {
        headers: {
          Authorization: "Bearer aaaa",
        },
      }),
    );

    expect(res?.status).toEqual(200);
  });
});

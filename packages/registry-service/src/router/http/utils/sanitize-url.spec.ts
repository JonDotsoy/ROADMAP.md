import { describe, expect, it } from "bun:test";
import { sanitizeURL } from "./sanitize-url";

describe("sanitizeURL", () => {
  it("should replace 0.0.0.0 with localhost", () =>
    expect(sanitizeURL(new URL("http://0.0.0.0:3000")).toString()).toEqual(
      `http://localhost:3000/`,
    ));
  it("should replace 0.0.0.0 with localhost and keep the path", () =>
    expect(sanitizeURL(new URL("http://0.0.0.0:3000/api")).toString()).toEqual(
      `http://localhost:3000/api`,
    ));
  it("should replace 127.0.0.1 with localhost", () =>
    expect(sanitizeURL(new URL("http://127.0.0.1:3000")).toString()).toEqual(
      `http://localhost:3000/`,
    ));
  it("should replace 127.0.0.1 with localhost on port 80", () =>
    expect(sanitizeURL(new URL("http://127.0.0.1:80")).toString()).toEqual(
      `http://localhost/`,
    ));
  it("should replace 0.0.0.0 with localhost on port 80", () =>
    expect(sanitizeURL(new URL("http://0.0.0.0:80")).toString()).toEqual(
      `http://localhost/`,
    ));
  it("should replace 0.0.0.0 with a custom domain", () =>
    expect(
      sanitizeURL(
        new URL("http://0.0.0.0:8080"),
        undefined,
        "https://my-domain",
      ).toString(),
    ).toEqual(`https://my-domain/`));
  it("should replace 0.0.0.0 with a custom domain and keep the path", () =>
    expect(
      sanitizeURL(
        new URL("http://0.0.0.0:8080/api"),
        undefined,
        "https://my-domain",
      ).toString(),
    ).toEqual(`https://my-domain/api`));
  it("should add a prefix to the path", () =>
    expect(
      sanitizeURL(new URL("http://0.0.0.0:80/resource"), "/api/").toString(),
    ).toEqual(`http://localhost/api/resource`));
  it("should add a prefix to the path and replace with custom domain", () =>
    expect(
      sanitizeURL(
        new URL("http://0.0.0.0:8080/resource"),
        "/api/",
        "https://my-domain",
      ).toString(),
    ).toEqual(`https://my-domain/api/resource`));
});

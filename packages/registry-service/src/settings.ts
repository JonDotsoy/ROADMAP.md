import { get } from "@jondotsoy/utils-js/get";

const getToNumber: typeof get.number = (...args) => {
  const value = get(...args);
  if (typeof value === "number") return value;
  if (typeof value === "string" && !isNaN(Number(value))) return Number(value);
  return undefined;
};

const getURL = (obj: any, ...args: string[]) => {
  const value = get.string(obj, ...args);
  if (value && URL.canParse(value)) return new URL(value);
  return undefined;
};

export const settings = {
  auth: {
    staticToken: get.string(process.env, "AUTH_STATIC_TOKEN"),
  },
  http: {
    host: get.string(process.env, "HTTP_HOST") ?? "localhost",
    port: getToNumber(process.env, "HTTP_PORT") ?? 3000,
    url: get.string(process.env, "HTTP_URL"),
    basePath: get.string(process.env, "HTTP_BASE_PATH"),
  },
  storageLocation: getURL(process.env, "STORAGE")!,
};

if (!settings.storageLocation) throw new Error("STORAGE is required");

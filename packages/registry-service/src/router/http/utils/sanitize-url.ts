const sanitizeHostnameURL = (url: URL) => {
  const aliasHostnames: Record<string, string | undefined> = {
    "0.0.0.0": "localhost",
    "127.0.0.1": "localhost",
  };

  const hostname = aliasHostnames[url.hostname] ?? url.hostname;
  const port = url.port;

  return new URL(`//${hostname}:${port}`, url);
};

export const sanitizeURL = (
  url: URL,
  basePath: string = "",
  baseUrl?: string,
) => {
  return new URL(
    `.${url.pathname}`,
    new URL(basePath, baseUrl ?? sanitizeHostnameURL(url).origin),
  );
};

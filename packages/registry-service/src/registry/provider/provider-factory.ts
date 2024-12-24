import { GoogleStorage } from "./google-storage/google-storage";
import { LocalStorage } from "./local-storage/local-storage";

export const providerFactory = async (location: URL) => {
  const protocol = location.protocol;

  if (protocol === "file:") return await LocalStorage.create(location);
  if (protocol === "gs:") return await GoogleStorage.create(location);

  throw new Error(`Invalid protocol: ${protocol}`);
};

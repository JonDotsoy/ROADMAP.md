import type { StorageProviderDTO } from "../../dtos/storage-provider-dto";
import * as fs from "fs/promises";

// const storageLocation = new URL("./.storage/", import.meta.url);

// await fs.mkdir(storageLocation, { recursive: true });

const sha256 = async (str: string): Promise<string> => {
  const strArr = new TextEncoder().encode(str);
  const strDigest = await crypto.subtle.digest("SHA-256", strArr);
  const hex = Array.from(new Uint8Array(strDigest), (e) =>
    e.toString(16).padStart(2, "0"),
  ).join("");
  return hex;
};

export class LocalStorage implements StorageProviderDTO {
  private constructor(readonly storageLocation: URL) {}
  async init() {
    await fs.mkdir(this.storageLocation, { recursive: true });
  }
  async set(key: string, value: string): Promise<void> {
    const keyHex = await sha256(key);
    const location = new URL(keyHex, this.storageLocation);
    await fs.writeFile(location, value);
  }
  async get(key: string): Promise<string | undefined> {
    const keyHex = await sha256(key);
    const location = new URL(keyHex, this.storageLocation);
    if (!(await fs.exists(location))) return undefined;
    return await fs.readFile(location, "utf-8");
  }
  async has(key: string): Promise<boolean> {
    const keyHex = await sha256(key);
    const location = new URL(keyHex, this.storageLocation);
    return await fs.exists(location);
  }
  async delete(key: string): Promise<boolean> {
    const keyHex = await sha256(key);
    const location = new URL(keyHex, this.storageLocation);
    await fs.unlink(location);
    return true;
  }
  static async create(storageLocation: URL) {
    const localStorage = new LocalStorage(storageLocation);
    await localStorage.init();
    return localStorage;
  }
}

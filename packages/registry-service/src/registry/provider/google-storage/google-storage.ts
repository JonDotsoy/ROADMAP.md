import type { StorageProviderDTO } from "../../dtos/storage-provider-dto";
import { Bucket, Storage } from "@google-cloud/storage";

export class GoogleStorage implements StorageProviderDTO {
  constructor(
    readonly storage: Storage,
    readonly bucket: Bucket,
  ) {}

  async get(key: string): Promise<string | undefined> {
    const [body] = await this.bucket.file(key).download();
    return new TextDecoder().decode(new Uint8Array(body));
  }
  async set(key: string, value: string): Promise<void> {
    await this.bucket.create({ key, value });
  }
  async has(key: string): Promise<boolean> {
    const [exists] = await this.bucket.exists({ key });
    return exists;
  }
  async delete(key: string): Promise<boolean> {
    await this.bucket.file(key).delete();
    return true;
  }

  static async create(url: URL) {
    const protocol = url.protocol;
    if (protocol !== "gs:") throw new Error("Invalid protocol");
    const storage = new Storage();
    return new GoogleStorage(storage, storage.bucket(url.hostname));
  }
}

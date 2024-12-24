export type StorageProviderDTO = {
  get: (key: string) => Promise<string | undefined>;
  set: (key: string, value: string) => Promise<void>;
  has: (key: string) => Promise<boolean>;
  delete: (key: string) => Promise<boolean>;
};

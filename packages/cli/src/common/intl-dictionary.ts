import * as fs from "fs";
import * as YAML from "yaml";
import { dictionary as rootDictionary } from "./dictionary.js";

/**
 * Internalization support
 *
 * Translate the locale
 */

namespace IntlDictionary {
  const INTL_DICTIONARY_WRITABLE = /^on$/.test(
    process.env.INTL_DICTIONARY_WRITABLE ?? "off",
  );

  const wfs: Partial<typeof fs> = INTL_DICTIONARY_WRITABLE
    ? {
        existsSync: fs.existsSync,
        readFileSync: fs.readFileSync,
        writeFileSync: fs.writeFileSync,
      }
    : {};

  type State<T> = { current: T };
  export const osLocale = process.env.LANG ?? "NONE";
  const dictionariesLocation = new URL(`./dictionary.yaml`, import.meta.url);
  export const modifies: State<number> = { current: 0 };
  export const dictionary: State<Record<string, Record<string, string[]>>> = {
    current: rootDictionary,
  };
  export const read = () =>
    YAML.parse(wfs.readFileSync?.(dictionariesLocation, "utf-8") ?? "{}");
  export const save = () =>
    wfs.writeFileSync?.(
      dictionariesLocation,
      YAML.stringify(dictionary.current),
      "utf-8",
    );

  if (wfs.existsSync && !wfs.existsSync?.(dictionariesLocation)) {
    save();
  }

  dictionary.current = read();

  const getPropertyByMatchableKey = (obj: any, key: string): any => {
    const c = getPropertyByMatchableKey.cache.get(obj)?.[key];
    if (c) {
      return c;
    }
    if (obj && typeof obj === "object" && obj !== null) {
      for (const matchableKey in obj) {
        const expr = new RegExp(
          `^${matchableKey.replace(/\W/g, (char) =>
            char === "*" ? ".*" : `\\${char}`,
          )}$`,
          "i",
        );
        // debug: console.log(expr, key, expr.test(key))
        if (expr.test(key)) {
          if (!getPropertyByMatchableKey.cache.has(obj)) {
            getPropertyByMatchableKey.cache.set(obj, {});
          }
          getPropertyByMatchableKey.cache.get(obj)![key] = obj[matchableKey];
          return obj[matchableKey];
        }
      }
    }
  };

  getPropertyByMatchableKey.cache = new WeakMap<any, Record<string, any>>();

  export const get = (
    locale: string,
    template: {
      raw: readonly string[] | ArrayLike<string>;
    },
  ) => {
    const keyString = Array.from(template.raw)
      .map(
        (part, index, parts) =>
          `${part}${index >= parts.length - 1 ? "" : `$\{${index}\}`}`,
      )
      .join("");
    const child = getPropertyByMatchableKey(dictionary.current, locale) ?? {};
    if (!child) {
      dictionary.current[locale] = child;
      modifies.current++;
    }
    if (!child[keyString]) {
      modifies.current++;
    }
    child[keyString] ??= template;
    if (modifies.current > 0) {
      save();
      modifies.current = 0;
    }
    return child[keyString];
  };
}

export const intld = (
  template: {
    raw: readonly string[] | ArrayLike<string>;
  },
  ...substitutions: any[]
) => {
  return String.raw(
    { raw: IntlDictionary.get(IntlDictionary.osLocale, template) },
    ...substitutions,
  );
};

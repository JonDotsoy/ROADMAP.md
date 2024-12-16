# Intl Dictionary

The Intl Dictionary library is a simple tool for automating the translation of an application. It allows for the creation of a dictionary from within the execution of the application, making it easier to internationalize and localize software.

## Features

### Automatic Dictionary Creation

The Intl Dictionary library can automatically create a dictionary as the application executes, eliminating the need for manual dictionary creation and maintenance.

### Template String Usage

The library utilizes template strings to enable dynamic value substitution in text chains. For example:

```ts
intld`hello world!`; // => "hello world!"
intld`hello ${name}!`; // => "hello John!"
```

### Language Configuration

Language can be configured via the `LANG` environment variable. For instance:

```ts
process.env.LANG = "es_CL";
intld`hello world!`; // => "hola mundo!"
intld`hello ${name}!`; // => "hola John!"
```

### Dictionary Conversion to TS Files

The automatically generated dictionary can be converted into .ts files for use in production. This allows non-editable dictionaries to be transformed into TypeScript code for utilization within the application.

**Example Usage**

```ts
intld`hello world!`; // => "hello world!"
intld`hello ${name}!`; // => "hello John!"

process.env.LANG = "es_CL";
intld`hello world!`; // => "hola mundo!"
intld`hello ${name}!`; // => "hola John!"
```

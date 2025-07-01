# AGENTS Instructions

This repository stores a template ROADMAP and two packages:

- **`packages/cli`** contains a command line tool to read the ROADMAP and list tasks.
- **`packages/lib`** provides the `@jondotsoy/roadmap-parse` library that parses markdown ROADMAP files.

Both packages are written in **TypeScript** and built with **Bun**.

## Setup

Install dependencies with:

```bash
bun install
```

## Building

Compile the packages with:

```bash
make build
```

This calls the internal Makefiles for each package and produces the compiled library (`packages/lib/libs/esm`) and CLI binary (`packages/cli/dist/roadmap`).

## Testing

Run all tests using Bun:

```bash
bun test
```

Tests are located under `packages/lib/src/*.spec.ts` and `packages/cli/src/**/*.spec.ts` and use `bun:test`.

## Formatting

Check or apply formatting using Prettier:

```bash
make lint   # check
make fmt    # rewrite files
```

## Usage Notes

- A template ROADMAP file is available in `template/ROADMAP.md`.
- The root `ROADMAP.md` file describes active and planned features.
- The CLI can be executed after building via `dist/roadmap`.
- All code follows the `.editorconfig` settings (2 spaces, LF line endings, tabs only in Makefiles).

## Use Cases

User stories are stored under the `use-cases` folder. Each file must be written
in **Gherkin** and use the `.feature` extension. Use the naming pattern `UC-<number>-<short-title>.feature` where `<number>` increases without leading zeroes (e.g. `UC-1`, `UC-2`).

Example location:

```
use-cases/UC-1-show-tasks.feature
```

Each feature starts with a `Feature` block followed by one or more `Scenario` sections.


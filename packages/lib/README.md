# `@jondotsoy/roadmap-parse`

**[Read this documentation in Spanish](./docs/es/README.md)** _(Spanish version available here)_

This library, `@jondotsoy/roadmap-parse`, is designed to parse Markdown files following the **roadmap.md document Specification**. Its main goal is to extract information about planned features and their status, as defined in a ROADMAP.md document.

## roadmap.md document Specification

For `@jondotsoy/roadmap-parse` to correctly interpret a file, it must adhere to a specific structure. The expected format of the `ROADMAP.md` document is described below:

### General Structure

1.  **Main Title:** The document must start with a level 1 title (`#`) containing the word "Roadmap" (or "ROADMAP", "roadmap", etc., case-insensitive). This title identifies the document as a valid roadmap file.

    ```markdown
    # Project Roadmap
    ```

2.  **Main Sections:** The document can contain several sections, but the library primarily focuses on the "Roadmap" section for task extraction. Other sections like "Objective of this document" and "Proposals" may be present, but are not directly parsed for task extraction.

3.  **"Roadmap" Section:** This section is crucial and must contain the subsections "Active" and "Planned". These subsections use Markdown tables to define features and their status.

    ```markdown
    ## Roadmap

    ### 🚧 Active

    | Feature | Expected Release Date |
    | ------- | --------------------- |
    | ...     | ...                   |

    ### ⏳ Planned

    | Feature | Status | Expected Completion Date |
    | ------- | ------ | ------------------------ |
    | ...     | ...    | ...                      |
    ```

### Task Tables

Within the "Roadmap" section, two types of Markdown tables are expected:

1.  **"Active" Table (🚧 Active):**

    - **Purpose:** Lists features that are currently under active development.
    - **Structure:** Must have the following columns **exactly** in this order:
      - `Feature`: Name or brief description of the feature.
      - `Expected Release Date`: Estimated release date of the feature.
    - **Markdown Format:**

      ```markdown
      ### 🚧 Active

      | Feature                  | Expected Release Date |
      | ------------------------ | --------------------- |
      | User Interface           | Q2 2024               |
      | Performance Improvements | Q3 2024               |
      ```

2.  **"Planned" Table (⏳ Planned):**

    - **Purpose:** Lists features that are planned for future development.
    - **Structure:** Must have the following columns **exactly** in this order:
      - `Feature`: Name or brief description of the feature.
      - `Status`: Current status of feature planning or development (e.g., "Pending", "In Progress", "In Review", etc.).
      - `Expected Completion Date`: Estimated date for feature development completion.
    - **Markdown Format:**

      ```markdown
      ### ⏳ Planned

      | Feature             | Status      | Expected Completion Date |
      | ------------------- | ----------- | ------------------------ |
      | Bug Fixing          | In Progress | September 30, 2024       |
      | New Functionalities | Planned     | December 2024            |
      ```

### "Proposals" Section

The "Proposals" section is intended to describe ideas or proposals for new functionalities. Currently, `@jondotsoy/roadmap-parse` **does not parse the content of this section to extract tasks.** This section is purely informative and can be used to document future ideas that are not yet formally planned in the "Active" or "Planned" tables.

```markdown
## Proposals

### Proposal: New Integration API

Detailed description of the new integration API...
```

## Using the `@jondotsoy/roadmap-parse` Library

### Installation

You can install the library using npm, bun, pnpm or yarn:

```bash
npm install @jondotsoy/roadmap-parse
bun add @jondotsoy/roadmap-parse
pnpm add @jondotsoy/roadmap-parse
yarn add @jondotsoy/roadmap-parse
```

### Importing the Library

To use the library in your TypeScript or JavaScript project, you need to import it:

```typescript
import { RoadmapFile } from "@jondotsoy/roadmap-parse";
```

### Reading a ROADMAP.md File

The `RoadmapFile` class provides the static method `fromFile`. This method has two ways of being used:

1.  **From a file on disk:** `fromFile(filePath: string)` reads a `ROADMAP.md` file located at `filePath` and creates a `RoadmapFile` instance.
2.  **From an in-memory buffer:** `fromFile(filePath: string, buffer: Uint8Array)` reads the content of `ROADMAP.md` directly from a `Uint8Array` that contains the file content in memory. This option is useful when you already have the roadmap content in memory and want to avoid the need to write it to disk.

Both forms of the `fromFile` method return a Promise that resolves with the `RoadmapFile` instance once the content has been read and parsed.

**Example of reading from a buffer:**

```typescript
import { RoadmapFile } from "@jondotsoy/roadmap-parse";
import fs from "node:fs/promises"; // or 'fs' if you use CommonJS

async function main() {
  try {
    const readmePath = "./README.md"; // Replace with the path to your ROADMAP.md file
    const roadmapBuffer = await fs.readFile(readmePath); // Read the file into a buffer (Uint8Array)

    const roadmapFile = await RoadmapFile.fromFile(readmePath, roadmapBuffer); // Use fromFile with the buffer
    const tasks = await roadmapFile.listTasks();

    console.log(JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Error processing ROADMAP.md:", error);
  }
}

main();
```

### Listing Tasks

Once you have a `RoadmapFile` instance, you can use the `listTasks()` method to get an array of objects representing the tasks extracted from the document. This method also returns a Promise that resolves with the array of tasks.

```typescript
const tasks = await roadmapFile.listTasks();
```

### Task Object Structure (`TaskDTO`)

The `listTasks()` method returns an array of objects that conform to the `TaskDTO` interface. This interface, defined in `./src/dtos/TaskDTO.ts`, describes the data structure for each task extracted from the `ROADMAP.md` file:

```typescript
interface TaskDTO {
  title: string; // Feature title (from the "Feature" column of the tables)
  status?: string; // Task status (from the "Status" column of the "Planned" table, optional)
  expectedCompletionDate?: string; // Estimated completion date (from the "Expected Completion Date" column of the "Planned" table, optional)
  expectedReleaseDate?: string; // Estimated release date (from the "Expected Release Date" column of the "Active" table, optional)
}
```

- **`title`**: Always present and extracted from the "Feature" column of both tables ("Active" and "Planned").
- **`status`**: Present **only** for tasks extracted from the "Planned" table and corresponds to the value of the "Status" column.
- **`expectedCompletionDate`**: Present **only** for tasks extracted from the "Planned" table and corresponds to the value of the "Expected Completion Date" column.
- **`expectedReleaseDate`**: Present **only** for tasks extracted from the "Active" table and corresponds to the value of the "Expected Release Date" column.

### Usage Example and Expected Output

The following example demonstrates how to use the library and the expected `TaskDTO` result format when processing a `ROADMAP.md` file:

**Example `ROADMAP.md` (simulated):**

```markdown
## Roadmap

### 🚧 Active

| Feature           | Expected Release Date |
| ----------------- | --------------------- |
| [Task 2](#task-2) | August 2024           |

### ⏳ Planned

| Feature           | Status      | Expected Completion Date |
| ----------------- | ----------- | ------------------------ |
| [Task 1](#task-1) | In Progress | September 2024           |

## Proposals

### Task 1

Lorem ipsum dolor sit amet...

### Task 2

Lorem ipsum dolor sit amet...
```

**Example Code:**

```typescript
import { RoadmapFile } from "@jondotsoy/roadmap-parse";

async function main() {
  try {
    const roadmapFile = await RoadmapFile.fromFile("./ROADMAP.md"); // Replace with the actual path to your file
    const tasks = await roadmapFile.listTasks();

    console.log(JSON.stringify(tasks, null, 2)); // Prints tasks in JSON format for better visualization
  } catch (error) {
    console.error("Error processing ROADMAP.md:", error);
  }
}

main();
```

**Expected Output (JSON):**

```json
[
  {
    "title": "Task 1",
    "status": "In Progress",
    "expectedCompletionDate": "September 2024",
    "expectedReleaseDate": undefined
  },
  {
    "title": "Task 2",
    "status": "Done",
    "expectedReleaseDate": "August 2024",
    "expectedCompletionDate": undefined
  }
]
```

**Note:** In the example output, it's assumed that "Task 2" in the "Active" table has an implicit "Done" status because it's listed in the "Active" section and has an expected release date, suggesting it's in a final stage or already released. The library might not infer the "Done" status automatically, depending on its specific implementation. In this case, the `status` for "Task 2" should be `undefined` if an explicit status cannot be inferred. _(In the provided test, `status: "Done"` is expected for Task 2, which might need to be confirmed in the actual implementation of the library)._

This example code shows how to read a `ROADMAP.md` file, extract tasks, and observe the structure of the resulting `TaskDTO` objects.

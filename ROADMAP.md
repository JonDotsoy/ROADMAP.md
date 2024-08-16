## Objective of this document

This document serves as a public declaration of the improvements that will be made to our project. It outlines the key milestones, goals, and timelines for the development and delivery of these enhancements.

## Roadmap

The following roadmap provides an overview of the planned features, their expected release dates, and the current status:

### 🚧 Active

<!--
| Feature | Expected Release Date |
| --- | --- |
| User Interface Updates | Q2 2023 |
| Improved Performance | Q3 2023 |
-->

| Feature | Expected Release Date |
| --- | --- |

### ⏳ Planned

<!--
| Feature | Status | Expected Completion Date |
| --- | --- | --- |
| Bug Fixing | In Progress | March 15, 2023 |
| New Features Development | In Progress | April 30, 2023 |
-->

| Feature | Status | Expected Completion Date |
| --- | --- | --- |
| [Client for Terminal: Read ROADMAP.md and Describe Tasks Annotated](#client-for-terminal-read-roadmapmd-and-describe-tasks-annotated) | In Progress | August 2024 |
| [Develop Markdown Parser Library](#develop-markdown-parser-library) | On Design | September 2024 |

## Proposals

The following proposal outlines a potential feature and its expected timeline:

<!--
### Proposal: [Insert Proposal Title]

[Description]
-->

### Client for Terminal: Read ROADMAP.md and Describe Tasks Annotated

Create a client for terminal that permits reading the files `ROADMAP.md` and describing what tasks are annotated in this document. The client must be able to:

*   Read the content of the file `ROADMAP.md`
*   Identify the tasks annotated in the document using the syntax `# - <task>`
*   Show a summary of the tasks annotated, including their state (`Active` or `Planned`) and description

The client must be able to run on any terminal that supports command-line interpretation (CLI). The expected behavior of the client is as follows:

*   When executing the command `roadmap`, the client will read the content of the file `ROADMAP.md`
*   Then, the client will identify the tasks annotated in the document and display them in the terminal
*   Each task will be displayed with its state (`Active` or `Planned`) and description

**Example Output**

If the file `ROADMAP.md` contains the following:

```
# 🚧 Active
# Q2 2023:
# - User Interface Updates
# Q3 2023:
# - Improved Performance
#
# ⏳ Planned
# - (In Progress) Bug Fixing
# - (In Progress) New Features Development
```

When executing the command `roadmap`, the client should display the following in the terminal:

```
Tasks annotated:
- 🚧 Active: User Interface Updates, Improved Performance
- ⏳ Planned: (In Progress) Bug Fixing, (In Progress) New Features Development
```

**Requirements**

*   The client must be able to read the content of the file `ROADMAP.md`
*   The client must identify the tasks annotated in the document using the syntax `# - <task>`
*   The client must display a summary of the tasks annotated, including their state (`Active` or `Planned`) and description

### Develop Markdown Parser Library

Create a library that reads markdown files and returns a JSON value. The library should be able to identify and format relevant information from the file content, such as:

The expected output should be an array of JSON objects, where each object represents a task or feature from the markdown file.

**Example Usage**

```js
const tasks = await parse(markdownText);
// [
//   {
//     "title": "Task title",
//     "description": "This is an example of how the library works.",
//     "status": "In development",
//     "release_date": "2024-08"
//   }
// ]
```

**Model Output**

*   Title
*   Brief description
*   Status: Can be customized
*   Expected Release Date (`release_date`): Date anticipated to have this feature ready for release.
*   Expected Completion Date: If already completed, it can be released in an official version.

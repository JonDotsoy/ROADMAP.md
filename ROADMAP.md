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

## Proposals

The following proposal outlines a potential feature and its expected timeline:

<!--
### Proposal: [Insert Proposal Title]

[Description]
-->

### Initialize roadmap cli

This cli able a set of tools like as scan repositories to find the roadmap files.

### cli: list proposals on a repository

The roadmap execute to show full proposals pending

```shell
roadmap
# (Mon, 29 Jul 2024 18:47:53 GMT) my second proposal
# (Wed, 07 Aug 2024 16:01:37 GMT) my proposal
```

Workflow:

1. Read the readme file and extract proposals
2. Call to git blame if is enable to get the date modified
3. print list proposals


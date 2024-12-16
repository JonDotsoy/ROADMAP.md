# The ROADMAP.md document

This repository contains a template for creating a public roadmap for any project, detailing key milestones, goals, and timelines for development and delivery of enhancements.

The purpose of this document is to provide transparency and visibility into a project's future developments, allowing stakeholders and users to plan and prepare for upcoming changes.

To create your own ROADMAP.md file, simply copy the template below and fill it out with your project's roadmap details!

```md
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
| ------- | --------------------- |

### ⏳ Planned

<!--
| Feature | Status | Expected Completion Date |
| --- | --- | --- |
| Bug Fixing | In Progress | March 15, 2023 |
| New Features Development | In Progress | April 30, 2023 |
-->

| Feature | Status | Expected Completion Date |
| ------- | ------ | ------------------------ |

## Proposals

The following proposal outlines a potential feature and its expected timeline:

<!--
### Proposal: [Insert Proposal Title]

[Description]
-->
```

If you want to get started quickly, you can also copy the template directly from this repository using the following command:

```shell
curl https://raw.githubusercontent.com/JonDotsoy/ROADMAP.md/develop/template/ROADMAP.md > ROADMAP.md
```

This will download the latest version of the ROADMAP.md file and save it to a local file named `ROADMAP.md`.

## ROADMAP Command Line Interface

You can use the `roadmap` command line interface to read the tasks available in this document. To install it, run:

```bash
brew install jondotsoy/core/roadmap
```

> Consult the formula here https://github.com/JonDotsoy/homebrew-core/blob/main/roadmap.rb

To use it, simply execute:

```bash
$ roadmap
# Tasks available in ROADMAP.md:
#   Client for Terminal: Read ROADMAP.md and Describe Tasks Annotated
#   Develop Markdown Parser Library
#   UI to read roadmap on browser o webapp
```

## Initialization

You can also initialize a new roadmap using the `roadmap init` command. This will create a new file called `ROADMAP.md` in the current directory with a basic template.

```bash
$ roadmap init
# Creating new ROADMAP.md file...
# Roadmap initialized successfully!
```

## License

This project is published under the MIT License. You can view the full text of the license in the file [LICENSE](./LICENSE).

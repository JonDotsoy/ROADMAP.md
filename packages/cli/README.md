# Command Line Roadmap

Command Line Roadmap is a command-line tool that allows users to visualize their pending tasks organized in an ROADMAP or ROADMAP.md file. This facilitates project progress management and tracking.

If you want to learn more about creating a ROADMAP.md file for managing your tasks and projects, we recommend visiting the following repository: https://github.com/JonDotsoy/ROADMAP.md. There, you'll find a detailed guide on the structure and content of the file, as well as examples of how to use it in different contexts.

## Usage

### List Tasks from Current Directory

To view the summary of pending tasks in the current directory, run:

```shell
roadmap
```

This command searches for an ROADMAP or ROADMAP.md file in the current directory and displays a summary of the pending tasks.

### List Tasks from Current Directory and Subdirectories

To search and display the summary of pending tasks in all directories (including subdirectories), run:

```shell
roadmap --list .
```

This command searches for ROADMAP or ROADMAP.md files in all directories within the current directory tree and displays a summary of the pending tasks.

## Future Developments

For more information about the project and its next steps, please review our [ROADMAP](../../ROADMAP.md).

## License

This project is under the MIT license. To view the terms of the license, please consult our LICENSE file: [LICENSE](../../LICENSE).

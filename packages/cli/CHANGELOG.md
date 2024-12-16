# Changelog

## [0.2.0-beta.1](https://github.com/JonDotsoy/ROADMAP.md/compare/cli-v0.1.1-beta.1...cli-v0.2.0-beta.1) (2024-08-26)


### Features

* add infoTasks() function to read tasks status from roadmap file ([6abedbe](https://github.com/JonDotsoy/ROADMAP.md/commit/6abedbe83284866460a75a50fcd640a836804fad))
* add main-help.ts file for CLI commands display ([4542490](https://github.com/JonDotsoy/ROADMAP.md/commit/45424904833d91ad324785c2846924bc5b35b088))
* add renderMainHelp function and improve cli logic with new flags and rules ([ec7dc74](https://github.com/JonDotsoy/ROADMAP.md/commit/ec7dc74359891b60fb9d55874219ae1d8d2346e5))
* update cli/describe.ts to handle Bun file existence check ([457acde](https://github.com/JonDotsoy/ROADMAP.md/commit/457acde24b4abaef09c7f5ab6a7e478438ef7bc1))


### Performance Improvements

* refactor findFiles function to include onlyFiles option and improve glob scanning ([45ecbd5](https://github.com/JonDotsoy/ROADMAP.md/commit/45ecbd5b473c9f8b5178c68e6bf3ac3c204d1f2a))
* refactor style-text import in cli describe ([0f60975](https://github.com/JonDotsoy/ROADMAP.md/commit/0f60975ea2ac288d1a23b5ad2b598eab2ed9281c))

## [0.1.1-beta.1](https://github.com/JonDotsoy/ROADMAP.md/compare/cli-v0.1.0-beta.1...cli-v0.1.1-beta.1) (2024-08-16)


### Bug Fixes

* update bun lock file in cli package ([add0983](https://github.com/JonDotsoy/ROADMAP.md/commit/add0983549fa27541bf80a9f84e88fc577181924))

## 0.1.0-beta.1 (2024-08-16)


### Features

* add `describe` command to CLI ([58e6812](https://github.com/JonDotsoy/ROADMAP.md/commit/58e6812b43a53fd4739867f761332f68b468d5f6))
* add pkg.ts to cli package and update .gitignore ([d0a0736](https://github.com/JonDotsoy/ROADMAP.md/commit/d0a0736c546f6f2009a0b69f784a04246a317b28))
* add roadmap file feature to cli package ([a54c8ad](https://github.com/JonDotsoy/ROADMAP.md/commit/a54c8ad1ab17194c9cb5c632b9ab2ff4a87f739d))
* add style-text module for CLI with color formatting and ANSI escape codes ([775ac1d](https://github.com/JonDotsoy/ROADMAP.md/commit/775ac1d4e07c2a4e125732921531017f21f215c3))
* initialize cli package ([d828185](https://github.com/JonDotsoy/ROADMAP.md/commit/d828185f3e06857e5d6489b4a271dd9a1274e20f))
* initialize init command ([91f38a5](https://github.com/JonDotsoy/ROADMAP.md/commit/91f38a55fdc13274aea55d98649ed7a91ad1c7e2))
* update release workflow to prepare CLI package and add new ignore file ([c001ac5](https://github.com/JonDotsoy/ROADMAP.md/commit/c001ac55b54e2e222afd7b340413990eedd71dc9))


### Bug Fixes

* remove missing argument check and default describe option in CLI main function ([61fee84](https://github.com/JonDotsoy/ROADMAP.md/commit/61fee84d13a7bb8e1bffc342e5c5ed1e85daddc7))
* remove outdated roadmap template file ([0ca48d1](https://github.com/JonDotsoy/ROADMAP.md/commit/0ca48d1b86f4e0339f1676f84543b0c7f6191459))
* use file:// scheme when creating URL from file location ([ff81894](https://github.com/JonDotsoy/ROADMAP.md/commit/ff818943425d12ebb20031ed0766c1306a4fda9e))


### Performance Improvements

* simplify Makefile for generating roadmap template ([1a0c4b3](https://github.com/JonDotsoy/ROADMAP.md/commit/1a0c4b338fc62f1339b4e126255e8336e049b269))


### Miscellaneous Chores

* release 0.1.0-beta.1 ([d24137b](https://github.com/JonDotsoy/ROADMAP.md/commit/d24137b00a1467f2d929f7a6079e9f1bff6e0452))

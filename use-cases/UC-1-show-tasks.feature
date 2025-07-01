Feature: Show tasks from roadmap
  As a CLI user
  I want to list tasks defined in ROADMAP.md
  So that I can track project progress

  Scenario: List tasks
    Given a ROADMAP.md with pending tasks
    When I run `roadmap`
    Then the CLI outputs the tasks summary

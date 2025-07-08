Feature: Output tasks as JSON
  As a CLI user
  I want to see tasks in JSON format
  So that I can pipe them into other tools

  Scenario: Show tasks in JSON
    Given a ROADMAP.md with pending tasks
    When I run `roadmap --json`
    Then the CLI outputs tasks in JSON format

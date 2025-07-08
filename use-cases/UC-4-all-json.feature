Feature: Output all branch tasks as JSON
  As a CLI user
  I want tasks from every branch in JSON
  So that I can aggregate them programmatically

  Scenario: Show tasks from all branches in JSON
    Given a repository with ROADMAP files in multiple branches
    When I run `roadmap --all --json`
    Then the CLI outputs tasks from all branches in JSON format

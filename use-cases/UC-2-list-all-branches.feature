Feature: List tasks from all branches
  As a CLI user
  I want to fetch tasks from every branch
  So that I can see all scheduled activities

  Scenario: Fetch tasks across branches
    Given a repository with ROADMAP files in multiple branches
    When I run `roadmap --all`
    Then all tasks from all branches are displayed

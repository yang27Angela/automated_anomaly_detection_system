Feature: Upload Functionality
  As a user
  I want to upload files to the main page
  So that I can [insert purpose, e.g., "view or process them"]

  Scenario: Successful Upload
    Given I am on the main page
    When I upload a valid file
    Then I should see a success message

  Scenario: File Size Exceeds Limit
    Given I am on the main page
    When I upload a file exceeding the size limit
    Then I should see an error message indicating the file size exceeds the limit

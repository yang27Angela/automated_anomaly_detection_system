Feature: Upload Functionality
  As a user
  I want to upload files to the main page
  So that I can [insert purpose, e.g., "view or process them"]

  Scenario: Successful Upload
    Given I am on the main page
    When I upload a valid file
    Then I should see a success message

  Scenario: Invalid File Type Upload
    Given I am on the main page
    When I upload an invalid file type
    Then I should see an error message indicating the file type is not supported

  Scenario: File Size Exceeds Limit
    Given I am on the main page
    When I upload a file exceeding the size limit
    Then I should see an error message indicating the file size exceeds the limit

  Scenario: Cancel Upload
    Given I have initiated an upload
    When I cancel the upload
    Then the upload should stop and a cancellation confirmation should be displayed
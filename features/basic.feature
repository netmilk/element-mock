Feature: Element Mock

Background:
  Given I have a following API description document parsed to "source/elements.json":
  """
  # My API
  # POST /hello  
  
  + Request (application/json)
        {"color": "green"}
  + Response 200 (text/plain)
        Hello green world!
  """

Scenario: Valid /hello request
  Given I make following "valid" HTTP request to the Mock URL:
  """
  POST /hello HTTP/1.1
  User-Agent: my-api-client
  Host: localhost:3000
  Accept: application/json
  Content-Type: application/json

  {"color": "green"}
  """
  Then I receive
  """
  Hello green world!
  """

Scenario: Not found /hello request
  Given I make following "valid" HTTP request to the Mock URL:
  """
  GET /hello HTTP/1.1
  User-Agent: my-api-client
  Host: localhost:3000
  Accept: application/json
  Content-Type: application/json
  """
  Then I receive
  """
  """

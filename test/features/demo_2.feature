# features/demo_2.feature
#
# http://localhost
# http://broker.mqttdashboard.com
# http://www.hivemq.com/demos/websocket-client/

Feature: demo_2

  Background:
    Given verbose is "true"
    Given System Id is ""
    Given the broker URL is 'http://broker.mqttdashboard.com'
    Given the broker port is 1883
    Given the broker is up and running
    Given the location service is up and running

  Scenario: Recieve JSON record
    Given use test vector "./test/vectors/bleDiscovery.txt"
    Given the subscriber is listing for topic "/tag/#"



var iLocateSession = WScript.CreateObject("iLocateComAPI.iLocateSession");
iLocateSession.Connect("localhost", 920);

WScript.Echo("Connected");

iLocateSession.SendSmartTagCustomCommand(101, false, false, 1, 5000);

WScript.Echo("Command sent successfully");
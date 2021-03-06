var CompletedCount = 0;
var CommandCount = 500;

function Async_OnRequestCompleted(AsyncRequest)
{
	CompletedCount++;

	var ErrorString = "Success.";

	try
	{
		AsyncRequest.ReportError();
	}
	catch(e)
	{
		ErrorString = e.description;
	}

	WScript.Echo("Request completed for Smart Tag " + AsyncRequest.UserContext +
			", Result: " + ErrorString);
}

var iLocateSession = WScript.CreateObject("iLocateComAPI.iLocateSession");
iLocateSession.Connect("localhost", 920);
WScript.Echo("Connected");




for (var i = 1; i <= CommandCount; ++i)
{
	var AsyncRequest = WScript.CreateObject("iLocateComAPI.AsyncRequest");
	AsyncRequest.UserContext = i;
	WScript.ConnectObject(AsyncRequest, "Async_");

	//iLocateSession.SendSmartTagCustomCommand(i, true, false, 1, 5000);
	iLocateSession.SendSmartTagCustomCommandAsync(i, true, false, 1, 5000, AsyncRequest);
	WScript.Echo("Request started successfully for Smart Tag " + i + ".");
}

while (iLocateSession.WaitForEvents())
{
	if (CompletedCount == CommandCount)
		break;
}

WScript.Echo("Finished.");
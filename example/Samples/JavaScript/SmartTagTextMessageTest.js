var Completed = false;

function Async_OnRequestCompleted(AsyncRequest)
{
	Completed = true;

	var ErrorString = "Success.";

	try
	{
		AsyncRequest.ReportError();
	}
	catch(e)
	{
		ErrorString = e.description;
	}

	WScript.Echo("Request completed, Result: " + ErrorString);
}

function Async_OnRequestProcessing(AsyncRequest)
{
	WScript.Echo("Text Message ID: " + AsyncRequest.OptionalArgument + ".");
}

var iLocateSession = WScript.CreateObject("iLocateComAPI.iLocateSession");
iLocateSession.Connect("localhost", 920);
WScript.Echo("Connected");

var Text = WScript.CreateObject("iLocateComAPI.SmartTagTextMessageText");
Text.CustomText = "Test Message";

var TextMessage = WScript.CreateObject("iLocateComAPI.SmartTagTextMessage");
TextMessage.Message = Text;
TextMessage.Title = Text;

var AsyncRequest = WScript.CreateObject("iLocateComAPI.AsyncRequest");
WScript.ConnectObject(AsyncRequest, "Async_");

iLocateSession.SendSmartTagTextMessageCommandAsync(100, true, false, TextMessage, AsyncRequest);
WScript.Echo("Request started successfully.");

while (iLocateSession.WaitForEvents())
{
	if (Completed)
		break;
}

WScript.Echo("Finished.");
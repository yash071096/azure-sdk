var IndentLevel = 0;

var AssetTrackingSystemSession = null;
var iLocateSession = null;

function Print(String)
{
	var str = "";
	for (var i = 0; i < IndentLevel; ++i)
		str += "\t";
	str += String;

	WScript.Echo(str);
}

function PrintAssetTrackingObject(AssetTrackingObject)
{
	Print("ID: " + AssetTrackingObject.ID);
	Print("Name: " + AssetTrackingObject.Name);
	Print("Description: " + AssetTrackingObject.Description);
}

function PrintLocation(Location)
{
	Print("Location Engine Name: " + Location.LocationEngineName);
	Print("Type: " + Location.Type);
	Print("Units: " + Location.Units);
	if (Location.Units & 1)//metric
		Print("Coordinates (X, Y, Z): (" + Location.X + ", " + Location.Y + ", " + Location.Z + ")");
	if (Location.LocationUnit & 2)//elliptic
		Print("Coordinates (Latitude, Longitude, Altitude): (" + Location.Latitude + ", " + Location.Longitude + ", " + Location.Altitude + ")");
	if (Location.Type != 0)
		Print("Time: " + Location.Time);
	Print("Cell Device ID: " + Location.CellDeviceID);
	if (Location.CellPhysicalPort != 0)
		Print("Cell Physical Port: " + Location.CellPhysicalPort);
	if (Location.Type != 0)
	{
		Print("Estimated Error: " + Location.EstimatedError);
		Print("Confidence Level: " + Location.ConfidenceLevel);
	}
}

function PrintShortAssetVbArray(arr)
{
	arr = new VBArray(arr).toArray();
	var str = "Assets: ";
	for (var i = 0; i < arr.length; ++i)
		str += arr[i].SmartTagID + " ";
	Print(str);
}

function PrintZone(Zone, ViewID)
{
	PrintAssetTrackingObject(Zone);
	if (ViewID != 0)
		Print("Testing GetZone() result: " + ((AssetTrackingSystemSession.GetZone(ViewID, Zone.ID).ID == Zone.ID) ? "success" : "failure"));

	var Assets = Zone.GetAssets();
	PrintShortAssetVbArray(Assets);
}

function PrintView(View)
{
	PrintAssetTrackingObject(View);
	var Assets = View.GetAssets();
	PrintShortAssetVbArray(Assets);	
}

function PrintViewInfo(ViewInfo)
{
	PrintView(ViewInfo.View);
	Print("Zone:");
	if (ViewInfo.Zone)
	{
		IndentLevel++;
		PrintZone(ViewInfo.Zone, ViewInfo.View.ID);
		IndentLevel--;
		Print("Entered zone on: " + ViewInfo.EnterZoneTime);
	}
	else
		Print("N/A");
}

function PrintAsset(Asset)
{
	Print("Smart Tag ID: " + Asset.SmartTagID);
	Print("Testing GetAsset() result: " + ((AssetTrackingSystemSession.GetAsset(Asset.SmartTagID).SmartTagID == Asset.SmartTagID) ? "success" : "failure"));
	Print("Name: " + Asset.Name);
	Print("Description: " + Asset.Description);
	Print("Last Event Time:" + Asset.LastEventTime);
	Print("Asset Added Time:" + Asset.AssetAddedTime);

	Print("Group:");
	IndentLevel++;
	PrintAssetTrackingObject(Asset.Group);
	IndentLevel--;

	var viewInfos = new VBArray(Asset.ViewInfos).toArray();
	Print("View Infos:");
	IndentLevel++;
	for (var i = 0; i < viewInfos.length; ++i)
	{
		Print("View Info " + (i + 1) + ":");
		IndentLevel++;
		PrintViewInfo(viewInfos[i]);
		IndentLevel--;
	}
	IndentLevel--;
	
	Print("Location:");
	IndentLevel++;
	PrintLocation(Asset.Location);
	IndentLevel--;
}

function PrintAssetVbArray(arr)
{
	arr = new VBArray(arr).toArray();
	for (var i = 0; i < arr.length; ++i)
	{
		Print("Asset:");
		IndentLevel++;
		PrintAsset(arr[i]);
		IndentLevel--;
	}
}

function PrintZoneVbArray(arr, SiteID)
{
	arr = new VBArray(arr).toArray();
	for (var i = 0; i < arr.length; ++i)
	{
		Print("Zone:");
		IndentLevel++;
		PrintZone(arr[i], SiteID);
		IndentLevel--;
	}
}

function PrintCellInfo(Cell)
{
	Print("Cell Device ID: " + Cell.DeviceID);
	if (Cell.PhysicalPort != 0)
		Print("Cell Physical Port: " + Cell.PhysicalPort);
	Print("RSSI: " + Cell.RSSI);
	Print("Distance: " + Cell.Distance);
	Print("LastSeenTime: " + Cell.LastSeenTime);
}

function PrintCellInfoVbArray(arr)
{
	arr = new VBArray(arr).toArray();
	for (var i = 0; i < arr.length; ++i)
	{
		Print("Cell:");
		IndentLevel++;
		PrintCellInfo(arr[i]);
		IndentLevel--;
	}
}

function PrintGenericData(SmartTag)
{
	Print("Generic Data:");
	IndentLevel++;
	var dataFields = new VBArray(SmartTag.DataFields).toArray();
	for (var i = 0; i < dataFields.length; ++i)
	{
		var dataString = "";
		var data = SmartTag.GetDataField(dataFields[i]);
		if (typeof(data) == "number")
			dataString += new Number(data).toString();
		else
		{
			var values = new VBArray(data).toArray();
			for (var j = 0; j < values.length; ++j)
				dataString += values[j] + ", ";
		}
		Print("Data Field " + dataFields[i] + ": " + dataString);
	}
	IndentLevel--;
}

function PrintGPSData(GPSData)
{
	Print("Latitude: " + GPSData.Latitude);
	Print("Longitude: " + GPSData.Longitude);
	Print("Altitude: " + GPSData.Altitude);
	Print("HDOP: " + GPSData.HDOP);
	Print("VDOP: " + GPSData.VDOP);
	Print("GPS Time: " + GPSData.GPSTime);
}

function PrintSmartTag(SmartTag)
{
	Print("Smart Tag ID: " + SmartTag.ID);
	Print("Last Event Time: " + SmartTag.LastEventTime);
	Print("Suggested Location:");
	IndentLevel++;
	PrintLocation(SmartTag.SuggestedLocation);
	IndentLevel--;
	Print("Calculated Locations:");
	IndentLevel++;
	var calculatedLocations = new VBArray(SmartTag.CalculatedLocations).toArray();
	for (var i = 0; i < calculatedLocations.length; ++i)
	{
		Print("Calculated Location " + (i + 1) + ":");
		IndentLevel++;
		PrintLocation(calculatedLocations[i]);
		IndentLevel--;
	}
	IndentLevel--;
	Print("Beacons:");
	IndentLevel++;
	PrintCellInfoVbArray(SmartTag.Beacons);
	IndentLevel--;
	Print("Bridge Port:");
	IndentLevel++;
	PrintCellInfo(SmartTag.BridgePort);
	IndentLevel--;

	Print("Temperature: " + SmartTag.Temperature);
	Print("Last Receiving Bridge Port ID: " + SmartTag.LastReceivingBridgePortID);
	Print("Last Smart Tag RSSI: " + SmartTag.LastSmartTagRSSI);
	
	PrintGenericData(SmartTag);
	Print("GPS Data:");
	IndentLevel++;
	if (SmartTag.GPSData)
		PrintGPSData(SmartTag.GPSData);
	else
		Print("N/A");
	IndentLevel--;
}

function AssetTrackingSystem_OnDisconnected()
{
	Print("Asset Tracking System Session Disconnected");
	Print("");
}

function AssetTrackingSystem_OnReconnected()
{
	Print("Asset Tracking System Session Reconnected");
	Print("");
}

function AssetTrackingSystem_OnAssetEvent(AssetEvent)
{
	Print("Asset Event:");
	IndentLevel++;
	Print("Event ID: " + AssetEvent.EventID);
	Print("Event Time: " + AssetEvent.EventTime);
	Print("Event Type: " + AssetEvent.EventType);
	Print("Asset: ");
	IndentLevel++;
	PrintAsset(AssetEvent.Asset);
	IndentLevel--;
	IndentLevel--;
}

function iLocate_OnDisconnected()
{
	Print("iLocate Session Disconnected");
	Print("");
}

function iLocate_OnReconnected()
{
	Print("iLocate Session Reconnected");
	Print("");
}

function iLocate_OnSmartTagEvent(SmartTag, EventType)
{
	Print("Smart Tag Event:");
	IndentLevel++;
	Print("Event Type: " + EventType);
	Print("Smart Tag:");
	IndentLevel++;
	PrintSmartTag(SmartTag);
	IndentLevel--;
	IndentLevel--;
}

Print("Connecting to Asset Tracking System...");
AssetTrackingSystemSession = WScript.CreateObject("iLocateComAPI.AssetTrackingSystemSession");
AssetTrackingSystemSession.Connect("localhost", 921, "Administrator", "");
Print("Connected to Asset Tracking System.");

var Assets = AssetTrackingSystemSession.GetAllAssets();
Assets = new VBArray(Assets).toArray();

for (var i = 0; i < Assets.length; ++i)
{
	if (iLocateSession == null)
	{
		try
		{
			Print("Connecting to iLocate Server through Asset Tracking System...");
			iLocateSession = Assets[i].GetILocateSession();
			Print("Connected to iLocate Server.");
		}
		catch (e)
		{
			Print(e.description);
		}
	}
}

WScript.ConnectObject(AssetTrackingSystemSession, "AssetTrackingSystem_");
if (iLocateSession != null)
	WScript.ConnectObject(iLocateSession, "iLocate_");

Print("Waiting for events...");

while (AssetTrackingSystemSession.WaitForEvents())
{
	//do nothing
}

Print("Cleanly quit.");
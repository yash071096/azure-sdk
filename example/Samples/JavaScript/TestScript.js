var IndentLevel = 0;

var AssetTrackingSystemSession = WScript.CreateObject("iLocateComAPI.AssetTrackingSystemSession");
AssetTrackingSystemSession.Connect("localhost", 921, "Administrator", "");
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
	Print("GUID: " + AssetTrackingObject.GUID);
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
	if (Location.Units & 2)//elliptic
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

function PrintZone(Zone, ViewGUID)
{
	PrintAssetTrackingObject(Zone);
	if (ViewGUID != null)
		Print("Testing GetZone() result: " + ((AssetTrackingSystemSession.GetZone(ViewGUID, Zone.GUID).GUID == Zone.GUID) ? "success" : "failure"));

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
	//make sure the view exists
	try
	{
		ViewInfo.View;
	}
	catch (e)
	{
		Print(e.description);
		return;
	}

	PrintView(ViewInfo.View);
	Print("Zone:");
	if (ViewInfo.Zone)
	{
		IndentLevel++;
		PrintZone(ViewInfo.Zone, ViewInfo.View.GUID);
		IndentLevel--;
		Print("Entered zone on: " + ViewInfo.EnterZoneTime);
	}
	else
		Print("N/A");
}

function PrintAsset(Asset)
{
	Print("Smart Tag ID: " + Asset.SmartTagID);
	Print("Testing GetAsset() result: " + ((AssetTrackingSystemSession.GetAsset(Asset.GUID).SmartTagID == Asset.SmartTagID) ? "success" : "failure"));
	Print("Testing FindAsset() result: " + ((AssetTrackingSystemSession.FindAsset(Asset.SmartTagID).GUID == Asset.GUID) ? "success" : "failure"));
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

function PrintZoneVbArray(arr, ViewGUID)
{
	arr = new VBArray(arr).toArray();
	for (var i = 0; i < arr.length; ++i)
	{
		Print("Zone:");
		IndentLevel++;
		PrintZone(arr[i], ViewGUID);
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
	var vbArr = new VBArray(arr);
	arr = vbArr.toArray();
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

Print("Enumerating all assets...");

var Assets = AssetTrackingSystemSession.GetAllAssets();
PrintAssetVbArray(Assets);

Print("Enumerating all views...");
var Views = AssetTrackingSystemSession.GetAllViews();
Views = new VBArray(Views).toArray();
for (var i = 0; i < Views.length; ++i)
{
	Print("View:");
	
	IndentLevel++;
	PrintView(Views[i]);
	
	Print("Zones:");
	IndentLevel++;
	var Zones = Views[i].GetZones();
	PrintZoneVbArray(Zones, Views[i].GUID);
	IndentLevel--;
	IndentLevel--;
}

Print("Retrieving Smart Tag Info's for all assets...");

Assets = AssetTrackingSystemSession.GetAllAssets();
Assets = new VBArray(Assets).toArray();

for (var i = 0; i < Assets.length; ++i)
{
	try
	{
		if (iLocateSession == null)
			iLocateSession = Assets[i].GetILocateSession();
	}
	catch (e)
	{
		Print(e.description);
	}
		
	Print("Smart Tag " + Assets[i].SmartTagID + ": ");
	IndentLevel++;
	var SmartTag = null;
	var error = "";
	try
	{
		SmartTag = iLocateSession.GetSmartTagInfo(Assets[i].SmartTagID);
	}
	catch (e)
	{
		error = e.description;
	}
	if (SmartTag != null)
		PrintSmartTag(SmartTag);
	else
		Print(error);
		
	IndentLevel--;
}

Print("Retrieving a few asset events...");

if (!AssetTrackingSystemSession)
	Print("Invalid Asset Tracking System Session.");
else
{
	var AssetEvent = null;
	var AssetEvents = null;
	try
	{
		AssetEvents = AssetTrackingSystemSession.GetAssetEventsByID(1, 3);
		if (AssetEvents)
			AssetEvent = AssetEvents.GetNext();
	}
	catch(e)
	{
	}
	if (!AssetEvent)
		Print("No asset events were found with Event ID between 1 and 3");

	while (AssetEvent)
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

		AssetEvent = AssetEvents.GetNext();
	}
}
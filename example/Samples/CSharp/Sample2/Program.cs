using System;
using iLocateComAPILib;

namespace Sample2
{
	class Program
	{
		static void Main(string[] args)
		{
			AssetTrackingSystemSession session = new AssetTrackingSystemSession();
			iLocateSession iSession = new iLocateSession();

			try
			{
				session.Connect("localhost", 921, "Administrator", "");
				iSession.Connect("localhost", 920);

				int maxEvents = 5;
				int eventCount = 0;

				Console.WriteLine("Waiting for {0} events to arrive.", maxEvents);

				/*
				session.OnAssetEvent += (AssetEventInfo EventInfo) =>
				{
					++eventCount;
					if (eventCount < maxEvents)
						Console.WriteLine("{0} event(s) arrived, {1} more to go.", eventCount, maxEvents - eventCount); 
				};
				*/

				string bridgePortID = "localhost:10001";

				bool bridgePortConnected = iSession.IsBridgePortConnected(bridgePortID);

				if(bridgePortConnected)
					Console.WriteLine("{0} is connected", bridgePortID);
				else
					Console.WriteLine("{0} is not connected", bridgePortID);



				SmartTagInfo smartTagInfo = iSession.GetSmartTagInfo(100);
				GPSData smartTagGPSData = smartTagInfo.GPSData;

				//Console.WriteLine("Smart Tag coordinates: {0}, {1}", smartTagGPSData.Longitude, smartTagGPSData.Latitude);

				SmartTagTextMessageText title = new SmartTagTextMessageText();
				title.PredefinedTextID = 20;
				title.CustomText = "TITLE";

				SmartTagTextMessageText text = new SmartTagTextMessageText();
				text.PredefinedTextID = 21;
				text.CustomText = "HEY, LOOK, LISTEN";

				SmartTagTextMessage message = new SmartTagTextMessage();
				message.Title = title;
				message.Message = text;
				message.Priority = 7;
				message.Silent = true;
				message.TextMessageID = 22;

				AsyncRequest a = new AsyncRequest();

				a.OnRequestProcessing += a_OnRequestProcessing;
				a.OnRequestCompleted += a_OnRequestCompleted;



				iSession.SendSmartTagTextMessageCommand(100, true, false, message, out byte TextMessageID);
				//iSession.SendSmartTagTextMessageCommandAsync(100, true, false, message, a);

				Console.WriteLine("Message ID: {0}", TextMessageID);





				//GPSData g;

				//double l = iSession.GetBridgePortGPSLocation(bridgePortID).Longitude;

				//Console.WriteLine("Longitude: {0}, Latitude: {1}", l, l);

				while (session.WaitForEvents())
				{
					Console.WriteLine("EVENT");
					//if (eventCount == maxEvents)
						//break;
				}
				Console.WriteLine("{0} events arrived, quitting.", maxEvents);

			}
			finally
			{
				session.Close();
			}
		}

		static void a_OnRequestProcessing(AsyncRequest asyncRequest)
		{
			string state = "Completed";

			try
			{
				asyncRequest.ReportError();
			}

			catch (Exception e)
			{
				state = e.Message;
			}

			Console.WriteLine("{0}", state);
		}

		static void a_OnRequestCompleted(AsyncRequest asyncRequest)
		{
			Console.WriteLine("Message ID: {0}", asyncRequest.OptionalArgument);
		}


	}
}

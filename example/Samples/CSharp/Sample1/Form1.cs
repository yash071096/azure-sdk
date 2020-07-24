using System;
using System.Collections.Generic;
using System.Windows.Forms;
using iLocateComAPILib;

namespace Sample1
{
	public partial class Form1 : Form
	{
		iLocateSession m_iLocateSession;
		AssetTrackingSystemSession m_AssetTrackingSystemSession;
		List<AsyncRequest> m_AsyncRequests = new List<AsyncRequest>();

		public Form1()
		{
			InitializeComponent();
		}

		void Log(string message)
		{
			//The application is single threaded, so there is no reason for InvokeRequired to be true
			if (InvokeRequired)
				throw new Exception("Unexpected behavior.");

			listBoxLog.Items.Insert(0, message);
		}

		bool CreateILocateSession()
		{
			//create the session object first - no connection is made yet
			m_iLocateSession = new iLocateSession();

			try
			{
				//perform the actual connection. In case of failure, an exception will be thrown.
				m_iLocateSession.Connect(textBoxAddress.Text, 920);

				//register for events
				m_iLocateSession.OnDisconnected += OnAssetTrackingSystemDisconnected;
				m_iLocateSession.OnReconnected += OnAssetTrackingSystemReconnected;
				m_iLocateSession.OnSmartTagEvent += OnSmartTagEvent;
			}
			catch (Exception ex)
			{
				Log("Error connecting to iLocate Server: " + ex.Message);
				return false;
			}

			Log("Connected to iLocate Server.");

			return true;
		}

		bool CreateAssetTrackingSystemSession()
		{
			//similar to CreateILocateSession()

			m_AssetTrackingSystemSession = new AssetTrackingSystemSession();

			try
			{
				m_AssetTrackingSystemSession.Connect(textBoxAddress.Text, 921, "Administrator", "");

				m_AssetTrackingSystemSession.OnDisconnected += OnAssetTrackingSystemDisconnected;
				m_AssetTrackingSystemSession.OnReconnected += OnAssetTrackingSystemReconnected;
				m_AssetTrackingSystemSession.OnAssetEvent += OnAssetEvent;
			}
			catch (Exception ex)
			{
				Log("Error connecting to Asset Tracking System Server: " + ex.Message);
				return false;
			}

			Log("Connected to Asset Tracking System.");

			return true;
		}

		void CloseConnections()
		{
			//it's important to close the connection manually and not wait for .NET to perform garbage collection.

			if (m_iLocateSession != null)
			{
				m_iLocateSession.Close();
				m_iLocateSession = null;
			}

			if (m_AssetTrackingSystemSession != null)
			{
				m_AssetTrackingSystemSession.Close();
				m_AssetTrackingSystemSession = null;
			}
		}

		void OnILocateDisconnected()
		{
			Log("iLocate Session: Disconnected from server.");
		}

		void OnILocateReconnected()
		{
			Log("iLocate Session: Reconnected to server.");
		}

		void OnAssetTrackingSystemDisconnected()
		{
			Log("Asset Tracking System Session: Disconnected from server.");
		}

		void OnAssetTrackingSystemReconnected()
		{
			Log("Asset Tracking System Session: Reconnected to server.");
		}

		void OnSmartTagEvent(SmartTagInfo SmartTag, eSmartTagEventType EventType)
		{
			//low level events, that represent messages that come directly from the smart tag over the air
			string message = string.Format("iLocate Session: Smart tag event '{1}' from smart tag {0}.", SmartTag.ID, EventType);
			Log(message);
		}

		void OnAssetEvent(AssetEventInfo EventInfo)
		{
			//high level events that arrive from Asset Tracking System
			string message = string.Format("Asset Tracking System Session: Asset event '{1}' arrived for '{0}'.", EventInfo.Asset.Name, EventInfo.EventType);
			Log(message);
		}

		void buttonConnect_Click(object sender, EventArgs e)
		{
			if (!CreateILocateSession() || !CreateAssetTrackingSystemSession())
			{
				CloseConnections();
				return;
			}

			//update UI
			buttonConnect.Enabled = false;
			textBoxAddress.ReadOnly = true;
		}

		void Form1_FormClosed(object sender, FormClosedEventArgs e)
		{
			CloseConnections();
		}

		void buttonSendCustomCommand_Click(object sender, EventArgs e)
		{
			uint smartTagID = uint.Parse(textBoxSmartTagID.Text);
			byte commandID = byte.Parse(textBoxCustomCommandID.Text);

			try
			{
				//send the command
				m_iLocateSession.SendSmartTagCustomCommand(smartTagID, true, false, commandID, 0);
			}
			catch (Exception ex)
			{
				Log("Request completed. Error sending command: " + ex.Message);
				return;
			}

			Log("Command sent successfully.");
		}

		void OnSendSmartTagCommandAsyncRequestCompleted(AsyncRequest AsyncRequest)
		{
			//important - removing the following call might result in a memory leak
			AsyncRequest.OnRequestCompleted -= OnSendSmartTagCommandAsyncRequestCompleted;

			m_AsyncRequests.Remove(AsyncRequest);

			Log("Async request completed.");

			try
			{
				//in .NET, ReportError() causes an exception to be thrown, in case the request completed with an error.
				AsyncRequest.ReportError();
			}
			catch (Exception ex)
			{
				Log("Error sending command: " + ex.Message);
				return;
			}

			Log("Command sent successfully.");
		}

		void buttonSendCustomCommandAsync_Click(object sender, EventArgs e)
		{
			uint smartTagID = uint.Parse(textBoxSmartTagID.Text);
			byte commandID = byte.Parse(textBoxCustomCommandID.Text);

			//create the AsyncRequest object and register for the request completion event
			var asyncRequest = new AsyncRequest();
			asyncRequest.OnRequestCompleted += OnSendSmartTagCommandAsyncRequestCompleted;

			//send the command.
			//when the request completes at the server side, the OnRequestCompleted event will be fired.
			m_iLocateSession.SendSmartTagCustomCommandAsync(smartTagID, true, false, commandID, 0, asyncRequest);
			Log("Initiated async request.");

			//add the AsyncRequest object to a container, so there would be a reference to it.
			//otherwise, it might be destroyed automatically by .NET.
			m_AsyncRequests.Add(asyncRequest);
		}

		//Will be called when the text message ID is available.
		//The text message ID can be used for text message cancellation.
		void OnSendSmartTagTextMessageAsyncRequestProcessing(AsyncRequest Request)
		{
			Request.OnRequestProcessing -= OnSendSmartTagTextMessageAsyncRequestProcessing;
			Log(string.Format("Text Message ID: {0}", Request.OptionalArgument));
		}

		void buttonSendTextMessageAsync_Click(object sender, EventArgs e)
		{
			uint smartTagID = uint.Parse(textBoxSmartTagID.Text);

			var text = new SmartTagTextMessageText();
			text.CustomText = textBoxTextMessageText.Text;

			var textMessage = new SmartTagTextMessage();
			textMessage.Message = text;
			textMessage.Title = text;

			//create the AsyncRequest object and register for the request completion event
			var asyncRequest = new AsyncRequest();
			asyncRequest.OnRequestCompleted += OnSendSmartTagCommandAsyncRequestCompleted;
			asyncRequest.OnRequestProcessing += OnSendSmartTagTextMessageAsyncRequestProcessing;

			//send the command.
			//when the request completes at the server side, the OnRequestCompleted event will be fired.
			m_iLocateSession.SendSmartTagTextMessageCommandAsync(smartTagID, true, false, textMessage, asyncRequest);
			Log("Initiated async request.");

			//add the AsyncRequest object to a container, so there would be a reference to it.
			//otherwise, it might be destroyed automatically by .NET.
			m_AsyncRequests.Add(asyncRequest);
		}
	}
}

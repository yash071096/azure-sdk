namespace Sample1
{
	partial class Form1
	{
		/// <summary>
		/// Required designer variable.
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary>
		/// Clean up any resources being used.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose(bool disposing)
		{
			if (disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Windows Form Designer generated code

		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			System.Windows.Forms.Label label1;
			System.Windows.Forms.Label label2;
			System.Windows.Forms.GroupBox groupBox1;
			System.Windows.Forms.Label label4;
			System.Windows.Forms.Label label3;
			System.Windows.Forms.Label label5;
			this.textBoxCustomCommandID = new System.Windows.Forms.TextBox();
			this.textBoxSmartTagID = new System.Windows.Forms.TextBox();
			this.buttonSendCustomCommandAsync = new System.Windows.Forms.Button();
			this.buttonSendCustomCommand = new System.Windows.Forms.Button();
			this.buttonConnect = new System.Windows.Forms.Button();
			this.listBoxLog = new System.Windows.Forms.ListBox();
			this.textBoxAddress = new System.Windows.Forms.TextBox();
			this.buttonSendTextMessageAsync = new System.Windows.Forms.Button();
			this.textBoxTextMessageText = new System.Windows.Forms.TextBox();
			label1 = new System.Windows.Forms.Label();
			label2 = new System.Windows.Forms.Label();
			groupBox1 = new System.Windows.Forms.GroupBox();
			label4 = new System.Windows.Forms.Label();
			label3 = new System.Windows.Forms.Label();
			label5 = new System.Windows.Forms.Label();
			groupBox1.SuspendLayout();
			this.SuspendLayout();
			// 
			// label1
			// 
			label1.AutoSize = true;
			label1.Location = new System.Drawing.Point(12, 15);
			label1.Name = "label1";
			label1.Size = new System.Drawing.Size(48, 13);
			label1.TabIndex = 2;
			label1.Text = "Address:";
			// 
			// label2
			// 
			label2.AutoSize = true;
			label2.Location = new System.Drawing.Point(9, 156);
			label2.Name = "label2";
			label2.Size = new System.Drawing.Size(28, 13);
			label2.TabIndex = 4;
			label2.Text = "Log:";
			// 
			// groupBox1
			// 
			groupBox1.Controls.Add(label4);
			groupBox1.Controls.Add(this.textBoxCustomCommandID);
			groupBox1.Controls.Add(label5);
			groupBox1.Controls.Add(label3);
			groupBox1.Controls.Add(this.textBoxTextMessageText);
			groupBox1.Controls.Add(this.textBoxSmartTagID);
			groupBox1.Controls.Add(this.buttonSendCustomCommandAsync);
			groupBox1.Controls.Add(this.buttonSendTextMessageAsync);
			groupBox1.Controls.Add(this.buttonSendCustomCommand);
			groupBox1.Location = new System.Drawing.Point(12, 38);
			groupBox1.Name = "groupBox1";
			groupBox1.Size = new System.Drawing.Size(436, 111);
			groupBox1.TabIndex = 5;
			groupBox1.TabStop = false;
			groupBox1.Text = "Commands";
			// 
			// label4
			// 
			label4.AutoSize = true;
			label4.Location = new System.Drawing.Point(166, 25);
			label4.Name = "label4";
			label4.Size = new System.Drawing.Size(109, 13);
			label4.TabIndex = 0;
			label4.Text = "Custom Command ID:";
			// 
			// textBoxCustomCommandID
			// 
			this.textBoxCustomCommandID.Location = new System.Drawing.Point(281, 22);
			this.textBoxCustomCommandID.Name = "textBoxCustomCommandID";
			this.textBoxCustomCommandID.Size = new System.Drawing.Size(74, 20);
			this.textBoxCustomCommandID.TabIndex = 1;
			this.textBoxCustomCommandID.Text = "1";
			// 
			// label3
			// 
			label3.AutoSize = true;
			label3.Location = new System.Drawing.Point(6, 25);
			label3.Name = "label3";
			label3.Size = new System.Drawing.Size(73, 13);
			label3.TabIndex = 0;
			label3.Text = "Smart Tag ID:";
			// 
			// textBoxSmartTagID
			// 
			this.textBoxSmartTagID.Location = new System.Drawing.Point(85, 22);
			this.textBoxSmartTagID.Name = "textBoxSmartTagID";
			this.textBoxSmartTagID.Size = new System.Drawing.Size(75, 20);
			this.textBoxSmartTagID.TabIndex = 1;
			this.textBoxSmartTagID.Text = "1";
			// 
			// buttonSendCustomCommandAsync
			// 
			this.buttonSendCustomCommandAsync.Location = new System.Drawing.Point(185, 48);
			this.buttonSendCustomCommandAsync.Name = "buttonSendCustomCommandAsync";
			this.buttonSendCustomCommandAsync.Size = new System.Drawing.Size(170, 23);
			this.buttonSendCustomCommandAsync.TabIndex = 0;
			this.buttonSendCustomCommandAsync.Text = "Send Custom Command (Async)";
			this.buttonSendCustomCommandAsync.UseVisualStyleBackColor = true;
			this.buttonSendCustomCommandAsync.Click += new System.EventHandler(this.buttonSendCustomCommandAsync_Click);
			// 
			// buttonSendCustomCommand
			// 
			this.buttonSendCustomCommand.Location = new System.Drawing.Point(9, 48);
			this.buttonSendCustomCommand.Name = "buttonSendCustomCommand";
			this.buttonSendCustomCommand.Size = new System.Drawing.Size(170, 23);
			this.buttonSendCustomCommand.TabIndex = 0;
			this.buttonSendCustomCommand.Text = "Send Custom Command";
			this.buttonSendCustomCommand.UseVisualStyleBackColor = true;
			this.buttonSendCustomCommand.Click += new System.EventHandler(this.buttonSendCustomCommand_Click);
			// 
			// buttonConnect
			// 
			this.buttonConnect.Location = new System.Drawing.Point(373, 9);
			this.buttonConnect.Name = "buttonConnect";
			this.buttonConnect.Size = new System.Drawing.Size(75, 23);
			this.buttonConnect.TabIndex = 0;
			this.buttonConnect.Text = "Connect";
			this.buttonConnect.UseVisualStyleBackColor = true;
			this.buttonConnect.Click += new System.EventHandler(this.buttonConnect_Click);
			// 
			// listBoxLog
			// 
			this.listBoxLog.FormattingEnabled = true;
			this.listBoxLog.Location = new System.Drawing.Point(12, 174);
			this.listBoxLog.Name = "listBoxLog";
			this.listBoxLog.Size = new System.Drawing.Size(436, 186);
			this.listBoxLog.TabIndex = 3;
			// 
			// textBoxAddress
			// 
			this.textBoxAddress.Location = new System.Drawing.Point(81, 12);
			this.textBoxAddress.Name = "textBoxAddress";
			this.textBoxAddress.Size = new System.Drawing.Size(286, 20);
			this.textBoxAddress.TabIndex = 1;
			this.textBoxAddress.Text = "localhost";
			// 
			// buttonSendTextMessageAsync
			// 
			this.buttonSendTextMessageAsync.Location = new System.Drawing.Point(185, 77);
			this.buttonSendTextMessageAsync.Name = "buttonSendTextMessageAsync";
			this.buttonSendTextMessageAsync.Size = new System.Drawing.Size(170, 23);
			this.buttonSendTextMessageAsync.TabIndex = 0;
			this.buttonSendTextMessageAsync.Text = "Send Text Message (Async)";
			this.buttonSendTextMessageAsync.UseVisualStyleBackColor = true;
			this.buttonSendTextMessageAsync.Click += new System.EventHandler(this.buttonSendTextMessageAsync_Click);
			// 
			// label5
			// 
			label5.AutoSize = true;
			label5.Location = new System.Drawing.Point(6, 82);
			label5.Name = "label5";
			label5.Size = new System.Drawing.Size(31, 13);
			label5.TabIndex = 0;
			label5.Text = "Text:";
			// 
			// textBoxTextMessageText
			// 
			this.textBoxTextMessageText.Location = new System.Drawing.Point(43, 79);
			this.textBoxTextMessageText.Name = "textBoxTextMessageText";
			this.textBoxTextMessageText.Size = new System.Drawing.Size(136, 20);
			this.textBoxTextMessageText.TabIndex = 1;
			this.textBoxTextMessageText.Text = "1";
			// 
			// Form1
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(462, 378);
			this.Controls.Add(groupBox1);
			this.Controls.Add(label2);
			this.Controls.Add(this.listBoxLog);
			this.Controls.Add(this.textBoxAddress);
			this.Controls.Add(label1);
			this.Controls.Add(this.buttonConnect);
			this.Name = "Form1";
			this.Text = "iLocate Sample";
			this.FormClosed += new System.Windows.Forms.FormClosedEventHandler(this.Form1_FormClosed);
			groupBox1.ResumeLayout(false);
			groupBox1.PerformLayout();
			this.ResumeLayout(false);
			this.PerformLayout();

		}

		#endregion

		private System.Windows.Forms.Button buttonConnect;
		private System.Windows.Forms.TextBox textBoxSmartTagID;
		private System.Windows.Forms.ListBox listBoxLog;
		private System.Windows.Forms.Button buttonSendCustomCommand;
		private System.Windows.Forms.TextBox textBoxCustomCommandID;
		private System.Windows.Forms.Button buttonSendCustomCommandAsync;
		private System.Windows.Forms.TextBox textBoxAddress;
		private System.Windows.Forms.TextBox textBoxTextMessageText;
		private System.Windows.Forms.Button buttonSendTextMessageAsync;
	}
}


const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// AWS SNS configuration with IAM role
AWS.config.update({
    region: process.env.AWS_REGION // Value read from environment variables file
  });	
const sns = new AWS.SNS();

// Route to handle email sending
app.post('/send-email', async (req, res) => {
  try {
    const { subject, message } = req.body;

    // AWS SNS Publish
    await sns.publish({
      TopicArn: process.env.SNS_TOPIC_ARN,	// Replace with your SNS TOpic ARN
      Message: message,
      Subject: subject || 'Default Subject',
    }).promise();

    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error sending email.' });
  }
});

// Default route handler serving HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

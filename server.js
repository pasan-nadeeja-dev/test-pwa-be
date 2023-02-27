const express = require('express');
const dotenv = require('dotenv');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

// dotenv.config() loads the environment variables from the .env file
dotenv.config();

// initialize the express app
const app = express();

// Enable CORS
app.use(cors());

// Set the public and private VAPID keys
// The VAPID keys should only be generated only once. If you lose them, you'll have to generate new ones and update the web push service
// You can use the web-push generate-vapid-keys command to generate a new set of VAPID keys
// ./node_modules/.bin/web-push generate-vapid-keys
webPush.setVapidDetails(
  'mailto: <roshan@smashtaps.com>',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Parse the request body as JSON
app.use(bodyParser.json());

// Store the subscription object. In a real application, you'd probably save the subscription object in a database
let subscription = {};

// Endpoint for receiving the user's subscription object
app.post('/subscribe', (req, res) => {
  console.log({"body ===> ":req.body})
  subscription = req.body;
  res.status(201).json({});
});

// test server using GET
app.get('/get-id', (req, res) => {
  res.status(200).json({
    "message": "success"
  })
})

// Endpoint for sending push notifications
app.post('/send-push', (req, res) => {
  const { message, title } = req.body;
  const payload = JSON.stringify({ title, message });

  // Send the push notification to the subscribed device
  if (subscription) {
    webPush.sendNotification(subscription, payload)
      .then((sss) => {
        console.log({sss});
        res.status(201).json({});
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(500);
      });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on ');
});
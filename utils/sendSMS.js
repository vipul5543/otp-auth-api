require('dotenv').config();
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendSMS(mobileNumber, message) {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobileNumber,
    });
  } catch (error) {
    console.error("Failed to send SMS:", error);
  }
}

module.exports = sendSMS;

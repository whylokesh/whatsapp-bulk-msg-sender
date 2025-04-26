const express = require('express');
const router = express.Router();
const { initializeWhatsappBot, closeWhatsappBot, sendMessageToUser } = require("../chatbot/whatsappBot");

// Track initialization state
let isInitializing = false;

router.post('/initialize-whatsapp', async (req, res) => {
  try {
    // Check if already initializing
    if (isInitializing) {
      return res.status(400).json({
        error: 'WhatsApp initialization already in progress'
      });
    }

    isInitializing = true;

    // Close existing instance if any
    await closeWhatsappBot();
    console.log('Closed existing WhatsApp instance');

    // Initialize new instance
    await initializeWhatsappBot();
    console.log('WhatsApp initialized successfully');

    res.json({ success: true });
  } catch (error) {
    console.error('WhatsApp initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize WhatsApp' });
  } finally {
    isInitializing = false;
  }
});

// Delay ALGO functions 
// Function to generate random delay
function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to introduce delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Whatsapp Bulk Message Sender' });
});

// Route to Fill form for bulk messaging
router.get("/send-message", (req, res) => {
  res.render("send-message");
});

// Route to send bulk messages
router.post("/send-message", async (req, res) => {
  try {
    const { phoneNumbers, message, minDelay, maxDelay } = req.body;

    // Check if required fields are provided
    if (!phoneNumbers || !message || !minDelay || !maxDelay) {
      return res.status(400).json({
        error: "Phone numbers, message, minDelay, and maxDelay are required"
      });
    }

    // Convert phoneNumbers to string if it's not already
    const phoneNumbersStr = String(phoneNumbers);

    // Handle both single number and comma-separated numbers
    let numbersArray;
    if (phoneNumbersStr.includes(',')) {
      // Handle comma-separated numbers
      numbersArray = phoneNumbersStr.split(',').map(number => number.trim() + "@c.us");
    } else {
      // Handle single number
      numbersArray = [phoneNumbersStr.trim() + "@c.us"];
    }

    // Validate numbers array
    if (numbersArray.length === 0) {
      return res.status(400).json({ error: "No valid phone numbers provided" });
    }

    // Log for debugging
    console.log("Total numbers to process:", numbersArray.length);
    console.log("Phone numbers:", numbersArray);

    // Send messages with delay
    for (const phoneNumber of numbersArray) {
      const success = await sendMessageToUser(phoneNumber, message);
      if (!success) {
        throw new Error(`Failed to send message to ${phoneNumber}`);
      }

      if (numbersArray.length > 1) {
        const delay = getRandomDelay(minDelay, maxDelay);
        await sleep(delay);
      }
    }

    res.status(200).json({
      success: true,
      message: "Messages sent successfully",
      count: numbersArray.length
    });
  } catch (error) {
    console.error("Error sending messages:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to send messages"
    });
  }
});


module.exports = router;

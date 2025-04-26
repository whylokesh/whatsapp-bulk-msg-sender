const qrcode = require("qrcode-terminal");
const { Client, NoAuth, LocalAuth } = require("whatsapp-web.js");  // Change import to use NoAuth
const path = require("path");
let client = null;

// Add socket.io handling
let io;
function setSocketIO(socketIO) {
    io = socketIO;
}

async function closeWhatsappBot() {
    try {
        if (client) {
            await client.destroy();
            client = null;
            console.log('WhatsApp client closed');
        }
    } catch (error) {
        console.error('Error closing WhatsApp client:', error);
        throw error;
    }
}

async function initializeWhatsappBot() {
    try {
        // Create new client instance with NoAuth strategy
        client = new Client({
            authStrategy: new LocalAuth()
            // authStrategy: new NoAuth(),
            // puppeteer: {
            //     headless: true,
            //     args: [
            //         '--no-sandbox',
            //         '--disable-setuid-sandbox',
            //         '--disable-dev-shm-usage',
            //         '--disable-accelerated-2d-canvas',
            //         '--disable-gpu'
            //     ]
            // }
        });

        console.log("Starting WhatsApp bot initialization...");

        client.on("qr", (qr) => {
            console.log("QR Code received");
            if (io) {
                io.emit('qr', qr);
            }
        });

        client.on("ready", () => {
            console.log("WhatsApp bot is ready");
            if (io) {
                io.emit('ready');
            }
        });

        client.on("disconnected", () => {
            console.log("WhatsApp bot disconnected");
            if (io) {
                io.emit('disconnected');
            }
        });

        await client.initialize();
    } catch (error) {
        console.error('Error initializing WhatsApp:', error);
        throw error;
    }
}

// Function to send Message from other programs
async function sendMessageToUser(phoneNumber, message) {
    try {
        const sentMessage = await client.sendMessage(phoneNumber, message);
        return true;
    } catch (error) {
        console.error("Error sending message:", error.message);
        return false;
    }
}

module.exports = {
    initializeWhatsappBot,
    closeWhatsappBot,
    sendMessageToUser,
    setSocketIO
};

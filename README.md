# WhatsApp Bulk Message Sender

A web application that allows users to send bulk WhatsApp messages with customizable delays using whatsapp-web.js and Express.js.

## Features

- 🚀 Easy WhatsApp initialization with QR code scanning
- 📱 Send messages to multiple numbers simultaneously
- ⏱️ Customizable delay between messages
- 🎯 Real-time status updates
- 🔄 Automatic reconnection handling
- 💫 Modern UI with Tailwind CSS

## Tech Stack

- Backend:
  - Express.js (Web framework)
  - Socket.IO (Real-time communication)
  - whatsapp-web.js (WhatsApp Web automation)
  - Puppeteer (Browser automation)

- Frontend:
  - Handlebars (Template engine)
  - Tailwind CSS (Styling)
  - Socket.IO Client (Real-time updates)
  - QRCode.js (QR code generation)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/whylokesh/whatsapp-bulk-msg-sender.git
cd whatsapp-bulk-message-sender
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3003/send-message
```

## How It Works

1. **Initialization**:
   - Click "Initialize WhatsApp" button
   - Scan the displayed QR code with WhatsApp mobile app
   - Wait for connection confirmation

2. **Sending Messages**:
   - Enter recipient phone numbers (comma-separated)
   - Type your message
   - Set minimum and maximum delay between messages
   - Click "Send Message"

3. **Features**:
   - Real-time connection status
   - QR code regeneration on disconnect
   - Progress updates for message sending
   - Error handling and notifications

## Project Structure

```
whatsapp-bulk-message-sender/
├── chatbot/
│   └── whatsappBot.js     # WhatsApp client configuration
├── routes/
│   └── index.js           # Express routes
├── views/
│   └── send-message.hbs   # Main UI template
├── public/
│   └── stylesheets/       # CSS files
└── app.js                 # Express app configuration
```

## API Endpoints

- `POST /initialize-whatsapp`: Initialize WhatsApp connection
- `POST /send-message`: Send bulk messages
- `GET /send-message`: Render message form

## Socket Events

- `qr`: Emitted when QR code is received
- `ready`: Emitted when WhatsApp is connected
- `disconnected`: Emitted when WhatsApp disconnects

## Configuration

The application uses the following environment variables:
- `PORT`: Server port (default: 3003)

## Security Notes

- The application uses NoAuth strategy for WhatsApp Web
- Sessions are not persisted between restarts
- QR code needs to be scanned after each restart

## Error Handling

- Connection failures
- Message sending failures
- Invalid phone numbers
- Rate limiting considerations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

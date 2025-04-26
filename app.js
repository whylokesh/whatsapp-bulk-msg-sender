const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { initializeWhatsappBot, setSocketIO } = require("./chatbot/whatsappBot");
const http = require('http');
const socketIO = require('socket.io');
const debug = require('debug')('whatsapp-bulk-sender:server');

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Set up Socket.IO and initialize socket handling
setSocketIO(io);

// Socket connection handling
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

// Port normalization
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

// Error handler for HTTP server
function onError(error) {
    if (error.syscall !== 'listen') throw error;

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// Server listening event handler
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log(`Server running on http://localhost:${port}/send-message`);
}

// Start server
const port = normalizePort(process.env.PORT || '3003');
app.set('port', port);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

module.exports = app;
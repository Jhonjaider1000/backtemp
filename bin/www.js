#!/usr/bin/env node

/**
 * Module dependencies.
 */

const SOCKET_MESSAGES = {
  FETCH: "FETCH",
  SET_GROUP: "SET_GROUP",
  GET_LAST_USER: "GET_LAST_USER",
  NEW_LAST_USER: "NEW_LAST_USER",
  ADD_HISTORY: "ADD_HISTORY",
  ADD_USER: "ADD_USER",
};

import customApp from "../app";
import Model from "./src/app/Models/Model";
var debug = require("debug")("gensi-back:server");
var http = require("http");
var dotenv = require("dotenv");

dotenv.config();

/**
 * Get port from environment and store in Express.
 */

var customPort = normalizePort(process.env.PORT || "4000");

/**
 * Create HTTP server.
 */

/**
 * Listen on provided port, on all network interfaces.
 */

class Server {
  constructor(port = customPort, app = customApp) {
    this.port = port;
    this.app = app;
  }

  /**
   * Event listener for HTTP server "error" event.
   */

  onError(error) {
    if (error.syscall !== "listen") {
      throw error;
    }

    var bind =
      typeof server.port === "string"
        ? "Pipe " + server.port
        : "Port " + server.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
      default:
        throw error;
    }
  }

  getApiAndEmit(socket) {
    try {
      socket.emit("message", { id: socket.id, type: "WELCOME" });
    } catch (error) {
      console.error(`Error: ${error.code}`);
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  onListening() {
    console.log("Listening on", `http://localhost:${server.port}/`);
    var addr = server.server && server.server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + server.port);
  }

  setPort(port) {
    server.port = port;
  }
  setApp(app) {
    server.app = app;
  }

  sendLastUser(socket, msg) {
    const m = new Model("history");
    const sql = `select * from history where dispositivo = '${msg.dispositivo}' AND fecha_registro > date_sub(now(), interval 30 second) ORDER BY fecha_registro DESC LIMIT 1`;
    m.query(sql)
      .then((rows) => {
        const user =
          Array.isArray(rows[0]) && rows[0].length > 0 ? rows[0][0] : null;
        if (user) {
          m.query(
            `SELECT * FROM user WHERE documento = '${user.documento}' ORDER BY id DESC LIMIT 1`
          )
            .then((users) => {
              const userTemp =
                Array.isArray(users[0]) && users[0].length > 0
                  ? users[0][0]
                  : null;
              userTemp.temperatura = user.temperatura;
              userTemp.id = user.id;
              console.log(userTemp);
              socket.emit("message", {
                type: SOCKET_MESSAGES.NEW_LAST_USER,
                data: userTemp,
              });
            })
            .catch(() => {
              socket.emit("message", {
                type: SOCKET_MESSAGES.NEW_LAST_USER,
                data: user,
              });
            });
        } else {
          socket.emit("message", {
            type: SOCKET_MESSAGES.NEW_LAST_USER,
            data: user,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addSocketEvents(socket) {
    socket.on("message", (msg) => {
      console.log(msg);
      if (msg.type == SOCKET_MESSAGES.FETCH) {
        socket.fromType = SOCKET_MESSAGES.FETCH;
        server.clients.forEach((client) => {
          if (client.fromType == SOCKET_MESSAGES.FETCH) {
            client.emit("message", { type: SOCKET_MESSAGES.FETCH, data: null });
          }
        });
      } else if (msg.type == SOCKET_MESSAGES.SET_GROUP) {
        socket.dispositivo = msg.dispositivo;
        // } else if (msg.type == SOCKET_MESSAGES.GET_LAST_USER) {
        // server.sendLastUser(socket, msg);
      } else if (msg.type == SOCKET_MESSAGES.ADD_HISTORY) {
        server.clients.forEach((client) => {
          console.log(
            client.dispositivo,
            "SE ENVIA A ESTE WEY",
            msg.dispositivo
          );
          if (client.dispositivo == msg.dispositivo) {
            server.sendLastUser(client, msg);
          }
        });
      }
    });
    socket.on("connect", (socket) => {
      console.log("Connected user", socket.id);
    });
  }

  listen(port = customPort, app = customApp) {
    server.port = port;
    server.app = app;
    app.set("port", port);
    server.server = http.createServer(server.app);
    server.server.listen(port);
    server.io = require("socket.io")(server.server);
    server.clients = [];
    server.io.on("connection", (socket) => {
      console.log("Se conectó un usuario.", socket.id);
      server.getApiAndEmit(socket);
      server.addSocketEvents(socket);
      server.clients.push(socket);
    });
    server.server.on("error", server.onError);
    server.server.on("listening", server.onListening);
  }
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
const server = new Server();
export default server;

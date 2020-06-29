class App {
  constructor() {}

  setPort(port) {
    this.port = port;
  }
  setRequestType(type) {
    this.requestType = type;
  }
  setRealtime(flag) {
    this.realTime = true;
  }
  useSocket(flag) {
    this.useSocket = true;
  }
}
export default App;
export const AppInstance = new App();

export const REQUEST_TYPES = {
  FETCH: "fetch",
  SOCKET: "socket",
};

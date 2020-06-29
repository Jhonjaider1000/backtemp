import { DeplynBackInstance } from "./DeplynBack";
import { AppInstance, DatabaseInstance } from "./ConfigurationClass";
import { get as getProp } from "object-path";
import config from "./config.json";

const start = async () => {
  //Configuramos la aplicación...
  const port = getProp(config, "server.port", 5555);
  let requestType = getProp(config, "server.request.type", "fetch");
  const requestRealtime = getProp(config, "server.request.realtime", false);
  if (requestRealtime && requestType) {
    throw new Error(
      "La configuración server.request.type debe ser socket por defecto si vas a usar apis en tiempo real (server.request.realtime: true)."
    );
  }

  AppInstance.setPort(port);
  AppInstance.setRequestType(requestType);
  AppInstance.setRealtime(requestRealtime);

  //Configuramos la base de datos...
  DatabaseInstance.setDriver(getProp(config, "database.driver", "mysql"));
  DatabaseInstance.setHost(getProp(config, "database.host", "localhost"));
  DatabaseInstance.setPort(getProp(config, "database.port", 3306));
  DatabaseInstance.setUsername(getProp(config, "database.username", "root"));
  DatabaseInstance.setPassword(getProp(config, "database.password", ""));
  DatabaseInstance.useTunnel(getProp(config, "database.usetunnel", false));
  try {
    await DatabaseInstance.createDatabaseIfNotExist();
  } catch (error) {
    console.log(error);
  }

  //Iniciamos la configuración de la aplicación y la base de datos.
  DeplynBackInstance.initApp(AppInstance);
  DeplynBackInstance.initDatabase(DatabaseInstance);
  DeplynBackInstance.start();

  console.log("Deplyn-Backend Runned.");
};

start();

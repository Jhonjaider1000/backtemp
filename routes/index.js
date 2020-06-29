import fs from "fs";
import path from "path";
import { config } from "../bin/src/app/Utils/Utils";

const pathComponents = path.resolve("bin", "src", "app", "Components");

const getListFolderComponents = () => {
  const foldersComponents = fs.readdirSync(pathComponents);
  return foldersComponents;
};

const isDirectory = (folder) => {
  return fs.existsSync(folder) && fs.lstatSync(folder).isDirectory();
};

const existNetworkFile = (folder) => {
  //Verifiamos que exista el archivo network...
  const pathNetwork = path.join(folder, "network.js");
  //Comprobamos que exista el archivo network.js en la carpeta.
  const existNetworkFile =
    fs.existsSync(pathNetwork) && fs.lstatSync(pathNetwork).isFile();
  return { exist: existNetworkFile, pathNetwork };
};

const routes = (server) => {
  const foldersComponents = getListFolderComponents();
  let pathIndex = null;
  //Recorremos la lista de archivos que nos haya devuelto la lectura...
  for (let i = 0; i < foldersComponents.length; i++) {
    //Preparamos la ruta completa del archivo...
    const folder = path.join(pathComponents, foldersComponents[i]);
    //Si el archivo es un directorio lo procesamos.
    if (isDirectory(folder)) {
      const { exist, pathNetwork } = existNetworkFile(folder);
      if (exist) {
        if (path.basename(folder).toLocaleLowerCase() == "index") {
          pathIndex = pathNetwork;
        } else {
          server.use(
            `/${path.basename(folder).toLocaleLowerCase()}`,
            require(pathNetwork)
          );
        }
      }
    }
  }
  if (pathIndex) {
    const apiPrefix = config.apiPrefix.replace(new RegExp("/", "g"), "");
    console.log(apiPrefix);
    server.use(`/${apiPrefix}`, require(pathIndex));
  }
};

export default routes;

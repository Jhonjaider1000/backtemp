import configApp from "../../../../consumer/config.json";
import PackQueries, { MYSQL_QUERIES } from "../Database/SQLS";

export const config = configApp;
export const QUERIES = MYSQL_QUERIES;

export const apiPrefix = configApp.apiPrefix;
//PackQueries[`${configApp.database.client.toUpperCase()}_QUERIES`];

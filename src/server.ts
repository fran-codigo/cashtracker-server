import express, { Express } from "express";
import colors from "colors";
import morgan from "morgan";
import { db } from "./config/db";

async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log(colors.blue.bold("Conexión exitosa a la base de datos"));
  } catch (error) {
    console.log(colors.red.bold("Error al conectar la bd: " + error));
  }
}
connectDB();

const app: Express = express();

app.use(morgan("dev"));

app.use(express.json());

export default app;

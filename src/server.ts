import express, { Express } from "express";
import colors from "colors";
import morgan from "morgan";
import { db } from "./config/db";
import budgetRouter from './routes/budget.routes'
import authRouter from './routes/auth.routes'

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

app.use('/api/budgets', budgetRouter)
app.use('/api/auth', authRouter)

export default app;

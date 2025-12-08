import type { Request, Response } from "express";
import Budget from "../models/Budget";

export class BudgetController {
  static getAll = (req: Request, res: Response) => {
    console.log("Desde /ap/budgets");
  };

  static create = async (req: Request, res: Response) => {
    try {
      const budget = new Budget(req.body);
      await budget.save();
      res.status(201).json("Presupuesto creado correctamente");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getById = (req: Request, res: Response) => {
    console.log("Desde Show /app/budgets");
  };

  static updateById = (req: Request, res: Response) => {
    console.log("Desde Update /app/budgets");
  };

  static deleteById = (req: Request, res: Response) => {
    console.log("Desde Delete /app/budgets");
  };
}

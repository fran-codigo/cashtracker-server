import type { Request, Response } from "express";

export class BudgetController {
  static getAll = (req: Request, res: Response) => {
    console.log("Desde /ap/budgets");
  };

  static create = (req: Request, res: Response) => {
    console.log("Desde POST /app/budgets");
  };
}

import { Router } from "express";

const router:Router = Router()

router.get('/', (req,res) => {
    console.log('Desde /ap/budgets')
})

export default router
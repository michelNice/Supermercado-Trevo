import { Router } from "express"
import type { Request, Response } from "express"

const router = Router()

router.post("/", async (_req: Request, res: Response) => {
    res.json({
        message: "Pagamento Mercado Pago funcionando"
    })
})

export default router
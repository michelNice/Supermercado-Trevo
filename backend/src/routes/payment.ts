import { Router } from "express";
import type { Request, Response } from "express";
import client from "../config/mercadoPago";
import { Preference } from "mercadopago";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: "1",
            title: "Compra Trevo",
            quantity: 1,
            unit_price: 100,
          },
        ],
      },
    });

    res.json({
      preferenceId: response.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao criar pagamento",
    });
  }
});

export default router;
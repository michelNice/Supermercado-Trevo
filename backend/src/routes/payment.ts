import { Router } from "express";
import type { Request, Response } from "express";
import client from "../config/mercadoPago";
import { Preference } from "mercadopago";
const router = Router();
router.post("/create-preference", async (req: Request, res: Response) => {
  try {
    const preference = new Preference(client);
    const response = await preference.create({
      body: {
        items: [
          {
            id: "1",
            title: "Compra Trevo Supermercado",
            quantity: 1,
            unit_price: 100,
          },
        ],
        back_urls: {
          success: "http://localhost:5173/",
          failure: "http://localhost:5173/",
          pending: "http://localhost:5173/",
        },
      },
    });

    return res.json({
      preferenceId: response.id,
      initPoint: response.init_point,
    });

  } catch (error: any) {
    console.error("ERRO MERCADO PAGO:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
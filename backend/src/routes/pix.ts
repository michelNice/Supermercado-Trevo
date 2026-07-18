import { Router } from "express";
import type { Request, Response } from "express";
import client from "../config/mercadoPago";
import { Payment } from "mercadopago";

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
  try {
    const { total, email } = req.body;

    const payment = new Payment(client);

    const response = await payment.create({
      body: {
        transaction_amount: Number(total),
        payment_method_id: "pix",
        description: "Compra Trevo Supermercado",

        payer: {
          email,
        },
      },
    });

    return res.json({
      id: response.id,
      status: response.status,
      qrCode:
        response.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64:
        response.point_of_interaction?.transaction_data?.qr_code_base64,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
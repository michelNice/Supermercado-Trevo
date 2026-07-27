import { Router } from "express";
import type { Request, Response } from "express";
import { Payment } from "mercadopago";

import client from "../config/mercadoPago";
import { sendConfirmationEmail } from "../services/emailService";
const router = Router();
router.post(
  "/process-payment",
  async (req: Request, res: Response) => {
    try {
      const {
        token,
        payment_method_id,
        issuer_id,
        installments,
        transaction_amount,
        payer,
        items,
        address,
      } = req.body;
      if (
        !token ||
        !payment_method_id ||
        !transaction_amount ||
        !payer?.email
      ) {
        return res.status(400).json({
          message: "Dados de pagamento incompletos.",
        });
      }

      const payment = new Payment(client);

      const response = await payment.create({
        body: {
          transaction_amount: Number(
            Number(transaction_amount).toFixed(2)
          ),

          token,

          description:
            "Compra Trevo Supermercado",

          payment_method_id,

          issuer_id,

          installments: installments
            ? Number(installments)
            : 1,

          payer: {
            email: payer.email,
          },
        },
      });


      // Send confirmation email only if payment is approved
      if (response.status === "approved") {

        try {

          await sendConfirmationEmail(
            payer.email,
            address?.name || "Cliente",
            items || [],
            address || {},
            Number(transaction_amount)
          );

        } catch {
          // Ignore email errors
          // Payment should continue even if email fails
        }

      }


      // Return payment result
      return res.json({
        id: response.id,
        status: response.status,
        detail: response.status_detail,
      });


    } catch (error: unknown) {

      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Erro ao processar pagamento",
      });

    }
  }
);


export default router;
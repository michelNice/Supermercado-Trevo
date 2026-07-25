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
      } = req.body;
      if (
        !token ||
        !payment_method_id ||
        !transaction_amount
      ) {
        return res.status(400).json({
          message:
          "Dados de pagamento incompletos."
        });

      }
      const payment = new Payment(client);
      const response = await payment.create({
        body: {
          transaction_amount:
            Number(transaction_amount),
          token,
          description:
            "Compra Trevo Supermercado",
          payment_method_id,
          issuer_id,
          installments:
            Number(installments),
          payer: {
            email:
              payer.email,

          },
        },
      });

              console.log("Mercado Pago status:", response.status);

        if (response.status === "approved") {
          console.log("Payment approved. Sending email...");

          try {
            await sendConfirmationEmail(
              payer.email,
              req.body.address?.name || "Cliente"
            );

            console.log("Email sent successfully!");
          } catch (error) {
            console.error("Email error:", error);
          }
        }

      return res.json({
        id: response.id,
        status: response.status,
        detail: response.status_detail,

      });
    } catch(error:any){
      console.error(
        "ERRO PAGAMENTO:",
        error
      );
      return res.status(500).json({
        message:
          error.message,

      });
    }
  }
);


export default router;
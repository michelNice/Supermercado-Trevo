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

          installments:
            installments
              ? Number(installments)
              : 1,

          payer: {
            email: payer.email,
          },
        },
      });



      if (response.status === "approved") {

        try {

          await sendConfirmationEmail(
            payer.email,
            address?.name || "Cliente",
            items || [],
            address || {},
            Number(transaction_amount)
          );


        } catch (emailError) {

          console.error(
            "Erro ao enviar email de confirmação:",
            emailError
          );

        }

      }


      return res.json({
        id: response.id,
        status: response.status,
        detail: response.status_detail,
      });


    } catch (error: any) {

      console.error(
        "Erro ao processar pagamento:",
        error
      );


      return res.status(500).json({
        message:
          error.message ||
          "Erro ao processar pagamento",
      });

    }
  }
);


export default router;
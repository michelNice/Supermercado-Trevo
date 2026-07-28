import { Router } from "express";
import type { Request, Response } from "express";
import { Payment } from "mercadopago";

import client from "../config/mercadoPago";
import { sendConfirmationEmail } from "../services/emailService";
import { createOrder } from "../services/orderService";

const router = Router();


const pendingPayments = new Map<
  number,
  {
    email: string;
    name: string;
    items: any[];
    address: any;
    total: number;
  }
>();


// Prevent duplicated emails/orders
const completedPayments = new Set<number>();



// ===========================
// CREATE PIX
// ===========================

router.post(
  "/create",
  async (req: Request, res: Response) => {

    try {

      const {
        total,
        email,
        name,
        items,
        address,
      } = req.body || {};



      if (!total || !email) {

        return res.status(400).json({
          message: "Total e email são obrigatórios.",
        });

      }



      const payment = new Payment(client);



      const response = await payment.create({

        body: {

          transaction_amount:
            Number(Number(total).toFixed(2)),


          description:
            "Compra Trevo Supermercado",


          payment_method_id:
            "pix",


          payer: {
            email,
          },

        },

      });



      if (response.id) {

        pendingPayments.set(
          response.id,
          {

            email,

            name:
              name || "Cliente",

            items:
              items || [],

            address:
              address || {},

            total:
              Number(total),

          }
        );

      }



      return res.json({

        id:
          response.id,


        status:
          response.status,


        qrCode:
          response.point_of_interaction
            ?.transaction_data
            ?.qr_code,


        qrCodeBase64:
          response.point_of_interaction
            ?.transaction_data
            ?.qr_code_base64,

      });



    } catch (error: any) {


      return res.status(500).json({

        message:
          error?.message ||
          "Erro ao gerar PIX",

      });


    }

  }
);






// ===========================
// CHECK PIX STATUS
// ===========================

router.get(
  "/status/:id",
  async (req: Request, res: Response) => {


    try {


      const payment =
        new Payment(client);



      const paymentId =
        Number(req.params.id);



      const response =
        await payment.get({

          id: paymentId,

        });




      if (response.status === "approved") {



        // Already completed
        if (
          completedPayments.has(paymentId)
        ) {

          return res.json({

            status:
              response.status,

          });

        }





        const customer =
          pendingPayments.get(paymentId);





        if (!customer) {

          return res.json({

            status:
              response.status,

            message:
              "Customer data not found",

          });

        }




        // Lock immediately
        completedPayments.add(paymentId);





        // SEND EMAIL FIRST
        await sendConfirmationEmail(

          customer.email,

          customer.name,

          customer.items,

          customer.address,

          customer.total

        );





        // SAVE ORDER AFTER EMAIL
        await createOrder({

          paymentId,

          total:
            customer.total,

          status:
            response.status,

          items:
            customer.items,

          address:
            customer.address,

        });





        pendingPayments.delete(paymentId);



      }




      return res.json({

        status:
          response.status,

      });





    } catch (error) {


      return res.status(500).json({

        message:
          "Erro ao consultar pagamento PIX",

      });


    }


  }
);



export default router;
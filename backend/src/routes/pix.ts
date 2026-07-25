import { Router } from "express";
import type { Request, Response } from "express";
import { Payment } from "mercadopago";
import client from "../config/mercadoPago";
import { sendConfirmationEmail } from "../services/emailService";

const router = Router();


// ===========================
// CREATE PIX
// ===========================

router.post("/create", async (req: Request, res: Response) => {
  try {

    const {
      total,
      email,
      name
    } = req.body || {};


    if (!total || !email) {
      return res.status(400).json({
        message: "Total e email são obrigatórios.",
        body: req.body,
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


    console.log(
      "PIX CREATED:",
      response.id
    );


    return res.json({

      id: response.id,

      status: response.status,

      qrCode:
        response.point_of_interaction
        ?.transaction_data
        ?.qr_code,


      qrCodeBase64:
        response.point_of_interaction
        ?.transaction_data
        ?.qr_code_base64,

    });


  } catch(error:any){

    console.log(
      "========== ERRO MERCADO PAGO =========="
    );


    return res.status(500).json({

      message:
        error?.message ||
        "Erro ao gerar PIX",

      status:
        error?.status,

      cause:
        error?.cause,

      response:
        error?.response?.data,

    });

  }
});




// ===========================
// CHECK PIX STATUS
// ===========================


router.get("/status/:id", async (
  req: Request,
  res: Response
) => {

  try {


    const payment = new Payment(client);


    const response = await payment.get({

      id:
        Number(req.params.id),

    });



    console.log(
      "PIX STATUS:",
      response.status
    );



    if(response.status === "approved"){


      console.log(
        "PIX APPROVED"
      );



      await sendConfirmationEmail(

        response.payer?.email || "",

        response.payer?.first_name || "Cliente"

      );



      console.log(
        "CONFIRMATION EMAIL SENT"
      );

    }



    return res.json({

      status:
        response.status,

    });



  } catch(error:any){


    console.error(
      "Erro ao consultar PIX:",
      error
    );


    return res.status(500).json({

      message:
        "Erro ao consultar pagamento PIX",

    });


  }

});



export default router;
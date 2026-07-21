{/*import { Router } from "express";
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




import { Router } from "express";
import type { Request, Response } from "express";
import client from "../config/mercadoPago";
import { Payment } from "mercadopago";

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
  try {
    console.log("========== NOVA REQUISIÇÃO PIX ==========");
    console.log("Body recebido:", req.body);

    const { total, email } = req.body;

    console.log("Total:", total);
    console.log("Email:", email);

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

    console.log("========== PIX CRIADO ==========");
    console.dir(response, { depth: null });

    return res.json({
      id: response.id,
      status: response.status,
      qrCode:
        response.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64:
        response.point_of_interaction?.transaction_data?.qr_code_base64,
    });

  } catch (error: any) {
    console.log("========== ERRO MERCADO PAGO ==========");

    console.dir(error, { depth: null });

    console.log("Mensagem:", error?.message);
    console.log("Status:", error?.status);
    console.log("Cause:", error?.cause);
    console.log("Response:", error?.response?.data);

    return res.status(500).json({
      message: error?.message,
      status: error?.status,
      cause: error?.cause,
      response: error?.response?.data,
    });
  }
});

export default router;



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

        description: "Compra Trevo Supermercado",

        payment_method_id: "pix",

        payer: {
          email: email,
        },
      },
    });


    return res.json({
      id: response.id,

      qr_code:
        response.point_of_interaction
          ?.transaction_data
          ?.qr_code,

      qr_code_base64:
        response.point_of_interaction
          ?.transaction_data
          ?.qr_code_base64,
    });


  } catch (error: any) {

    console.error("ERRO PIX:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
});


export default router;




import { Router } from "express";
import type { Request, Response } from "express";
import client from "../config/mercadoPago";
import { Payment } from "mercadopago";

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
  try {
    console.log("========== NOVA REQUISIÇÃO PIX ==========");
    console.log("Body recebido:", req.body);

    const { total, email } = req.body || {};

    if (!total || !email) {
      return res.status(400).json({
        message: "Total e email são obrigatórios",
        recebido: req.body,
      });
    }

    console.log("Total:", total);
    console.log("Email:", email);

    const payment = new Payment(client);

    const response = await payment.create({
      body: {
        transaction_amount: Number(total),

        description: "Compra Trevo Supermercado",

        payment_method_id: "pix",

        payer: {
          email: email,
        },
      },
    });

    console.log("========== PIX CRIADO ==========");
    console.log("ID:", response.id);
    console.log("Status:", response.status);


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


  } catch (error: any) {

    console.log("========== ERRO PIX ==========");

    console.error(error);

    return res.status(500).json({
      message: error?.message || "Erro ao criar PIX",
    });
  }
});


export default router;*

*/}
import { Router } from "express";
import type { Request, Response } from "express";
import { Payment } from "mercadopago";
import client from "../config/mercadoPago";

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
  try {
    console.log("========== NOVA REQUISIÇÃO PIX ==========");
    console.log("Body recebido:", req.body);

    const { total, email } = req.body || {};

    if (!total || !email) {
      return res.status(400).json({
        message: "Total e email são obrigatórios.",
        body: req.body,
      });
    }

    console.log("Total:", total);
    console.log("Email:", email);

    const payment = new Payment(client);

    const response = await payment.create({
      body: {
        transaction_amount: Number(Number(total).toFixed(2)),
        description: "Compra Trevo Supermercado",
        payment_method_id: "pix",
        payer: {
          email,
        },
      },
    });

    console.log("========== PIX CRIADO ==========");
    console.log("ID:", response.id);
    console.log("STATUS:", response.status);

    console.dir(response, { depth: null });

    return res.json({
      id: response.id,
      status: response.status,
      qrCode:
        response.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64:
        response.point_of_interaction?.transaction_data?.qr_code_base64,
    });

  } catch (error: any) {
    console.log("========== ERRO MERCADO PAGO ==========");

    console.dir(error, { depth: null });

    console.log("MESSAGE:", error?.message);
    console.log("STATUS:", error?.status);
    console.log("CAUSE:", error?.cause);
    console.log("RESPONSE:", error?.response?.data);

    return res.status(500).json({
      message: error?.message || "Erro ao gerar PIX",
      status: error?.status,
      cause: error?.cause,
      response: error?.response?.data,
    });
  }
});

export default router;
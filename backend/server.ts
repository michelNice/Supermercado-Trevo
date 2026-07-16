import "dotenv/config";

import express from "express";
import type { Request, Response } from "express";
import axios from "axios";
import cors from "cors";

import paymentRouter from "./src/routes/payment";

const app = express();

app.use(cors());
app.use(express.json());


// Mercado Pago
app.use("/payment", paymentRouter);


// reCAPTCHA
app.post("/verify-captcha", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token do reCAPTCHA não enviado.",
      });
    }

    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: token,
        },
      }
    );

    if (response.data.success) {
      return res.json({
        success: true,
        message: "reCAPTCHA válido!",
      });
    }

    return res.status(400).json({
      success: false,
      message: "reCAPTCHA inválido.",
      errors: response.data["error-codes"],
    });

  } catch (error) {
    console.error("Erro ao verificar o reCAPTCHA:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor.",
    });
  }
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
import "dotenv/config";

import express from "express";
import type { Request, Response } from "express";
import axios from "axios";
import cors from "cors";

import paymentRouter from "./routes/payment";
import pixRoutes from "./routes/pix";
import { sendConfirmationEmail } from "./services/emailService";

const app = express();

app.use(
  cors({
    origin: [
      "https://supermercado-trevo.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "online",
  });
});

app.get("/pix/test", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "online",
    route: "/pix",
    message: "Rota PIX funcionando",
  });
});

app.use("/payment", paymentRouter);

app.use("/pix", pixRoutes);

app.post("/email/confirmation", async (req: Request, res: Response) => {
  try {
    const {
      email,
      name,
      items,
      address,
      total,
      deliveryMethod,
      selectedStore,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "E-mail do cliente não informado.",
      });
    }

    const result = await sendConfirmationEmail(
      email,
      name,
      items,
      address,
      total,
      deliveryMethod,
      selectedStore
    );

    console.log("E-MAIL DE CONFIRMAÇÃO ENVIADO:", email);

    return res.status(200).json({
      success: true,
      message: "E-mail de confirmação enviado com sucesso.",
      data: result,
    });
  } catch (error) {
    console.error("ERRO AO ENVIAR E-MAIL:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao enviar e-mail.",
    });
  }
});

app.post("/verify-captcha", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    res.json(response.data);
  } catch {
    res.status(500).json({
      success: false,
      message: "Captcha verification failed",
    });
  }
});

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import axios from "axios";
import cors from "cors";

import paymentRouter from "./routes/payment";
import pixRoutes from "./routes/pix";

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

app.use("/payment", paymentRouter);
app.use("/pix", pixRoutes);

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
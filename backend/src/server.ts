import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import paymentRouter from "./routes/payment";
import pixRoutes from "./routes/pix";
const app = express();
app.use(cors());
app.use(express.json());
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

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Captcha verification failed",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT);
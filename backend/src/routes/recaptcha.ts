import { Router } from "express";

const router = Router();

router.post("/verify", async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token do reCAPTCHA não informado",
            });
        }

        const secret = process.env.RECAPTCHA_SECRET_KEY;

        if (!secret) {
            console.error("RECAPTCHA_SECRET_KEY não configurada");

            return res.status(500).json({
                success: false,
                message: "Chave do reCAPTCHA não configurada",
            });
        }

        const response = await fetch(
            "https://www.google.com/recaptcha/api/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    secret,
                    response: token,
                }),
            }
        );

        const data = await response.json();

        if (!data.success) {
            return res.status(400).json({
                success: false,
                message: "reCAPTCHA inválido",
                errors: data["error-codes"],
            });
        }

        return res.json({
            success: true,
        });

    } catch (error) {
        console.error("Erro ao verificar reCAPTCHA:", error);

        return res.status(500).json({
            success: false,
            message: "Erro ao verificar reCAPTCHA",
        });
    }
});

export default router;
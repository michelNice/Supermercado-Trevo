import { MercadoPagoConfig } from "mercadopago";

const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;

if (!token) {
throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado no Render.");
}

const client = new MercadoPagoConfig({
accessToken: token,
});

export default client;
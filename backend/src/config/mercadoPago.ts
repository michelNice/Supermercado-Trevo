import { MercadoPagoConfig } from "mercadopago";

console.log("TOKEN:", process.env.MERCADO_PAGO_ACCESS_TOKEN);

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export default client;
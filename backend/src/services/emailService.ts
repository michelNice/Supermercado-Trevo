import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(
  email: string,
  name: string
) {
  console.log("=== SEND EMAIL ===");
  console.log("Email:", email);
  console.log("Name:", name);
  console.log("API Key exists:", !!process.env.RESEND_API_KEY);

  try {
    const result = await resend.emails.send({
      from: "Trevo Supermercado <onboarding@resend.dev>",
      to: email,
      subject: "Compra confirmada! 🎉",
      html: `
        <h1>Olá, ${name}!</h1>

        <p>Obrigado pela sua compra no <strong>Trevo Supermercado</strong>.</p>

        <p>Recebemos o seu pagamento com sucesso.</p>

        <p>Seu pedido já está sendo preparado.</p>

        <br>

        <p>Atenciosamente,</p>

        <p><strong>Trevo Supermercado</strong></p>
      `,
    });

    console.log("RESEND RESULT:");
    console.log(result);

  } catch (error) {
    console.error("EMAIL ERROR:");
    console.error(error);
  }
}

import { Resend } from "resend";

interface Store {
  id: string;
  name: string;
  address: string;
}

interface Address {
  name?: string;
  email?: string;
  street: string;
  number: string;
  complemento?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

type DeliveryMethod = "delivery" | "pickup";

export async function sendConfirmationEmail(
  email: string,
  name: string,
  items: any[],
  address: Address | null,
  total: number,
  deliveryMethod: DeliveryMethod,
  selectedStore: Store | null
) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    throw new Error(
      "RESEND_API_KEY não está configurada no ambiente."
    );
  }
  const resend = new Resend(resendApiKey);
  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="
            padding:12px;
            border-bottom:1px solid #ddd;
            color:#333;
          ">
            ${item.name}
          </td>

          <td style="
            padding:12px;
            border-bottom:1px solid #ddd;
            text-align:center;
            color:#333;
          ">
            ${item.quantity}
          </td>

          <td style="
            padding:12px;
            border-bottom:1px solid #ddd;
            text-align:right;
            color:#333;
          ">
            R$ ${(Number(item.price) * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
    )
    .join("");

  const customerHtml = `
    <div style="
      background:#f5f5f5;
      border-left:5px solid #004d26;
      padding:20px;
      border-radius:10px;
      margin-top:25px;
    ">
      <h2 style="
        color:#004d26;
        margin-top:0;
      ">
        Dados do cliente
      </h2>

      <p style="
        font-size:16px;
        line-height:1.6;
        margin-bottom:5px;
      ">
        <strong>Nome:</strong> ${name}
      </p>

      <p style="
        font-size:16px;
        line-height:1.6;
        margin-top:5px;
      ">
        <strong>E-mail:</strong> ${email}
      </p>
    </div>
  `;

  const pickupHtml =
    deliveryMethod === "pickup"
      ? `
        <div style="
          background:#f5f5f5;
          border-left:5px solid #004d26;
          padding:20px;
          border-radius:10px;
          margin-top:25px;
        ">
          <h2 style="color:#004d26;margin-top:0;">
            Retirada na loja 🏪
          </h2>

          <p style="
            font-size:16px;
            line-height:1.6;
          ">
            Seu pedido estará disponível para retirada
            na seguinte loja:
          </p>

          <p style="
            font-size:17px;
            line-height:1.6;
            margin-bottom:0;
          ">
            <strong>
              ${selectedStore?.name || "Loja não informada"}
            </strong>
            <br>
            ${selectedStore?.address || "Endereço da loja não informado"}
          </p>
        </div>
      `
      : "";

  const deliveryHtml =
    deliveryMethod === "delivery"
      ? `
        <div style="
          background:#f5f5f5;
          border-left:5px solid #004d26;
          padding:20px;
          border-radius:10px;
          margin-top:25px;
        ">
          <h2 style="color:#004d26;margin-top:0;">
            Endereço de entrega 🏠
          </h2>

          <p style="
            line-height:1.6;
            font-size:16px;
          ">
            <strong>Nome:</strong>
            ${address?.name || name}
            <br>

            <strong>E-mail:</strong>
            ${address?.email || email}

            <br><br>

            ${address?.street || ""}
            ${address?.number ? `, ${address.number}` : ""}

            <br>

            ${
              address?.complemento
                ? `${address.complemento}<br>`
                : ""
            }

            ${address?.neighborhood || ""}

            <br>

            ${address?.city || ""}

            ${address?.state ? ` - ${address.state}` : ""}

            <br>

            CEP: ${address?.zipCode || ""}
          </p>
        </div>
      `
      : "";

  const deliveryMessage =
    deliveryMethod === "pickup"
      ? `
        Seu pedido já está sendo preparado para retirada.
        Aguarde a confirmação de que ele está disponível
        na loja escolhida.
      `
      : `
        Seu pedido já está sendo preparado.
        Entrega prevista:
        <strong style="color:#ee7104;">
          1 a 2 dias úteis
        </strong>
      `;

  const subject =
    deliveryMethod === "pickup"
      ? "Pedido confirmado - Retirada na loja 🏪"
      : "Compra confirmada! 🎉";

  const result = await resend.emails.send({
    from: "Trevo Supermercado <onboarding@resend.dev>",
    to: email,
    subject,

    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">

      <head>
        <meta charset="UTF-8">
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >

        <title>${subject}</title>
      </head>

      <body style="
        margin:0;
        padding:0;
        background:#eeeeee;
        font-family:Arial, Helvetica, sans-serif;
      ">

        <div style="
          max-width:700px;
          margin:30px auto;
          background:#ffffff;
          border-radius:12px;
          overflow:hidden;
        ">

          <div style="
            background:#004d26;
            padding:30px;
            text-align:center;
            color:#ffffff;
          ">
            <h1 style="
              margin:0;
              font-size:28px;
            ">
              Compra Confirmada! 🎉
            </h1>

            <p style="
              margin:10px 0 0;
              font-size:16px;
            ">
              Obrigado pela sua compra no Trevo Supermercado.
            </p>
          </div>

          <div style="padding:30px;">

            <p style="
              font-size:17px;
              color:#333;
            ">
              Olá, <strong>${name}</strong>!
            </p>

            <p style="
              font-size:16px;
              line-height:1.6;
              color:#555;
            ">
              Recebemos o seu pagamento com sucesso.
              Confira abaixo os detalhes do seu pedido.
            </p>

            ${customerHtml}

            <div style="margin-top:30px;">

              <h2 style="color:#004d26;">
                Itens do pedido
              </h2>

              <table style="
                width:100%;
                border-collapse:collapse;
                font-size:15px;
              ">

                <thead>
                  <tr style="background:#f5f5f5;">

                    <th style="
                      padding:12px;
                      text-align:left;
                    ">
                      Produto
                    </th>

                    <th style="
                      padding:12px;
                      text-align:center;
                    ">
                      Quantidade
                    </th>

                    <th style="
                      padding:12px;
                      text-align:right;
                    ">
                      Valor
                    </th>

                  </tr>
                </thead>

                <tbody>
                  ${itemsHtml}
                </tbody>

              </table>

            </div>

            <div style="
              margin-top:25px;
              padding:20px;
              background:#f5f5f5;
              border-radius:10px;
              text-align:right;
            ">
              <strong style="
                font-size:20px;
                color:#004d26;
              ">
                Total: R$ ${Number(total).toFixed(2)}
              </strong>
            </div>

            ${pickupHtml}

            ${deliveryHtml}

            <div style="
              margin-top:25px;
              padding:20px;
              background:#fff7ed;
              border-radius:10px;
              color:#555;
              line-height:1.6;
            ">
              ${deliveryMessage}
            </div>

          </div>

          <div style="
            background:#004d26;
            padding:25px;
            text-align:center;
            color:#ffffff;
          ">
            <p style="
              margin:0;
              font-size:14px;
            ">
              Atenciosamente,<br>
              <strong>Trevo Supermercado</strong>
            </p>
          </div>

        </div>

      </body>
      </html>
    `,
  });

  // IMPORTANTE:
  // O Resend pode retornar "error" sem lançar uma exceção.
  if (result.error) {
    console.error(
      "❌ ERRO REAL DO RESEND:",
      result.error
    );

    throw new Error(
      result.error.message ||
        "Erro retornado pelo Resend."
    );
  }

  // Só consideramos enviado quando o Resend devolveu um ID.
  console.log(
    "✅ RESEND ACEITOU O E-MAIL:",
    {
      id: result.data?.id,
      email,
    }
  );

  return result;
}


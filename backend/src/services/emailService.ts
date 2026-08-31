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
    return null;
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
          <h2 style="
            color:#004d26;
            margin-top:0;
          ">
            Retirada na loja 🏪
          </h2>

          <p style="
            font-size:16px;
            line-height:1.6;
          ">
            Seu pedido estará disponível para retirada na seguinte loja:
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

            ${
              selectedStore?.address ||
              "Endereço da loja não informado"
            }
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
          <h2 style="
            color:#004d26;
            margin-top:0;
          ">
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
      <div style="
        max-width:600px;
        margin:auto;
        background:#ffffff;
        padding:30px;
        font-family:Arial, Helvetica, sans-serif;
        color:#333;
      ">
        <div style="
          background:#004d26;
          padding:25px;
          border-radius:10px;
          text-align:center;
        ">
          <h1 style="
            color:#ffffff;
            margin:0;
            font-size:28px;
          ">
            Compra Confirmada! 🎉
          </h1>
        </div>

        <p style="
          font-size:16px;
          margin-top:25px;
        ">
          Olá, <strong>${name}</strong>!
        </p>

        <p style="
          font-size:16px;
          line-height:1.5;
        ">
          Obrigado pela sua compra no
          <strong>Trevo Supermercado</strong>.
          Recebemos o seu pagamento com sucesso.
        </p>

        ${customerHtml}

        <h2 style="
          color:#004d26;
          margin-top:30px;
        ">
          Resumo do pedido
        </h2>

        <table style="
          width:100%;
          border-collapse:collapse;
          margin-top:15px;
        ">
          <tr style="
            background:#ee7104;
            color:white;
          ">
            <th style="
              padding:12px;
              text-align:left;
            ">
              Produto
            </th>

            <th style="
              padding:12px;
            ">
              Quantidade
            </th>

            <th style="
              padding:12px;
              text-align:right;
            ">
              Preço
            </th>
          </tr>

          ${itemsHtml}
        </table>

        <h2 style="
          color:#ee7104;
          margin-top:25px;
        ">
          Total: R$ ${Number(total).toFixed(2)}
        </h2>

        ${pickupHtml}

        ${deliveryHtml}

        <p style="
          margin-top:25px;
          font-size:16px;
          line-height:1.6;
        ">
          ${deliveryMessage}
        </p>

        <hr style="
          border:none;
          border-top:1px solid #ddd;
          margin:30px 0;
        ">

        <p style="
          text-align:center;
          color:#004d26;
        ">
          Atenciosamente,

          <br>

          <strong>
            Trevo Supermercado
          </strong>
        </p>
      </div>
    `,
  });

  return result;
}
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendConfirmationEmail(
  email: string,
  name: string,
  items: any[],
  address: any,
  total: number
) {

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
            R$ ${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
    )
    .join("");

  try {
    const result = await resend.emails.send({
      from: "Trevo Supermercado <onboarding@resend.dev>",
      to: email,
      subject: "Compra confirmada! 🎉",

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
          Total: R$ ${total.toFixed(2)}
        </h2>





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
            Endereço de entrega
          </h2>

          <p style="
            line-height:1.6;
          ">
            ${address.street}, ${address.number}<br>
            ${address.neighborhood}<br>
            ${address.city} - ${address.state}<br>
            CEP: ${address.zipCode}
          </p>
        </div>
        <p style="
          margin-top:25px;
          font-size:16px;
        ">
          Seu pedido já está sendo preparado.

          Entrega prevista:

          <strong style="
            color:#ee7104;
          ">
            1 a 2 dias úteis
          </strong>
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


  } catch (error) {

    throw error;

  }

}
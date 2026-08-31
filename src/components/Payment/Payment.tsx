import "./Payment.scss";

import { useEffect, useState } from "react";

import {
initMercadoPago,
Payment as MercadoPagoPayment,
} from "@mercadopago/sdk-react";

import { useCart } from "../../context/CartContext";
import { useCheckout } from "../../context/CheckoutContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/Supabase/supabaseClient";

const API_URL = "https://supermercado-trevo-h8zn.onrender.com";

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
type PaymentMethod = "card" | "pix";

const Payment = () => {
const { cartItem, clearCart } = useCart();

const {
address,
deliveryMethod,
selectedStore,
} = useCheckout();

const navigate = useNavigate();

const [method, setMethod] =
useState<PaymentMethod>("card");

const [qrCode, setQrCode] = useState("");
const [paymentId, setPaymentId] =
useState<number | null>(null);

const [paymentMessage, setPaymentMessage] =
useState("");

const [loadingPix, setLoadingPix] =
useState(false);

const [loadingPayment, setLoadingPayment] =
useState(false);

const [paymentFinished, setPaymentFinished] =
useState(false);

const [orderSaving, setOrderSaving] =
useState(false);

useEffect(() => {
const publicKey =
import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;


if (!publicKey) {
  setPaymentMessage(
    "Chave pública do Mercado Pago não configurada."
  );
  return;
}

initMercadoPago(publicKey);


}, []);

const total = cartItem.reduce(
(acc, item) =>
acc + Number(item.price) * item.quantity,
0
);

const getCustomerData = async () => {
let name = address?.name?.trim() || "";
let email = address?.email?.trim() || "";


if (!name || !email) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    if (!name) {
      name =
        session.user.user_metadata?.full_name?.trim() ||
        session.user.user_metadata?.name?.trim() ||
        "";
    }

    if (!email) {
      email = session.user.email?.trim() || "";
    }
  }
}

return {
  name,
  email,
};


};

const validateCheckout = async () => {
const customer = await getCustomerData();


if (!customer.name) {
  setPaymentMessage(
    "Não foi possível identificar o nome do cliente."
  );
  return false;
}

if (!customer.email) {
  setPaymentMessage(
    "Não foi possível identificar o e-mail do cliente."
  );
  return false;
}

if (
  deliveryMethod === "pickup" &&
  !selectedStore
) {
  setPaymentMessage(
    "Selecione uma loja para retirar o pedido."
  );
  return false;
}

if (
  deliveryMethod === "delivery" &&
  !address
) {
  setPaymentMessage(
    "Não foi possível identificar o endereço de entrega."
  );
  return false;
}

return true;


};

const saveOrder = async (
paymentMethod: string,
cardName: string | null = null
) => {
try {
setOrderSaving(true);


  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId =
    session?.user?.id ?? null;

  const orderData = {
    user_id: userId,
    items: cartItem,
    total: Number(total.toFixed(2)),
    address:
      deliveryMethod === "delivery"
        ? address
        : null,
    payment_method: paymentMethod,
    card_name: cardName,
    delivery_method: deliveryMethod,
    pickup_store:
      deliveryMethod === "pickup"
        ? selectedStore
        : null,
  };

  const { data, error } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error(
      "Erro ao salvar pedido:",
      error
    );

    setPaymentMessage(
      "O pagamento foi aprovado, mas não foi possível salvar o pedido."
    );

    return null;
  }

  return data;
} catch (error) {
  console.error(
    "Erro inesperado ao salvar pedido:",
    error
  );

  setPaymentMessage(
    "O pagamento foi aprovado, mas não foi possível salvar o pedido."
  );

  return null;
} finally {
  setOrderSaving(false);
}


};

const sendConfirmationEmail = async () => {
try {
const customer =
await getCustomerData();


  const response = await fetch(
    `${API_URL}/email/confirmation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customer.email,
        name: customer.name,
        items: cartItem,
        address:
          deliveryMethod === "delivery"
            ? address
            : null,
        total: Number(total.toFixed(2)),
        deliveryMethod,
        selectedStore:
          deliveryMethod === "pickup"
            ? selectedStore
            : null,
      }),
    }
  );

  if (!response.ok) {
    console.error(
      "Erro ao enviar e-mail:",
      response.status
    );

    return false;
  }

  return true;
} catch (error) {
  console.error(
    "Erro ao enviar e-mail:",
    error
  );

  return false;
}


};

const finishPurchase = async (
paymentMethod: string,
cardName: string | null = null
) => {
if (paymentFinished) {
return;
}


setPaymentFinished(true);
setPaymentMessage("");

const order = await saveOrder(
  paymentMethod,
  cardName
);

if (!order) {
  setPaymentFinished(false);
  return;
}

await sendConfirmationEmail();

clearCart();

navigate("/purchase-confirmed");


};

const gerarPix = async () => {
if (qrCode || loadingPix) {
return;
}


const valid =
  await validateCheckout();

if (!valid) {
  return;
}

try {
  setLoadingPix(true);
  setPaymentMessage("");

  const customer =
    await getCustomerData();

  const paymentData = {
    total: Number(total.toFixed(2)),
    email: customer.email,
    name: customer.name,
    address:
      deliveryMethod === "delivery"
        ? address
        : null,
    items: cartItem,
    delivery_method: deliveryMethod,
    pickup_store:
      deliveryMethod === "pickup"
        ? selectedStore
        : null,
  };

  const response = await fetch(
    `${API_URL}/pix/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Erro HTTP: ${response.status}`
    );
  }

  if (!data.id) {
    throw new Error(
      "O backend não retornou o ID do pagamento."
    );
  }

  if (!data.qrCodeBase64) {
    throw new Error(
      "O backend não retornou o QR Code."
    );
  }

  setPaymentId(Number(data.id));
  setQrCode(data.qrCodeBase64);
  setPaymentMessage("");
} catch (error) {
  const message =
    error instanceof Error
      ? error.message
      : "Não foi possível gerar o PIX.";

  setPaymentMessage(message);
} finally {
  setLoadingPix(false);
}


};

useEffect(() => {
if (
!paymentId ||
paymentFinished
) {
return;
}


const interval = setInterval(
  async () => {
    try {
      const response = await fetch(
        `${API_URL}/pix/status/${paymentId}`
      );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      if (data.status !== "approved") {
        return;
      }

      clearInterval(interval);

      setPaymentMessage(
        "Pagamento aprovado. Finalizando seu pedido..."
      );

      await finishPurchase("pix");
    } catch {
      return;
    }
  },
  5000
);

return () => {
  clearInterval(interval);
};


}, [paymentId, paymentFinished]);

const handlePayment = async (
formData: any
) => {
try {
setLoadingPayment(true);
setPaymentMessage("");


  const valid =
    await validateCheckout();

  if (!valid) {
    return;
  }

  const customer =
    await getCustomerData();

  const paymentData = {
    ...formData,

    transaction_amount:
      Number(total.toFixed(2)),

    payer: {
      email: customer.email,
      first_name: customer.name,
    },

    address:
      deliveryMethod === "delivery"
        ? address
        : null,

    items: cartItem,

    delivery_method:
      deliveryMethod,

    pickup_store:
      deliveryMethod === "pickup"
        ? selectedStore
        : null,
  };

  const response = await fetch(
    `${API_URL}/payment/process-payment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error ||
        result?.message ||
        `Erro HTTP: ${response.status}`
    );
  }

  if (result.status !== "approved") {
    setPaymentMessage(
      result?.status_detail ||
        "Pagamento não aprovado. Verifique os dados."
    );

    return;
  }

  await finishPurchase(
    "card",
    customer.name
  );
} catch (error) {
  const message =
    error instanceof Error
      ? error.message
      : "Não foi possível processar o pagamento.";

  setPaymentMessage(message);
} finally {
  setLoadingPayment(false);
}


};

const selectPaymentMethod = (
selectedMethod: PaymentMethod
) => {
setMethod(selectedMethod);
setQrCode("");
setPaymentId(null);
setPaymentFinished(false);
setPaymentMessage("");


if (selectedMethod === "pix") {
  setTimeout(() => {
    gerarPix();
  }, 100);
}


};

return ( <section className="payment"> <div className="payment__container"> <div className="payment__summary"> <h2>Resumo do Pedido</h2>


      <div className="payment__card">
        <h3>Produtos</h3>

        {cartItem.map((item) => (
          <div
            key={item.id}
            className="payment__product"
          >
            <span>
              {item.quantity}x {item.name}
            </span>

            <strong>
              R${" "}
              {(
                Number(item.price) *
                item.quantity
              ).toFixed(2)}
            </strong>
          </div>
        ))}
      </div>

      <div className="payment__card">
        <h3>Total</h3>

        <div className="payment__total">
          <span>
            Total da compra
          </span>

          <strong>
            R$ {total.toFixed(2)}
          </strong>
        </div>
      </div>

      {deliveryMethod ===
      "delivery" ? (
        <div className="payment__card">
          <h3>
            Endereço de entrega
          </h3>

          <p>
            {address?.name}
          </p>

          <p>
            {address?.email}
          </p>

          <p>
            {address?.street},{" "}
            {address?.number}
          </p>

          {address?.complemento && (
            <p>
              {address.complemento}
            </p>
          )}

          <p>
            {address?.neighborhood}
          </p>

          <p>
            {address?.city} -{" "}
            {address?.state}
          </p>

          <p>
            CEP:{" "}
            {address?.zipCode}
          </p>
        </div>
      ) : (
        <div className="payment__card">
          <h3>
            Retirada na loja
          </h3>

          <div className="payment__pickup">
            <p>
              Cliente:{" "}
              {selectedStore
                ? "Pedido para retirada"
                : ""}
            </p>

            {selectedStore ? (
              <>
                <strong>
                  {selectedStore.name}
                </strong>

                <p>
                  {selectedStore.address}
                </p>

                <span>
                  Você irá retirar
                  seu pedido nesta
                  loja.
                </span>
              </>
            ) : (
              <p>
                Nenhuma loja foi
                selecionada.
              </p>
            )}
          </div>
        </div>
      )}
    </div>

    <div className="payment__methods">
      <h2>
        Forma de pagamento
      </h2>

      <div className="payment__buttons">
        <button
          type="button"
          onClick={() =>
            selectPaymentMethod(
              "card"
            )
          }
          disabled={
            loadingPayment ||
            orderSaving
          }
        >
          Cartão
        </button>

        <button
          type="button"
          onClick={() =>
            selectPaymentMethod(
              "pix"
            )
          }
          disabled={
            loadingPix ||
            orderSaving
          }
        >
          PIX
        </button>
      </div>

      {method === "card" && (
        <MercadoPagoPayment
          initialization={{
            amount: Number(
              total.toFixed(2)
            ),
          }}
          customization={{
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
            },
          }}
          onSubmit={handlePayment}
        />
      )}

      {method === "pix" && (
        <div className="payment__pix">
          {loadingPix && (
            <p>
              Gerando PIX...
            </p>
          )}

          {qrCode && (
            <>
              <h3>
                Escaneie o QR Code
              </h3>

              <img
                src={`data:image/png;base64,${qrCode}`}
                alt="PIX"
                className="payment__qrcode"
              />

              <p>
                Aguardando
                confirmação do
                pagamento...
              </p>
            </>
          )}
        </div>
      )}

      {(loadingPayment ||
        orderSaving) && (
        <p>
          Finalizando pedido...
        </p>
      )}
    </div>
  </div>

  {paymentMessage && (
    <div className="payment__message">
      <p>
        {paymentMessage}
      </p>
    </div>
  )}
</section>


);
};

export default Payment;

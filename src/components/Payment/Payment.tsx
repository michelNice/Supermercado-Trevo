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

const Payment = () => {
  const { cartItem, clearCart } = useCart();

  const {
    address,
    deliveryMethod,
    selectedStore,
  } = useCheckout();

  const navigate = useNavigate();

  const [method, setMethod] = useState<"card" | "pix">("card");
  const [qrCode, setQrCode] = useState("");
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [loadingPix, setLoadingPix] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentFinished, setPaymentFinished] = useState(false);
  const [orderSaving, setOrderSaving] = useState(false);

  useEffect(() => {
    initMercadoPago(
      import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY
    );
  }, []);

  const total = cartItem.reduce(
    (acc, item) =>
      acc + Number(item.price) * item.quantity,
    0
  );

  const customerName =
    address?.name?.trim() || "Cliente";

  const customerEmail =
    address?.email?.trim() || "";

  const validateCheckout = () => {
    if (!customerName) {
      setPaymentMessage(
        "Não foi possível identificar o nome do cliente."
      );
      return false;
    }

    if (!customerEmail) {
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
      };

      const { data, error } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (error) {
        setPaymentMessage(
          "O pagamento foi aprovado, mas não foi possível salvar o pedido."
        );

        return null;
      }

      return data;
    } catch {
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
      const response = await fetch(
        "https://supermercado-trevo-h8zn.onrender.com/email/confirmation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: customerEmail,
            name: customerName,
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
        return false;
      }

      return true;
    } catch {
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

    if (!validateCheckout()) {
      return;
    }

    try {
      setLoadingPix(true);
      setPaymentMessage("");

      const paymentData = {
        total: Number(total.toFixed(2)),
        email: customerEmail,
        name: customerName,
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
        "https://supermercado-trevo-h8zn.onrender.com/pix/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok) {
        let errorMessage =
          `Erro HTTP: ${response.status}`;

        try {
          const errorData =
            await response.json();

          if (errorData?.error) {
            errorMessage = errorData.error;
          }

          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch {}

        throw new Error(errorMessage);
      }

      const data = await response.json();

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

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `https://supermercado-trevo-h8zn.onrender.com/pix/status/${paymentId}`
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data.status !== "approved") {
          return;
        }

        clearInterval(interval);

        setPaymentMessage(
          "Pagamento aprovado. Finalizando seu pedido..."
        );

        await finishPurchase("pix");
      } catch {}
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [
    paymentId,
    paymentFinished,
  ]);

  const handlePayment = async (
    formData: any
  ) => {
    try {
      setLoadingPayment(true);
      setPaymentMessage("");

      if (!validateCheckout()) {
        return;
      }

      const paymentData = {
        ...formData,
        transaction_amount:
          Number(total.toFixed(2)),
        payer: {
          email: customerEmail,
          first_name: customerName,
        },
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
        "https://supermercado-trevo-h8zn.onrender.com/payment/process-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok) {
        let errorMessage =
          `Erro HTTP: ${response.status}`;

        try {
          const errorData =
            await response.json();

          if (errorData?.error) {
            errorMessage = errorData.error;
          }

          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch {}

        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.status !== "approved") {
        setPaymentMessage(
          "Pagamento não aprovado. Verifique os dados."
        );
        return;
      }

      await finishPurchase(
        "card",
        customerName
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

  return (
    <section className="payment">
      <div className="payment__container">
        <div className="payment__summary">
          <h2>Resumo do Pedido</h2>

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
              <span>Total da compra</span>

              <strong>
                R$ {total.toFixed(2)}
              </strong>
            </div>
          </div>

          {deliveryMethod === "delivery" ? (
            <div className="payment__card">
              <h3>Endereço de entrega</h3>

              <p>{customerName}</p>

              <p>{customerEmail}</p>

              <p>
                {address?.street},{" "}
                {address?.number}
              </p>

              {address?.complemento && (
                <p>{address.complemento}</p>
              )}

              <p>
                {address?.neighborhood}
              </p>

              <p>
                {address?.city} -{" "}
                {address?.state}
              </p>

              <p>
                CEP: {address?.zipCode}
              </p>
            </div>
          ) : (
            <div className="payment__card">
              <h3>Retirada na loja</h3>

              <div className="payment__pickup">
                <p>{customerName}</p>

                <p>{customerEmail}</p>

                {selectedStore ? (
                  <>
                    <strong>
                      {selectedStore.name}
                    </strong>

                    <p>
                      {selectedStore.address}
                    </p>

                    <span>
                      Você irá retirar seu
                      pedido nesta loja.
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
          <h2>Forma de pagamento</h2>

          <div className="payment__buttons">
            <button
              type="button"
              onClick={() => {
                setMethod("card");
                setQrCode("");
                setPaymentId(null);
                setPaymentFinished(false);
                setPaymentMessage("");
              }}
            >
              Cartão
            </button>

            <button
              type="button"
              onClick={() => {
                setMethod("pix");
                setQrCode("");
                setPaymentId(null);
                setPaymentFinished(false);
                setPaymentMessage("");
                gerarPix();
              }}
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
                <p>Gerando PIX...</p>
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
                    Aguardando confirmação
                    do pagamento...
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
          <p>{paymentMessage}</p>
        </div>
      )}
    </section>
  );
};

export default Payment;
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
  const { address, deliveryMethod, selectedStore } = useCheckout();
  const navigate = useNavigate();

  const [method, setMethod] = useState<"card" | "pix">("card");
  const [qrCode, setQrCode] = useState("");
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [loadingPix, setLoadingPix] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentFinished, setPaymentFinished] = useState(false);

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

  const saveOrder = async (
    paymentMethod: string,
    cardName: string | null = null
  ) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userId = session?.user?.id ?? null;

      const { error } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          items: cartItem,
          total: Number(total.toFixed(2)),
          address: address,
          payment_method: paymentMethod,
          card_name: cardName,
        })
        .select()
        .single();

      if (error) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  async function gerarPix() {
    if (qrCode || loadingPix) return;

    try {
      setLoadingPix(true);
      setPaymentMessage("");

      const response = await fetch(
        "http://localhost:3001/pix/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            total,
            email: address.email,
            name: address.name,
            address,
            items: cartItem,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erro HTTP: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.id) {
        throw new Error(
          "O backend não retornou o ID do pagamento."
        );
      }

      setPaymentId(Number(data.id));

      if (!data.qrCodeBase64) {
        throw new Error(
          "O backend não retornou o QR Code."
        );
      }

      setQrCode(data.qrCodeBase64);
    } catch (error) {
      setPaymentMessage(
        "Não foi possível gerar o PIX. Tente novamente."
      );
    } finally {
      setLoadingPix(false);
    }
  }

  useEffect(() => {
    if (!paymentId || paymentFinished) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/pix/status/${paymentId}`
        );

        if (!response.ok) {
          throw new Error(
            `Erro HTTP: ${response.status}`
          );
        }

        const data = await response.json();

        if (
          data.status === "approved" &&
          !paymentFinished
        ) {
          setPaymentFinished(true);

          clearInterval(interval);

          const orderSaved = await saveOrder("pix");

          if (!orderSaved) {
            setPaymentMessage(
              "Pagamento aprovado, mas não foi possível salvar o pedido. Entre em contato com o suporte."
            );
            return;
          }

          setPaymentMessage(
            "Pagamento aprovado! Seu pedido foi confirmado."
          );

          setTimeout(() => {
            clearCart();
            navigate("/purchase-confirmed");
          }, 3000);
        }
      } catch (error) {
        if (!paymentFinished) {
          setPaymentMessage(
            "Erro ao verificar pagamento."
          );
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [
    paymentId,
    paymentFinished,
    clearCart,
    navigate,
  ]);

  async function handlePayment(formData: any) {
    try {
      setLoadingPayment(true);
      setPaymentMessage("");

      const response = await fetch(
        "http://localhost:3001/payment/process-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            transaction_amount:
              Number(total.toFixed(2)),
            payer: {
              email: address.email,
            },
            address,
            items: cartItem,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erro HTTP: ${response.status}`
        );
      }

      const result = await response.json();

      if (result.status === "approved") {
        setPaymentFinished(true);

        const orderSaved = await saveOrder(
          "card",
          formData?.payer?.first_name ||
            formData?.cardholder?.name ||
            null
        );

        if (!orderSaved) {
          setPaymentMessage(
            "Pagamento aprovado, mas não foi possível salvar o pedido. Entre em contato com o suporte."
          );
          return;
        }

        setPaymentMessage(
          "Pagamento aprovado! Seu pedido foi confirmado."
        );

        setTimeout(() => {
          clearCart();
          navigate("/purchase-confirmed");
        }, 3000);

        return;
      }

      setPaymentMessage(
        "Pagamento não aprovado. Verifique os dados."
      );
    } catch (error) {
      setPaymentMessage("");
    } finally {
      setLoadingPayment(false);
    }
  }

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

              <p>{address.name}</p>

              <p>{address.email}</p>

              <p>
                {address.street},{" "}
                {address.number}
              </p>

              {address.complemento && (
                <p>{address.complemento}</p>
              )}

              <p>
                {address.neighborhood}
              </p>

              <p>
                {address.city} -{" "}
                {address.state}
              </p>

              <p>
                CEP: {address.zipCode}
              </p>
            </div>
          ) : (
            <div className="payment__card">
              <h3>Retirada na loja</h3>

              <div className="payment__pickup">
                <strong>
                  {selectedStore?.name}
                </strong>

                <p>
                  {selectedStore?.adress}
                </p>

                <span>
                  Você irá retirar seu pedido nesta loja.
                </span>
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
                    Aguardando confirmação
                    do pagamento...
                  </p>
                </>
              )}
            </div>
          )}

          {loadingPayment && (
            <p>
              Processando pagamento...
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
import "./Payment.scss";
import { useEffect, useState } from "react";
import {
  initMercadoPago,
  Payment as MercadoPagoPayment,
} from "@mercadopago/sdk-react";

import { useCart } from "../../context/CartContext";
import { useCheckout } from "../../context/CheckoutContext";

const Payment = () => {
  const { cartItem } = useCart();
  const { address } = useCheckout();

  const [method, setMethod] = useState<"card" | "pix">("card");
  const [qrCode, setQrCode] = useState("");
  const [loadingPix, setLoadingPix] = useState(false);

  useEffect(() => {
    initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY);
  }, []);

  const total = cartItem.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  async function gerarPix() {
    try {
      setLoadingPix(true);

      const response = await fetch(
        "http://localhost:3001/pix/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            total,
            email: "cliente@email.com",
          }),
        }
      );

      const data = await response.json();

      if (data.qrCodeBase64) {
        setQrCode(data.qrCodeBase64);
      } else {
        console.log("Mercado Pago não retornou QR Code");
      }
    } catch (error) {
      console.error("ERRO AO GERAR PIX:", error);
    } finally {
      setLoadingPix(false);
    }
  }

  return (
    <section className="payment">
      <div className="payment__container">

        {/* RESUMO DO PEDIDO */}
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
                  {(Number(item.price) * item.quantity).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <div className="payment__card">
            <h3>Total</h3>

            <div className="payment__total">
              <span>Total da compra</span>

              <strong>R$ {total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="payment__card">
            <h3>Endereço de entrega</h3>

            <p>
              {address.street}, {address.number}
            </p>

            {address.complemento && (
              <p>{address.complemento}</p>
            )}

            <p>{address.neighborhood}</p>

            <p>
              {address.city} - {address.state}
            </p>

            <p>CEP: {address.zipCode}</p>
          </div>
        </div>

        {/* PAGAMENTO */}
        <div className="payment__methods">

          <h2>Forma de pagamento</h2>

          <div className="payment__buttons">
            <button
              onClick={() => {
                setMethod("card");
                setQrCode("");
              }}
            >
              Cartão
            </button>

            <button
              onClick={() => {
                setMethod("pix");
                gerarPix();
              }}
            >
              PIX
            </button>
          </div>

          {method === "card" && (
            <div className="payment__mercadopago">
              <MercadoPagoPayment
                initialization={{
                  amount: total,
                }}
                customization={{
                  paymentMethods: {
                    creditCard: "all",
                    debitCard: "all",
                  },
                }}
                onSubmit={async (formData) => {
                  try {
                    const response = await fetch(
                      "http://localhost:3001/payment/process-payment",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                      }
                    );

                    const result = await response.json();

                    console.log(result);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              />
            </div>
          )}

          {method === "pix" && (
            <div className="payment__pix">

              {loadingPix && <p>Gerando PIX...</p>}

              {qrCode && (
                <>
                  <h3>Escaneie o QR Code</h3>

                  <img
                    className="payment__qrcode"
                    src={`data:image/png;base64,${qrCode}`}
                    alt="QR Code PIX"
                  />

                  <p>Após o pagamento, sua compra será confirmada.</p>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default Payment;
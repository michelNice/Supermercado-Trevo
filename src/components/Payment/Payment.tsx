import "./Payment.scss";
import { useEffect, useState } from "react";
import {
  initMercadoPago,
  Payment as MercadoPagoPayment,
} from "@mercadopago/sdk-react";
import { useCart } from "../../context/CartContext";
import { useCheckout } from "../../context/CheckoutContext";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const { cartItem, clearCart } = useCart();
  const { address } = useCheckout();
  const navigate = useNavigate();

  const [method, setMethod] = useState<"card" | "pix">("card");
  const [qrCode, setQrCode] = useState("");
  const [paymentId, setPaymentId] = useState<number | null>(null);

  const [loadingPix, setLoadingPix] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  useEffect(() => {
    initMercadoPago(
      import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY
    );
  }, []);

  const total = cartItem.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  async function gerarPix() {
    if (qrCode) return;

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
            email: address.email,
            name: address.name,
            address,
            items: cartItem,
          }),
        }
      );

      const data = await response.json();

      console.log("PIX CREATED:", data);

      if (data.id) {
        setPaymentId(data.id);
      }

      if (data.qrCodeBase64) {
        setQrCode(data.qrCodeBase64);
      } else {
        console.log("QR Code not returned");
      }

    } catch (error) {
      console.error("Erro ao gerar PIX:", error);
    } finally {
      setLoadingPix(false);
    }
  }

  useEffect(() => {
    if (!paymentId) return;

    console.log("Starting PIX status verification...");

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/pix/status/${paymentId}`
        );

        const data = await response.json();

        console.log("PIX STATUS:", data);

        if (data.status === "approved") {
          clearInterval(interval);

          alert("Pagamento aprovado!");

          clearCart();

          navigate("/purchase-confirmed");
        }

      } catch (error) {
        console.error(error);
      }

    }, 5000);

    return () => clearInterval(interval);

  }, [paymentId, clearCart, navigate]);

  async function handlePayment(formData: any) {
    try {
      setLoadingPayment(true);

      const response = await fetch(
        "http://localhost:3001/payment/process-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            transaction_amount: Number(total.toFixed(2)),
            payer: {
              email: address.email,
            },
            address,
            items: cartItem,
          }),
        }
      );

      const result = await response.json();

      console.log(result);

      if (result.status === "approved") {
        clearCart();

        navigate("/purchase-confirmed");
      } else {
        alert("Pagamento não aprovado.");
      }

    } catch (error) {
      console.error(error);
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
                  R$ {(Number(item.price) * item.quantity).toFixed(2)}
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

          <div className="payment__card">

            <h3>Endereço</h3>

            <p>{address.name}</p>
            <p>{address.email}</p>
            <p>{address.street}, {address.number}</p>

            {address.complemento &&
              <p>{address.complemento}</p>
            }

            <p>{address.neighborhood}</p>

            <p>
              {address.city} - {address.state}
            </p>

            <p>CEP: {address.zipCode}</p>

          </div>

        </div>

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

            <MercadoPagoPayment
              initialization={{
                amount: Number(total.toFixed(2)),
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
                  <h3>Escaneie o QR Code</h3>

                  <img
                    src={`data:image/png;base64,${qrCode}`}
                    alt="PIX"
                    className="payment__qrcode"
                  />

                  <p>
                    Aguardando confirmação do pagamento...
                  </p>

                  {paymentId && (
                    <small>
                      ID: {paymentId}
                    </small>
                  )}

                </>
              )}

            </div>

          )}

          {loadingPayment && (
            <p>Processando pagamento...</p>
          )}

        </div>

      </div>
    </section>
  );
};

export default Payment;
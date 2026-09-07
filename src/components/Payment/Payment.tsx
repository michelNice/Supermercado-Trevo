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

const API_URL = "https://supermercado-trevo.onrender.com";

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

type PaymentMethod = "card" | "pix";

const Payment = () => {
  const { cartItem, clearCart } = useCart();
  const { address, deliveryMethod, selectedStore } = useCheckout();
  const navigate = useNavigate();

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [savedAddress, setSavedAddress] = useState<Address | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [qrCode, setQrCode] = useState("");
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [paymentMessage, setPaymentMessage] = useState("");

  const [loadingPix, setLoadingPix] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentFinished, setPaymentFinished] = useState(false);
  const [orderSaving, setOrderSaving] = useState(false);

  const total = cartItem.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  
  useEffect(() => {
    const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
    if (publicKey) {
      initMercadoPago(publicKey);
    }

  
    fetch(`${API_URL}/pix/status/1`).catch(() => {});
  }, []);

  // 2. Salva endereço no localStorage quando atualizado no Context
  useEffect(() => {
    if (address) {
      localStorage.setItem(
        "trevo_customer_address",
        JSON.stringify(address)
      );
      setSavedAddress(address);
    }
  }, [address]);

useEffect(() => {
  if (address && (address.street || address.zipCode)) {
    localStorage.setItem("trevo_customer_address", JSON.stringify(address));
    setSavedAddress(address);
  }
}, [address]);

useEffect(() => {
  const loadCustomerData = async () => {
    try {

      const localData = localStorage.getItem("trevo_customer_address");
      if (localData) {
        const parsed = JSON.parse(localData);
     
        if (parsed && (parsed.street || parsed.zipCode)) {
          setSavedAddress(parsed);
          setIsDataLoaded(true);
          return;
        }
      }

      // Tentativa 2: Buscar do Supabase se o usuário estiver logado
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsDataLoaded(true);
        return;
      }
      const { data } = await supabase
        .from("addresses")
        .select("name,email,street,number,complement,neighborhood,city,state,zip_code")
        .eq("user_id", session.user.id)
        .order("is_default", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        const customerAddress: Address = {
          name: data.name || session.user.user_metadata?.full_name || "",
          email: data.email || session.user.email || "",
          street: data.street || "",
          number: data.number || "",
          complemento: data.complement || "", 
          neighborhood: data.neighborhood || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zip_code || "",     
        };
        setSavedAddress(customerAddress);
        localStorage.setItem("trevo_customer_address", JSON.stringify(customerAddress));
      }
    } catch (error) {
      console.error("Erro ao carregar endereço:", error);
    } finally {
      setIsDataLoaded(true);
    }
  };
  loadCustomerData();
}, []);
  const customerAddress = address || savedAddress;
  const getCustomerData = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const name =
      customerAddress?.name?.trim() ||
      session?.user?.user_metadata?.full_name ||
      session?.user?.user_metadata?.name ||
      "";

    const email =
      customerAddress?.email?.trim() || session?.user?.email || "";

    return { name, email };
  };

  const validateCheckout = async () => {
    const customer = await getCustomerData();

    if (!customer.name) {
      setPaymentMessage("Não foi possível identificar o nome do cliente.");
      return false;
    }

    if (!customer.email) {
      setPaymentMessage("Não foi possível identificar o e-mail do cliente.");
      return false;
    }

    if (deliveryMethod === "delivery" && !customerAddress) {
      setPaymentMessage("Não foi possível identificar o endereço de entrega.");
      return false;
    }

    if (deliveryMethod === "pickup" && !selectedStore) {
      setPaymentMessage("Selecione uma loja para retirar o pedido.");
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

      const orderData = {
        user_id: session?.user?.id || null,
        items: cartItem,
        total: Number(total.toFixed(2)),
        address: deliveryMethod === "delivery" ? customerAddress : null,
        payment_method: paymentMethod,
        card_name: cardName,
        delivery_method: deliveryMethod,
        pickup_store: deliveryMethod === "pickup" ? selectedStore : null,
      };

      const { error } = await supabase.from("orders").insert(orderData);

      if (error) {
        setPaymentMessage(
          "O pagamento foi aprovado, mas não foi possível salvar o pedido."
        );
        return null;
      }

      return orderData;
    } finally {
      setOrderSaving(false);
    }
  };

  const sendConfirmationEmail = async () => {
    try {
      const customer = await getCustomerData();

      const response = await fetch(`${API_URL}/email/confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customer.email,
          name: customer.name,
          items: cartItem,
          address: deliveryMethod === "delivery" ? customerAddress : null,
          total: Number(total.toFixed(2)),
          deliveryMethod,
          selectedStore: deliveryMethod === "pickup" ? selectedStore : null,
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  };

  const finishPurchase = async (
    paymentMethod: string,
    cardName: string | null = null
  ) => {
    if (paymentFinished) return;

    setPaymentFinished(true);
    setPaymentMessage("");

    const order = await saveOrder(paymentMethod, cardName);

    if (!order) {
      setPaymentFinished(false);
      return;
    }

    await sendConfirmationEmail();
    clearCart();
    navigate("/purchase-confirmed");
  };

  const gerarPix = async () => {
    if (loadingPix || qrCode) return;

    const valid = await validateCheckout();
    if (!valid) return;

    try {
      setLoadingPix(true);
      setPaymentMessage("");

      const customer = await getCustomerData();

      const response = await fetch(`${API_URL}/pix/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total: Number(total.toFixed(2)),
          email: customer.email,
          name: customer.name,
          address: deliveryMethod === "delivery" ? customerAddress : null,
          items: cartItem,
          delivery_method: deliveryMethod,
          pickup_store: deliveryMethod === "pickup" ? selectedStore : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || `Erro HTTP: ${response.status}`
        );
      }

      if (!data.id) {
        throw new Error("O backend não retornou o ID do pagamento.");
      }

      if (!data.qrCodeBase64) {
        throw new Error("O backend não retornou o QR Code.");
      }

      setPaymentId(Number(data.id));
      setQrCode(data.qrCodeBase64);
    } catch (error) {
      setPaymentMessage(
        error instanceof Error ? error.message : "Não foi possível gerar o PIX."
      );
    } finally {
      setLoadingPix(false);
    }
  };

  useEffect(() => {
    if (
      method !== "pix" ||
      qrCode ||
      loadingPix ||
      paymentFinished ||
      !isDataLoaded
    ) {
      return;
    }

    gerarPix();
  }, [method, customerAddress, isDataLoaded]);

  // 5. Polling de verificação de pagamento do PIX
  useEffect(() => {
    if (!paymentId || paymentFinished) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/pix/status/${paymentId}`);

        if (!response.ok) return;

        const data = await response.json();

        if (data.status !== "approved") return;

        clearInterval(interval);
        setPaymentMessage("Pagamento aprovado. Finalizando seu pedido...");
        await finishPurchase("pix");
      } catch {
        return;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [paymentId, paymentFinished]);

  const handlePayment = async (formData: any) => {
    try {
      setLoadingPayment(true);
      setPaymentMessage("");

      const valid = await validateCheckout();
      if (!valid) return;

      const customer = await getCustomerData();

      const response = await fetch(`${API_URL}/payment/process-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          transaction_amount: Number(total.toFixed(2)),
          payer: {
            email: customer.email,
            first_name: customer.name,
          },
          address: deliveryMethod === "delivery" ? customerAddress : null,
          items: cartItem,
          delivery_method: deliveryMethod,
          pickup_store: deliveryMethod === "pickup" ? selectedStore : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || result?.message || `Erro HTTP: ${response.status}`
        );
      }

      if (result.status !== "approved") {
        setPaymentMessage(
          result?.status_detail || "Pagamento não aprovado. Verifique os dados."
        );
        return;
      }

      await finishPurchase("card", customer.name);
    } catch (error) {
      setPaymentMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível processar o pagamento."
      );
    } finally {
      setLoadingPayment(false);
    }
  };

  const selectPaymentMethod = (selectedMethod: PaymentMethod) => {
    if (selectedMethod === method) return;

    setQrCode("");
    setPaymentId(null);
    setPaymentFinished(false);
    setPaymentMessage("");
    setMethod(selectedMethod);
  };

  return (
    <section className="payment">
      <div className="payment__container">
        <div className="payment__summary">
          <h2>Resumo do Pedido</h2>

          <div className="payment__card">
            <h3>Produtos</h3>
            {cartItem.map((item) => (
              <div key={item.id} className="payment__product">
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
              <strong>R$ {total.toFixed(2)}</strong>
            </div>
          </div>

          {deliveryMethod === "delivery" ? (
            <div className="payment__card">
              <h3>Endereço de entrega</h3>
              {customerAddress ? (
                <>
                  <p>{customerAddress.name}</p>
                  <p>{customerAddress.email}</p>
                  <p>
                    {customerAddress.street}, {customerAddress.number}
                  </p>
                  {customerAddress.complemento && (
                    <p>{customerAddress.complemento}</p>
                  )}
                  <p>{customerAddress.neighborhood}</p>
                  <p>
                    {customerAddress.city} - {customerAddress.state}
                  </p>
                  <p>CEP: {customerAddress.zipCode}</p>
                </>
              ) : (
                <p>Carregando endereço...</p>
              )}
            </div>
          ) : (
            <div className="payment__card">
              <h3>Retirada na loja</h3>
              {selectedStore && (
                <>
                  <strong>{selectedStore.name}</strong>
                  <p>{selectedStore.address}</p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="payment__methods">
          <h2>Forma de pagamento</h2>

          <div className="payment__buttons">
            <button
              type="button"
              onClick={() => selectPaymentMethod("card")}
              disabled={loadingPayment || loadingPix || orderSaving}
            >
              Cartão
            </button>

            <button
              type="button"
              onClick={() => selectPaymentMethod("pix")}
              disabled={loadingPayment || loadingPix || orderSaving}
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
              {loadingPix && <p>Gerando PIX...</p>}

              {qrCode && (
                <>
                  <h3>Escaneie o QR Code</h3>
                  <img
                    src={`data:image/png;base64,${qrCode}`}
                    alt="PIX"
                    className="payment__qrcode"
                  />
                  <p>Aguardando confirmação do pagamento...</p>
                </>
              )}
            </div>
          )}

          {(loadingPayment || orderSaving) && <p>Finalizando pedido...</p>}
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
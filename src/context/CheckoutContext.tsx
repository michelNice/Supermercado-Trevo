import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

type DeliveryMethod = "delivery" | "pickup";

interface Store {
  id: string;
  name: string;
  address: string;
}

interface PaymentData {
  method: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  installments: string;
}

export interface AddressData {
  name: string;
  email: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complemento: string;
}

interface CheckoutContextType {
  payment: PaymentData;
  setPayment: React.Dispatch<React.SetStateAction<PaymentData>>;
  address: AddressData;
  setAddress: React.Dispatch<React.SetStateAction<AddressData>>;
  updateAddressField: (field: keyof AddressData, value: string) => void;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: React.Dispatch<React.SetStateAction<DeliveryMethod>>;
  selectedStore: Store | null;
  setSelectedStore: React.Dispatch<React.SetStateAction<Store | null>>;
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

const STORAGE_KEY = "checkout_address_data";

export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [payment, setPayment] = useState<PaymentData>({
    method: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    installments: "",
  });

  // 1. Lê do localStorage no momento que a aplicação inicia
  const [address, setAddress] = useState<AddressData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") return parsed;
      }
    } catch (e) {
      console.error("Erro ao ler localStorage", e);
    }
    return {
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      complemento: "",
      name: "",
      email: "",
    };
  });

  // 2. Garante gravação imediata sempre que 'address' mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(address));
    } catch (e) {
      console.error("Erro ao salvar no localStorage", e);
    }
  }, [address]);

  // 3. Helper para alterar apenas 1 campo (ex: CEP) sem apagar os outros
  const updateAddressField = useCallback((field: keyof AddressData, value: string) => {
    setAddress((prev) => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  return (
    <CheckoutContext.Provider
      value={{
        payment,
        setPayment,
        address,
        setAddress,
        updateAddressField,
        deliveryMethod,
        setDeliveryMethod,
        selectedStore,
        setSelectedStore,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout deve estar dentro do CheckoutProvider");
  }
  return context;
};
import "./Address.scss";

import { useEffect, useState } from "react";
import { formatCep } from "../../modals/CepModal/CepModalUtils";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../../context/CheckoutContext";
import { supabase } from "../../services/Supabase/supabaseClient";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

const fields = [
  {
    name: "name",
    label: "Nome completo",
    placeholder: "Digite seu nome completo",
    type: "text",
    required: true,
  },
  {
    name: "email",
    label: "E-mail",
    placeholder: "Digite seu e-mail",
    type: "email",
    required: true,
  },
  {
    name: "zipCode",
    label: "CEP",
    placeholder: "Digite o CEP",
    type: "text",
    required: true,
  },
  {
    name: "street",
    label: "Rua",
    placeholder: "Digite a rua",
    type: "text",
    required: true,
  },
  {
    name: "number",
    label: "Número",
    placeholder: "Digite o número",
    type: "text",
    required: true,
  },
  {
    name: "complemento",
    label: "Complemento",
    placeholder: "Apartamento, bloco... (opcional)",
    type: "text",
    required: false,
  },
  {
    name: "neighborhood",
    label: "Bairro",
    placeholder: "Digite o bairro",
    type: "text",
    required: true,
  },
  {
    name: "city",
    label: "Cidade",
    placeholder: "Digite a cidade",
    type: "text",
    required: true,
  },
  {
    name: "state",
    label: "Estado",
    placeholder: "Digite o estado",
    type: "text",
    required: true,
  },
] as const;

function ChangeView({
  center,
}: {
  center: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 16);
  }, [center, map]);

  return null;
}

const emptyAddress = {
  name: "",
  email: "",
  zipCode: "",
  street: "",
  number: "",
  complemento: "",
  neighborhood: "",
  city: "",
  state: "",
};

const Address = () => {
  const {
    address,
    setAddress,
    selectedStore,
    deliveryMethod,
    setDeliveryMethod,
  } = useCheckout();

  const [savedAddress, setSavedAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [savedAddressId, setSavedAddressId] = useState<string | null>(null);

  const [position, setPosition] = useState<[number, number]>([
    -8.0476,
    -34.877,
  ]);

  const navigate = useNavigate();

  // =====================================================
  // BUSCAR ENDEREÇO NO OPENSTREETMAP
  // =====================================================

  const handleSearchLocation = async (addressValue: string) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        addressValue
      )}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar localização");
    }

    return response.json();
  };

  // =====================================================
  // ATUALIZAR POSIÇÃO DO MAPA
  // =====================================================

  const updateMapPosition = async (
    street: string,
    city: string,
    state: string
  ) => {
    if (!street || !city || !state) {
      return;
    }

    try {
      const fullAddress = `${street}, ${city}, ${state}`;

      const location = await handleSearchLocation(fullAddress);

      if (location.length > 0) {
        setPosition([
          Number(location[0].lat),
          Number(location[0].lon),
        ]);
      }
    } catch (error) {
      console.error("Erro ao localizar endereço:", error);
    }
  };

  // =====================================================
  // CARREGAR ENDEREÇO
  // =====================================================

  useEffect(() => {
    const loadSavedAddress = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // =================================================
        // USUÁRIO NÃO LOGADO
        // =================================================

        if (!session?.user) {
          console.log(
            "USUÁRIO NÃO LOGADO - FORMULÁRIO VAZIO"
          );

          // IMPORTANTE:
          // Não buscamos mais guest_address no localStorage.
          // Usuário convidado NÃO possui endereço salvo.

          setAddress(emptyAddress);
          setSavedAddress(false);
          setEditingAddress(false);
          setSavedAddressId(null);

          return;
        }

        // =================================================
        // USUÁRIO LOGADO
        // =================================================

        const user = session.user;

        console.log("USUÁRIO LOGADO:", user.id);

        const { data, error } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          })
          .limit(1);

        console.log("ENDEREÇO ENCONTRADO:", data);
        console.log("ERRO ADDRESS:", error);

        if (error) {
          console.error(
            "ERRO AO BUSCAR ENDEREÇO:",
            error
          );

          setAddress({
            ...emptyAddress,
            email: user.email || "",
          });

          setSavedAddress(false);
          setEditingAddress(false);
          setSavedAddressId(null);

          return;
        }

        // =================================================
        // ENDEREÇO ENCONTRADO
        // =================================================

        if (data && data.length > 0) {
          const saved = data[0];

          const loadedAddress = {
            name: saved.name || "",
            email: user.email || "",
            zipCode: saved.zip_code || "",
            street: saved.street || "",
            number: saved.number || "",
            complemento: saved.complement || "",
            neighborhood: saved.neighborhood || "",
            city: saved.city || "",
            state: saved.state || "",
          };

          console.log(
            "ENDEREÇO CARREGADO:",
            loadedAddress
          );

          setAddress(loadedAddress);

          setSavedAddressId(saved.id);
          setSavedAddress(true);
          setEditingAddress(false);

          await updateMapPosition(
            loadedAddress.street,
            loadedAddress.city,
            loadedAddress.state
          );

          return;
        }

        // =================================================
        // USUÁRIO LOGADO SEM ENDEREÇO
        // =================================================

        console.log(
          "USUÁRIO LOGADO SEM ENDEREÇO"
        );

        setAddress({
          ...emptyAddress,
          email: user.email || "",
        });

        setSavedAddress(false);
        setEditingAddress(false);
        setSavedAddressId(null);
      } catch (error) {
        console.error(
          "ERRO AO CARREGAR ENDEREÇO:",
          error
        );

        setAddress(emptyAddress);
        setSavedAddress(false);
        setEditingAddress(false);
        setSavedAddressId(null);
      }
    };

    loadSavedAddress();
  }, [setAddress]);

  // =====================================================
  // BUSCAR CEP
  // =====================================================

  const handleSearchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");

    const response = await fetch(
      `https://viacep.com.br/ws/${cleanCep}/json/`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar CEP");
    }

    return response.json();
  };

  const handleCep = async () => {
    const cleanCep = address.zipCode.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      return;
    }

    try {
      const data = await handleSearchCep(cleanCep);

      if (!data || data.erro) {
        alert("CEP não encontrado");
        return;
      }

      setAddress((prev) => ({
        ...prev,
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
      }));

      await updateMapPosition(
        data.logradouro,
        data.localidade,
        data.uf
      );
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível buscar o CEP."
      );
    }
  };

  // =====================================================
  // ALTERAR CAMPOS
  // =====================================================

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setAddress((prev) => ({
      ...prev,
      [name]:
        name === "zipCode"
          ? formatCep(value)
          : value,
    }));
  };

  // =====================================================
  // RETIRADA NA LOJA
  // =====================================================

  const handlePickupSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const name = address.name.trim();
    const email = address.email.trim();

    if (!name) {
      alert("Digite seu nome completo.");
      return;
    }

    if (!email) {
      alert("Digite seu e-mail.");
      return;
    }

    // Apenas mantém os dados no CheckoutContext.
    // NÃO salva no localStorage.

    setAddress((prev) => ({
      ...prev,
      name,
      email,
    }));

    console.log("DADOS DA RETIRADA:", {
      name,
      email,
      store: selectedStore,
    });

    navigate("/pagamento");
  };

  // =====================================================
  // SALVAR / ATUALIZAR ENDEREÇO
  // =====================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!address.name.trim()) {
      alert("Digite seu nome completo.");
      return;
    }

    if (!address.email.trim()) {
      alert("Digite seu e-mail.");
      return;
    }

    if (!address.zipCode.trim()) {
      alert("Digite seu CEP.");
      return;
    }

    if (!address.street.trim()) {
      alert("Digite sua rua.");
      return;
    }

    if (!address.number.trim()) {
      alert("Digite o número.");
      return;
    }

    if (!address.neighborhood.trim()) {
      alert("Digite seu bairro.");
      return;
    }

    if (!address.city.trim()) {
      alert("Digite sua cidade.");
      return;
    }

    if (!address.state.trim()) {
      alert("Digite seu estado.");
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // =================================================
      // USUÁRIO NÃO LOGADO
      // =================================================

      if (!session?.user) {
        console.log(
          "USUÁRIO CONVIDADO - NÃO SALVAR ENDEREÇO"
        );

        // Mantém apenas no CheckoutContext durante o checkout.
        setAddress((prev) => ({
          ...prev,
          name: prev.name.trim(),
          email: prev.email.trim(),
          zipCode: prev.zipCode.trim(),
          street: prev.street.trim(),
          number: prev.number.trim(),
          complemento: prev.complemento.trim(),
          neighborhood: prev.neighborhood.trim(),
          city: prev.city.trim(),
          state: prev.state.trim(),
        }));

        // IMPORTANTE:
        // NÃO usar localStorage aqui.
        // O endereço de convidado não será persistido.

        navigate("/pagamento");

        return;
      }

      // =================================================
      // USUÁRIO LOGADO
      // =================================================

      const user = session.user;

      const addressData = {
        user_id: user.id,
        name: address.name.trim(),
        street: address.street.trim(),
        number: address.number.trim(),
        neighborhood: address.neighborhood.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        zip_code: address.zipCode.trim(),
        complement: address.complemento.trim(),
        is_default: true,
      };

      console.log(
        "ENDEREÇO QUE SERÁ SALVO:",
        addressData
      );

      // =================================================
      // ATUALIZAR ENDEREÇO EXISTENTE
      // =================================================

      if (savedAddressId) {
        console.log(
          "ATUALIZANDO ENDEREÇO:",
          savedAddressId
        );

        const { error } = await supabase
          .from("addresses")
          .update(addressData)
          .eq("id", savedAddressId)
          .eq("user_id", user.id);

        if (error) {
          console.error(
            "ERRO AO ATUALIZAR:",
            error
          );

          alert(
            `Não foi possível atualizar o endereço: ${error.message}`
          );

          return;
        }

        console.log(
          "ENDEREÇO ATUALIZADO COM SUCESSO!"
        );

        setSavedAddress(true);
        setEditingAddress(false);

        navigate("/pagamento");

        return;
      }

      // =================================================
      // CRIAR PRIMEIRO ENDEREÇO
      // =================================================

      console.log(
        "CRIANDO PRIMEIRO ENDEREÇO"
      );

      const {
        data,
        error,
      } = await supabase
        .from("addresses")
        .insert(addressData)
        .select()
        .single();

      if (error) {
        console.error(
          "ERRO AO CRIAR ENDEREÇO:",
          error
        );

        alert(
          `Não foi possível salvar o endereço: ${error.message}`
        );

        return;
      }

      console.log(
        "ENDEREÇO CRIADO:",
        data
      );

      if (data) {
        setSavedAddressId(data.id);
      }

      setSavedAddress(true);
      setEditingAddress(false);

      navigate("/pagamento");
    } catch (error) {
      console.error(
        "ERRO AO SALVAR ENDEREÇO:",
        error
      );

      alert(
        "Não foi possível salvar o endereço."
      );
    }
  };



  const handleDelivery = () => {
    setDeliveryMethod("delivery");

  
    setAddress((prev) => ({
      ...emptyAddress,
      name: prev.name || "",
      email: prev.email || "",
    }));

    setSavedAddress(false);
    setEditingAddress(false);
    setSavedAddressId(null);
  };

  const handleContinuePayment = () => {
    if (!address.name.trim()) {
      alert("Digite seu nome.");
      return;
    }

    if (!address.email.trim()) {
      alert("Digite seu e-mail.");
      return;
    }

    navigate("/pagamento");
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <section className="address">

      {/* =================================================
          RETIRADA NA LOJA
      ================================================= */}

      {deliveryMethod === "pickup" ? (
        <div className="address-content">

          <div className="pickup-store">

            <h2>Retirada na loja</h2>

            {selectedStore ? (
              <>
                <div className="pickup-store__card">

                  <h3>
                    {selectedStore.name}
                  </h3>

                  <p>
                    {selectedStore.address}
                  </p>

                </div>

                <div className="pickup-store__info">

                  <p>
                    Para retirar seu pedido,
                    informe seu nome e e-mail.
                  </p>

                  <p>
                    Enviaremos a confirmação do
                    pedido para esse e-mail.
                  </p>

                </div>

                <form
                  className="address-form"
                  onSubmit={handlePickupSubmit}
                >

                  <h2>
                    Dados para retirada
                  </h2>

                  <div className="address-form__group">

                    <label htmlFor="pickup-name">
                      Nome completo
                    </label>

                    <input
                      id="pickup-name"
                      name="name"
                      type="text"
                      placeholder="Digite seu nome completo"
                      value={address.name}
                      onChange={handleChange}
                      autoComplete="name"
                      required
                    />

                  </div>

                  <div className="address-form__group">

                    <label htmlFor="pickup-email">
                      E-mail
                    </label>

                    <input
                      id="pickup-email"
                      name="email"
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={address.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />

                  </div>

                  <button
                    type="submit"
                    className="address-form__button"
                  >
                    Continuar para pagamento
                  </button>

                </form>

                <button
                  type="button"
                  className="pickup-store__delivery"
                  onClick={handleDelivery}
                >
                  Receber em casa
                </button>

              </>
            ) : (
              <p>
                Nenhuma loja foi selecionada.
              </p>
            )}

          </div>

        </div>
      ) : (
        <>
          {/* =================================================
              ENDEREÇO
          ================================================= */}

          <div className="address-content">

            {savedAddress && !editingAddress ? (

              <div className="saved-address">

                <h2>
                  Endereço de entrega
                </h2>

                <div className="saved-address__card">

                  <h3>
                    {address.name}
                  </h3>

                  <p>
                    {address.email}
                  </p>

                  <p>
                    {address.street},{" "}
                    {address.number}
                  </p>

                  {address.complemento && (
                    <p>
                      {address.complemento}
                    </p>
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

                <button
                  type="button"
                  className="address-form__button"
                  onClick={() =>
                    setEditingAddress(true)
                  }
                >
                  Alterar endereço
                </button>

                <button
                  type="button"
                  className="address-form__button"
                  onClick={handleContinuePayment}
                >
                  Continuar para pagamento
                </button>

              </div>

            ) : (

              <form
                className="address-form"
                onSubmit={handleSubmit}
              >

                <h2>
                  Endereço de entrega
                </h2>

                {fields.map((field) => (

                  <div
                    className="address-form__group"
                    key={field.name}
                  >

                    <label htmlFor={field.name}>
                      {field.label}
                    </label>

                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={address[field.name]}
                      onChange={handleChange}
                      required={field.required}
                      autoComplete={
                        field.name === "email"
                          ? "email"
                          : field.name === "name"
                          ? "name"
                          : "off"
                      }
                      onBlur={
                        field.name === "zipCode"
                          ? handleCep
                          : undefined
                      }
                    />

                  </div>

                ))}

                <button
                  className="address-form__button"
                  type="submit"
                >
                  Salvar endereço e continuar
                </button>

              </form>

            )}

          </div>

        
          <div className="address-map">

            <MapContainer
              center={position}
              zoom={16}
              scrollWheelZoom={false}
              style={{
                width: "100%",
                height: "100%",
              }}
            >

              <ChangeView
                center={position}
              />

              <TileLayer
                attribution="© OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={position}>

                <Popup>
                  Local da entrega
                </Popup>

              </Marker>

            </MapContainer>

          </div>

        </>
      )}

    </section>
  );
};

export default Address;
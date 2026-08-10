
import "./Address.scss";
import { useState, useEffect } from "react";
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

  map.setView(center, 16);

  return null;
}

const Address = () => {
  const { address, setAddress } = useCheckout();

  const [savedAddress, setSavedAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  const [position, setPosition] = useState<[number, number]>([
    -23.5505,
    -46.6333,
  ]);

  const navigate = useNavigate();

  useEffect(() => {
  const loadSavedAddress = async () => {

    /*
     * ==========================================
     * 1. PRIMEIRO: VERIFICAR ENDEREÇO DE VISITANTE
     * ==========================================
     */

    const savedGuestAddress =
      localStorage.getItem("guest_address");

    if (savedGuestAddress) {
      try {
        const parsedAddress =
          JSON.parse(savedGuestAddress);

        console.log(
          "ENDEREÇO DO VISITANTE:",
          parsedAddress
        );

        setAddress(parsedAddress);
        setSavedAddress(true);

        return;
      } catch (error) {
        console.error(
          "Erro ao carregar endereço do visitante:",
          error
        );

        localStorage.removeItem(
          "guest_address"
        );
      }
    }

    /*
     * ==========================================
     * 2. VERIFICAR USUÁRIO LOGADO
     * ==========================================
     */

    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log(
      "SESSION:",
      session
    );

    /*
     * Se não estiver logado e também
     * não tiver guest_address,
     * simplesmente deixa o formulário.
     */

    if (!session) {
      console.log(
        "Usuário não logado."
      );

      return;
    }

    /*
     * ==========================================
     * 3. BUSCAR ENDEREÇO DO USUÁRIO
     * ==========================================
     */

    const user = session.user;

    console.log(
      "USER ID:",
      user.id
    );

    const {
      data,
      error,
    } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .maybeSingle();

    console.log(
      "ADDRESS DATA:",
      data
    );

    console.log(
      "ADDRESS ERROR:",
      error
    );

    if (error) {
      console.error(
        "Erro ao buscar endereço:",
        error
      );

      return;
    }

    /*
     * Usuário logado, mas ainda não
     * possui endereço.
     */

    if (!data) {
      console.log(
        "Nenhum endereço padrão encontrado."
      );

      return;
    }

    /*
     * ==========================================
     * 4. COLOCAR ENDEREÇO NO CHECKOUT CONTEXT
     * ==========================================
     */

    setAddress({
      name: data.name || "",
      email: user.email || "",
      zipCode: data.zip_code || "",
      street: data.street || "",
      number: data.number || "",
      complemento: data.complement || "",
      neighborhood: data.neighborhood || "",
      city: data.city || "",
      state: data.state || "",
    });

    setSavedAddress(true);
  };

  loadSavedAddress();

}, [setAddress]);
  // Busca informações do CEP
  const handleSearchCep = async (cep: string) => {
    try {
      const cleanCep = cep.replace(/\D/g, "");

      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar CEP");
      }

      return await response.json();
    } catch (error) {
      console.error(error);
      throw new Error("Algo de errado aconteceu");
    }
  };

  // Busca localização no mapa
  const handleSearchLocation = async (address: string) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );

    return await response.json();
  };

  // Quando o usuário informa o CEP
  const handleCep = async () => {
    const cleanCep = address.zipCode.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      return;
    }

    const data = await handleSearchCep(cleanCep);

    if (!data || data.erro) {
      alert("CEP não encontrado");
      return;
    }

    setAddress((prev) => ({
      ...prev,
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    }));

    const fullAddress = `${data.logradouro}, ${data.localidade}, ${data.uf}`;

    const location = await handleSearchLocation(fullAddress);

    if (location.length > 0) {
      setPosition([
        Number(location[0].lat),
        Number(location[0].lon),
      ]);
    }
  };

  // Atualiza os campos do formulário
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

  // Salva o endereço
  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("Usuário sem sessão");
      return;
    }

    const user = session.user;

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        name: address.name,
        street: address.street,
        number: address.number,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zip_code: address.zipCode,
        complement: address.complemento,
        is_default: true,
      })
      .select();

    console.log("INSERT DATA:", data);
    console.log("INSERT ERROR:", error);

    if (error) {
      console.error(
        "ERROR OBJECT:",
        JSON.stringify(error, null, 2)
      );

      alert(error.message);
      return;
    }

    setSavedAddress(true);
    setEditingAddress(false);

    navigate("/pagamento");
  };

  return (
    <section className="address">
      <div className="address-content">
        {savedAddress && !editingAddress ? (
          <>
            <div className="saved-address">
              <h2>Endereço de entrega</h2>

              <div className="saved-address__card">
                <h3>{address.name}</h3>

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

                <p>
                  CEP: {address.zipCode}
                </p>
              </div>

              <button
                type="button"
                className="address-form__button"
                onClick={() => setEditingAddress(true)}
              >
                Alterar endereço
              </button>

              <button
                type="button"
                className="address-form__button"
                onClick={() => navigate("/pagamento")}
              >
                Continuar para pagamento
              </button>
            </div>
          </>
        ) : (
          <form
            className="address-form"
            onSubmit={handleSubmit}
          >
            <h2>Endereço de entrega</h2>

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
          <ChangeView center={position} />

          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position}>
            <Popup>Local da entrega</Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
};

export default Address;



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
  const { address, setAddress } = useCheckout();

  const [savedAddress, setSavedAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  // ID do endereço salvo no banco
  const [savedAddressId, setSavedAddressId] = useState<string | null>(
    null
  );

  const [position, setPosition] = useState<[number, number]>([
    -23.5505,
    -46.6333,
  ]);

  const navigate = useNavigate();

  /*
  ============================================================
  BUSCAR LOCALIZAÇÃO NO MAPA
  ============================================================
  */

  const handleSearchLocation = async (address: string) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar localização");
    }

    return await response.json();
  };

  /*
  ============================================================
  CARREGAR ENDEREÇO
  ============================================================
  */

  useEffect(() => {
    const loadSavedAddress = async () => {
      try {
        /*
        ========================================================
        1. VERIFICAR SESSÃO
        ========================================================
        */

        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("SESSION:", session);

        /*
        ========================================================
        2. USUÁRIO LOGADO
        ========================================================
        */

        if (session?.user) {
          const user = session.user;

          console.log("USUÁRIO LOGADO:", user.id);

          /*
          ------------------------------------------------------
          BUSCAR SOMENTE O ENDEREÇO DESSE USUÁRIO
          ------------------------------------------------------
          */

          const { data, error } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", {
              ascending: false,
            })
            .limit(1)
            .maybeSingle();

          console.log("ENDEREÇO DO BANCO:", data);
          console.log("ERRO DO BANCO:", error);

          if (error) {
            console.error(
              "Erro ao buscar endereço:",
              error
            );

            // Limpa endereço antigo do CheckoutContext
            setAddress({
              ...emptyAddress,
              email: user.email || "",
            });

            setSavedAddress(false);
            setEditingAddress(false);
            setSavedAddressId(null);

            return;
          }

          /*
          ======================================================
          USUÁRIO TEM ENDEREÇO
          ======================================================
          */

          if (data) {
            console.log(
              "Endereço encontrado para o usuário."
            );

            setSavedAddressId(data.id);

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
            setEditingAddress(false);

            /*
            ------------------------------------------------------
            Atualizar mapa
            ------------------------------------------------------
            */

            const fullAddress = `
              ${data.street},
              ${data.city},
              ${data.state}
            `;

            try {
              const location =
                await handleSearchLocation(fullAddress);

              if (location.length > 0) {
                setPosition([
                  Number(location[0].lat),
                  Number(location[0].lon),
                ]);
              }
            } catch (error) {
              console.error(
                "Erro ao localizar endereço:",
                error
              );
            }

            return;
          }

          /*
          ======================================================
          USUÁRIO LOGADO, MAS SEM ENDEREÇO
          ======================================================
          */

          console.log(
            "Usuário logado, mas não possui endereço."
          );

          /*
          IMPORTANTE:
          Limpa qualquer endereço antigo que possa estar
          dentro do CheckoutContext.
          */

          setAddress({
            ...emptyAddress,
            email: user.email || "",
          });

          setSavedAddress(false);
          setEditingAddress(false);
          setSavedAddressId(null);

          return;
        }

        /*
        ========================================================
        3. USUÁRIO NÃO LOGADO
        ========================================================
        */

        console.log(
          "Usuário não está logado."
        );

        /*
        --------------------------------------------------------
        Procurar endereço do visitante.
        --------------------------------------------------------
        */

        const savedGuestAddress =
          localStorage.getItem("guest_address");

        /*
        ========================================================
        VISITANTE TEM ENDEREÇO SALVO
        ========================================================
        */

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
            setEditingAddress(false);
            setSavedAddressId(null);

            /*
            ----------------------------------------------------
            Atualizar mapa
            ----------------------------------------------------
            */

            const fullAddress = `
              ${parsedAddress.street},
              ${parsedAddress.city},
              ${parsedAddress.state}
            `;

            try {
              const location =
                await handleSearchLocation(fullAddress);

              if (location.length > 0) {
                setPosition([
                  Number(location[0].lat),
                  Number(location[0].lon),
                ]);
              }
            } catch (error) {
              console.error(
                "Erro ao localizar endereço:",
                error
              );
            }

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
        ========================================================
        VISITANTE SEM ENDEREÇO
        ========================================================
        */

        console.log(
          "Visitante não possui endereço salvo."
        );

        /*
        IMPORTANTE:
        Aqui estava faltando limpar o address do Context.
        */

        setAddress({
          ...emptyAddress,
        });

        setSavedAddress(false);
        setEditingAddress(false);
        setSavedAddressId(null);
      } catch (error) {
        console.error(
          "Erro ao carregar endereço:",
          error
        );

        /*
        Limpa endereço antigo em caso de erro.
        */

        setAddress({
          ...emptyAddress,
        });

        setSavedAddress(false);
        setEditingAddress(false);
        setSavedAddressId(null);
      }
    };

    loadSavedAddress();
  }, [setAddress]);

  /*
  ============================================================
  BUSCAR CEP
  ============================================================
  */

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

      throw new Error(
        "Algo de errado aconteceu"
      );
    }
  };

  /*
  ============================================================
  QUANDO O USUÁRIO INFORMA O CEP
  ============================================================
  */

  const handleCep = async () => {
    const cleanCep = address.zipCode.replace(
      /\D/g,
      ""
    );

    if (cleanCep.length !== 8) {
      return;
    }

    try {
      const data =
        await handleSearchCep(cleanCep);

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

      const fullAddress = `${data.logradouro}, ${data.localidade}, ${data.uf}`;

      try {
        const location =
          await handleSearchLocation(fullAddress);

        if (location.length > 0) {
          setPosition([
            Number(location[0].lat),
            Number(location[0].lon),
          ]);
        }
      } catch (error) {
        console.error(
          "Erro ao buscar localização:",
          error
        );
      }
    } catch (error) {
      console.error(
        "Erro ao buscar CEP:",
        error
      );

      alert(
        "Não foi possível buscar o CEP."
      );
    }
  };

  /*
  ============================================================
  ALTERAR CAMPOS
  ============================================================
  */

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

  /*
  ============================================================
  SALVAR / ATUALIZAR ENDEREÇO
  ============================================================
  */

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    try {
      /*
      ========================================================
      VERIFICAR USUÁRIO
      ========================================================
      */

      const {
        data: { session },
      } = await supabase.auth.getSession();

      /*
      ========================================================
      VISITANTE
      ========================================================
      */

      if (!session?.user) {
        console.log(
          "Salvando endereço de visitante..."
        );

        /*
        ------------------------------------------------------
        O visitante salva o endereço no navegador.
        ------------------------------------------------------
        */

        localStorage.setItem(
          "guest_address",
          JSON.stringify(address)
        );

        setSavedAddress(true);
        setEditingAddress(false);

        navigate("/pagamento");

        return;
      }

      /*
      ========================================================
      USUÁRIO LOGADO
      ========================================================
      */

      const user = session.user;

      console.log(
        "Salvando endereço para:",
        user.id
      );

      const addressData = {
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
      };

      /*
      ========================================================
      ATUALIZAR ENDEREÇO EXISTENTE
      ========================================================
      */

      if (savedAddressId) {
        console.log(
          "Atualizando endereço:",
          savedAddressId
        );

        const {
          data,
          error,
        } = await supabase
          .from("addresses")
          .update(addressData)
          .eq("id", savedAddressId)
          .eq("user_id", user.id)
          .select()
          .single();

        console.log(
          "UPDATE DATA:",
          data
        );

        console.log(
          "UPDATE ERROR:",
          error
        );

        if (error) {
          console.error(
            "Erro ao atualizar endereço:",
            error
          );

          alert(error.message);
          return;
        }

        if (!data) {
          alert(
            "Não foi possível encontrar o endereço."
          );
          return;
        }

        /*
        ------------------------------------------------------
        Atualiza o estado com os dados salvos.
        ------------------------------------------------------
        */

        setSavedAddressId(data.id);

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
        setEditingAddress(false);

        navigate("/pagamento");

        return;
      }

      /*
      ========================================================
      CRIAR PRIMEIRO ENDEREÇO
      ========================================================
      */

      console.log(
        "Criando primeiro endereço..."
      );

      const {
        data,
        error,
      } = await supabase
        .from("addresses")
        .insert(addressData)
        .select()
        .single();

      console.log(
        "INSERT DATA:",
        data
      );

      console.log(
        "INSERT ERROR:",
        error
      );

      if (error) {
        console.error(
          "Erro ao salvar endereço:",
          error
        );

        alert(error.message);
        return;
      }

      /*
      ========================================================
      GUARDAR ID DO ENDEREÇO
      ========================================================
      */

      if (data) {
        setSavedAddressId(data.id);
      }

      setSavedAddress(true);
      setEditingAddress(false);

      navigate("/pagamento");
    } catch (error) {
      console.error(
        "Erro ao salvar endereço:",
        error
      );

      alert(
        "Não foi possível salvar o endereço."
      );
    }
  };

  /*
  ============================================================
  JSX
  ============================================================
  */

  return (
    <section className="address">

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
              onClick={() => {
                setEditingAddress(true);
              }}
            >
              Alterar endereço
            </button>

            <button
              type="button"
              className="address-form__button"
              onClick={() =>
                navigate("/pagamento")
              }
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

                <label
                  htmlFor={field.name}
                >
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

          <ChangeView
            center={position}
          />

          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={position}
          >
            <Popup>
              Local da entrega
            </Popup>
          </Marker>

        </MapContainer>

      </div>

    </section>
  );
};

export default Address;


import "./Address.scss";
import { useState } from "react";
import { formatCep } from "../../modals/CepModal/CepModalUtils";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom"; 
import { useCheckout } from "../../context/CheckoutContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
interface AddressData {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complemento:string;
}
const fields = [
  {
    name: "zipCode",
    label: "CEP",
    placeholder: "Digite o CEP",
    type: "text",
    required:true
  },
  {
    name: "street",
    label: "Rua",
    placeholder: "Digite a rua",
    type: "text",
    required:true
  },
  {
    name: "number",
    label: "Número",
    placeholder: "Digite o número",
    type: "text",
    required:true
  },
  {
    name: "complemento",
    label: "complemento",
    placeholder: "Apartamento, bloco... (opcional)",
    type: "text",
    required:false
  },
  {
    name: "neighborhood",
    label: "Bairro",
    placeholder: "Digite o bairro",
    type: "text",
    required:true
  },
  {
    name: "city",
    label: "Cidade",
    placeholder: "Digite a cidade",
    type: "text",
    required:true
  },
  {
    name: "state",
    label: "Estado",
    placeholder: "Digite o estado",
    type: "text",
    required:true
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

 const {address, setAddress} = useCheckout()
 
  const [position, setPosition] = useState<[number, number]>([
    -23.5505,
    -46.6333,
  ]);
  const navigate = useNavigate();
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
       throw new Error('Algo error aconteceu')
    }
  };
  const handleSearchLocation = async (address: string) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    return await response.json();
  };

  const handleCep = async () => {
    const cleanCep = address.zipCode.replace(/\D/g, "");

    if (cleanCep.length !== 8) return;

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

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

     navigate("/pagamento");

  };
  return (
    <section className="address">
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
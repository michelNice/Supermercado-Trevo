export interface TrevoAddress {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export const trevoAddress: TrevoAddress[] = [
  {
    id: 1,
    name: "Trevo - Boa Viagem",
    address: "Rua Barão de Souza Leão, 1170 — Boa Viagem, Recife - PE",
    latitude: -8.13261,
    longitude: -34.9101,
  },
  {
    id: 2,
    name: "Trevo - Cohab",
    address:
      "Rua Dr. Otávio de Moraes Vasconcelos, 39 — Cohab, Recife - PE",
    latitude: -8.1332539,
    longitude: -34.948851,
  },
  {
    id: 3,
    name: "Trevo - Domingos Ferreira",
    address:
      "Av. Engenheiro Domingos Ferreira, 1990 — Boa Viagem, Recife - PE",
    latitude: -8.13073,
    longitude: -34.90278,
  },
  {
    id: 4,
    name: "Trevo - Setúbal",
    address:
      "Rua Dr. Luiz Inácio Pessoa de Melo, 342 — Boa Viagem, Recife - PE",
    latitude: -8.1396495,
    longitude: -34.9069506,
  },
  {
    id: 5,
    name: "Trevo - Ibura",
    address:
      "Rua Dr. Otávio de Moraes Vasconcelos, 39 — UR-5, Ibura, Recife - PE",
    latitude: -8.1332539,
    longitude: -34.948851,
  },
];

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const EARTH_RADIUS_KM = 6371;

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(radLat1) *
      Math.cos(radLat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

export function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalização não é suportada pelo navegador."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export async function getAddressByCep(cep: string) {
  const cleanCep = cep.replace(/\D/g, "");

  if (cleanCep.length !== 8) {
    throw new Error("CEP inválido. O CEP deve conter 8 dígitos.");
  }

  const response = await fetch(
    `https://viacep.com.br/ws/${cleanCep}/json/`
  );

  if (!response.ok) {
    throw new Error("Erro ao consultar o CEP.");
  }

  const data = await response.json();

  if (data.erro) {
    throw new Error("CEP não encontrado.");
  }

  return data;
}

export async function getCoordinatesFromAddress(
  logradouro: string,
  localidade: string,
  uf: string
) {
  const query = encodeURIComponent(
    `${logradouro}, ${localidade} - ${uf}, Brasil`
  );

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "MinhaAplicacaoTrevo/1.0",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar as coordenadas.");
  }

  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error(
      "Não foi possível obter as coordenadas para este endereço."
    );
  }

  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
  };
}

export async function getNearestStoreByCep(cep: string) {
  const addressInfo = await getAddressByCep(cep);

  const userCoords = await getCoordinatesFromAddress(
    addressInfo.logradouro,
    addressInfo.localidade,
    addressInfo.uf
  );

  const storesWithDistance = trevoAddress.map((store) => {
    const distanceKm = calculateHaversineDistance(
      userCoords.latitude,
      userCoords.longitude,
      store.latitude,
      store.longitude
    );

    return {
      ...store,
      distanceKm: Number(distanceKm.toFixed(2)),
    };
  });

  storesWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

  return {
    userAddress: addressInfo,
    userCoordinates: userCoords,
    nearestStore: storesWithDistance[0],
    allStoresSorted: storesWithDistance,
  };
}


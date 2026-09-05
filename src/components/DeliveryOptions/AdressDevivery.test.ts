import { describe, test, expect, jest } from "@jest/globals";

import {
trevoAddress,
calculateHaversineDistance,
getAddressByCep,
getCoordinatesFromAddress,
getNearestStoreByCep,
} from "./AdressDelivery";

global.fetch = jest.fn() as any;

describe("Trevo Address", () => {
describe("trevoAddress", () => {
test("deve possuir as lojas cadastradas", () => {
expect(trevoAddress.length).toBeGreaterThan(0);
});


test("todas as lojas devem possuir nome", () => {
  trevoAddress.forEach((store) => {
    expect(store.name).toBeTruthy();
  });
});

test("todas as lojas devem possuir endereço", () => {
  trevoAddress.forEach((store) => {
    expect(store.address).toBeTruthy();
  });
});


});

describe("calculateHaversineDistance", () => {
test("deve retornar 0 quando os dois pontos são iguais", () => {
const distance = calculateHaversineDistance(
-8.0476,
-34.8770,
-8.0476,
-34.8770
);


  expect(distance).toBe(0);
});

test("deve retornar um número", () => {
  const distance = calculateHaversineDistance(
    -8.0476,
    -34.8770,
    -8.0576,
    -34.8770
  );

  expect(typeof distance).toBe("number");
});

test("deve retornar uma distância maior que zero para pontos diferentes", () => {
  const distance = calculateHaversineDistance(
    -8.0476,
    -34.8770,
    -8.0576,
    -34.8770
  );

  expect(distance).toBeGreaterThan(0);
});


});

describe("getAddressByCep", () => {
test("deve retornar o endereço quando o CEP é válido", async () => {
(fetch as any).mockResolvedValueOnce({
ok: true,
json: async () => ({
cep: "51020-000",
logradouro: "Rua Barão de Souza Leão",
bairro: "Boa Viagem",
localidade: "Recife",
uf: "PE",
}),
});


  const address = await getAddressByCep("51020-000");

  expect(address).toBeDefined();
  expect(address.cep).toBe("51020-000");
});


});

describe("getCoordinatesFromAddress", () => {
test("deve retornar latitude e longitude do endereço", async () => {
(fetch as any).mockResolvedValueOnce({
ok: true,
json: async () => [
{
lat: "-8.1167",
lon: "-34.9000",
},
],
});


  const coordinates = await getCoordinatesFromAddress(
    "Rua Barão de Souza Leão",
    "Recife",
    "PE"
  );

  expect(coordinates).toBeDefined();
  expect(typeof coordinates.latitude).toBe("number");
  expect(typeof coordinates.longitude).toBe("number");
});


});

describe("getNearestStoreByCep", () => {
test("deve retornar a loja mais próxima para um CEP válido", async () => {
(fetch as any)
.mockResolvedValueOnce({
ok: true,
json: async () => ({
cep: "51020-000",
logradouro: "Rua Barão de Souza Leão",
bairro: "Boa Viagem",
localidade: "Recife",
uf: "PE",
}),
})
.mockResolvedValueOnce({
ok: true,
json: async () => [
{
lat: "-8.1167",
lon: "-34.9000",
},
],
});


  const result = await getNearestStoreByCep("51020-000");

  expect(result).toBeDefined();
  expect(result.userCoordinates).toBeDefined();
  expect(result.nearestStore).toBeDefined();

  expect(result.nearestStore?.name).toBeTruthy();
  expect(result.nearestStore?.address).toBeTruthy();
  expect(result.nearestStore?.distanceKm).toBeGreaterThanOrEqual(0);
});


});
});

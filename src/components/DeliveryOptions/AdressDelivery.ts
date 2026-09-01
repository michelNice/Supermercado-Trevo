export interface TrevoAddress {
  id: number;
  name: string;
  address: string;
  latitude:number,
  logitude:number
}
export const trevoAddress: TrevoAddress[] = [
  { 
     id: 1,
     name: "Trevo - Boa Viagem",
     address: "Rua Barão de Souza Leão, 1170 — Boa Viagem, Recife - PE" ,
     latitude:-8.13261,
     logitude:-34.91010
    },

  { id: 2, 
    name: "Trevo - Cohab", 
    address: "Rua Dr. Otávio de Moraes Vasconcelos, 39 — Cohab, Recife - PE" ,
    latitude:-8.1332539,
    logitude:-34.948851
  },
  { id: 3,
     name: "Trevo - Domingos Ferreira", 
     address: "Av. Engenheiro Domingos Ferreira, 1990 — Boa Viagem, Recife - PE" ,
     latitude:-8.13073,
     logitude:-34.90278
    },
  { 
    id: 4, 
    name: "Trevo - Setúbal",
    address: "Rua Dr. Luiz Inácio Pessoa de Melo, 342 — Boa Viagem, Recife - PE" ,
    latitude:-8.1396495,
    logitude:-34.9069506
    },
  { id: 5, 
    name: "Trevo - Ibura",
    address: "Rua Dr. Otávio de Moraes Vasconcelos, 39 — UR-5, Ibura, Recife - PE" ,
    latitude:-8.1332539,
    logitude:-34.948851
  
  }
];





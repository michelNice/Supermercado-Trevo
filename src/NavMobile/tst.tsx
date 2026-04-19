import { Underline } from "lucide-react";
import { useState } from "react";

interface Pedido {
  id: number;
  produto: string;
  quantidade: number;
  status: "pendente" | "entregue" | "cancelado";
}
///const [menuOpen,setMenuOpen] = useState<boolean>(false)

const PainelPedidos:React.FC = ()=> {
  const [pedidoAtivo, setPedidoAtivo] = useState<null | Pedido>(null);   // ← corrigir
  const [historico, setHistorico] =  useState<Pedido[]>([]);          // ← corrigir
  const [pagina, setPagina] = useState(1);                 
  const [filtro, setFiltro] = useState("todos");          

  return (
    <>
       
    </>
  )
}
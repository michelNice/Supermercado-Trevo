import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/useCart";

import { supabase } from "../../services/Supabase/supabaseClient";
import './UserAccount.scss'
import { useState ,useEffect} from "react";
function UserAccount() {
    const [savedAddress,setSaveAddress] = useState<any>(null)
    const { user } = useAuth();
    const { cartItem } = useCart();
    if (!user) {
        return <p>Você precisa fazer login.</p>;
    }
    useEffect(()=> {
        async function loadAddress(){
        
            if(!user)return
            console.log("ID DO USUARIO LOGADO:", user.id);
            // TESTE 1: Ver qual usuário está logado
        console.log("USUARIO LOGADO:", user);

        // TESTE 2: Ver somente o ID
        console.log("ID DO USUARIO:", user.id);

            const {data,error} = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id);

            if(error){
                return 
            }
            setSaveAddress(data)
        }
        loadAddress()
    },[user])
    return (
        <div className="account">

            <section className="account__profile">
                <h2>Minha Conta</h2>

                <p>
                    <strong>Nome:</strong>{" "}
                    {user.user_metadata?.full_name || "Cliente"}
                </p>

                <p>
                    <strong>Email:</strong>{" "}
                    {user?.email}
                </p>
            </section>
            <section className="account__cart">

                <h2>Produtos no carrinho</h2>

                {cartItem.length === 0 ? (
                    <p>Nenhum produto no carrinho.</p>
                ) : (
                    cartItem.map((item) => (
                        <div 
                            key={item.id}
                            className="account__product"
                        >
                            <p>
                                <strong>
                                    Produto:
                                </strong>{" "}
                                {item.name}
                            </p>

                            <p>
                                <strong>
                                    Quantidade:
                                </strong>{" "}
                                {item.quantity}
                            </p>

                            <p>
                                <strong>
                                    Preço:
                                </strong>{" "}
                                R$ {Number(item.price).toFixed(2)}
                            </p>
                        </div>
                    ))
                )}
            </section>
            <section className="account__address">
                <h2>Meu Endereço</h2>
                {savedAddress ?  (
                    <div>
                        <p>
                            <strong>
                                Nome:
                            </strong>{" "}
                            {savedAddress?.name || "Não informado"}
                        </p>
                        <p>
                            <strong>
                                Rua:
                            </strong>{" "}
                            {savedAddress?.street || "Não informado"}
                            {savedAddress?.number && `, ${savedAddress?.number}`}
                        </p>
                        <p>
                            <strong>
                                Bairro:
                            </strong>{" "}
                            {savedAddress?.neighborhood || "Não informado"}
                        </p>

                        <p>
                            <strong>
                                Cidade:
                            </strong>{" "}
                            {savedAddress?.city || "Não informado"}
                        </p>


                        <p>
                            <strong>
                                Estado:
                            </strong>{" "}
                            {savedAddress?.state || "Não informado"}
                        </p>


                        <p>
                            <strong>
                                CEP:
                            </strong>{" "}
                            {savedAddress?.zip_code || "Não informado"}
                        </p>


              {savedAddress?.complement && (
                    <p>
                        <strong>Complemento:</strong>{" "}
                        {savedAddress.complement}
                    </p>
                )}

                    </div>

                ) : (

                    <p>
                        Nenhum endereço cadastrado.
                    </p>

                )}

            </section>


        </div>
    );
}

export default UserAccount;
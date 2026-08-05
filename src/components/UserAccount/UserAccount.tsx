import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/useCart";
import { supabase } from "../../services/Supabase/supabaseClient";

import { useEffect, useState } from "react";
import "./UserAccount.scss";


interface Address {
    id: string;
    user_id: string;
    name: string;
    street: string;
    number?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
    complement?: string;
}
function UserAccount() {

    const { user } = useAuth();
    const { cartItem } = useCart();

    const [address, setAddress] = useState<Address | null>(null);



    useEffect(() => {

    async function loadAddress() {

        if (!user) return;


        const { data: session } = await supabase.auth.getSession();

console.log("SESSION:", session.session);
console.log("TOKEN:", session.session?.access_token);


        console.log("USER ID:", user.id);


       const { data, error } = await supabase
  .from("addresses")
  .select("*").eq("user_id", user.id)




        console.log("DATA ADDRESS:", data);
        console.log("ERROR ADDRESS:", error);

        console.log(user);
console.log(user.id);
console.log(user.email);



        if (error) {
            return;
        }


        setAddress(data[0] || null);

    }


    loadAddress();


}, [user]);



    if (!user) {

        return (
            <p>
                Você precisa fazer login.
            </p>
        );

    }





    return (

        <div className="account">


            <section className="account__profile">

                <h2>
                    Minha Conta
                </h2>


                <p>
                    <strong>
                        Nome:
                    </strong>{" "}

                    {
                        user.user_metadata?.full_name ||
                        "Cliente"
                    }

                </p>


                <p>
                    <strong>
                        Email:
                    </strong>{" "}

                    {user.email}

                </p>


            </section>





            <section className="account__cart">


                <h2>
                    Produtos no carrinho
                </h2>



                {
                    cartItem.length === 0 ? (

                        <p>
                            Nenhum produto no carrinho.
                        </p>


                    ) : (


                        cartItem.map((item)=>(

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

                    )
                }


            </section>







            <section className="account__address">


                <h2>
                    Meu Endereço
                </h2>



                {
                    address ? (

                        <div>


                            <p>
                                <strong>
                                    Nome:
                                </strong>{" "}

                                {address.name}
                            </p>



                            <p>
                                <strong>
                                    Rua:
                                </strong>{" "}

                                {address.street}

                                {
                                    address.number &&
                                    `, ${address.number}`
                                }

                            </p>




                            <p>
                                <strong>
                                    Bairro:
                                </strong>{" "}

                                {address.neighborhood}

                            </p>




                            <p>
                                <strong>
                                    Cidade:
                                </strong>{" "}

                                {address.city}

                            </p>




                            <p>
                                <strong>
                                    Estado:
                                </strong>{" "}

                                {address.state}

                            </p>




                            <p>
                                <strong>
                                    CEP:
                                </strong>{" "}

                                {address.zip_code}

                            </p>





                            {
                                address.complement && (

                                    <p>
                                        <strong>
                                            Complemento:
                                        </strong>{" "}

                                        {address.complement}

                                    </p>

                                )
                            }



                        </div>


                    ) : (


                        <p>
                            Nenhum endereço cadastrado.
                        </p>


                    )
                }



            </section>



        </div>

    );
}


export default UserAccount;
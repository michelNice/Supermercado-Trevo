import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/useCart";
import { useCheckout } from "../../context/CheckoutContext";

function UserAccount() {
    const { user } = useAuth();
    const { cartItem } = useCart();
    const { address } = useCheckout();

    if (!user) {
        return <p>Você precisa fazer login.</p>;
    }

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
                    {user.email}
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


                {address ? (
                    <div>

                        <p>
                            <strong>
                                Nome:
                            </strong>{" "}
                            {address.name || "Não informado"}
                        </p>


                        <p>
                            <strong>
                                Rua:
                            </strong>{" "}
                            {address.street || "Não informado"}
                            {address.number && `, ${address.number}`}
                        </p>


                        <p>
                            <strong>
                                Bairro:
                            </strong>{" "}
                            {address.neighborhood || "Não informado"}
                        </p>


                        <p>
                            <strong>
                                Cidade:
                            </strong>{" "}
                            {address.city || "Não informado"}
                        </p>


                        <p>
                            <strong>
                                Estado:
                            </strong>{" "}
                            {address.state || "Não informado"}
                        </p>


                        <p>
                            <strong>
                                CEP:
                            </strong>{" "}
                            {address.zipCode || "Não informado"}
                        </p>


                        {address.complemento && (
                            <p>
                                <strong>
                                    Complemento:
                                </strong>{" "}
                                {address.complemento}
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
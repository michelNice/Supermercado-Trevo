import {
    useState,
    createContext,
    useMemo,
    useEffect,
    useContext,
} from "react";

import type { ReactNode } from "react";

import { useAuth } from "./useAuth";
import { supabase } from "../services/Supabase/supabaseClient";

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    unit: "UN" | "KG";
}

interface CartItem extends Product {
    quantity: number;
}

export interface CartContextType {
    cartItem: CartItem[];
    AddToCart: (product: Product) => Promise<void>;
    removeFromCart: (id: string) => Promise<void>;
    decreaseQuantity: (id: string) => Promise<void>;
    increaseQuantity: (id: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartTotal: number;
}

export const CartContext = createContext<
    CartContextType | undefined
>(undefined);

const CartProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { user } = useAuth();

    /*
     * ==========================================
     * 1. CARRINHO INICIAL
     * ==========================================
     *
     * Para visitante:
     * carregamos o carrinho do localStorage.
     *
     * Para usuário logado:
     * o carrinho será carregado do Supabase
     * pelo useEffect abaixo.
     */

    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const savedCart = localStorage.getItem("guest_cart");

            if (!savedCart) {
                return [];
            }

            return JSON.parse(savedCart);
        } catch (error) {
            console.error(
                "Erro ao carregar carrinho do localStorage:",
                error
            );

            return [];
        }
    });

    /*
     * ==========================================
     * 2. SALVAR CARRINHO DO VISITANTE
     * ==========================================
     *
     * Somente salva no localStorage quando
     * NÃO existe usuário logado.
     */

    useEffect(() => {
        if (!user) {
            localStorage.setItem(
                "guest_cart",
                JSON.stringify(cartItems)
            );
        }
    }, [cartItems, user]);

    /*
     * ==========================================
     * 3. CARREGAR CARRINHO DO SUPABASE
     * ==========================================
     */

    useEffect(() => {
        const loadCart = async () => {
            /*
             * Se não existe usuário,
             * não buscamos carrinho no banco.
             */

            if (!user) {
                return;
            }

            console.log(
                "CARREGANDO CARRINHO DO USUÁRIO:",
                user.id
            );

            /*
             * Buscar itens do carrinho
             */

            const {
                data: cartData,
                error: cartError,
            } = await supabase
                .from("cart_items")
                .select("product_id, quantity")
                .eq("user_id", user.id);

            if (cartError) {
                console.error(
                    "ERRO AO CARREGAR CARRINHO:",
                    cartError
                );

                return;
            }

            console.log(
                "CARRINHO DO BANCO:",
                cartData
            );

            /*
             * Se o usuário não possui
             * produtos no carrinho.
             */

            if (!cartData || cartData.length === 0) {
                setCartItems([]);
                return;
            }

            /*
             * ==========================================
             * Buscar produtos
             * ==========================================
             */

            const productIds = cartData.map(
                (item) => item.product_id
            );

            const {
                data: products,
                error: productsError,
            } = await supabase
                .from("product")
                .select(
                    "id, name, price, image_url"
                )
                .in("id", productIds);

            if (productsError) {
                console.error(
                    "ERRO AO CARREGAR PRODUTOS:",
                    productsError
                );

                return;
            }

            /*
             * ==========================================
             * Montar carrinho
             * ==========================================
             */

            const cartFromDatabase: CartItem[] =
                cartData
                    .map((cartItem) => {
                        const product =
                            products?.find(
                                (product) =>
                                    product.id ===
                                    cartItem.product_id
                            );

                        if (!product) {
                            return null;
                        }

                        return {
                            id: product.id,
                            name: product.name,
                            price: Number(product.price),
                            image: product.image_url,
                            unit: "UN",
                            quantity:
                                cartItem.quantity,
                        };
                    })
                    .filter(
                        (
                            item
                        ): item is CartItem =>
                            item !== null
                    );

            console.log(
                "CARRINHO FINAL:",
                cartFromDatabase
            );

            /*
             * Atualizar estado
             */

            setCartItems(
                cartFromDatabase
            );
        };

        loadCart();
    }, [user]);

    /*
     * ==========================================
     * 4. ADICIONAR PRODUTO
     * ==========================================
     */

    const addProduct = async (
        product: Product
    ) => {
        /*
         * ==============================
         * USUÁRIO NÃO LOGADO
         * ==============================
         */

        if (!user) {
            setCartItems((prevItems) => {
                const existingItem =
                    prevItems.find(
                        (item) =>
                            item.id === product.id
                    );

                if (existingItem) {
                    return prevItems.map(
                        (item) =>
                            item.id ===
                            product.id
                                ? {
                                      ...item,
                                      quantity:
                                          item.quantity +
                                          1,
                                  }
                                : item
                    );
                }

                return [
                    ...prevItems,
                    {
                        ...product,
                        quantity: 1,
                    },
                ];
            });

            return;
        }

        /*
         * ==============================
         * USUÁRIO LOGADO
         * ==============================
         */

        const existingItem =
            cartItems.find(
                (item) =>
                    item.id === product.id
            );

        /*
         * Produto já existe
         */

        if (existingItem) {
            const newQuantity =
                existingItem.quantity + 1;

            const { error } =
                await supabase
                    .from("cart_items")
                    .update({
                        quantity:
                            newQuantity,
                    })
                    .eq(
                        "user_id",
                        user.id
                    )
                    .eq(
                        "product_id",
                        product.id
                    );

            if (error) {
                console.error(
                    "ERRO AO ATUALIZAR CARRINHO:",
                    error
                );

                return;
            }

            setCartItems(
                (prevItems) =>
                    prevItems.map(
                        (item) =>
                            item.id ===
                            product.id
                                ? {
                                      ...item,
                                      quantity:
                                          newQuantity,
                                  }
                                : item
                    )
            );

            return;
        }

        /*
         * Produto novo
         */

        const { error } =
            await supabase
                .from("cart_items")
                .insert({
                    user_id: user.id,
                    product_id:
                        product.id,
                    quantity: 1,
                });

        if (error) {
            console.error(
                "ERRO AO INSERIR CARRINHO:",
                error
            );

            return;
        }

        setCartItems(
            (prevItems) => [
                ...prevItems,
                {
                    ...product,
                    quantity: 1,
                },
            ]
        );
    };

    /*
     * ==========================================
     * 5. REMOVER PRODUTO
     * ==========================================
     */

    const removeFromCart = async (
        id: string
    ) => {
        /*
         * Atualiza a tela
         */

        setCartItems((prevItems) =>
            prevItems.filter(
                (item) =>
                    item.id !== id
            )
        );

        /*
         * Visitante:
         * o useEffect salva no localStorage.
         */

        if (!user) {
            return;
        }

        /*
         * Usuário logado:
         * remove do Supabase.
         */

        const { error } =
            await supabase
                .from("cart_items")
                .delete()
                .eq(
                    "user_id",
                    user.id
                )
                .eq(
                    "product_id",
                    id
                );

        if (error) {
            console.error(
                "ERRO AO REMOVER CARRINHO:",
                error
            );
        }
    };

    /*
     * ==========================================
     * 6. DIMINUIR QUANTIDADE
     * ==========================================
     */

    const decreaseQuantity = async (
        id: string
    ) => {
        const item =
            cartItems.find(
                (item) =>
                    item.id === id
            );

        if (!item) {
            return;
        }

        /*
         * Se chegou em 1,
         * remove o produto.
         */

        if (item.quantity <= 1) {
            await removeFromCart(id);
            return;
        }

        const newQuantity =
            item.quantity - 1;

        /*
         * Atualiza tela
         */

        setCartItems(
            (prevItems) =>
                prevItems.map(
                    (item) =>
                        item.id === id
                            ? {
                                  ...item,
                                  quantity:
                                      newQuantity,
                              }
                            : item
                )
        );

        /*
         * Atualiza banco
         * se estiver logado.
         */

        if (user) {
            const { error } =
                await supabase
                    .from("cart_items")
                    .update({
                        quantity:
                            newQuantity,
                    })
                    .eq(
                        "user_id",
                        user.id
                    )
                    .eq(
                        "product_id",
                        id
                    );

            if (error) {
                console.error(
                    "ERRO AO DIMINUIR QUANTIDADE:",
                    error
                );
            }
        }
    };

    /*
     * ==========================================
     * 7. AUMENTAR QUANTIDADE
     * ==========================================
     */

    const increaseQuantity = async (
        id: string
    ) => {
        const item =
            cartItems.find(
                (item) =>
                    item.id === id
            );

        if (!item) {
            return;
        }

        const newQuantity =
            item.quantity + 1;

        /*
         * Atualiza tela
         */

        setCartItems(
            (prevItems) =>
                prevItems.map(
                    (item) =>
                        item.id === id
                            ? {
                                  ...item,
                                  quantity:
                                      newQuantity,
                              }
                            : item
                )
        );

        /*
         * Atualiza banco
         * se estiver logado.
         */

        if (user) {
            const { error } =
                await supabase
                    .from("cart_items")
                    .update({
                        quantity:
                            newQuantity,
                    })
                    .eq(
                        "user_id",
                        user.id
                    )
                    .eq(
                        "product_id",
                        id
                    );

            if (error) {
                console.error(
                    "ERRO AO AUMENTAR QUANTIDADE:",
                    error
                );
            }
        }
    };

    /*
     * ==========================================
     * 8. LIMPAR CARRINHO
     * ==========================================
     */

    const clearCart = async () => {
        /*
         * Limpa estado
         */

        setCartItems([]);

        /*
         * Limpa carrinho de visitante
         */

        localStorage.removeItem(
            "guest_cart"
        );

        /*
         * Se não estiver logado,
         * terminou.
         */

        if (!user) {
            return;
        }

        /*
         * Usuário logado:
         * limpa Supabase.
         */

        const { error } =
            await supabase
                .from("cart_items")
                .delete()
                .eq(
                    "user_id",
                    user.id
                );

        if (error) {
            console.error(
                "ERRO AO LIMPAR CARRINHO:",
                error
            );
        }
    };

    /*
     * ==========================================
     * 9. TOTAL
     * ==========================================
     */

    const totalCart = useMemo(() => {
        return cartItems.reduce(
            (total, item) =>
                total +
                Number(item.price) *
                    item.quantity,
            0
        );
    }, [cartItems]);

    /*
     * ==========================================
     * PROVIDER
     * ==========================================
     */

    return (
        <CartContext.Provider
            value={{
                cartItem: cartItems,
                AddToCart: addProduct,
                removeFromCart,
                decreaseQuantity,
                increaseQuantity,
                clearCart,
                cartTotal: totalCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

/*
 * ==========================================
 * HOOK
 * ==========================================
 */

export const useCart = () => {
    const context =
        useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart deve estar dentro do CartProvider"
        );
    }

    return context;
};
export default CartProvider;


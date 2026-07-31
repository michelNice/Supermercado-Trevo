import { useState, useRef, useEffect } from "react";
import { type productApi } from "../../Types/Product";
import { FaSearch } from "react-icons/fa";
import "./SearchProducts.scss";
import { useCart } from "../../context/useCart";

type ProsSeach = {
    products: productApi[];
};

function SearchProducts({ products = [] }: ProsSeach) {
    const { AddToCart } = useCart();
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setSearch("");
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="search__box" ref={searchRef}>
       <input
    type="text"
    placeholder="O que você precisa?"
    value={search}
    onFocus={() => setIsOpen(true)}
    onChange={(e) => {
        setSearch(e.target.value);
        setIsOpen(true);
    }}
/>


            <FaSearch className="icon" />

            {isOpen && search && (
                <div className="search__results">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div className="search__item" key={product.id}>
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                />

                                <div className="search__info">
                                    <h4>{product.name}</h4>
                                    <span className="search__price">
                                        R${" "}
                                        {Number(
                                            product.price ?? product.new_price ?? 0
                                        ).toFixed(2)}
                                        <small>/{product.unit_type}</small>
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        AddToCart({
                                            id: product.id,
                                            name: product.name ?? "",
                                            price: Number(
                                                product.price ?? product.new_price ?? 0
                                            ),
                                            image: product.image_url,
                                            unit:
                                                product.unit_type === "kg"
                                                    ? "KG"
                                                    : "UN",
                                        });

                                        setIsOpen(false);
                                        setSearch("");
                                    }}
                                >
                                    + Adicionar
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="search__item">
                            Nenhum produto encontrado.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchProducts;
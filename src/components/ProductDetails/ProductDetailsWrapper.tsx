import { useEffect, useState } from "react";
import ProductDetails from "./ProductDetails";
import { useParams } from "react-router-dom";
import type { productApi } from "../../Types/Product";
import { supabase } from "../../services/Supabase/supabaseClient";

function ProductDetailsWrapper({
  products,
  showModal,
  setShowModal,
  setSelectedProduct,
}: {
  products: productApi[];
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<productApi | null>
  >;
}) {
  const { id } = useParams();
  const [product, setProduct] = useState<productApi | null>(null);
  const [localProducts, setLocalProducts] = useState<productApi[]>(products);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const fetchProductData = async () => {
      setLoading(true);
      setError(null);

      try {
        const cachedProduct = products.find(
          (p) => String(p.id) === String(id)
        );

        if (cachedProduct) {
          setProduct(cachedProduct);
        } else {
          const { data, error: productError } = await supabase
            .from("product")
            .select("*")
            .eq("id", id)
            .single();

          if (productError) {
            setError(productError.message);
            setProduct(null);
          } else {
            setProduct(data);
          }
        }

        if (products.length > 0) {
          setLocalProducts(products);
        } else {
          const { data: allProducts, error: productsError } = await supabase
            .from("product")
            .select("*");

          if (productsError) {
            setError(productsError.message);
          } else if (allProducts) {
            setLocalProducts(allProducts);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar produto");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, products]);

  if (loading) {
    return (
      <div className="loading">
        <span className="spinner"></span>
      </div>
    );
  }

  if (error || !product) {
    return <p className="error-message">{error ?? "Produto não encontrado."}</p>;
  }

  return (
    <ProductDetails
      product={product}
      products={localProducts}
      showModal={showModal}
      setSelectedProduct={setSelectedProduct}
      setShowModal={setShowModal}
    />
  );
}

export default ProductDetailsWrapper;

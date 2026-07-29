import ProductDetails from "./ProductDetails";
import {useParams } from "react-router-dom";
import type { productApi } from "../../Types/Product";

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

  const product = products.find((p) => p.id === id);

  return (
    <ProductDetails
      product={product ?? null}
      products={products}
      showModal={showModal}
      setSelectedProduct={setSelectedProduct}
      setShowModal={setShowModal}
    />
  );
}

export default ProductDetailsWrapper
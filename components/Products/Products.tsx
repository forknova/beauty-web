import { getProducts, getSaved } from '@/app/actions';
import ProductsList from '../ProductsList/ProductsList';

const Products = async () => {
  const products = await getProducts();
  const saved = await getSaved();

  return <ProductsList products={products} saved={saved} />;
};

export default Products;

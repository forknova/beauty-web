import Image from 'next/image';
import AddToBagButton from '@/components/buttons/AddToBagButton/AddToBagButton';
import { getProducts } from '@/app/actions';

const Products = async () => {
  const products = await getProducts();

  return (
    <section>
      {products.map(
        (product: {
          id: string;
          title: string;
          description: string;
          image: string;
        }) => (
          <div key={product.id}>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <Image
              src={product.image}
              alt={product.title}
              width={300}
              height={300}
            />
            <AddToBagButton productId={product.id} />
          </div>
        ),
      )}
    </section>
  );
};

export default Products;

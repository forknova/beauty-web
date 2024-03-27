import Image from 'next/image';
import { addProductToSaved, removeProductFromSaved } from '@/app/actions';
import AddToBagButton from '@/components/buttons/AddToBagButton/AddToBagButton';
import SaveButton from '../buttons/SaveButton/SaveButton';

type ProductsListProps = {
  products: {
    id: string;
    title: string;
    description: string;
    image: string;
  }[];
  saved?: string[];
};

const ProductsList = ({ products, saved }: ProductsListProps) => {
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
            <div className="flex gap-4">
              <SaveButton
                productId={product.id}
                saved={Boolean(
                  saved?.find(
                    (savedProductId) => savedProductId === product.id,
                  ),
                )}
                addProductToSaved={addProductToSaved}
                removeProductFromSaved={removeProductFromSaved}
              />
              <AddToBagButton productId={product.id} />
            </div>
          </div>
        ),
      )}
    </section>
  );
};

export default ProductsList;

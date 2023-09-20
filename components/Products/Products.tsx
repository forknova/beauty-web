import Image from 'next/image';

const Products = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/shopify/products`,
  );

  const products = await res.json();

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
          </div>
        ),
      )}
    </section>
  );
};

export default Products;

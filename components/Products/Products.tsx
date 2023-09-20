import Image from 'next/image';
import axios from 'axios';

const Products = async () => {
    const {
      data: { products },
    } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shopify/products`);

  return (
    <section>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <Image src={product.image} alt={product.title} width={300} height={300} />
        </div>
      ))}
      </section>
  )
}

export default Products
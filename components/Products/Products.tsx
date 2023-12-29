import Image from 'next/image';

type ImageEdge = {
  node: {
    originalSrc: string;
  };
};

type ProductNode = {
  id: string;
  title: string;
  description: string;
  images: {
    edges: ImageEdge[];
  };
};

type ProductEdge = {
  node: ProductNode;
};

const endpoint = process.env.SHOPIFY_STOREFRONT_API_ENDPOINT as string;

const query = `
    query {
      products(first: 10) {
        edges {
          node {
            id
            title
            description
            images(first: 5) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

const Products = async () => {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': process.env
        .SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
    next: {
      tags: ['products'],
    },
  });

  const products = await res.json();

  const parsedProducts = products.data.products.edges.map(
    (edge: ProductEdge) => ({
      id: edge.node.id,
      title: edge.node.title,
      description: edge.node.description,
      image:
        edge.node.images.edges.length > 0
          ? edge.node.images.edges[0].node.originalSrc
          : null,
    }),
  );

  return (
    <section>
      {parsedProducts.map(
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

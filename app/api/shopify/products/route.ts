import { GraphQLClient } from 'graphql-request';


export async function GET() {
  const endpoint = process.env.SHOPIFY_STOREFRONT_API_ENDPOINT;


  const graphQLClient = new GraphQLClient(endpoint as string, {
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
    },
  });

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

    try {
    const data = await graphQLClient.request(query);

    const parsedData = data.products.edges.map(edge => ({
  id: edge.node.id,
  title: edge.node.title,
  description: edge.node.description,
  image: edge.node.images.edges.length > 0 ? edge.node.images.edges[0].node.originalSrc : null
}));


    return new Response(JSON.stringify({ products: parsedData}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }



}
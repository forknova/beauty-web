'use server';

import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  GET_CART_QUERY,
  CREATE_CART_MUTATION,
  GET_PRODUCT_QUERY,
  GET_PRODUCTS_QUERY,
  ADD_PRODUCTS_TO_CART_MUTATION,
} from '@/lib/graphql/queries';
import { ProductEdge } from '@/app/types';
import { revalidateTag } from 'next/cache';

export const getCartId = () => cookies().get('cartId')?.value;

export const getCart = async () => {
  const cartId = getCartId();

  if (!cartId) {
    return null;
  }

  const res = await fetch(
    process.env.SHOPIFY_STOREFRONT_API_ENDPOINT as string,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': process.env
          .SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: print(GET_CART_QUERY),
        variables: {
          id: cartId,
        },
      }),
      next: {
        tags: ['cart'],
      },
    },
  );

  const {
    data: { cart },
  } = await res.json();

  return cart;
};

export const createCart = async ({
  productVariantId,
}: {
  productVariantId: string;
}) => {
  const res = await fetch(
    process.env.SHOPIFY_STOREFRONT_API_ENDPOINT as string,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': process.env
          .SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: print(CREATE_CART_MUTATION),
        variables: {
          input: {
            lines: [
              {
                merchandiseId: productVariantId,
                quantity: 1,
              },
            ],
          },
        },
      }),
    },
  );

  const {
    data: {
      cartCreate: { cart },
    },
  } = await res.json();

  // TODO: only set for session
  // set cart id in cookie
  cookies().set('cartId', cart.id, {
    maxAge: 60 * 60 * 24 * 365 * 10, // 10 years
    path: '/',
  });

  // update cache
  revalidateTag('cart');

  return cart;
};

export const addProductsToCart = async ({
  cartId,
  productVariantId,
}: {
  cartId: string;
  productVariantId: string;
}) => {
  const res = await fetch(
    process.env.SHOPIFY_STOREFRONT_API_ENDPOINT as string,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': process.env
          .SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: print(ADD_PRODUCTS_TO_CART_MUTATION),
        variables: {
          cartId,
          lines: [
            {
              merchandiseId: productVariantId,
              quantity: 1,
            },
          ],
        },
      }),
    },
  );

  const {
    data: {
      cartLinesAdd: { cart: updatedCart, userErrors },
    },
  } = await res.json();

  if (userErrors.length > 0) {
    // Handle any errors
    console.error(userErrors);
    throw new Error('Failed to add product to cart');
  }

  // update cache
  revalidateTag('cart');

  return updatedCart;
};

export const getProduct = async ({ productId }: { productId: string }) => {
  const res = await fetch(
    process.env.SHOPIFY_STOREFRONT_API_ENDPOINT as string,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': process.env
          .SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: print(GET_PRODUCT_QUERY),
        variables: {
          id: productId,
        },
      }),
    },
  );

  const {
    data: { product },
  } = await res.json();

  return product;
};

export const getProducts = async () => {
  const res = await fetch(
    process.env.SHOPIFY_STOREFRONT_API_ENDPOINT as string,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': process.env
          .SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: print(GET_PRODUCTS_QUERY),
      }),
    },
  );

  const {
    data: { products },
  } = await res.json();

  const parsedProducts = products.edges.map((edge: ProductEdge) => ({
    id: edge.node.id,
    title: edge.node.title,
    description: edge.node.description,
    image:
      edge.node.images.edges.length > 0
        ? edge.node.images.edges[0].node.originalSrc
        : null,
  }));

  return parsedProducts;
};

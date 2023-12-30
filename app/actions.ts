'use server';

import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  GET_CART_QUERY,
  CREATE_CART_MUTATION,
  GET_PRODUCT_QUERY,
} from '@/lib/graphql/queries';

export const getCartId = () => cookies().get('cartId');

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

  return cart;
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

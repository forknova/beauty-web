'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import prisma from '@/lib/prisma';
import {
  GET_CART_QUERY,
  CREATE_CART_MUTATION,
  GET_PRODUCT_QUERY,
  GET_PRODUCTS_QUERY,
  ADD_PRODUCTS_TO_CART_MUTATION,
  CART_LINE_REMOVE_MUTATION,
} from '@/lib/graphql/queries';
import { ProductEdge } from '@/types';
import { auth } from '@/auth';

export const getCartId = () => cookies().get('cartId')?.value;

export const getCart = async () => {
  // TODO: not sure why this needs an await to work but doesnt if calling cookies.get() directly
  const cartId = await getCartId();

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
    data: { cart } = {
      cart: null,
    },
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
    maxAge: 60 * 60 * 24 * 1, // 1 day
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

export const removeProductFromCart = async ({
  cartId,
  lineIds,
}: {
  cartId: string;
  lineIds: string[];
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
        query: print(CART_LINE_REMOVE_MUTATION),
        variables: {
          cartId,
          lineIds,
        },
      }),
    },
  );

  const {
    data: {
      cartLinesRemove: { cart: updatedCart, errors },
    },
  } = await res.json();

  if (errors) {
    // handle any errors
    console.error(errors);
    throw new Error('Failed to remove product from cart');
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

  const parsedProduct = {
    id: product.id,
    title: product.title,
    description: product.description,
    image:
      product.images.edges.length > 0
        ? product.images.edges[0].node.originalSrc
        : null,
    variants: product.variants,
  };

  return parsedProduct;
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

export const addProductToSaved = async ({
  productId,
}: {
  productId: string;
}) => {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    throw new Error('You must be logged in to save a product.');
  }

  // retrieve the user from the database
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('You must be logged in to save a product.');
  }

  // check for existing saved items list
  const saved = await prisma.saved.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (saved) {
    // update the existing saved items list
    await prisma.saved.update({
      where: {
        userId: user.id,
      },
      data: {
        items: {
          push: productId,
        },
      },
    });
  } else {
    // create a new saved items list if none exists
    await prisma.saved.create({
      data: {
        userId: user.id,
        // TODO: fix this so we just add an item to the existing arrary
        items: [productId],
      },
    });
  }

  revalidateTag('saved');
  revalidateTag('/');
};

export const removeProductFromSaved = async ({
  productId,
}: {
  productId: string;
}) => {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    throw new Error('You must be logged in to remove a product.');
  }

  // retrieve the user from the database
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('You must be logged in to remove a product.');
  }

  // check for existing saved items list
  const saved = await prisma.saved.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (saved) {
    // update the existing saved items list
    await prisma.saved.update({
      where: {
        userId: user.id,
      },
      data: {
        items: {
          set: saved.items.filter((item) => item !== productId),
        },
      },
    });
  }

  revalidateTag('saved');
  revalidateTag('/');
};

export const getSaved = async (): Promise<string[] | undefined> => {
  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    return [];
  }

  const saved = await prisma.saved.findUnique({
    where: {
      userId,
    },
  });

  return saved?.items;
};

'use client';

import { Button } from '@/components/ui/Button';
import { getCart, createCart, getProduct } from '@/app/actions';

type AddToBagButtonProps = {
  productId: string;
};

const AddToBagButton = ({ productId }: AddToBagButtonProps) => {
  return (
    <Button
      onClick={async () => {
        const product = await getProduct({
          productId,
        });
        const productVariantId = product.variants.edges[0].node.id;
        const cart = await getCart();

        console.log(`Add ${productVariantId} to bag`);

        if (cart) {
          // TODO: add item to existing cart
        } else {
          // TODO: create new cart and add item to it
          const cart = await createCart({
            productVariantId,
          });

          // TODO: save cartId to session cookie
          console.log('cart', JSON.stringify(cart, null, 2));
        }
      }}
    >
      Add to bag
    </Button>
  );
};

export default AddToBagButton;

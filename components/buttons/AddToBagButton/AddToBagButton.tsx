'use client';

import { Button } from '@/components/ui/Button';
import {
  getCart,
  createCart,
  getProduct,
  addProductsToCart,
} from '@/app/actions';

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

        console.log(`Adding 1x ${productVariantId} to bag`);

        if (cart) {
          // add to existing cart
          console.log('existing cart', JSON.stringify(cart, null, 2));
          const updatedCart = await addProductsToCart({
            cartId: cart.id,
            productVariantId,
          });

          console.log('updated cart', JSON.stringify(updatedCart, null, 2));
        } else {
          // create a new cart
          // TODO: pass quantity
          const cart = await createCart({
            productVariantId,
          });

          console.log('new cart', JSON.stringify(cart, null, 2));
        }
      }}
    >
      Add to bag
    </Button>
  );
};

export default AddToBagButton;

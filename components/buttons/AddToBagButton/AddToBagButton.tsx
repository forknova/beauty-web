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

        if (cart) {
          // add to existing cart
          await addProductsToCart({
            cartId: cart.id,
            productVariantId,
          });
        } else {
          // create a new cart
          // TODO: pass quantity
          await createCart({
            productVariantId,
          });
        }
      }}
    >
      Add to bag
    </Button>
  );
};

export default AddToBagButton;

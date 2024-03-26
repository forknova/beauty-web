'use client';

import { Button } from '@/components/ui/Button';

type CheckoutButtonProps = {
  url: string;
};

const CheckoutButton = ({ url }: CheckoutButtonProps) => {
  return (
    <Button
      onClick={() => {
        // redirect to shopify checkout
        window.location.href = url;
      }}
    >
      Checkout
    </Button>
  );
};

export default CheckoutButton;

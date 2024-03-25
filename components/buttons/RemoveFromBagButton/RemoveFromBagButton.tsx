'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import cn from '@/utils/cn';

type RemoveFromBagButtonProps = {
  cartId: string;
  lineId: string;
  removeProductFromCart: ({
    cartId,
    lineIds,
  }: {
    cartId: string;
    lineIds: string[];
  }) => Promise<any>;
  className?: string;
};

const RemoveFromBagButton = ({
  cartId,
  lineId,
  removeProductFromCart,
  className,
}: RemoveFromBagButtonProps) => {
  return (
    <button
      type="button"
      aria-label="remove from bag"
      className={cn({
        [className as string]: !!className,
      })}
      onClick={() => {
        removeProductFromCart({ cartId, lineIds: [lineId] });
      }}
    >
      <FontAwesomeIcon icon={faXmark} size="xl" className="text-black" />
    </button>
  );
};

export default RemoveFromBagButton;

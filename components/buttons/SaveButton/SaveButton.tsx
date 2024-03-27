'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/pro-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/pro-solid-svg-icons';
import cn from '@/utils/cn';

type SaveButtonProps = {
  productId: string;
  saved?: boolean;
  addProductToSaved: (args: { productId: string }) => void;
  removeProductFromSaved: (args: { productId: string }) => void;
};

const SaveButton = ({
  productId,
  saved,
  addProductToSaved,
  removeProductFromSaved,
}: SaveButtonProps) => {
  return (
    <button
      onClick={async () => {
        if (saved) {
          await removeProductFromSaved({
            productId,
          });
        } else {
          await addProductToSaved({
            productId,
          });
        }
      }}
      type="button"
      aria-label="save"
    >
      <FontAwesomeIcon
        icon={saved ? faHeartSolid : faHeart}
        size="xl"
        className={cn('text-black', {
          'text-red-500': saved,
        })}
      />
    </button>
  );
};

export default SaveButton;

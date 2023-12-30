import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCart } from '@/app/actions';

const Bag = async () => {
  const cart = await getCart();

  return (
    <FontAwesomeIcon
      icon={['far', 'shopping-bag']}
      color="var(--color-black)"
      size="xl"
    />
  );
};

export default Bag;

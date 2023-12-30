import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCart } from '@/app/actions';

const Bag = async () => {
  const cart = await getCart();

  const cartCount = cart?.lines.edges.reduce(
    (acc: number, lineItem: any) => acc + lineItem.node.quantity,
    0,
  );

  console.log('cart', JSON.stringify(cart, null, 2));
  console.log('cartCount', cartCount);

  return (
    <div className="relative">
      <span className="absolute top-[-12px] left-[-12px] flex justify-center items-center text-xs bg-red-600 text-white p-1 rounded-full h-6 w-6">
        {cartCount}
      </span>
      <FontAwesomeIcon
        icon={['far', 'shopping-bag']}
        color="var(--color-black)"
        size="xl"
      />
    </div>
  );
};

export default Bag;

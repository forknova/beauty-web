import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/pro-regular-svg-icons';
import { getCart } from '@/app/actions';

const Bag = async () => {
  const bag = await getCart();

  const bagCount = bag?.lines.edges.reduce(
    (acc: number, lineItem: any) => acc + lineItem.node.quantity,
    0,
  );

  return (
    <div className="relative">
      {bagCount ? (
        <span className="absolute top-[-12px] left-[-12px] flex justify-center items-center text-xs bg-red-600 text-white p-1 rounded-full h-6 w-6">
          {bagCount}
        </span>
      ) : null}
      <FontAwesomeIcon icon={faShoppingBag} size="xl" className="text-black" />
    </div>
  );
};

export default Bag;

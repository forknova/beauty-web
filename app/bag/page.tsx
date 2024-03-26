import { getCart, removeProductFromCart } from '@/app/actions';
import CheckoutButton from '@/components/buttons/CheckoutButton/CheckoutButton';
import RemoveFromBagButton from '@/components/buttons/RemoveFromBagButton/RemoveFromBagButton';

const BagPage = async () => {
  const bag = await getCart();

  if (!bag) {
    return <div>Empty bag</div>;
  }

  return (
    <div>
      <h1>Bag Page</h1>
      <section className="flex flex-col gap-y-4">
        {bag.lines.edges.map((lineItem: any) => {
          return (
            <div
              className="relative border-black border-2 p-4 w-auto"
              key={lineItem.node.id}
            >
              <h2>{lineItem.node.merchandise.product.title}</h2>
              <p>Quantity: {lineItem.node.quantity}</p>
              <RemoveFromBagButton
                className="absolute top-1 right-1"
                cartId={bag.id}
                lineId={lineItem.node.id}
                removeProductFromCart={removeProductFromCart}
              />
            </div>
          );
        })}
      </section>
      <section>
        <CheckoutButton url={bag.checkoutUrl} />
      </section>
    </div>
  );
};

export default BagPage;

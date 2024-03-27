import { getProduct, getSaved } from '@/app/actions';
import ProductsList from '@/components/ProductsList/ProductsList';

const SavedPage = async () => {
  const saved = await getSaved();
  const populatedSaved = saved
    ? await Promise.all(
        saved.map(async (item) => getProduct({ productId: item })),
      )
    : [];

  return (
    <div>
      <ProductsList products={populatedSaved} saved={saved} />
    </div>
  );
};

export default SavedPage;

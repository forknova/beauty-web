import Header from "../components/Header/Header";
import Products from "../components/Products/Products";

const HomePage = () => {
  return (
    <>
    <Header className="mb-12" />
    <main className="flex min-h-screen flex-col items-center">
      <Products />
    </main>
    </>
  )
};

export default HomePage;

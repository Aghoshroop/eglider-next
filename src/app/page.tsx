import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Featured from "@/components/Featured";
import About from "@/components/About";
import Footer from "@/components/Footer";
import OffersBanner from "@/components/OffersBanner";
import ProductsShowcase from "@/components/ProductsShowcase";
import NewArrivals from "@/components/NewArrivals";
import Categories from "@/components/Categories";

export default function Home() {
  return (
    <main style={{width: "100%"}}>
      <OffersBanner />
      <Header />
      <Hero />
      <Categories />
      <ProductsShowcase />
      <Featured />
      <NewArrivals />
      <About />
      <Footer />
    </main>
  );
}

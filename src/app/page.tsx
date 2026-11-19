import Banner from "@/components/home/Bannar";
import Categories from "@/components/home/Categories";
import Feature from "@/components/home/Feature";
import Reviews from "@/components/home/Reviews";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <div>
      <Banner />
      <Categories />
      <Feature />
      <WhyChooseUs />
      <Reviews />
    </div>
  );
}

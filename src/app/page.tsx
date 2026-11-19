import Banner from "@/components/home/Bannar";
import Categories from "@/components/home/Categories";
import Feature from "@/components/home/Feature";
import HowItWorks from "@/components/home/HowItWorks";
import Reviews from "@/components/home/Reviews";
import TrustedOwners from "@/components/home/TrustedOwners";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <div>
      <Banner />
      <Categories />
      <Feature />
      <WhyChooseUs />
      <Reviews />
      <HowItWorks />
      <TrustedOwners />
    </div>
  );
}

import Banner from "@/components/home/Bannar";
import Categories from "@/components/home/Categories";
import Feature from "@/components/home/Feature";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TrustedOwners from "@/components/home/TrustedOwners";
import Reviews from "@/components/home/Reviews";

export default function Home() {
  return (
    <div>
      <Banner />
      <Categories />
      <Feature />
      <HowItWorks />
      <WhyChooseUs />
      <TrustedOwners />
      <Reviews />
    </div>
  );
}

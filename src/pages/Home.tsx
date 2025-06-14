import { Hero } from '../components/Hero';
import { FeaturedCategories } from '../components/FeaturedCategories';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { Newsletter } from '../components/Newsletter';

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <FeaturedCategories />
      <Newsletter />
    </main>
  );
};
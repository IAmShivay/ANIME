import { Hero } from '../components/Hero';
import { FeaturedCategories } from '../components/FeaturedCategories';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { Newsletter } from '../components/Newsletter';

export const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <FeaturedCategories />
      <Newsletter />
    </main>
  );
};
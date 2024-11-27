import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { products } from '../data/products';

export const FeaturedProducts: React.FC = () => {
  const featuredProducts = products.slice(0, 3);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 text-lg">
            Check out our most popular items
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard
                product={product}
                onAddToCart={(product) => console.log('Added to cart:', product)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
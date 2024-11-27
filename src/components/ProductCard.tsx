import { Product } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <Card className="group h-full flex flex-col">
      <div className="flex flex-col h-full">
        <div className="relative h-[300px] overflow-hidden rounded-t-xl">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <Heart className="w-5 h-5 text-rose-500" />
          </motion.button>
          <div className="absolute bottom-4 left-4">
            <Badge variant="success" className="bg-emerald-500 text-white">
              New Arrival
            </Badge>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-fuchsia-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="primary" className="bg-fuchsia-100 text-fuchsia-800">
                  {product.category}
                </Badge>
                <Badge variant="secondary" className="bg-violet-100 text-violet-800">
                  {product.subCategory}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-violet-600">
                ${product.price}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span className="text-sm text-gray-600">4.8</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-grow">{product.description}</p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => onAddToCart(product)}
              className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 flex items-center justify-center gap-2 transform transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </Button>
          </motion.div>
        </div>
      </div>
    </Card>
  );
};
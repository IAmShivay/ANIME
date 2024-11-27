import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelectCategory(null)}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 
          ${!selectedCategory 
            ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-lg' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
      >
        All Products
      </motion.button>
      {categories.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(category)}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 
            ${selectedCategory === category
              ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.button>
      ))}
    </div>
  );
};
import { motion } from 'framer-motion';
import { Sparkles, Heart, Star } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <main className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 mb-4">
            About AnimeScience
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Where anime passion meets scientific innovation in fashion and collectibles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {[
            {
              icon: Sparkles,
              title: 'Unique Designs',
              description: 'Every piece is crafted with attention to detail and authenticity'
            },
            {
              icon: Heart,
              title: 'Quality First',
              description: 'Premium materials and expert craftsmanship in every product'
            },
            {
              icon: Star,
              title: 'Limited Editions',
              description: 'Exclusive collections you won\'t find anywhere else'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center p-6 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-shadow"
            >
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-violet-600" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
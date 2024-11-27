import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-violet-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=1200"
          alt="Anime themed background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/90 via-indigo-900/80 to-purple-900/90" />
      </div>
      <div className="relative max-w-7xl mx-auto py-32 px-4 sm:py-40 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 relative inline-block"
          >
            <Sparkles className="absolute -top-6 -left-6 w-8 h-8 text-yellow-400 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
              Anime Universe
            </h1>
            <div className="text-2xl md:text-3xl font-bold text-indigo-200">
              Where Fantasy Meets Fashion
            </div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 text-xl max-w-3xl mx-auto text-indigo-100"
          >
            Discover our exclusive collection of premium anime merchandise.
            From iconic series to limited editions, express your passion in style.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              Explore Collection
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg bg-white/10 backdrop-blur-md border-2 border-white/20 text-white font-bold hover:bg-white/20 transition-all duration-300"
            >
              View Limited Editions
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
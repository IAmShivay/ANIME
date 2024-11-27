import { Send } from 'lucide-react';
import { Button } from './ui/Button';

export const Newsletter: React.FC = () => {
  return (
    <section className="bg-indigo-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-indigo-200 mb-8">
            Subscribe to our newsletter for exclusive deals and new arrivals
          </p>
          <form className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-indigo-800 text-white placeholder-indigo-300 border border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button variant="primary" size="lg" className="bg-white text-indigo-900 hover:bg-indigo-100">
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
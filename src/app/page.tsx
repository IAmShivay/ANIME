import { Metadata } from 'next'
import { Hero } from '@/components/Hero'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { FeaturedCategories } from '@/components/FeaturedCategories'
import { MarketplaceAvailability } from '@/components/MarketplaceAvailability'
import { Testimonials } from '@/components/Testimonials'
import { Newsletter } from '@/components/Newsletter'
import { Navbar } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Bindass - Premium Anime Fashion & Streetwear',
  description: 'Discover premium anime fashion, streetwear, and accessories. Your premier destination for anime-inspired clothing and collectibles.',
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedProducts />
        <FeaturedCategories />
        <MarketplaceAvailability />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}

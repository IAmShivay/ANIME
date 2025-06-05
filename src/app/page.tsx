import { Metadata } from 'next'
import { Hero } from '@/components/Hero'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { FeaturedCategories } from '@/components/FeaturedCategories'
import { Newsletter } from '@/components/Newsletter'
import { Navbar } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'AnimeScience - Premium Anime Clothing & Collectibles',
  description: 'Discover premium anime clothing, collectibles, and accessories. Your premier destination for anime and science-themed merchandise.',
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedProducts />
        <FeaturedCategories />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}

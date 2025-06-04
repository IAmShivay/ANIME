import { Hero } from '@/components/hero'
import { FeaturedProducts } from '@/components/featured-products'
import { FeaturedCategories } from '@/components/featured-categories'
import { Newsletter } from '@/components/newsletter'

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <FeaturedCategories />
      <Newsletter />
    </>
  )
}
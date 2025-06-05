import connectDB from './mongodb'
import Product from './models/Product'
import User from './models/User'
import Policy from './models/Policy'

const sampleProducts = [
  {
    name: "Attack on Titan Survey Corps Jacket",
    description: "Premium quality Survey Corps jacket inspired by Attack on Titan. Made with high-quality materials for comfort and durability.",
    price: 89.99,
    comparePrice: 119.99,
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop"
    ],
    category: "anime",
    subCategory: "clothing",
    tags: ["attack on titan", "jacket", "survey corps", "anime"],
    variants: [
      {
        id: "size-s",
        name: "Small",
        options: { size: "S" },
        inventory: { quantity: 10, trackQuantity: true }
      },
      {
        id: "size-m",
        name: "Medium",
        options: { size: "M" },
        inventory: { quantity: 15, trackQuantity: true }
      },
      {
        id: "size-l",
        name: "Large",
        options: { size: "L" },
        inventory: { quantity: 12, trackQuantity: true }
      }
    ],
    inventory: {
      quantity: 37,
      trackQuantity: true,
      allowBackorder: false
    },
    status: "active",
    featured: true
  },
  {
    name: "Naruto Hokage Cloak",
    description: "Authentic replica of the Hokage cloak from Naruto. Perfect for cosplay or casual wear.",
    price: 129.99,
    comparePrice: 159.99,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop"
    ],
    category: "anime",
    subCategory: "cosplay",
    tags: ["naruto", "hokage", "cloak", "cosplay"],
    variants: [],
    inventory: {
      quantity: 25,
      trackQuantity: true,
      allowBackorder: false
    },
    status: "active",
    featured: true
  },
  {
    name: "Dragon Ball Z Scouter Replica",
    description: "High-quality replica of the iconic scouter from Dragon Ball Z. LED display and sound effects included.",
    price: 79.99,
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop"
    ],
    category: "anime",
    subCategory: "accessories",
    tags: ["dragon ball z", "scouter", "replica", "accessories"],
    variants: [],
    inventory: {
      quantity: 18,
      trackQuantity: true,
      allowBackorder: false
    },
    status: "active",
    featured: false
  },
  {
    name: "Periodic Table T-Shirt",
    description: "Stylish t-shirt featuring the complete periodic table. Perfect for science enthusiasts.",
    price: 24.99,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop"
    ],
    category: "science",
    subCategory: "clothing",
    tags: ["science", "chemistry", "periodic table", "t-shirt"],
    variants: [
      {
        id: "size-s-black",
        name: "Small - Black",
        options: { size: "S", color: "Black" },
        inventory: { quantity: 20, trackQuantity: true }
      },
      {
        id: "size-m-black",
        name: "Medium - Black",
        options: { size: "M", color: "Black" },
        inventory: { quantity: 25, trackQuantity: true }
      },
      {
        id: "size-l-black",
        name: "Large - Black",
        options: { size: "L", color: "Black" },
        inventory: { quantity: 22, trackQuantity: true }
      }
    ],
    inventory: {
      quantity: 67,
      trackQuantity: true,
      allowBackorder: false
    },
    status: "active",
    featured: true
  },
  {
    name: "DNA Double Helix Necklace",
    description: "Beautiful sterling silver necklace featuring a DNA double helix pendant. Perfect gift for science lovers.",
    price: 49.99,
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop"
    ],
    category: "science",
    subCategory: "jewelry",
    tags: ["science", "dna", "necklace", "jewelry", "biology"],
    variants: [],
    inventory: {
      quantity: 30,
      trackQuantity: true,
      allowBackorder: false
    },
    status: "active",
    featured: false
  },
  {
    name: "Anime Character Keychain Set",
    description: "Set of 5 premium keychains featuring popular anime characters. High-quality acrylic with vibrant colors.",
    price: 19.99,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop"
    ],
    category: "anime",
    subCategory: "accessories",
    tags: ["anime", "keychain", "accessories", "collectible"],
    variants: [],
    inventory: {
      quantity: 50,
      trackQuantity: true,
      allowBackorder: false
    },
    status: "active",
    featured: false
  }
]

const samplePolicies = [
  {
    type: "privacy",
    title: "Privacy Policy",
    content: `
      <h2>Information We Collect</h2>
      <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
      
      <h2>How We Use Your Information</h2>
      <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
      
      <h2>Information Sharing</h2>
      <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
      
      <h2>Data Security</h2>
      <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
      
      <h2>Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at privacy@animescience.com.</p>
    `,
    version: "1.0",
    isActive: true
  },
  {
    type: "terms",
    title: "Terms of Service",
    content: `
      <h2>Acceptance of Terms</h2>
      <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
      
      <h2>Use License</h2>
      <p>Permission is granted to temporarily download one copy of the materials on AnimeScience's website for personal, non-commercial transitory viewing only.</p>
      
      <h2>Disclaimer</h2>
      <p>The materials on AnimeScience's website are provided on an 'as is' basis. AnimeScience makes no warranties, expressed or implied.</p>
      
      <h2>Limitations</h2>
      <p>In no event shall AnimeScience or its suppliers be liable for any damages arising out of the use or inability to use the materials on this website.</p>
      
      <h2>Contact Information</h2>
      <p>If you have any questions about these Terms of Service, please contact us at legal@animescience.com.</p>
    `,
    version: "1.0",
    isActive: true
  },
  {
    type: "refund",
    title: "Refund Policy",
    content: `
      <h2>Return Period</h2>
      <p>You have 30 days from the date of purchase to return items for a full refund.</p>
      
      <h2>Condition of Items</h2>
      <p>Items must be in original condition, unworn, and with all tags attached. Custom or personalized items cannot be returned.</p>
      
      <h2>Return Process</h2>
      <p>To initiate a return, please contact our customer service team at returns@animescience.com with your order number.</p>
      
      <h2>Refund Processing</h2>
      <p>Refunds will be processed within 5-7 business days after we receive your returned item.</p>
      
      <h2>Shipping Costs</h2>
      <p>Original shipping costs are non-refundable. Return shipping costs are the responsibility of the customer unless the item was defective.</p>
    `,
    version: "1.0",
    isActive: true
  },
  {
    type: "shipping",
    title: "Shipping Policy",
    content: `
      <h2>Processing Time</h2>
      <p>Orders are typically processed within 1-2 business days. Custom orders may take 3-5 business days to process.</p>
      
      <h2>Shipping Methods</h2>
      <p>We offer standard shipping (5-7 business days) and express shipping (2-3 business days) options.</p>
      
      <h2>Shipping Costs</h2>
      <p>Free standard shipping on orders over $50. Express shipping rates vary by location and package weight.</p>
      
      <h2>International Shipping</h2>
      <p>We ship internationally to most countries. International shipping times vary by destination and may be subject to customs delays.</p>
      
      <h2>Tracking</h2>
      <p>You will receive a tracking number via email once your order ships. You can track your package on our website or the carrier's website.</p>
    `,
    version: "1.0",
    isActive: true
  }
]

export async function seedDatabase() {
  try {
    await connectDB()
    
    console.log('🌱 Starting database seeding...')

    // Clear existing data
    await Product.deleteMany({})
    await Policy.deleteMany({})
    
    // Seed products
    console.log('📦 Seeding products...')
    await Product.insertMany(sampleProducts)
    console.log(`✅ Created ${sampleProducts.length} products`)

    // Seed policies
    console.log('📋 Seeding policies...')
    await Policy.insertMany(samplePolicies)
    console.log(`✅ Created ${samplePolicies.length} policies`)

    // Create admin user if it doesn't exist
    console.log('👤 Creating admin user...')
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL })
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@animescience.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
        emailVerified: true
      })
      await adminUser.save()
      console.log('✅ Admin user created')
    } else {
      console.log('ℹ️ Admin user already exists')
    }

    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

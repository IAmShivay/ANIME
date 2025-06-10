const bcrypt = require('bcryptjs')
const { MongoClient } = require('mongodb')

const MONGODB_URI = 'mongodb+srv://shivaysharma77893:shivkumar777@cluster7.tjlg0dn.mongodb.net/bindass-ecommerce'
const DB_NAME = 'bindass-ecommerce'

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    console.log('🔗 Connecting to MongoDB Atlas...')
    await client.connect()
    console.log('✅ Connected to MongoDB Atlas')
    
    const db = client.db(DB_NAME)
    
    // Clear existing products
    console.log('🗑️ Clearing existing products...')
    await db.collection('products').deleteMany({})
    
    // Create sample products that match the Product model
    console.log('🛍️ Creating sample products...')
    const products = [
      {
        name: 'Naruto Hokage Hoodie',
        description: 'Premium quality hoodie featuring the iconic Hokage design from Naruto. Made with 100% cotton blend for ultimate comfort and style.',
        price: 2499,
        comparePrice: 3299,
        images: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop'
        ],
        category: 'anime',
        subCategory: 'hoodies',
        tags: ['naruto', 'hokage', 'anime', 'hoodie', 'cotton'],
        variants: [],
        inventory: {
          quantity: 50,
          trackQuantity: true,
          allowBackorder: false
        },
        seo: {
          title: 'Naruto Hokage Hoodie - Premium Anime Fashion',
          description: 'Premium quality hoodie featuring the iconic Hokage design from Naruto. Made with 100% cotton blend for ultimate comfort.',
          keywords: ['naruto', 'hokage', 'anime', 'hoodie', 'cotton']
        },
        status: 'active',
        featured: true,
        rating: {
          average: 4.8,
          count: 124
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dragon Ball Z Streetwear Tee',
        description: 'Stylish streetwear t-shirt with Dragon Ball Z inspired graphics. Perfect for casual wear and anime conventions.',
        price: 1299,
        comparePrice: 1799,
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop'
        ],
        category: 'anime',
        subCategory: 'tshirts',
        tags: ['dragon ball z', 'dbz', 'anime', 'tshirt', 'streetwear'],
        variants: [],
        inventory: {
          quantity: 75,
          trackQuantity: true,
          allowBackorder: false
        },
        seo: {
          title: 'Dragon Ball Z Streetwear Tee - Anime Fashion',
          description: 'Stylish streetwear t-shirt with Dragon Ball Z inspired graphics. Perfect for casual wear and anime conventions.',
          keywords: ['dragon ball z', 'dbz', 'anime', 'tshirt', 'streetwear']
        },
        status: 'active',
        featured: true,
        rating: {
          average: 4.9,
          count: 89
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Attack on Titan Jacket',
        description: 'Military-style jacket inspired by Attack on Titan. Features the Survey Corps emblem and premium construction for ultimate style.',
        price: 4999,
        comparePrice: 6499,
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800&h=800&fit=crop'
        ],
        category: 'anime',
        subCategory: 'jackets',
        tags: ['attack on titan', 'aot', 'anime', 'jacket', 'military'],
        variants: [],
        inventory: {
          quantity: 30,
          trackQuantity: true,
          allowBackorder: false
        },
        seo: {
          title: 'Attack on Titan Jacket - Military Style Anime Fashion',
          description: 'Military-style jacket inspired by Attack on Titan. Features the Survey Corps emblem and premium construction.',
          keywords: ['attack on titan', 'aot', 'anime', 'jacket', 'military']
        },
        status: 'active',
        featured: true,
        rating: {
          average: 4.7,
          count: 156
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Urban Anime Graphic Hoodie',
        description: 'Modern streetwear hoodie with subtle anime-inspired graphics. Perfect for urban fashion enthusiasts who love anime culture.',
        price: 2799,
        comparePrice: 3499,
        images: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop'
        ],
        category: 'streetwear',
        subCategory: 'hoodies',
        tags: ['streetwear', 'urban', 'anime', 'hoodie', 'graphic'],
        variants: [],
        inventory: {
          quantity: 45,
          trackQuantity: true,
          allowBackorder: false
        },
        seo: {
          title: 'Urban Anime Graphic Hoodie - Streetwear Fashion',
          description: 'Modern streetwear hoodie with subtle anime-inspired graphics. Perfect for urban fashion enthusiasts.',
          keywords: ['streetwear', 'urban', 'anime', 'hoodie', 'graphic']
        },
        status: 'active',
        featured: false,
        rating: {
          average: 4.5,
          count: 92
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'One Piece Straw Hat Crew Backpack',
        description: 'Spacious backpack featuring the Straw Hat Pirates logo. Perfect for school, work, or adventures with your crew.',
        price: 1899,
        comparePrice: 2499,
        images: [
          'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800&h=800&fit=crop'
        ],
        category: 'accessories',
        subCategory: 'bags',
        tags: ['one piece', 'straw hat', 'anime', 'backpack', 'accessories'],
        variants: [],
        inventory: {
          quantity: 40,
          trackQuantity: true,
          allowBackorder: false
        },
        seo: {
          title: 'One Piece Straw Hat Crew Backpack - Anime Accessories',
          description: 'Spacious backpack featuring the Straw Hat Pirates logo. Perfect for school, work, or adventures.',
          keywords: ['one piece', 'straw hat', 'anime', 'backpack', 'accessories']
        },
        status: 'active',
        featured: false,
        rating: {
          average: 4.6,
          count: 67
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Limited Edition Goku Ultra Instinct Hoodie',
        description: 'Exclusive limited edition hoodie featuring Goku in Ultra Instinct form. Only 100 pieces available worldwide.',
        price: 4499,
        comparePrice: 5999,
        images: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop'
        ],
        category: 'limited',
        subCategory: 'hoodies',
        tags: ['dragon ball', 'goku', 'ultra instinct', 'limited edition', 'exclusive'],
        variants: [],
        inventory: {
          quantity: 15,
          trackQuantity: true,
          allowBackorder: false
        },
        seo: {
          title: 'Limited Edition Goku Ultra Instinct Hoodie - Exclusive Anime Fashion',
          description: 'Exclusive limited edition hoodie featuring Goku in Ultra Instinct form. Only 100 pieces available worldwide.',
          keywords: ['dragon ball', 'goku', 'ultra instinct', 'limited edition', 'exclusive']
        },
        status: 'active',
        featured: true,
        rating: {
          average: 4.9,
          count: 23
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const result = await db.collection('products').insertMany(products)
    console.log(`✅ Created ${result.insertedCount} products`)

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📊 Summary:')
    console.log(`📦 Products Created: ${result.insertedCount} items`)
    console.log('\n🛍️ Sample Products:')
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ₹${product.price} (${product.category})`)
    })

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await client.close()
    console.log('\n🔌 Database connection closed')
  }
}

seedDatabase()

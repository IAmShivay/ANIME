const bcrypt = require('bcryptjs')
const { MongoClient } = require('mongodb')

async function seedDatabase() {
  const client = new MongoClient('mongodb+srv://shivaysharma77893:shivkumar777@cluster7.tjlg0dn.mongodb.net/bindass-ecommerce')

  try {
    await client.connect()
    console.log('🔗 Connected to MongoDB Atlas')
    const db = client.db()

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await db.collection('users').deleteMany({})
    await db.collection('products').deleteMany({})

    // Create test users
    console.log('👥 Creating test users...')
    const users = [
      {
        name: 'Test User',
        email: 'user@bindass.com',
        password: 'user123',
        role: 'user',
        emailVerified: true,
        preferences: {
          newsletter: true,
          notifications: true
        },
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin User',
        email: 'admin@bindass.com',
        password: 'admin123',
        role: 'admin',
        emailVerified: true,
        preferences: {
          newsletter: true,
          notifications: true
        },
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    for (const userData of users) {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      userData.password = hashedPassword

      // Insert user
      const result = await db.collection('users').insertOne(userData)
      console.log(`✅ Created user: ${userData.email} (ID: ${result.insertedId})`)
    }

    // Create sample products with more variety
    console.log('🛍️ Creating sample products...')
    const products = [
      // Anime Category
      {
        name: 'Naruto Hokage Hoodie',
        description: 'Premium quality hoodie featuring the iconic Hokage design from Naruto. Made with 100% cotton blend for ultimate comfort.',
        price: 2499,
        comparePrice: 3299,
        images: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop'
        ],
        category: 'anime',
        subcategory: 'hoodies',
        tags: ['naruto', 'hokage', 'anime', 'hoodie', 'cotton'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Navy', 'Orange'],
        inventory: {
          quantity: 50,
          trackQuantity: true,
          allowBackorder: false
        },
        status: 'active',
        featured: true,
        rating: {
          average: 4.8,
          count: 124
        },
        seo: {
          title: 'Naruto Hokage Hoodie - Premium Anime Fashion',
          description: 'Premium quality hoodie featuring the iconic Hokage design from Naruto. Made with 100% cotton blend for ultimate comfort.',
          keywords: ['naruto', 'hokage', 'anime', 'hoodie', 'cotton']
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
        subcategory: 'tshirts',
        tags: ['dragon ball z', 'dbz', 'anime', 'tshirt', 'streetwear'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White', 'Orange'],
        inventory: {
          quantity: 75,
          trackQuantity: true,
          allowBackorder: false
        },
        status: 'active',
        featured: true,
        rating: {
          average: 4.9,
          count: 89
        },
        seo: {
          title: 'Dragon Ball Z Streetwear Tee - Anime Fashion',
          description: 'Stylish streetwear t-shirt with Dragon Ball Z inspired graphics. Perfect for casual wear and anime conventions.',
          keywords: ['dragon ball z', 'dbz', 'anime', 'tshirt', 'streetwear']
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Attack on Titan Jacket',
        description: 'Military-style jacket inspired by Attack on Titan. Features the Survey Corps emblem and premium construction.',
        price: 4999,
        comparePrice: 6499,
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
          'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800&h=800&fit=crop'
        ],
        category: 'anime',
        subcategory: 'jackets',
        tags: ['attack on titan', 'aot', 'anime', 'jacket', 'military'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Green', 'Black', 'Brown'],
        stock: 30,
        featured: true,
        rating: 4.7,
        reviews: 156,
        specifications: {
          material: '65% Cotton, 35% Polyester',
          fit: 'Regular',
          care: 'Dry clean only',
          origin: 'Made in India'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Demon Slayer Tanjiro Kamado Tee',
        description: 'High-quality t-shirt featuring Tanjiro Kamado from Demon Slayer. Soft fabric with vibrant print.',
        price: 1199,
        comparePrice: 1599,
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop'
        ],
        category: 'anime',
        subcategory: 'tshirts',
        tags: ['demon slayer', 'tanjiro', 'anime', 'tshirt'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White', 'Green'],
        stock: 60,
        featured: false,
        rating: 4.6,
        reviews: 78,
        specifications: {
          material: '100% Cotton',
          fit: 'Regular',
          care: 'Machine wash cold',
          origin: 'Made in India'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Streetwear Category
      {
        name: 'Urban Anime Graphic Hoodie',
        description: 'Modern streetwear hoodie with subtle anime-inspired graphics. Perfect for urban fashion enthusiasts.',
        price: 2799,
        comparePrice: 3499,
        images: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop'
        ],
        category: 'streetwear',
        subcategory: 'hoodies',
        tags: ['streetwear', 'urban', 'anime', 'hoodie', 'graphic'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Grey', 'White'],
        stock: 45,
        featured: true,
        rating: 4.5,
        reviews: 92,
        specifications: {
          material: '70% Cotton, 30% Polyester',
          fit: 'Oversized',
          care: 'Machine wash cold',
          origin: 'Made in India'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Anime Streetwear Cargo Pants',
        description: 'Comfortable cargo pants with anime-inspired details. Multiple pockets and adjustable fit.',
        price: 3299,
        comparePrice: 4199,
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop'
        ],
        category: 'streetwear',
        subcategory: 'pants',
        tags: ['streetwear', 'cargo', 'pants', 'anime', 'utility'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Olive', 'Grey'],
        stock: 35,
        featured: false,
        rating: 4.4,
        reviews: 56,
        specifications: {
          material: '100% Cotton Twill',
          fit: 'Regular',
          care: 'Machine wash cold',
          origin: 'Made in India'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Accessories Category
      {
        name: 'One Piece Straw Hat Crew Backpack',
        description: 'Spacious backpack featuring the Straw Hat Pirates logo. Perfect for school, work, or adventures.',
        price: 1899,
        comparePrice: 2499,
        images: [
          'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800&h=800&fit=crop'
        ],
        category: 'accessories',
        subcategory: 'bags',
        tags: ['one piece', 'straw hat', 'anime', 'backpack', 'accessories'],
        sizes: ['One Size'],
        colors: ['Black', 'Navy', 'Red'],
        stock: 40,
        featured: false,
        rating: 4.6,
        reviews: 67,
        specifications: {
          material: 'Polyester',
          capacity: '25L',
          care: 'Spot clean only',
          origin: 'Made in India'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Anime Character Phone Case',
        description: 'Protective phone case with your favorite anime characters. Available for multiple phone models.',
        price: 599,
        comparePrice: 899,
        images: [
          'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800&h=800&fit=crop'
        ],
        category: 'accessories',
        subcategory: 'phone-cases',
        tags: ['anime', 'phone case', 'accessories', 'protection'],
        sizes: ['iPhone 14', 'iPhone 15', 'Samsung S23', 'OnePlus'],
        colors: ['Clear', 'Black', 'White'],
        stock: 100,
        featured: false,
        rating: 4.3,
        reviews: 145,
        specifications: {
          material: 'TPU Silicone',
          protection: 'Drop Protection',
          care: 'Wipe clean',
          origin: 'Made in India'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Limited Edition Category
      {
        name: 'Limited Edition Goku Ultra Instinct Hoodie',
        description: 'Exclusive limited edition hoodie featuring Goku in Ultra Instinct form. Only 100 pieces available.',
        price: 4499,
        comparePrice: 5999,
        images: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop'
        ],
        category: 'limited',
        subcategory: 'hoodies',
        tags: ['dragon ball', 'goku', 'ultra instinct', 'limited edition', 'exclusive'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Silver', 'Black'],
        stock: 15,
        featured: true,
        rating: 4.9,
        reviews: 23,
        specifications: {
          material: '90% Cotton, 10% Elastane',
          fit: 'Premium',
          care: 'Hand wash only',
          origin: 'Made in India'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Collector Edition Anime Art Print Set',
        description: 'Limited edition art print set featuring iconic anime scenes. Numbered and authenticated.',
        price: 2999,
        comparePrice: 3999,
        images: [
          'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800&h=800&fit=crop'
        ],
        category: 'limited',
        subcategory: 'art',
        tags: ['art print', 'collector', 'limited edition', 'anime', 'wall art'],
        sizes: ['A3 Set'],
        colors: ['Full Color'],
        stock: 25,
        featured: false,
        rating: 4.8,
        reviews: 34,
        specifications: {
          material: 'Premium Paper',
          finish: 'Matte',
          care: 'Frame recommended',
          origin: 'Made in India'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    for (const product of products) {
      const result = await db.collection('products').insertOne(product)
      console.log(`✅ Created product: ${product.name} (ID: ${result.insertedId})`)
    }

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📧 Login Credentials:')
    console.log('👤 Regular User: user@bindass.com / user123')
    console.log('👑 Admin User: admin@bindass.com / admin123')
    console.log('\n🛍️ Sample Products Created: 4 items')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await client.close()
  }
}

seedDatabase()

import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'
import User from '@/lib/models/User'
import Product from '@/lib/models/Product'
import Order from '@/lib/models/Order'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Create sample users for reviews
    const sampleUsers = [
      {
        name: 'Akira Tanaka',
        email: 'akira@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Sakura Yamamoto',
        email: 'sakura@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Ryu Nakamura',
        email: 'ryu@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Yuki Sato',
        email: 'yuki@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Hana Watanabe',
        email: 'hana@example.com',
        password: 'password123',
        role: 'user'
      }
    ]

    // Create users if they don't exist
    const createdUsers = []
    for (const userData of sampleUsers) {
      let user = await User.findOne({ email: userData.email })
      if (!user) {
        user = new User(userData)
        await user.save()
      }
      createdUsers.push(user)
    }

    // Get some products
    const products = await Product.find().limit(5)
    if (products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No products found. Please seed products first.' },
        { status: 400 }
      )
    }

    // Create sample orders for each user
    const createdOrders = []
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i]
      const product = products[i % products.length]
      
      const order = new Order({
        user: user._id,
        orderNumber: `ORD-${Date.now()}-${i}`,
        items: [{
          product: product._id,
          quantity: 1,
          price: product.price,
          total: product.price,
          size: 'M',
          color: 'Black'
        }],
        pricing: {
          subtotal: product.price,
          shipping: 50,
          tax: product.price * 0.18,
          total: product.price + 50 + (product.price * 0.18)
        },
        shippingAddress: {
          firstName: user.name.split(' ')[0] || 'John',
          lastName: user.name.split(' ')[1] || 'Doe',
          address1: '123 Anime Street',
          city: 'Tokyo',
          state: 'Tokyo',
          zipCode: '100-0001',
          country: 'Japan'
        },
        billingAddress: {
          firstName: user.name.split(' ')[0] || 'John',
          lastName: user.name.split(' ')[1] || 'Doe',
          address1: '123 Anime Street',
          city: 'Tokyo',
          state: 'Tokyo',
          zipCode: '100-0001',
          country: 'Japan'
        },
        paymentMethod: {
          type: 'cod',
          status: 'completed'
        },
        orderStatus: 'delivered'
      })
      
      await order.save()
      createdOrders.push(order)
    }

    // Sample reviews data
    const sampleReviews = [
      {
        rating: 5,
        title: 'Amazing Quality and Design!',
        comment: 'I absolutely love this anime hoodie! The print quality is fantastic and the material is so comfortable. Perfect for cosplay events and casual wear. Highly recommended!',
        isFeatured: true
      },
      {
        rating: 5,
        title: 'Perfect Fit and Fast Delivery',
        comment: 'Ordered this for my daughter and she loves it! The sizing was perfect and it arrived much faster than expected. The design is exactly like in the anime. Will definitely order more!',
        isFeatured: true
      },
      {
        rating: 4,
        title: 'Great Product, Minor Issue',
        comment: 'The t-shirt design is beautiful and the quality is good. Only minor issue was the packaging could be better, but the product itself is excellent. Good value for money.',
        isFeatured: true
      },
      {
        rating: 5,
        title: 'Exceeded Expectations!',
        comment: 'This is my third order from Bindass and they never disappoint! The attention to detail in the anime prints is incredible. Customer service is also very responsive.',
        isFeatured: true
      },
      {
        rating: 5,
        title: 'Best Anime Merchandise Store',
        comment: 'Finally found a store that understands anime fans! The collection is amazing and the quality is top-notch. My friends are all asking where I got these clothes from.',
        isFeatured: true
      },
      {
        rating: 4,
        title: 'Good Quality, Will Order Again',
        comment: 'Nice fabric quality and the print is vibrant. Took a bit longer to deliver but worth the wait. The customer support team was helpful with my queries.',
        isFeatured: false
      }
    ]

    // Create reviews
    const createdReviews = []
    for (let i = 0; i < sampleReviews.length; i++) {
      const reviewData = sampleReviews[i]
      const user = createdUsers[i % createdUsers.length]
      const order = createdOrders[i % createdOrders.length]
      const product = products[i % products.length]

      const review = new Review({
        user: user._id,
        order: order._id,
        product: product._id,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
        images: [],
        isVerifiedPurchase: true,
        isApproved: true, // Auto-approve for demo
        isFeatured: reviewData.isFeatured,
        helpfulVotes: Math.floor(Math.random() * 20) + 5
      })

      await review.save()
      createdReviews.push(review)
    }

    return NextResponse.json({
      success: true,
      message: 'Sample reviews seeded successfully',
      data: {
        usersCreated: createdUsers.length,
        ordersCreated: createdOrders.length,
        reviewsCreated: createdReviews.length
      }
    })

  } catch (error: any) {
    console.error('Seed reviews error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed reviews' },
      { status: 500 }
    )
  }
}

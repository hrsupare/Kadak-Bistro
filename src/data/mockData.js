export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'All Menu', icon: 'Utensils' },
  { id: 'starters', name: 'Starters', icon: 'Flame' },
  { id: 'pizza', name: 'Pizzas', icon: 'Pizza' },
  { id: 'burger', name: 'Burgers', icon: 'Sandwich' },
  { id: 'chinese', name: 'Chinese', icon: 'Soup' },
  { id: 'desserts', name: 'Desserts', icon: 'IceCream' },
  { id: 'drinks', name: 'Drinks', icon: 'GlassWater' }
];

export const INITIAL_MENU = [
  // STARTERS
  {
    id: 's1',
    name: 'Golden Garlic Bread',
    category: 'starters',
    price: 189,
    discountPrice: 149,
    description: 'Crispy freshly baked baguette brushed with rich garlic butter, toasted to perfection with fresh Italian herbs.',
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 128,
    prepTime: '10-12 mins',
    inStock: true,
    ingredients: ['French Baguette', 'Garlic Butter', 'Oregano', 'Parsley', 'Sea Salt'],
    spiceLevel: 1, // 1-3
    customizations: [
      { id: 'cheese', name: 'Extra Cheese', price: 49 },
      { id: 'jalapeno', name: 'Add Sliced Jalapeños', price: 29 },
      { id: 'dip', name: 'Creamy Jalapeño Dip', price: 19 }
    ]
  },
  {
    id: 's2',
    name: 'Tandoori Paneer Tikka',
    category: 'starters',
    price: 279,
    discountPrice: null,
    description: 'Cubes of fresh cottage cheese marinated in spiced yogurt and grilled in traditional clay oven with bell peppers and onions.',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 245,
    prepTime: '15-18 mins',
    inStock: true,
    ingredients: ['Cottage Cheese', 'Yogurt Marinade', 'Kashmiri Chili', 'Garam Masala', 'Bell Peppers'],
    spiceLevel: 2,
    customizations: [
      { id: 'extra-paneer', name: 'Double Cheese Cubes', price: 89 },
      { id: 'mint-chutney', name: 'Extra Mint Dip', price: 9 }
    ]
  },
  {
    id: 's3',
    name: 'Fiery Sriracha Chicken Wings',
    category: 'starters',
    price: 329,
    discountPrice: 289,
    description: 'Crispy fried chicken wings tossed in a spicy, tangy homemade glaze, topped with toasted sesame seeds and fresh scallions.',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=600',
    isVeg: false,
    isPopular: false,
    rating: 4.6,
    reviewsCount: 92,
    prepTime: '12-15 mins',
    inStock: true,
    ingredients: ['Chicken Wings', 'Sriracha Honey Glaze', 'Sesame Seeds', 'Spring Onion', 'Garlic'],
    spiceLevel: 3,
    customizations: [
      { id: 'blue-cheese', name: 'Blue Cheese Dip', price: 39 },
      { id: 'extra-spicy', name: 'Ghost Chili Hot Sauce', price: 29 }
    ]
  },

  // PIZZA
  {
    id: 'p1',
    name: 'Double Cheese Margherita',
    category: 'pizza',
    price: 349,
    discountPrice: 299,
    description: 'A classic favorite loaded with twice the amount of premium mozzarella cheese over our signature slow-cooked tomato sauce and fresh basil.',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isPopular: true,
    rating: 4.7,
    reviewsCount: 412,
    prepTime: '12-15 mins',
    inStock: true,
    ingredients: ['Hand-tossed Dough', 'San Marzano Sauce', 'Double Mozzarella', 'Fresh Basil', 'Extra Virgin Olive Oil'],
    spiceLevel: 1,
    customizations: [
      { id: 'stuffed-crust', name: 'Cheese Burst Crust', price: 99 },
      { id: 'mushrooms', name: 'Add Fresh Mushrooms', price: 39 },
      { id: 'olives', name: 'Black Olives & Jalapenos', price: 49 }
    ]
  },
  {
    id: 'p2',
    name: 'Spicy Peri-Peri Chicken Pizza',
    category: 'pizza',
    price: 449,
    discountPrice: null,
    description: 'Fired peri-peri grilled chicken chunks, red onions, colorful bell peppers, and fresh cilantro on a bed of spicy marinara and melted mozzarella.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600',
    isVeg: false,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 189,
    prepTime: '15-18 mins',
    inStock: true,
    ingredients: ['Rustic Pizza Dough', 'Spicy Pizza Sauce', 'Peri Peri Chicken Chunks', 'Red Peppers', 'Mozzarella'],
    spiceLevel: 3,
    customizations: [
      { id: 'extra-chicken', name: 'Extra Chicken Chunks', price: 79 },
      { id: 'stuffed-crust', name: 'Cheese Burst Crust', price: 99 },
      { id: 'capsicum', name: 'Extra Capsicum & Onion', price: 29 }
    ]
  },

  // BURGERS
  {
    id: 'b1',
    name: 'Classic Veggie Crunch Burger',
    category: 'burger',
    price: 169,
    discountPrice: 139,
    description: 'A crispy vegetable patty layered with fresh butter lettuce, sliced tomatoes, gherkins, cheddar cheese, and signature house-made burger sauce.',
    image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isPopular: false,
    rating: 4.5,
    reviewsCount: 310,
    prepTime: '8-10 mins',
    inStock: true,
    ingredients: ['Crispy Veg Patty', 'Toasted Sesame Bun', 'Cheddar Slice', 'Pickles', 'Lettuce', 'Mayo Sauce'],
    spiceLevel: 1,
    customizations: [
      { id: 'extra-patty', name: 'Double Crunchy Patty', price: 59 },
      { id: 'cheese-slice', name: 'Extra Cheese Slice', price: 19 },
      { id: 'fries-combo', name: 'Add Fries & Drink', price: 79 }
    ]
  },
  {
    id: 'b2',
    name: 'Smokehouse BBQ Chicken Burger',
    category: 'burger',
    price: 249,
    discountPrice: null,
    description: 'Flame-grilled juicy chicken breast smothered in smoky Hickory BBQ sauce, crisp onion rings, melted cheddar, and chipotle garlic spread.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600',
    isVeg: false,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 156,
    prepTime: '10-12 mins',
    inStock: true,
    ingredients: ['Grilled Chicken Breast', 'Smokey BBQ Glaze', 'Onion Rings', 'Brioche Bun', 'Cheddar'],
    spiceLevel: 2,
    customizations: [
      { id: 'bacon', name: 'Crispy Strips (Halal)', price: 39 },
      { id: 'fries-combo', name: 'Add Fries & Drink', price: 79 },
      { id: 'extra-cheese', name: 'Double Liquid Cheese', price: 29 }
    ]
  },

  // CHINESE
  {
    id: 'c1',
    name: 'Schezwan Chili Garlic Noodles',
    category: 'chinese',
    price: 219,
    discountPrice: 189,
    description: 'Wok-tossed Hakka noodles stir-fried in a fiery homemade Schezwan sauce, loads of minced garlic, bell peppers, carrots, and spring onion greens.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isPopular: true,
    rating: 4.6,
    reviewsCount: 174,
    prepTime: '10-12 mins',
    inStock: true,
    ingredients: ['Hakka Noodles', 'Schezwan Chilli Paste', 'Minced Garlic', 'Mixed Julienne Veggies', 'Soya Sauce'],
    spiceLevel: 3,
    customizations: [
      { id: 'paneer-cubes', name: 'Add Fried Paneer Cubes', price: 49 },
      { id: 'scrambled-egg', name: 'Add Scrambled Egg', price: 29 },
      { id: 'manchurian-balls', name: 'Add Manchurian Balls (3 pcs)', price: 39 }
    ]
  },
  {
    id: 'c2',
    name: 'Steamed Classic Dumplings',
    category: 'chinese',
    price: 189,
    discountPrice: null,
    description: 'Delicate hand-folded parcels filled with a flavorful mixture of finely minced garden vegetables and soy seasoning. Served with hot chilli sauce.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isPopular: false,
    rating: 4.4,
    reviewsCount: 110,
    prepTime: '12-15 mins',
    inStock: true,
    ingredients: ['Dimsum Wrapper', 'Cabbage & Carrot Filling', 'Soy Sauce', 'Sesame Oil', 'Ginger Garlic'],
    spiceLevel: 1,
    customizations: [
      { id: 'fried-style', name: 'Deep Fried Dumplings', price: 19 },
      { id: 'cheese-stuffing', name: 'Stuffed Cream Cheese', price: 39 },
      { id: 'spicy-dip', name: 'Schezwan Chilli Oil Dip', price: 9 }
    ]
  },

  // DESSERTS
  {
    id: 'd1',
    name: 'Hot Chocolate Lava Brownie',
    category: 'desserts',
    price: 199,
    discountPrice: 179,
    description: 'Warm fudge cake with a gooey, molten rich chocolate center. Served alongside a scoop of premium Madagascan vanilla bean gelato.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 520,
    prepTime: '6-8 mins',
    inStock: true,
    ingredients: ['Belgian Cocoa Powder', 'Gooey Fudge Core', 'Brownie Batter', 'Vanilla Ice Cream Gelato'],
    spiceLevel: 1,
    customizations: [
      { id: 'extra-icecream', name: 'Add Double Ice Cream Scoop', price: 49 },
      { id: 'fudge-sauce', name: 'Drizzle Warm Caramel Sauce', price: 19 },
      { id: 'crushed-nuts', name: 'Sprinkle Roasted Almonds', price: 19 }
    ]
  },
  {
    id: 'd2',
    name: 'Premium Red Velvet Pastry',
    category: 'desserts',
    price: 159,
    discountPrice: null,
    description: 'Layers of vibrant red velvet sponge cake combined with silky vanilla cream cheese frosting and sweet white chocolate shavings.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isPopular: false,
    rating: 4.7,
    reviewsCount: 88,
    prepTime: '5 mins',
    inStock: true,
    ingredients: ['Red Velvet Cocoa Sponge', 'Cream Cheese Frosting', 'White Chocolate Curls', 'Vanilla Glaze'],
    spiceLevel: 1,
    customizations: [
      { id: 'chocolate-drizzle', name: 'Chocolate Ganache Drizzle', price: 19 }
    ]
  },

  // DRINKS
  {
    id: 'dr1',
    name: 'Fresh Mint & Lime Mojito',
    category: 'drinks',
    price: 129,
    discountPrice: 99,
    description: 'A refreshing mix of crushed fresh mint leaves, squeezed lime wedges, sugarcane syrup, and chilled soda water over crushed ice cubes.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 231,
    prepTime: '5 mins',
    inStock: true,
    ingredients: ['Mint Sprigs', 'Lime Wedges', 'Club Soda', 'Brown Sugar Syrup', 'Crushed Ice'],
    spiceLevel: 1,
    customizations: [
      { id: 'extra-lime', name: 'Double Citrus Squeeze', price: 9 },
      { id: 'flavored-mojito', name: 'Infuse Fresh Blue Curacao Syrup', price: 19 }
    ]
  },
  {
    id: 'dr2',
    name: 'Iced Salted Caramel Macchiato',
    category: 'drinks',
    price: 179,
    discountPrice: null,
    description: 'Chilled Arabica double espresso shots layered with whole milk, sweet vanilla bean syrup, and a rich ribbon drizzle of salted dark caramel sauce.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isPopular: true,
    rating: 4.7,
    reviewsCount: 142,
    prepTime: '6 mins',
    inStock: true,
    ingredients: ['Arabica Espresso', 'Whole Cold Milk', 'Salted Caramel Syrup', 'Ice Cubes'],
    spiceLevel: 1,
    customizations: [
      { id: 'oat-milk', name: 'Substitute with Creamy Oat Milk', price: 39 },
      { id: 'extra-shot', name: 'Add Extra Espresso Shot', price: 29 },
      { id: 'whipped-cream', name: 'Top with Whipped Cream', price: 19 }
    ]
  },
  {
    id: 'dr3',
    name: 'Out of Stock Mocktail',
    category: 'drinks',
    price: 149,
    discountPrice: null,
    description: 'A mocktail item configured as out-of-stock to demonstrate the customer UI badge.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600',
    isVeg: true,
    isPopular: false,
    rating: 4.2,
    reviewsCount: 18,
    prepTime: '5 mins',
    inStock: false,
    ingredients: ['Orange Juice', 'Grenadine', 'Soda'],
    spiceLevel: 1,
    customizations: []
  }
];

export const MOCK_COUPONS = [
  { code: 'WELCOMFOD', discountPercent: 20, description: 'Get 20% off on your absolute first order! No minimum spend.', minSpend: 0 },
  { code: 'CRUNCHY50', discountPercent: 50, description: 'Flat 50% discount on order value of ₹500 or more.', minSpend: 500 },
  { code: 'FREEZE10', discountPercent: 10, description: 'Save 10% on soft drinks and desserts, minimum order ₹200.', minSpend: 200 }
];

export const MOCK_REVIEWS = [
  { id: 1, name: 'Siddharth M.', rating: 5, date: 'Yesterday', comment: 'The Golden Garlic Bread was absolute heaven! Crisp exterior, super warm garlic melting interior. Highly recommend getting extra cheese customization!' },
  { id: 2, name: 'Nikita R.', rating: 4, date: '3 days ago', comment: 'Loved the Margherita Pizza! Crust was airy and authentic. Sriracha wings were a tad bit too hot for my preference but still super crispy and fresh.' },
  { id: 3, name: 'Amit K.', rating: 5, date: '1 week ago', comment: 'Fabulous system. Literally just scanned table 4 QR code, placed order for noodles and mojito, and got it delivered within 12 minutes hot. Very sleek experience!' }
];

export const INITIAL_SETTINGS = {
  restaurantName: ' Kadak Bistro',
  tagline: 'Gourmet Dining Elevated',
  address: 'High-Tech District, Suite 101, Bengaluru, Karnataka, 560001',
  gstNumber: '29AAAAA0000A1Z5',
  gstRatePercent: 5, // 5% GST
  serviceTaxPercent: 2.5, // 2.5% Service Tax
  contactEmail: 'hello@antigravitybistro.com',
  contactPhone: '+91 98765 43210',
  deliveryCharge: 0, // QR counter table dining
  timings: '11:00 AM - 11:30 PM',
  isDarkTheme: false,
  soundNotifications: true
};

export const INITIAL_ORDERS = [
  {
    id: 'ORD-8931',
    customerName: 'Rohit Sharma',
    mobileNumber: '9876543221',
    tableNumber: '3',
    items: [
      {
        id: 's1',
        name: 'Golden Garlic Bread',
        price: 149,
        quantity: 2,
        customizations: [{ name: 'Extra Cheese', price: 49 }]
      },
      {
        id: 'dr1',
        name: 'Fresh Mint & Lime Mojito',
        price: 99,
        quantity: 1,
        customizations: []
      }
    ],
    specialInstructions: 'Please make the garlic bread extra toasted.',
    paymentMethod: 'Pay Now (UPI)',
    paymentStatus: 'Paid',
    status: 'Completed', // Received, Preparing, Ready, Served/Completed, Cancelled
    timestamp: '2026-05-28T11:45:00Z',
    subTotal: 397,
    taxAmount: 29.78,
    grandTotal: 426.78
  },
  {
    id: 'ORD-9281',
    customerName: 'Ananya Iyer',
    mobileNumber: '8877665544',
    tableNumber: '7',
    items: [
      {
        id: 'p1',
        name: 'Double Cheese Margherita',
        price: 299,
        quantity: 1,
        customizations: [{ name: 'Cheese Burst Crust', price: 99 }]
      }
    ],
    specialInstructions: '',
    paymentMethod: 'Pay Later (Cash)',
    paymentStatus: 'Pending',
    status: 'Preparing',
    timestamp: '2026-05-28T12:20:00Z',
    subTotal: 398,
    taxAmount: 29.85,
    grandTotal: 427.85
  },
  {
    id: 'ORD-9532',
    customerName: 'Vikram Seth',
    mobileNumber: '7766554433',
    tableNumber: '5',
    items: [
      {
        id: 'c1',
        name: 'Schezwan Chili Garlic Noodles',
        price: 189,
        quantity: 1,
        customizations: [{ name: 'Add Fried Paneer Cubes', price: 49 }]
      },
      {
        id: 'd1',
        name: 'Hot Chocolate Lava Brownie',
        price: 179,
        quantity: 1,
        customizations: []
      }
    ],
    specialInstructions: 'Noodles should be extremely spicy!',
    paymentMethod: 'Pay Now (Card)',
    paymentStatus: 'Paid',
    status: 'Received',
    timestamp: '2026-05-28T12:44:00Z',
    subTotal: 417,
    taxAmount: 31.28,
    grandTotal: 448.28
  }
];

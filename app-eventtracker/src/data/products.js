const createProduct = (id, name, category, imageQuery, description) => ({
  id,
  name,
  category,
  image: `https://source.unsplash.com/featured/300x300/?${imageQuery}`,
  description
});

const productsData = [
  ["1", "iPhone 15", "mobiles", "iphone,smartphone", "The latest iPhone with cutting-edge features and sleek design."],
  ["2", "Samsung Galaxy", "mobiles", "samsung,smartphone", "A powerful smartphone with advanced features."],
  ["3", "T-Shirt", "clothing", "t-shirt,clothing", "A comfortable and stylish t-shirt for everyday wear."],
  ["4", "Jeans", "clothing", "jeans,denim", "Stylish and durable jeans for any occasion."],
  ["5", "Running Shoes", "footwear", "running-shoes,sneakers", "Comfortable running shoes for your daily workouts."],
  ["6", "Sneakers", "footwear", "sneakers,shoes", "Trendy sneakers for casual outings."],
  ["7", "Wireless Headphones", "accessories", "headphones,wireless", "Noise-cancelling over-ear headphones with long battery life."],
  ["8", "Smartwatch Pro", "wearables", "smartwatch,wearable", "Track fitness, notifications and more with a sleek smartwatch."],
  ["9", "Coffee Maker", "kitchen", "coffee-maker,kitchen", "Brew barista-style coffee at home with this compact machine."],
  ["10", "Ceramic Dinner Set", "home", "dinnerware,tableware", "12-piece ceramic dinnerware set, dishwasher safe."],
  ["11", "Gaming Keyboard", "gaming", "mechanical-keyboard,gaming", "Mechanical keyboard with RGB lighting and programmable keys."],
  ["12", "Bestseller Novel", "books", "book,novel", "A gripping bestseller novel to keep you entertained."],
  ["13", "Bluetooth Speaker", "accessories", "bluetooth-speaker,portable", "Portable waterproof speaker with deep bass and long battery life."],
  ["14", "4K Monitor", "electronics", "4k-monitor,display", "27-inch 4K UHD monitor with HDR support and thin bezels."],
  ["15", "Yoga Mat", "fitness", "yoga-mat,fitness", "Non-slip eco-friendly yoga mat with extra cushioning for comfort."],
  ["16", "Blender Pro", "kitchen", "blender,kitchen-appliance", "High-speed blender for smoothies, soups, and sauces with multiple presets."],
  ["17", "Leather Wallet", "accessories", "leather-wallet,wallet", "Slim full-grain leather wallet with RFID protection."],
  ["18", "Electric Kettle", "kitchen", "electric-kettle,kettle", "Fast-boil electric kettle with auto shut-off and temperature control."]
];

export default productsData.map(
  ([id, name, category, imageQuery, description]) =>
    createProduct(id, name, category, imageQuery, description)
);
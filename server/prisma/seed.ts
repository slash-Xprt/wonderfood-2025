import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete all existing products
  await prisma.product.deleteMany({});
  console.log('Deleted existing products');

  // Create new products
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Burger Classique",
        description: "Steak de bœuf 100% avec laitue fraîche, tomate et notre sauce spéciale",
        price: 11.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        category: "Burgers",
        isActive: true,
        stock: 50
      },
      {
        name: "Pizza Margherita",
        description: "Mozzarella fraîche, tomates et basilic sur notre pâte maison",
        price: 13.99,
        image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
        category: "Pizzas",
        isActive: true,
        stock: 30
      },
      {
        name: "Salade César",
        description: "Laitue romaine croquante, parmesan, croûtons et sauce César",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80",
        category: "Salades",
        isActive: true,
        stock: 25
      },
      {
        name: "Ailes de Poulet",
        description: "Ailes croustillantes avec sauce au choix",
        price: 10.99,
        image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80",
        category: "Entrées",
        isActive: true,
        stock: 40
      },
      {
        name: "Pâtes Carbonara",
        description: "Pâtes fraîches avec sauce crémeuse, lardons et parmesan",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80",
        category: "Pâtes",
        isActive: true,
        stock: 35
      },
      {
        name: "Sushi Mix",
        description: "Assortiment de 12 pièces de sushi avec sauce soja",
        price: 15.99,
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
        category: "Sushis",
        isActive: true,
        stock: 20
      }
    ]
  });

  console.log(`Created ${products.count} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
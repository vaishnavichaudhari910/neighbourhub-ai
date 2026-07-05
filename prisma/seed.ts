import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Categories
  const cats = await Promise.all([
    prisma.category.upsert({ where: { slug: "electrician" }, update: {}, create: { name: "Electrician", slug: "electrician", icon: "⚡", description: "Electrical repairs and installations" } }),
    prisma.category.upsert({ where: { slug: "plumber" }, update: {}, create: { name: "Plumber", slug: "plumber", icon: "🔧", description: "Plumbing repairs and installations" } }),
    prisma.category.upsert({ where: { slug: "ac-repair" }, update: {}, create: { name: "AC Repair", slug: "ac-repair", icon: "❄️", description: "AC servicing and repairs" } }),
    prisma.category.upsert({ where: { slug: "cleaning" }, update: {}, create: { name: "Cleaning", slug: "cleaning", icon: "🧹", description: "Home and office cleaning" } }),
    prisma.category.upsert({ where: { slug: "carpenter" }, update: {}, create: { name: "Carpenter", slug: "carpenter", icon: "🪚", description: "Furniture and woodwork" } }),
    prisma.category.upsert({ where: { slug: "computer-repair" }, update: {}, create: { name: "Computer Repair", slug: "computer-repair", icon: "💻", description: "Computer and laptop repairs" } }),
  ])

  // Provider users
  const hash = await bcrypt.hash("Provider@123", 12)
  const providerData = [
    { name: "Ramesh Electricals", email: "ramesh@provider.com", city: "Pune", exp: 8, rating: 4.9, cat: 0 },
    { name: "Suresh Plumbing", email: "suresh@provider.com", city: "Mumbai", exp: 6, rating: 4.8, cat: 1 },
    { name: "CoolAir Services", email: "coolair@provider.com", city: "Pune", exp: 5, rating: 4.7, cat: 2 },
    { name: "CleanPro Team", email: "cleanpro@provider.com", city: "Nashik", exp: 4, rating: 4.9, cat: 3 },
    { name: "WoodCraft Studio", email: "woodcraft@provider.com", city: "Pune", exp: 10, rating: 4.8, cat: 4 },
    { name: "TechFix Solutions", email: "techfix@provider.com", city: "Mumbai", exp: 7, rating: 4.7, cat: 5 },
  ]

  for (const pd of providerData) {
    const user = await prisma.user.upsert({
      where: { email: pd.email }, update: {},
      create: { name: pd.name, email: pd.email, passwordHash: hash, role: "PROVIDER", emailVerified: new Date() },
    })
    const provider = await prisma.provider.upsert({
      where: { userId: user.id }, update: {},
      create: { userId: user.id, bio: `Professional ${pd.name} with ${pd.exp} years experience.`, experience: pd.exp, isVerified: true, rating: pd.rating, totalReviews: Math.floor(Math.random() * 200 + 50), city: pd.city },
    })
    const services = [
      { title: `${cats[pd.cat].name} - Basic`, description: `Professional ${cats[pd.cat].name.toLowerCase()} service with quality guarantee.`, price: 299 + pd.cat * 50 },
      { title: `${cats[pd.cat].name} - Premium`, description: `Premium ${cats[pd.cat].name.toLowerCase()} with 30-day warranty on all work.`, price: 599 + pd.cat * 100 },
    ]
    for (const svc of services) {
      const existing = await prisma.service.findFirst({ where: { providerId: provider.id, title: svc.title } })
      if (!existing) {
        await prisma.service.create({ data: { ...svc, providerId: provider.id, categoryId: cats[pd.cat].id } })
      }
    }
  }
  console.log("✅ Seed complete!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
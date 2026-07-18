require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.provider.updateMany({
    data: { isVerified: true }
  })
  console.log('Updated providers:', result.count)
  await prisma.$disconnect()
}

main().catch(console.error)
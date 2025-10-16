import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.valuation.deleteMany();
  await prisma.property.deleteMany();

  const p1 = await prisma.property.create({
    data: { name: "Springfield Lakes House", address: "12 Lakeview Dr, Springfield Lakes QLD" }
  });

  const now = new Date();
  const months = (n: number) => new Date(now.getFullYear(), now.getMonth() - n, 15);

  await prisma.valuation.createMany({
    data: [
      { propertyId: p1.id, amount: 620_000_00, valuedAt: months(12) },
      { propertyId: p1.id, amount: 640_000_00, valuedAt: months(6) },
      { propertyId: p1.id, amount: 655_000_00, valuedAt: months(3) },
      { propertyId: p1.id, amount: 660_000_00, valuedAt: months(0) }
    ]
  });

  console.log("Seeded.");
}
main().finally(() => prisma.$disconnect());

import { PrismaClient, ColorType } from '@prisma/client';

const prisma = new PrismaClient();

const COLORS: ColorType[] = [
  ColorType.RED,
  ColorType.GREEN,
  ColorType.BLUE,
  ColorType.YELLOW,
  ColorType.BLACK,
  ColorType.WHITE,
  ColorType.GRAY,
  ColorType.PURPLE,
  ColorType.ORANGE,
  ColorType.PINK,
  ColorType.BROWN,
  ColorType.GOLD,
  ColorType.SILVER,
];

async function main() {
  console.log('🎨 Seeding colors...\n');

  for (const colorType of COLORS) {
    const existing = await prisma.color.findFirst({
      where: { color: colorType },
    });

    if (!existing) {
      await prisma.color.create({
        data: {
          color: colorType,
          isActive: true,
        },
      });
      console.log(`✔ Color created: ${colorType}`);
    } else {
      console.log(`– Color already exists: ${colorType}`);
    }
  }

  console.log('\n✅ All colors seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

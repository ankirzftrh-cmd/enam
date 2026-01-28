const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const name = "Emas Batangan";
    const slug = "emas-batangan";

    const exists = await prisma.category.findFirst({
        where: { name: name }
    });

    if (!exists) {
        console.log(`Creating category: ${name}...`);
        await prisma.category.create({
            data: {
                name: name,
                slug: slug,
                parentId: null // Ensure it is a parent category
            }
        });
        console.log("Category created successfully.");
    } else {
        console.log(`Category '${name}' already exists.`);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

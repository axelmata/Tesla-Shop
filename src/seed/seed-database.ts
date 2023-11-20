import { initialData } from "./seed";
import prisma from "../lib/prisma";



async function main() {

    //1. Eliminar registros previos
    // await Promise.all([
        await prisma.productImage.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
    // ])


    const { categories, products } = initialData;

    const categoriesData = categories.map((name) => ({ name }))

    await prisma.category.createMany({
        data: categoriesData
    })


    const categoriesDB = await prisma.category.findMany()

    const categoriesMap = categoriesDB.reduce((map, category) => {

        map[category.name.toLowerCase()] = category.id;

        return map;

    }, {} as Record<string, string>)


    products.forEach(async (product) => {

        const { type, images, ...rest } = product;

        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type]
            }
        });



        const imagesData = images.map(image => ({
            url: image,
            productId: dbProduct.id
        }))

        await prisma.productImage.createMany({
            data: imagesData
        });

    });


    console.log('Seed ejecutado exitosamente')
}





(() => {
    main();
})();
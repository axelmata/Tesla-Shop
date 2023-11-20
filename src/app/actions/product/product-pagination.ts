'use server'

import prisma from "@/lib/prisma"

interface PaginationOpcions{
    page?: number
    task?: number
}

export const getPaginatedProductsWhitImage = async ({ 
    page = 1,
    task = 12
 }:PaginationOpcions) => {

    if(isNaN(Number(page))) page = 1;
    if(page < 1) page= 1;


    try {

        // paso 1: obtener los productos
        const products = await prisma.product.findMany({
            take: task,
            skip: (page - 1) * task,
            include: {
                ProductImage: {
                    take: 2,
                    select: {
                        url: true
                    }
                }
            }
        });

        //Paso 2: obtener el total de paginas
        const productCount = await prisma.product.count({});
        const totalPage = Math.ceil(productCount / task)

        return {
            currentPage: page,
            totalPages: totalPage,
            products: products.map(product => ({
                ...product,
                images: product.ProductImage.map(image => image.url)
            }))
        }

    } catch (error) {
        throw new Error('No se pudo cargar los productos')
    }   
}
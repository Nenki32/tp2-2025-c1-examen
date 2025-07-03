import { findAllSales,findSaleById,findSalesByEmail,updateSaleCoupon,aggregateTopProducts,countTotalSales } from "../data/salesData.js";

export const getSales = async (page, pageSize) => {
    return await findAllSales(page, pageSize);
}

export const getSaleByIdService = async (id) => {
     try {
        const sale = await findSaleById(id);
        return sale;
    } catch (error) {
        console.error("Error en getSaleByIdService:", error);
        throw error;
    }
};

export const getSalesWithTotalService = async (page, pageSize) => {
  try {
        const skip = (page - 1) * pageSize;
        const totalCount = await countTotalSales();
        const sales = await findAllSales(page, pageSize);
        const salesWithTotal = sales.map(sale => {
            let total = 0;
            if (sale.items && Array.isArray(sale.items)) {
                total = sale.items.reduce((sum, item) => {
                    const itemTotal = (item.price || 0) * (item.quantity || 0);
                    return sum + itemTotal;
                }, 0);
            }
            
            return {
                ...sale,
                total: parseFloat(total.toFixed(2))
            };
        });

        return {
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
            totalSales: totalCount,
            sales: salesWithTotal
        };
    } catch (error) {
        console.error("Error en getSalesWithTotalService:", error);
        throw new Error("Error al obtener ventas con total");
    }
};

export const getSalesByCustomerEmailService = async (email) => {
    try {
        const sales = await findSalesByEmail(email);
        return sales;
    } catch (error) {
        console.error("Error en getSalesByCustomerEmailService:", error);
        throw new Error("Error al obtener ventas por email");
    }
};

export const updateCouponUsedService = async (saleId, couponUsed) => {
    try {
        const sale = await updateSaleCoupon(saleId, couponUsed);
        if(!sale){
            return{
                success: false,
                message: "Venta no encontrada"
            };
        }
        const result = await updateSaleCoupon(saleId, couponUsed);
        if(result.modifiedCount === 0){
            return{
                success: false,
                message: "No se pudo Actualizar el cupon"
            }
        }
        const updatedSale = await findSaleById(saleId);
        return {
            success: true,
            sale: updatedSale
        };
    } catch (error) {
        console.error("Error en updateCouponUsedService:", error);
        throw error;
    }
};

export const getTopProductsService = async (limit) => {
    try {
        const topProducts = await aggregateTopProducts(limit);
        const formattedProducts = topProducts.map((product, index) => ({
            rank: index + 1,
            productName: product._id,
            totalQuantitySold: product.totalQuantity,
            totalRevenue: parseFloat(product.totalRevenue.toFixed(2)),
            salesCount: product.count
        }));
        
        return formattedProducts;
    } catch (error) {
        console.error("Error en getTopProductsService:", error);
        throw new Error("Error al obtener productos más vendidos");
    }
};
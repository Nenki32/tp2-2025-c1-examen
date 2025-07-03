import { getDbSupplies } from "./connection.js";
import { ObjectId } from "mongodb";

export async function findAllSales(page, pageSize) {
    const db = getDbSupplies();
    if (page && pageSize) {
        const skip = (page - 1) * pageSize;
        const sales = await db.collection("sales")
            .find()
            .skip(skip)
            .limit(pageSize)
            .toArray();
        return sales;
    } else {
        // Sin paginación: trae todos los documentos
        const sales = await db.collection("sales").find().toArray();
        return sales;
    }
}

export async function findSaleById(saleId) {
    try {
        const db = getDbSupplies();
        if (!ObjectId.isValid(saleId)) {
            throw new Error("ID de venta inválido");
        }
        const sale = await db
            .collection("sales")
            .findOne({ _id: new ObjectId(saleId) });
        
        return sale;
    } catch (error) {
        console.error("Error al buscar venta por ID:", error);
        throw error;
    }
}

export async function countTotalSales() {
    try {
        const db = getDbSupplies();
        const count = await db.collection("sales").countDocuments();
        return count;
    } catch (error) {
        console.error("Error al contar ventas:", error);
        throw error;
    }
}

export async function findSalesByEmail(email) {
    try {
        const db = getDbSupplies();
        const sales = await db
            .collection("sales")
            .find({ 
                "customer.email": { 
                    $regex: new RegExp(`^${email}$`, 'i') 
                } 
            })
            .toArray();
        return sales;
    } catch (error) {
        console.error("Error al buscar ventas por email:", error);
        throw new Error("Error al buscar ventas del cliente");
    }
}

export async function updateSaleCoupon(saleId,couponUsed) {
    try{
        const db = getDbSupplies();
        if(!ObjectId.isValid(saleId)){
            throw new Error("ID de venta inválido");
        }
      const result = await db
            .collection("sales")
            .updateOne(
                { _id: new ObjectId(saleId) },
                { 
                    $set: { 
                        couponUsed: couponUsed,
                        updatedAt: new Date()
                    } 
                }
            );
            return result;
    } catch (error) {
        console.error("Error al actualizar la venta:", error);
        throw error;
    }
}

export async function aggregateTopProducts(limit) {
    try {
        const db = getDbSupplies();
        const pipeline = [
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",  // <-- o "$items.name" si es name
                    totalQuantity: { $sum: "$items.qty" },  // <-- o "$items.quantity"
                    totalRevenue: {
                        $sum: {
                            $multiply: [ "$items.cost", "$items.qty" ]  // <-- o price & quantity
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: limit }
        ];

        const topProducts = await db.collection("sales").aggregate(pipeline).toArray();

        return topProducts;

    } catch (error) {
        console.error("Error en agregación de top productos:", error);
        throw new Error("Error al calcular productos más vendidos");
    }
}



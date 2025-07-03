import { getSales,getSaleByIdService,getSalesWithTotalService,getSalesByCustomerEmailService,updateCouponUsedService,getTopProductsService } from "../services/salesService.js";

export const getAllSales = async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : undefined;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : undefined;
        const sales = await getSales(page, pageSize);
        res.json(sales);
    } catch (error) {
        console.log("Error fetching sales: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getSaleById = async (req, res) => {
    
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({message: "Faltan campos obligatorios (id)"});
        }
        const sale = await getSaleByIdService(id);
        if(!sale){
            return res.status(404).json({message: "Venta no encontrada"});
        }
         res.json({
            message: "Venta obtenida exitosamente",
            sale: sale
        });

    } catch (error) {
        console.error("Error al obtener la venta:", error);
        if(error.message.includes("ID invalido")){
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({ message: "Error interno al obtener la venta" });
    }
};

export const getSalesWithTotal = async (req, res) => {
    
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        const result = await getSalesWithTotalService(page, pageSize);
        res.json({
            message: "Ventas obtenidas exitosamente",
            ...result
        });
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        res.status(500).json({ message: "Error interno al obtener las ventas" });
        
    }
};

export const getSalesByCustomerEmail = async (req, res) => {
    
    try {
        const {email} = req.params;
        if(!email){
            return res.status(400).json({message: "Faltan campos obligatorios (email)"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Email no valido"});
        }
        const sales = await getSalesByCustomerEmailService(email);
        res.json({
            message: "Ventas obtenidas exitosamente",
            sales: sales
        });
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        res.status(500).json({ message: "Error interno al obtener las ventas" });
        
    }
};

export const updateCouponUsed = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Falta el body de la solicitud" });
        }

        const { id } = req.params;
        const { couponUsed } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        if (typeof couponUsed !== 'boolean') {
            return res.status(400).json({ 
                message: "El campo couponUsed debe ser un booleano" 
            });
        }

        const sale = await updateCouponUsedService(id, couponUsed);

        res.json({
            message: "Venta actualizada exitosamente",
            sale: sale
        });
    } catch (error) {
        console.error("Error al actualizar la venta:", error);
        res.status(500).json({ message: "Error interno al actualizar la venta" });
    }
};

export const getTopProducts = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 5;
       if (isNaN(limit) || limit < 1) {
            return res.status(400).json({ 
                message: "El límite debe ser un número mayor a 0" 
            });
        }
        const topProducts = await getTopProductsService(limit);

        res.json({
            message: `Top ${limit} productos más vendidos`,
            limit: limit,
            products: topProducts
        });
    } catch (error) {
        console.error("Error al obtener el top de productos:", error);
        res.status(500).json({ message: "Error interno al obtener el top de productos" });
    }
}

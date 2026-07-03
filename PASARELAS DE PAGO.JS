/**
 * Sistema de cálculo de descuentos por fidelidad con múltiples pasarelas de pago
 * Cada método de pago puede otorgar diferentes rebajas o aplicar comisiones de procesamiento
 */

// Configuración de métodos de pago
const CONFIG_METODOS = {
    wm: {
        nombre: "Wallet Móvil",
        porcentajeFidelidad: 0.10,
        cupon: 5,
        moneda: "$",
        comisionPasarela: 0
    },
    cc: {
        nombre: "Tarjeta de Crédito",
        porcentajeFidelidad: 0.05,
        cupon: 0,
        moneda: "$",
        comisionPasarela: 0.02 // 2% de comisión por procesamiento bancario
    },
    mx: { // Mapeado del antiguo objeto mx
        nombre: "Mercado Pago",
        porcentajeFidelidad: 0.08,
        cupon: 0,
        moneda: "$",
        comisionPasarela: 0.01 // 1% de comisión
    },
    gt: { // Mapeado del antiguo objeto gt
        nombre: "GuatePay Digital",
        porcentajeFidelidad: 0.06,
        cupon: 0,
        moneda: "Q",
        comisionPasarela: 0
    },
    default: {
        nombre: "Otro método de pago",
        porcentajeFidelidad: 0.03,
        cupon: 0,
        moneda: "$",
        comisionPasarela: 0
    }
};

/**
 * Calcula el total a pagar con configuración por método de pago
 * @param {number} totalBruto - Costo original del carrito de compras
 * @param {number} baseCompra - Monto base sobre el cual aplica la rebaja de fidelidad
 * @param {string} metodoPago - Código del método de pago (wm, cc, mx, gt, etc.)
 * @param {Object} opciones - Configuraciones adicionales o promociones de caja
 * @returns {Object} Resultado detallado de la facturación
 */
function calcularFacturacionAvanzada(totalBruto, baseCompra, metodoPago, opciones = {}) {
    // Obtener configuración del método de pago
    const metodoNormalizado = metodoPago.toLowerCase();
    const config = CONFIG_METODOS[metodoNormalizado] || CONFIG_METODOS.default;
    
    // Validaciones
    if (totalBruto <= 0) throw new Error("El total bruto debe ser positivo");
    if (baseCompra < 0) throw new Error("La base de compra no puede ser negativa");
    
    // Cálculos
    const rebajaFidelidad = baseCompra * config.porcentajeFidelidad;
    const cargoComision = totalBruto * (config.comisionPasarela || 0);
    let neto = totalBruto - rebajaFidelidad + cargoComision;
    
    // Aplicar cupón fijo (Descuento a favor del cliente)
    if (config.cupon > 0) {
        neto -= config.cupon;
    }
    
    // Aplicar código promocional adicional si existe en caja
    if (opciones.codigoPromocional) {
        neto -= opciones.codigoPromocional;
    }
    
    // Evitar saldos negativos accidentales
    if (neto < 0) neto = 0;
    
    // Redondear
    neto = Math.round(neto * 100) / 100;
    
    // Retornar objeto con detalles
    return {
        metodo: metodoNormalizado,
        nombreMetodo: config.nombre,
        moneda: config.moneda,
        totalBruto: totalBruto,
        baseCompra: baseCompra,
        porcentajeFidelidad: config.porcentajeFidelidad * 100 + "%",
        descuentoAplicado: rebajaFidelidad,
        comisionPasarela: cargoComision,
        cuponAplicado: config.cupon || 0,
        totalNeto: neto,
        totalDescuentos: rebajaFidelidad + (config.cupon || 0),
        formula: `(${totalBruto} - ${rebajaFidelidad} + ${cargoComision}) - ${config.cupon || 0} = ${neto}`
    };
}

// Ejemplo de uso avanzado
console.log("\n=== SISTEMA MULTI-PASARELA DE PAGO ===");
const resultadoWM = calcularFacturacionAvanzada(1000, 150, "WM");
const resultadoCC = calcularFacturacionAvanzada(1000, 150, "CC");
const resultadoMX = calcularFacturacionAvanzada(1000, 150, "MX");

console.log("📊 Wallet Móvil:", resultadoWM);
console.log("📊 Tarjeta Crédito:", resultadoCC);
console.log("📊 Mercado Pago:", resultadoMX);
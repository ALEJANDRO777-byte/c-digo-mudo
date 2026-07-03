# 📄 Módulo de Descuentos por Fidelidad - Comercio Electrónico

## 📌 Descripción General

Este módulo proporciona una función para calcular el **total a pagar** después de aplicar una rebaja del 10% sobre el monto de compra base, y opcionalmente otorgar un beneficio fijo de $5 para compras realizadas con el método de pago digital.

---

## 🎯 ¿Qué hace la función?

- Calcula una **reducción del 10%** sobre el costo acumulado de los artículos.
- Resta dicho beneficio al total bruto del carrito.
- **Si el método de pago es "WM" (Wallet Móvil)**, descuenta un **monto adicional de $5** al resultado.
- Retorna el **valor neto a facturar**.

---

## 📊 Fórmula Matemática

### Para método de pago "WM" (Wallet Móvil):
Total_Final = Total_Bruto - (Base_Compra * 0.10) - 5

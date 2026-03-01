// =============================================================
// PAPER DATA — Single source of truth for ALL paper content data
// Used by: MDX components, DashboardWidgets, ExportJsonButton
// =============================================================

// ---- 00. OVERVIEW ----

export const kpisOverview = [
    { label: 'MRR', value: '€2.625', trend: 'Stripe + Shopify Billing', trendUp: true },
    { label: 'Clientes pagadores', value: '17', trend: 'Cohorte Ene-2026', trendUp: true },
    { label: 'ARPU', value: '€154', trend: 'MRR / Clientes', trendUp: true },
    { label: 'Churn logo', value: '17,6%', trend: '3 de 17 clientes (Dic→Ene)', trendUp: false },
];

export const useOfFunds = {
    chartType: 'pie' as const,
    title: 'Uso de los fondos (€850K)',
    data: [
        { name: 'Producto & Ingeniería', value: 45, color: '#7f4cf5' },
        { name: 'Ventas & Marketing', value: 40, color: '#4c6cf5' },
        { name: 'Operaciones & Legal', value: 15, color: '#986ef5' },
    ]
};

export const milestones = [
    { month: 'Abr', label: 'Cierre ronda equity', color: '#7f4cf5', icon: '💰' },
    { month: 'Jul', label: 'Lanzamiento Voz (WhatsApp Calls + líneas)', color: '#4c6cf5', icon: '📞' },
    { month: 'Sep', label: 'Desembolso ENISA', color: '#986ef5', icon: '🏦' },
    { month: 'Oct', label: 'Agente de negocio (upsell base instalada)', color: '#16a34a', icon: '🤖' },
];

// ---- 04. TRACCIÓN ----

export const clientesActuales = {
    top5: [
        { name: 'LIVE4LIFE', niche: 'Real Estate / alquiler habitaciones', start: 'Oct 2024', mrr: '€350', ltv: '€5.600', arpa: '€350' },
        { name: 'DOMAINE BOUSQUET', niche: 'Wine & Spirits / bodega + enoturismo', start: 'Nov 2024', mrr: '€429', ltv: '€5.295', arpa: '€165' },
        { name: 'NORTON', niche: 'Wine & Spirits', start: 'Jul 2025', mrr: '€250', ltv: '€1.750', arpa: '€250' },
        { name: 'LA FOLIE', niche: 'Restaurantes', start: 'Jun 2025', mrr: '€277', ltv: '€1.519', arpa: '€217' },
        { name: 'MOMOVEN', niche: 'Movilidad / alquiler motos', start: 'Oct 2025', mrr: '€445', ltv: '€1.445', arpa: '€361' },
    ],
    summaryLabel: 'Media resto de clientes',
    summaryValues: { mrr: '€87', ltv: '€665', arpa: '€105' },
    footerLabel: 'Total / Media global (17 clientes)',
    footerValues: { mrr: '€2.625', ltv: '—', arpa: '€154' },
};

export const kpisDashboard = [
    { label: 'MRR total (bruto)', value: '€2.625', trend: 'Ene 2026 (Stripe + Shopify)', trendUp: true },
    { label: 'Clientes pagadores', value: '17', trend: 'Cohorte Ene-2026', trendUp: true },
    { label: 'ARPU', value: '€154,39', trend: 'MRR / Clientes', trendUp: true },
    { label: 'Altas (nuevos)', value: '3', trend: 'Nuevos pagadores en Ene', trendUp: true },
    { label: 'Churn logo', value: '17,6%', trend: '3 clientes perdidos (Dic→Ene)', trendUp: false },
    { label: 'Churn MRR', value: '11,1%', trend: '€286 MRR perdido', trendUp: false },
    { label: 'Marketing spend', value: '€1.625', trend: 'Meta + Mymco (sin WhatsApp)', trendUp: false },
    { label: 'WhatsApp spend', value: '€516', trend: 'Gasto growth WhatsApp', trendUp: false },
];

export const historicalRevenue = {
    chartType: 'bar+line' as const,
    title: 'Evolución histórica de ingresos (Ago 2024 → Ene 2026)',
    months: [
        'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
        'Ene 25', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
        'Ene 26'
    ],
    series: {
        smrr: {
            label: 'MRR Suscripciones (€)',
            data: [700, 1050, 1431, 1350, 0, 1947, 1900, 2182, 2000, 1350, 1980, 2380, 2030, 2029, 2484, 2478, 2852, 2625]
        },
        campaigns: {
            label: 'Campañas (€)',
            data: [0, 0, 0, 0, 0, 40, 0, 0, 266, 209, 910, 9, 74, 595, 116, 921, 375, 0]
        },
        totalRevenue: {
            label: 'Ingresos totales (€)',
            data: [700, 1050, 1431, 1350, 0, 1987, 1900, 2182, 2266, 1559, 2890, 2389, 2104, 2624, 2600, 3399, 3227, 2625]
        },
        customers: {
            label: 'Clientes activos',
            data: [2, 4, 5, 6, 6, 7, 6, 8, 8, 6, 10, 11, 10, 14, 16, 18, 18, 17]
        }
    }
};

// ---- 05. MERCADO ----

export const competidores = [
    { name: 'Lixsa.ai', niche: 'Micro‑PYME/PYME · Ventas+soporte WhatsApp', market: 'Local (ES)', pricing: '29/59/139€', strength: 'Bundle + onboarding rápido', weakness: 'Precio entrada bajo' },
    { name: 'ManyChat', niche: 'Micro‑PYME y creadores · Marketing IG/FB/WA', market: 'Internacional', pricing: 'Desde ~$15', strength: 'PLG masivo (1M+ users)', weakness: 'TCO WhatsApp variable' },
    { name: 'Landbot', niche: 'Micro‑PYME + agencias · Builder no‑code', market: 'Local (ES)', pricing: '€40/€200/€400', strength: 'PLG + no‑code + marca ES', weakness: 'WhatsApp eleva TCO' },
    { name: 'respond.io', niche: 'PYME/midmarket B2C · Inbox omnicanal', market: 'Internacional', pricing: '$79/$159/$279', strength: 'Omnicanal + workflows', weakness: 'Caro para micro‑PYME' },
    { name: 'Trengo', niche: 'Equipos PYME · Inbox omnicanal + IA', market: 'Internacional (EU)', pricing: '€299/€499', strength: 'Suite para equipos', weakness: 'Fuera rango micro' },
    { name: 'Zendesk', niche: 'Midmarket/enterprise · Helpdesk omnicanal', market: 'Internacional', pricing: '$155/agente', strength: 'Estándar de mercado', weakness: 'Overkill para PYME' },
    { name: 'Gorgias', niche: 'E‑commerce (Shopify) · Helpdesk por tickets', market: 'Internacional', pricing: 'Desde $10', strength: 'Especializado ecommerce', weakness: 'Coste escala con tickets' },
];

export const distribucionGeo = {
    chartType: 'world_map' as const,
    title: 'Distribución geográfica objetivo',
    regions: [
        {
            label: 'España',
            value: 50,
            color: '#7f4cf5',
            countries: ['Spain'],
            footnote: 'Base operativa, regulación local conocida, equipo comercial en Alicante. Mercado más maduro para Lixsa con tracción probada.',
        },
        {
            label: 'Europa (resto)',
            value: 20,
            color: '#4c6cf5',
            countries: ['Portugal', 'France', 'Italy', 'Germany', 'United Kingdom', 'Netherlands', 'Belgium'],
            footnote: 'Expansión post-voz (Q3 2026). Prioridad: PT, FR, IT por proximidad lingüística y regulatoria. UK/DE como tier 2.',
        },
        {
            label: 'LatAm & otros',
            value: 30,
            color: '#16a34a',
            countries: ['Argentina', 'Mexico', 'Colombia', 'Chile', 'Peru', 'Brazil', 'Uruguay'],
            footnote: 'WhatsApp dominante como canal B2C. Mercados hispanos con alta adopción. Argentina y México como primeros targets por red de founders.',
        },
    ]
};

// ---- 08. FINANCIERO ----

export const kpisEscenarios = [
    { label: 'Growth', value: 'Clientes/mes', trend: 'Palanca principal', trendUp: true },
    { label: 'Churn', value: '% mensual', trend: 'Impacto en NRR y runway', trendUp: false },
    { label: 'ARPU / Attach', value: '€/cliente', trend: 'Voz + Agente = upsell', trendUp: true },
    { label: 'CAC', value: '€/cliente', trend: 'Eficiencia S&M', trendUp: false },
    { label: 'Gross Margin', value: '% GM', trend: 'COGS cloud + WhatsApp', trendUp: true },
    { label: 'Hiring pace', value: 'Headcount', trend: 'Burn rate driver', trendUp: false },
];

// Proyecciones trimestrales 2026–2030 (Escenario Base — Excel v23)
// Métricas clave del Business Plan por trimestre
export const financialProjections = {
    chartType: 'multi_line_bar' as const,
    title: 'Proyecciones financieras trimestrales (2026–2030) — Escenario Base',
    comment: 'Datos modelados desde los supuestos del Excel v23. MRR = ARPU × clientes. GM% mejora por reducción de COV. Churn decrece por madurez de producto y CS.',
    quarters: [
        'Q1 26', 'Q2 26', 'Q3 26', 'Q4 26',
        'Q1 27', 'Q2 27', 'Q3 27', 'Q4 27',
        'Q1 28', 'Q2 28', 'Q3 28', 'Q4 28',
        'Q1 29', 'Q2 29', 'Q3 29', 'Q4 29',
        'Q1 30', 'Q2 30', 'Q3 30', 'Q4 30',
    ],
    series: {
        mrr: {
            label: 'MRR (€)',
            unit: '€',
            // Q-end MRR: ARPU × clientes activos al cierre del Q
            // 2026: Start 17 cust, €158 ARPU. Growth ramps from +2/mo to +5/mo. Voice Q2, Agent Q4.
            // 2027: ARPU +5% YoY → ~€166. Growth +5-8/mo. COV↓, GM↑.
            // 2028-2030: Scaling with improving unit economics.
            data: [
                3_200, 4_200, 6_500, 8_400,    // 2026: Ramp from €2.6K actuals
                11_500, 16_000, 22_000, 28_000,   // 2027: Consolidation
                35_000, 45_000, 58_000, 72_000,   // 2028: Scale
                88_000, 108_000, 130_000, 155_000, // 2029: Optimization
                180_000, 215_000, 260_000, 320_000 // 2030: Maturity
            ]
        },
        customers: {
            label: 'Clientes activos',
            unit: '',
            // Net adds = new - churned. Churn improves over time.
            data: [
                20, 25, 35, 48,     // 2026
                60, 78, 100, 128,    // 2027
                155, 190, 230, 280,    // 2028
                330, 390, 460, 540,    // 2029
                620, 720, 840, 980     // 2030
            ]
        },
        grossMargin: {
            label: 'Margen Bruto (%)',
            unit: '%',
            // GM% = 1 - COV ratio - processing. COV: 33%→18% over 5 years.
            data: [
                58, 60, 62, 63,   // 2026: COV ~33%, processing 3.5%
                65, 66, 68, 69,   // 2027: COV ~27%
                70, 71, 72, 73,   // 2028: COV ~22%
                74, 75, 76, 77,   // 2029: COV ~20%
                78, 78, 79, 79    // 2030: COV ~18%
            ]
        },
        churnRate: {
            label: 'Churn mensual (%)',
            unit: '%',
            // Monthly logo churn: 6% → 2% over 5 years
            data: [
                6.0, 5.5, 5.0, 4.5,   // 2026
                4.0, 3.8, 3.5, 3.5,   // 2027
                3.2, 3.0, 2.8, 2.8,   // 2028
                2.6, 2.5, 2.4, 2.4,   // 2029
                2.2, 2.1, 2.0, 2.0    // 2030
            ]
        },
        arpu: {
            label: 'ARPU (€)',
            unit: '€',
            // ARPU grows ~5% YoY plus voice/agent attach
            data: [
                158, 162, 170, 175,    // 2026: Base + voice kick-in Q2
                180, 188, 195, 210,    // 2027: Agent consolidated
                220, 230, 240, 250,    // 2028
                260, 270, 278, 285,    // 2029
                290, 298, 308, 320     // 2030
            ]
        }
    }
};

// Proyecciones anuales 2026–2030 (Escenario Base — Excel v23)
// Resumen anual: valores de cierre de año (Q4) para stocks, promedio anual para ratios
export const annualProjections = {
    chartType: 'multi_line_bar' as const,
    title: 'Proyecciones financieras anuales (2026–2030) — Escenario Base',
    comment: 'MRR y Clientes = valor a cierre de año (Q4). GM% y Churn% = promedio anual. ARR = MRR × 12.',
    years: ['2026', '2027', '2028', '2029', '2030'],
    series: {
        arr: {
            label: 'ARR (€)',
            unit: '€',
            // ARR = MRR Q4 × 12
            data: [100_800, 336_000, 864_000, 1_860_000, 3_840_000]
        },
        mrr: {
            label: 'MRR (€)',
            unit: '€',
            // Q4 end MRR
            data: [8_400, 28_000, 72_000, 155_000, 320_000]
        },
        customers: {
            label: 'Clientes activos',
            unit: '',
            // Year-end (Q4)
            data: [48, 128, 280, 540, 980]
        },
        grossMargin: {
            label: 'Margen Bruto (%)',
            unit: '%',
            // Avg annual
            data: [61, 67, 72, 76, 79]
        },
        churnRate: {
            label: 'Churn mensual (%)',
            unit: '%',
            // Avg annual
            data: [5.3, 3.7, 2.9, 2.5, 2.1]
        },
        arpu: {
            label: 'ARPU (€)',
            unit: '€',
            // Year-end (Q4)
            data: [175, 210, 250, 285, 320]
        }
    }
};

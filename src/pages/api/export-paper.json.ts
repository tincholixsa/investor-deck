import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import {
    kpisOverview,
    useOfFunds,
    milestones,
    clientesActuales,
    kpisDashboard,
    historicalRevenue,
    competidores,
    distribucionGeo,
    kpisEscenarios,
} from '../../data/paper-data';

// ── Helper: extract footnotes from content ──
function extractFootnotes(content: string): string[] {
    // Match <Footnotes notes={["...", "..."]} />
    const match = content.match(/<Footnotes\s+notes=\{\[([\s\S]*?)\]\}\s*\/>/)
    if (!match) return [];
    // Parse the array contents — each note is a quoted string
    const raw = match[1];
    const notes: string[] = [];
    const noteRegex = /["'`]([^"'`]*)["'`]/g;
    let m;
    while ((m = noteRegex.exec(raw)) !== null) {
        notes.push(m[1]);
    }
    return notes;
}

// ── Helper: parse a subsection block into structured content ──
function parseSubsectionContent(subContent: string) {
    // Extract footnotes first
    const extractedFootnotes = extractFootnotes(subContent);

    const lines = subContent.split('\n');
    const elements: any[] = [];
    let currentTable: { headers: string[]; rows: string[][] } | null = null;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            if (currentTable) {
                elements.push({ type: 'table', headers: currentTable.headers, rows: currentTable.rows });
                currentTable = null;
            }
            continue;
        }
        if (trimmed.startsWith('###')) continue;
        if (trimmed.startsWith('import')) continue;

        // Detect markdown table
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
            // Skip separator row
            if (cells.every(c => /^[-:]+$/.test(c))) continue;
            if (!currentTable) {
                currentTable = { headers: cells, rows: [] };
            } else {
                currentTable.rows.push(cells);
            }
            continue;
        } else if (currentTable) {
            elements.push({ type: 'table', headers: currentTable.headers, rows: currentTable.rows });
            currentTable = null;
        }

        // Detect component references
        if (trimmed.startsWith('<KpiCards')) {
            elements.push({
                type: 'component',
                component: 'KpiCards',
                _comment: 'Tarjetas KPI — cada tarjeta muestra un indicador con su valor, tendencia y dirección (positiva/negativa). Se renderizan como cards en grid.',
                visualizationType: 'kpi_cards_grid',
                dataRef: extractDataRef(trimmed)
            });
            continue;
        }
        if (trimmed.startsWith('<ClientsTable')) {
            elements.push({
                type: 'component',
                component: 'ClientsTable',
                _comment: 'Tabla de datos estilizada para mostrar información de clientes o competidores. Incluye filas con nombre, nicho, fecha, MRR, LTV y ARPA, más filas de resumen/footer.',
                visualizationType: 'data_table_styled',
                dataRef: extractDataRef(trimmed)
            });
            continue;
        }
        if (trimmed.startsWith('<EvidenceBlock')) {
            const titleMatch = trimmed.match(/title="([^"]+)"/);
            elements.push({
                type: 'component',
                component: 'EvidenceBlock',
                _comment: 'Bloque de evidencia — caja destacada con fondo sutil que muestra la fuente de datos o la metodología utilizada. Sirve para dar credibilidad al contenido.',
                visualizationType: 'callout_box',
                title: titleMatch?.[1] || ''
            });
            continue;
        }
        if (trimmed.startsWith('<UseOfFundsPieChart')) {
            elements.push({
                type: 'chart',
                chart: 'UseOfFundsPieChart',
                _comment: 'Gráfica de tarta (donut) que muestra la distribución del uso de fondos (€850K) en 3 segmentos: Producto & Ingeniería (45%), Ventas & Marketing (40%), Operaciones & Legal (15%). Colores de marca Lixsa. Interactiva con tooltip al hover.',
                visualizationType: 'donut_pie_chart',
                dataRef: 'datasets.00_overview.useOfFunds'
            });
            continue;
        }
        if (trimmed.startsWith('<MilestonesTimeline')) {
            elements.push({
                type: 'chart',
                chart: 'MilestonesTimeline',
                _comment: 'Línea temporal horizontal del año 2026 (Ene→Dic) con 4 puntos de color en los meses correspondientes (Abr, Jul, Sep, Oct). Las etiquetas se alternan arriba/abajo para evitar solapamiento. Cada punto tiene un icono emoji y color diferente.',
                visualizationType: 'horizontal_timeline_scatter',
                dataRef: 'datasets.00_overview.milestones'
            });
            continue;
        }
        if (trimmed.startsWith('<HistoricalMrrChart')) {
            elements.push({
                type: 'chart',
                chart: 'HistoricalMrrChart',
                _comment: 'Gráfico combinado de barras + línea con 18 meses de datos (Ago 2024 → Ene 2026). Las barras moradas con degradado muestran los ingresos totales mensuales (sMRR + campañas). La línea verde con área sutil muestra la evolución del número de clientes activos en un eje secundario (derecha). Tooltip interactivo.',
                visualizationType: 'combo_bar_line_dual_axis',
                dataRef: 'datasets.04_traccion.historicalRevenue'
            });
            continue;
        }
        if (trimmed.startsWith('<GeoDistributionChart')) {
            elements.push({
                type: 'chart',
                chart: 'GeoDistributionChart',
                _comment: 'Mapa mundial (choropleth) con 3 zonas coloreadas: España (morado, 50%), Europa resto (azul, 20%), LatAm y otros (verde, 30%). Cada país del grupo se colorea con el color de su región. Leyenda debajo con puntos de color + nombre de región + porcentaje. Se carga dinámicamente el GeoJSON del mapa mundial.',
                visualizationType: 'world_choropleth_map',
                dataRef: 'datasets.05_mercado.distribucionGeo'
            });
            continue;
        }
        if (trimmed.startsWith('<Footnotes')) {
            // Already parsed — skip the tag line
            continue;
        }
        // Skip other component lines (closing tags, etc.)
        if (trimmed.startsWith('<') && !trimmed.startsWith('<Metric')) continue;
        // Skip component data props (curly brace objects)
        if (trimmed.startsWith('{') || trimmed.startsWith(']}')) continue;

        // Clean text
        let cleaned = trimmed
            .replace(/<Metric\s+term="([^"]+)"\s*\/>/g, '$1')
            .replace(/<[^>]+>/g, '')
            .trim();

        if (cleaned.length > 0) {
            // Classify the type
            if (cleaned.startsWith('- ') || cleaned.startsWith('* ')) {
                elements.push({ type: 'list_item', content: cleaned.replace(/^[-*]\s+/, '') });
            } else if (/^\d+\.\s/.test(cleaned)) {
                elements.push({ type: 'ordered_item', content: cleaned.replace(/^\d+\.\s+/, '') });
            } else if (cleaned.startsWith('> ')) {
                elements.push({ type: 'blockquote', content: cleaned.replace(/^>\s+/, '') });
            } else if (cleaned.startsWith('**') && cleaned.endsWith('**')) {
                elements.push({ type: 'heading_bold', content: cleaned.replace(/\*\*/g, '') });
            } else {
                elements.push({ type: 'paragraph', content: cleaned });
            }
        }
    }

    // Flush any remaining table
    if (currentTable) {
        elements.push({ type: 'table', headers: currentTable.headers, rows: currentTable.rows });
    }

    return { elements, footnotes: extractedFootnotes };
}

function extractDataRef(line: string): string {
    if (line.includes('kpisOverview') || line.includes('00-2-kpis')) return 'datasets.00_overview.kpis';
    if (line.includes('kpisDashboard') || line.includes('04-4-dashboard')) return 'datasets.04_traccion.kpisDashboard';
    if (line.includes('kpisEscenarios')) return 'datasets.08_financiero.kpisEscenarios';
    if (line.includes('distribucionGeo') || line.includes('05-5-distribucion')) return 'datasets.05_mercado.distribucionGeo';
    if (line.includes('ClientsTable')) return 'datasets.04_traccion.clientesActuales';
    return 'inline';
}

export const GET: APIRoute = async () => {
    const contentDir = path.resolve('src/content/paper/es');
    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx')).sort();

    const sections: any[] = [];

    for (const file of files) {
        const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8');

        // Extract Section title & id
        const sectionTitleMatch = raw.match(/title="([^"]+)"/);
        const sectionTitle = sectionTitleMatch ? sectionTitleMatch[1] : file.replace('.mdx', '');
        const sectionIdMatch = raw.match(/id="([^"]+)"/);
        const sectionId = sectionIdMatch ? sectionIdMatch[1] : '';

        // Find all subsection div blocks
        const subsectionRegex = /<div\s+id="([^"]+)">([\s\S]*?)(<\/div>)/g;
        const subsections: any[] = [];
        let match;

        while ((match = subsectionRegex.exec(raw)) !== null) {
            const subId = match[1];
            const subContent = match[2];

            // Extract H3 title
            const h3Match = subContent.match(/###\s+(.+)/);
            const subTitle = h3Match ? h3Match[1].trim().replace(/<[^>]+>/g, '').trim() : subId;

            // Parse structured content
            const { elements, footnotes } = parseSubsectionContent(subContent);

            // Also extract flat text for searchability
            const flatText = elements
                .filter(e => e.type === 'paragraph' || e.type === 'list_item' || e.type === 'ordered_item' || e.type === 'blockquote')
                .map(e => e.content)
                .join(' ');

            const subsection: any = {
                id: subId,
                title: subTitle,
                elements,
                flatText,
            };
            // Only include footnotes if they exist
            if (footnotes.length > 0) {
                subsection.footnotes = footnotes;
            }
            subsections.push(subsection);
        }

        // Handle sections without <div> wrappers (e.g., 09-riesgos)
        if (subsections.length === 0) {
            const contentWithoutSection = raw
                .replace(/<Section[^>]*>/, '')
                .replace(/<\/Section>/, '')
                .trim();

            if (contentWithoutSection.length > 0) {
                const { elements, footnotes } = parseSubsectionContent(contentWithoutSection);
                const flatText = elements
                    .filter(e => e.type === 'paragraph' || e.type === 'list_item' || e.type === 'ordered_item')
                    .map(e => e.content)
                    .join(' ');

                const subsection: any = {
                    id: sectionId,
                    title: sectionTitle,
                    elements,
                    flatText,
                };
                if (footnotes.length > 0) {
                    subsection.footnotes = footnotes;
                }
                subsections.push(subsection);
            }
        }

        sections.push({
            id: sectionId,
            title: sectionTitle,
            _comment: getSectionComment(sectionId),
            filename: file,
            subsections,
        });
    }

    const now = new Date();
    const dd = now.getDate().toString().padStart(2, '0');
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = now.getFullYear();

    function getSectionComment(id: string): string {
        const comments: Record<string, string> = {
            'overview': 'Resumen ejecutivo del paper: quién es Lixsa, KPIs reales Ene-2026, la demanda de capital (€850K), distribución de fondos (pie chart donut), e hitos clave 2026 (timeline horizontal).',
            'tesis': 'Tesis de inversión: por qué es el momento adecuado (WhatsApp pricing, adopción IA, factura electrónica), por qué Lixsa gana (TTV, WhatsApp-first, bundle), y la visión a 5 años.',
            'problema': 'El problema que resuelve Lixsa: dolor de mercado (procesos manuales, herramientas legacy), coste operativo (DSO, horas/semana), y fuga de ingresos (cobros tardíos, churn).',
            'producto': 'Descripción del producto: qué es Lixsa (SaaS B2B automatización WhatsApp), cómo funciona (4 pasos), canales/integraciones (WhatsApp, telefonía, Stripe), y seguridad/privacidad.',
            'traccion': 'Tracción real: 17 clientes pagadores (tabla top 5 por LTV), casos de uso por vertical, testimonios (pendiente), y dashboard de métricas con gráfico histórico de ingresos (bar+line chart 18 meses).',
            'mercado': 'Mercado y competencia: TAM/SAM/SOM con datos INE (tabla escenarios), panorama competitivo de 7 players (tabla datos), diferenciación (5 puntos), riesgos competitivos (4 items), y distribución geográfica (KPI cards).',
            'gtm': 'Go-to-market: estrategia general (50%ES/20%EU/30%fuera), plan trimestral 2026 (tabla Q1-Q4), plan 2027 (tabla Q1-Q4), y resumen 2028-2030.',
            'roadmap': 'Roadmap de producto y plataforma: plan trimestral 2026 con hitos producto+tech+KPIs (tabla), plan 2027 enterprise readiness (tabla), y resumen 2028-2030.',
            'financiero': 'Plan financiero: P&L 2026 con supuestos clave (tabla 11 parámetros), estructura de costes, P&L 2027-2030, supuestos/dependencias (tabla 6 riesgos), escenarios/sensibilidades (KPI cards + tabla), y unit economics CAC/LTV/Payback (tabla + gráfico histórico).',
            'riesgos': 'Riesgos y mitigaciones: 4 riesgos operacionales (tabla con señal/mitigación/owner), 2 riesgos comerciales (tabla), y 3 riesgos financieros (ENISA, deuda BringAI, runway).',
            'equipo': 'Equipo y gobierno: 3 C-level (Martín CPO, Alejandro CTO, Carlos CRO), equipo actual 7 personas, hiring plan 2026, pool equity (10%+5% FD), gobierno post-ronda, y formato de reporting.',
            'apendice': 'Apéndice: diccionario de 11 KPIs (tabla), referencia a hojas Excel, glosario de 10 términos (tabla), y disclaimer legal.',
        };
        return comments[id] || '';
    }

    const data = {
        _meta: {
            documentName: "Lixsa Investment Paper",
            version: "v1.0",
            exportDate: `${dd}/${mm}/${yyyy}`,
            exportTimestamp: now.toISOString(),
            totalSections: sections.length,
            description: "Documento completo de inversión de Lixsa.ai. Contiene TODO el contenido del paper: texto, tablas, gráficas, KPIs, datos de clientes, métricas históricas, y competidores. La sección 'datasets' contiene los datos fuente de todos los componentes visuales (gráficas, tarjetas KPI, tablas de clientes). La sección 'sections' contiene la estructura y texto completo del documento organizado por secciones y subsecciones.",
            sourceExcel: "Lixsa_BusinessPlan_2026_2030_v23_paper_audit_ready.xlsx",
            auditNotes: "Este JSON es la fuente única de verdad del paper. Todos los datos visualizados en gráficas están en 'datasets' y referenciados desde las subsecciones mediante 'dataRef'. Los elementos de tipo 'table' contienen tablas markdown ya parseadas con headers y rows. Los elementos de tipo 'component' indican qué componente visual se renderiza en esa posición y apuntan a su dataset. Los 'flatText' permiten búsquedas rápidas de contenido.",
        },

        sections,

        // ── DATASETS: datos fuente de todos los componentes visuales ──
        datasets: {
            "00_overview": {
                _description: "Datos de la sección 00. Overview — KPIs iniciales Ene-2026, distribución del uso de fondos (pie chart), e hitos clave 2026 (timeline chart).",
                kpis: {
                    _description: "KPIs iniciales reales (Actuals Enero 2026). Datos consolidados de Stripe + Shopify Billing.",
                    items: kpisOverview,
                },
                useOfFunds: {
                    _description: "Distribución del capital total (€850K = €550K equity + €300K ENISA). Se visualiza como pie/donut chart.",
                    ...useOfFunds,
                },
                milestones: {
                    _description: "4 hitos clave del año 2026. Se visualizan como timeline horizontal con puntos de color por mes.",
                    items: milestones,
                },
            },
            "04_traccion": {
                _description: "Datos de la sección 04. Tracción — Clientes actuales (cohorte Ene 2026), dashboard de métricas, e ingresos históricos mensuales (Ago 2024 → Ene 2026).",
                clientesActuales: {
                    _description: "17 clientes pagadores en enero 2026. Top 5 por LTV neto histórico, media del resto, y totales/medias globales. Se visualiza como tabla de datos.",
                    totalClientes: 17,
                    ...clientesActuales,
                },
                kpisDashboard: {
                    _description: "8 tarjetas KPI del dashboard de métricas — incluye MRR, clientes, ARPU, altas, churn logo, churn MRR, marketing spend, y WhatsApp spend. Datos Ene 2026.",
                    items: kpisDashboard,
                },
                historicalRevenue: {
                    _description: "Ingresos mensuales reales desde Ago 2024 hasta Ene 2026 (18 meses). Incluye 4 series: MRR suscripciones (sMRR), ingresos por campañas, total combinado, y número de clientes activos. Se visualiza como gráfico de barras (ingresos) + línea (clientes).",
                    ...historicalRevenue,
                },
            },
            "05_mercado": {
                _description: "Datos de la sección 05. Mercado & competencia — Tabla comparativa de 7 competidores y distribución geográfica objetivo.",
                competidores: {
                    _description: "Benchmark competitivo España 2026 para PYME. 7 empresas comparadas por nicho, mercado, pricing, ventaja principal y debilidad. Fuentes: precios públicos consultados feb-2026.",
                    items: competidores,
                },
                distribucionGeo: {
                    _description: "Distribución geográfica objetivo de clientes: 50% España, 20% Europa resto, 30% fuera de Europa. Se visualiza como 3 tarjetas KPI.",
                    items: distribucionGeo,
                },
            },
            "08_financiero": {
                _description: "Datos de la sección 08. Plan financiero — Palancas de escenarios para modelar Base/Upside/Downside.",
                kpisEscenarios: {
                    _description: "6 palancas clave para modelar escenarios financieros: growth, churn, ARPU/attach, CAC, gross margin, hiring pace. Se visualizan como 6 tarjetas KPI.",
                    items: kpisEscenarios,
                },
            },
        },
    };

    return new Response(JSON.stringify(data, null, 2), {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        }
    });
};

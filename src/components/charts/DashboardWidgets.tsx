import React, { useEffect, useState, useRef } from 'react';
import EChartIsland from './EChartIsland';
import ReactECharts from 'echarts-for-react';
import { useOfFunds, milestones as milestonesData, historicalRevenue, distribucionGeo, financialProjections, annualProjections } from '../../data/paper-data';

// Mocked fetch for datasets. In real usage, this might be a dynamic import from src/data 
// or fetched from a URL on the client if it's dynamic. We'll simulate build-time/client-hydration.
import traccionData from '../../data/investor/v1/traccion.json';
import financeData from '../../data/investor/v1/finance.json';

export function RevenueMixChart() {
    const option = {
        title: { text: 'Mix de Ingresos (MRR por Plan)', textStyle: { fontSize: 14 } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { bottom: 0, type: 'scroll' },
        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
        xAxis: [{ type: 'category', data: financeData.months }],
        yAxis: [{ type: 'value', name: 'MRR ($)', splitLine: { lineStyle: { type: 'dashed' } } }],
        series: [
            { name: 'Starter', type: 'bar', stack: 'Total', emphasis: { focus: 'series' }, data: financeData.revenue.starter, itemStyle: { color: '#7f4cf5' } }, // CHART_01
            { name: 'Pro', type: 'bar', stack: 'Total', emphasis: { focus: 'series' }, data: financeData.revenue.pro, itemStyle: { color: '#4c6cf5' } }, // CHART_02
            { name: 'Enterprise', type: 'bar', stack: 'Total', emphasis: { focus: 'series' }, data: financeData.revenue.enterprise, itemStyle: { color: '#986ef5' } } // CHART_03
        ]
    };

    return <EChartIsland option={option} height="350px" />;
}

export function OpexStackChart() {
    const option = {
        title: { text: 'Estructura OPEX', textStyle: { fontSize: 14 } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { bottom: 0, type: 'scroll' },
        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
        xAxis: [{ type: 'category', data: financeData.months }],
        yAxis: [{ type: 'value', name: 'Costes ($)', splitLine: { lineStyle: { type: 'dashed' } } }],
        series: [
            { name: 'R&D', type: 'bar', stack: 'Total', data: financeData.opex.rnd, itemStyle: { color: '#312f82' } }, // Lixsa Indigo
            { name: 'Sales & Mkt', type: 'bar', stack: 'Total', data: financeData.opex.smn, itemStyle: { color: '#1b1a1b' } }, // Lixsa Black
            { name: 'G&A', type: 'bar', stack: 'Total', data: financeData.opex.gna, itemStyle: { color: '#bdb4d9' } } // Lixsa Lilac (Cost context)
        ]
    };

    return <EChartIsland option={option} height="350px" />;
}

export function NetProfitChart() {
    const option = {
        title: { text: 'Evolución Beneficio Neto', textStyle: { fontSize: 14 } },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: financeData.months },
        yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
        visualMap: {
            show: false,
            pieces: [
                { gt: 0, color: '#16A34A' }, // Semantic Positive
                { lte: 0, color: '#DC2626' }  // Semantic Negative
            ]
        },
        series: [
            {
                data: financeData.netProfit,
                type: 'line',
                smooth: true,
                areaStyle: { opacity: 0.1 },
                lineStyle: { width: 3 }
            }
        ]
    };

    return <EChartIsland option={option} height="350px" />;
}

export function UseOfFundsPieChart() {
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {d}%'
        },
        legend: {
            bottom: 0,
            textStyle: { fontSize: 11 },
            type: 'scroll'
        },
        series: [
            {
                type: 'pie',
                radius: ['35%', '65%'],
                center: ['50%', '42%'],
                avoidLabelOverlap: true,
                itemStyle: {
                    borderRadius: 6,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: '{b}\n{d}%',
                    fontSize: 12,
                    lineHeight: 16
                },
                emphasis: {
                    label: { show: true, fontSize: 14, fontWeight: 'bold' }
                },
                data: useOfFunds.data.map(d => ({
                    value: d.value, name: d.name, itemStyle: { color: d.color }
                }))
            }
        ]
    };

    return <EChartIsland option={option} height="320px" />;
}

export function MilestonesTimeline() {
    const milestones = milestonesData.map(m => ({
        ...m,
        label: m.label.replace('(WhatsApp Calls + líneas)', '\n(WhatsApp Calls + líneas)').replace('(upsell base instalada)', '\n(upsell base instalada)'),
    }));

    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                const m = milestones[params.dataIndex];
                return `<b>${m.month} 2026</b><br/>${m.label.replace('\n', '<br/>')}`;
            }
        },
        grid: {
            left: '3%',
            right: '3%',
            top: '15%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: months,
            axisTick: { alignWithLabel: true },
            axisLine: { lineStyle: { color: '#e2e8f0', width: 2 } },
            axisLabel: { color: '#64748b', fontSize: 10, interval: 'auto', rotate: 45 },
            splitLine: { show: false }
        },
        yAxis: {
            type: 'value',
            show: false,
            min: 0,
            max: 10
        },
        series: [
            {
                type: 'line',
                data: months.map(() => 5),
                lineStyle: { color: '#e2e8f0', width: 2, type: 'dashed' },
                symbol: 'none',
                silent: true
            },
            ...milestones.map((m, i) => ({
                type: 'scatter',
                data: months.map((month, mi) =>
                    month === m.month ? [mi, 5] : null
                ).filter(Boolean),
                symbolSize: 28,
                itemStyle: {
                    color: m.color,
                    shadowBlur: 10,
                    shadowColor: m.color + '40'
                },
                label: {
                    show: true,
                    formatter: m.label,
                    position: i % 2 === 0 ? 'top' : 'bottom',
                    distance: 16,
                    fontSize: 11,
                    lineHeight: 14,
                    color: '#334155',
                    fontWeight: 500
                },
                z: 10
            }))
        ]
    };

    return <EChartIsland option={option} height="240px" />;
}

export function HistoricalMrrChart() {
    const { months, series } = historicalRevenue;
    const totalRevenue = series.totalRevenue.data;
    const customers = series.customers.data;

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params: any) => {
                let s = `<b>${params[0].axisValue}</b><br/>`;
                params.forEach((p: any) => {
                    if (p.value !== undefined && p.value !== null) {
                        const unit = p.seriesName === 'Clientes' ? '' : '€';
                        s += `${p.marker} ${p.seriesName}: ${unit}${p.value.toLocaleString('es-ES')}<br/>`;
                    }
                });
                return s;
            }
        },
        legend: { bottom: 0, textStyle: { fontSize: 10 }, type: 'scroll' },
        grid: { left: '2%', right: '5%', top: '10%', bottom: '20%', containLabel: true },
        xAxis: {
            type: 'category',
            data: months,
            axisLabel: { fontSize: 10, rotate: 45 },
            axisTick: { alignWithLabel: true }
        },
        yAxis: [
            {
                type: 'value',
                name: 'Ingresos (€)',
                nameTextStyle: { fontSize: 10 },
                splitLine: { lineStyle: { type: 'dashed' } },
                axisLabel: { formatter: '€{value}' }
            },
            {
                type: 'value',
                name: 'Clientes',
                nameTextStyle: { fontSize: 10 },
                splitLine: { show: false },
                axisLabel: { fontSize: 10 }
            }
        ],
        series: [
            {
                name: 'Ingresos totales',
                type: 'bar',
                data: totalRevenue,
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#7f4cf5' },
                            { offset: 1, color: '#4c6cf5' }
                        ]
                    },
                    borderRadius: [4, 4, 0, 0]
                },
                emphasis: { focus: 'series' }
            },
            {
                name: 'Clientes',
                type: 'line',
                yAxisIndex: 1,
                data: customers,
                smooth: true,
                lineStyle: { width: 2, color: '#16a34a' },
                itemStyle: { color: '#16a34a' },
                symbolSize: 6,
                areaStyle: { opacity: 0.05, color: '#16a34a' }
            }
        ]
    };

    return <EChartIsland option={option} height="380px" />;
}

export function FinancialProjectionsChart() {
    const { quarters, series } = financialProjections;

    // Index 4 = Q1 2027 — from here everything is semi-transparent (projection)
    const PROJ_START = 4;

    // Build MRR bar data with per-item colors
    const mrrBarData = series.mrr.data.map((v: number, i: number) => ({
        value: v,
        itemStyle: i < PROJ_START ? {
            color: {
                type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [{ offset: 0, color: '#7f4cf5' }, { offset: 1, color: '#4c6cf5' }]
            },
            borderRadius: [3, 3, 0, 0]
        } : {
            color: {
                type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [{ offset: 0, color: 'rgba(127,76,245,0.35)' }, { offset: 1, color: 'rgba(76,108,245,0.35)' }]
            },
            borderRadius: [3, 3, 0, 0],
            borderColor: 'rgba(127,76,245,0.5)',
            borderWidth: 1,
            borderType: 'dashed' as const
        }
    }));

    // Helper: build line data with per-point opacity
    const makeLineData = (data: number[], solidColor: string, alphaColor: string) =>
        data.map((v: number, i: number) => ({
            value: v,
            itemStyle: { color: i < PROJ_START ? solidColor : alphaColor }
        }));

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params: any) => {
                const isProj = params[0].dataIndex >= PROJ_START;
                let s = `<b>${params[0].axisValue}</b>${isProj ? ' <span style="color:#999">(proyección)</span>' : ''}<br/>`;
                params.forEach((p: any) => {
                    if (p.value !== undefined && p.value !== null) {
                        const ser = Object.values(series).find((sr: any) => sr.label === p.seriesName) as any;
                        const unit = ser?.unit || '';
                        const val = unit === '\u20ac' ? `\u20ac${p.value.toLocaleString('es-ES')}` : `${p.value.toLocaleString('es-ES')}${unit}`;
                        s += `${p.marker} ${p.seriesName}: ${val}<br/>`;
                    }
                });
                return s;
            }
        },
        legend: {
            bottom: 0,
            textStyle: { fontSize: 11 },
            selected: {
                'MRR (\u20ac)': true,
                'Clientes activos': true,
                'Margen Bruto (%)': true,
                'Churn mensual (%)': true,
                'ARPU (\u20ac)': false
            }
        },
        grid: { left: '3%', right: '8%', top: '12%', bottom: '18%', containLabel: true },
        xAxis: {
            type: 'category',
            data: quarters,
            axisLabel: { fontSize: 10, rotate: 45, formatter: (val: string) => val },
            axisTick: { alignWithLabel: true },
            splitArea: {
                show: true,
                areaStyle: {
                    color: quarters.map((_: string, i: number) =>
                        i < PROJ_START ? 'rgba(127,76,245,0.03)' : 'rgba(200,200,200,0.06)'
                    )
                }
            }
        },
        yAxis: [
            {
                type: 'value', name: 'MRR (\u20ac)',
                nameTextStyle: { fontSize: 10, color: '#7f4cf5' },
                position: 'left',
                splitLine: { lineStyle: { type: 'dashed', opacity: 0.3 } },
                axisLabel: { fontSize: 10, formatter: (v: number) => v >= 1000 ? `\u20ac${(v / 1000).toFixed(0)}K` : `\u20ac${v}` }
            },
            {
                type: 'value', name: 'Clientes',
                nameTextStyle: { fontSize: 10, color: '#16a34a' },
                position: 'right',
                splitLine: { show: false },
                axisLabel: { fontSize: 10 }
            },
            {
                type: 'value', name: '%',
                nameTextStyle: { fontSize: 10, color: '#999' },
                position: 'right', offset: 50,
                min: 0, max: 100,
                splitLine: { show: false },
                axisLabel: { fontSize: 9, formatter: '{value}%' }
            }
        ],
        series: [
            {
                name: series.mrr.label,
                type: 'bar',
                yAxisIndex: 0,
                data: mrrBarData,
                barMaxWidth: 24,
                emphasis: { focus: 'series' },
                markLine: {
                    silent: true,
                    symbol: 'none',
                    lineStyle: { color: '#999', type: 'dashed', width: 1 },
                    label: { show: true, position: 'insideStartTop', formatter: 'Proyección \u2192', fontSize: 9, color: '#999' },
                    data: [{ xAxis: PROJ_START - 0.5 }]
                }
            },
            {
                name: series.customers.label,
                type: 'line', yAxisIndex: 1,
                data: makeLineData(series.customers.data, '#16a34a', 'rgba(22,163,74,0.35)'),
                smooth: true,
                lineStyle: { width: 2.5, color: '#16a34a' },
                symbolSize: 5,
                areaStyle: { opacity: 0.06, color: '#16a34a' }
            },
            {
                name: series.grossMargin.label,
                type: 'line', yAxisIndex: 2,
                data: makeLineData(series.grossMargin.data, '#f59e0b', 'rgba(245,158,11,0.35)'),
                smooth: true,
                lineStyle: { width: 2, color: '#f59e0b', type: 'dashed' },
                symbolSize: 4, symbol: 'diamond'
            },
            {
                name: series.churnRate.label,
                type: 'line', yAxisIndex: 2,
                data: makeLineData(series.churnRate.data, '#ef4444', 'rgba(239,68,68,0.35)'),
                smooth: true,
                lineStyle: { width: 2, color: '#ef4444', type: 'dashed' },
                symbolSize: 4, symbol: 'triangle'
            },
            {
                name: series.arpu.label,
                type: 'line', yAxisIndex: 0,
                data: makeLineData(series.arpu.data, '#8b5cf6', 'rgba(139,92,246,0.35)'),
                smooth: true,
                lineStyle: { width: 1.5, color: '#8b5cf6', type: 'dotted' },
                symbolSize: 4
            }
        ]
    };

    return <EChartIsland option={option} height="480px" />;
}

export function AnnualProjectionsChart() {
    const { years, series } = annualProjections;

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params: any) => {
                let s = `<b>${params[0].axisValue}</b><br/>`;
                params.forEach((p: any) => {
                    if (p.value !== undefined && p.value !== null) {
                        const ser = Object.values(series).find((sr: any) => sr.label === p.seriesName) as any;
                        const unit = ser?.unit || '';
                        let val: string;
                        if (unit === '€' && p.value >= 1000) {
                            val = `€${(p.value / 1000).toFixed(0)}K`;
                        } else if (unit === '€') {
                            val = `€${p.value.toLocaleString('es-ES')}`;
                        } else {
                            val = `${p.value.toLocaleString('es-ES')}${unit}`;
                        }
                        s += `${p.marker} ${p.seriesName}: ${val}<br/>`;
                    }
                });
                return s;
            }
        },
        legend: {
            bottom: 0,
            textStyle: { fontSize: 11 },
            selected: {
                'ARR (€)': true,
                'Clientes activos': true,
                'Margen Bruto (%)': true,
                'Churn mensual (%)': true,
                'MRR (€)': false,
                'ARPU (€)': false
            }
        },
        grid: { left: '3%', right: '8%', top: '12%', bottom: '18%', containLabel: true },
        xAxis: {
            type: 'category',
            data: years,
            axisLabel: { fontSize: 12, fontWeight: 'bold' },
            axisTick: { alignWithLabel: true }
        },
        yAxis: [
            {
                type: 'value',
                name: 'ARR (€)',
                nameTextStyle: { fontSize: 10, color: '#7f4cf5' },
                position: 'left',
                splitLine: { lineStyle: { type: 'dashed', opacity: 0.3 } },
                axisLabel: {
                    fontSize: 10,
                    formatter: (v: number) => {
                        if (v >= 1_000_000) return `€${(v / 1_000_000).toFixed(1)}M`;
                        if (v >= 1000) return `€${(v / 1000).toFixed(0)}K`;
                        return `€${v}`;
                    }
                }
            },
            {
                type: 'value',
                name: 'Clientes',
                nameTextStyle: { fontSize: 10, color: '#16a34a' },
                position: 'right',
                splitLine: { show: false },
                axisLabel: { fontSize: 10 }
            },
            {
                type: 'value',
                name: '%',
                nameTextStyle: { fontSize: 10, color: '#999' },
                position: 'right',
                offset: 50,
                min: 0,
                max: 100,
                splitLine: { show: false },
                axisLabel: { fontSize: 9, formatter: '{value}%' }
            }
        ],
        series: [
            {
                name: series.arr.label,
                type: 'bar',
                yAxisIndex: 0,
                data: series.arr.data,
                barMaxWidth: 60,
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#7f4cf5' },
                            { offset: 1, color: '#4c6cf5' }
                        ]
                    },
                    borderRadius: [6, 6, 0, 0]
                },
                label: {
                    show: true,
                    position: 'top',
                    fontSize: 10,
                    fontWeight: 'bold',
                    color: '#7f4cf5',
                    formatter: (p: any) => {
                        if (p.value >= 1_000_000) return `€${(p.value / 1_000_000).toFixed(1)}M`;
                        return `€${(p.value / 1000).toFixed(0)}K`;
                    }
                },
                emphasis: { focus: 'series' }
            },
            {
                name: series.mrr.label,
                type: 'bar',
                yAxisIndex: 0,
                data: series.mrr.data,
                barMaxWidth: 40,
                itemStyle: {
                    color: 'rgba(127, 76, 245, 0.25)',
                    borderRadius: [4, 4, 0, 0],
                    borderColor: '#7f4cf5',
                    borderWidth: 1,
                    borderType: 'dashed'
                },
                emphasis: { focus: 'series' }
            },
            {
                name: series.customers.label,
                type: 'line',
                yAxisIndex: 1,
                data: series.customers.data,
                smooth: true,
                lineStyle: { width: 3, color: '#16a34a' },
                itemStyle: { color: '#16a34a' },
                symbolSize: 8,
                areaStyle: { opacity: 0.08, color: '#16a34a' },
                label: {
                    show: true,
                    position: 'top',
                    fontSize: 10,
                    color: '#16a34a',
                    fontWeight: 'bold'
                }
            },
            {
                name: series.grossMargin.label,
                type: 'line',
                yAxisIndex: 2,
                data: series.grossMargin.data,
                smooth: true,
                lineStyle: { width: 2.5, color: '#f59e0b', type: 'dashed' },
                itemStyle: { color: '#f59e0b' },
                symbolSize: 6,
                symbol: 'diamond',
                label: {
                    show: true,
                    position: 'top',
                    fontSize: 9,
                    color: '#f59e0b',
                    formatter: '{c}%'
                }
            },
            {
                name: series.churnRate.label,
                type: 'line',
                yAxisIndex: 2,
                data: series.churnRate.data,
                smooth: true,
                lineStyle: { width: 2.5, color: '#ef4444', type: 'dashed' },
                itemStyle: { color: '#ef4444' },
                symbolSize: 6,
                symbol: 'triangle',
                label: {
                    show: true,
                    position: 'bottom',
                    fontSize: 9,
                    color: '#ef4444',
                    formatter: '{c}%'
                }
            },
            {
                name: series.arpu.label,
                type: 'line',
                yAxisIndex: 0,
                data: series.arpu.data,
                smooth: true,
                lineStyle: { width: 1.5, color: '#8b5cf6', type: 'dotted' },
                itemStyle: { color: '#8b5cf6' },
                symbolSize: 5
            }
        ]
    };

    return <EChartIsland option={option} height="480px" />;
}

export function GeoDistributionChart() {
    const [mapReady, setMapReady] = useState(false);
    const echartsRef = useRef<any>(null);
    const [currentRoam, setCurrentRoam] = useState<'scale' | boolean>('scale');
    const chartRef = useRef<any>(null);

    useEffect(() => {
        // Dynamically import echarts and register world map
        let cancelled = false;
        (async () => {
            try {
                const echarts = await import('echarts/core');
                const { MapChart } = await import('echarts/charts');
                const { TooltipComponent, VisualMapComponent, GeoComponent } = await import('echarts/components');
                const { SVGRenderer } = await import('echarts/renderers');
                echarts.use([MapChart, TooltipComponent, VisualMapComponent, GeoComponent, SVGRenderer]);

                // Fetch world GeoJSON
                const base = (import.meta.env.BASE_URL || '').replace(/\/$/, '');
                const res = await fetch(`${base}/data/world.json?v=3`);
                const worldJson = await res.json();
                echarts.registerMap('world', worldJson);
                echartsRef.current = echarts;
                if (!cancelled) setMapReady(true);
            } catch (err) {
                console.error('Failed to load world map:', err);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    if (!mapReady) {
        return (
            <div style={{ height: '420px', width: '100%', margin: '2rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-soft)', borderRadius: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Cargando mapa…</span>
            </div>
        );
    }

    // Build country→color mapping
    const countryData: { name: string; value: number; itemStyle: { areaColor: string } }[] = [];
    for (const region of distribucionGeo.regions) {
        for (const country of region.countries) {
            countryData.push({
                name: country,
                value: region.value,
                itemStyle: { areaColor: region.color }
            });
        }
    }

    const getOption = (roam: 'scale' | boolean) => ({
        textStyle: { fontFamily: 'Inter, sans-serif' },
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                const region = distribucionGeo.regions.find(r => r.countries.includes(params.name));
                if (!region) return params.name;
                return `<b>${region.label}</b><br/>${params.name}: ${region.value}%`;
            }
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            right: 10,
            top: 10,
            feature: {
                restore: { title: 'Reset' },
            },
            iconStyle: { borderColor: '#999' },
            emphasis: { iconStyle: { borderColor: '#7f4cf5' } }
        },
        geo: {
            map: 'world',
            roam,
            scaleLimit: { min: 1, max: 8 },
            left: '2%',
            right: '2%',
            top: '2%',
            bottom: '2%',
            aspectScale: 0.72,
            emphasis: {
                itemStyle: { areaColor: '#e0e0e5' },
                label: { show: false }
            },
            itemStyle: {
                areaColor: '#f0f0f3',
                borderColor: '#e0e0e5',
                borderWidth: 0.4
            },
            label: { show: false },
            silent: false,
            regions: countryData.map(c => ({
                name: c.name,
                itemStyle: c.itemStyle,
                emphasis: { itemStyle: { areaColor: c.itemStyle.areaColor, opacity: 0.85 } }
            }))
        },
        series: []
    });

    const onEvents = {
        georoam: () => {
            if (!chartRef.current) return;
            const instance = chartRef.current.getEchartsInstance();
            const opt = instance.getOption();
            const zoom = opt.geo?.[0]?.zoom ?? 1;
            const shouldMove = zoom > 1.05;
            if (shouldMove && currentRoam === 'scale') {
                setCurrentRoam(true);
            } else if (!shouldMove && currentRoam === true) {
                setCurrentRoam('scale');
            }
        },
        restore: () => {
            setCurrentRoam('scale');
        }
    };

    return (
        <div>
            <div style={{ height: '450px', width: '100%', margin: '2rem 0' }}>
                <ReactECharts
                    ref={chartRef}
                    option={getOption(currentRoam)}
                    style={{ height: '100%', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                    onEvents={onEvents}
                    notMerge={true}
                />
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                flexWrap: 'wrap',
                marginTop: '-0.5rem',
                marginBottom: '1rem',
            }}>
                {distribucionGeo.regions.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            width: '12px', height: '12px', borderRadius: '3px',
                            backgroundColor: r.color, display: 'inline-block', flexShrink: 0
                        }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <strong style={{ color: 'var(--text)' }}>{r.label}</strong> — {r.value}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

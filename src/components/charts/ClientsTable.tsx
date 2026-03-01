import React from 'react';

interface ClientRow {
    name: string;
    niche: string;
    start: string;
    mrr: string;
    ltv: string;
    arpa: string;
}

interface ClientsTableProps {
    clients: ClientRow[];
    summaryLabel?: string;
    summaryValues?: { mrr: string; ltv: string; arpa: string };
    footerLabel?: string;
    footerValues?: { mrr: string; ltv: string; arpa: string };
}

export default function ClientsTable({ clients, summaryLabel, summaryValues, footerLabel, footerValues }: ClientsTableProps) {
    return (
        <div style={{
            margin: '1.5rem 0',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.85rem'
        }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #7f4cf5 0%, #4c6cf5 100%)' }}>
                        {['Cliente', 'Nicho', 'Inicio', 'MRR actual', 'LTV neto', 'ARPA hist.'].map((h, i) => (
                            <th key={i} style={{
                                padding: '12px 16px',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '0.78rem',
                                textTransform: 'uppercase' as const,
                                letterSpacing: '0.5px',
                                textAlign: i >= 3 ? 'right' as const : 'left' as const,
                                whiteSpace: 'nowrap' as const
                            }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {clients.map((c, i) => (
                        <tr key={i} style={{
                            backgroundColor: i % 2 === 0 ? '#fafbfc' : '#fff',
                            transition: 'background-color 0.15s'
                        }}>
                            <td style={{ padding: '10px 16px', fontWeight: 600, color: '#1e293b' }}>{c.name}</td>
                            <td style={{ padding: '10px 16px', color: '#64748b', fontSize: '0.8rem' }}>{c.niche}</td>
                            <td style={{ padding: '10px 16px', color: '#64748b', fontSize: '0.8rem' }}>{c.start}</td>
                            <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#16a34a', fontVariantNumeric: 'tabular-nums' }}>{c.mrr}</td>
                            <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 500, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>{c.ltv}</td>
                            <td style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>{c.arpa}</td>
                        </tr>
                    ))}
                    {summaryLabel && summaryValues && (
                        <tr style={{
                            backgroundColor: '#f8fafc',
                            borderTop: '1px solid #e2e8f0'
                        }}>
                            <td colSpan={3} style={{ padding: '10px 16px', fontWeight: 500, color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                {summaryLabel}
                            </td>
                            <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#16a34a', fontVariantNumeric: 'tabular-nums' }}>{summaryValues.mrr}</td>
                            <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 500, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>{summaryValues.ltv}</td>
                            <td style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>{summaryValues.arpa}</td>
                        </tr>
                    )}
                </tbody>
                {footerLabel && footerValues && (
                    <tfoot>
                        <tr style={{
                            backgroundColor: '#f1f0ff',
                            borderTop: '2px solid #7f4cf5'
                        }}>
                            <td colSpan={3} style={{ padding: '12px 16px', fontWeight: 700, color: '#7f4cf5', fontSize: '0.82rem' }}>
                                {footerLabel}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#16a34a', fontVariantNumeric: 'tabular-nums' }}>{footerValues.mrr}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#334155', fontVariantNumeric: 'tabular-nums' }}>{footerValues.ltv}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>{footerValues.arpa}</td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
}

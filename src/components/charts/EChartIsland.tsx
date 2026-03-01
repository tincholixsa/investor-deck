import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

interface EChartIslandProps {
  option: any;
  height?: string;
  theme?: string;
}

export default function EChartIsland({ option, height = '400px', theme }: EChartIslandProps) {
  // We can merge Lixsa default styling here if needed
  const mergedOption = useMemo(() => {
    return {
      textStyle: {
        fontFamily: 'Inter, sans-serif'
      },
      tooltip: {
        trigger: 'axis',
        ...option.tooltip
      },
      ...option
    };
  }, [option]);

  const [isMounted, setIsMounted] = React.useState(false);

  const chartRef = React.useRef<any>(null);

  React.useEffect(() => {
    setIsMounted(true);

    // Add window resize listener to force re-render/resize for ECharts
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMounted) return <div style={{ height, width: '100%', maxWidth: '100vw', margin: '2rem 0', backgroundColor: 'transparent' }} />;

  return (
    <div className="echart-wrapper" style={{ height, width: '100%', maxWidth: '100%', overflow: 'hidden', margin: '2rem 0', position: 'relative' }}>
      <ReactECharts
        ref={chartRef}
        option={mergedOption}
        style={{ height: '100%', width: '100%', minWidth: '200px' }}
        theme={theme}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}

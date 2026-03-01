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

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div style={{ height, width: '100%', margin: '2rem 0', backgroundColor: 'transparent' }} />;

  return (
    <div className="echart-wrapper" style={{ height, width: '100%', margin: '2rem 0' }}>
      <ReactECharts
        option={mergedOption}
        style={{ height: '100%', width: '100%' }}
        theme={theme}
        opts={{ renderer: 'svg' }} // SVG is better for charts that might be printed/exported
      />
    </div>
  );
}

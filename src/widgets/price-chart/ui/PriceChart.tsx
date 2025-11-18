import React, { useEffect, useRef } from 'react';
import { createChart, LineData, Time } from 'lightweight-charts';
import { TransactionData } from '../../../entities/token-detail';
import './PriceChart.css';

interface PriceChartProps {
  transactions: TransactionData[];
  tokenSymbol?: string;
}

/**
 * Компонент графика цены токена на основе TradingView Lightweight Charts
 */
export const PriceChart: React.FC<PriceChartProps> = ({ transactions, tokenSymbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current || transactions.length === 0) return;

    // Создаём график в темной теме
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#1B212F' },
        textColor: '#A4A8B9',
      },
      grid: {
        vertLines: { color: '#2A3646' },
        horzLines: { color: '#2A3646' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#2A3646',
      },
      rightPriceScale: {
        borderColor: '#2A3646',
      },
    });

    chartRef.current = chart;

    // Создаём линейную серию (v4 API) в стиле терминала
    const lineSeries = chart.addAreaSeries({
      lineColor: '#674EEA',
      topColor: 'rgba(103, 78, 234, 0.4)',
      bottomColor: 'rgba(103, 78, 234, 0.05)',
      lineWidth: 2,
    });

    seriesRef.current = lineSeries;

    // Преобразуем транзакции в данные для графика
    const chartData = prepareChartData(transactions);
    lineSeries.setData(chartData);

    // Подгоняем график под данные
    chart.timeScale().fitContent();

    // Обработка изменения размера
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="price-chart-container">
        <div className="chart-loading">
          <p>No transaction data available for chart</p>
          <span style={{ fontSize: '12px', color: '#6B7E7E' }}>Chart will appear once transactions are recorded</span>
        </div>
      </div>
    );
  }

  return (
    <div className="price-chart-container">
      <div ref={chartContainerRef} className="price-chart" />
    </div>
  );
};

/**
 * Преобразует транзакции в данные для линейного графика
 */
function prepareChartData(transactions: TransactionData[]): LineData[] {
  if (transactions.length === 0) return [];

  // Сортируем транзакции по времени
  const sortedTx = [...transactions].sort((a, b) => a.txTimestamp - b.txTimestamp);

  // Преобразуем в формат LineData
  return sortedTx.map((tx) => ({
    time: Math.floor(tx.txTimestamp / 1000) as Time,
    value: tx.priceUsd,
  }));
}

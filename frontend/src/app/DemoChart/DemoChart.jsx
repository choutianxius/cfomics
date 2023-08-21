import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
import { default as React, useEffect, useState } from 'react';
import { Chart, LinearScale, CategoryScale, Legend } from 'chartjs';

Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale, Legend);

function random3 () {
  return [Math.random() * 10, Math.random() * 10, Math.random() * 10];
}

export default function DemoChart () {
  const [chart, setChart] = useState(null);
  const [canvas, setCanvas] = useState(null);
  useEffect(() => {
    setCanvas(document.getElementById('myChart').getContext('2d'));
  }, []);
  useEffect(() => {
    if (canvas) {
      if (chart !== null) {
        chart.destroy();
      }
      setChart(new Chart(canvas, {
        type: 'boxplot',
        data: {
          labels: ['Cancer1', 'Cancer2', 'Cancer3'],
          datasets: [
            {
              label: 'Dataset1',
              backgroundColor: 'rgba(0,255,0,.7)',
              data: [
                random3(),
                random3(),
                random3(),
              ],
            },
            {
              label: 'Dataset2',
              backgroundColor: 'rgba(255,0,0,.7)',
              data: [
                random3(),
                random3(),
                random3(),
              ],
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
        },
      }));
    }
  }, [canvas]);

  return (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <canvas id="myChart" />
    </div>
  );
}

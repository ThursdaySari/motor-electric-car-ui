import './App.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [motordata, setMotordata] = useState('');
    useEffect(() => {
      GraphLine()
      const id = setInterval(() => {
        GraphLine()
        console.log('loop start')
      }, 1 * 1000)
      return () => clearInterval(id)
    }, [])
  const GraphLine = async () => {
    axios.get('http://localhost:4000/motor').then((result) => {
      console.log(result.data.length)
      setMotordata(result.data);
    })
  }
  const options = {
    position: 'left',
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'MotorEV Voltage',
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Frequency',
          color: '#911',
          font: {
            family: 'Comic Sans MS',
            size: 20,
            weight: 'bold',
            lineHeight: 1.2,
          },
          padding: {top: 20, left: 0, right: 0, bottom: 0}
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Current',
          color: '#191',
          font: {
            family: 'Times',
            size: 20,
            style: 'normal',
            lineHeight: 1.2
          },
          padding: {top: 30, left: 0, right: 0, bottom: 0}
        },
        min: -5,
        max: 5,
      }
    }
  };
  const data = {
    labels: motordata ? motordata.slice(-5).map((x, i) => (i + 1)) : [],
    datasets: [
      {
        label: 'Current In',
        data: motordata
          ? motordata
              .slice(-5)
              .map(x => x.currentIn)
          : [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Current Out',
        data: motordata
          ? motordata
              .slice(-5)
              .map(x => x.currentOut)
          : [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
};

  return (
    <div className="App">
      <header className="App-header">
        <Line options={options} data={data} />
      </header>
    </div>
  );
}

export default App;

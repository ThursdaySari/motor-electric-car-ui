import logo from './logo.svg';
import './App.css';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
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
    }, [])
  const GraphLine = async () => {
    axios.get('http://localhost:4000/motor').then((result) => {
      console.log(result.data.length)
      setMotordata(result.data);
    })
  }
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
    scales: {
      y: {
        min: 100,
        max: 120,
      }
    }
  };
  const labels = motordata ? motordata.map((x, i) => (i+1)) : [];
  const data = {
    labels,
    datasets: [
      {
        label: 'Voltage In',
        data: motordata ? motordata.map(x => x.voltageIn) : [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Voltage Out',
        data: motordata ? motordata.map(x => x.voltageOut) : [],
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

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
  const [fftData, setFftData] = useState([]);
  const [energy, setEnergy] = useState(0);
  const [harmonic, setHarmonic] = useState('');
  const [statusMotor, setStatus] = useState('');
  const [motorColor, setMotorColor] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const GraphLine = async () => {
    axios.get('http://localhost:4000/motor/fftdata').then((result) => {
      console.log(result.data.length)
      // setMotordata(result.data);
      // setRawData(result.data);
      setFftData([...result.data]);
      const dataArray = result.data;
      const average = x => x.reduce((sum, v) => sum + Math.abs(v)) / x.length;
      const avgEnergy = average(dataArray)
      const RawEnergy = (avgEnergy * avgEnergy)*10;
      const ha = Math.abs(fftData[210*3])
      setHarmonic(ha.toFixed(4))
      setEnergy(RawEnergy);
      const status =ha < 3.2 ? ha < 1.6 ? 'Healthy State(FFT)' : 'Incipient Failur State(FFT)' : 'Severe Failur State(FFT)'
      setStatus(status)
      const colorMotor = ha < 3 ? ha < 1.4 ? 'Healthy' : 'Incipient' : 'Failur'
      setMotorColor(colorMotor)
      console.log(harmonic)
    })
  }

  useEffect(() => {
    GraphLine()
    const id = setInterval(() => {
      GraphLine()
    }, 1 * 1000)
    return () => clearInterval(id)
  }, [fftData, energy, harmonic, statusMotor, motorColor, GraphLine])

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
            family: 'Times',
            size: 20,
            weight: 'bold',
            lineHeight: 0.5,
          },
          padding: {top: 20, left: 0, right: 0, bottom: 0}
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Amplitude(I)',
          color: '#191',
          font: {
            family: 'Times',
            size: 20,
            style: 'normal',
            lineHeight: 0.5
          },
          padding: {top: 30, left: 0, right: 0, bottom: 0}
        },
        min: 0,
        max: 300,
      }
    }
  };
  const data = {
    labels: fftData ? fftData.map((x, i) => (i - 5000)) : [],
    datasets: [
      {
        label: 'FFT',
        data: fftData
          ? fftData
          : [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
};

  return (
    <div className="App">
      <header className="App-header">
      <div className="ItemGroup">
          <div className="ItemDetail">Energy:</div>
          <div className="ItemDetail">{energy.toFixed(4)}</div>
        </div>
        <div className="ItemGroup">
          <div className="ItemDetail">3rd Harmonic:</div>
          <div className="ItemDetail">{harmonic}</div>
        </div>
        <div className="ItemGroup">
          <div className="ItemDetail">Status:</div>
          <div className={`ItemDetail ${motorColor}`}>{statusMotor}</div>
        </div>
        <Line options={options} data={data} />
      </header>
    </div>
  );
}

export default App;

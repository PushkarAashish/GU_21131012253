import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [numberType, setNumberType] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!['p', 'f', 'e', 'r'].includes(numberType)) {
      setError('Invalid number type. Please use p, f, e, or r.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/numbers/${numberType}`);
      setData(response.data);
    } catch (error) {
      setError('Failed to fetch data from the server.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Average Calculator</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Number Type:
            <input
              type="text"
              value={numberType}
              onChange={(e) => setNumberType(e.target.value)}
              placeholder="Enter p, f, e, or r"
            />
          </label>
          <button type="submit">Fetch</button>
        </form>
        {error && <p className="error">{error}</p>}
        {data && (
          <div className="result">
            <h2>Stored Numbers</h2>
            <ul>
              {data.storedNumbers.map((num, index) => (
                <li key={index}>{num}</li>
              ))}
            </ul>
            <p><strong>Average:</strong> {data.average}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

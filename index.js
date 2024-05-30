const express = require('express');
const app = express();
const port = 3000;

const windowSize = 10;
const numberStore = {
  p: [],
  f: [],
  e: [],
  r: []
};

// Helper functions to generate numbers
const generatePrime = () => {
  let num = 2;
  while (!isPrime(num)) num++;
  return num++;
};

const isPrime = (num) => {
  for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++)
    if (num % i === 0) return false;
  return num > 1;
};

const generateFibonacci = () => {
  const fibonacci = [0, 1];
  for (let i = 2; i < 20; i++) {
    fibonacci.push(fibonacci[i - 1] + fibonacci[i - 2]);
  }
  return fibonacci[Math.floor(Math.random() * fibonacci.length)];
};

const generateEven = () => Math.floor(Math.random() * 50) * 2;

const generateRandom = () => Math.floor(Math.random() * 100);

// Helper function to fetch numbers based on type
const fetchNumber = (type) => {
  switch (type) {
    case 'p':
      return generatePrime();
    case 'f':
      return generateFibonacci();
    case 'e':
      return generateEven();
    case 'r':
      return generateRandom();
    default:
      return null;
  }
};

// Middleware to handle the logic
app.use('/numbers/:type', (req, res, next) => {
  const { type } = req.params;
  if (!['p', 'f', 'e', 'r'].includes(type)) {
    return res.status(400).json({ error: 'Invalid number type' });
  }

  const number = fetchNumber(type);
  if (number !== null) {
    const numbers = numberStore[type];
    if (!numbers.includes(number)) {
      if (numbers.length >= windowSize) {
        numbers.shift();
      }
      numbers.push(number);
    }
  }

  next();
});

// Route to handle the API request
app.get('/numbers/:type', (req, res) => {
  const { type } = req.params;
  const numbers = numberStore[type];
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  const average = numbers.length > 0 ? sum / numbers.length : 0;

  res.json({
    storedNumbers: numbers,
    average: average.toFixed(2)
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

import React, { useState } from 'react';
import CRUD from './CRUD';

function App() {
  const [count, setCount] = useState(0);

  return (
    <CRUD />
  );
}

export default App;

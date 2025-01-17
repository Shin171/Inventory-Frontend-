import React, { useState } from 'react';
import CRUD from './CRUD';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold text-center ">Inventory System</h1>
      <CRUD />
    </div>
  );
}

export default App;

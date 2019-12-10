import React from 'react';
import './App.css';

function App() {
  return (
    <div className='wrapper'>
      <header>
        <h1>A3 - Search Engine</h1>
      </header>
      <main>
        <input type='text' placeholder='Search...'></input>
        <button type='submit'>Search</button>
      </main>
    <p style={{ margin: '1em 0 2em' }}>Created by <a href='https://github.com/antonstrand'>Anton Strand</a></p>
  </div>
  );
}

export default App;

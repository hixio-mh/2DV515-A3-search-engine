import React from 'react'
import './App.css'

function App () {
  return (
    <div className='wrapper'>
      <header>
        <h1>A3 - Search Engine</h1>
      </header>
      <main>
        <form>
          <input type='text' placeholder='Search...' />
          <button type='submit'>Search</button>
        </form>
        <table>
          <tbody>
            <tr>
              <th className='alignLeft'>Page</th>
              <th>Score</th>
              <th>Content</th>
              <th>Location</th>
              <th>Page rank</th>
            </tr>
            <tr>
              <td className='alignLeft'>Java programming as a concept</td>
              <td>1</td>
              <td>0.8</td>
              <td>0.7</td>
              <td>0.2</td>
            </tr>
            <tr>
              <td className='alignLeft'>Java</td>
              <td>1</td>
              <td>0.8</td>
              <td>0.7</td>
              <td>0.2</td>
            </tr>
            <tr>
              <td className='alignLeft'>Java</td>
              <td>1</td>
              <td>0.8</td>
              <td>0.7</td>
              <td>0.2</td>
            </tr>
            <tr>
              <td className='alignLeft'>Java</td>
              <td>1</td>
              <td>0.8</td>
              <td>0.7</td>
              <td>0.2</td>
            </tr>
            <tr>
              <td className='alignLeft'>Java</td>
              <td>1</td>
              <td>0.8</td>
              <td>0.7</td>
              <td>0.2</td>
            </tr>
          </tbody>
        </table>
        <p>Results in XX sec</p>
      </main>
      <footer>
        <p>
          Created by <a href='https://github.com/antonstrand'>Anton Strand</a>
        </p>
      </footer>
    </div>
  )
}

export default App

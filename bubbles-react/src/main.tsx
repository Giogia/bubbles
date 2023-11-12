import React from 'react'
import ReactDOM from 'react-dom/client'
import { BubblesUi } from './components'
import './index.css'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <BubblesUi
      data={{
        nodes: [
          { radius: 0.1, x: 0, y: 0, name: "Node 0" },
          { radius: 0.1, x: 0.25, y: 0.1, name: "Node 1" },
          { radius: 0.25, x: 0.5, y: 0.35, name: "Node 2" },
          { radius: 0.25, x: 0.35, y: 0.75, name: "Node 3" },
          { radius: 0.1, x: 0.5, y: 0.5, name: "Node 4" },
          { radius: 0.1, x: 0.51, y: 0.85, name: "Node 5" },
          { radius: 0.25, x: 0.25, y: 0.25, name: "Node 6" },
          { radius: 0.1, x: 0.15, y: 0.05, name: "Node 7" },
          { radius: 0.1, x: 0.63, y: 0.45, name: "Node 8" },
        ],
        links: []
      }}
    />
  </React.StrictMode>
)
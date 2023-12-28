import React from 'react'
import ReactDOM from 'react-dom/client'
import { BubblesUi } from './components'
import './index.css'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <BubblesUi
      nodes={[
        { id: "Node 0", radius: 0.1, x: 0, y: 0 },
        { id: "Node 1", radius: 0.1, x: 0.25, y: 0.1 },
        { id: "Node 2", radius: 0.25, x: 0.5, y: 0.35 },
        { id: "Node 3", radius: 0.25, x: 0.35, y: 0.75 },
        { id: "Node 4", radius: 0.1, x: 0.5, y: 0.5 },
        { id: "Node 5", radius: 0.1, x: 0.51, y: 0.85 },
        { id: "Node 6", radius: 0.25, x: 0.25, y: 0.25 },
        { id: "Node 7", radius: 0.1, x: 0.15, y: 0.05 },
        { id: "Node 8", radius: 0.1, x: 0.63, y: 0.45 },
      ]}
      links={[]}
    >
      <div>{"test"}</div>
      <div>{"test"}</div>
      <div>{"test"}</div>
      <div>{"test"}</div>
      <div>{"test"}</div>
      <div>{"test"}</div>
      <div>{"test"}</div>
      <div>{"test"}</div>
      <div>{"test"}</div>
    </BubblesUi>
  </React.StrictMode>
)
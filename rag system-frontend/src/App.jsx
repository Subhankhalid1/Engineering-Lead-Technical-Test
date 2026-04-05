import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Ingest from './pages/Ingest'
import Ask from './pages/Ask'
import Documents from './pages/Documents'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"       element={<Dashboard />} />
        <Route path="/ingest" element={<Ingest />} />
        <Route path="/ask"    element={<Ask />} />
        <Route path="/docs"   element={<Documents />} />
        <Route path="*"       element={<Dashboard />} />
      </Routes>
    </Layout>
  )
}

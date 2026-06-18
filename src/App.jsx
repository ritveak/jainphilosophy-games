import { Routes, Route } from 'react-router-dom';
import ConceptHub from './components/layout/ConceptHub';
import ConceptPage from './components/layout/ConceptPage';

export default function App() {
  return (
    <div className="bg-stone-50 text-stone-900 font-sans min-h-screen">
      <Routes>
        <Route path="/" element={<ConceptHub />} />
        <Route path="/concept/:conceptId" element={<ConceptPage />} />
      </Routes>
    </div>
  );
}

import { useState } from 'react';
import { unlockConcept } from '../../concepts';

export default function ConceptPasswordForm({ conceptId, onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!unlockConcept(conceptId, password)) {
      setError('That password did not match.');
      return;
    }
    setError('');
    onUnlock();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 rounded-2xl border border-stone-200 bg-white/90 p-4">
      <label htmlFor={`concept-password-${conceptId}`} className="block text-sm font-medium text-stone-800">
        Enter password to continue
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id={`concept-password-${conceptId}`}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200"
        />
        <button type="submit" className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
          Unlock
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-700" role="alert">{error}</p>}
    </form>
  );
}

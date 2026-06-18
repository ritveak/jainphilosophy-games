export default function LabEmbedded({ title, children }) {
  return (
    <div className="lab-embedded">
      <p className="text-xs uppercase tracking-widest text-stone-500 mb-1">Laboratory</p>
      <h2 className="text-xl font-semibold text-stone-900 mb-6">{title}</h2>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

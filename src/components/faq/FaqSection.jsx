export default function FaqSection({ intro, items }) {
  return (
    <div className="space-y-3">
      {intro && <p className="concept-prose text-stone-600 mb-4">{intro}</p>}
      {items.map(({ question, answer }) => (
        <details
          key={question}
          className="rounded-xl border border-stone-200 bg-white px-5 py-4"
        >
          <summary className="font-medium text-stone-900 cursor-pointer">{question}</summary>
          <p className="mt-3 text-stone-600 text-sm leading-relaxed">{answer}</p>
        </details>
      ))}
    </div>
  );
}

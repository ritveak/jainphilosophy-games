export default function ResourcesRenderer({ items }) {
  return (
    <div className="space-y-6">
      <div className="prose prose-stone max-w-none">
        <p className="text-stone-700 leading-relaxed mb-8">
          Deepen your understanding of Samvayas, Karma, and the philosophical principles behind cause and effect.
        </p>
      </div>

      <div className="grid gap-4">
        {items.map((resource) => (
          <a
            key={resource.url}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-stone-200 rounded-lg hover:border-stone-400 hover:bg-stone-50 transition-colors no-underline group"
          >
            <h3 className="font-semibold text-stone-900 group-hover:text-stone-700 mb-2">
              {resource.title}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">{resource.description}</p>
            <p className="text-xs text-stone-500 mt-3">{new URL(resource.url).hostname}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

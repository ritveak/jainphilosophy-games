export default function ConceptTabs({ tabs, activeTab, onTabChange, ariaLabel }) {
  return (
    <nav className="concept-tabs" role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`concept-tab-btn${activeTab === tab.id ? ' tab-btn-active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

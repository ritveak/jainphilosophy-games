function initTabs(tabMap, defaultTab) {
  const buttons = {};
  const panels = {};

  for (const key in tabMap) {
    buttons[key] = document.getElementById(tabMap[key].btn);
    panels[key] = document.getElementById(tabMap[key].panel);
    buttons[key].addEventListener('click', () => showTab(key));
  }

  function showTab(tab) {
    for (const key in panels) {
      const isActive = key === tab;
      panels[key].classList.toggle('hide', !isActive);
      buttons[key].classList.toggle('tab-btn-active', isActive);
      if (!buttons[key].classList.contains('concept-tab-btn')) {
        buttons[key].classList.toggle('bg-stone-200', !isActive);
        buttons[key].classList.toggle('hover:bg-stone-300', !isActive);
      }
      buttons[key].setAttribute('aria-selected', isActive ? 'true' : 'false');
    }
  }

  showTab(defaultTab);
  return { showTab };
}

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
      panels[key].classList.toggle('hide', key !== tab);
      buttons[key].classList.toggle('tab-btn-active', key === tab);
      buttons[key].classList.toggle('bg-stone-200', key !== tab);
      buttons[key].classList.toggle('hover:bg-stone-300', key !== tab);
    }
  }

  showTab(defaultTab);
  return { showTab };
}

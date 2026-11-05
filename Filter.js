function toggleSessionsDropdown() {
    const menu = document.getElementById("sessionsFilterMenu");
    if (menu) menu.classList.toggle("show");
}

function selectSessionFilter(filterType, btnElement) {
    currentSessionFilter = filterType;
    const label = document.getElementById("currentFilterLabel");
    if (label) label.textContent = filterType;

    document.querySelectorAll('.filter-option-item').forEach(item => {
        item.classList.remove('active');
    });
    if (btnElement) btnElement.classList.add('active');

    toggleSessionsDropdown();
    renderSidebarList();
}

(function () {
  "use strict";

  const schemes = window.SCHEMES || [];
  const states = window.SCHEME_STATES || [];
  const root = document.querySelector("[data-scheme-directory]");
  if (!root) return;

  const searchInput = document.getElementById("directory-search");
  const stateSelect = document.getElementById("directory-state");
  const categorySelect = document.getElementById("directory-category");
  const grid = document.getElementById("directory-grid");
  const count = document.getElementById("directory-count");
  const empty = document.getElementById("directory-empty");
  const fixedState = root.getAttribute("data-state") || "";

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function unique(values) {
    return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, "hi"));
  }

  function fillSelect(select, options, label) {
    if (!select) return;
    select.innerHTML = `<option value="">${label}</option>` + options.map((option) => {
      const value = typeof option === "string" ? option : option.value;
      const text = typeof option === "string" ? option : option.text;
      return `<option value="${escapeHtml(value)}">${escapeHtml(text)}</option>`;
    }).join("");
  }

  function matchesSearch(scheme, query) {
    if (!query) return true;
    const haystack = normalize(`${scheme.name} ${scheme.hindiName} ${scheme.state} ${scheme.category} ${scheme.summary} ${scheme.keywords}`);
    return haystack.includes(query);
  }

  function detailUrl(scheme) {
    const cleanPath = String(scheme.pageUrl || "").replace(/^(\.\.\/)+/, "");
    const inSubFolder = window.location.pathname.includes("/state/") || window.location.pathname.includes("/category/");
    return `${inSubFolder ? "../" : ""}${cleanPath}`;
  }

  function card(scheme) {
    return `
      <article class="scheme-card directory-card" data-state="${escapeHtml(scheme.state)}" data-category="${escapeHtml(scheme.category)}">
        <div class="scheme-card-header">
          <span class="scheme-cat-tag">${escapeHtml(scheme.category)}</span>
          <h3>${escapeHtml(scheme.name)}</h3>
        </div>
        <div class="scheme-card-body">
          <p class="scheme-hindi-name">${escapeHtml(scheme.hindiName)}</p>
          <p class="scheme-short-desc">${escapeHtml(scheme.summary)}</p>
          <div class="scheme-meta-row">
            <span>${escapeHtml(scheme.state)}</span>
            <span>${escapeHtml(scheme.category)}</span>
          </div>
        </div>
        <div class="scheme-card-footer">
          <a href="${escapeHtml(scheme.officialUrl)}" target="_blank" rel="noopener noreferrer" class="scheme-official-link">Official</a>
          <a href="${escapeHtml(detailUrl(scheme))}" class="scheme-read-more">विवरण</a>
        </div>
      </article>`;
  }

  function render() {
    if (!grid || !count || !empty) return;
    const query = normalize(searchInput && searchInput.value);
    const state = fixedState || (stateSelect && stateSelect.value) || "";
    const category = (categorySelect && categorySelect.value) || "";
    const filtered = schemes.filter((scheme) => {
      return (!state || scheme.stateSlug === state)
        && (!category || scheme.category === category)
        && matchesSearch(scheme, query);
    });

    grid.innerHTML = filtered.map(card).join("");
    count.textContent = `${filtered.length} योजना मिली`;
    empty.hidden = filtered.length !== 0;
  }

  function renderStateLinks() {
    const holder = document.getElementById("state-link-grid");
    if (!holder) return;
    holder.innerHTML = states.map((state) => {
      const total = schemes.filter((scheme) => scheme.stateSlug === state.slug).length;
      return `<a class="state-link-card" href="${escapeHtml(state.slug)}.html">
        <strong>${escapeHtml(state.name)}</strong>
        <span>${escapeHtml(state.description)}</span>
        <em>${total} योजना</em>
      </a>`;
    }).join("");
  }

  fillSelect(stateSelect, states.map((state) => ({ value: state.slug, text: state.name })), "सभी राज्य");
  fillSelect(categorySelect, unique(schemes.map((scheme) => scheme.category)), "सभी श्रेणियां");

  [searchInput, stateSelect, categorySelect].forEach((control) => {
    if (control) control.addEventListener("input", render);
  });

  renderStateLinks();
  render();
})();

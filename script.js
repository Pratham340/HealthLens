const claimInput = document.querySelector('#claimInput');
const results = document.querySelector('#results');
const emptyState = document.querySelector('#emptyState');
const sourceList = document.querySelector('#sourceList');
const investigateButton = document.querySelector('#investigateButton');

function escapeHtml(value) { const helper = document.createElement('div'); helper.textContent = value || ''; return helper.innerHTML; }
function safeUrl(value) { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : 'https://pubmed.ncbi.nlm.nih.gov/'; } catch { return 'https://pubmed.ncbi.nlm.nih.gov/'; } }
function sourceMarkup(sources) { return sources.map(source => `<a class="source-link" href="${safeUrl(source.url)}" target="_blank" rel="noreferrer"><span><strong>${escapeHtml(source.title)}</strong><small>${escapeHtml(source.type)} · ${escapeHtml(source.note)}</small></span><b>↗</b></a>`).join(''); }
function claimParts(data) { return `<div><b>Subject</b><span>${escapeHtml(data.subject)}</span></div><div><b>Action</b><span>${escapeHtml(data.action)}</span></div><div><b>Outcome</b><span>${escapeHtml(data.outcome)}</span></div>`; }
function setDossier(data) {
  document.querySelector('#quotedClaim').textContent = `“${data.claim}”`;
  document.querySelector('#claimParts').innerHTML = claimParts(data);
  document.querySelector('#evidenceText').textContent = data.evidence;
  document.querySelector('#strengthTitle').textContent = data.strength;
  document.querySelector('#strengthText').textContent = data.strengthText;
  document.querySelector('#strengthPill').textContent = data.pill;
  document.querySelector('#reasoningList').innerHTML = data.reasons.map((reason, index) => `<div class="reason-row"><i>${index + 1}</i><div><strong>${escapeHtml(reason.title)}</strong><span>${escapeHtml(reason.detail)}</span></div></div>`).join('');
  document.querySelector('#gapsList').innerHTML = data.gaps.map(gap => `<div class="gap-row">${escapeHtml(gap)}</div>`).join('');
  document.querySelector('#sourceCount').textContent = `${data.sources.length} source${data.sources.length === 1 ? '' : 's'}`;
  document.querySelector('#sourcesNote').textContent = data.sourceNote;
  sourceList.innerHTML = sourceMarkup(data.sources);
  document.querySelector('#nextSteps').innerHTML = data.next.map(step => `<li>${escapeHtml(step)}</li>`).join('');
}
function setLoading(isLoading) {
  investigateButton.disabled = isLoading;
  investigateButton.innerHTML = isLoading ? 'Reviewing sources <span>⋯</span>' : 'Investigate claim <span>→</span>';
  document.querySelector('.claim-form').setAttribute('aria-busy', String(isLoading));
}
function showError(message) {
  document.querySelector('#resultHeading').textContent = 'We couldn’t build this dossier.';
  document.querySelector('#quotedClaim').textContent = 'Try again in a moment.';
  document.querySelector('#claimParts').innerHTML = `<div><b>What happened</b><span>${escapeHtml(message)}</span></div>`;
  document.querySelector('#evidenceText').textContent = 'No evidence summary was generated, so Claimlight is not showing an assessment.';
  document.querySelector('#strengthTitle').textContent = 'Not assessed';
  document.querySelector('#strengthText').textContent = 'A missing or failed source check should never become a confident answer.';
  document.querySelector('#strengthPill').textContent = 'Try again';
  document.querySelector('#reasoningList').innerHTML = '';
  document.querySelector('#gapsList').innerHTML = '<div class="gap-row">No sources were returned for this request.</div>';
  document.querySelector('#sourceCount').textContent = '0 sources';
  document.querySelector('#sourcesNote').textContent = 'Check that the server is running and that an OpenAI API key is configured.';
  sourceList.innerHTML = '';
  document.querySelector('#nextSteps').innerHTML = '<li>Do not treat a failed request as an evidence conclusion.</li>';
}
async function investigate() {
  const claim = claimInput.value.trim();
  if (!claim) { claimInput.focus(); return; }
  setLoading(true);
  try {
    const response = await fetch('/api/investigate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ claim }) });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || 'The research service is unavailable.');
    setDossier(body);
    document.querySelector('#resultHeading').textContent = 'Here’s how the assessment was built.';
  } catch (error) {
    const message = error instanceof TypeError && /fetch/i.test(error.message) ? 'The research server is not running. Open the app at http://localhost:3000 after starting the server.' : error.message || 'The research service is unavailable.';
    showError(message);
  } finally {
    setLoading(false);
    emptyState.classList.add('hidden'); results.classList.remove('hidden');
    setTimeout(() => results.scrollIntoView({ behavior: 'smooth', block: 'start' }), 20);
  }
}

document.querySelector('#investigateButton').addEventListener('click', investigate);
document.querySelector('#exampleButton').addEventListener('click', () => { claimInput.value = 'Turmeric cures inflammation.'; investigate(); });
claimInput.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') investigate(); });
document.querySelector('#aboutButton').addEventListener('click', () => document.querySelector('#aboutModal').classList.remove('hidden'));
document.querySelector('#closeButton').addEventListener('click', () => document.querySelector('#aboutModal').classList.add('hidden'));
document.querySelector('#aboutModal').addEventListener('click', event => { if (event.target.id === 'aboutModal') event.currentTarget.classList.add('hidden'); });
document.querySelector('#copyButton').addEventListener('click', async () => { const text = [document.querySelector('#quotedClaim').innerText, document.querySelector('#strengthTitle').innerText, document.querySelector('#strengthText').innerText].join('\n'); try { await navigator.clipboard.writeText(`Claimlight dossier\n${text}`); document.querySelector('#copyButton').textContent = '✓'; setTimeout(() => document.querySelector('#copyButton').textContent = '⧉', 1400); } catch { /* Clipboard is unavailable in some browsing contexts. */ } });

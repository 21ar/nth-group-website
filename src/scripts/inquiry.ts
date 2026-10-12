export {};
const form = document.querySelector<HTMLFormElement>('[data-inquiry-form]');
if (form) {
  form.hidden = false;
  const project = new URLSearchParams(location.search).get('project');
  const select = form.querySelector<HTMLSelectElement>('[name="project"]');
  if (project && select && [...select.options].some(option => option.value === project)) select.value = project;
  const topic = new URLSearchParams(location.search).get('topic');
  const messageField = form.querySelector<HTMLTextAreaElement>('[name="message"]');
  if (topic && topic.length < 180 && messageField) messageField.value = `I would like to discuss ${topic.toLowerCase()}.\n\n`;
  if (project === 'partnership' && new URLSearchParams(location.search).get('brief') === 'prepared' && messageField) {
    try {
      const stored = sessionStorage.getItem('nrth-partnership-brief');
      sessionStorage.removeItem('nrth-partnership-brief');
      const brief = stored ? JSON.parse(stored) : null;
      if (brief?.version === 1 && typeof brief.message === 'string' && brief.message.length <= 3000 && typeof brief.createdAt === 'number' && brief.createdAt <= Date.now() && Date.now() - brief.createdAt < 3600000) messageField.value = brief.message;
    } catch { /* A blank inquiry remains available when tab storage is unavailable. */ }
  }
  const result = form.querySelector<HTMLElement>('[data-inquiry-result]');
  if (project === 'nrth-labs' && new URLSearchParams(location.search).get('outline') === 'prepared' && messageField) {
    try {
      const stored = sessionStorage.getItem('nrth-research-outline');sessionStorage.removeItem('nrth-research-outline');
      const outline = stored ? JSON.parse(stored) : null;
      if (outline?.version === 1 && typeof outline.message === 'string' && outline.message.length <= 4500 && typeof outline.createdAt === 'number' && outline.createdAt <= Date.now() && Date.now() - outline.createdAt < 3600000) messageField.value = outline.message;
    } catch { /* The ordinary editable inquiry remains available. */ }
  }
  const preview = form.querySelector<HTMLElement>('[data-inquiry-preview]');
  const status = form.querySelector<HTMLElement>('[data-inquiry-status]');
  let message = '';
  let objectUrl: string | undefined;
  let requestId = crypto.randomUUID();
  let sending = false;
  let sent = false;
  const send = form.querySelector<HTMLButtonElement>('[data-inquiry-send]');
  const error = form.querySelector<HTMLElement>('[data-inquiry-error]');
  form.addEventListener('input', () => {
    requestId = crypto.randomUUID(); sent = false;
    if (result) result.hidden = true;
    if (send) {send.disabled = false; send.textContent = 'Send inquiry';}
  });
  send?.addEventListener('click', async () => {
    if (sending || sent || !form.reportValidity()) return;
    sending = true; send.disabled = true; send.textContent = 'Sending…';
    if (error) error.hidden = true;
    const values = new FormData(form);
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input,select,textarea')];
    fields.forEach(field=>field.disabled = true);
    const edit = form.querySelector<HTMLButtonElement>('[data-inquiry-edit]');if(edit) edit.disabled = true;
    try {
      const response = await fetch('/api/inquiries', {method:'POST', signal:AbortSignal.timeout(18000), headers:{'Content-Type':'application/json'}, body:JSON.stringify({...Object.fromEntries(values), requestId})});
      const receipt = await response.json().catch(()=>({error:'Website delivery is currently unavailable. Please use your email app or save your inquiry.'}));
      if (!response.ok) throw new Error(receipt.error || 'Your inquiry could not be sent. Please try again.');
      sent = true; send.textContent = 'Inquiry accepted';
      if (status) status.textContent = `${receipt.message} Reference: ${receipt.reference}.`;
      form.querySelector<HTMLElement>('[data-inquiry-review-note]')!.textContent = 'Your inquiry has been accepted for delivery. Keep the reference for your conversation with NRTH.';
      window.dispatchEvent(new CustomEvent('nrth:interaction', {detail:{venture:select?.value || 'general', action:'inquiry_accepted'}}));
    } catch (reason) {
      if (error) {error.textContent = reason instanceof Error && reason.name === 'Error' ? reason.message : 'Delivery could not be confirmed. Please retry or use your email app.'; error.hidden = false;}
      send.disabled = false; send.textContent = 'Retry sending';
    } finally {sending = false;fields.forEach(field=>field.disabled = false);if(edit) edit.disabled = false;}
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const selectedName = select?.selectedOptions[0]?.textContent || 'General inquiry';
    const subject = `NRTH inquiry — ${selectedName}`;
    message = `${subject}\n\nName: ${values.get('name')}\nEmail: ${values.get('email')}\nOrganization: ${values.get('organization') || 'Not specified'}\n\n${values.get('message')}\n`;
    if (preview) preview.textContent = message;
    if (result) { result.hidden = false; result.focus(); }
    if (status) status.textContent = '';
    if (error) error.hidden = true;
    form.querySelector<HTMLElement>('[data-inquiry-review-note]')!.textContent = 'Check the details, then send your inquiry. You can also use your email app or save a copy.';
    const emailLink = form.querySelector<HTMLAnchorElement>('[data-inquiry-email]');
    const destination = select?.value === 'investor' ? form.dataset.investorsEmail || form.dataset.contactEmail : select?.value === 'partnership' ? form.dataset.partnershipsEmail || form.dataset.contactEmail : form.dataset.contactEmail;
    if (emailLink && destination) {
      emailLink.href = `mailto:${destination}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      emailLink.hidden = false;
    }
    const download = form.querySelector<HTMLAnchorElement>('[data-inquiry-download]');
    if (download) {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(new Blob([message], { type: 'text/plain;charset=utf-8' }));
      download.href = objectUrl;
    }
    result?.scrollIntoView({ behavior: document.documentElement.classList.contains('motion-paused') || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
  });
  form.querySelector('[data-inquiry-copy]')?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(message); if (status) status.textContent = 'Inquiry copied. Nothing has been sent.'; }
    catch { if (status) status.textContent = 'Copy is unavailable in this browser. You can select the text above or save a copy.'; }
  });
  form.querySelector('[data-inquiry-edit]')?.addEventListener('click', () => {
    if (result) result.hidden = true;
    form.querySelector<HTMLTextAreaElement>('textarea')?.focus();
  });
  window.addEventListener('pagehide', () => { if (objectUrl) URL.revokeObjectURL(objectUrl); });
}

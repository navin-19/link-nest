/**
 * Generates and triggers download of a .vcf (vCard 3.0) file for saving contacts to iOS/Android.
 */
export function downloadVCard({
  name = '',
  title = '',
  company = '',
  email = '',
  phone = '',
  url = '',
  note = '',
}) {
  const vCardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name.trim() || 'LinkNest User'}`,
    name.trim() ? `N:${name.trim()};;;;` : 'N:User;;;;',
  ];

  if (company.trim()) vCardLines.push(`ORG:${company.trim()}`);
  if (title.trim()) vCardLines.push(`TITLE:${title.trim()}`);
  if (phone.trim()) vCardLines.push(`TEL;TYPE=CELL,VOICE:${phone.trim()}`);
  if (email.trim()) vCardLines.push(`EMAIL;TYPE=INTERNET,PREF:${email.trim()}`);
  if (url.trim()) vCardLines.push(`URL:${url.trim()}`);
  if (note.trim()) vCardLines.push(`NOTE:${note.trim()}`);

  vCardLines.push('END:VCARD');

  const vCardString = vCardLines.join('\r\n');
  const blob = new Blob([vCardString], { type: 'text/vcard;charset=utf-8;' });
  const downloadUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute(
    'download',
    `${(name || 'contact').toLowerCase().replace(/[^a-z0-9]/g, '_')}.vcf`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}

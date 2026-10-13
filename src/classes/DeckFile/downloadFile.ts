/** Triggers a browser download of `content`. Client-side only (call from an event handler). */
export const downloadFile = (
  fileName: string,
  content: string,
  mimeType: string,
): void => {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoke on the next tick so the browser has started the download first.
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

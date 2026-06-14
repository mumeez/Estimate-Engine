/* ════════════════════════════════════════════════════════════════
   Tauri Bridge — Native file operations for desktop app
   Falls back to browser APIs when running outside Tauri
   ════════════════════════════════════════════════════════════════ */

const isTauri = () => typeof window !== 'undefined' && window.__TAURI__;

// ── File Dialogs ──

async function tauriSaveFile(defaultName, contents, mimeType) {
  if (isTauri()) {
    const { save } = await import('@tauri-apps/plugin-dialog');
    const { writeTextFile } = await import('@tauri-apps/plugin-fs');
    const path = await save({
      defaultPath: defaultName,
      filters: [{ name: 'Documents', extensions: [mimeType === 'application/json' ? 'json' : 'md'] }],
    });
    if (path) {
      await writeTextFile(path, contents);
      return path;
    }
    return null;
  }
  // Browser fallback — download via Blob URL
  const blob = new Blob([contents], { type: mimeType + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = defaultName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return defaultName;
}

async function tauriOpenFile() {
  if (isTauri()) {
    const { open } = await import('@tauri-apps/plugin-dialog');
    const { readTextFile } = await import('@tauri-apps/plugin-fs');
    const path = await open({
      multiple: false,
      filters: [{ name: 'JSON Backup', extensions: ['json'] }],
    });
    if (path) {
      const contents = await readTextFile(path);
      return JSON.parse(contents);
    }
    return null;
  }
  return null; // Browser uses <input> directly
}

async function tauriOpenAttachments() {
  if (isTauri()) {
    const { open } = await import('@tauri-apps/plugin-dialog');
    const { readFile } = await import('@tauri-apps/plugin-fs');
    const paths = await open({
      multiple: true,
      filters: [
        { name: 'Images & Documents', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf', 'doc', 'docx', 'txt', 'csv'] },
      ],
    });
    if (!paths) return [];
    const results = [];
    for (const path of paths) {
      const name = path.split('/').pop() || path.split('\\').pop();
      const data = await readFile(path);
      // Convert to base64 data URL
      const ext = name.split('.').pop()?.toLowerCase();
      const mimeMap = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' };
      const mime = mimeMap[ext] || 'application/octet-stream';
      const bytes = new Uint8Array(data);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const base64 = btoa(binary);
      results.push({
        id: Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6),
        name,
        type: mime,
        data: `data:${mime};base64,${base64}`,
        size: bytes.length,
      });
    }
    return results;
  }
  return null;
}

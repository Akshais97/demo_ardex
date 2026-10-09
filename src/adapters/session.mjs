export const SCHEMA_VERSION = 1;
export function isSession(value) {
  return Boolean(value && value.schemaVersion === SCHEMA_VERSION && typeof value.id === 'string' && value.id.length > 0 && ['workspace', 'readiness', 'scope'].includes(value.view) && ['applicator', 'homeowner', 'admin'].includes(value.role));
}
export function newSession(id) { return { schemaVersion: SCHEMA_VERSION, id, view: 'workspace', role: 'applicator' }; }
export async function openSessionStore(factory = globalThis.indexedDB) {
  if (!factory) throw new Error('Local storage unavailable');
  const db = await new Promise((resolve, reject) => {
    const request = factory.open('ardex-pro-demo', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('sessions');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Close other demo tabs to upgrade storage'));
  });
  const transact = (mode, action) => new Promise((resolve, reject) => {
    const tx = db.transaction('sessions', mode); const request = action(tx.objectStore('sessions'));
    tx.oncomplete = () => resolve(request.result); tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error || new Error('Storage write aborted'));
  });
  return { read: () => transact('readonly', store => store.get('active')), write: value => transact('readwrite', store => store.put(value, 'active')), close: () => db.close() };
}

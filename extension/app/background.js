// GlobalSync World Clock: service worker. Adds the right-click item and seeds default settings.
if (typeof TL === 'undefined') importScripts('core.js');   // Firefox loads core.js via manifest "scripts"

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({ id: 'gs-world-clock', title: 'Convert “%s” with World Clock', contexts: ['selection'] });
  });
  const cur = await chrome.storage.sync.get(null);
  if (!cur.cities) await chrome.storage.sync.set(TL.defaults());
  if (reason === 'install') chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'gs-world-clock' || !tab?.id) return;
  // Pages where extensions can't run (the Web Store, chrome:// pages) simply ignore the message.
  chrome.tabs.sendMessage(tab.id, { type: 'lens', text: info.selectionText || '' }).catch(() => {});
});

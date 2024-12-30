chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.clear(() => {
      console.log("Storage limpo ao iniciar uma nova sessão.");
    });
  });
  
  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.clear(() => {
      console.log("Storage limpo ao instalar ou atualizar a extensão.");
    });
  });
  
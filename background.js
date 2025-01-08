chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.clear(() => {
      console.log("Storage limpo ao iniciar uma nova sessão.");
    });
  });
  console.log("Minha extensão foi atualizada para versão 1.1!");
  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.clear(() => {
      console.log("Storage limpo ao instalar ou atualizar a extensão.");
    });
  });
  
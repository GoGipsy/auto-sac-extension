chrome.storage.local.get("accessToken", function(result) {
    if (result.accessToken) {
      window.location.href = "popup.html";
    }
  });
  
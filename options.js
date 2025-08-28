const apiKeyInput = document.getElementById('apiKey');
const saveButton = document.getElementById('saveButton');
const statusDiv = document.getElementById('status');

// Save the key to chrome.storage.local
function saveOptions() {
  const apiKey = apiKeyInput.value;
  // Change the key name for clarity
  chrome.storage.local.set({ gemini_api_key: apiKey }, () => {
    statusDiv.textContent = 'API Key saved successfully!';
    setTimeout(() => {
      statusDiv.textContent = '';
    }, 2500);
  });
}

// Load any previously saved key
function restoreOptions() {
  // Change the key name for clarity
  chrome.storage.local.get('gemini_api_key', (data) => {
    if (data.gemini_api_key) {
      apiKeyInput.value = data.gemini_api_key;
    }
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
saveButton.addEventListener('click', saveOptions);
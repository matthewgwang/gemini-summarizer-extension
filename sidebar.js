// --- Get references to all our HTML elements ---
const summaryElement = document.getElementById('summary-text');
const chatHistory = document.getElementById('chat-history');
const questionInput = document.getElementById('question-input');
const chatForm = document.getElementById('chat-form');

// --- Helper function to add messages to the chat history ---
function addMessageToHistory(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message');
  messageDiv.classList.add(`${sender}-message`);
  messageDiv.textContent = text;
  chatHistory.appendChild(messageDiv);
  // Scroll to the bottom of the chat
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

// --- Listen for messages from the background script ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'DISPLAY_SUMMARY') {
    summaryElement.textContent = message.content;
  } else if (message.type === 'DISPLAY_ANSWER') {
    // Add the AI's answer to the chat history
    addMessageToHistory(message.answer, 'ai');
  }
});

// --- Handle form submission for asking a new question ---
chatForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevents the page from reloading
  const question = questionInput.value.trim();

  if (question) {
    // Add the user's question to the history immediately
    addMessageToHistory(question, 'user');
    
    // Send the question to the background script
    chrome.runtime.sendMessage({ type: 'ASK_QUESTION', question: question });
    
    // Clear the input box
    questionInput.value = '';
  }
});

// --- Kick off the initial summary process when the sidebar opens ---
(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['Readability.js', 'content.js'],
    });
  }
})();
// This listener runs once to set up the side panel.
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error('Failed to set side panel behavior:', error));
});

// --- THIS IS THE "MEMORY" OF THE EXTENSION ---
let currentArticleContent = '';
// --- NEW: A memory for the chat conversation history ---
let chatHistory = [];


// --- The summarization function ---
async function fetchSummary(content) {
  // When a new article is summarized, reset both memories.
  currentArticleContent = content;
  chatHistory = []; // Reset the chat history for the new article
  
  const data = await chrome.storage.local.get('gemini_api_key');
  const apiKey = data.gemini_api_key;
  if (!apiKey) return "Google AI API Key not found...";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`;

  // ... (The rest of the fetchSummary function is the same)
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `Summarize this article:\n\n${content}` }] }] })
    });
    if (!response.ok) throw new Error(`API Error: ${(await response.json()).error.message}`);
    const result = await response.json();
    return result.candidates[0].content.parts[0].text;
  } catch (error) {
    return `Could not generate summary. Error: ${error.message}`;
  }
}

// --- MODIFIED FUNCTION for Answering Questions with Memory ---
async function fetchAnswer(question) {
  if (!currentArticleContent) return "I don't have an article to reference.";

  const data = await chrome.storage.local.get('gemini_api_key');
  const apiKey = data.gemini_api_key;
  if (!apiKey) return "Google AI API Key not found...";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`;

  // *** THE IMPORTANT PART: We build a prompt with the chat history ***
  const prompt = `You are a helpful AI assistant. A user has provided you with an article and is asking questions about it. 
  Your memory of the conversation is provided below.
  Based ONLY on the article context and the conversation history, answer the user's NEW question.

  ARTICLE CONTEXT:
  ---
  ${currentArticleContent}
  ---
  
  CONVERSATION HISTORY:
  ${chatHistory.map(turn => `${turn.role}: ${turn.parts[0].text}`).join('\n')}
  ---

  NEW QUESTION:
  ${question}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    if (!response.ok) throw new Error(`API Error: ${(await response.json()).error.message}`);
    const result = await response.json();
    const answer = result.candidates[0].content.parts[0].text;
    
    // --- UPDATE MEMORY ---
    // Add both the user's question and the AI's answer to the history
    chatHistory.push({ role: 'user', parts: [{ text: question }] });
    chatHistory.push({ role: 'model', parts: [{ text: answer }] });

    return answer; // Send just the answer back to the UI

  } catch (error) {
    return `Could not get an answer. Error: ${error.message}`;
  }
}

// --- The Message Listener (no changes needed here) ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    if (message.type === 'ARTICLE_CONTENT') {
      const summary = await fetchSummary(message.content);
      chrome.runtime.sendMessage({ type: 'DISPLAY_SUMMARY', content: summary });
    } else if (message.type === 'ASK_QUESTION') {
      const answer = await fetchAnswer(message.question);
      chrome.runtime.sendMessage({ type: 'DISPLAY_ANSWER', answer: answer });
    }
  })();
  return true;
});

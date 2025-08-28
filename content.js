// --- NEW ---
console.log("content.js has been injected and is now running on the page.");

// We check if the Readability library is available
if (typeof Readability !== 'undefined') {
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse();
  
  // --- NEW ---
  console.log("Readability.js has parsed the article. The result is:", article);

  // Send the extracted text to the background script
  if (article && article.textContent) {
    // --- NEW ---
    console.log("Article text found. Sending it to the background script.");
    chrome.runtime.sendMessage({
      type: 'ARTICLE_CONTENT',
      content: article.textContent
    });
  } else {
    // --- NEW ---
    console.error("Readability could not find any content to send.");
  }
} else {
  // --- NEW ---
  console.error("Readability library is not available.");
}
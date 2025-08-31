console.log("content.js has been injected and is now running on the page.");

if (typeof Readability !== 'undefined') {
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse();
  
  console.log("Readability.js has parsed the article. The result is:", article);

  if (article && article.textContent) {
    console.log("Article text found. Sending it to the background script.");
    chrome.runtime.sendMessage({
      type: 'ARTICLE_CONTENT',
      content: article.textContent
    });
  } else {
    console.error("Readability could not find any content to send.");
  }
} else {
  console.error("Readability library is not available.");

}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'STORE_REVIEW_DATA') {
    chrome.storage.local.set({ 
      pendingReviewText: message.reviewText
    }, () => {
      console.log('Review data stored for auto-fill');
      sendResponse({ success: true });
    });
    return true; // Keep channel open for async response
  }
});

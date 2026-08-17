window.addEventListener('message', (event) => {
  // Only accept messages from the same window
  if (event.source !== window) return;

  if (event.data && event.data.type === 'REVIEW_GENERATOR_DATA_TO_EXT') {
    chrome.runtime.sendMessage({
      type: 'STORE_REVIEW_DATA',
      reviewText: event.data.reviewText
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Extension error:', chrome.runtime.lastError);
      } else {
        console.log('Review data stored successfully');
      }
    });
  }
});

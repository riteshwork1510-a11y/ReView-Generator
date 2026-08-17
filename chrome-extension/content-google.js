let autoFillAttempted = false;

function attemptAutoFill() {
  if (autoFillAttempted) return;

  chrome.storage.local.get(['pendingReviewText'], (result) => {
    if (!result.pendingReviewText) return; // Nothing to fill

    // Look for the textarea
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    // Look for the 5th star
    // Google's DOM varies, but it often uses data-rating="5" or aria-label="5 stars"
    const fiveStarElements = [
      ...document.querySelectorAll('div[data-rating="5"]'),
      ...document.querySelectorAll('div[aria-label="5 stars"]'),
      ...document.querySelectorAll('div[aria-label="Rate 5 stars"]')
    ];
    
    const star = fiveStarElements[0];

    if (textarea && star) {
      // Click the 5th star
      star.click();

      // Fill the textarea
      textarea.value = result.pendingReviewText;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));

      console.log('Successfully auto-filled 5 stars and review text');
      
      // Mark as attempted and clear storage
      autoFillAttempted = true;
      chrome.storage.local.remove('pendingReviewText');
      observer.disconnect();
    }
  });
}

// Observe the DOM because the Google Review popup is often loaded dynamically or in an iframe
const observer = new MutationObserver(() => {
  attemptAutoFill();
});

// Start observing
if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
  attemptAutoFill();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
    attemptAutoFill();
  });
}

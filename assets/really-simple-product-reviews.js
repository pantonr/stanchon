 const accordionTrigger = document.getElementById('shopify-review-accordion-trigger');
    const accordionContent = document.getElementById('shopify-review-accordion-content');
    const accordionIcon = document.getElementById('shopify-review-accordion-icon');
    const stars = document.querySelectorAll('.shopify-review-star');
    const ratingMessage = document.getElementById('shopify-review-rating-message');
    const reviewerName = document.getElementById('shopify-reviewer-name');
    const reviewTextarea = document.getElementById('shopify-review-textarea');
    const submitBtn = document.getElementById('shopify-review-submit-btn');
    const successMsg = document.getElementById('shopify-review-success');

    let selectedRating = 0;

    accordionTrigger.addEventListener('click', () => {
      accordionContent.classList.toggle('active');
      accordionIcon.classList.toggle('rotated');
    });

    stars.forEach((star, index) => {
      star.addEventListener('mouseover', () => highlightStars(index + 1, 'hover'));
      star.addEventListener('mouseout', () => removeHighlight('hover'));
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.getAttribute('data-value'));
        ratingMessage.textContent = star.getAttribute('data-message');
        highlightStars(selectedRating, 'selected');
        checkFormValidity();
      });
    });

    function highlightStars(rating, className) {
      stars.forEach((star, i) => {
        star.classList.toggle(className, i < rating);
      });
    }

    function removeHighlight(className) {
      stars.forEach(star => star.classList.remove(className));
    }

    function checkFormValidity() {
      const nameFilled = reviewerName.value.trim().length > 0;
      const commentFilled = reviewTextarea.value.trim().length > 0;
      const valid = nameFilled && commentFilled && selectedRating > 0;
      submitBtn.disabled = !valid;
    }

    reviewerName.addEventListener('input', checkFormValidity);
    reviewTextarea.addEventListener('input', checkFormValidity);

    submitBtn.addEventListener('click', () => {
      const data = {
        name: reviewerName.value.trim(),
        rating: selectedRating,
        message: ratingMessage.textContent,
        comment: reviewTextarea.value.trim(),
        timestamp: new Date().toISOString()
      };

      console.log('Review submitted:', data);

      successMsg.style.display = 'block';
      submitBtn.disabled = true;
    });




  document.addEventListener('DOMContentLoaded', function() {
  const ratingBreakdown = document.querySelector('.amazon-rating-breakdown');
  const popup = document.querySelector('.rating-popup');

  if (ratingBreakdown && popup) {
    // Add smooth hover effects
    ratingBreakdown.addEventListener('mouseenter', function() {
      // Optional: Add any additional functionality on hover
      console.log('Rating breakdown hovered');
    });

    ratingBreakdown.addEventListener('mouseleave', function() {
      // Optional: Add any cleanup on mouse leave
      console.log('Mouse left rating breakdown');
    });

    // Optional: Click to toggle popup on mobile
    ratingBreakdown.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        popup.classList.toggle('mobile-active');
      }
    });

    // Close popup when clicking outside on mobile
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768 && !ratingBreakdown.contains(e.target)) {
        popup.classList.remove('mobile-active');
      }
    });
  }

  // Optional: Dynamic content update
  function updatePopupContent(newContent) {
    const popupContent = document.querySelector('.rating-popup-content p');
    if (popupContent) {
      popupContent.textContent = newContent;
    }
  }

  // Optional: Position adjustment based on viewport
  function adjustPopupPosition() {
    if (ratingBreakdown && popup) {
      const rect = ratingBreakdown.getBoundingClientRect();
      const popupRect = popup.getBoundingClientRect();
      
      // Check if popup would go off-screen to the right
      if (rect.right + popupRect.width > window.innerWidth) {
        popup.style.left = 'auto';
        popup.style.right = '110%';
        // Flip arrow direction
        const arrow = popup.querySelector('.rating-popup-arrow');
        if (arrow) {
          arrow.style.left = 'auto';
          arrow.style.right = '-8px';
          arrow.style.borderLeft = '8px solid #333';
          arrow.style.borderRight = 'none';
        }
      }
    }
  }

  // Adjust position on window resize
  window.addEventListener('resize', adjustPopupPosition);
  
  // Initial position adjustment
  setTimeout(adjustPopupPosition, 100);
});





    (function () {
  const alreadyInserted = () =>
    document.querySelector('.rating-popup-content .amazon-rating-breakdown');

  const tryInsert = () => {
    const source = document.querySelector('.really-review-div-class2 .amazon-rating-breakdown');
    const target = document.querySelector('.rating-popup-content');

    if (source && target && !alreadyInserted()) {
      target.innerHTML = '';
      target.appendChild(source.cloneNode(true));
      console.log('✅ Rating breakdown inserted');
    }
  };

  const observer = new MutationObserver(tryInsert);
  observer.observe(document.body, { childList: true, subtree: true });

  // Try once immediately too
  tryInsert();
})();






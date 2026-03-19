 
// Add styles once at the start
const style = document.createElement('style');
style.textContent = `
    .mb__20.special-custom-text-input {
        display: flex;
    }
    .mb__20.special-custom-text-input label {
        width: 250px;
        font-size: 12px;
        display: flex;
        align-items: center;
        font-weight: bold;
    }
`;
document.head.appendChild(style);


document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        // First update the fields
        updateFields();
        
        // FORCE THE DEFAULT TEXT INTO THE INPUTS for both variants
        const selectedVariant = document.querySelector('.nt-swatch.is-selected');
        const isTwoLine = selectedVariant && selectedVariant.getAttribute('data-value') === 'two-line-text';
        
        if (isTwoLine) {
            const input1 = document.getElementById('custom-text-line1-_ppr');
            const input2 = document.getElementById('custom-text-line2-_ppr');
            if (input1) input1.value = 'Your Text Here';
            if (input2) input2.value = 'And Here Too!';
        } else {
            const input = document.getElementById('custom-text-_ppr');
            if (input) input.value = 'Your Text Here';
        }
        
        setupCustomFields();
        setupInputListeners();
        
        // Then show the placeholder preview
        showPlaceholderPreview(isTwoLine);
        
        // Re-setup listeners after fields are updated
        setupInputListeners();
    }, 100);
    
    // Also update the variant change listener to set values
    const swatchList = document.querySelector('.swatch__list_pr');
    if (swatchList) {
        swatchList.addEventListener('click', function(e) {
            if (e.target.closest('.nt-swatch')) {
                setTimeout(() => {
                    updateFields();
                    
                    // Set default values after variant change
                    const selectedVariant = document.querySelector('.nt-swatch.is-selected');
                    const isTwoLine = selectedVariant && selectedVariant.getAttribute('data-value') === 'two-line-text';
                    
                    if (isTwoLine) {
                        const input1 = document.getElementById('custom-text-line1-_ppr');
                        const input2 = document.getElementById('custom-text-line2-_ppr');
                        if (input1) input1.value = 'Your Text Here';
                        if (input2) input2.value = 'And Here Too!';
                    } else {
                        const input = document.getElementById('custom-text-_ppr');
                        if (input) input.value = 'Your Text Here';
                    }
                    
                    setupInputListeners();
                }, 100);
            }
        });
    }
});
function setupInputListeners() {
    const selectedVariant = document.querySelector('.nt-swatch.is-selected');
    const isTwoLine = selectedVariant && selectedVariant.getAttribute('data-value') === 'two-line-text';
    
    if (isTwoLine) {
        const input1 = document.getElementById('custom-text-line1-_ppr');
        const input2 = document.getElementById('custom-text-line2-_ppr');
        if (input1) {
            input1.addEventListener('input', function() {
                updatePreviewText(this.value || 'Your Text Here', 1);
            });
        }
        if (input2) {
            input2.addEventListener('input', function() {
                updatePreviewText(this.value || 'And Here Too!', 2);
            });
        }
    } else {
        const input = document.getElementById('custom-text-_ppr');
        if (input) {
            input.addEventListener('input', function() {
                updatePreviewText(this.value || 'Your Text Here');
            });
        }
    }
}

function updatePreviewText(text, lineNumber = null) {
    const selectedVariant = document.querySelector('.nt-swatch.is-selected');
    const isTwoLine = selectedVariant && selectedVariant.getAttribute('data-value') === 'two-line-text';
    
    if (isTwoLine) {
        const previewElement = document.querySelector(`.preview-text-line${lineNumber}`);
        if (previewElement) {
            previewElement.textContent = text;
        }
    } else {
        const previewElement = document.querySelector('.preview-text');
        if (previewElement) {
            previewElement.textContent = text;
        }
    }
}

function updateFields() {
    const selectedVariant = document.querySelector('.nt-swatch.is-selected');
    if (!selectedVariant) return;
    
    const isTwoLine = selectedVariant.getAttribute('data-value') === 'two-line-text';
    const container = document.querySelector('.custom-text-input');
    
    if (container) {
        if (isTwoLine) {
            container.innerHTML = `
                <div class="mb__20 special-custom-text-input">
                    <label for="custom-text-line1-_ppr" class="cd mb__5">Enter Your First Line</label>
                    <input type="text" id="custom-text-line1-_ppr" name="properties[Custom Text Line 1]" class="input-text w__100" required maxlength="30" placeholder="Your Text Here">
                </div>
                <div class="mb__20 special-custom-text-input">
                    <label for="custom-text-line2-_ppr" class="cd mb__5">Enter Your Second Line</label>
                    <input type="text" id="custom-text-line2-_ppr" name="properties[Custom Text Line 2]" class="input-text w__100" required maxlength="30" placeholder="And Here Too!">
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="mb__20 special-custom-text-input">
                    <label for="custom-text-_ppr" class="cd mb__5">Enter Your Custom Text</label>
                    <input type="text" id="custom-text-_ppr" name="properties[Custom Text]" class="input-text w__100" required maxlength="30" placeholder="Your Text Here">
                </div>
            `;
        }
    }
    
   
    
    updateOverlay(isTwoLine);
    showPlaceholderPreview(isTwoLine);
}

function updateOverlay(isTwoLine) {
    const firstImage = document.querySelector('.p-item:first-child');
    if (!firstImage) return;
    
    let existingOverlay = firstImage.querySelector('.custom-text-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'custom-text-overlay';
    
    if (isTwoLine) {
        overlay.innerHTML = '<div class="preview-text-line1"></div><div class="preview-text-line2"></div>';
    } else {
        overlay.innerHTML = '<div class="preview-text"></div>';
    }
    
    firstImage.appendChild(overlay);
}

function setupCustomFields() {
    const selectedVariant = document.querySelector('.nt-swatch.is-selected');
    if (selectedVariant) {
        const isTwoLine = selectedVariant.getAttribute('data-value') === 'two-line-text';
        updateOverlay(isTwoLine);
    }
}

function showPlaceholderPreview(isTwoLine) {
    if (isTwoLine) {
        updatePreviewText('Your Text Here', 1);
        updatePreviewText('And Here Too!', 2);
    } else {
        updatePreviewText('Your Text Here');
    }
}
// Global variables to track current configuration
let currentConfig = {
  paperWidth: 8.5,
  paperHeight: 11,
  orientation: 'portrait',
  panelWidth: 2,           // matches panw=2
  panelHeight: 1,          // matches panh=1
  columns: 4,              // matches col=4
  rows: 10,                // matches row=10
  gap: 0,                  // matches gap=0
  marginTop: 0.25,         // matches mt=0.25
  marginRight: 0,          // matches mr=0
  marginBottom: 0.25,      // matches mb=0.25
  marginLeft: 0,           // matches ml=0
  horizontalAlignment: 'center',  // matches halign=center (changed from 'left')
  verticalAlignment: 'top'        // no valign parameter, so stays 'top'
};

// URL Configuration Module
const URLConfig = {
  paramMap: {
    'pw': 'paperWidth',
    'ph': 'paperHeight',
    'or': 'orientation',
    'ps': 'paperSize',
    'panw': 'panelWidth',
    'panh': 'panelHeight',
    'col': 'columns',
    'row': 'rows',
    'gap': 'gap',
    'preset': 'preset',
    'mt': 'marginTop',
    'mr': 'marginRight', 
    'mb': 'marginBottom',
    'ml': 'marginLeft',
    'pt': 'paddingTop',
    'pr': 'paddingRight',
    'pb': 'paddingBottom', 
    'pl': 'paddingLeft',
    'halign': 'horizontalAlignment',
    'valign': 'verticalAlignment',
    'borders': 'printBorders'
  },

  readFromURL: function() {
    const params = new URLSearchParams(window.location.search);
    const settings = {};
    
    for (const [shortName, fullName] of Object.entries(this.paramMap)) {
      if (params.has(shortName)) {
        let value = params.get(shortName);
        
        // Convert string values back to proper types
        if (['paperWidth', 'paperHeight', 'panelWidth', 'panelHeight', 'gap', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft'].includes(fullName)) {
          value = parseFloat(value);
        } else if (['columns', 'rows', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].includes(fullName)) {
          value = parseInt(value);
        }
        
        settings[fullName] = value;
      }
    }
    
    return settings;
  },

  applyToForm: function(settings) {
    const elementMap = {
      'paperWidth': 'paper-width',
      'paperHeight': 'paper-height',
      'orientation': 'paper-orientation',
      'paperSize': 'paper-size',
      'panelWidth': 'panel-width',
      'panelHeight': 'panel-height',
      'columns': 'columns',
      'rows': 'rows',
      'gap': 'gap',
      'preset': 'panel-preset',
      'marginTop': 'margin-top',
      'marginRight': 'margin-right',
      'marginBottom': 'margin-bottom',
      'marginLeft': 'margin-left',
      'paddingTop': 'padding-top',
      'paddingRight': 'padding-right',
      'paddingBottom': 'padding-bottom',
      'paddingLeft': 'padding-left',
      'horizontalAlignment': 'horizontal-alignment',
      'verticalAlignment': 'vertical-alignment',
      'printBorders': 'print-borders'
    };
    
    for (const [setting, value] of Object.entries(settings)) {
      const elementId = elementMap[setting];
      if (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
          element.value = value;
        }
      }
    }
  }
};

// Preset configurations
const presets = {
  'address': {
    panelWidth: 2.625,
    panelHeight: 1,
    columns: 3,
    rows: 10,
    gap: 0.125
  },
  'shipping': {
    panelWidth: 4,
    panelHeight: 3.33,
    columns: 2,
    rows: 3,
    gap: 0
  },
  'name-badge': {
    panelWidth: 4,
    panelHeight: 2,
    columns: 2,
    rows: 5,
    gap: 0
  }
};

// Event Listeners Setup
function setupEventListeners() {
  // Paper size changes
  document.getElementById('paper-size').addEventListener('change', function() {
    const customPaperSize = document.getElementById('custom-paper-size');
    if (this.value === 'custom') {
      customPaperSize.classList.remove('hidden');
    } else {
      customPaperSize.classList.add('hidden');
      
      const paperSizes = {
        'letter': { width: 8.5, height: 11 },
        'legal': { width: 8.5, height: 14 },
        'a4': { width: 8.27, height: 11.69 }
      };
      
      if (paperSizes[this.value]) {
        document.getElementById('paper-width').value = paperSizes[this.value].width;
        document.getElementById('paper-height').value = paperSizes[this.value].height;
      }
    }
    applyLayout();
  });

  // Orientation changes
  document.getElementById('paper-orientation').addEventListener('change', function() {
    const isLandscape = this.value === 'landscape';
    const width = parseFloat(document.getElementById('paper-width').value);
    const height = parseFloat(document.getElementById('paper-height').value);
    
    if ((isLandscape && width < height) || (!isLandscape && width > height)) {
      document.getElementById('paper-width').value = height;
      document.getElementById('paper-height').value = width;
    }
    applyLayout();
  });

  // Panel preset changes
  document.getElementById('panel-preset').addEventListener('change', function() {
    const preset = this.value;
    const customConfig = document.getElementById('custom-panel-config');
    
    if (preset === 'custom') {
      customConfig.classList.remove('hidden');
    } else {
      customConfig.classList.add('hidden');
      
      if (presets[preset]) {
        document.getElementById('panel-width').value = presets[preset].panelWidth;
        document.getElementById('panel-height').value = presets[preset].panelHeight;
        document.getElementById('columns').value = presets[preset].columns;
        document.getElementById('rows').value = presets[preset].rows;
        document.getElementById('gap').value = presets[preset].gap;
      }
    }
    applyLayout();
  });

  // Auto-apply for all relevant inputs
  const autoApplyInputs = [
    'paper-width', 'paper-height', 'panel-width', 'panel-height',
    'columns', 'rows', 'gap', 'margin-top', 'margin-right',
    'margin-bottom', 'margin-left', 'print-borders'
  ];

  autoApplyInputs.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', applyLayout);
      if (element.tagName === 'SELECT') {
        element.addEventListener('change', applyLayout);
      }
    }
  });

  // Alignment changes (if elements exist)
  const horizontalAlign = document.getElementById('horizontal-alignment');
  const verticalAlign = document.getElementById('vertical-alignment');
  
  if (horizontalAlign) {
    horizontalAlign.addEventListener('change', applyLayout);
  }
  if (verticalAlign) {
    verticalAlign.addEventListener('change', applyLayout);
  }

  // Padding auto-apply
  const paddingInputs = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'];
  paddingInputs.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', applyPaddingInstantly);
    }
  });

  // Line height changes
  document.getElementById('line-height-select').addEventListener('change', function() {
    const customLineHeight = document.getElementById('custom-line-height');
    let lineHeight;
    
    if (this.value === 'custom') {
      customLineHeight.classList.remove('hidden');
      lineHeight = document.getElementById('custom-line-height-value').value;
    } else {
      customLineHeight.classList.add('hidden');
      lineHeight = this.value;
    }
    
    applyLineHeight(lineHeight);
  });

  document.getElementById('custom-line-height-value').addEventListener('input', function() {
    applyLineHeight(this.value);
  });

  // Button event listeners
  document.getElementById('printBtn').addEventListener('click', handlePrint);
  document.getElementById('downloadPdfBtn').addEventListener('click', handlePdfDownload);
  document.getElementById('shareBtn').addEventListener('click', handleShare);
  document.getElementById('copyBtn').addEventListener('click', handleCopyPanel);

  // Modal handlers
  document.querySelector('.modal-close').addEventListener('click', () => {
    document.getElementById('shareModal').classList.remove('show');
  });

  document.getElementById('shareModal').addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('show');
    }
  });

  document.getElementById('copyUrlBtn').addEventListener('click', handleCopyUrl);

  // ESC key to close modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.getElementById('shareModal').classList.remove('show');
    }
  });

  // Double-click auto-calculate
  document.getElementById('columns').addEventListener('dblclick', function() {
    const optimalGrid = calculateOptimalGrid();
    this.value = optimalGrid.columns;
    applyLayout();
  });

  document.getElementById('rows').addEventListener('dblclick', function() {
    const optimalGrid = calculateOptimalGrid();
    this.value = optimalGrid.rows;
    applyLayout();
  });
}

// Calculate optimal grid
function calculateOptimalGrid() {
  const paperWidth = parseFloat(document.getElementById('paper-width').value);
  const paperHeight = parseFloat(document.getElementById('paper-height').value);
  const panelWidth = parseFloat(document.getElementById('panel-width').value);
  const panelHeight = parseFloat(document.getElementById('panel-height').value);
  const gap = parseFloat(document.getElementById('gap').value);
  const marginLeft = parseFloat(document.getElementById('margin-left').value);
  const marginRight = parseFloat(document.getElementById('margin-right').value);
  const marginTop = parseFloat(document.getElementById('margin-top').value);
  const marginBottom = parseFloat(document.getElementById('margin-bottom').value);
  
  const availableWidth = paperWidth - marginLeft - marginRight;
  const availableHeight = paperHeight - marginTop - marginBottom;
  
  const maxColumns = Math.floor((availableWidth + gap) / (panelWidth + gap));
  const maxRows = Math.floor((availableHeight + gap) / (panelHeight + gap));
  
  return { columns: maxColumns, rows: maxRows };
}

// Main layout application function
function applyLayout() {
  const page = document.getElementById('page');
  page.innerHTML = '';
  
  // Get current form values
  const formWidth = parseFloat(document.getElementById('paper-width').value);
  const formHeight = parseFloat(document.getElementById('paper-height').value);
  const formColumns = parseInt(document.getElementById('columns').value);
  const formRows = parseInt(document.getElementById('rows').value);
  const formPanelWidth = parseFloat(document.getElementById('panel-width').value);
  const formPanelHeight = parseFloat(document.getElementById('panel-height').value);
  const formMarginTop = parseFloat(document.getElementById('margin-top').value);
  const formMarginRight = parseFloat(document.getElementById('margin-right').value);
  const formMarginBottom = parseFloat(document.getElementById('margin-bottom').value);
  const formMarginLeft = parseFloat(document.getElementById('margin-left').value);
  const formGap = parseFloat(document.getElementById('gap').value);

  // Set page dimensions
  page.style.width = formWidth + 'in';
  page.style.height = formHeight + 'in';

  // Get alignment settings
  let horizontalAlignment = 'left';
  let verticalAlignment = 'top';

  const horizontalAlignmentEl = document.getElementById('horizontal-alignment');
  const verticalAlignmentEl = document.getElementById('vertical-alignment');

  if (horizontalAlignmentEl) {
    horizontalAlignment = horizontalAlignmentEl.value;
  }
  if (verticalAlignmentEl) {
    verticalAlignment = verticalAlignmentEl.value;
  }

  // Apply vertical alignment to page
  if (verticalAlignment === 'middle') {
    page.style.display = 'flex';
    page.style.flexDirection = 'column';
    page.style.justifyContent = 'center';
    page.style.minHeight = `${formHeight}in`;
    page.style.padding = `0 ${formMarginRight}in 0 ${formMarginLeft}in`;
  } else if (verticalAlignment === 'bottom') {
    page.style.display = 'flex';
    page.style.flexDirection = 'column';
    page.style.justifyContent = 'flex-end';
    page.style.minHeight = `${formHeight}in`;
    page.style.padding = `0 ${formMarginRight}in ${formMarginBottom}in ${formMarginLeft}in`;
  } else { // top alignment
    page.style.display = 'block';
    page.style.padding = `${formMarginTop}in ${formMarginRight}in ${formMarginBottom}in ${formMarginLeft}in`;
  }

  // Create grid container
  const grid = document.createElement('div');
  grid.className = 'panel-grid';
  grid.style.display = 'grid';
  grid.style.gap = formGap + 'in';
  grid.style.gridTemplateRows = `repeat(${formRows}, ${formPanelHeight}in)`;
  grid.style.height = 'auto';
  grid.style.flexShrink = '0';

  // Apply horizontal alignment
  if (horizontalAlignment === 'center') {
    grid.style.gridTemplateColumns = `repeat(${formColumns}, ${formPanelWidth}in)`;
    grid.style.width = 'fit-content';
    grid.style.marginLeft = 'auto';
    grid.style.marginRight = 'auto';
  } else if (horizontalAlignment === 'stretch') {
    grid.style.gridTemplateColumns = `repeat(${formColumns}, 1fr)`;
    grid.style.width = '100%';
  } else { // left alignment
    grid.style.gridTemplateColumns = `repeat(${formColumns}, ${formPanelWidth}in)`;
    grid.style.width = 'fit-content';
    grid.style.marginLeft = '0';
    grid.style.marginRight = '0';
  }

  page.appendChild(grid);

  // Get border setting for print
  let printBorders = 'none';
  const printBordersEl = document.getElementById('print-borders');
  if (printBordersEl) {
    printBorders = printBordersEl.value;
  }

  // Create panels
  const totalPanels = formColumns * formRows;
  for (let i = 0; i < totalPanels; i++) {
    const panel = document.createElement('div');
    panel.className = 'panel';
    
    if (horizontalAlignment !== 'stretch') {
      panel.style.width = formPanelWidth + 'in';
    }
    
    panel.style.height = formPanelHeight + 'in';
    panel.style.boxSizing = 'border-box';
    panel.setAttribute('data-print-border', printBorders);
    
    const editor = document.createElement('div');
    editor.className = 'editor';
    editor.innerHTML = `Panel ${i+1} Content`;
    panel.appendChild(editor);
    
    grid.appendChild(panel);
  }
  
  // Initialize TinyMCE
  initializeTinyMCE();
  
  // Apply padding
  applyPaddingInstantly();
}

// Initialize TinyMCE
function initializeTinyMCE() {
  tinymce.remove();
  tinymce.init({
    selector: '.editor',
    inline: true,
    menubar: false,
    fixed_toolbar_container: '#new-format',
    plugins: 'lists link',
    toolbar: [
      'fontfamily fontsize blocks | bold italic underline strikethrough',
      'align | bullist numlist | removeformat'
    ].join(' | '),
    contextmenu: false,
    
    font_family_formats: 'Arial=arial,helvetica,sans-serif;' +
                        'Courier New=courier new,courier,monospace;' +
                        'Georgia=georgia,palatino;' +
                        'Tahoma=tahoma,arial,helvetica,sans-serif;' +
                        'Times New Roman=times new roman,times;' +
                        'Verdana=verdana,geneva;' +
                        'Impact=impact;' +
                        'Comic Sans MS=comic sans ms,sans-serif',
    
    font_size_formats: '8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 32pt 36pt 42pt 48pt 56pt 72pt',
    content_style: 'body { line-height: 1.5; font-family: Arial, sans-serif; }',
    
    setup: function(editor) {
      editor.on('init', function() {
        if (!editor.getElement().id) {
          editor.getElement().id = 'editor-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }
        
        editor.getBody().style.width = '100%';
        editor.getBody().style.height = '100%';
      });
    }
  });
}

// Apply padding instantly
function applyPaddingInstantly() {
  const paddingTop = document.getElementById('padding-top').value;
  const paddingRight = document.getElementById('padding-right').value;
  const paddingBottom = document.getElementById('padding-bottom').value;
  const paddingLeft = document.getElementById('padding-left').value;
  
  const editors = document.querySelectorAll('.editor');
  editors.forEach(editor => {
    editor.style.padding = `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`;
  });
}

// Apply line height
function applyLineHeight(lineHeight) {
  if (tinymce && tinymce.editors) {
    tinymce.editors.forEach(function(editor) {
      if (editor && editor.getBody) {
        editor.dom.setStyle(editor.getBody(), 'line-height', lineHeight);
      }
    });
  }
}

// Button handlers
function handlePrint() {
  const formWidth = parseFloat(document.getElementById('paper-width').value);
  const formHeight = parseFloat(document.getElementById('paper-height').value);
  const formOrientation = document.getElementById('paper-orientation').value;
  const formMarginTop = parseFloat(document.getElementById('margin-top').value);
  const formMarginRight = parseFloat(document.getElementById('margin-right').value);
  const formMarginBottom = parseFloat(document.getElementById('margin-bottom').value);
  const formMarginLeft = parseFloat(document.getElementById('margin-left').value);

  const printBordersEl = document.getElementById('print-borders');
  const printBorders = printBordersEl ? printBordersEl.value : 'none';

  let borderStyle = 'none';
  if (printBorders === 'solid') {
    borderStyle = '1px solid black';
  } else if (printBorders === 'dotted') {
    borderStyle = '2px dotted #c2c2c2';
  }

  const style = document.createElement('style');
  style.innerHTML = `
    @page {
      size: ${formOrientation === 'portrait' ? 
             `${formWidth}in ${formHeight}in` : 
             `${formHeight}in ${formWidth}in`};
      margin: 0;
    }
    @media print {
      .sidebar, .page-header, #new-format, header, footer {
        display: none !important;
      }
      .panel {
        border: ${borderStyle} !important;
      }
      #page {
        padding: ${formMarginTop}in ${formMarginRight}in ${formMarginBottom}in ${formMarginLeft}in !important;
      }
    }
  `;
  
  document.head.appendChild(style);
  window.print();
  
  setTimeout(() => {
    document.head.removeChild(style);
  }, 1000);
}

function handlePdfDownload() {
  const originalButtonText = this.textContent;
  this.textContent = "Opening Print Dialog...";
  this.disabled = true;
  
  // Implementation for PDF download (similar to original)
  handlePrint(); // For now, use the same print function
  
  setTimeout(() => {
    this.textContent = originalButtonText;
    this.disabled = false;
  }, 1000);
}

function handleShare() {
  const shareableUrl = generateShareableUrl();
  const modal = document.getElementById('shareModal');
  const urlInput = document.getElementById('shareUrl');
  
  urlInput.value = shareableUrl;
  modal.classList.add('show');
  
  setTimeout(() => {
    urlInput.select();
  }, 100);
}

function handleCopyPanel() {
  const panels = document.querySelectorAll('.panel');
  
  if (panels.length === 0) {
    alert('No panels found to copy');
    return;
  }
  
  const firstPanel = panels[0];
  const firstEditor = firstPanel.querySelector('.editor');
  
  if (!firstEditor) {
    alert('No content found in first panel');
    return;
  }
  
  let contentToCopy;
  const firstEditorId = firstEditor.id;
  
  if (firstEditorId && tinymce.get(firstEditorId)) {
    contentToCopy = tinymce.get(firstEditorId).getContent();
  } else {
    contentToCopy = firstEditor.innerHTML;
  }
  
  for (let i = 1; i < panels.length; i++) {
    const panel = panels[i];
    const editor = panel.querySelector('.editor');
    
    if (editor) {
      const editorId = editor.id;
      
      if (editorId && tinymce.get(editorId)) {
        tinymce.get(editorId).setContent(contentToCopy);
      } else {
        editor.innerHTML = contentToCopy;
      }
    }
  }
}

function handleCopyUrl() {
  const urlInput = document.getElementById('shareUrl');
  const feedback = document.getElementById('copyFeedback');
  
  urlInput.select();
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(urlInput.value).then(() => {
      showCopyFeedback(feedback);
    });
  } else {
    try {
      document.execCommand('copy');
      showCopyFeedback(feedback);
    } catch (err) {
      console.log('Copy failed');
    }
  }
}

function showCopyFeedback(feedback) {
  feedback.classList.add('show');
  setTimeout(() => {
    feedback.classList.remove('show');
  }, 2000);
}

// Generate shareable URL
function generateShareableUrl() {
  let baseUrl = window.location.href.split('?')[0];
  
  if (baseUrl.includes('codepen.io') || baseUrl.includes('cdpn.io')) {
    const urlParts = baseUrl.split('/');
    let username = 'pantonr';
    let penId = 'OPVqYzN';
    
    for (let i = 0; i < urlParts.length; i++) {
      if (urlParts[i] === 'pen' && urlParts[i + 1]) {
        penId = urlParts[i + 1];
        if (urlParts[i - 1]) {
          username = urlParts[i - 1];
        }
        break;
      }
    }
    
    baseUrl = `https://codepen.io/${username}/pen/${penId}`;
  }
  
  const params = [];
  
  // Always include key panel settings
  params.push(`panw=${encodeURIComponent(document.getElementById('panel-width').value)}`);
  params.push(`panh=${encodeURIComponent(document.getElementById('panel-height').value)}`);
  params.push(`col=${encodeURIComponent(document.getElementById('columns').value)}`);
  params.push(`row=${encodeURIComponent(document.getElementById('rows').value)}`);
  params.push(`gap=${encodeURIComponent(document.getElementById('gap').value)}`);
  
  // Add other settings only if they differ from defaults
  const paperSize = document.getElementById('paper-size').value;
  if (paperSize !== 'letter') {
    params.push(`ps=${encodeURIComponent(paperSize)}`);
  }
  
  if (paperSize === 'custom') {
    params.push(`pw=${encodeURIComponent(document.getElementById('paper-width').value)}`);
    params.push(`ph=${encodeURIComponent(document.getElementById('paper-height').value)}`);
  }
  
  const orientation = document.getElementById('paper-orientation').value;
  if (orientation !== 'portrait') {
    params.push(`or=${encodeURIComponent(orientation)}`);
  }
  
  // Add margins if different from defaults
  const margins = {
    mt: document.getElementById('margin-top').value,
    mr: document.getElementById('margin-right').value,
    mb: document.getElementById('margin-bottom').value,
    ml: document.getElementById('margin-left').value
  };
  
  for (const [key, value] of Object.entries(margins)) {
    if (value !== '0.5') {
      params.push(`${key}=${encodeURIComponent(value)}`);
    }
  }
  
  // Add alignment if not default
  const horizontalAlignmentEl = document.getElementById('horizontal-alignment');
  const verticalAlignmentEl = document.getElementById('vertical-alignment');

  if (horizontalAlignmentEl && horizontalAlignmentEl.value !== 'left') {
    params.push(`halign=${encodeURIComponent(horizontalAlignmentEl.value)}`);
  }

  if (verticalAlignmentEl && verticalAlignmentEl.value !== 'top') {
    params.push(`valign=${encodeURIComponent(verticalAlignmentEl.value)}`);
  }
  
  return `${baseUrl}?${params.join('&')}`;
}

// Function to apply currentConfig to form inputs
function applyConfigToForm() {
  const configToElementMap = {
    paperWidth: 'paper-width',
    paperHeight: 'paper-height',
    orientation: 'paper-orientation',
    panelWidth: 'panel-width',
    panelHeight: 'panel-height',
    columns: 'columns',
    rows: 'rows',
    gap: 'gap',
    marginTop: 'margin-top',
    marginRight: 'margin-right',
    marginBottom: 'margin-bottom',
    marginLeft: 'margin-left',
    horizontalAlignment: 'horizontal-alignment',
    verticalAlignment: 'vertical-alignment'
  };

  for (const [configKey, elementId] of Object.entries(configToElementMap)) {
    const element = document.getElementById(elementId);
    if (element && currentConfig[configKey] !== undefined) {
      element.value = currentConfig[configKey];
    }
  }

  // Set padding defaults
  document.getElementById('padding-top').value = 10;
  document.getElementById('padding-right').value = 10;
  document.getElementById('padding-bottom').value = 10;
  document.getElementById('padding-left').value = 10;
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Setup event listeners
  setupEventListeners();
  
  // Check for URL parameters first
  const urlSettings = URLConfig.readFromURL();
  if (Object.keys(urlSettings).length > 0) {
    // If we have URL settings, apply them
    URLConfig.applyToForm(urlSettings);
    setTimeout(() => {
      applyLayout();
    }, 200);
  } else {
    // If no URL settings, apply the currentConfig defaults
    applyConfigToForm();
    setTimeout(() => {
      applyLayout();
    }, 100);
  }
});
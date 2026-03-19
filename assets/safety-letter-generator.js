/**
 * Safety Letter Generator - Production Build
 * Optimized for Shopify Assets & SEO Indexing
 */

async function ensureFontLoaded(fontName) {
    if (fontName === "NeueHaas95Blk") {
        try {
            // Wait for font to be ready before drawing on canvas
            await document.fonts.load("900 16px NeueHaas95Blk");
        } catch (t) {
            console.warn("NeueHaas95Blk failed to load, falling back to system fonts.");
        }
    }
}

function getFontAdjustments(fontName) {
    const config = {
        "Verdana": { canvasY: 105, svgY: 52 },
        "Arial Black": { canvasY: 110, svgY: 55 },
        "Impact": { canvasY: 110, svgY: 55 },
        "NeueHaas95Blk": { canvasY: 110, svgY: 55 }
    };
    return config[fontName] || { canvasY: 110, svgY: 55 };
}

function setupColorPickerBehavior() {
    document.addEventListener("click", function(e) {
        let pickers = document.querySelectorAll('input[type="color"]');
        pickers.forEach(picker => {
            if (!picker.contains(e.target) && e.target !== picker) {
                picker.blur();
            }
        });
    });
}

function addColorResetButtons() {
    let pickers = document.querySelectorAll('input[type="color"]');
    pickers.forEach(picker => {
        if (picker.nextElementSibling && picker.nextElementSibling.classList.contains("color-reset")) return;

        let btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "↺";
        btn.className = "color-reset";
        btn.title = "Reset to default color";
        
        // Determine default based on ID context
        let defaultColor = "#ffffff";
        if (picker.id.includes("letterBackground")) {
            if (picker.id.includes("1")) defaultColor = "#ff0000"; // S - Red
            if (picker.id.includes("2")) defaultColor = "#ffff00"; // Q - Yellow
            if (picker.id.includes("3")) defaultColor = "#008000"; // D - Green
            if (picker.id.includes("4")) defaultColor = "#0000ff"; // I - Blue
        } else if (picker.id.includes("outlineColor")) {
            defaultColor = "#333333";
        }

        btn.addEventListener("click", () => {
            picker.value = defaultColor;
            picker.dispatchEvent(new Event("change", { bubbles: true }));
        });
        picker.parentNode.insertBefore(btn, picker.nextSibling);
    });
}

class SafetyLetterGenerator {
    constructor(id) {
        this.id = id;
        this.elements = {
            letterInput: document.getElementById(`letterInput${id}`),
            cellCountInput: document.getElementById(`cellCountInput${id}`),
            visibilityThreshold: document.getElementById(`visibilityThreshold${id}`),
            fontSelect: document.getElementById(`fontSelect${id}`),
            borderStyle: document.getElementById(`borderStyle${id}`),
            borderWidth: document.getElementById(`borderWidth${id}`),
            letterBackground: document.getElementById(`letterBackground${id}`),
            backgroundColor: document.getElementById(`backgroundColor${id}`),
            outlineColor: document.getElementById(`outlineColor${id}`),
            generateBtn: document.getElementById(`generateBtn${id}`),
            letterBoard: document.getElementById(`letterBoard${id}`)
        };

        // Guard clause: only init if elements exist on page
        if (!this.elements.letterInput) return;

        this.elements.generateBtn.addEventListener("click", () => this.generate());
        
        // Auto-update on color changes
        [this.elements.letterBackground, this.elements.backgroundColor, this.elements.outlineColor].forEach(el => {
            el.addEventListener("change", () => this.generate());
        });

        this.generate();
    }

    findOptimalGridSize(targetCount, letter, font) {
        let bestSize = 10;
        let minDiff = Infinity;
        for (let i = 5; i <= 50; i++) {
            let diff = Math.abs(this.countCellsForGrid(i, letter, font) - targetCount);
            if (diff < minDiff) {
                minDiff = diff;
                bestSize = i;
            }
            if (diff <= 1) break;
        }
        return bestSize;
    }

    countCellsForGrid(size, letter, font) {
        const adj = getFontAdjustments(font);
        const threshold = parseInt(this.elements.visibilityThreshold.value) || 50;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 200; canvas.height = 200;
        
        ctx.font = font === "NeueHaas95Blk" ? '900 170px NeueHaas95Blk, "Arial Black", sans-serif' : `900 170px ${font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.fillText(letter, 100, adj.canvasY);

        let count = 0;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let hits = 0;
                for (let h = 0.1; h <= 0.9; h += 0.16) {
                    for (let g = 0.1; g <= 0.9; g += 0.16) {
                        let px = (x + h) * (200 / size);
                        let py = (y + g) * (200 / size);
                        if (ctx.getImageData(Math.floor(px), Math.floor(py), 1, 1).data[3] > 100) hits++;
                    }
                }
                if (hits >= (threshold / 100) * 36) count++;
            }
        }
        return count;
    }

    async generate() {
        const letter = this.elements.letterInput.value.toUpperCase() || "S";
        const font = this.elements.fontSelect.value;
        const stroke = this.elements.outlineColor.value;
        const fill = this.elements.backgroundColor.value;
        const bg = this.elements.letterBackground.value;
        const bStyle = this.elements.borderStyle.value;
        const bWidth = parseFloat(this.elements.borderWidth.value);
        const adj = getFontAdjustments(font);
        const threshold = parseInt(this.elements.visibilityThreshold.value) || 50;

        await ensureFontLoaded(font);

        const targetCount = parseInt(this.elements.cellCountInput.value) || 25;
        const gridSize = this.findOptimalGridSize(targetCount, letter, font);
        
        this.elements.letterBoard.innerHTML = "";
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.setAttribute("style", `background-color: ${bg}`);

        // Reference canvas for pixel detection
        const refCanvas = document.createElement("canvas");
        const refCtx = refCanvas.getContext("2d");
        refCanvas.width = 200; refCanvas.height = 200;
        refCtx.font = font === "NeueHaas95Blk" ? '900 170px NeueHaas95Blk, "Arial Black", sans-serif' : `900 170px ${font}`;
        refCtx.textAlign = "center";
        refCtx.textBaseline = "middle";
        refCtx.fillText(letter, 100, adj.canvasY);

        // ClipPath for the letter shape
        const defs = document.createElementNS(ns, "defs");
        const clip = document.createElementNS(ns, "clipPath");
        clip.setAttribute("id", `charClip${this.id}`);
        const clipText = document.createElementNS(ns, "text");
        clipText.setAttribute("x", "50");
        clipText.setAttribute("y", adj.svgY);
        clipText.setAttribute("text-anchor", "middle");
        clipText.setAttribute("dominant-baseline", "middle");
        clipText.setAttribute("font-size", "85");
        clipText.setAttribute("font-family", font);
        clipText.setAttribute("font-weight", "900");
        clipText.textContent = letter;
        
        clip.appendChild(clipText);
        defs.appendChild(clip);
        svg.appendChild(defs);

        // Background fill
        const mainText = clipText.cloneNode(true);
        mainText.setAttribute("fill", fill);
        svg.appendChild(mainText);

        let cellW = 100 / gridSize;
        let cellH = 100 / gridSize;
        let currentNum = 1;
        let fontSize = Math.max(0.8, 20 / gridSize);

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                let points = [];
                for (let e = 0.05; e <= 0.95; e += 0.11) {
                    for (let s = 0.05; s <= 0.95; s += 0.11) {
                        let px = (x + e) * (200 / gridSize);
                        let py = (y + s) * (200 / gridSize);
                        if (refCtx.getImageData(px, py, 1, 1).data[3] > 100) {
                            points.push({ x: (x + e) * cellW, y: (y + s) * cellH });
                        }
                    }
                }

                if (points.length > 0) {
                    let rect = document.createElementNS(ns, "rect");
                    rect.setAttribute("x", x * cellW);
                    rect.setAttribute("y", y * cellH);
                    rect.setAttribute("width", cellW);
                    rect.setAttribute("height", cellH);
                    rect.setAttribute("fill", "none");
                    rect.setAttribute("stroke", "#ddd");
                    rect.setAttribute("stroke-width", gridSize > 40 ? "0.1" : "0.2");
                    rect.setAttribute("clip-path", `url(#charClip${this.id})`);
                    svg.appendChild(rect);
                }

                if (points.length >= (81 * (threshold / 100))) {
                    let avgX = points.reduce((a, b) => a + b.x, 0) / points.length;
                    let avgY = points.reduce((a, b) => a + b.y, 0) / points.length;
                    let txt = document.createElementNS(ns, "text");
                    txt.setAttribute("x", avgX);
                    txt.setAttribute("y", avgY);
                    txt.setAttribute("text-anchor", "middle");
                    txt.setAttribute("dominant-baseline", "middle");
                    txt.setAttribute("font-size", fontSize);
                    txt.setAttribute("fill", "#444");
                    txt.setAttribute("font-family", "Arial");
                    txt.textContent = currentNum++;
                    svg.appendChild(txt);
                }
            }
        }

        // Letter Outline
        if (bStyle !== "none" && bWidth > 0) {
            const outline = clipText.cloneNode(true);
            outline.setAttribute("fill", "none");
            outline.setAttribute("stroke", stroke);
            outline.setAttribute("stroke-width", bWidth);
            outline.setAttribute("vector-effect", "non-scaling-stroke");
            outline.setAttribute("stroke-linejoin", "round");
            if (bStyle === "dotted") outline.setAttribute("stroke-dasharray", "1.5 2.5");
            if (bStyle === "dashed") outline.setAttribute("stroke-dasharray", "6 4");
            svg.appendChild(outline);
        }

        this.elements.letterBoard.appendChild(svg);
    }
}

function setupDownloadButton(id) {
    const btn = document.getElementById(`downloadBtn${id}`);
    if (!btn) return;

    btn.onclick = () => {
        const board = document.getElementById(`letterBoard${id}`);
        const svg = board.querySelector("svg");
        if (!svg) return;

        const clone = svg.cloneNode(true);
        const font = document.getElementById(`fontSelect${id}`).value;
        const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
        style.textContent = `text { font-family: "${font}", sans-serif !important; font-weight: 900; }`;
        clone.prepend(style);
        
        clone.setAttribute("width", "1000");
        clone.setAttribute("height", "1000");
        clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        const serializer = new XMLSerializer();
        const svgBlob = new Blob([serializer.serializeToString(clone)], {type: "image/svg+xml;charset=utf-8"});
        const url = URL.createObjectURL(svgBlob);
        
        const link = document.createElement("a");
        link.href = url;
        link.download = `safety-letter-${id}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
}

// Optimized Initialization
function initAll() {
    if (!document.getElementById('letterInput1')) return; // Exit if not on generator page

    setupColorPickerBehavior();
    addColorResetButtons();

    for (let i = 1; i <= 4; i++) {
        new SafetyLetterGenerator(i);
        setupDownloadButton(i);
    }
}

// Execution
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
} else {
    initAll();
}
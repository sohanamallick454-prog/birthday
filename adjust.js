// adjust.js - Fine-tuning positions for BIGGER STICKERS (120px)

console.log('🔧 ADJUST MODE ENABLED - Drag stickers to reposition');

// Wait for the main script to create stickers
setTimeout(() => {
    // Check if stickers are loaded
    if (typeof stickers === 'undefined' || !stickers.length) {
        console.error('Stickers not found. Make sure script.js loads first.');
        return;
    }
    
    console.log('Current positions:', mandalaPositions);
    
    // Add adjustment controls to the page
    const adjustHTML = `
        <div id="adjustPanel" style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            width: 300px;
            border: 2px solid #4cc9f0;
            box-shadow: 0 0 20px rgba(76, 201, 240, 0.5);
            font-family: Arial, sans-serif;
        ">
            <h3 style="margin-top: 0; color: #4cc9f0; display: flex; align-items: center; gap: 10px;">
                <span>🔧</span>
                <span>Adjust Positions</span>
            </h3>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #b8c0ff;">Select Sticker:</label>
                <select id="stickerSelect" style="width: 100%; padding: 8px; background: #222; color: white; border: 1px solid #4cc9f0; border-radius: 5px;">
                    ${stickers.map((_, i) => `<option value="${i}">${i+1}: ${princessNames[i]}</option>`).join('')}
                </select>
            </div>
            <div style="margin: 15px 0;">
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #ffd700;">X Position:</span>
                    <span id="xValue" style="font-weight: bold;">50%</span>
                </div>
                <input type="range" id="xSlider" min="0" max="100" value="50" step="0.5" style="width: 100%; margin-top: 5px;">
            </div>
            <div style="margin: 15px 0;">
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #ffd700;">Y Position:</span>
                    <span id="yValue" style="font-weight: bold;">50%</span>
                </div>
                <input type="range" id="ySlider" min="0" max="100" value="50" step="0.5" style="width: 100%; margin-top: 5px;">
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button onclick="saveAdjustedPositions()" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">💾 Save</button>
                <button onclick="copyAdjustedPositions()" style="flex: 1; padding: 10px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;">📋 Copy</button>
                <button onclick="toggleAdjustPanel()" style="padding: 10px 15px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">✕</button>
            </div>
            <div style="margin-top: 15px; font-size: 0.85rem; color: #ccc; line-height: 1.4;">
                <div style="color: #4cc9f0; margin-bottom: 5px;">💡 Instructions:</div>
                <div>1. Drag stickers directly on mandala</div>
                <div>2. Or use sliders above</div>
                <div>3. Click "Copy" then update script.js</div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', adjustHTML);
    
    // Make stickers draggable
    stickers.forEach((stickerObj, index) => {
        const sticker = stickerObj.element;
        sticker.style.cursor = 'grab';
        
        let isDragging = false;
        
        sticker.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return; // Only left click
            
            isDragging = true;
            e.preventDefault();
            sticker.style.cursor = 'grabbing';
            
            // Select this sticker in the panel
            document.getElementById('stickerSelect').value = index;
            updateSlidersFromPosition(index);
            
            const startX = e.clientX;
            const startY = e.clientY;
            const startLeft = parseFloat(sticker.style.left) || 0;
            const startTop = parseFloat(sticker.style.top) || 0;
            
            function mouseMove(e) {
                if (!isDragging) return;
                
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                
                const container = sticker.parentElement.getBoundingClientRect();
                const newXPercent = ((startLeft + deltaX) / container.width) * 100;
                const newYPercent = ((startTop + deltaY) / container.height) * 100;
                
                // Update sticker position - CHANGED FROM 40px TO 60px
                sticker.style.left = `calc(${newXPercent}% - 60px)`;
                sticker.style.top = `calc(${newYPercent}% - 60px)`;
                
                // Update positions array
                mandalaPositions[index] = { 
                    x: Math.round(newXPercent * 10) / 10, 
                    y: Math.round(newYPercent * 10) / 10 
                };
                
                // Update sliders
                updateSlidersFromPosition(index);
            }
            
            function mouseUp() {
                isDragging = false;
                sticker.style.cursor = 'grab';
                document.removeEventListener('mousemove', mouseMove);
                document.removeEventListener('mouseup', mouseUp);
            }
            
            document.addEventListener('mousedown', mouseMove);
            document.addEventListener('mouseup', mouseUp);
        });
    });
    
    // Setup slider controls
    const xSlider = document.getElementById('xSlider');
    const ySlider = document.getElementById('ySlider');
    const xValue = document.getElementById('xValue');
    const yValue = document.getElementById('yValue');
    const stickerSelect = document.getElementById('stickerSelect');
    
    function updateSlidersFromPosition(index) {
        const pos = mandalaPositions[index];
        xSlider.value = pos.x;
        ySlider.value = pos.y;
        xValue.textContent = pos.x.toFixed(1) + '%';
        yValue.textContent = pos.y.toFixed(1) + '%';
    }
    
    stickerSelect.addEventListener('change', function() {
        updateSlidersFromPosition(parseInt(this.value));
    });
    
    xSlider.addEventListener('input', function() {
        const index = parseInt(stickerSelect.value);
        const x = parseFloat(this.value);
        xValue.textContent = x.toFixed(1) + '%';
        
        const sticker = stickers[index].element;
        sticker.style.left = `calc(${x}% - 60px)`; // CHANGED FROM 40px TO 60px
        mandalaPositions[index].x = x;
    });
    
    ySlider.addEventListener('input', function() {
        const index = parseInt(stickerSelect.value);
        const y = parseFloat(this.value);
        yValue.textContent = y.toFixed(1) + '%';
        
        const sticker = stickers[index].element;
        sticker.style.top = `calc(${y}% - 60px)`; // CHANGED FROM 40px TO 60px
        mandalaPositions[index].y = y;
    });
    
    // Initialize sliders with first sticker
    updateSlidersFromPosition(0);
    
    // Toggle panel visibility
    window.toggleAdjustPanel = function() {
        const panel = document.getElementById('adjustPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };
    
    // Save function
    window.saveAdjustedPositions = function() {
        console.log('Saved positions:', mandalaPositions);
        alert('✅ Positions saved to browser console (Press F12 to see)\n\nCopy them to update script.js');
    };
    
    // Copy function
    window.copyAdjustedPositions = function() {
        const coordString = mandalaPositions.map((coord, index) => 
            `    { x: ${coord.x.toFixed(1)}, y: ${coord.y.toFixed(1)} }, // ${princessNames[index]}`
        ).join('\n');
        
        const fullCode = `// Updated positions - ${new Date().toLocaleString()}\nconst mandalaPositions = [\n${coordString}\n];`;
        
        navigator.clipboard.writeText(fullCode).then(() => {
            alert('✅ Positions copied to clipboard!\n\nPaste this into your script.js file.');
        }).catch(err => {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = fullCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('✅ Positions copied!');
        });
    };
    
    console.log('Adjustment panel ready. Drag stickers or use controls.');
}, 500); // Small delay to ensure stickers are created
// script.js - Mandala Princess Password Game with ALPHABETICAL ORDER & LOCAL AUDIO
// UPDATED FOR GITHUB PAGES COMPATIBILITY

// Your sticker images - UPDATED FOR GITHUB PAGES
const stickerImages = [
    'https://sohanamallick454-prog.github.io/birthday/images/sticker1.png',
    'https://sohanamallick454-prog.github.io/birthday/images/sticker2.png',
    'https://sohanamallick454-prog.github.io/birthday/images/sticker3.png',
    'https://sohanamallick454-prog.github.io/birthday/images/sticker4.png',
    'https://sohanamallick454-prog.github.io/birthday/images/sticker5.png',
    'https://sohanamallick454-prog.github.io/birthday/images/sticker6.png',
    'https://sohanamallick454-prog.github.io/birthday/images/sticker7.png',
    'https://sohanamallick454-prog.github.io/birthday/images/sticker8.png',
    'https://sohanamallick454-prog.github.io/birthday/images/sticker9.png',
    'https://sohanamallick454-prog.github.io/birthday/images/sticker10.png',
    'https://sohanamallick454-prog.github.io/birthday/images/sticker11.png',
    'https://sohanamallick454-prog.github.io/birthday/images/sticker12.png'
];

// Princess names in ALPHABETICAL ORDER (password sequence)
const princessNames = [
    "Ashlyn",     // 1st in alphabetical order
    "Blair",      // 2nd
    "Courtney",   // 3rd
    "Deline",     // 4th 
    "Edeline",    // 5th
    "Fallon",     // 6th
    "Genevieve",  // 7th
    "Hadley",     // 8th
    "Isla",       // 9th
    "Janessa",    // 10th
    "Kathleen",   // 11th
    "Lacey"       // 12th (SPECIAL: needs 3 clicks)
];

// Local audio files for each princess - UPDATED PATHS
const princessAudio = [
    "https://sohanamallick454-prog.github.io/birthday/sound/a.mp3",
    "https://sohanamallick454-prog.github.io/birthday/sound/b.mp3",
    "https://sohanamallick454-prog.github.io/birthday/sound/c.mp3",
    "https://sohanamallick454-prog.github.io/birthday/sound/d.mp3",
    "https://sohanamallick454-prog.github.io/birthday/sound/e.mp3",
    "https://sohanamallick454-prog.github.io/birthday/sound/f.mp3",
    "https://sohanamallick454-prog.github.io/birthday/sound/g.mp3",
    "https://sohanamallick454-prog.github.io/birthday/sound/h.mp3",
    "https://sohanamallick454-prog.github.io/birthday/sound/i.mp3",
    "https://sohanamallick454-prog.github.io/birthday/sound/j.mp3",
    "https://sohanamallick454-prog.github.io/birthday/sound/k.mp3",
    "https://sohanamallick454-prog.github.io/birthday/sound/l.mp3"
];

// Fallback sounds (using free public domain sounds)
const soundFiles = {
    error: "https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3",
    unclick: "https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3",
    success: "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3",
    click: "https://assets.mixkit.co/sfx/preview/mixkit-magic-sparkles-300.mp3"
};

// Sticker positions on mandala (in percentage)
const mandalaPositions = [
    { x: 18.5, y: 67.4 }, // Sticker 1: Isla (9th alphabetically)
    { x: 80, y: 70 },     // Sticker 2: Edeline (5th alphabetically)
    { x: 82, y: 36.3 },   // Sticker 3: Courtney (3rd alphabetically)
    { x: 49.9, y: 86 },   // Sticker 4: Genevieve (7th alphabetically)
    { x: 21.7, y: 32.4 }, // Sticker 5: Kathleen (11th alphabetically)
    { x: 39.8, y: 66.3 }, // Sticker 6: Hadley (8th alphabetically)
    { x: 34.2, y: 50.5 }, // Sticker 7: Janessa (10th alphabetically)
    { x: 57.9, y: 37.5 }, // Sticker 8: Blair (2nd alphabetically)
    { x: 42.6, y: 37 },   // Sticker 9: Lacey (12th alphabetically)
    { x: 65.8, y: 55 },   // Sticker 10: Deline (4th alphabetically)
    { x: 52.6, y: 16.5 }, // Sticker 11: Ashlyn (1st alphabetically)
    { x: 58.3, y: 67.7 }, // Sticker 12: Fallon (6th alphabetically)
];

// Map: Which sticker ID corresponds to which alphabetical position
const alphabeticalOrder = [10, 7, 2, 9, 1, 11, 3, 5, 0, 6, 4, 8];

// NEW DESTINATION PAGE - Birthday Cake Page
const NEXT_PAGE_URL = "https://sohanamallick454-prog.github.io/birthday/cake.html";

// Global variables
let clickedStickers = []; // Array to track clicked sticker IDs in alphabetical order
let stickers = [];
let isGameComplete = false;
let currentHint = null;
let laceyClickCount = 0; // Special counter for Lacey
let laceyIsActive = false; // Track if Lacey is the current sticker
let audioEnabled = true; // Control audio on/off
let isMobileDevice = false;
let currentStickerSize = 120; // Default sticker size, will be adjusted
let isPortraitMode = false;

// DOM elements
const stickersContainer = document.getElementById('stickersContainer');
const countElement = document.getElementById('count');

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing Princess Game...");
    
    // Detect device type and orientation
    detectDeviceType();
    checkOrientation();
    
    // Adjust layout based on device
    adjustLayoutForDevice();
    
    // Create stickers with error handling
    try {
        createStickers();
    } catch (error) {
        console.error("Error creating stickers:", error);
        // Fallback: Create placeholder stickers
        createFallbackStickers();
    }
    
    addSparkleAnimation();
    updateInstruction();
    
    // Show hint for first sticker when game starts
    setTimeout(showNextStickerHint, 500);
    
    // Add audio toggle button to controls
    addAudioToggle();
    
    // Preload audio files for better performance
    preloadAudioFiles();
    
    // Add event listeners for responsiveness
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Add loading screen timeout (remove if images don't load)
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            loadingScreen.style.display = 'none';
        }
    }, 5000);
});

// Detect device type and set responsive variables
function detectDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    
    isMobileDevice = isMobile;
    
    // Adjust sticker size based on screen width
    const screenWidth = window.innerWidth;
    if (screenWidth <= 350) {
        currentStickerSize = 50;
    } else if (screenWidth <= 450) {
        currentStickerSize = 60;
    } else if (screenWidth <= 600) {
        currentStickerSize = 70;
    } else if (screenWidth <= 800) {
        currentStickerSize = 90;
    } else {
        currentStickerSize = 120;
    }
}

// Check if device is in portrait mode
function checkOrientation() {
    isPortraitMode = window.innerHeight > window.innerWidth;
}

// Adjust layout based on device type
function adjustLayoutForDevice() {
    if (isMobileDevice) {
        // Add mobile-specific classes or adjustments
        document.body.classList.add('mobile-device');
        
        // Adjust hint timing for mobile
        if (currentHint) {
            removeCurrentHint();
            setTimeout(showNextStickerHint, 300);
        }
    }
}

// Handle window resize
function handleResize() {
    detectDeviceType();
    checkOrientation();
    adjustLayoutForDevice();
    adjustStickerPositions();
}

// Handle orientation change
function handleOrientationChange() {
    setTimeout(() => {
        checkOrientation();
        adjustStickerPositions();
    }, 300);
}

// Adjust sticker positions for responsive design
function adjustStickerPositions() {
    stickers.forEach(sticker => {
        const pos = sticker.position;
        const halfSize = currentStickerSize / 2;
        
        // Update sticker position based on current size
        sticker.element.style.left = `calc(${pos.x}% - ${halfSize}px)`;
        sticker.element.style.top = `calc(${pos.y}% - ${halfSize}px)`;
        
        // Update sticker size
        sticker.element.style.width = `${currentStickerSize}px`;
        sticker.element.style.height = `${currentStickerSize}px`;
        
        // Adjust label position based on sticker size
        const label = sticker.element.querySelector('.sticker-label');
        if (label) {
            label.style.bottom = `-${Math.max(22, currentStickerSize * 0.18)}px`;
            label.style.fontSize = `${Math.max(0.7, currentStickerSize * 0.0065)}rem`;
        }
    });
}

// Preload audio files for better performance
function preloadAudioFiles() {
    console.log("Preloading audio files...");
    // Use Promise.all to handle audio loading
    const audioPromises = [];
    
    // Try to load princess audio
    princessAudio.forEach((audioUrl, index) => {
        const audio = new Audio();
        audio.src = audioUrl;
        audio.preload = 'auto';
        
        // Create a promise for each audio load
        const promise = new Promise((resolve) => {
            audio.oncanplaythrough = resolve;
            audio.onerror = resolve; // Resolve even on error to continue
        });
        
        audioPromises.push(promise);
    });
    
    // Also preload other sounds
    Object.values(soundFiles).forEach(url => {
        const audio = new Audio();
        audio.src = url;
        audio.preload = 'auto';
        
        const promise = new Promise((resolve) => {
            audio.oncanplaythrough = resolve;
            audio.onerror = resolve;
        });
        
        audioPromises.push(promise);
    });
    
    // Log when all audio is loaded (or attempted)
    Promise.all(audioPromises).then(() => {
        console.log("Audio preloading complete");
    });
}

// Create and position stickers on the mandala
function createStickers() {
    // Clear container first
    stickersContainer.innerHTML = '';
    stickers = [];
    
    stickerImages.forEach((src, index) => {
        // Find alphabetical position for this sticker
        const alphabeticalPos = alphabeticalOrder.indexOf(index);
        
        // Create sticker element
        const sticker = document.createElement('div');
        sticker.className = 'sticker';
        sticker.dataset.id = index;
        sticker.dataset.alphabeticalPos = alphabeticalPos;
        sticker.dataset.name = princessNames[alphabeticalPos] || `Princess ${index + 1}`;
        
        // Create image element for better error handling
        const img = document.createElement('img');
        img.src = src;
        img.alt = sticker.dataset.name;
        img.onerror = function() {
            // Fallback to colored placeholder if image fails to load
            console.log(`Image failed to load: ${src}`);
            this.style.display = 'none';
            sticker.style.backgroundColor = getPrincessColor(alphabeticalPos);
            sticker.style.borderRadius = '15px';
            sticker.style.display = 'flex';
            sticker.style.alignItems = 'center';
            sticker.style.justifyContent = 'center';
            
            // Show initial letter as fallback
            const initial = document.createElement('div');
            initial.textContent = sticker.dataset.name.charAt(0);
            initial.style.fontSize = `${currentStickerSize * 0.4}px`;
            initial.style.color = 'white';
            initial.style.fontWeight = 'bold';
            sticker.appendChild(initial);
        };
        
        sticker.appendChild(img);
        
        // Position sticker on mandala with responsive sizing
        const pos = mandalaPositions[index] || { x: 50, y: 50 };
        const halfSize = currentStickerSize / 2;
        sticker.style.left = `calc(${pos.x}% - ${halfSize}px)`;
        sticker.style.top = `calc(${pos.y}% - ${halfSize}px)`;
        sticker.style.width = `${currentStickerSize}px`;
        sticker.style.height = `${currentStickerSize}px`;
        
        // Add princess name label
        const label = document.createElement('div');
        label.className = 'sticker-label';
        label.textContent = sticker.dataset.name;
        label.style.bottom = `-${Math.max(22, currentStickerSize * 0.18)}px`;
        label.style.fontSize = `${Math.max(0.7, currentStickerSize * 0.0065)}rem`;
        sticker.appendChild(label);
        
        // Add alphabetical order badge (hidden by default)
        const orderBadge = document.createElement('div');
        orderBadge.className = 'order-badge';
        orderBadge.textContent = alphabeticalPos + 1; // Show 1-12, not 0-11
        orderBadge.style.display = 'none';
        orderBadge.style.width = `${Math.max(25, currentStickerSize * 0.25)}px`;
        orderBadge.style.height = `${Math.max(25, currentStickerSize * 0.25)}px`;
        orderBadge.style.fontSize = `${Math.max(0.8, currentStickerSize * 0.0075)}rem`;
        sticker.appendChild(orderBadge);
        
        // Special counter for Lacey (12th alphabetically)
        if (alphabeticalPos === 11) { // Lacey is 12th alphabetically
            const laceyCounter = document.createElement('div');
            laceyCounter.className = 'lacey-counter';
            laceyCounter.textContent = '0/3';
            laceyCounter.style.display = 'none';
            laceyCounter.style.fontSize = `${Math.max(0.75, currentStickerSize * 0.007)}rem`;
            sticker.appendChild(laceyCounter);
        }
        
        // Add click event with touch support for mobile
        sticker.addEventListener('click', function() {
            handleStickerClick(this);
        });
        
        // Add touch event for better mobile response
        sticker.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1.05)';
        }, { passive: false });
        
        sticker.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.transform = '';
            handleStickerClick(this);
        }, { passive: false });
        
        // Add hover effects for desktop
        sticker.addEventListener('mouseenter', function() {
            if (!isMobileDevice) {
                this.style.transform = 'scale(1.1)';
                this.style.zIndex = '50';
            }
        });
        
        sticker.addEventListener('mouseleave', function() {
            if (!isMobileDevice) {
                this.style.transform = '';
                this.style.zIndex = '';
            }
        });
        
        // Add to container and array
        stickersContainer.appendChild(sticker);
        stickers.push({
            element: sticker,
            id: index,
            alphabeticalPos: alphabeticalPos,
            name: sticker.dataset.name,
            position: pos,
            audioUrl: princessAudio[alphabeticalPos],
            isLacey: alphabeticalPos === 11 // Mark Lacey sticker
        });
    });
    
    console.log(`Created ${stickers.length} stickers`);
}

// Fallback function if createStickers fails
function createFallbackStickers() {
    stickersContainer.innerHTML = '';
    stickers = [];
    
    princessNames.forEach((name, alphabeticalPos) => {
        const stickerId = alphabeticalOrder[alphabeticalPos];
        const pos = mandalaPositions[stickerId] || { x: 50, y: 50 };
        
        // Create simple colored sticker
        const sticker = document.createElement('div');
        sticker.className = 'sticker';
        sticker.dataset.id = stickerId;
        sticker.dataset.alphabeticalPos = alphabeticalPos;
        sticker.dataset.name = name;
        
        sticker.style.backgroundColor = getPrincessColor(alphabeticalPos);
        sticker.style.borderRadius = '15px';
        sticker.style.display = 'flex';
        sticker.style.alignItems = 'center';
        sticker.style.justifyContent = 'center';
        sticker.style.border = '3px solid white';
        sticker.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        
        const halfSize = currentStickerSize / 2;
        sticker.style.left = `calc(${pos.x}% - ${halfSize}px)`;
        sticker.style.top = `calc(${pos.y}% - ${halfSize}px)`;
        sticker.style.width = `${currentStickerSize}px`;
        sticker.style.height = `${currentStickerSize}px`;
        
        // Show initial letter
        const initial = document.createElement('div');
        initial.textContent = name.charAt(0);
        initial.style.fontSize = `${currentStickerSize * 0.4}px`;
        initial.style.color = 'white';
        initial.style.fontWeight = 'bold';
        sticker.appendChild(initial);
        
        // Add label
        const label = document.createElement('div');
        label.className = 'sticker-label';
        label.textContent = name;
        label.style.bottom = `-${Math.max(22, currentStickerSize * 0.18)}px`;
        label.style.fontSize = `${Math.max(0.7, currentStickerSize * 0.0065)}rem`;
        sticker.appendChild(label);
        
        // Add click event
        sticker.addEventListener('click', function() {
            handleStickerClick(this);
        });
        
        stickersContainer.appendChild(sticker);
        stickers.push({
            element: sticker,
            id: stickerId,
            alphabeticalPos: alphabeticalPos,
            name: name,
            position: pos,
            audioUrl: princessAudio[alphabeticalPos],
            isLacey: alphabeticalPos === 11
        });
    });
}

// Helper function to get color for princess
function getPrincessColor(index) {
    const colors = [
        '#FF6B8B', '#4ECDC4', '#FFD166', '#06D6A0',
        '#118AB2', '#EF476F', '#9D4EDD', '#F15BB5',
        '#00BBF9', '#00F5D4', '#FF9E00', '#FFD700'
    ];
    return colors[index] || '#6C63FF';
}

// Add audio toggle button to controls
function addAudioToggle() {
    const controls = document.querySelector('.controls');
    if (!controls) return;
    
    // Check if audio toggle already exists
    if (document.querySelector('.audio-toggle-btn')) return;
    
    const audioToggle = document.createElement('button');
    audioToggle.className = 'audio-toggle-btn';
    audioToggle.innerHTML = '🔊 Sound On';
    
    // Style the button
    audioToggle.style.cssText = `
        background: linear-gradient(to right, #9c27b0, #673ab7);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 50px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-weight: bold;
        letter-spacing: 0.5px;
        margin: 5px;
    `;
    
    audioToggle.onclick = toggleAudio;
    
    controls.appendChild(audioToggle);
}

// Toggle audio on/off
function toggleAudio() {
    audioEnabled = !audioEnabled;
    const audioToggle = document.querySelector('.audio-toggle-btn');
    
    if (audioToggle) {
        if (audioEnabled) {
            audioToggle.innerHTML = '🔊 Sound On';
            audioToggle.style.background = 'linear-gradient(to right, #9c27b0, #673ab7)';
            // Play test sound
            playSound(soundFiles.click, 0.1);
        } else {
            audioToggle.innerHTML = '🔇 Sound Off';
            audioToggle.style.background = 'linear-gradient(to right, #757575, #9e9e9e)';
        }
    }
    
    // Show feedback
    showAudioFeedback(audioEnabled);
}

// Show audio feedback message
function showAudioFeedback(enabled) {
    const feedback = document.createElement('div');
    feedback.className = 'audio-feedback';
    if (!enabled) feedback.classList.add('muted');
    
    feedback.textContent = enabled ? '🔊 Audio Enabled' : '🔇 Audio Disabled';
    
    // Style the feedback
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${enabled ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)'};
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        z-index: 1000;
        font-weight: bold;
        animation: fadeInOut 1.5s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 1500);
}

// Play sound function with error handling
function playSound(url, volume = 0.2) {
    if (!audioEnabled || !url) return;
    
    try {
        const audio = new Audio(url);
        audio.volume = volume;
        
        audio.play().catch(e => {
            console.log("Audio play failed for:", url, e);
            // Silently fail - don't show errors to users
        });
    } catch (e) {
        console.log("Audio error:", e);
    }
}

// Play princess-specific audio
function playPrincessAudio(alphabeticalPos, type = 'correct') {
    if (!audioEnabled) return;
    
    try {
        let audioUrl;
        
        switch(type) {
            case 'correct':
                audioUrl = princessAudio[alphabeticalPos];
                playSound(audioUrl, 0.25);
                break;
                
            case 'error':
                playSound(soundFiles.error, 0.15);
                break;
                
            case 'unclick':
                playSound(soundFiles.unclick, 0.1);
                break;
                
            case 'lacey':
                if (laceyClickCount === 3) {
                    audioUrl = princessAudio[11];
                    playSound(audioUrl, 0.3);
                } else {
                    playSound(soundFiles.click, 0.2);
                }
                break;
                
            case 'success':
                playSound(soundFiles.success, 0.25);
                break;
                
            default:
                audioUrl = princessAudio[alphabeticalPos];
                playSound(audioUrl, 0.2);
        }
        
    } catch (e) {
        console.log("Princess audio error:", e);
        // Fallback to default sounds
        playMagicSound(type);
    }
}

// Update instruction text
function updateInstruction() {
    let instruction = document.getElementById('current-instruction');
    
    if (!instruction) {
        instruction = document.createElement('div');
        instruction.id = 'current-instruction';
        document.querySelector('.instructions').appendChild(instruction);
    }
    
    if (isGameComplete) {
        instruction.innerHTML = `<span style="color: #4CAF50">✓ Portal unlocked! Redirecting to birthday celebration...</span>`;
    } else {
        const nextAlphabeticalPos = clickedStickers.length;
        
        if (nextAlphabeticalPos >= princessNames.length) {
            instruction.innerHTML = `<span style="color: #ffd700">Complete! All princesses found!</span>`;
        } else if (nextAlphabeticalPos === 11) { // Lacey's turn (12th alphabetically)
            instruction.innerHTML = `
                <span style="color: #ffd700">Now find Princess <strong>Lacey</strong></span><br>
                <span style="color: #ffd700; font-size: ${isMobileDevice ? '0.85rem' : '0.9rem'}">
                    Click Lacey's sticker 3 times to unlock her magic! (${laceyClickCount}/3)
                </span>
            `;
        } else {
            const nextPrincess = princessNames[nextAlphabeticalPos];
            const nextPosition = nextAlphabeticalPos + 1;
            instruction.innerHTML = `
                <span style="color: #ffd700">Next: Princess <strong>${nextPrincess}</strong></span><br>
                <span style="color: #4CAF50; font-size: ${isMobileDevice ? '0.85rem' : '0.9rem'}">
                    ${nextPosition}${getOrdinalSuffix(nextPosition)} in alphabetical order
                </span>
            `;
        }
    }
    
    // Update counter
    countElement.textContent = clickedStickers.length + (laceyIsActive ? laceyClickCount / 3 : 0);
}

// Helper for ordinal suffixes
function getOrdinalSuffix(number) {
    if (number >= 11 && number <= 13) return 'th';
    switch (number % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

// Handle sticker click
function handleStickerClick(stickerElement) {
    if (isGameComplete) return;
    
    const stickerId = parseInt(stickerElement.dataset.id);
    const alphabeticalPos = parseInt(stickerElement.dataset.alphabeticalPos);
    const nextExpectedPos = clickedStickers.length;
    
    // Check if we're in Lacey sequence
    if (nextExpectedPos === 11 && alphabeticalPos === 11) {
        handleLaceyClick(stickerElement);
        return;
    }
    
    // Check if sticker is already clicked
    const indexInClicked = clickedStickers.indexOf(alphabeticalPos);
    
    if (indexInClicked > -1) {
        // UNCLICK
        clickedStickers.splice(indexInClicked, 1);
        stickerElement.classList.remove('clicked');
        stickerElement.classList.remove('wrong-order');
        
        updateOrderBadges();
        playPrincessAudio(alphabeticalPos, 'unclick');
        removeCurrentHint();
        
        if (alphabeticalPos === 11) {
            resetLacey();
        }
    } else {
        // Check if this is the correct next sticker
        const isCorrectNext = nextExpectedPos === alphabeticalPos;
        
        if (!isCorrectNext) {
            stickerElement.classList.add('wrong-order');
            playPrincessAudio(alphabeticalPos, 'error');
            highlightCorrectSticker(nextExpectedPos);
            return;
        }
        
        // CORRECT STICKER
        clickedStickers.push(alphabeticalPos);
        stickerElement.classList.add('clicked');
        stickerElement.classList.remove('wrong-order');
        
        const orderBadge = stickerElement.querySelector('.order-badge');
        orderBadge.textContent = clickedStickers.length;
        orderBadge.style.display = 'flex';
        
        createSparkles(stickerElement, alphabeticalPos === 11 ? 'gold' : 'green');
        playPrincessAudio(alphabeticalPos, 'correct');
        removeCurrentHint();
        
        // Check if we just clicked the sticker before Lacey
        if (alphabeticalPos === 10) {
            laceyIsActive = true;
        }
        
        // Check if sequence is complete
        if (clickedStickers.length === 12 && !laceyIsActive) {
            setTimeout(() => {
                isGameComplete = true;
                playPrincessAudio(alphabeticalPos, 'success');
                celebrateAllFound();
                
                setTimeout(() => {
                    window.location.href = NEXT_PAGE_URL;
                }, 3000);
            }, 300);
        } else {
            setTimeout(showNextStickerHint, 500);
        }
    }
    
    updateInstruction();
}

// Handle Lacey's special 3-click sequence
function handleLaceyClick(stickerElement) {
    laceyClickCount++;
    
    const laceyCounter = stickerElement.querySelector('.lacey-counter');
    if (laceyCounter) {
        laceyCounter.textContent = `${laceyClickCount}/3`;
        laceyCounter.style.display = 'block';
    }
    
    // Play appropriate sound for Lacey's clicks
    playPrincessAudio(11, 'lacey');
    
    // Adjust effects based on screen size
    const shadowSize = Math.min(40, currentStickerSize * 0.3);
    
    if (laceyClickCount === 1) {
        stickerElement.classList.add('clicked');
        createSparkles(stickerElement, 'gold');
    } else if (laceyClickCount === 2) {
        stickerElement.style.boxShadow = `0 0 ${shadowSize}px ${shadowSize/2}px rgba(255, 215, 0, 0.8)`;
        createSparkles(stickerElement, 'gold');
    } else if (laceyClickCount === 3) {
        stickerElement.style.boxShadow = `0 0 ${shadowSize * 1.5}px ${shadowSize}px rgba(255, 215, 0, 0.9)`;
        stickerElement.style.borderColor = '#ffd700';
        stickerElement.style.animation = 'golden-pulse 1s infinite';
        
        createGoldenExplosion(stickerElement);
        
        // Play success sound as well
        setTimeout(() => {
            playPrincessAudio(11, 'success');
        }, 500);
        
        // Mark Lacey as complete and move to next sticker
        setTimeout(() => {
            clickedStickers.push(11);
            laceyIsActive = false;
            
            if (laceyCounter) {
                laceyCounter.style.display = 'none';
            }
            
            stickerElement.style.animation = '';
            stickerElement.style.boxShadow = '';
            
            // Sequence complete!
            isGameComplete = true;
            setTimeout(() => {
                celebrateAllFound();
                
                setTimeout(() => {
                    window.location.href = NEXT_PAGE_URL;
                }, 3000);
            }, 1000);
        }, 1000);
    }
    
    updateInstruction();
}

// Reset Lacey's state
function resetLacey() {
    laceyClickCount = 0;
    laceyIsActive = false;
    
    const laceySticker = stickers.find(s => s.alphabeticalPos === 11);
    if (laceySticker) {
        const stickerElement = laceySticker.element;
        stickerElement.style.boxShadow = '';
        stickerElement.style.borderColor = '';
        stickerElement.style.animation = '';
        stickerElement.classList.remove('clicked');
        
        const laceyCounter = stickerElement.querySelector('.lacey-counter');
        if (laceyCounter) {
            laceyCounter.style.display = 'none';
        }
    }
}

// Create golden explosion for Lacey's 3rd click
function createGoldenExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Adjust particle count based on screen size
    const particleCount = Math.min(30, Math.max(15, window.innerWidth / 30));
    
    for (let i = 0; i < particleCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'golden-spark';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 60 + Math.random() * 100;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        spark.style.left = x + 'px';
        spark.style.top = y + 'px';
        
        const size = 6 + Math.random() * 15;
        spark.style.width = size + 'px';
        spark.style.height = size + 'px';
        
        spark.style.background = `radial-gradient(circle, #ffd700 40%, #ffa500 70%, transparent 100%)`;
        
        document.body.appendChild(spark);
        
        // Remove after animation
        setTimeout(() => {
            spark.remove();
        }, 1000);
    }
}

// Highlight the correct sticker
function highlightCorrectSticker(alphabeticalPos) {
    if (alphabeticalPos >= princessNames.length) return;
    
    const stickerId = alphabeticalOrder[alphabeticalPos];
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker) return;
    
    const element = sticker.element;
    const shadowSize = Math.min(20, currentStickerSize * 0.15);
    
    element.style.boxShadow = `0 0 ${shadowSize}px ${shadowSize/2}px rgba(255, 215, 0, 0.8)`;
    element.style.borderColor = '#ffd700';
    element.style.zIndex = '1000';
    
    let scale = 1;
    const pulseInterval = setInterval(() => {
        scale = scale === 1 ? 1.1 : 1;
        element.style.transform = `scale(${scale})`;
    }, 300);
    
    currentHint = {
        element: element,
        interval: pulseInterval,
        timeout: setTimeout(() => {
            clearInterval(pulseInterval);
            element.style.boxShadow = '';
            element.style.borderColor = '';
            element.style.zIndex = '';
            element.style.transform = '';
            currentHint = null;
        }, 3000)
    };
}

// Show hint for the next sticker
function showNextStickerHint() {
    if (isGameComplete) return;
    
    const nextAlphabeticalPos = clickedStickers.length;
    if (nextAlphabeticalPos >= princessNames.length) return;
    
    const stickerId = alphabeticalOrder[nextAlphabeticalPos];
    const sticker = stickers.find(s => s.id === stickerId);
    if (!sticker) return;
    
    const element = sticker.element;
    const shadowSize = Math.min(15, currentStickerSize * 0.12);
    
    removeCurrentHint();
    
    element.style.boxShadow = `0 0 ${shadowSize}px ${shadowSize/2}px rgba(76, 175, 80, 0.7)`;
    element.style.borderColor = '#4CAF50';
    element.style.zIndex = '1000';
    
    if (nextAlphabeticalPos === 11) {
        element.style.boxShadow = `0 0 ${shadowSize}px ${shadowSize/2}px rgba(255, 215, 0, 0.7)`;
        element.style.borderColor = '#ffd700';
    }
    
    let opacity = 0.6;
    const pulseInterval = setInterval(() => {
        opacity = opacity === 0.6 ? 0.9 : 0.6;
        const color = nextAlphabeticalPos === 11 ? '255, 215, 0' : '76, 175, 80';
        element.style.boxShadow = `0 0 ${shadowSize}px ${shadowSize/2}px rgba(${color}, ${opacity})`;
    }, 500);
    
    // Adjust hint duration for mobile
    const hintDuration = isMobileDevice ? 7000 : 5000;
    
    currentHint = {
        element: element,
        interval: pulseInterval,
        timeout: setTimeout(() => {
            clearInterval(pulseInterval);
            element.style.boxShadow = '';
            element.style.borderColor = '';
            element.style.zIndex = '';
            currentHint = null;
        }, hintDuration)
    };
}

// Remove current hint
function removeCurrentHint() {
    if (currentHint) {
        clearInterval(currentHint.interval);
        clearTimeout(currentHint.timeout);
        
        if (currentHint.element) {
            currentHint.element.style.boxShadow = '';
            currentHint.element.style.borderColor = '';
            currentHint.element.style.zIndex = '';
            currentHint.element.style.transform = '';
        }
        
        currentHint = null;
    }
}

// Update all order badges
function updateOrderBadges() {
    stickers.forEach(sticker => {
        const badge = sticker.element.querySelector('.order-badge');
        const alphabeticalPos = sticker.alphabeticalPos;
        const indexInClicked = clickedStickers.indexOf(alphabeticalPos);
        
        if (indexInClicked > -1 && alphabeticalPos !== 11) {
            badge.textContent = indexInClicked + 1;
            badge.style.display = 'flex';
        } else if (alphabeticalPos === 11 && laceyClickCount === 3) {
            badge.textContent = 12;
            badge.style.display = 'flex';
        } else {
            badge.textContent = alphabeticalPos + 1;
            badge.style.display = 'none';
        }
    });
}

// Show hint (manual trigger)
function showHint() {
    if (isGameComplete) return;
    showNextStickerHint();
}

// Create sparkle particles
function createSparkles(element, colorType = 'green') {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const colors = colorType === 'gold' 
        ? ['#ffd700', '#ffa500', '#ffed4e']
        : ['#4CAF50', '#8BC34A', '#CDDC39'];
    
    // Adjust sparkle count based on screen size
    const sparkleCount = Math.min(8, Math.max(4, window.innerWidth / 150));
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 40;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        
        const size = 4 + Math.random() * 8;
        sparkle.style.width = size + 'px';
        sparkle.style.height = size + 'px';
        
        sparkle.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]} 30%, transparent 70%)`;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 500);
    }
}

// Legacy function for compatibility
function playMagicSound(type = 'click') {
    if (!audioEnabled) return;
    
    try {
        let soundUrl;
        switch(type) {
            case 'click':
                soundUrl = soundFiles.click;
                break;
            case 'unclick':
                soundUrl = soundFiles.unclick;
                break;
            case 'success':
                soundUrl = soundFiles.success;
                break;
            case 'error':
                soundUrl = soundFiles.error;
                break;
            default:
                soundUrl = soundFiles.click;
        }
        
        playSound(soundUrl);
    } catch (e) {
        console.log("Magic sound error:", e);
    }
}

// Celebration when password is correct
function celebrateAllFound() {
    removeCurrentHint();
    
    stickers.forEach(sticker => {
        sticker.element.style.animation = 'gentle-pulse 1.5s ease-in-out infinite';
    });
    
    // Adjust particle count based on screen size
    const particleCount = Math.min(50, Math.max(25, window.innerWidth / 20));
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const spark = document.createElement('div');
            spark.className = 'golden-spark';
            
            const mandala = document.querySelector('.mandala-container');
            const rect = mandala.getBoundingClientRect();
            
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            const size = 5 + Math.random() * 20;
            
            spark.style.left = x + 'px';
            spark.style.top = y + 'px';
            spark.style.width = size + 'px';
            spark.style.height = size + 'px';
            spark.style.background = `radial-gradient(circle, #ffd700 40%, #ffa500 70%, transparent 100%)`;
            
            document.body.appendChild(spark);
            
            setTimeout(() => {
                spark.remove();
            }, 1000);
        }, i * 50);
    }
    
    const portalOverlay = document.getElementById('portalOverlay');
    const celebrationMsg = document.getElementById('celebrationMessage');
    
    if (portalOverlay) portalOverlay.style.display = 'block';
    if (celebrationMsg) {
        celebrationMsg.style.display = 'block';
        // Update celebration message for birthday
        celebrationMsg.querySelector('h2').textContent = '✨ PRINCESS PORTAL UNLOCKED! ✨';
        celebrationMsg.querySelector('p:nth-of-type(2)').textContent = "You've unlocked Simi's 21st Birthday Celebration!";
    }
    
    let countdown = 3;
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        countdownElement.textContent = countdown;
        
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdownElement) countdownElement.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                window.location.href = NEXT_PAGE_URL;
            }
        }, 1000);
    }
}

// Reset all
function resetStickers() {
    removeCurrentHint();
    resetLacey();
    
    stickers.forEach(sticker => {
        sticker.element.classList.remove('clicked');
        sticker.element.classList.remove('wrong-order');
        sticker.element.style.animation = '';
        sticker.element.style.boxShadow = '';
        sticker.element.style.borderColor = '';
        sticker.element.style.zIndex = '';
        sticker.element.style.transform = '';
        
        const badge = sticker.element.querySelector('.order-badge');
        if (badge) {
            badge.textContent = sticker.alphabeticalPos + 1;
            badge.style.display = 'none';
        }
    });
    
    clickedStickers = [];
    isGameComplete = false;
    updateInstruction();
    
    const portalOverlay = document.getElementById('portalOverlay');
    const celebrationMsg = document.getElementById('celebrationMessage');
    if (portalOverlay) portalOverlay.style.display = 'none';
    if (celebrationMsg) celebrationMsg.style.display = 'none';
    
    setTimeout(showNextStickerHint, 500);
}

// Add animations to CSS
function addSparkleAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(10px); }
        }
        
        @keyframes sparkle {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            100% {
                opacity: 0;
                transform: scale(1.5);
            }
        }
        
        @keyframes golden-pulse {
            0%, 100% {
                box-shadow: 0 0 40px 20px rgba(255, 215, 0, 0.9);
            }
            50% {
                box-shadow: 0 0 60px 30px rgba(255, 215, 0, 0.7);
            }
        }
        
        @keyframes gentle-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.03); }
        }
        
        .golden-spark {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            animation: sparkle 1s forwards;
            z-index: 100;
        }
        
        .sparkle {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            animation: sparkle 0.5s forwards;
            z-index: 100;
        }
        
        /* Mobile-specific adjustments */
        @media (max-width: 650px) {
            .sticker {
                transition: transform 0.2s ease !important;
            }
            
            .order-badge {
                font-size: 0.8rem !important;
            }
        }
        
        /* Orientation-specific adjustments */
        @media (max-height: 500px) and (orientation: landscape) {
            .sticker-label {
                bottom: -18px !important;
                font-size: 0.7rem !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Make functions available globally
window.resetStickers = resetStickers;
window.showHint = showHint;
window.toggleAudio = toggleAudio;


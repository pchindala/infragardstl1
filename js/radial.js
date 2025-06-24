document.body.addEventListener('contextmenu', e => e.preventDefault() & e.stopPropagation());

let currentIndex = 1; // Start with first element (home icon) at 6 o'clock
const wheel = document.querySelector('.wheel');
const angleDisplay = document.getElementById('angle');
let lastScrollTime = 0;
const scrollDelay = 50; // Reduced delay for smoother scrolling
let isDragging = false;
let startY = 0;
let currentY = 0;
let totalRotation = 0;
let isAnimating = false;
let scrollTimeout;
let isMouseOverWheel = false;
const visibleArcs = 5; // Number of arcs to show at once
const arcs = wheel.querySelectorAll('.arc');

// Set initial position to center of screen
wheel.style.setProperty('--x', '-229px');
wheel.style.setProperty('--y', `${window.innerHeight / 2}px`);
wheel.classList.add('on');

// Set initial active section (home icon)
arcs[0].classList.add('active');

// Function to update visible arcs
function updateVisibleArcs() {
	// Remove visible class from all arcs
	arcs.forEach(arc => {
		arc.classList.remove('visible');
		arc.style.opacity = '0';
		arc.style.visibility = 'hidden';
	});
	
	// Add visible class to current arc and 2 arcs before and after
	for (let i = -2; i <= 2; i++) {
		let index = (currentIndex - 1 + i + arcs.length) % arcs.length;
		let arc = arcs[index];
		arc.classList.add('visible');
		arc.style.opacity = '1';
		arc.style.visibility = 'visible';
		
		// Calculate rotation to spread across 180 degrees
		let rotation = (i * 45) + 90; // 45 degrees between each icon, centered at 90 degrees
		arc.style.setProperty('--rotation', `${rotation}deg`);
	}
}

// Initial visibility update
updateVisibleArcs();

// Update angle display
function updateAngleDisplay(angle) {
	angleDisplay.textContent = Math.round(angle);
}

// Function to update content based on active menu
function updateContent(index) {
	// Hide all content
	document.querySelectorAll('.content').forEach(content => {
		content.classList.remove('active');
	});
	
	// Get menu items
	const menuItems = ['sectorchiefprogram','finance','chemical','commercialfacilities','entertainment','faithbasedvenues','communications','dams','defenseindustrialbase','education','emergencyservices','energy','foodandagriculture','governmentfacilities','healthcarepublichealth','informationtechnology','criticalmanufacturing','nuclearreactorsmaterials','transportationsystems','wastewatersystems']; 

	
	// Show active content
	const activeContent = document.querySelector(`.content[data-menu="${menuItems[index - 1]}"]`);
	if (activeContent) {
		activeContent.classList.add('active');
		// Log when content changes
		console.log('Content Updated to:', menuItems[index - 1]);
	}
}

// Update click and hover handlers
arcs.forEach((arc, index) => {
	// Click handler
	arc.addEventListener('click', () => {
		arcs[currentIndex - 1].classList.remove('active');
		currentIndex = index + 1;
		arc.classList.add('active');
		const angle = index * 20;
		updateAngleDisplay(angle);
		updateContent(currentIndex);

		// Log click event
		const menuItems = ['sectorchiefprogram','finance','chemical','commercialfacilities','entertainment','faithbasedvenues','communications','dams','defenseindustrialbase','education','emergencyservices','energy','foodandagriculture','governmentfacilities','healthcarepublichealth','informationtechnology','criticalmanufacturing','nuclearreactorsmaterials']; 
		console.log('Clicked on:', menuItems[index]);
	});

	// Hover-to-activate handler with debounce
	let hoverTimer = null;

	arc.addEventListener('mouseenter', () => {
		clearTimeout(hoverTimer);
		hoverTimer = setTimeout(() => {
			if (currentIndex !== index + 1) {
				// Remove old active
				arcs[currentIndex - 1].classList.remove('active');

				// Update index
				currentIndex = index + 1;
				arc.classList.add('active');

				// Update content and angle
				const angle = index * 20;
				updateAngleDisplay(angle);
				updateContent(currentIndex);

				// Update visible arcs
				updateVisibleArcs();

				// Log hover event
				const menuItems = ['sectorchiefprogram','finance','chemical','commercialfacilities','entertainment','faithbasedvenues','communications','dams','defenseindustrialbase','education','emergencyservices','energy','foodandagriculture','governmentfacilities','healthcarepublichealth','informationtechnology','criticalmanufacturing','nuclearreactorsmaterials','transportationsystems','wastewatersystems']; 
				console.log('Hovered on:', menuItems[index]);
			}
		}, 750); // Delay in ms
	});

	// Optional: Clear timer on mouse leave to prevent late activation
	arc.addEventListener('mouseleave', () => {
		clearTimeout(hoverTimer);
	});
});

// Handle mouse events for dragging
document.addEventListener('mousedown', (e) => {
	// Don't start drag if clicking on an arc
	if (e.target.closest('.arc')) return;
	
	isDragging = true;
	startY = e.clientY;
	currentY = startY;
});

// Update the mousemove event handler
document.addEventListener('mousemove', (e) => {
	if (!isDragging) return;
	
	const deltaY = e.clientY - startY;
	const sensitivity = 0.5;
	const rotation = deltaY * sensitivity;
	
	const newIndex = Math.round(Math.abs(rotation) / 20) % 18 + 1;
	if (newIndex !== currentIndex) {
		// Get menu items for logging
		const menuItems = ['sectorchiefprogram','finance','chemical','commercialfacilities','entertainment','faithbasedvenues','communications','dams','defenseindustrialbase','education','emergencyservices','energy','foodandagriculture','governmentfacilities','healthcarepublichealth','informationtechnology','criticalmanufacturing','nuclearreactorsmaterials','transportationsystems','wastewatersystems']; 

		
		// Log the previous and new active elements
		console.log('Menu Scrolled:');
		console.log('From:', menuItems[currentIndex - 1]);
		console.log('To:', menuItems[newIndex - 1]);
		
		arcs[currentIndex - 1].classList.remove('active');
		currentIndex = newIndex;
		arcs[currentIndex - 1].classList.add('active');
		updateAngleDisplay(rotation);
		updateContent(currentIndex);
	}
});

document.addEventListener('mouseup', () => {
	isDragging = false;
});

// Function to handle wheel rotation
function rotateWheel(direction) {
	if (isAnimating) return;
	
	isAnimating = true;
	
	// Remove active class from current section
	arcs[currentIndex - 1].classList.remove('active');
	
	// Update current index and total rotation
	if (direction > 0) {
		// Moving clockwise
		currentIndex = currentIndex < 18 ? currentIndex + 1 : 1;
		totalRotation += 20;
	} else {
		// Moving counter-clockwise
		currentIndex = currentIndex > 1 ? currentIndex - 1 : 18;
		totalRotation -= 20;
	}
	
	// Add active class to new section
	arcs[currentIndex - 1].classList.add('active');
	
	// Update visible arcs with a slight delay for smooth transition
	setTimeout(updateVisibleArcs, 50);
	
	// Update angle display
	updateAngleDisplay(totalRotation);
	
	// Reset animation flag after transition
	setTimeout(() => {
		isAnimating = false;
	}, 800);
}

function onWheel(e) {
	e.preventDefault();
	
	const currentTime = Date.now();
	if (currentTime - lastScrollTime < scrollDelay) {
		return;
	}
	
	lastScrollTime = currentTime;
	
	// Get menu items for logging
	const menuItems = ['sectorchiefprogram','finance','chemical','commercialfacilities','entertainment','faithbasedvenues','communications','dams','defenseindustrialbase','education','emergencyservices','energy','foodandagriculture','governmentfacilities','healthcarepublichealth','informationtechnology','criticalmanufacturing','nuclearreactorsmaterials','transportationsystems','wastewatersystems']; 

	
	// Log the current active element before rotation
	console.log('Wheel Scrolled:');
	console.log('From:', menuItems[currentIndex - 1]);
	
	rotateWheel(e.deltaY);
	
	// Update content after rotation
	updateContent(currentIndex);
	
	// Log the new active element after rotation
	console.log('To:', menuItems[currentIndex - 1]);
}

// Add wheel event listener to the wheel element
wheel.addEventListener('wheel', onWheel);

// Track mouse position relative to wheel
wheel.addEventListener('mouseenter', () => {
	isMouseOverWheel = true;
});

wheel.addEventListener('mouseleave', () => {
	isMouseOverWheel = false;
});

// Initial angle display
updateAngleDisplay(0);

// Show initial content
updateContent(1);

// Add scroll event listener with debounce to prevent too many logs
window.addEventListener('scroll', () => {
	// Clear any existing timeout
	clearTimeout(scrollTimeout);
	
	// Set a new timeout
	scrollTimeout = setTimeout(() => {
		const menuItems = ['sectorchiefprogram','finance','chemical','commercialfacilities','entertainment','faithbasedvenues','communications','dams','defenseindustrialbase','education','emergencyservices','energy','foodandagriculture','governmentfacilities','healthcarepublichealth','informationtechnology','criticalmanufacturing','nuclearreactorsmaterials','transportationsystems','wastewatersystems']; 
		
		// Log the current active element
		console.log('Current Active Element:', menuItems[currentIndex - 1]);
	}, 100); // Wait 100ms after scrolling stops
});

function loadSector(index) {
  const arcs = document.querySelectorAll('.arc');
  const contents = document.querySelectorAll('.content');

  // Remove active from all arcs and contents
  arcs.forEach(arc => arc.classList.remove('active'));
  contents.forEach(c => c.classList.remove('active'));

  // Add active to selected content
  if (contents[index - 1]) {
    contents[index - 1].classList.add('active');
    // Optional: Scroll to content
    contents[index - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

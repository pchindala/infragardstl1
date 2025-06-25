// Announcements system - Removed
// This file is intentionally empty 

// Simple Google Sheets Fetcher
class GoogleSheetsFetcher {
    constructor() {
        this.data = [];
    }

    // Robust CSV line parser for quoted fields
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result.map(v => v.trim().replace(/^"|"$/g, ''));
    }

    // Parse CSV data
    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = this.parseCSVLine(lines[0]);
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            const values = this.parseCSVLine(lines[i]);
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }
        return data;
    }

    // Fetch data from Google Sheets
    async fetchFromGoogleSheets(sheetId) {
        try {
            const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
            const response = await fetch(csvUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`);
            }
            const csvText = await response.text();
            this.data = this.parseCSV(csvText);
            return this.data;
        } catch (error) {
            console.error('Error fetching from Google Sheets:', error);
            throw error;
        }
    }

    // Display data in a themed format
    displayData(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }
        // Hide loading state
        const loadingEl = document.getElementById('loading-announcements');
        if (loadingEl) {
            loadingEl.classList.add('hidden');
        }
        if (!this.data || this.data.length === 0) {
            // Show empty state
            const emptyEl = document.getElementById('empty-announcements');
            if (emptyEl) {
                emptyEl.classList.remove('hidden');
            }
            return;
        }
        // Show announcements container
        container.classList.remove('hidden');
        const html = this.data.map((row) => {
            const priorityColor = this.getPriorityColor(row.priority || row.Priority);
            const typeIcon = this.getTypeIcon(row.type || row.Type);
            const formattedDate = this.formatDate(row.date || row.Date);
            return `
  <div class="announcement-card bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
      <div class="flex items-start gap-3 sm:gap-4">
        <div class="text-2xl sm:text-3xl">${typeIcon}</div>
        <div class="flex-1">
          <h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">${row.title || row.Title || 'Untitled Event'}</h4>
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              ${formattedDate}
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              ${row.location || row.Location || 'Location TBD'}
            </span>
          </div>
        </div>
      </div>
      <span class="px-2.5 py-1 text-[10px] sm:text-xs font-semibold rounded-full border ${priorityColor}">
        ${row.priority || row.Priority || 'Normal'}
      </span>
    </div>

    <p class="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">${row.description || row.Description || 'No description available'}</p>

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pt-4 border-t border-gray-100">
      <span class="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
        ${row.type || row.Type || 'General'}
      </span>
      <div class="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-xs text-gray-500">
        <span class="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full"></span>
        <span>Active</span>
      </div>
    </div>
  </div>
`;

        }).join('');
        container.innerHTML = html;
    }

    // Get priority color classes
    getPriorityColor(priority) {
        if (!priority || typeof priority !== 'string') {
            return 'bg-gray-100 text-gray-800 border-gray-200';
        }
        
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    }

    // Get type icon
    getTypeIcon(type) {
        if (!type || typeof type !== 'string') {
            return '📢';
        }
        
        switch (type.toLowerCase()) {
            case 'event':
                return '🎯';
            case 'webinar':
                return '💻';
            case 'workshop':
                return '🔧';
            case 'meeting':
                return '🗓️';
            case 'briefing':
                return '📊';
            case 'training':
                return '🎓';
            default:
                return '📢';
        }
    }

    // Format date
    formatDate(dateString) {
        if (!dateString || typeof dateString !== 'string') {
            return 'Date TBD';
        }
        
        // Handle MM/DD/YYYY format
        if (dateString.includes('/')) {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const month = parseInt(parts[0]) - 1;
                const day = parseInt(parts[1]);
                const year = parseInt(parts[2]);
                const date = new Date(year, month, day);
                
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
            }
        }
        
        // Try standard Date parsing
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        return dateString; // Return original if can't parse
    }
}

let lastAnnouncementsData = null;

// Compare two arrays of objects (shallow)
function isDataDifferent(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return true;
    if (a.length !== b.length) return true;
    for (let i = 0; i < a.length; i++) {
        if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return true;
    }
    return false;
}

// Modified testGoogleSheetsFetch to accept silent mode
async function testGoogleSheetsFetch(silent = false) {
    // User's actual Google Sheets ID
    const sheetId = '1ys-5XaBdf0YitraMw3UZ2ygLVu6p9giUjflVDT_3U7E';
    const fetcher = new GoogleSheetsFetcher();
    
    try {
        // Removed debug logs for production
        const data = await fetcher.fetchFromGoogleSheets(sheetId);
        if (!silent) {
            // No debug logs
        }
        // Only update if data is different, unless not silent (manual refresh)
        if (!silent || isDataDifferent(data, lastAnnouncementsData)) {
            lastAnnouncementsData = data;
            fetcher.displayData('announcements-container');
        } else if (!silent) {
            // No debug logs
        }
        return data;
    } catch (error) {
        if (!silent) {
            console.error('❌ Test failed:', error);
        }
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // console.log('Google Sheets Fetcher initialized');
    testGoogleSheetsFetch(); // Call immediately, no delay

    // Manual refresh button
    const refreshBtn = document.getElementById('refresh-announcements');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // Show loading spinner again
            const loadingEl = document.getElementById('loading-announcements');
            const container = document.getElementById('announcements-container');
            const emptyEl = document.getElementById('empty-announcements');
            if (loadingEl) loadingEl.classList.remove('hidden');
            if (container) container.classList.add('hidden');
            if (emptyEl) emptyEl.classList.add('hidden');
            testGoogleSheetsFetch(false); // Always update DOM on manual refresh
        });
    }

    // Auto-refresh every 10 seconds, but only update if data changes
    setInterval(() => {
        testGoogleSheetsFetch(true); // silent mode: no spinner, no log unless data changes
    }, 10000); // 10 seconds

    // Example usage:
    // const fetcher = new GoogleSheetsFetcher();
    // fetcher.fetchFromGoogleSheets('YOUR_GOOGLE_SHEETS_ID')
    //     .then(data => {
    //         console.log('Data loaded:', data);
    //         fetcher.displayData('your-container-id');
    //     })
    //     .catch(error => {
    //         console.error('Failed to load data:', error);
    //     });
}); 
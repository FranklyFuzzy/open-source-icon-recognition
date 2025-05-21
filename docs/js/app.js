document.addEventListener('DOMContentLoaded', () => {
    // Global variables
    let stirData = null;
    let beirData = null;
    const baseUrl = window.location.pathname.replace('index.html', '');
    
    // DOM elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const platformFilters = document.getElementById('platform-filters');
    const browserFilters = document.getElementById('browser-filters');
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activate selected tab
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Show appropriate filters
            if (tabId === 'stir') {
                platformFilters.style.display = 'flex';
                browserFilters.style.display = 'none';
            } else {
                platformFilters.style.display = 'none';
                browserFilters.style.display = 'flex';
            }
            
            // Refresh the table
            updateTable();
        });
    });
    
    // Load data
    async function loadData() {
        try {
            // Load STIR data
            const stirResponse = await fetch(`${baseUrl}data/stir/stir-database.json`);
            stirData = await stirResponse.json();
            
            // Load BEIR data
            const beirResponse = await fetch(`${baseUrl}data/beir/beir-database.json`);
            beirData = await beirResponse.json();
            
            // Populate tables and category filters
            populateCategoryFilters();
            updateTable();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
    
    // Populate category filters
    function populateCategoryFilters() {
        const categories = new Set();
        
        // Add categories from STIR data
        stirData.icons.forEach(icon => {
            if (icon.category) {
                categories.add(icon.category);
            }
        });
        
        // Add categories from BEIR data
        beirData.icons.forEach(icon => {
            if (icon.category) {
                categories.add(icon.category);
            }
        });
        
        // Sort categories alphabetically
        const sortedCategories = Array.from(categories).sort();
        
        // Add categories to select dropdown
        for (const category of sortedCategories) {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        }
    }
    
    // Update table based on current tab and filters
    function updateTable() {
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        
        if (activeTab === 'stir') {
            updateStirTable(searchTerm, selectedCategory);
        } else {
            updateBeirTable(searchTerm, selectedCategory);
        }
    }
    
    // Update STIR table
    function updateStirTable(searchTerm, selectedCategory) {
        const tableBody = document.querySelector('#stir-table tbody');
        const noResults = document.getElementById('stir-no-results');
        tableBody.innerHTML = '';
        
        // Get selected platforms
        const selectedPlatforms = Array.from(
            document.querySelectorAll('#platform-filters input[type="checkbox"]:checked')
        ).map(checkbox => checkbox.value);
        
        // Filter icons
        const filteredIcons = stirData.icons.filter(icon => {
            // Filter by search term
            const matchesSearch = 
                icon.name.toLowerCase().includes(searchTerm) || 
                (icon.description && icon.description.toLowerCase().includes(searchTerm));
            
            // Filter by category
            const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
            
            // Filter by platform
            const matchesPlatform = selectedPlatforms.some(platform => 
                platform in icon.platforms && icon.platforms[platform]
            );
            
            return matchesSearch && matchesCategory && matchesPlatform;
        });
        
        // Display filtered icons
        if (filteredIcons.length > 0) {
            filteredIcons.forEach(icon => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td><img src="${baseUrl}data/stir/${icon.icon_path}" alt="${icon.name}" class="icon-img"></td>
                    <td>${icon.name}</td>
                    <td>${icon.category}</td>
                    <td class="platform-indicator">
                        ${icon.platforms.windows ? '<i class="fas fa-check supported"></i>' : '<i class="fas fa-minus not-supported"></i>'}
                    </td>
                    <td class="platform-indicator">
                        ${icon.platforms.mac ? '<i class="fas fa-check supported"></i>' : '<i class="fas fa-minus not-supported"></i>'}
                    </td>
                    <td class="platform-indicator">
                        ${icon.platforms.linux ? '<i class="fas fa-check supported"></i>' : '<i class="fas fa-minus not-supported"></i>'}
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
            
            noResults.style.display = 'none';
        } else {
            noResults.style.display = 'block';
        }
    }
    
    // Update BEIR table
    function updateBeirTable(searchTerm, selectedCategory) {
        const tableBody = document.querySelector('#beir-table tbody');
        const noResults = document.getElementById('beir-no-results');
        tableBody.innerHTML = '';
        
        // Get selected browsers
        const selectedBrowsers = Array.from(
            document.querySelectorAll('#browser-filters input[type="checkbox"]:checked')
        ).map(checkbox => checkbox.value);
        
        // Filter icons
        const filteredIcons = beirData.icons.filter(icon => {
            // Filter by search term
            const matchesSearch = 
                icon.name.toLowerCase().includes(searchTerm) || 
                (icon.description && icon.description.toLowerCase().includes(searchTerm));
            
            // Filter by category
            const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory;
            
            // Filter by browser
            const matchesBrowser = selectedBrowsers.some(browser => 
                browser in icon.browsers && icon.browsers[browser]
            );
            
            return matchesSearch && matchesCategory && matchesBrowser;
        });
        
        // Display filtered icons
        if (filteredIcons.length > 0) {
            filteredIcons.forEach(icon => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td><img src="${baseUrl}data/beir/${icon.icon_path}" alt="${icon.name}" class="icon-img"></td>
                    <td>${icon.name}</td>
                    <td>${icon.category}</td>
                    <td class="platform-indicator">
                        ${icon.browsers.chrome ? '<i class="fas fa-check supported"></i>' : '<i class="fas fa-minus not-supported"></i>'}
                    </td>
                    <td class="platform-indicator">
                        ${icon.browsers.firefox ? '<i class="fas fa-check supported"></i>' : '<i class="fas fa-minus not-supported"></i>'}
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
            
            noResults.style.display = 'none';
        } else {
            noResults.style.display = 'block';
        }
    }
    
    // Event listeners for search and filters
    searchInput.addEventListener('input', updateTable);
    categoryFilter.addEventListener('change', updateTable);
    
    // Add event listeners to checkboxes
    document.querySelectorAll('.platform-filters input, .browser-filters input').forEach(checkbox => {
        checkbox.addEventListener('change', updateTable);
    });
    
    // Load data on page load
    loadData();
});
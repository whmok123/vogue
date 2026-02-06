document.addEventListener('DOMContentLoaded', () => {
    // State
    let wardrobe = [
        { id: 1, name: 'White T-Shirt', category: 'Top', size: 'M', color: 'White', material: 'Cotton', season: 'Summer', vibe: 'Casual', image: 'https://via.placeholder.com/300', notes: 'A classic white tee.', wearCount: 10 },
        { id: 2, name: 'Blue Jeans', category: 'Bottom', size: '32', color: 'Blue', material: 'Denim', season: 'All', vibe: 'Casual', image: 'https://via.placeholder.com/300', notes: '', wearCount: 25 },
        { id: 3, name: 'Black Dress', category: 'Dress', size: 'S', color: 'Black', material: 'Silk', season: 'Summer', vibe: 'Chic', image: 'https://via.placeholder.com/300', notes: 'Little black dress.', wearCount: 5 },
        { id: 4, name: 'Leather Jacket', category: 'Outerwear', size: 'M', color: 'Black', material: 'Leather', season: 'Autumn', vibe: 'Edgy', image: 'https://via.placeholder.com/300', notes: '', wearCount: 15 },
        { id: 5, name: 'White Sneakers', category: 'Shoes', size: '9', color: 'White', material: 'Canvas', season: 'All', vibe: 'Casual', image: 'https://via.placeholder.com/300', notes: 'Go-to sneakers.', wearCount: 30 },
        { id: 6, name: 'Gold Necklace', category: 'Accessories', size: '', color: 'Gold', material: 'Metal', season: 'All', vibe: 'Chic', image: 'https://via.placeholder.com/300', notes: '', wearCount: 2 },
    ];
    let isSubscribed = false;

    // Elements
    const wardrobeGrid = document.getElementById('wardrobe-grid');
    const itemForm = document.getElementById('item-form');
    const itemModal = new bootstrap.Modal(document.getElementById('add-item-modal'));
    const itemModalTitle = document.getElementById('item-modal-title');
    const homeLink = document.getElementById('home-link');
    const navLinks = {
        wardrobe: document.getElementById('wardrobe-link'),
        styling: document.getElementById('styling-link'),
        insights: document.getElementById('insights-link'),
        pricing: document.getElementById('pricing-link'),
    };
    const sections = {
        wardrobe: document.getElementById('wardrobe-section'),
        styling: document.getElementById('styling-section'),
        insights: document.getElementById('insights-section'),
        pricing: document.getElementById('pricing-section'),
    };

    // --- Navigation ---
    function showSection(sectionId) {
        Object.values(sections).forEach(section => section.classList.add('d-none'));
        sections[sectionId].classList.remove('d-none');
    }

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('wardrobe');
    });

    navLinks.wardrobe.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('wardrobe');
    });

    navLinks.styling.addEventListener('click', (e) => {
        e.preventDefault();
        if (isSubscribed) {
            showSection('styling');
        } else {
            showSection('pricing');
        }
    });

    navLinks.insights.addEventListener('click', (e) => {
        e.preventDefault();
        if (isSubscribed) {
            showSection('insights');
            renderInsights();
        } else {
            showSection('pricing');
        }
    });

    navLinks.pricing.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('pricing');
    });

    // --- Wardrobe ---
    function renderWardrobe(items = wardrobe) {
        wardrobeGrid.innerHTML = '';
        if (items.length === 0) {
            wardrobeGrid.innerHTML = '<p class="text-center">Your wardrobe is empty. Add some items!</p>';
            return;
        }
        items.forEach(item => {
            const itemCard = `
                <div class="col" data-id="${item.id}">
                    <div class="card h-100">
                        <img src="${item.image}" class="card-img-top" alt="${item.name}">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text text-muted">${item.category}</p>
                        </div>
                        <div class="card-footer bg-transparent border-top-0">
                             <button class="btn btn-sm btn-outline-dark edit-btn">Edit</button>
                             <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            wardrobeGrid.innerHTML += itemCard;
        });
    }

    function populateFilterOptions() {
        const colors = [...new Set(wardrobe.map(item => item.color))];
        const colorFilter = document.getElementById('color-filter');
        colors.forEach(color => {
            const option = new Option(color, color);
            colorFilter.add(option);
        });
    }

    document.getElementById('search-input').addEventListener('input', handleFiltering);
    document.getElementById('category-filter').addEventListener('change', handleFiltering);
    document.getElementById('color-filter').addEventListener('change', handleFiltering);
    document.getElementById('season-filter').addEventListener('change', handleFiltering);
    document.getElementById('vibe-filter').addEventListener('change', handleFiltering);

    function handleFiltering() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const category = document.getElementById('category-filter').value;
        const color = document.getElementById('color-filter').value;
        const season = document.getElementById('season-filter').value;
        const vibe = document.getElementById('vibe-filter').value;

        const filteredItems = wardrobe.filter(item => {
            return (searchTerm === '' || item.name.toLowerCase().includes(searchTerm)) &&
                   (category === '' || item.category === category) &&
                   (color === '' || item.color === color) &&
                   (season === '' || item.season === season) &&
                   (vibe === '' || item.vibe === vibe);
        });
        renderWardrobe(filteredItems);
    }
    
    // --- Item CRUD ---
    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('item-id').value;
        const newItem = {
            id: id ? parseInt(id) : Date.now(),
            name: document.getElementById('item-name').value,
            category: document.getElementById('item-category').value,
            size: document.getElementById('item-size').value,
            color: document.getElementById('item-color').value,
            material: document.getElementById('item-material').value,
            season: document.getElementById('item-season').value,
            vibe: document.getElementById('item-vibe').value,
            image: 'https://via.placeholder.com/300', // Mock image
            notes: document.getElementById('item-notes').value,
            wearCount: id ? wardrobe.find(item => item.id === parseInt(id)).wearCount : 0,
        };

        if (id) {
            wardrobe = wardrobe.map(item => item.id === newItem.id ? newItem : item);
        } else {
            wardrobe.push(newItem);
        }
        
        renderWardrobe();
        populateFilterOptions();
        itemModal.hide();
        itemForm.reset();
    });

    wardrobeGrid.addEventListener('click', (e) => {
        const id = e.target.closest('.col').dataset.id;
        if (e.target.classList.contains('edit-btn')) {
            const item = wardrobe.find(i => i.id === parseInt(id));
            itemModalTitle.textContent = 'Edit Item';
            document.getElementById('item-id').value = item.id;
            document.getElementById('item-name').value = item.name;
            document.getElementById('item-category').value = item.category;
            document.getElementById('item-size').value = item.size;
            document.getElementById('item-color').value = item.color;
            document.getElementById('item-material').value = item.material;
            document.getElementById('item-season').value = item.season;
            document.getElementById('item-vibe').value = item.vibe;
            document.getElementById('item-notes').value = item.notes;
            itemModal.show();
        }

        if (e.target.classList.contains('delete-btn')) {
             if (confirm('Are you sure you want to delete this item?')) {
                wardrobe = wardrobe.filter(i => i.id !== parseInt(id));
                renderWardrobe();
                populateFilterOptions();
            }
        }
    });
    
    document.getElementById('add-item-modal').addEventListener('hidden.bs.modal', () => {
        itemForm.reset();
        itemModalTitle.textContent = 'Add Item';
        document.getElementById('item-id').value = '';
    });

    // --- Styling ---
    function generateOutfit(categories) {
        let outfit = [];
        let explanation = [];

        categories.forEach(cat => {
            const items = wardrobe.filter(item => item.category === cat);
            if (items.length > 0) {
                const chosenItem = items[Math.floor(Math.random() * items.length)];
                outfit.push(chosenItem);
            }
        });

        if (outfit.length < 2) return null;

        // Mock AI explanation
        if (outfit[0].vibe === outfit[1].vibe) {
            explanation.push(`A cohesive look with a ${outfit[0].vibe.toLowerCase()} vibe.`);
        } else {
            explanation.push(`Balancing a ${outfit[0].vibe.toLowerCase()} piece with a ${outfit[1].vibe.toLowerCase()} one creates an interesting contrast.`);
        }

        return { outfit, explanation: explanation.join(' ') };
    }

    function displayOutfit(outfitData, container) {
        if (!outfitData) {
            container.innerHTML = '<p class="text-muted">Not enough items in your wardrobe to generate an outfit.</p>';
            return;
        }
        const { outfit, explanation } = outfitData;
        let outfitHtml = '<div class="row g-4 justify-content-center">';
        outfit.forEach(item => {
            outfitHtml += `
                <div class="col-md-3">
                    <div class="card">
                        <img src="${item.image}" class="card-img-top" alt="${item.name}">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                        </div>
                    </div>
                </div>
            `;
        });
        outfitHtml += '</div>';
        outfitHtml += `<p class="mt-4 fst-italic">"${explanation}"</p>`;
        container.innerHTML = outfitHtml;
    }

    document.getElementById('generate-daily-style').addEventListener('click', () => {
        const outfitData = generateOutfit(['Top', 'Bottom', 'Shoes']);
        displayOutfit(outfitData, document.getElementById('daily-style-output'));
    });

    document.getElementById('generate-event-style').addEventListener('click', () => {
        const outfitData = generateOutfit(['Dress', 'Shoes', 'Accessories']);
        displayOutfit(outfitData, document.getElementById('event-style-output'));
    });
    
    document.getElementById('generate-mimic-look').addEventListener('click', () => {
        // This is a mock, so we just generate any outfit
        const outfitData = generateOutfit(['Top', 'Bottom', 'Outerwear']);
        displayOutfit(outfitData, document.getElementById('mimic-look-output'));
    });

    // --- Insights ---
    function renderInsights() {
        // Underused items
        const underusedList = document.getElementById('underused-items-list');
        underusedList.innerHTML = '';
        const underused = wardrobe.sort((a, b) => a.wearCount - b.wearCount).slice(0, 3);
        underused.forEach(item => {
            underusedList.innerHTML += `<li class="list-group-item">${item.name} (${item.wearCount} wears)</li>`;
        });

        // Frequently worn items
        const frequentList = document.getElementById('frequently-worn-items-list');
        frequentList.innerHTML = '';
        const frequent = wardrobe.sort((a, b) => b.wearCount - a.wearCount).slice(0, 3);
        frequent.forEach(item => {
            frequentList.innerHTML += `<li class="list-group-item">${item.name} (${item.wearCount} wears)</li>`;
        });

        // Outfit gaps
        const gapsList = document.getElementById('outfit-gaps-list');
        gapsList.innerHTML = '';
        const hasBasicTop = wardrobe.some(item => item.vibe === 'Casual' && item.category === 'Top');
        if (!hasBasicTop) {
            gapsList.innerHTML += '<li class="list-group-item">A versatile casual top could be a great addition.</li>';
        }
         const hasJeans = wardrobe.some(item => item.category === 'Bottom' && item.material === 'Denim');
        if (!hasJeans) {
            gapsList.innerHTML += '<li class="list-group-item">A classic pair of jeans is a wardrobe staple.</li>';
        }
    }

    // --- Pricing ---
    document.getElementById('upgrade-button').addEventListener('click', () => {
        isSubscribed = true;
        alert('Subscription activated! You now have access to Styling and Insights.');
        showSection('styling');
    });

    // --- Initial Render ---
    renderWardrobe();
    populateFilterOptions();
});
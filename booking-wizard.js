// ========================================
// Booking Wizard 2-Step Logic
// ========================================
const bookingSection = document.getElementById('booking');
if (bookingSection) {
    let currentStep = 1;
    let selectedDate = null;
    let selectedTime = null;
    let orderItems = [];
    
    // UI Elements
    const panels = [
        document.getElementById('bookingStep1'),
        document.getElementById('bookingStep2')
    ];
    const indicators = document.querySelectorAll('.booking__step-indicator');
    
    // Step 1
    const calendarGrid = document.getElementById('calendarGrid');
    const calendarMonthTitle = document.getElementById('calendarMonthTitle');
    const calendarPrev = document.getElementById('calendarPrev');
    const calendarNext = document.getElementById('calendarNext');
    const timeChips = document.querySelectorAll('.booking__time-chip');
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    const equipGrid = document.getElementById('equipGrid');
    const cartSummary = document.getElementById('cartSummary');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const btnToStep2 = document.getElementById('btnToStep2');
    
    // Step 2
    const btnBackToStep1 = document.getElementById('btnBackToStep1');
    const orderTableBody = document.getElementById('orderTableBody');
    const orderTotalPrice = document.getElementById('orderTotalPrice');
    const bookingForm = document.getElementById('bookingForm');
    const hiddenDate = document.getElementById('bookingDate');
    const hiddenTime = document.getElementById('bookingTime');
    const hiddenItems = document.getElementById('bookingItems');
    
    // ==================
    // 1. Navigation
    // ==================
    function goToStep(step) {
        panels.forEach((p, idx) => {
            if(p) p.classList.toggle('booking__panel--active', idx + 1 === step);
        });
        
        indicators.forEach((ind, idx) => {
            ind.classList.toggle('booking__step-indicator--active', idx + 1 === step);
        });
        
        currentStep = step;
        
        if (step === 2) {
            buildOrderTable();
        }
    }
    
    if (btnToStep2) btnToStep2.addEventListener('click', () => {
        if (!selectedDate || !selectedTime) {
            alert('Пожалуйста, выберите дату и время начала аренды.');
            return;
        }
        if (orderItems.length === 0) {
            alert('Пожалуйста, выберите хотя бы одно оборудование.');
            return;
        }
        goToStep(2);
    });
    
    if (btnBackToStep1) btnBackToStep1.addEventListener('click', () => goToStep(1));
    
    // ==================
    // 2. Calendar Logic
    // ==================
    let currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    let viewMonth = currentDate.getMonth();
    let viewYear = currentDate.getFullYear();
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    function renderCalendar() {
        if(!calendarGrid) return;
        
        // Clear old days (keep weekdays)
        const weekdaysHTML = `
            <span class="booking__calendar-weekday">Пн</span>
            <span class="booking__calendar-weekday">Вт</span>
            <span class="booking__calendar-weekday">Ср</span>
            <span class="booking__calendar-weekday">Чт</span>
            <span class="booking__calendar-weekday">Пт</span>
            <span class="booking__calendar-weekday">Сб</span>
            <span class="booking__calendar-weekday">Вс</span>
        `;
        calendarGrid.innerHTML = weekdaysHTML;
        
        calendarMonthTitle.textContent = `${monthNames[viewMonth]} ${viewYear}`;
        
        const firstDay = new Date(viewYear, viewMonth, 1);
        const lastDay = new Date(viewYear, viewMonth + 1, 0);
        let startGridDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
        
        const today = new Date();
        today.setHours(0,0,0,0);
        
        // Empty slots
        for(let i=0; i<startGridDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'booking__calendar-day booking__calendar-day--empty';
            calendarGrid.appendChild(empty);
        }
        
        for(let i=1; i<=lastDay.getDate(); i++) {
            const dayBtn = document.createElement('button');
            dayBtn.className = 'booking__calendar-day';
            dayBtn.textContent = i;
            dayBtn.type = 'button';
            
            const iterDate = new Date(viewYear, viewMonth, i);
            
            if(iterDate < today) {
                dayBtn.classList.add('booking__calendar-day--disabled');
            } else {
                if (selectedDate && iterDate.getTime() === selectedDate.getTime()) {
                    dayBtn.classList.add('booking__calendar-day--active');
                }
                
                dayBtn.addEventListener('click', () => {
                    selectedDate = new Date(viewYear, viewMonth, i);
                    if(selectedDateDisplay) {
                        const dd = String(selectedDate.getDate()).padStart(2, '0');
                        const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
                        selectedDateDisplay.innerHTML = `Дата: <strong>${dd}.${mm}.${selectedDate.getFullYear()}</strong>`;
                    }
                    renderCalendar();
                    validateStep1();
                });
            }
            
            calendarGrid.appendChild(dayBtn);
        }
    }
    
    if (calendarPrev) calendarPrev.addEventListener('click', () => {
        viewMonth--;
        if(viewMonth < 0) { viewMonth = 11; viewYear--; }
        renderCalendar();
    });
    
    if (calendarNext) calendarNext.addEventListener('click', () => {
        viewMonth++;
        if(viewMonth > 11) { viewMonth = 0; viewYear++; }
        renderCalendar();
    });
    
    renderCalendar();
    
    // ==================
    // 3. Time Selection
    // ==================
    timeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            timeChips.forEach(c => c.classList.remove('booking__time-chip--active'));
            chip.classList.add('booking__time-chip--active');
            selectedTime = chip.dataset.time;
            validateStep1();
        });
    });
    
    // ==================
    // 4. Equipment Logic
    // ==================
    function extractNumber(str) { return parseInt(str.replace(/\D/g, ''), 10); }

    function updateCartTotal() {
        let total = 0;
        orderItems = [];
        
        const cards = document.querySelectorAll('.booking__equip-card');
        cards.forEach(card => {
            const qty = parseInt(card.querySelector('.booking__qty-value').textContent, 10);
            if (qty > 0) {
                card.classList.add('booking__equip-card--active');
                const subtotalText = card.querySelector('.booking__equip-subtotal strong').textContent;
                const subT = extractNumber(subtotalText);
                total += subT;
                
                const name = card.querySelector('.booking__equip-name').textContent;
                const durationSelect = card.querySelector('.booking__duration-select');
                const pHour = parseInt(card.dataset.priceHour, 10);
                const pDay = parseInt(card.dataset.priceDay, 10);
                let durText = durationSelect.options[durationSelect.selectedIndex].text;
                
                orderItems.push({
                    id: card.dataset.equipId,
                    name: name,
                    qty: qty,
                    duration: durText,
                    priceHour: pHour,
                    priceDay: pDay,
                    subtotal: subT
                });
            } else {
                card.classList.remove('booking__equip-card--active');
            }
        });
        
        if (total > 0) {
            if (cartSummary) cartSummary.style.display = 'block';
            if (cartTotalPrice) cartTotalPrice.textContent = total.toLocaleString('ru-RU') + ' ₽';
        } else {
            if (cartSummary) cartSummary.style.display = 'none';
        }
        
        const btnClearCart = document.getElementById('btnClearCart');
        if (btnClearCart) btnClearCart.style.display = total > 0 ? 'inline-flex' : 'none';
        
        validateStep1();
    }
    
    function validateStep1() {
        if(btnToStep2) {
            btnToStep2.disabled = !(selectedDate && selectedTime && orderItems.length > 0);
        }
    }
    
    function updateCardSubtotal(card) {
        const qty = parseInt(card.querySelector('.booking__qty-value').textContent, 10);
        const durationSelect = card.querySelector('.booking__duration-select');
        const durVal = durationSelect.value;
        const pHour = parseInt(card.dataset.priceHour, 10);
        const pDay = parseInt(card.dataset.priceDay, 10);
        const subtotalEl = card.querySelector('.booking__equip-subtotal strong');
        
        let subtotal = 0;
        if (durVal === 'day') subtotal = qty * pDay;
        else if (durVal === 'custom') subtotal = qty * pDay; // simplify custom
        else subtotal = qty * pHour * parseInt(durVal, 10);
        
        subtotalEl.textContent = subtotal.toLocaleString('ru-RU') + ' ₽';
        updateCartTotal();
    }
    
    // Bind Qty Buttons
    document.querySelectorAll('.booking__qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.booking__equip-card');
            const qtySpan = card.querySelector('.booking__qty-value');
            let val = parseInt(qtySpan.textContent, 10);
            if (e.target.dataset.action === 'plus') val++;
            else if (e.target.dataset.action === 'minus') val--;
            
            if (val < 0) val = 0;
            if (val > 10) val = 10;
            qtySpan.textContent = val;
            
            updateCardSubtotal(card);
        });
    });
    
    // Bind Duration Selects
    document.querySelectorAll('.booking__duration-select').forEach(sel => {
        sel.addEventListener('change', (e) => {
            const card = e.target.closest('.booking__equip-card');
            const customDate = card.querySelector('.booking__custom-duration');
            if (sel.value === 'custom' && customDate) {
                customDate.style.display = 'block';
            } else if (customDate) {
                customDate.style.display = 'none';
            }
            updateCardSubtotal(card);
        });
    });
    
    // Clear Cart
    const btnClearCart = document.getElementById('btnClearCart');
    if (btnClearCart) {
        btnClearCart.addEventListener('click', () => {
            document.querySelectorAll('.booking__qty-value').forEach(q => q.textContent = '0');
            document.querySelectorAll('.booking__equip-card').forEach(c => updateCardSubtotal(c));
        });
    }

    // ========================================
    // Equipment Cart Controls (Search, Categories)
    // ========================================
    const equipSearch = document.getElementById('equipSearch');
    const equipCategories = document.getElementById('equipCategories');
    let currentCategory = 'all';
    let currentSearch = '';

    function filterEquipment() {
        if (!equipGrid) return;
        const cards = equipGrid.querySelectorAll('.booking__equip-card');
        
        cards.forEach(card => {
            const name = card.querySelector('.booking__equip-name').textContent.toLowerCase();
            const category = card.dataset.category || 'all';
            
            const matchSearch = name.includes(currentSearch);
            const matchCategory = currentCategory === 'all' || category === currentCategory;
            
            if (matchSearch && matchCategory) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (equipSearch) {
        equipSearch.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            filterEquipment();
        });
    }

    if (equipCategories) {
        equipCategories.addEventListener('click', (e) => {
            if (e.target.classList.contains('booking__cat-btn')) {
                equipCategories.querySelectorAll('.booking__cat-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentCategory = e.target.dataset.filter;
                filterEquipment();
            }
        });
    }
    
    // ==================
    // 5. Checkout Table
    // ==================
    function buildOrderTable() {
        if(!orderTableBody) return;
        orderTableBody.innerHTML = '';
        let grandTotal = 0;
        
        orderItems.forEach(item => {
            grandTotal += item.subtotal;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${item.qty} шт</td>
                <td>${item.duration}</td>
                <td style="font-weight:700;">${item.subtotal.toLocaleString('ru-RU')} ₽</td>
            `;
            orderTableBody.appendChild(tr);
        });
        
        if (orderTotalPrice) {
            orderTotalPrice.textContent = grandTotal.toLocaleString('ru-RU') + ' ₽';
        }
    }
    
    // Form Submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Generate exact date format DD.MM.YYYY
            const dd = String(selectedDate.getDate()).padStart(2, '0');
            const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const yyyy = selectedDate.getFullYear();
            
            hiddenDate.value = `${dd}.${mm}.${yyyy}`;
            hiddenTime.value = selectedTime;
            hiddenItems.value = JSON.stringify(orderItems);
            
            bookingForm.submit();
        });
    }
}

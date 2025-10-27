// Глобальні змінні
let candles = [];
let candleCount = 0;
let selectedCandleType = 'prayer';
// Типи свічок для церковного дизайну
const candleTypes = [
    {
        id: 'prayer',
        name: 'Молитвенна',
        flameColor: '#FFD700',
        innerFlameColor: '#FFFF00',
        bodyColor: 'linear-gradient(45deg, #f0f0f0, #e0e0e0, #f0f0f0)'
    },
    {
        id: 'thanks',
        name: 'Подячна',
        flameColor: '#32CD32',
        innerFlameColor: '#90EE90',
        bodyColor: 'linear-gradient(45deg, #98FB98, #90EE90, #98FB98)'
    },
    {
        id: 'memory',
        name: 'Пам`яті',
        flameColor: '#87CEEB',
        innerFlameColor: '#B0E0E6',
        bodyColor: 'linear-gradient(45deg, #F0F8FF, #E6E6FA, #F0F8FF)'
    },
    {
        id: 'health',
        name: 'Здоров`я',
        flameColor: '#FF69B4',
        innerFlameColor: '#FFB6C1',
        bodyColor: 'linear-gradient(45deg, #FFE4E1, #FFDAB9, #FFE4E1)'
    },
    {
        id: 'hope',
        name: 'Надії',
        flameColor: '#9370DB',
        innerFlameColor: '#DDA0DD',
        bodyColor: 'linear-gradient(45deg, #E6E6FA, #D8BFD8, #E6E6FA)'
    },
    {
        id: 'peace',
        name: 'Миру',
        flameColor: '#00BFFF',
        innerFlameColor: '#87CEFA',
        bodyColor: 'linear-gradient(45deg, #F0FFFF, #E0FFFF, #F0FFFF)'
    }
];
// Елементи DOM
const candlesContainer = document.getElementById('candlesContainer');
const candleTypesContainer = document.getElementById('candleTypes');
const addCandleBtn = document.getElementById('addCandleBtn');
const resetBtn = document.getElementById('resetBtn');
const candleCountElement = document.getElementById('candleCount');
const userNameInput = document.getElementById('userName');
const candleMessageInput = document.getElementById('candleMessage');

// Завантаження даних з localStorage при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    loadCandlesFromStorage();
    updateCandleCount();
    renderCandleTypes();
    renderCandles();
});
// Відображення типів свічок для вибору
function renderCandleTypes() {
    candleTypesContainer.innerHTML = '';
    
    candleTypes.forEach(type => {
        const typeElement = document.createElement('div');
        typeElement.className = `candle-type ${type.id === selectedCandleType ? 'active' : ''}`;
        typeElement.setAttribute('data-type', type.id);
        
        typeElement.innerHTML = `
            <div class="candle-preview">
                <div class="candle-flame-preview" style="
                    background: ${type.flameColor};
                    box-shadow: 0 0 15px 5px ${type.flameColor}80;
                "></div>
                <div class="candle-body-preview"></div>
            </div>
            <div class="candle-name">${type.name}</div>
        `;
        
        // Додаємо внутрішнє полум'я
        const flameElement = typeElement.querySelector('.candle-flame-preview');
        const innerFlame = document.createElement('div');
        innerFlame.style.cssText = `
            content: '';
            position: absolute;
            top: -3px;
            left: 1px;
            width: 14px;
            height: 17px;
            background: ${type.innerFlameColor};
            border-radius: 50% 50% 20% 20%;
            animation: church-flicker-inner 1s infinite alternate;
        `;
        flameElement.appendChild(innerFlame);
        
        typeElement.addEventListener('click', () => {
            selectedCandleType = type.id;
            document.querySelectorAll('.candle-type').forEach(el => {
                el.classList.remove('active');
            });
            typeElement.classList.add('active');
        });
        
        candleTypesContainer.appendChild(typeElement);
    });
}

// Додавання нової свічки
function addCandle() {
    const userName = userNameInput.value.trim();
    const message = candleMessageInput.value.trim();
    if (!message) {
        alert('Будь ласка, напишіть вашу молитву чи прохання');
        return;
    }
    const candleType = candleTypes.find(type => type.id === selectedCandleType);
    
    const candle = {
        id: Date.now(),
        type: selectedCandleType,
        userName: userName,
        message: message,
        createdAt: new Date()
    };
    
    candles.push(candle);
    saveCandlesToStorage();
    updateCandleCount();
    renderCandles();
    
    // Очищення форми
    userNameInput.value = '';
    candleMessageInput.value = '';
    
    // Анімація появи нової свічки
    const newCandleElement = document.querySelector(`[data-id="${candle.id}"]`);
    if (newCandleElement) {
        newCandleElement.style.opacity = '0';
        newCandleElement.style.transform = 'scale(0.5)';
        
        setTimeout(() => {
            newCandleElement.style.transition = 'opacity 0.5s, transform 0.5s';
            newCandleElement.style.opacity = '1';
            newCandleElement.style.transform = 'scale(1)';
        }, 10);
    }
    
    // Додаємо вібрацію (якщо підтримується)
    if (navigator.vibrate) {
        navigator.vibrate(100);
    }
}
// Видалення всіх свічок
resetBtn.addEventListener('click', () => {
    if (confirm('Ви впевнені, що хочете видалити всі свічки?')) {
        candles = [];
        saveCandlesToStorage();
        updateCandleCount();
        renderCandles();
    }
});
// Віображення всіх свічок
function renderCandles() {
    candlesContainer.innerHTML = '';
    
    candles.forEach(candle => {
        const candleElement = createCandleElement(candle);
        candlesContainer.appendChild(candleElement);
    });
}
// Створення елементу свічки
function createCandleElement(candle) {
    const candleType = candleTypes.find(type => type.id === candle.type) || candleTypes[0];
    
    const candleDiv = document.createElement('div');
    candleDiv.className = 'candle';
    candleDiv.setAttribute('data-id', candle.id);
    
    // Додавання можливості видалення свічки при кліку
    candleDiv.addEventListener('click', () => {
        if (confirm('Видалити цю свічку?')) {
            removeCandle(candle.id);
        }
    });
    
    // Формування інформації для підказки
    let infoHTML = '';
    if (candle.userName || candle.message) {
        infoHTML = `
            <div class="candle-info">
                ${candle.userName ? `<div class="name">${candle.userName}</div>` : ''}
                ${candle.message ? `<div class="message">${candle.message}</div>` : ''}
            </div>
        `;
    }
    
    candleDiv.innerHTML = `
        <div class="candle-flame" style="
            background: ${candleType.flameColor};
            box-shadow: 0 0 10px 5px ${candleType.flameColor}80;
        "></div>
        <div class="candle-body"></div>
        ${infoHTML}
    `;
    
    // Додаємо внутрішнє полум'я
    const flameElement = candleDiv.querySelector('.candle-flame');
    const innerFlame = document.createElement('div');
    innerFlame.style.cssText = `
        content: '';
        position: absolute;
        top: -3px;
        left: 1px;
        width: 8px;
        height: 10px;
        background: ${candleType.innerFlameColor};
        border-radius: 50% 50% 20% 20%;
        animation: church-flicker-inner 1s infinite alternate;
    `;
    flameElement.appendChild(innerFlame);
    
    return candleDiv;
}
// Видалення конкретної свічки
function removeCandle(id) {
    candles = candles.filter(candle => candle.id !== id);
    saveCandlesToStorage();
    updateCandleCount();
    renderCandles();
}
// Оновлення лічильника свічок
function updateCandleCount() {
    candleCount = candles.length;
    candleCountElement.textContent = candleCount;
}
// Збереження свічок у localStorage
function saveCandlesToStorage() {
    localStorage.setItem('onlineCandles', JSON.stringify(candles));
}
// Завантаження свічок з localStorage
function loadCandlesFromStorage() {
    const storedCandles = localStorage.getItem('onlineCandles');
    if (storedCandles) {
        candles = JSON.parse(storedCandles);
    }
}
// Обробка кнопки додавання свічки
addCandleBtn.addEventListener('click', addCandle);
// Додавання випадкових ефектів для більш реалістичного вигляду
function addRandomEffects() {
    const flames = document.querySelectorAll('.candle-flame');
    
    flames.forEach(flame => {
        // Випадкова затримка анімації для різних свічок
        const randomDelay = Math.random() * 2;
        flame.style.animationDelay = `${randomDelay}s`;
    });
}
// Виклик функції для додавання випадкових ефектів при кожному рендері
const originalRenderCandles = renderCandles;
renderCandles = function() {
    originalRenderCandles();
    setTimeout(addRandomEffects, 100);
};
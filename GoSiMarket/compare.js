let compareItems = JSON.parse(localStorage.getItem('compare') || '[]');

function saveCompare() {
    localStorage.setItem('compare', JSON.stringify(compareItems));
}

function addToCompare(product) {
    if (compareItems.length >= 4) {
        showToast('Можно сравнить не более 4 товаров', 'warning');
        return false;
    }
    if (!compareItems.some(item => item.id === product.id)) {
        compareItems.push(product);
        saveCompare();
        updateCompareCount();
        return true;
    }
    return false;
}

function removeFromCompare(productId) {
    compareItems = compareItems.filter(item => item.id !== productId);
    saveCompare();
    updateCompareCount();
}

function clearCompare() {
    compareItems = [];
    saveCompare();
    updateCompareCount();
}

function updateCompareCount() {
    document.getElementById('compareCount').textContent = compareItems.length;
}

updateCompareCount();
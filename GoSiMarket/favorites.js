let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function addToFavorites(product) {
    if (!favorites.some(item => item.id === product.id)) {
        favorites.push(product);
        saveFavorites();
        updateFavoritesCount();
        return true;
    }
    return false;
}

function removeFromFavorites(productId) {
    favorites = favorites.filter(item => item.id !== productId);
    saveFavorites();
    updateFavoritesCount();
}

function toggleFavorite(product) {
    const index = favorites.findIndex(item => item.id === product.id);
    if (index === -1) {
        favorites.push(product);
    } else {
        favorites.splice(index, 1);
    }
    saveFavorites();
    updateFavoritesCount();
}

function isFavorite(productId) {
    return favorites.some(item => item.id === productId);
}

function updateFavoritesCount() {
    document.getElementById('favoritesCount').textContent = favorites.length;
}

updateFavoritesCount();
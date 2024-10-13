// Script para generar pétalos en el fondo
const petalCount = 30; // Aumentamos el número de pétalos
const petalsContainer = document.getElementById('petals-container');

for (let i = 0; i < petalCount; i++) {
    let petal = document.createElement('div');
    petal.classList.add('petal');
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${5 + Math.random() * 5}s`;
    petal.style.animationDelay = `${Math.random() * 5}s`;
    petalsContainer.appendChild(petal);
}

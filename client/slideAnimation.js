let rootStyle = getComputedStyle(document.documentElement);

let duration = rootStyle.getPropertyValue('--exampleCardAnimationDuration').trim();
let exCardHeight = rootStyle.getPropertyValue('--cardLineHeight');

let exampleColumn = document.querySelector('.examplesColumn');
let exCardLines = document.querySelectorAll('.exampleCardLine');

let count = exampleColumn.children.length;

duration = parseFloat(duration);
exCardHeight = parseFloat(exCardHeight);


let styleElement = document.createElement('style');
let startPosition = (count * exCardHeight) - 36;
styleElement.textContent = `
    @keyframes scrollAnimation {
        from { top: ${startPosition}%; }
        to { top: ${-exCardHeight}%; }
    }
`

document.head.appendChild(styleElement);


exCardLines.forEach((exCardLine, index) => {
    let delay = duration * (index / count);
    exCardLine.style.animationDelay = `${-delay}s`;
});

  export function run_transformCardsAnimation() {



    let visibleCardLines = [];

    let previousCardLines = [];
    let nextCardLines = [];

    let previousCards = [];
    let nextCards = [];

    function checkVisibleCardLines(){
    const container = document.querySelector('.examplesColumn');

    const cardLines = document.querySelectorAll('.cardLine');

    cardLines.forEach(cardLine => {
    const containerRect = container.getBoundingClientRect();
    const rect = cardLine.getBoundingClientRect();

    const isVisible = (
        rect.bottom >= containerRect.top &&   // Bottom edge within container
        rect.top <= containerRect.bottom     // Top edge within container
        );
        
    if (isVisible) {
        visibleCardLines.push(cardLine);
    }


    });

    }

    const cards = document.querySelectorAll('.responseCard');
    cards.forEach(card => {
    let previousCard = null, nextCard = null;
    let hasPrevious = false, hasNext = false;

    card.addEventListener('mouseover', () => {
    previousCards = [];
    nextCards = [];

    let previousCard = card.previousElementSibling;
    while (previousCard) { 
        previousCards.push(previousCard);
        previousCard = previousCard.previousElementSibling;
    }

    if (previousCards.length > 0) {
        hasPrevious = true;
    } else {
        hasPrevious = false;
    }

    let nextCard = card.nextElementSibling;
    while (nextCard) { 
        nextCards.push(nextCard);
        nextCard = nextCard.nextElementSibling;
    }

    if (nextCards.length > 0) {
        hasNext = true;
    } else {
        hasNext = false;
    }


    if (!hasPrevious && !hasNext){
        //card.style.width = 'calc(100% - 10%)';
    }else if(hasPrevious && hasNext){ 

        previousCards.forEach(previousCard => {
        
        previousCard.style.scale = '0.75 1';
        previousCard.style.transform = 'translateX(-15%)';
        });

        card.style.scale = '1.5 1';
        
        nextCards.forEach(nextCard => {
        
        nextCard.style.scale = '0.75  1';
        nextCard.style.transform = 'translateX(15%)';
        })
        
    }else if (!hasPrevious && hasNext){
        card.style.scale = '1.5 1';
        card.style.transform = 'translateX(17%)';
        
        const count = nextCards.length;
        
        const scaleFactor = (count > 1 ? 1.5 / count : 0.5); 

        nextCards.forEach((nextCard, index) => {
        const translateFactor = 50 - (index) * 32.5; 
        
        nextCard.style.scale = `${scaleFactor} 1`;
        nextCard.style.transform = `translateX(${translateFactor}%)`;

        });


    }else if (hasPrevious && !hasNext){
        const count = previousCards.length;
        const scaleFactor = (count > 1 ? 1.5 / count : 0.5);  
        
        previousCards.forEach((previousCard, index) => {
        const translateFactor = 50 - (index) * 32.5; 
        
        previousCard.style.scale = `${scaleFactor} 1`;
        previousCard.style.transform = `translateX(-${translateFactor}%)`;
        });

        card.style.scale = '1.5 1';
        card.style.transform = 'translateX(-17%)';
    }

    });

    card.addEventListener('mouseout', () => {

    previousCards.forEach(previousCard => {
        
        previousCard.style.scale = '1 1';
        previousCard.style.transform = 'translateX(0%)';
    });

    nextCards.forEach(nextCard => {
        
        nextCard.style.scale = '1 1';
        nextCard.style.transform = 'translateX(0%)';
    });


    card.style.transform = 'translateX(0%)';
    card.style.scale = '1 1';

    previousCards = [];
    nextCards = [];
    })
    });

    const cardLines = document.querySelectorAll('.cardLine');

    cardLines.forEach(cardLine => {
    cardLine.addEventListener('mouseover', () => {
    visibleCardLines = [];
    previousCardLines = [];
    nextCardLines = [];

    checkVisibleCardLines();

    const cardRect = cardLine.getBoundingClientRect();

    visibleCardLines.forEach(otherCardLine => {
        if (otherCardLine !== cardLine) {
        const otherRect = otherCardLine.getBoundingClientRect();
        
        if (otherRect.top === cardRect.top) { // Same row
                if (otherRect.left < cardRect.left) {
                    previousCardLines.push(otherCardLine);
                } else {
                    nextCardLines.push(otherCardLine);
                }
                } else if (otherRect.top < cardRect.top) { // Above
                previousCardLines.push(otherCardLine);
                } else { // Below
                nextCardLines.push(otherCardLine);
                }
        }
    });

    previousCardLines.forEach(previousCardLine => {
        previousCardLine.style.transform = 'translateY(-25px)';
    });

    nextCardLines.forEach(nextCardLine => {
        nextCardLine.style.transform = 'translateY(+25px)';
    });

    cardLine.style.height = 'calc(var(--cardLineHeight) + 50px)';
    cardLine.style.transform = 'translateY(-25px)';

    });

    cardLine.addEventListener('mouseout', () => {

    for (let i = 0; i < visibleCardLines.length; i++){
        if (visibleCardLines[i] === cardLine){
        previousCardLines = visibleCardLines.slice(0, i);
        nextCardLines = visibleCardLines.slice(i + 1);
        break;
        }
    }

    previousCardLines.forEach(previousCardLine => {
        previousCardLine.style.transform = 'translateY(0)';
    });

    nextCardLines.forEach(nextCardLine => {
        nextCardLine.style.transform = 'translateY(0)';
    });

    cardLine.style.height = 'calc(var(--cardLineHeight))';
    cardLine.style.transform = 'translateY(0)';



    visibleCardLines = [];
    previousCardLines = [];
    nextCardLines = [];
    });


    });

}
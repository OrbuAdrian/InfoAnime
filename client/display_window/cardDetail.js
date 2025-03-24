export function create_cardDetail(cardType, cardData) {

    let cardDetail = document.createElement("div");

    cardDetail.className = "cardDetail";
    cardDetail.innerHTML = ``;

    let card_CoverImage = document.createElement("div");
    card_CoverImage.className = "card_CoverImage";
    card_CoverImage.style.backgroundImage = `url(${cardData.coverImage?.large || cardData?.image.large})`;



    if (cardType === "ANIME" || cardType === "MANGA") {

    let card_BannerImage = document.createElement("div");
    card_BannerImage.className = "card_BannerImage";
    card_BannerImage.style.backgroundImage = `url(${cardData.bannerImage})`;
    

    let card_Titles = document.createElement("div");
    card_Titles.className = "card_Titles";
    
    Object.values(cardData.title).forEach(title => {
        let card_Title = document.createElement("div");
        card_Title.innerHTML = title;
        card_Titles.appendChild(card_Title);
    });


    let card_Genres = document.createElement("div");
    card_Genres.className = "card_Genres";

    cardData.genres.forEach(genre => {
        let card_Genre = document.createElement("div");
        card_Genre.innerHTML = genre;
        card_Genres.appendChild(card_Genre);
    });


    let card_Description = document.createElement("div");
    card_Description.className = "card_Description";
    card_Description.innerHTML = cardData.description;


    // Character and Staff
    let card_MoreInfo = document.createElement("div");
    card_MoreInfo.className = "card_MoreInfo";


    let card_statusInfo = document.createElement("div");
    card_statusInfo.className = "card_statusInfo";
    card_statusInfo.innerHTML = `
    <div class="card_Format">${cardData.format}</div>
    <div class="card_Status">${cardData.status}</div>
    `;

    let card_scoreInfo = document.createElement("div"); 
    card_scoreInfo.className = "card_scoreInfo";
    card_scoreInfo.innerHTML = `
    <div class="card_Popularity">Popularity: ${cardData.popularity}</div>
    <div class="card_AvgScore">Average: ${cardData.averageScore}</div>
    <div class="card_Trending">Trending: ${cardData.trending}</div>
    `;
    

    if (cardType === "ANIME") {
        let card_studioInfo = document.createElement("div");
        card_studioInfo.className = "card_studioInfo";

        Object.values(cardData.studios.nodes).forEach(studio => {
            let card_studioName = document.createElement("div");
            card_studioName.innerHTML = studio.name; 
            card_studioInfo.appendChild(card_studioName);
        });
        cardDetail.appendChild(card_studioInfo);


        let card_episodeInfo = document.createElement("div");
            card_episodeInfo.className = "card_episodeInfo";
            card_episodeInfo.innerHTML = `
            <div class="card_Episodes">Episodes: ${cardData.episodes}</div>
            <div class="card_Duration">Per: ${cardData.duration}min</div>
            `;
        
        cardDetail.appendChild(card_episodeInfo);
    }

    let card_Tags = document.createElement("div");
    card_Tags.className = "card_Tags";
    cardData.tags.forEach(tag => {
        let card_Tag = document.createElement("div");
        card_Tag.innerHTML = tag.name;
        card_Tags.appendChild(card_Tag);
    });

    let card_similarSeries = document.createElement("div");
    card_similarSeries.className = "card_similarSeries";

    cardDetail.appendChild(card_BannerImage);
    cardDetail.appendChild(card_Titles);    
    cardDetail.appendChild(card_Genres);
    cardDetail.appendChild(card_Description);
    cardDetail.appendChild(card_MoreInfo);
    cardDetail.appendChild(card_statusInfo);
    cardDetail.appendChild(card_scoreInfo);
    cardDetail.appendChild(card_Tags);
    cardDetail.appendChild(card_similarSeries);
    
    } 
    else {
        
        let card_Name = document.createElement("div");
        card_Name.className = "card_Name";
        card_Name.innerHTML = cardData.name.full;

        let card_Age = document.createElement("div");
        card_Age.className = "card_Age";
        if (cardData.age != null) {
            card_Age.innerHTML = "Age: " + cardData.age.substring(0, cardData.age.length);

        }else card_Age.innerHTML = "Age: Unknown";

        let card_Gender = document.createElement("div");
        card_Gender.className = "card_Gender";
        card_Gender.innerHTML = "Gender: " + cardData.gender;

        let dob = cardData.dateOfBirth;
        let card_DoB = document.createElement("div");
        card_DoB.className = "card_DoB";
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
        if (dob.year !== null) {
            card_DoB.innerHTML = `Birthday: ${dob.day} ${monthNames[dob.month - 1]} ${dob.year}`;
        }else card_DoB.innerHTML = `Birthday: ${monthNames[dob.month - 1]} ${dob.day}`;
        
        //`<p>${line}</p>`
        const regex1 = /__/g;
        const regex2 = /\*\*/g;
        const regex3 = /!~/g;
        const regex4 = /~!/g;
        let card_CharDescription = document.createElement("div");
        card_CharDescription.className = "card_CharDescription";
        card_CharDescription.innerHTML = cardData.description
        .split("\n")
        .map((line) => {
            if (line.includes("__") || line.includes("**") || line.includes("!~") || line.includes("~!")) { // Use includes instead of regex.test()
                line = line.replace(regex1, ''); // Remove underscores
                line = line.replace(regex2, ''); // Remove double asterisks
                line = line.replace(regex3, ''); // Remove exclamation tilde
                line = line.replace(regex4, ''); // Remove tilde exclamation
                return `<p class="highlight">${line}</p>`;
            } else {
                return `<p class="description">${line}</p>`;
            }
        })
        .join("");

        let card_CharMedia = document.createElement("div");
        card_CharMedia.className = "card_CharMedia";
        //card_CharMedia.innerHTML = cardData.media;

        let card_Favourites = document.createElement("div");
        card_Favourites.className = "card_Favourites";
        card_Favourites.innerHTML = `Favourites: ${cardData.favourites}`;

        
        cardDetail.appendChild(card_Name);
        cardDetail.appendChild(card_Age);
        cardDetail.appendChild(card_Gender);
        cardDetail.appendChild(card_DoB);
        cardDetail.appendChild(card_CharDescription);
        cardDetail.appendChild(card_CharMedia);
        cardDetail.appendChild(card_Favourites);
    }


    cardDetail.appendChild(card_CoverImage);

    return cardDetail;
}
async function searchTraceMoe(files){

    if (!files || files.length === 0) {
        console.error("No files provided.");
        return null;
    }
    
    if (!files) return; 

    let traceMoeData;

    const file = files[0]; 
    const formData = new FormData();
    formData.append("image", file); 


    var url = 'https://api.trace.moe/search',
        options = {
            method: 'POST',
            body: formData
        };

    await fetch(url, options)
        .then(handleResponse)
        .then(data => {

                console.log("Anilist response: ", data);
                traceMoeData = data;
            }
        )
        .catch(handleError);

    return traceMoeData;
}

async function searchAnilist(query, variables) {

    console.log("searchAnilist called with:");

    let anilistData;

    let queryID = `query($searchTerm: String, $searchType: MediaType, $sortType: [MediaSort]) {
                        Page(page: 1, perPage: 50) {
                            media(search: $searchTerm, type: $searchType, sort: $sortType) {
                                id
                                title {
                                    english
                                }
                                coverImage {
                                    large
                                }
                                isAdult
                            }
                        }
                    }`;
    
    let queryCharacterId = `query ($searchTerm: String, $sortType: [CharacterSort]) {
                                Page(page: 1, perPage: 50) {
                                    characters(search: $searchTerm, sort: $sortType) {
                                        id
                                        image {
                                            large
                                        }       
                                    }
                                }
                            }`;

    let querySeries = `query($searchID: Int, $searchType: MediaType) {
                            Media(id: $searchID, type: $searchType) {
                                id
                                title {
                                    romaji
                                    english
                                    native
                                }
                                coverImage {
                                    large
                                }
                                bannerImage
                                description
                                genres
                                format
                                status
                                episodes
                                duration
                                averageScore
                                popularity
                                trending
                                studios {
                                    nodes {
                                        name
                                        siteUrl
                                        isAnimationStudio

                                    }
                                }
                                tags {
                                    name
                                }
                                isAdult
                            }
                        }`;

    let queryCharacter = `query ($searchID: Int) {
                            Character(id: $searchID) {
                                id
                                name {
                                    full
                                    native
                                    alternative
                                }
                                image {
                                    large
                                }
                                description
                                gender
                                dateOfBirth {
                                    year
                                    month
                                    day
                                }
                                age
                                favourites
                                media {
                                    nodes {
                                        id
                                        title {
                                            romaji
                                            english
                                            native
                                        }
                                        coverImage {
                                            large
                                        }

                                        averageScore
                                        popularity
                                        trending

                                    }
                                }
                                siteUrl
                            }
                        }`;

                

    
    variables = {
        searchTerm: variables?.searchTerm || null,
        searchType: variables?.searchType || "ANIME",
        sortType: variables?.sortType || variables?.searchType === "CHARACTER" ? ["FAVOURITES_DESC"] : ["POPULARITY_DESC"],
        searchID: variables?.searchID || null
    };

    console.log("fetch type:", query);
    console.log("variables:", variables.searchID);

    switch (query) {
        case "ID": query = queryID; break;
        case "CHARACTER_ID": query = queryCharacterId; break;
        case "CHARACTER": query = queryCharacter; break;
        case "SERIES": query = querySeries; break;
        default: query = queryAll; break;
    }
    
    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

    await fetch(url, options)
        .then(handleResponse)
        .then(data => {
                anilistData = data;
                console.log(data);
                
            }
        )
        .catch(handleError);
        
        console.log("searchAnilist finished");
        
    return anilistData;
}


function handleResponse(response) {
    return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
    });
}

function handleData(data) {
    console.log(data);
}

function handleError(error) {
    alert('Error, check console');
    console.error(error);
}


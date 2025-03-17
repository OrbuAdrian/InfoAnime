async function searchTraceMoe(files){

    console.log("searchMoe called");
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

                console.log(data);
                traceMoeData = data;
            }
        )
        .catch(handleError);

    console.log("searchMoe finished");
    return traceMoeData;
}

async function searchAnilist(query = null, variables = null) {

    console.log("searchAnilist called with:");
    console.log("query: ", query); 
    console.log("variables: ", variables);  
    let anilistData;

    

    if (query === null && variables === null) {
        query = `query {
                    Page(page: 1, perPage: 50) {
                        media(type: ANIME, sort: POPULARITY_DESC) {
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
                            isAdult
                        }
                    }
                }`;
    }else if (query === null && variables != null) {

        let searchType = variables.searchType || "ANIME";
        let sortType = variables.sortType || "POPULARITY_DESC";

        if (searchType !== "CHARACTER") {
            query = `query($searchTerm: String, $searchType: MediaType, $sortType: [MediaSort]) {
                Page(page: 1, perPage: 50) {
                    media(search: $searchTerm, type: $searchType, sort: $sortType) {
                        id
                        title { romaji english native }
                        coverImage { large }
                        averageScore
                        popularity
                        isAdult
                        siteUrl
                    }
                }
            }`;
        } else {
            query = `query ($searchTerm: String) {
                Page(page: 1, perPage: 50) {
                    characters(search: $searchTerm) {
                        id
                        name {
                            full
                        }
                        image {
                            large
                        }
                    }
                }
            }`;
        }

        variables = {
            searchTerm: variables.searchTerm,
            searchType: searchType,
            sortType: sortType,
        };
        
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
            }
        )
        .catch(handleError);
        
        console.log("searchAnilist finished");
        
    return anilistData;
}

document.addEventListener('DOMContentLoaded', () => {

});

async function getAnilistResponse() {
    const queryCards = document.getElementsByClassName('responseCard');

    for (let card of queryCards) {
        card.addEventListener('click', () => {
            console.log("Card clicked:", card.dataset.anilist);

            var query = `
            query ($id: Int){
                Media(id: $id, type: ANIME) {
                    title{
                        romaji
                        english
                        native
                    }
                    synonyms 

                    coverImage {
                        large
                    }

                    bannerImage

                    description

                    format

                    status

                    startDate {
                        year
                        month
                        day
                    }

                    endDate {
                        year
                        month
                        day
                    }

                    season

                    episodes
    
                    duration
    
                    genres
    
                    studios {
                        nodes {
                            name
                            siteUrl
                            isAnimationStudio

                        }
                        
                    }

                    averageScore

                    popularity

                    trending

                    tags {
                        name
                    }



                    characters{
                        edges {
                            role
                            node {
                                id
                                name {
                                    full
                                }
                                image {
                                    large
                                }
                            }
                        }
                    }

                    staff {
                        edges {
                            role
                            node {
                                name {
                                    full
                                }
                                image {
                                    large
                                    medium    
                                }
                            }
                        }
                    }
                }
            }`
            ;

            var variables = {
                id: `${card.dataset.anilist}`,
                perPage: 50
            };


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

            fetch(url, options).then(handleResponse)
                .then(data => {return data})
                .catch(handleError);
        });
    }

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


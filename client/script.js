async function searchMoe(files){

    console.log("searchMoe called");
    if (!files.length) return; 

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

    console.log("searchAnilist called");
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
                        }
                    }
                }`;
    }else if (query === null && variables != null) {
        query = `query($searchTerm: String, $searchType: MediaType, $sortType: [MediaSort]) {
            Page(page: 1, perPage: 50) {
                media(search: $searchTerm, type: $searchType, sort: $sortType) {
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
                }
            }
        }`;

        
        variables = {
            searchTerm: variables.searchTerm,
            searchType: variables.searchType === undefined ? "ANIME" : variables.searchType, 
            sortType: variables.sortType === undefined ? "POPULARITY_DESC" : variables.sortType,
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
                console.log(data);
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

async function fetchImages(results, api = "traceMoe") {
    console.log("fetchImages called");


    if (api === "traceMoe") {
        console.log("Using trace.moe API");
        animeFilter = filterResultsByAnime(results);
        //finalResults = filterResultsBySimilarity(animeFilter);
        console.log(animeFilter);

        //await appendImages(finalResults);
    } else if (api === "anilist") {
        console.log("Using Anilist API");
        const finalResults = getAnilistResponse();
        console.log(finalResults);

        //await appendImages(finalResults);
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

const search = document.getElementById('search');
    search.addEventListener('keyup', function(event){
        if (event.key === 'Enter') {
            console.log(search.value);


            var query = `
            query ($search: String){
                Page(page: 1, perPage: 10) {
                    pageInfo { 
                        total
                        currentPage
                        lastPage
                        hasNextPage
                        perPage
                    }

                    media(search: $search, type: ANIME) {
                        id
                        title{
                            romaji
                            english
                            native
                        }
                        coverImage {
                            large
                            medium
                        }
                        bannerImage
                    }
                }
            }`
            ;

            var variables = {
                search: search.value,
            }
            ;


            searchAnilist(query, variables);
        }
    });
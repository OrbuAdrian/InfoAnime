async function searchMoe(files){

    console.log("searchMoe called");
    if (!files.length) return; 

    const file = files[0]; 
    const formData = new FormData();
    formData.append("image", file); 

    await fetch("https://api.trace.moe/search", {
        method: "POST",
        body: formData,
    }).then(async (response) => {
        if (response.ok) {
            const parsedResult = await response.json();
            console.log(JSON.stringify(parsedResult, null, 2));

            if (parsedResult?.result?.length > 0) {

                fetchImages(parsedResult);

            } else {
                console.log("No results found.");
            }
        } else {
            console.error("Request failed with status:", response.status);
        }
    })

    
}


async function fetchImages(results) {
    console.log("fetchImages called");

    animeFilter = filterResultsByAnime(results);
    finalResults = filterResultsBySimilarity(animeFilter);
    console.log(finalResults);

    await appendImages(finalResults);

    

    const queryCards = document.getElementsByClassName('responseCard');
    console.log("queryCards after append:", queryCards);
    console.log("Length after append:", queryCards.length);

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
                .then(handleData)
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
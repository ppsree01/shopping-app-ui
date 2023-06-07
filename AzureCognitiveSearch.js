import { QUERY_KEY } from "./secrets";

export default AzureCognitiveSearch = ({keyword, endpoint, index} ) => {

    const getSearchResults = async () => {
        const payload = {
            "count":true,
            "skip":0,
            "top":50,
            "searchMode":"any",
            "queryType":"simple",
            "search": keyword
        }

        const API_URL = `https://${endpoint}.search.windows.net/indexes/${index}/docs/search?api-version=2016-09-01`
        console.log(API_URL);
        const response = await fetch( API_URL, {
            method: "POST",
            mode: 'cors',
            headers: {
                "api-key": QUERY_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        } );

        return response.json();
    };

    let output = [];
    getSearchResults().then(
        r => 
        {
            for (let item of r.value) {
                output.push({
                    image: item.main_image,
                    brand: item.brand,
                    searchScore: item["@search.score"]
                })
                console.log(output);
            }
        }
    ).catch(
        e => console.log(e)
    )
    return (<></>)
}

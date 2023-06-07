import { useState } from "react";
import { View, Button, ScrollView, Text } from "react-native";
import { QUERY_KEY } from "./secrets";

export default AzureCognitiveSearch = ({ keyword, endpoint, index }) => {

    const [update, setUpdate] = useState('');
    const [output, setOutput] = useState('');

    const getSearchResults = async () => {
        const payload = {
            "count": true,
            "skip": 0,
            "top": 50,
            "searchMode": "any",
            "queryType": "simple",
            "search": keyword
        }

        const API_URL = `https://${endpoint}.search.windows.net/indexes/${index}/docs/search?api-version=2016-09-01`
        console.log(API_URL);
        const response = await fetch(API_URL, {
            method: "POST",
            mode: 'cors',
            headers: {
                "api-key": QUERY_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        return response.json();
    };

    const initiateAzureCognitiveSearch = () => {
        setUpdate(`Initiating Azure Cognitive Search for ${keyword} ...`);
        getSearchResults().then(
            r => {
                let output = [];
                for (let item of r.value) {
                    output.push({
                        image: item.main_image,
                        brand: item.brand,
                        searchScore: item["@search.score"]
                    });
                    console.log(output);
                    setUpdate(`Updated results`);
                    setOutput(JSON.stringify(output));
                }
            }
        ).catch(
            e => {
                console.log(e)
                setUpdate('Azure Cognitive Search erroring out');
            }
        )
    }
    const header = "SearchResults:"

    styles = {
        container: {
            maxHeight: '20%',
            alignSelf: 'center',
        }
    }

    return (
        <View>
           <Text>{update}</Text>
           <Text>{output.length > 0 && header}</Text>
            <ScrollView style={styles.container}>
            <Text>{output.length > 0 && output}</Text>
            </ScrollView>
           <Button title="Azure Cognitive Search" onPress={() => initiateAzureCognitiveSearch()}></Button>
           <Button title="Clear Output" onPress={() => {setUpdate(''); setOutput('')}}></Button>
        </View>
    )
}

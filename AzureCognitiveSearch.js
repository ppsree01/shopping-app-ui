import React, { useState } from "react";
import { Modal, Pressable, View, Button, ScrollView, Text } from "react-native";
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
        if (!keyword) {
            setUpdate(`Say something to initiate search`);
            return
        }
        setUpdate(`Initiating Azure Cognitive Search for ${keyword} ...`);
        getSearchResults().then(
            r => {
                let output = [];
                for (let item of r.value) {
                    output.push({
                        title: item.title,
                        price: item.price, 
                        currency: item.currency,
                        avgRating: item.avg_rating,
                        reviewCount: item.reviews_count,
                        image: item.main_image,
                        brand: item.brand,
                        searchScore: item["@search.score"]
                    });
                    console.log(output);
                    let formatted = ''
                    setUpdate('');
                    let count = 2;
                    for (let item of output) {
                        count -= 1
                        formatted += '{\n'
                        for (let key in item) {
                            formatted += `\t${key}: ${item[key]}\n`
                        }
                        formatted += '}\n'
                        formatted += '--------------------\n'
                        if (count == 0) {
                            break;
                        }
                    }
                    // setOutput(JSON.stringify(output[0]));
                    setOutput(formatted);
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
            fontSize: '110%',
            maxHeight: '30%',
            alignSelf: 'center',
        },
    }

    return (
        <View>
           <Text>{update}</Text>
           <Text>{output.length > 0 && header}</Text>
            <ScrollView style={styles.container}>
            <Text>{output.length > 0 && output}</Text>
            </ScrollView>
           <Button title="Azure Cognitive Search" onPress={() => initiateAzureCognitiveSearch()}></Button>
           <Button title="Clear Cognitive Search Output" onPress={() => {setUpdate(''); setOutput('')}}></Button>
        </View>
    )
}

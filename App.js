import { useState } from "react"
import { Button, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import CustomCamera from "./CustomCamera";
import Microphone from "./Microphone";
import AzureCognitiveSearch from "./AzureCognitiveSearch";
import ShowOutput from "./ShowOutput";
import { styles } from "./styles";

export default function App() {
	const [progress, setProgress] = useState('');
	const [outputString, setOutputString] = useState('');
	const [searchParam, setSearchParam] = useState('');

	return (
		<View style={{ flex: 1 }}>
			<CustomCamera 
				setOutputString={setOutputString} 
				setProgress={setProgress}
				setSearchParam={setSearchParam} />
			<Microphone 
				setOutputString={setOutputString}
				setProgress={setProgress}
				setSearchParam={setSearchParam} />
			<AzureCognitiveSearch 
				setProgress={setProgress}
				setOutputString={setOutputString}
				keyword={ searchParam } 
				index={"azureblob-index"} 
				endpoint={'talktech2023'} />
			<ShowOutput 
				output={outputString}
				progress={progress} /> 
			<Pressable style={styles.clearButton} 
				onPress={() => { 
					setProgress(''); 
					setOutputString(''); 
					}}>
                <Text style={styles.text}>Clear Search</Text>
            </Pressable> 
		</View>
	)
}
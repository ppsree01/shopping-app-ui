import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';

import axios from 'axios';

const baseUrl = 'http://192.168.1.3:8080'

export default function App() {
	const [hasCameraPermission, setHasCameraPermission] = useState(null);
	const [text, setText] = useState('');
	const [camera, setCamera] = useState(null);
	const [image, setImage] = useState(null);
	const [type, setType] = useState(Camera.Constants.Type.back);

	useEffect(() => {
		(async () => {
			const cameraStatus = await Camera.requestCameraPermissionsAsync();
			setHasCameraPermission(cameraStatus.status === 'granted');
		})();
	}, []);

	const takePicture = async () => {
		if (camera) {
			const data = await camera.takePictureAsync(null)
			setImage(data.uri);
			let data2 = new FormData(data);
		// 	axios.post({
		// 		method: 'post',
		// 		url: `${baseUrl}/uploadFile`,
		// 		data: data
		// 	  }, 
		// 	  ).then((response) => {
		// 		console.log(response.data);
		// 		setText(JSON.stringify(response.data));
		// 	  });
		// }

			const {image} = await axios.post(`${baseUrl}/uploadFile/`, {
				body: data2
  			}, {
    			headers: {
      				'Content-Type': 'multipart/form-data'
    			}
  			})
		}
	}

	

	if (hasCameraPermission === false) {
		return <Text>No access to camera</Text>;
	}
	return (
		<View style={{ flex: 1 }}>
			<View style={styles.cameraContainer}>
				<Camera
					ref={ref => setCamera(ref)}
					style={styles.fixedRatio}
					type={type}
					ratio={'1:1'} />
			</View>
			<Button
				title="Flip Image"
				onPress={() => {
					setType(
						type === Camera.Constants.Type.back
							? Camera.Constants.Type.front
							: Camera.Constants.Type.back
					);
				}}>
			</Button>
			<Button title="Take Picture" onPress={() => takePicture()} />
			<Text>{text}</Text>
			{image && <Image id="img1" source={{uri: image}} style={{flex:1}}/>}

		</View>
	);
}
const styles = StyleSheet.create({
	cameraContainer: {
		flex: 1,
		flexDirection: 'row'
	},
	fixedRatio: {
		flex: 1,
		aspectRatio: 1
	}
})
import React, { useState, useEffect } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';

import { API_KEY } from './secrets';
import Microphone from './Microphone';

export default function App() {
	const [ hasCameraPermission, setHasCameraPermission ] = useState( null );
	const [ detectedText, setDetectedText ] = useState( null );
	const [ detectedLabel, setDetectedLabel ] = useState( null );
	const [ camera, setCamera ] = useState( null );
	const [ image, setImage ] = useState( null );
	const [ type, setType ] = useState( Camera.Constants.Type.back );

	useEffect( () => {
		( async () => {
			const cameraStatus = await Camera.requestCameraPermissionsAsync();
			setHasCameraPermission( cameraStatus.status === 'granted' );
		} )();
	}, [] );

	const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

	const takePicture = async () => {
		if ( camera ) {
			const data = await camera.takePictureAsync( { base64: true } );
			setImage( data.uri )
			await callGoogleVisionAsync( data.base64 );
		}
	}

	const generateBody = ( image ) => {
		const body = {
			requests: [
				{
					image: {
						content: image,
					},
					features: [
						{
							type: "TEXT_DETECTION",
							maxResults: 3,
						},
						{
							type: "LABEL_DETECTION",
							maxResults: 3
						},
					],
				},
			],
		};
		return body;
	}

	const callGoogleVisionAsync = async ( image ) => {
		const body = generateBody( image );
		const response = await fetch( API_URL, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify( body ),
		} );
		const result = await response.json();
		console.log(result);
		if ( result && result.responses ) {
			res = result.responses[0];

			if (res.fullTextAnnotation) {
				setDetectedText( res.fullTextAnnotation );
			} 
			if ( res.labelAnnotations) {
				// setDetectedText( res.labelAnnotations.map(item => item.description).join(',') );
				let output = [];
				for (let item of res.labelAnnotations) {
					output.push(item.description);
					console.log(item);
				}
				setDetectedLabel( output.join(", ") )
			}
		} else {
			setDetectedText( {
				text: "This image doesn't contain any text!"
			} );
		}
	}

	if ( hasCameraPermission === false ) {
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
			<Text>{ detectedText && detectedText.text }</Text>
			<Text>{ detectedLabel }</Text>
			<Microphone />
			{/* {image && <Image name='image' id="img1" source={{ uri: image }} style={{ flex: 1 }} />} */}
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
});
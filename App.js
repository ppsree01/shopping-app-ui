import React, { useState, useEffect } from 'react';
import { Button, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import { openBrowserAsync } from 'expo-web-browser';

import { API_KEY } from './secrets';
import Microphone from './Microphone';

const walmartAppUrl = 'https://www.walmart.com/';
let searchUrl = '';

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
							maxResults: 2,
						},
						{
							type: "LABEL_DETECTION",
							maxResults: 2
						},
					],
				},
			],
		};
		return body;
	}

	const callGoogleVisionAsync = async ( image ) => {

		searchUrl = walmartAppUrl + 'search?q='

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
				console.log(res.fullTextAnnotation);
				// most images dont have text, so this can be an empty object
				let text = res.fullTextAnnotation?.text;
				searchUrl += text ? text + '+' : '';
			} 
			if ( res.labelAnnotations) {
				// setDetectedText( res.labelAnnotations.map(item => item.description).join(',') );
				let output = [];
				for (let item of res.labelAnnotations) {
					output.push(item.description);
					console.log(item);
				}
				setDetectedLabel( output.join(", ") )
				

				const closestResults = () => {
					output.sort((a, b) => a.score > b.score)
				}
				closestResults();
				console.log(output);

				searchUrl += output[0] + '+' + output[1];

				openBrowserAsync(searchUrl);
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
				title="Flip Camera"
				color = "#0de668"
				onPress={() => {
					setType(
						type === Camera.Constants.Type.back
							? Camera.Constants.Type.front
							: Camera.Constants.Type.back
					);
				}}>
			</Button>
			<Button title="Take Picture" color="#0de668" onPress={() => takePicture()} />
			<Text>{ detectedText && detectedText.text }</Text>
			<Text>{ detectedLabel }</Text>
			<Microphone />
			<View style={styles.logoContainer}>
				<Pressable style={styles.button} onPress={() => {
					openBrowserAsync('https://www.walmart.com/')
				}}>
					<Image
						source={{
							uri: 'data:image/png;base64,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'
						}}
						style={{ width: 80, height: 80, borderColor: 'white', borderWidth: 1 }}
					/>
				</Pressable>
			</View>
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
	},
	WebViewStyle: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		marginTop: 30,
	  },
	logoContainer: {
		flex: .3,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 3,
		backgroundColor: 'white',
		padding: 8,
	},
	button: {
		width: '150%',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 32,
		elevation: 3,
		backgroundColor: '#081d41',
	},
});
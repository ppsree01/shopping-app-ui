import React, { useState, useEffect } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import WebView from 'react-native-webview'
import { Camera } from 'expo-camera';
import { openBrowserAsync } from 'expo-web-browser';
import { StatusBar } from 'expo-status-bar';

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
			{/* Space for output */}
		
			<Button
				title="Flip Camera"
				color = "#7627b8"
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
			<View style={styles.container}>
		      <Button title="Walmart App" onPress={() => openBrowserAsync("https://www.walmart.com/")} />
		      <StatusBar style="auto" />
			</View>
			<View style={styles.logoContainer}>
			<Image
				source={{
					uri:
						'https://pbs.twimg.com/profile_images/1290311407620120576/my8W0K5V_400x400.jpg',
				}}
				style={{ width: 100, height: 100, borderColor: 'white', borderWidth: 1 }}
			/>
			</View>
			<WebView
				style={styles.WebViewStyle}
				//Loading html file from project folder
				source={require('./azsearchjsApp.html')}
				//Enable Javascript support
				javaScriptEnabled={true}
				//For the Cache
				domStorageEnabled={true}
			/>
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
	}
});
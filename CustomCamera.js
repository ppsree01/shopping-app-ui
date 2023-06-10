import { Camera } from 'expo-camera';
import { styles } from './styles';
import { API_KEY } from './secrets';
import { useState, useEffect } from 'react';
import { View, Button, Text } from "react-native";
import { openBrowserAsync } from 'expo-web-browser';

export default CustomCamera = ({ setOutputString, setProgress, setSearchParam }) => {
	const [ hasCameraPermission, setHasCameraPermission ] = useState( null );
	const [ detectedText, setDetectedText ] = useState( null );
	const [ detectedLabel, setDetectedLabel ] = useState( null );
	const [ camera, setCamera ] = useState( null );
	const [ image, setImage ] = useState( null );
	const [ type, setType ] = useState( Camera.Constants.Type.back );

	useEffect( () => {
		( async () => {
            setProgress('Checking for camera capability on device ...');
			const cameraStatus = await Camera.requestCameraPermissionsAsync();
			setHasCameraPermission( cameraStatus.status === 'granted' );
            setProgress('Camera detected and ready...');
		} )();
	}, [] );


	const walmartAppUrl = 'https://www.walmart.com/';
	let searchUrl = '';

	const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
    // const FLIP_CAMERA_COLOR = '#0de668';
    const FLIP_CAMERA_COLOR = '#ffffff';
    const FLIP_CAMERA_TITLE = 'Flip Camera';

    const TAKE_PICTURE_TITLE = "Take Picture";
    // const TAKE_PICTURE_COLOR = "#0de668";
    const TAKE_PICTURE_COLOR = "#ffffff";
    let outputString = '';

    const takePicture = async () => {
		if ( camera ) {
            setProgress('Capturing Image ... ');
			const data = await camera.takePictureAsync( { base64: true } );
            setProgress('Image Captured ...');
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

        setProgress('Processing Image ...');
		const result = await response.json();
		console.log(result);
		setSearchParam('')
		if ( result && result.responses ) {
            setProgress('------Camera Output------');
			res = result.responses[0];

            outputString += '\nImage Detection:\n\n';
			if (res.fullTextAnnotation) {
				setDetectedText( res.fullTextAnnotation );
				console.log(res.fullTextAnnotation);
				for (let key in res.fullTextAnnotation) {
                	outputString += res.fullTextAnnotation[key] + ', ';
				}
				// most images dont have text, so this can be an empty object
				let text = res.fullTextAnnotation?.text;
				searchUrl += text ? text + '+' : '';
			} 

            outputString += '\n\nLabels on detected image:\n';
			if ( res.labelAnnotations) {

				let output = [];
				for (let item of res.labelAnnotations) {
					output.push(item.description);
					console.log(item);
				}
                outputString += output.length > 0 ? output.join(", ") : "None";
				setDetectedLabel( output.join(", ") );
				setSearchParam(output.join(" "));

				const closestResults = () => {
					output.sort((a, b) => a.score > b.score)
				}
				closestResults();
				console.log(output);
                setOutputString(outputString + '\n\n---------\n');

				searchUrl += output[0] + '+' + output[1];
                setProgress('Opening Walmart App ... ');
				openBrowserAsync(searchUrl);
			}
		} else {
			setSearchParam('');
			setDetectedText( {
				text: "This image doesn't contain any text!"
			} );
		}
	}

	if ( hasCameraPermission === false ) {
        setProgress('No access to camera');
		return <View>No access to camera</View>;
	}

    return (
        <View style={styles.mainContainer}>
            <View style={styles.cameraContainer}>
                <Camera
                    ref={ref => setCamera(ref)}
                    style={styles.fixedRatio}
                    type={type}
                    ratio={'1:1'} />
            </View>
            <Button
                title={ FLIP_CAMERA_TITLE }
                color={ FLIP_CAMERA_COLOR }
                onPress={() => {
                    setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                    );
                }}>
            </Button>
            <Button 
                title={ TAKE_PICTURE_TITLE } 
                color={ TAKE_PICTURE_COLOR } 
                onPress={() => takePicture()} />
        </View>
    )
};
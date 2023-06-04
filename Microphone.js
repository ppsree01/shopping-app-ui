import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import { API_KEY } from './secrets';
import { data } from './data';

let uri = null;
export default function Microphone() {
    const [recording, setRecording] = React.useState();
    const [sound, setSound] = React.useState(null)

    React.useEffect(() => {
        return sound
          ? () => {
              console.log('Unloading Sound');
              sound.unloadAsync();
            }
          : undefined;
      }, [sound]);

    const styles = {
        container: {}
    }

    const BASE_URL = 'https://speech.googleapis.com/v1/speech:recognize';

    const recordingOptions = {
        // android not currently in use, but parameters are required
        android: {
            extension: '.m4a',
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
        },
        ios: {
            extension: '.wav',
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
        },
    };

    async function startRecording() {
        try {
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            console.log('Starting recording..');
            // const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
            const { recording } = await Audio.Recording.createAsync(recordingOptions);
            setRecording(recording);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        setRecording(undefined);
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        TranscribeAudio().then(
            r => console.log(r.results[0].alternatives[0].transcript),
            e => console.log(e),
        ).catch(
            e => console.log(e)
        );
    }

    const TranscribeAudio = async () => {
        const request = {
            config: {
                encoding: 'FLAC',
                sampleRateHertz: '16000',
                languageCode: 'en-US'
            },
            audio: {
                content: data
            }
        }

        const response = await fetch(
            `${BASE_URL}?key=${API_KEY}`, 
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=base64',
                }, 
                body: JSON.stringify(request)
            },
        );
        return response.json();
    }

    async function playSound() {
        console.log( uri )
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync( {uri} );
        setSound(sound);
    
        console.log('Playing Sound');
        await sound.playAsync();
    }

    return (
        <View style={styles.container}>
            <Button
                title={recording ? 'Stop Recording' : 'Start Recording'}
                onPress={recording ? stopRecording : startRecording}
            />
            <Button title="Play Sound" onPress={playSound} />
        </View>
    );
}
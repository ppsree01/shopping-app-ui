# Shopping App UI:

### Prerequisites:
1. Sign up on GCP Platform, obtain an API Key to use with Vision, Speech services
2. Install the expo app on your phone

### Build and run the App:
1. Add a new secrets.js file to store the API_KEY as a const:
    ```
    // secrets.js:
    export const API_KEY = "<your api key>"
    ```
2. Download the code and run `npm i`
3. Run `npx expo start` to build the metro bundler. Scan the QR code using your phone's camera to run the app on expo.
NOTE: Follow the steps mentioned here: https://docs.expo.dev/tutorial/introduction/

### Vision:
This project uses GCP's Vision service to recognise images, and detect labels from images.
Camera is on by default throughout the app session. Click on the Take Picture Button to click a picture. The response from Vision takes a while and is printed on the screen.

### Audio:
The audio feature uses GCP's Speech To Text Service. Audio recording and playback is developed using Expo AV. The Audio content is encoded in base 64 format and is send to the GCP's Speech to text API. The return string is printed on the screen.

### Next Steps:
1. Include an inventory search using the processed audio and return response as text and data.
2. Include text to speech and use PlaySound to read out the message to the user.
3. Improve UI to look more like a shopping aid chatbot.
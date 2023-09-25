## Project Description
This Weather App was created using React Native as part of workshop at Mind Mingle Bootcamp. I chose to build Weather App because I wanted to try out Expo Location library that allows to read geolocation data and more, also it was great to play with flexbox and grid analogues in React Native. Weather data received via API from https://www.weatherapi.com.
To develop and run the app I used Expo Go app for my phone (works on iOS and Android).

## How does the app look like
If you want to see the app and don't want to install it and run locally, you can navigate using this link to see a screen recording from my phone.
https://drive.google.com/file/d/150x7XwV-T-Ork5uI2lFRuVkYdSWO3ZVn/view?usp=share_link

## How to run the app on your device
1. Clone repo with the project using the following command
```
git clone git@github.com:vlerkin/react-native-weather-app.git
```
2. To access weather data you need to obtain your personal api key on the website https://www.weatherapi.com
3. Create a file secrets.ts in a root derictory and paste your key there
```
export const apiKey = "put your key here"
```
4. In your terminal, navigate to the cloned directory and install all dependencies
```
npm install
```
5. Install Expo Go app on your smartphone https://expo.dev/client
6. In the cloned directory run the app
```
npx expo start
```
7. You will see a QR code in your terminal. Scan it with your camera on iPhone or with the Expo Go app on Android. The system will then prompt you to allow access to your location. Please tap 'allow once' or choose any other permissive option. Note: your devices should be connected to the same network.

In case of any problems with older versions, you can upgrade expo or other dependencies and run the app again. 

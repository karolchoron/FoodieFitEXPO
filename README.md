# Foodie Fit - aplikacja wieloplatformowa w React Native Expo

> English version below
> 
>**Uwaga**: Upewnij się, że prawidłowo skonfigurowałeś środowisko [React Native Expo - Environment Setup](https://reactnative.dev/docs/environment-setup).

## Krok 0: Zainstaluj pakiety NPM

Aby zainstalować pakiety npm, musisz uruchomić nastepującą komendę:

   ```bash
   npm install
   ```

## Krok 1: Utwórz projekt bazy danych Firebase

a. Utwórz projekt  Firebase Realtime Database oraz Firebase Authentication. 

b. Pamiętaj również o uzupełnieniu pliku source/data/FirebaseConfig.js


## Krok 2: Uruchom serwer Metro Bundler

Aby uruchomić Metro Bundler, uruchom następującą komendę z _katalogu głównego_ projektu:

```bash
# using npm
npx expo start
```

## Krok 3: Uruchom aplikację
Po uruchomieniu serwera Metro w konsoli pojawi się menu. Wystarczy kliknąć odpowiednią literę na klawiaturze, aby uruchomić aplikację dla odpowiedniej platformy:

1. a - Android
2. i - iOS
3. w - Web

Aplikację można również uruchomić za pomocą następujących poleceń:

```bash
npx expo start --android
npx expo start --ios
npx expo start --web
```

Aby uruchomić aplikację na fizycznym urządzeniu należy zainstalować aplikację Expo Go a następnie zeskanować telefonem kod QR z menu Metro

### To wszystko! Miłego korzystania z aplikacji FoodieFit!


----------------------------------------------------------------------------------------------------------------------------


# Foodie Fit - React Native Expo cross platform App

>**Note**: Make sure you have completed the [React Native Expo - Environment Setup](https://reactnative.dev/docs/environment-setup).

## Step 0: Install NPM packages

To install npm packages, you run following command:
   ```bash
   npm install
   ```

## Step 1: Create a Firebase database project

a. Create a Firebase Realtime Database and Firebase Authentication project. 

b. Also remember to complete the source/data/FirebaseConfig.js file


## Step 2: Start the Metro Server

To start Metro Bundler, run the following command from the _root_ of your React Native project:

```bash
# using npm
npx expo start
```

## Step 3: Start your Application

When the Metro Server is started, a menu will appear in the console. Just click the appropriate letter on the keyboard and the application for the corresponding platform will be launched:
1. a - Android
2. i - iOS
3. w - Web

You can also run this apps by using following commands:

```bash
npx expo start --android
npx expo start --ios
npx expo start --web
```

To run the app on a physical device, install the Expo Go app and then scan the QR code from the Metro menu with your phone

### That's it! Have fun using the FoodieFit app!


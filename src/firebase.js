import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
	apiKey: 'AIzaSyAPNFNFQTkHaIi02FTEN-bPRH5mYFFWbaE',
	authDomain: 'instagram-clone-f3d59.firebaseapp.com',
	databaseURL: 'https://instagram-clone-f3d59.firebaseio.com',
	projectId: 'instagram-clone-f3d59',
	storageBucket: 'instagram-clone-f3d59.appspot.com',
	messagingSenderId: '738060538246',
	appId: '1:738060538246:web:f84c55d61c6b944b4d9c07',
	measurementId: 'G-WZV33VZD51'
});

//Configuring firebase in react

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };

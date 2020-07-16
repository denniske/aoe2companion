import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

firebase.initializeApp({
    apiKey: 'AIzaSyDFQH2mPJS9Ocvd289ZF2t2BBzAGBLbyiw',
    authDomain: 'aoe-service.firebaseapp.com',
    projectId: 'aoe-service'
});

// Initialize Cloud Functions through Firebase
var functions = firebase.functions();

var deleteInactiveGamesTrigger = firebase.functions().httpsCallable('deleteInactiveGamesTrigger');

deleteInactiveGamesTrigger().then(function(result) {
    // Read result of the Cloud Function.
    console.log(result);
    var sanitizedMessage = result.data.text;
    console.log(sanitizedMessage);
});

console.log('done');

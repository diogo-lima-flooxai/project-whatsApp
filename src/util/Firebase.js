const firebase = require('firebase');
require('firebase/firestore');

export class Firebase{
  constructor(){
    this._config = {
      apiKey: "AIzaSyA0dKGwhUXPH2eqh9-cE6VKm9LmP_iI2j8",
      authDomain: "whatsapp-clone-7a8fb.firebaseapp.com",
      projectId: "whatsapp-clone-7a8fb",
      storageBucket: "whatsapp-clone-7a8fb.firebasestorage.app",
      messagingSenderId: "1006286873276",
      appId: "1:1006286873276:web:943eb78db91df633e4a6b9"
    }
    this.init();

  }

  init(){
    if(!window._initializedFirebase){
      firebase.initializeApp(this._config);

      firebase.firestore().settings({
        timestampsInSnapshots: true
      });
      window._initializedFirebase = true;
    }
  }

  static db(){
    return firebase.firestore();
  }

  static hd(){
    return firebase.storage();
  }

  initAuth(){
    return new Promise((s, f) => {
      let provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithPopup(provider)
      .then(result =>{
        let token = result.credential.accessToken;
        let user = result.user

        s({user, token});
      })
      .catch(err=>{
        f(err);
      });
    })
  }
}
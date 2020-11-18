import Vue from "vue";
import VueMeta from "vue-meta";
import Vuelidate from "vuelidate";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import dateFilter from "@/filters/date.filter";
import currencyFilter from "@/filters/currency.filter";
import localizeFilter from "@/filters/localize.filter";
import tooltipDirective from "@/directives/tooltip.directives";
import messagePlugin from "@/plugins/messages/message.plugin";
import titlePlugin from "@/plugins/title/title.plugin";
import Loader from "./components/app/Loader";
import Paginate from "vuejs-paginate";
import "./registerServiceWorker";
import "materialize-css/dist/js/materialize.min";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

Vue.config.productionTip = false;

Vue.use(messagePlugin);
Vue.use(titlePlugin);
Vue.use(Vuelidate);
Vue.use(VueMeta);
Vue.filter("date", dateFilter);
Vue.filter("currency", currencyFilter);
Vue.filter("localize", localizeFilter);
Vue.directive("tooltip", tooltipDirective);
Vue.component("Loader", Loader);
Vue.component("Paginate", Paginate);

firebase.initializeApp({
  apiKey: "AIzaSyDpMHa4GP-9sXIs79T5z4TGv7aQHLwLr2Q",
  authDomain: "vue-practice-6343b.firebaseapp.com",
  databaseURL: "https://vue-practice-6343b.firebaseio.com",
  projectId: "vue-practice-6343b",
  storageBucket: "vue-practice-6343b.appspot.com",
  messagingSenderId: "445083627830",
  appId: "1:445083627830:web:099e556669073b3d89c397"
});

let app;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});

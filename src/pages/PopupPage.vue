<template>
  <div class="row">
    <div class="col-12">
      <div class="title">Impactless Email</div>
      <div class="subtitle">CURRENT IMPACT</div>
    </div>
  </div>
  <div class="row inline" id="test">
    <img class="logo" src="~assets/leaf.png" alt="leaf logo" />
    <div class="data">
      <div class="numbers">28.42 g</div>
      <div class="data">CO2/email saved</div>
    </div>
  </div>
  <div class="row inline" id="test">
    <img class="logo" src="~assets/trash.png" alt="trash logo" />
    <div>
      <div class="numbers">12.302</div>
      <div class="data">Emails deleted</div>
    </div>
  </div>
  <div class="row inline" id="test">
    <img class="logo" src="~assets/server.png" alt="server logo" />
    <div>
      <div class="numbers">4.3 GB</div>
      <div class="data">Cloud Storage saved</div>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref, set } from "firebase/database";

export default {
  data() {
    return {
      emailId: null,
      token: null,
      emails: [],
      id: null,
    };
  },
  created() {
    chrome.storage.sync.get(["token"], (result) => {
      this.token = result.token;
    });
  },

  methods: {
    removeEmail() {
      console.log("Email ID: ", this.emailId);
      console.log("Token: ", this.token);

      fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/" +
          this.emailId +
          "?alt=json&access_token=" +
          this.token,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: null,
        }
      )
        .then((response) => console.log(response))
        .catch((error) => console.log("Something went wrong!", error));
    },

    getEmails() {
      fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/?alt=json&access_token=" +
          this.token
      )
        .then((response) => response.json())
        .then((data) => (this.emails = data.messages))
        .catch((error) => console.log("Something went wrong!", error));
    },

    getEmailInfo() {
      console.log(this.emails);
      this.id = this.emails[0]["id"];
      fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/" +
          this.id +
          "?alt=json&access_token=" +
          this.token
      )
        .then((response) => response.json())
        .then((data) => this.getEmailDate(data["payload"]["headers"]))
        .catch((error) => console.log("Something went wrong!", error));
    },

    getEmailDate(headers) {
      this.printDate(headers.filter(checkDate));

      function checkDate(info) {
        return info["name"] == "Date";
      }
    },

    printDate(date) {
      console.log(date);
    },

    writeUserInfo() {
      const db = getDatabase();
      console.log("writing in the database");
      set(ref(db, "emails/"), {
        email: "mail",
        amount: 4,
      });
    },
  },
};
</script>

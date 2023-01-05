<template>
  <div>Welcome to the extension to remove emails</div>
  <br />
  <div>
    <input type="text" placeholder="enter email id" v-model="emailId" />
    <button type="button" @click="removeEmail">Remove</button>
    <button type="button" @click="getEmails">Get emails</button>
    <button type="button" @click="getEmailInfo">Get email info</button>
    <button type="button" @click="writeUserInfo">Write User Info</button>
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
      set(ref(db, 'emails/'), {
      email: "mail",
      amount: 4
  });
    }
  },
};
</script>

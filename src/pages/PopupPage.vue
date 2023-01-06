<template>
  <div class="header">
    <div class="row">
      <div class="col-12">
        <div class="title">Impactless Email</div>
        <div class="subtitle">CURRENT IMPACTEDLESS</div>
      </div>
    </div>
    <div class="row inline" id="row">
      <img class="leaf" src="~assets/leaf.png" alt="leaf logo" />
      <div class="data">
        <div class="numbers">28.42 g</div>
        <div class="data">CO2/email saved</div>
      </div>
    </div>
    <div class="row inline" id="row">
      <img class="trash" src="~assets/trash.png" alt="trash logo" />
      <div>
        <div class="numbers">12.302</div>
        <div class="data">Emails deleted</div>
      </div>
    </div>
    <div class="row inline" id="row">
      <img class="server" src="~assets/server.png" alt="server logo" />
      <div>
        <div class="numbers">4.3 GB</div>
        <div class="data">Cloud Storage saved</div>
      </div>
    </div>
  </div>

  <div>
    <q-scroll-area style="height: 300px; width: 312px; background: white">
      <div class="q-ma-sm column q-none">
        <q-btn
          no-caps
          align="left"
          outline
          color="black"
          class="button"
          label="LinkedIn"
          size="xl"
          icon="navigate_next"
          @click="listEmailsPerQuery('CATEGORY_SOCIAL', 'LinkedIn')"
        />
      </div>

      <div class="q-ma-sm column q-none">
        <q-btn
          no-caps
          align="left"
          outline
          color="black"
          class="button"
          label="BAC Credomatic"
          size="xl"
          icon="navigate_next"
          @click="listEmailsPerQuery('CATEGORY_PROMOTIONS', 'BAC')"
        />
      </div>

      <div class="q-ma-sm column q-none">
        <q-btn
          no-caps
          align="left"
          outline
          color="black"
          class="button"
          label="Netflix"
          size="xl"
          icon="navigate_next"
          @click="listEmailsPerQuery('CATEGORY_PROMOTIONS', 'Netflix')"
        />
      </div>

      <div class="q-ma-sm column q-none">
        <q-btn
          no-caps
          align="left"
          outline
          color="black"
          class="button"
          label="Grammarly"
          size="xl"
          icon="navigate_next"
          @click="listEmailsPerQuery('CATEGORY_PROMOTIONS', 'Grammarly Insights')"
        />
      </div>

      <div class="q-ma-sm column q-none">
        <q-btn
          no-caps
          align="left"
          outline
          color="black"
          class="button"
          label="Apple Inc."
          size="xl"
          icon="navigate_next"
        />
      </div>

      <div class="q-ma-sm column q-none">
        <q-btn
          no-caps
          align="left"
          outline
          color="black"
          class="button"
          label="Samsung"
          size="xl"
          icon="navigate_next"
        />
      </div>

      <div class="q-ma-sm column q-none">
        <q-btn
          no-caps
          align="left"
          outline
          color="black"
          class="button"
          label="Mcdonald's"
          size="xl"
          icon="navigate_next"
        />
      </div>

      <div class="q-ma-sm column q-none">
        <q-btn
          no-caps
          align="left"
          outline
          color="black"
          class="button"
          label="Burger King"
          size="xl"
          icon="navigate_next"
        />
      </div>

      <div class="q-ma-sm column q-none">
        <q-btn
          no-caps
          align="left"
          outline
          color="black"
          class="button"
          label="Adidas"
          size="xl"
          icon="navigate_next"
        />
      </div>
    </q-scroll-area>
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
    listEmailsPerQuery(labelId, q) {
      let api = "https://gmail.googleapis.com/gmail/v1/users/me/messages/?";
      let maxResults = "500";
      let fetchUrl = `${api}labelIds=${labelId}&maxResults=${maxResults}&q=${q}&alt=json&access_token=${this.token}`;

      fetch(fetchUrl)
        .then((response) => response.json())
        .then((data) => this.writeToStorage(q, data.messages))
        .catch((error) => console.log("Something went wrong!", error));
    },

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

    writeToStorage(entity, emails) {
      console.log(emails);
      console.log(entity, emails.length);
      const db = getDatabase();
      console.log("writing in the database");
      set(ref(db, "emails/" + entity), {
        email_from: entity,
        amount: emails.length,
      });
    },
  },
};
</script>

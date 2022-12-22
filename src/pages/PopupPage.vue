<template>
  <div>Welcome to the extension to remove emails</div>
  <br />
  <div>
    <input type="text" placeholder="enter email id" v-model="emailId" />
    <button type="button" @click="removeEmail">Remove</button>
    <button type="button" @click="updateToken">Update token</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emailId: null,
      token: null,
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
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log("Something went wrong!", error);
        });
    },

    updateToken() {
      // get google OAuth Token
      chrome.identity.getAuthToken(
        {
          interactive: true,
        },
        function (token) {
          if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError.message);
            return;
          }

          console.log("NEW TOKEN: " + token);

          this.token = token;
        }
      );
    },
  },
};
</script>

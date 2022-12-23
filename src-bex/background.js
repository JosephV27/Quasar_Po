var token = null;

chrome.runtime.onInstalled.addListener(() => {
  console.log("The alarm was created");

  // Set up the initial token
  refreshToken();

  chrome.alarms.create("refreshTokenAlarm", {
    delayInMinutes: 60,
    periodInMinutes: 60,
  });
});

chrome.alarms.onAlarm.addListener(() => {
  console.log("The alarm was fired");
  refreshToken();
});

function refreshToken() {
  chrome.identity.getAuthToken(
    {
      interactive: true,
    },
    function (token) {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
        return;
      }

      console.log("TOKEN: " + token);

      // set up the token from the user profile
      chrome.storage.sync.set(
        {
          token: token,
        },
        function () {}
      );
    }
  );
}

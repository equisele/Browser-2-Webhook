chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get("myUrl", function (result) {
    if (!result.myUrl) {
      chrome.storage.sync.set({ "myUrl": "https://api.publicapis.org/health" }, function () {
        console.log("Default URL set in chrome.storage");
      });
    }
  });

  chrome.contextMenus.create({
    "id": "browser2Webhook",
    "title": "Browser 2 Webhook",
    contexts: ["page", "selection"],
  });


  chrome.contextMenus.create({
    "id": "sendText2webhook",
    "parentId": "browser2Webhook",
    "title": "Send Text to Webhook",
    "contexts": ["selection"],
    onclick: sendTextToWebhook
  });

  chrome.contextMenus.create({
    id: "sendUrl2Webhook",
    "parentId": "browser2Webhook",
    title: "Send Url to Webhook",
    contexts: ["page"],
    onclick: sendUrlToWebhook
  });
});

chrome.runtime.setUninstallURL("https://forms.gle/RwdWzM9X6JTMGh5V6", function () {
  chrome.storage.sync.remove("myUrl", function () {
    console.log("myUrl deleted from chrome.storage");
  });
});

function sendTextToWebhook(info, tab) {
  chrome.storage.sync.get("myUrl", function (data) {
    let url = data.myUrl;
    chrome.tabs.executeScript({
      code: `(function() {
        return {
          description: document.querySelector("meta[name='description']").getAttribute("content")
        };
      })();`
    }, function (results) {
      if (!results || !results[0]) {
        var description = 'No description';
      } else {
        var description = results[0].description;
      }
      if (!tab.title || tab.title === '') {
        var title = 'No title';
      } else {
        var title = tab.title;
      }
      if (!info.selectionText || info.selectionText === '') {
        var textSelection = 'No text selected';
      } else {
        var textSelection = info.selectionText;
      }
      if (!url.match(/^(http|https):\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)) {
        alert('This tab url is not valid! Please, use on a valid tab.');
        return;
      }
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          description: description,
          url: tab.url,
          text: textSelection
        })
      })
        .then(response => {
          if (response.ok) {
            alert('Done! Request successful!');
            console.log(response.status);
            console.log("Done! Request successful!");
          } else {
            throw new Error('Request failed!');
          }
        })
        .catch(error => {
          alert('Request failed!');
          console.log(response.status);
          console.log("Request failed!");
        });
    });
  });
}

function sendUrlToWebhook(info, tab) {
  chrome.storage.sync.get("myUrl", function (data) {
    let url = data.myUrl;
    chrome.tabs.executeScript({
      code: `(function() {
        return {
          description: document.querySelector("meta[name='description']").getAttribute("content")
        };
      })();`
    }, function (results) {
      if (!results || !results[0]) {
        var description = 'No description';
      } else {
        var description = results[0].description;
      }
      if (!tab.title || tab.title === '') {
        var title = 'No title';
      } else {
        var title = tab.title;
      }
      if (!url.match(/^(http|https):\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)) {
        alert('This tab url is not valid! Please, use on a valid tab.');
        return;
      }
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          description: description,
          url: tab.url
        })
      })
        .then(response => {
          if (response.ok) {
            alert('Done! Request successful!');
            console.log(response.status);
            console.log("Done! Request successful!");
          } else {
            throw new Error('Request failed!');
          }
        })
        .catch(error => {
          alert('Request failed!');
          console.log(response.status);
          console.log("Request failed!");
        });
    });
  });
}
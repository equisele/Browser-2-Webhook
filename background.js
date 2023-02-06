// Description: Background script for the browser action
chrome.runtime.onInstalled.addListener(function () {
  // Set default URL
  chrome.storage.sync.get("myUrl", function (result) {
    if (!result.myUrl || result.myUrl === '') {
      chrome.storage.sync.set({ "myUrl": "https://api.publicapis.org/health" }, function () {
        console.log("Default URL set in chrome.storage");
      });
    }
  });

  // Create main context menu
  chrome.contextMenus.create({
    "id": "browser2Webhook",
    "title": "Browser 2 Webhook",
    contexts: ["page", "selection", "image"],
  });

  // Create sub context menu for text selection
  chrome.contextMenus.create({
    "id": "sendText2webhook",
    "parentId": "browser2Webhook",
    "title": "Send Text to Webhook",
    "contexts": ["selection"],
    onclick: sendTextToWebhook
  });

  // Create sub context menu for page
  chrome.contextMenus.create({
    id: "sendUrl2Webhook",
    "parentId": "browser2Webhook",
    title: "Send Url to Webhook",
    contexts: ["page"],
    onclick: sendUrlToWebhook
  });
});

// Create sub context menu for image
chrome.contextMenus.create({
  id: "sendImage2Webhook",
  title: "Send Image to Webhook",
  contexts: ["image"]
});

// onUninstall listener to remove URL from chrome.storage
chrome.runtime.setUninstallURL("https://forms.gle/RwdWzM9X6JTMGh5V6", function () {
  // Remove URL from chrome.storage
  chrome.storage.sync.remove("myUrl", function () {
    console.log("myUrl deleted from chrome.storage");
  });
});

// onMessage listener for text selection
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

// onMessage listener for page
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

// onMessage listener for image to be sended to myUrl webhook
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  chrome.storage.sync.get("myUrl", function (data) {
    let url = data.myUrl;
    if (info.menuItemId === "sendImage2Webhook") {
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
        // Get the URL of the clicked image
        let imageUrl = info.srcUrl;
        // Check if image url is not base64 yet
        if (imageUrl.includes('base64')) {
          // send image to webhook as base64
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: title,
              description: description,
              url: tab.url,
              image: imageUrl
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
        } else {
          // Convert the image to a binary string
          fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
              let reader = new FileReader();
              reader.onloadend = function () {
                // send image to webhook as base64
                fetch(url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    title: title,
                    description: description,
                    url: tab.url,
                    image: reader.result
                  })
                })
                  .then(response => {
                    if (response.ok) {
                      alert('Done! Request successful!');
                      console.log(response.status);
                      console.log("Done! Request successful!");
                    } else {
                      console.log("Request failed!");
                      throw new Error('Request failed!');
                    }
                  })
                  .catch(error => {
                    alert('Request failed!');
                    console.log(response.status);
                    console.log("Request failed!");
                  });
              }
              reader.readAsDataURL(blob);
            });
        }
      });
    }
  });
});

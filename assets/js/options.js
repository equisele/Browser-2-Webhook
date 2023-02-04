chrome.storage.sync.get(['myUrl'], checkSync);
document.getElementById("save").addEventListener("click", saveUrl);
document.getElementById('try').addEventListener('click', tryUrl);
document.getElementById('delete').addEventListener('click', resetUrl);
document.getElementById('about').addEventListener('click', about);
document.getElementById('make').addEventListener('click', make);
document.getElementById('ifttt').addEventListener('click', ifttt);
document.getElementById('youtube').addEventListener('click', youtube);
document.getElementById('help').addEventListener('click', help);

function saveUrl(event) {
  event.preventDefault();
  var url = document.getElementById("url").value;
  if (!url) {
    alert('Please enter a URL');
    return;
  }
  if (!url.match(/^(http|https):\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)) {
    alert('Please enter a valid URL');
    return;
  }
  chrome.storage.sync.set({ 'myUrl': url }, function () {
    alert('URL saved successfully');
    console.log("URL guardada en chrome.storage: " + url);
  });
}
function tryUrl(event) {
  event.preventDefault();
  chrome.storage.sync.get(['myUrl'], function (result) {
    var fieldUrl = document.getElementById("url").value;
    if (!result.myUrl || !fieldUrl) {
      alert('Please set a URL first and press save button');
      return;
    }
    var url = result.myUrl;
    fetch(url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          title: 'test title',
          description: 'test description',
          url: 'https://api.publicapis.org/'
        })
      })
      .then(res => {
        if (res.ok) {
          tryMessage(res)
          console.log(res.status);
          return res.json();
        } else {
          tryMessage(res);
          throw new Error(res.statusText);
        }
      })

      .catch(error => alert(`Error: ${error}`));
  });
}

function resetUrl(event) {
  event.preventDefault();
  document.getElementById("url").value = 'https://api.publicapis.org/health';
  chrome.storage.sync.set({ 'myUrl': 'https://api.publicapis.org/health' }, function () {
    alert('URL reset successfully! Don\'t forget to store a new one!');
    console.log("URL reseteada en chrome.storage");
  });
}

function checkSync(result) {
  var url = result.myUrl;
  if (url) {
    document.getElementById("url").value = url;
  }
}

function tryMessage(res) {
  var statusMsg = document.getElementById('status');
  statusMsg.style.display = 'block';
  if (res.ok) {
    statusMsg.style.backgroundColor = 'green';
    statusMsg.innerHTML = 'Request successful!';
  } else {
    statusMsg.style.backgroundColor = 'red';
    statusMsg.innerHTML = 'Request failed!';
  }
  setTimeout(function () {
    document.getElementById('status').style.display = 'none';
  }, 5000);

}

function about() {
  chrome.tabs.create({ url: "https://twitter.com/equisele" });
}

function make() {
  chrome.tabs.create({ url: "https://www.make.com/en/register?pc=equisele" });
}

function ifttt() {
  chrome.tabs.create({ url: "https://ifttt.com/join?referral_code=cLdgjkYTxFCULXIZMDLZDs616s6hudXA" });
}

function youtube() {
  chrome.tabs.create({ url: "https://equisele.com/browser-to-webhook-chrome-extension/" });
}

function help() {
  var help = document.getElementById('helpBox');
  if (help.style.display === 'block') {
    help.style.display = 'none';
  } else {
    help.style.display = 'block';
  }
}

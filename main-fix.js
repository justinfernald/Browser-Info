"use strict";

window.onload = load;

function load() {
  var infoElement = document.getElementById("info");
  var GIE = generateInfoElement;
  var BI = getBrowserInfo();

  getInternetInfo(function (err, data) {
    if (err) {
      infoElement.querySelector("#isp .value>span").innerText = "Unknown";
    } else {
      infoElement.querySelector("#isp .value>span").innerText = data.organization ? data.organization : "Unknown";
    }
  });

  infoElement.innerHTML = 
  GIE("os", "OS", BI.os.name + " " + BI.os.version) + 
  GIE("browser", "Browser", BI.browser.name + " " + BI.browser.version) + 
  GIE("cookies", "Cookies", BI.cookies ? "Enabled" : "Disabled") + 
  GIE("screen", "Window", BI.viewport.layout.width + " x " + BI.viewport.layout.height) + 
  GIE("timezone", "Time", BI.timezone) + 
  GIE("isp", "ISP", "Loading...");

  document.body.classList.add("loaded");
}

function generateInfoElement(id, name, data) {
  return "\n    <div class=\"info-wrap\">\n      <div class=\"info-data\" id=" + id + ">\n          <span class=\"name\">\n            <span>" + name + "</span>\n          </span>\n          <span class=\"value\">\n            <span>" + data + "</span>\n          </span>\n      </div>\n    </div>\n    ";
}

function getInternetInfo(callback) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      callback(null, JSON.parse(xhr.response));
    }
  }
  xhr.open("GET", "https://api.ip.sb/geoip");
  try {
    xhr.send();
  } catch (error) {
    callback(error);
  }
}

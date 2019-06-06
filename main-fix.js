"use strict";

window.onload = load;

function load() {
  console.log("a");
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

  infoElement.innerHTML = GIE("os", "OS", BI.os + " " + BI.osVersion) + GIE("browser", "Browser", BI.browser + " " + BI.browserVersion) + GIE("mobile", "Mobile", BI.mobile ? "Is Mobile" : "Not Mobile") + GIE("cookies", "Cookies", BI.cookies ? "Enabled" : "Disabled") + GIE("screen", "Screen", BI.screenSize) + GIE("isp", "ISP", "Loading...");

  document.body.classList.add("loaded");
}

function generateInfoElement(id, name, data) {
  return "\n    <div class=\"info-wrap\">\n      <div class=\"info-data\" id=" + id + ">\n          <span class=\"name\">\n            <span>" + name + "</span>\n          </span>\n          <span class=\"value\">\n            <span>" + data + "</span>\n          </span>\n      </div>\n    </div>\n    ";
}
  
function getInternetInfo(callback) {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
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

function getBrowserInfo() {
  var unknown = "Unknown";

  var screenSize = "";
  if (screen) {
    var width = screen.width ? screen.width : "";
    var height = screen.height ? screen.height : "";
    screenSize = width + " x " + height;
  }

  var nVer = navigator.appVersion;
  var nAgt = navigator.userAgent;
  var browser = navigator.appName;
  var browserVersion = parseFloat(navigator.appVersion);
  var majorVersion = parseInt(navigator.appVersion, 10);
  var nameOffset = void 0,
      verOffset = void 0,
      ix = void 0;

  if ((verOffset = nAgt.indexOf("Opera")) != -1) {
    browser = "Opera";
    browserVersion = nAgt.substring(verOffset + 6);
    if ((verOffset = nAgt.indexOf("Version")) != -1) {
      browserVersion = nAgt.substring(verOffset + 8);
    }
  } else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
    browser = "Microsoft Internet Explorer";
    browserVersion = nAgt.substring(verOffset + 5);
  } else if (browser == "Netscape" && nAgt.indexOf("Trident/") != -1) {
    browser = "Microsoft Internet Explorer";
    browserVersion = nAgt.substring(verOffset + 5);
    if ((verOffset = nAgt.indexOf("rv:")) != -1) {
      browserVersion = nAgt.substring(verOffset + 3);
    }
  } else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
    browser = "Chrome";
    browserVersion = nAgt.substring(verOffset + 7);
  } else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
    browser = "Safari";
    browserVersion = nAgt.substring(verOffset + 7);
    if ((verOffset = nAgt.indexOf("Version")) != -1) {
      browserVersion = nAgt.substring(verOffset + 8);
    }
    if (nAgt.indexOf("CriOS") != -1) {
      browser = "Chrome";
    }
  } else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
    browser = "Firefox";
    browserVersion = nAgt.substring(verOffset + 8);
  } else if ((nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/"))) {
    browser = nAgt.substring(nameOffset, verOffset);
    browserVersion = nAgt.substring(verOffset + 1);
    if (browser.toLowerCase() == browser.toUpperCase()) {
      browser = navigator.appName;
    }
  }
  if ((ix = browserVersion.indexOf(";")) != -1) browserVersion = browserVersion.substring(0, ix);
  if ((ix = browserVersion.indexOf(" ")) != -1) browserVersion = browserVersion.substring(0, ix);
  if ((ix = browserVersion.indexOf(")")) != -1) browserVersion = browserVersion.substring(0, ix);

  majorVersion = parseInt(browserVersion, 10);
  if (isNaN(majorVersion)) {
    browserVersion = "" + parseFloat(navigator.appVersion);
    majorVersion = parseInt(navigator.appVersion, 10);
  }

  var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

  var cookies = navigator.cookieEnabled;

  if (typeof navigator.cookieEnabled == "undefined" && !cookies) {
    document.cookie = "test-cookie";
    cookies = document.cookie.indexOf("test-cookie") != -1 ? true : false;
  }

  var os = unknown;
  var clientStrings = [{
    s: "Windows 3.11",
    r: /Win16/
  }, {
    s: "Windows 95",
    r: /(Windows 95|Win95|Windows_95)/
  }, {
    s: "Windows ME",
    r: /(Win 9x 4.90|Windows ME)/
  }, {
    s: "Windows 98",
    r: /(Windows 98|Win98)/
  }, {
    s: "Windows CE",
    r: /Windows CE/
  }, {
    s: "Windows 2000",
    r: /(Windows NT 5.0|Windows 2000)/
  }, {
    s: "Windows XP",
    r: /(Windows NT 5.1|Windows XP)/
  }, {
    s: "Windows Server 2003",
    r: /Windows NT 5.2/
  }, {
    s: "Windows Vista",
    r: /Windows NT 6.0/
  }, {
    s: "Windows 7",
    r: /(Windows 7|Windows NT 6.1)/
  }, {
    s: "Windows 8.1",
    r: /(Windows 8.1|Windows NT 6.3)/
  }, {
    s: "Windows 8",
    r: /(Windows 8|Windows NT 6.2)/
  }, {
    s: "Windows 10", //Windows NT 4.0
    r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
  }, {
    s: "Windows ME",
    r: /Windows ME/
  }, {
    s: "Android",
    r: /Android/
  }, {
    s: "Open BSD",
    r: /OpenBSD/
  }, {
    s: "Sun OS",
    r: /SunOS/
  }, {
    s: "Linux",
    r: /(Linux|X11)/
  }, {
    s: "iOS",
    r: /(iPhone|iPad|iPod)/
  }, {
    s: "Mac OS X",
    r: /Mac OS X/
  }, {
    s: "Mac OS",
    r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
  }, {
    s: "QNX",
    r: /QNX/
  }, {
    s: "UNIX",
    r: /UNIX/
  }, {
    s: "BeOS",
    r: /BeOS/
  }, {
    s: "OS/2",
    r: /OS\/2/
  }, {
    s: "Search Bot",
    r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
  }];
  for (var id in clientStrings) {
    var cs = clientStrings[id];
    if (cs.r.test(nAgt)) {
      os = cs.s;
      break;
    }
  }

  var osVersion = unknown;

  if (/Windows/.test(os)) {
    osVersion = /Windows (.*)/.exec(os)[1];
    if (navigator.userAgent.indexOf("WOW64") != -1 || navigator.userAgent.indexOf("Win64") != -1) {
      osVersion += " (64-bit)";
    } else {
      osVersion += " (32-bit)";
    }
    os = "Windows";
  }

  switch (os) {
    case "Mac OS X":
      osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
      break;

    case "Android":
      osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
      break;

    case "iOS":
      osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
      osVersion = osVersion[1] + "." + osVersion[2] + "." + (osVersion[3] | 0);
      break;
  }

  return {
    screenSize: screenSize,
    browser: browser,
    browserVersion: browserVersion,
    mobile: mobile,
    os: os,
    osVersion: osVersion,
    cookies: cookies
  };
}
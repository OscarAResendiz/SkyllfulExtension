// Content script
// Listener for download button click event
let rebuiltWebPage = document.createElement("html");

chrome.runtime.onMessage.addListener(function (msg) {
  console.log("Message received: " + msg);
  if (msg == "websiteDownloadButton") {
    recursiveParse(document.documentElement.childNodes, rebuiltWebPage);

    // get a list of all the <img> from the DOM
    let domImages = rebuiltWebPage.getElementsByTagName("img");

    // loop through each img, getting the base64 string and then setting that img src to the base64 url
    for (let i = 0; i < domImages.length; i++) {
      toDataURL(domImages[i].src, function (dataUrl) {
        rebuiltWebPage.getElementsByTagName("img")[i].src = dataUrl;
        console.log("RESULT:", dataUrl);
        console.log("----------------NEXT------------");
      });
    }

    console.log("END OF IMAGES");

    // regex for replacing script tags from the DOM
    const regexp = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

    // new DOM with the scripts removed
    let noScriptsDOM = rebuiltWebPage.outerHTML.replace(regexp, " ");

    console.log("NO SCRIPTS DOM:", noScriptsDOM);
    console.log("--------------- END ---------------");

    // Save DOM variable into a new file, prompt save dialog pop up when clicking on button

    let doctypeHeader = "<!DOCTYPE html>";
    let f = new File([doctypeHeader, noScriptsDOM], "msg.html", {
      type: "text/html",
    });
    let a = document.createElement("a");

    let url = window.URL.createObjectURL(f);
    a.href = url;
    a.download = "msg.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
});

function recursiveParse(node: NodeListOf<ChildNode>, parentNode: Node) {
  for (const nodeElement of node) {
    if (nodeElement.hasChildNodes() && nodeElement.nodeType != 3) {
      parentNode.appendChild(nodeElement.cloneNode());

      if (parentNode.lastChild != null) {
        recursiveParse(nodeElement.childNodes, parentNode.lastChild);
      }
    } else {
      // }else if(parentNode.nodeType!=3){
      parentNode.appendChild(nodeElement.cloneNode());
    }
  }
}

function toDataURL(
  url: string | URL,
  callback: { (dataUrl: any): void; (arg0: string | ArrayBuffer | null): void }
) {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    let reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.send();
}

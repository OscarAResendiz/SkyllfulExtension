(()=>{"use strict";let e=document.createElement("html");function o(e,t){for(const l of e)l.hasChildNodes()&&3!=l.nodeType?(t.appendChild(l.cloneNode()),null!=t.lastChild&&o(l.childNodes,t.lastChild)):t.appendChild(l.cloneNode())}chrome.runtime.onMessage.addListener((function(t){if(console.log("Message received: "+t),"websiteDownloadButton"==t){o(document.documentElement.childNodes,e);const t=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;let l=e.outerHTML.replace(t," ");console.log("NO SCRIPTS DOM:",l),console.log("--------------- END ---------------");let d=new File(["<!DOCTYPE html>",l],"msg.html",{type:"text/html"}),n=document.createElement("a"),c=window.URL.createObjectURL(d);n.href=c,n.download="msg.html",document.body.appendChild(n),n.click(),document.body.removeChild(n),window.URL.revokeObjectURL(c)}}))})();
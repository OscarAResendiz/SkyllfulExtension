// Content script
// Listener for download button click event
let rebuiltWebPage = document.createElement('html');

chrome.runtime.onMessage.addListener(function (msg) {
    console.log("Message received: " + msg);
    if (msg == "websiteDownloadButton") {

        recursiveParse(document.documentElement.childNodes,rebuiltWebPage);

        // regex for replacing script tags from the DOM
        const regexp = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

        // new DOM with the scripts removed
        let noScriptsDOM = rebuiltWebPage.outerHTML.replace(regexp, " ");
        
        console.log("NO SCRIPTS DOM:", noScriptsDOM);
        console.log("--------------- END ---------------");
        //console.log("Final HTML: ", rebuiltWebPage);

        
        // Save DOM variable into a new file, prompt save dialog pop up when clicking on button

        let doctypeHeader = "<!DOCTYPE html>";
        let f = new File([doctypeHeader, noScriptsDOM], "msg.html", { type: "text/html" });
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

function recursiveParse(node: NodeListOf<ChildNode>,parentNode: Node) {
    for (const nodeElement of node) {

        if(nodeElement.hasChildNodes() && nodeElement.nodeType != 3) {

            parentNode.appendChild(nodeElement.cloneNode());

            if (parentNode.lastChild != null) {
                recursiveParse(nodeElement.childNodes, parentNode.lastChild)
            }
        }else{
        // }else if(parentNode.nodeType!=3){
            parentNode.appendChild(nodeElement.cloneNode())
        }
    }
};
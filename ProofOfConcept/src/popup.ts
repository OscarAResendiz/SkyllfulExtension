// Popup script
// Add event listener for download button 

const button = document.getElementById("websiteDownloadButton");

if(button != null){

    button.addEventListener("click", function() {
        let params = {
            active: true,
            currentWindow: true
        }
        chrome.tabs.query(params, function(tabs){
            console.log("Sending message to tab");
            chrome.tabs.sendMessage(tabs[0].id ? tabs[0].id : -1, "websiteDownloadButton");
        })
    });

}

//function used to load menu bar on pages
function setFrame(frame,container,elementName){
    document.getElementById(container).innerHTML = frame.contentWindow.document.getElementById(elementName).innerHTML;
}
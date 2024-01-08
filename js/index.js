//function used to load menu bar on pages
function setFrame(frame,container,elementName){
    document.getElementById(container).innerHTML = frame.contentWindow.document.getElementById(elementName).innerHTML;
}

//function to import project data from json file using jquery
function renderPage(page_category = 'all'){
    console.log('got this far 0');
    $.getJSON("/json/projects.json", function(data){//import json data
        console.log(data.projects.length);
        for (var i = 0; i < data.projects.length; i++){ //iterate over the projects in the json
            if(data.projects[i].categories.includes(page_category) || page_category == 'all'){
                addProject(data.projects[i].id, data.projects[i].title, data.projects[i].categories, data.projects[i].bodytext, data.projects[i].imagetext); //for each project render and append
            }
        }
    })
}

//function to append a div for a project with imported data
function addProject(id, title, categories, bodytext, imagetext){
    $('body').append(`
    <div class="maintext" id="${id}">
        <h1><strong>${title}</h1>
		${imagetext}
        <p class="indented">${bodytext}</p>
	</div>
    `);
}
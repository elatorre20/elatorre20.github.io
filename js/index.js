//function used to load menu bar on pages
function setFrame(frame,container,elementName){
    document.getElementById(container).innerHTML = frame.contentWindow.document.getElementById(elementName).innerHTML;
}

function normalizeCategories(categories){
    if (Array.isArray(categories)) {
        return categories
            .flatMap((category) => String(category).split(','))
            .map((category) => category.trim().toLowerCase())
            .filter(Boolean);
    }

    return String(categories || '')
        .split(',')
        .map((category) => category.trim().toLowerCase())
        .filter(Boolean);
}

function formatCategoryLabel(category){
    return category.charAt(0).toUpperCase() + category.slice(1);
}

function createFilterBar(categories, selectedCategory){
    const filterBar = $(
        '<div class="filterbar" aria-label="Project filters">' +
            '<span class="filterbar__label">Filter by tag</span>' +
            '<div class="filterbar__options" role="group" aria-label="Project tag filters"></div>' +
        '</div>'
    );

    const allCategories = ['all', ...categories];

    allCategories.forEach((category) => {
        const isSelected = category === selectedCategory;
        const button = $('<button type="button" class="filterbar__option"></button>')
            .text(formatCategoryLabel(category))
            .attr('aria-pressed', String(isSelected))
            .toggleClass('is-selected', isSelected)
            .on('click', function () {
                renderPage(category);
            });

        filterBar.find('.filterbar__options').append(button);
    });

    return filterBar;
}

//function to import project data from json file using jquery
function renderPage(page_category = 'all'){
    $.getJSON('/json/projects.json', function(data){//import json data
        const projects = data.projects.map((project) => ({
            ...project,
            categories: normalizeCategories(project.categories)
        }));
        const categories = [...new Set(projects.flatMap((project) => project.categories))].sort();

        $('.filterbar, .maintext').remove();
        $('body').append(createFilterBar(categories, page_category));

        projects.forEach((project) => {
            if (page_category === 'all' || project.categories.includes(page_category)) {
                addProject(project.id, project.title, project.categories, project.bodytext, project.imagetext); //for each project render and append
            }
        });
    });
}

//function to append a div for a project with imported data
function addProject(id, title, categories, bodytext, imagetext){
    const categoryChips = categories
        .map((category) => `<span class="project-tag">${formatCategoryLabel(category)}</span>`)
        .join('');

    $('body').append(`
    <div class="maintext" id="${id}">
        <div class="project-header">
            <h1><strong>${title}</strong></h1>
            <div class="project-tags" aria-label="Project tags">${categoryChips}</div>
        </div>
		${imagetext}
        <p class="indented">${bodytext}</p>
	</div>
    `);
}

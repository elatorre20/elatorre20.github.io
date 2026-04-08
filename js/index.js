//function used to load menu bar on pages
function setFrame(frame,container,elementName){
    document.getElementById(container).innerHTML = frame.contentWindow.document.getElementById(elementName).innerHTML;
}

function formatCategoryLabel(category){
    if (category.toLowerCase() === 'cad') {
        return 'CAD';
    }

    return category.charAt(0).toUpperCase() + category.slice(1);
}

function createFilterBar(categories, selectedCategory){
    const filterBar = $(
        '<div class="filterbar" aria-label="Project filters">' +
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

function parseProjectDate(dateTag){
    const [month, year] = String(dateTag || '01/1970').split('/').map(Number);
    return {
        month: Number.isFinite(month) ? month : 1,
        year: Number.isFinite(year) ? year : 1970
    };
}

function compareProjectsByDate(leftProject, rightProject){
    const leftDate = parseProjectDate(leftProject.date);
    const rightDate = parseProjectDate(rightProject.date);

    if (leftDate.year !== rightDate.year) {
        return rightDate.year - leftDate.year;
    }

    if (leftDate.month !== rightDate.month) {
        return rightDate.month - leftDate.month;
    }

    return leftProject.originalIndex - rightProject.originalIndex;
}

function renderMediaItem(item){
    if (item.kind === 'iframe') {
        const allowfullscreen = item.allowfullscreen ? ' allowfullscreen' : '';
        const allow = item.allow ? ` allow="${item.allow}"` : '';
        const frameborder = item.frameborder ? ` frameborder="${item.frameborder}"` : '';
        const width = item.width ? ` width="${item.width}"` : '';
        const height = item.height ? ` height="${item.height}"` : '';

        return `<iframe src="${item.src}" title="${item.title || ''}"${width}${height}${frameborder}${allow}${allowfullscreen}></iframe>`;
    }

    const style = item.style ? ` style="${item.style}"` : '';
    const width = item.width ? ` width="${item.width}"` : '';
    const height = item.height ? ` height="${item.height}"` : '';

    return `<img src="${item.src}" alt="${item.alt || ''}"${style}${width}${height}>`;
}

function renderContentBlock(block){
    if (block.type === 'media') {
        const layoutClass = block.layout === 'stack' ? ' project-media--stack' : '';
        const items = block.items.map(renderMediaItem).join('');
        return `<div class="project-media${layoutClass}">${items}</div>`;
    }

    const className = block.className ? ` class="${block.className}"` : '';
    return `<p${className}>${block.html}</p>`;
}

//function to import project data from json file using jquery
function renderPage(page_category = 'all'){
    $.getJSON('/json/projects.json', function(data){//import json data
        const projects = data.projects
            .map((project, originalIndex) => ({ ...project, originalIndex }))
            .sort(compareProjectsByDate);
        const categories = [...new Set(projects.flatMap((project) => project.categories))].sort();

        $('.filterbar, .maintext').remove();
        $('body').append(createFilterBar(categories, page_category));

        projects.forEach((project) => {
            if (page_category === 'all' || project.categories.includes(page_category)) {
                addProject(project.id, project.title, project.content); //for each project render and append
            }
        });
    });
}

//function to append a div for a project with imported data
function addProject(id, title, content){
    const renderedContent = content.map(renderContentBlock).join('');

    $('body').append(`
    <div class="maintext" id="${id}">
        <h1><strong>${title}</strong></h1>
        ${renderedContent}
    </div>
    `);
}

function init(){
    document.querySelector('.search').addEventListener('submit',handlesearch);
}

function handlesearch(event){
    event.preventDefault();
}


init();
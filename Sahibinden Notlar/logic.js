var ad;

async function getAd() {
    const adBox =  document.getElementById("classifiedId");
    ad = adBox.getAttribute("data-classifiedid");
}

function getAdFromUrl() {
    const url =  window.location.toString();
    const startIndex = url.search('/ilan/') + 6;
    const lastIndex = url.search('/detay');
    const partsOfAd = url.slice(startIndex, lastIndex).split('-');

    ad = partsOfAd[partsOfAd.length - 1];
}

async function addNoteBox() {
    const classifiedOtherBoxes = document.getElementsByClassName("classifiedOtherBoxes");
    const classifiedOtherBox = classifiedOtherBoxes[0];

    if(classifiedOtherBox == undefined){
        return Promise.reject("removed");
    }

    return fetch(chrome.runtime.getURL('/noteElement.html'))
    .then(file => file.text())
    .then(content => {
        const div = document.createElement('div');
        div.innerHTML = content.trim();
        
        classifiedOtherBox.appendChild(div);
        console.log(content)
    })
}

async function getSavedNote() {
    console.log("ad: " + ad)
    return chrome.storage.local.get([ad], result => {
        const noteArea = document.getElementById('noteArea');
        if(Object.keys(result).length != 0){
            noteArea.value = result[ad];
        }
    });
}

async function saveNote() {
    const noteArea = document.getElementById('noteArea');
    const note = noteArea.value;

    return chrome.storage.local.set({[ad]:  note}).then(() => {
        const saveButton = document.getElementById('saveButton');
        saveButton.textContent  = "Kaydedildi...";

        setTimeout(() => {
            saveButton.textContent  = "Kaydet";
        }, 1500);
    });
}
        
addNoteBox()
.then(getAd)
.then(getSavedNote)
.then(async () => {
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', saveNote);
}).catch((err) => {
    
    if(err == "removed"){
        getAdFromUrl();
        chrome.storage.local.remove([ad], () => console.log("Deleted from storage"));
    }
})
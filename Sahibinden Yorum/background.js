chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create(
        {
            title: "Tüm notları sil",
            id: "tumNotlariSil",
            contexts: ["action"]
        }
    );
});

chrome.contextMenus.onClicked.addListener(
    (info) => {
        if(info.menuItemId == "tumNotlariSil"){
            chrome.storage.local.clear();
            chrome.notifications.create(
                {
                    iconUrl: "icon.png",
                    type: "basic",
                    title: "Sahibinden Notlar",
                    message: "Tüm notlar silindi!"
                }
            );
        }
    }
);
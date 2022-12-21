let root = document.body;
root.style.backgroundImage = `url("${document.location + "asset/wallpaper/default.jpg"}")`
root.style.backgroundSize  = "cover"
lastWindowID = 1;
defaultWindowOption = {
    closeText: "X"
}
$(".window").dialog(defaultWindowOption);

function createWindow(title) {
    lastWindowID++;

    newWindow = $.parseHTML(`
        <div class="window" id="win-${lastWindowID}">
            <p>My ID is window ${lastWindowID}</p>
        </div>
    `)

    document.body.append(newWindow[1])

    newWindowOption = defaultWindowOption;
    newWindowOption["title"] = title || defaultWindowOption.title;

    $(".window").dialog(defaultWindowOption)

    return newWindow;
}
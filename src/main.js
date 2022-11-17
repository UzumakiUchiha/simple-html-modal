window.shm_counter = 0;
const popupV3 = (options) => {
    const settings = Object.assign({ type: "success", id: "shm_" + new Date().getTime(), timeout: -1, title: null, backdrop: true, content: "", classes: "", actions: [], modalOpenClass: "simple-modal-open", size: "", pos: ""}, options);
    if (settings.title === null) settings.title = settings.type;

    // could have used template literal but it doesn't minify to a single line using uglify-js
    const dialog_html = '<div class="dialog-container">' +
        '<div class="dialog-content">' +
            '<div class="dialog-header">' +
                '<h5 class="dialog-title">' + settings.title + '</h5>' +
                '<button class="close" aria-label="Close">&times;</button>' +
            '</div>' +
            '<div class="dialog-body"></div>' +
            '<div class="dialog-footer"></div>' +
        '</div>' +
    '</div>';

    const dialog = document.createElement("dialog");
    dialog.id = settings.id;
    dialog.classList.add(`dialog-${settings.type}`);
    if (settings.classes != "") dialog.classList.add(...`${settings.classes}`.split(" "));
    dialog.innerHTML = dialog_html;
    dialog.setAttribute("shm", "");
    dialog.setAttribute("dialog-size", settings.size);
    dialog.setAttribute("data-pos", settings.pos)
    dialog.querySelector('.dialog-header').classList.add(`dialog-${settings.type}`);
    dialog.querySelector('.dialog-body').innerHTML = settings.content;

    const closeDialog = () => dialog.close();
    dialog.querySelector('.dialog-header .close').addEventListener('click', closeDialog);
    dialog.addEventListener('close', () => {
        dialog.parentElement.removeChild(dialog);
        if (settings.backdrop) window.shm_counter--;
        if (window.shm_counter < 1) {
            document.body.classList.remove(settings.modalOpenClass);
        }
    });

    dialog.addEventListener('click', function (event) {
        event.stopPropagation();
        let rect = dialog.getBoundingClientRect();
        let isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) closeDialog();
    });

    settings.actions.forEach((action, i) => {        
        let btn = document.createElement("button");
        btn.innerHTML = action.text;
        btn.class = `btn ${action?.classes}`;

        btn.addEventListener('click', () => {
            if(action.do) action.do();
            if(action.dismiss) closeDialog();
        });

        dialog.querySelector('.dialog-footer').appendChild(btn);
    });
    document.body.appendChild(dialog);

    if (settings.backdrop) {
        window.shm_counter++;
        dialog.classList.add('is-modal');
        document.body.classList.add(settings.modalOpenClass);
        dialog.showModal();
    } else {
        dialog.show();
    }

    if (dialog.classList.contains("notification") && settings.timeout <= 0) {
        settings.timeout = 2000;
    }

    if (settings.timeout > 0) setTimeout(closeDialog, settings.timeout);

    return dialog;
}
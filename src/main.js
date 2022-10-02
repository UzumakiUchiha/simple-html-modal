window.simple_dialogs_counter = 0;
const popupV3 = (options) => {
    const settings = Object.assign({type: "success", timeout: -1, title: "", backdrop: true, content: "", classes: "", actions: [], modalOpenClass: "simple-modal-open"}, options);

    const dialog_html = '<div class="dialog-container">' +
        '<div class="dialog-content">' +
            '<div class="dialog-header">' +
                '<h5 class="dialog-title"></h5>' +
                '<button type="button" class="close" data-dismiss="dialog" aria-label="Close">&times;</button>' +
            '</div>' +
            '<div class="dialog-body"></div>' +
            '<div class="dialog-footer"></div>' +
        '</div>' +
    '</div>';

    const dialog = window.dialog = document.createElement("dialog");
    dialog.innerHTML = dialog_html;
    dialog.classList.add(`dialog-${settings.type}`);
    dialog.querySelector('.dialog-header').classList.add(`dialog-${settings.type}`);
    dialog.querySelector('.dialog-body').innerHTML = settings.content;

    const closeDialog = () => {
        dialog.close();
        dialog.parentElement.removeChild(dialog);
        window.simple_dialogs_counter--;
        if(window.simple_dialogs_counter < 1) {
            document.body.classList.remove(settings.modalOpenClass);
        }
    }

    dialog.querySelector('.dialog-header .close').addEventListener('click', closeDialog);

    settings.actions.forEach((action,i) => {        
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
        window.simple_dialogs_counter++;
        dialog.classList.add('is-modal');
        document.body.classList.add(settings.modalOpenClass);
        dialog.showModal();
    } else {
        dialog.show();
    }

    if(settings.timeout > 0) closeDialog();
}
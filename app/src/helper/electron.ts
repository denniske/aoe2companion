
export function initializeElectron() {
    if (eval('typeof require') !== 'undefined') {
        const win = eval(`require('electron').remote.getCurrentWindow()`);
        win.setIgnoreMouseEvents(false);

        setTimeout(() => {
            const el = document.getElementById('container');
            el!.addEventListener('mouseenter', () => {
                console.log('mouseenter');
                win.setIgnoreMouseEvents(false)
            });
            el!.addEventListener('mouseleave', () => {
                console.log('mouseleave');
                win.setIgnoreMouseEvents(true, { forward: true })
            });
        }, 500);
    }
}

// win.setIgnoreMouseEvents(true, { forward: true });

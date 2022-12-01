export default class Download {
    constructor(triggers) {
        this.btns = document.querySelectorAll(triggers);
        this.path = 'assets/img/mainbg.jpg';
    }

    downloadFile(path) {
        const elementLink = document.createElement('a');

        elementLink.setAttribute('href', path);

        elementLink.setAttribute('download', 'good_picture');
        elementLink.style.display = 'none';
        document.body.appendChild(elementLink);
        elementLink.click(event.stopPropagation());
        document.body.removeChild(elementLink);
    }

    init() {
        this.btns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.downloadFile(this.path);
            });
        });
    }
}
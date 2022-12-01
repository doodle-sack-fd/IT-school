export default class VideoPlayer {
    constructor(triggers, popup) {
        this.btns = document.querySelectorAll(triggers);
        this.popup = document.querySelector(popup);
        this.close = this.popup.querySelector('.close');
        this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
    }

    bindTriggers() {
        this.btns.forEach((btn, i) => {
            try {
                const blockedElem = btn.closest('.module__video-item').nextElementSibling;

                if (i % 2 == 0) {
                    blockedElem.setAttribute('data-disabled', 'true');
                }
            } catch (error) { }

            btn.addEventListener('click', () => {
                if (!btn.closest('.module__video-item')  || btn.closest('.module__video-item').getAttribute('data-disabled') !== 'true') {
                    this.activeBtn = btn;

                    if (document.querySelector('iframe#frame')) {
                        this.popup.style.display = 'flex';
                        if (this.path !== btn.getAttribute('data-url')) {
                            this.path = btn.getAttribute('data-url');
                            this.player.loadVideoById({ videoId: this.path });
                        }
                    } else {
                        this.path = btn.getAttribute('data-url');
                        this.popup.style.display = 'flex';
                        this.createPlayer(this.path);
                    }
                }
            });
        });
    }

    bindCloseBtn() {
        this.close.addEventListener('click', () => {
            this.popup.style.display = 'none';
            this.player.stopVideo();
        });
    }

    createPlayer(url) {
        this.player = new YT.Player('frame', {
            height: '100%',
            width: '100%',
            videoId: `${url}`,
            events: {
                'onStateChange': this.onPlayerStateChange
            }
        });

        console.log(this.player);
    }

    onPlayerStateChange(state) {
        try {
            const blockedElem = this.activeBtn.closest('.module__video-item').nextElementSibling;
            const playIcon = this.activeBtn.querySelector('svg').cloneNode(true);
            if (state.data === 0 && blockedElem.querySelector('.play__circle').classList.contains('closed')) {
                blockedElem.querySelector('.play__circle').classList.remove('closed');
                blockedElem.querySelector('svg').remove();
                blockedElem.querySelector('.play__circle').appendChild(playIcon);
                blockedElem.querySelector('.play__text').classList.remove('attention');
                blockedElem.querySelector('.play__text').textContent = 'Play video';
                blockedElem.style.cssText =
                    `
            opacity: 1;
            filter: none;
            `;
                blockedElem.setAttribute('data-disabled', 'false');
            }
        } catch (error) { }
    }

    init() {
        if (this.btns.length > 0) {
            const tag = document.createElement('script');

            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            this.bindTriggers();
            this.bindCloseBtn();
        }
    }
}
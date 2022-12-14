import Slider from './slider';

export default class MiniSlider extends Slider {
    constructor(container, next, prev, activeClass, animate, autoPlay) {
        super(container, next, prev, activeClass, animate, autoPlay);
    }

    decorizeSlides() {
        this.slides.forEach(slide => {
            slide.classList.remove(this.activeClass);
            if (this.animate) {
                slide.querySelector('.card__title').style.opacity = '0.4';
                slide.querySelector('.card__controls-arrow').style.opacity = '0';
            }
        });

        if (!this.slides[0].closest('button')) {
            this.slides[0].classList.add(this.activeClass);
        }

        if (this.animate) {
            this.slides[0].querySelector('.card__title').style.opacity = '1';
            this.slides[0].querySelector('.card__controls-arrow').style.opacity = '1';
        }
    }

    nextSlide() {

        if (this.slides[1].tagName == 'BUTTON' && this.slides[2].tagName == 'BUTTON') {
            this.container.appendChild(this.slides[0]); // slide
            this.container.appendChild(this.slides[1]); // btn-1
            this.container.appendChild(this.slides[2]); // bnt-22
            this.decorizeSlides();
        } else if (this.slides[1].tagName == 'BUTTON') {
            this.container.appendChild(this.slides[0]); // slide
            this.container.appendChild(this.slides[1]); // btn-1
            this.decorizeSlides();
        } else {
            this.container.appendChild(this.slides[0]);
            this.decorizeSlides();
        }
    }

    bindTriggers() {
        this.next.addEventListener('click', () => this.nextSlide());

        this.prev.addEventListener('click', () => {

            for (let i = this.slides.length - 1; i > 0; i--) {
                if (this.slides[i].tagName !== 'BUTTON') {
                    let active = this.slides[i];
                    this.container.insertBefore(active, this.slides[0]);
                    this.decorizeSlides();
                    break;
                }
            }
        });
    }

    autoPlayVideo() {
        let idInterval;
        idInterval = setInterval(() => this.nextSlide(), 2000);
        if (this.autoPlay) {
            this.container.addEventListener('mouseenter', () => {
                clearInterval(idInterval);
            });
            this.container.addEventListener('mouseleave', () => {
                this.autoPlayVideo();
            });
        }
    }

    init() {
        try {
            this.container.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            overflow: hidden;
            alighn-items: flex-start;
        `;

            this.bindTriggers();
            this.decorizeSlides();
            this.autoPlayVideo();
        } catch (error) { }
    }
}
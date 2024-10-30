class FlexSlider {
    constructor(container, options = {}) {
        this.container = document.querySelector(container);
        this.options = {
            slidesPerView: options.slidesPerView || 1,
            breakpoints: options.breakpoints || {},
            pagination: options.pagination || false,
            autoplay: options.autoplay || false,
            autoplayDelay: options.autoplayDelay || 3000,
            loop: options.loop || false,
            transitionEffect: options.transitionEffect || 'fade', // Select transition effect
            vertical: options.vertical || false,
            ...options
        };
        this.slides = Array.from(this.container.querySelectorAll('.slide'));
        this.currentIndex = 0;
        this.interval = null;

        this.init();
    }

    init() {
        this.applyTransitionEffect();
        this.setupSlides();
        this.setupPagination();
        this.applyInitialStyles();
        this.attachEventListeners();
        if (this.options.autoplay) this.startAutoplay();
    }

    applyTransitionEffect() {
        this.container.classList.add(this.options.transitionEffect);
        this.slides.forEach((slide, index) => {
            if (index === this.currentIndex) slide.classList.add('active');
            else slide.classList.remove('active');
        });
    }

    setupSlides() {
        this.updateSlidesPerView();
        window.addEventListener('resize', this.updateSlidesPerView.bind(this));
    }

    setupPagination() {
        if (!this.options.pagination) return;

        this.paginationContainer = document.createElement('div');
        this.paginationContainer.classList.add('pagination');
        this.container.parentNode.appendChild(this.paginationContainer);

        this.slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = index;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.paginationContainer.appendChild(dot);
        });
        this.updatePagination();
    }

    updatePagination() {
        if (!this.options.pagination) return;

        this.paginationContainer.querySelectorAll('.dot').forEach(dot => {
            dot.classList.remove('active');
            if (parseInt(dot.dataset.index) === this.currentIndex) dot.classList.add('active');
        });
    }

    applyInitialStyles() {
        this.container.style.display = 'flex';
        this.container.style.transition = 'transform 0.5s ease';
        if (this.options.vertical) {
            this.container.style.flexDirection = 'column';
        }
        this.updateSlidePosition();
    }

    attachEventListeners() {
        this.container.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.container.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.container.addEventListener('touchend', this.onTouchEnd.bind(this));
    }

    onTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
    }

    onTouchMove(e) {
        this.moveX = e.touches[0].clientX;
        this.moveY = e.touches[0].clientY;
    }

    onTouchEnd() {
        const deltaX = this.moveX - this.startX;
        const deltaY = this.moveY - this.startY;
        if (this.options.vertical) {
            if (deltaY > 50) this.prev();
            if (deltaY < -50) this.next();
        } else {
            if (deltaX > 50) this.prev();
            if (deltaX < -50) this.next();
        }
    }

    next() {
        if (this.currentIndex < this.slides.length - this.slidesPerView) {
            this.currentIndex++;
        } else if (this.options.loop) {
            this.currentIndex = 0;
        }
        this.updateSlidePosition();
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else if (this.options.loop) {
            this.currentIndex = this.slides.length - this.slidesPerView;
        }
        this.updateSlidePosition();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlidePosition();
    }

    updateSlidePosition() {
        const offset = -(this.currentIndex * (100 / this.slidesPerView));
        if (this.options.vertical) {
            this.container.style.transform = `translateY(${offset}%)`;
        } else {
            this.container.style.transform = `translateX(${offset}%)`;
        }
        this.updatePagination();
    }

    startAutoplay() {
        this.interval = setInterval(() => this.next(), this.options.autoplayDelay);
        this.container.addEventListener('mouseover', () => clearInterval(this.interval));
        this.container.addEventListener('mouseout', () => this.startAutoplay());
    }
}

export default FlexSlider;

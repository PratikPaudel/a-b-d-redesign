'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('.overlay');
    const btnCloseModal = document.querySelector('.btn--close-modal');
    const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
    const btnScrollTo = document.querySelector('.btn--scroll-to');
    const section1 = document.querySelector('#section--1');
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.header');
    const allSections = document.querySelectorAll('.section');
    const imgTargets = document.querySelectorAll('img[data-src]');
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');
    let curSlide = 0;
    const maxSlide = slides.length;

    // Modal window functionality
    const toggleModal = () => {
        modal.classList.toggle('hidden');
        overlay.classList.toggle('hidden');
    };

    btnsOpenModal.forEach(btn => btn.addEventListener('click', toggleModal));
    btnCloseModal.addEventListener('click', toggleModal);
    overlay.addEventListener('click', toggleModal);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            toggleModal();
        }
    });

    // Smooth scrolling
    btnScrollTo.addEventListener('click', () => section1.scrollIntoView({ behavior: 'smooth' }));
    document.querySelector('.nav__links').addEventListener('click', e => {
        e.preventDefault();
        if (e.target.classList.contains('nav__link')) {
            document.querySelector(e.target.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Menu fade animation
    const handleHover = (e, opacity) => {
        if (e.target.classList.contains('nav__link')) {
            const link = e.target;
            const siblings = link.closest('.nav').querySelectorAll('.nav__link');
            const logo = link.closest('.nav').querySelector('img');

            siblings.forEach(el => {
                if (el !== link) el.style.opacity = opacity;
            });
            logo.style.opacity = opacity;
        }
    };

    nav.addEventListener('mouseover', e => handleHover(e, 0.5));
    nav.addEventListener('mouseout', e => handleHover(e, 1));

    // Sticky navigation
    const navHeight = nav.getBoundingClientRect().height;
    const stickyNav = entries => {
        const [entry] = entries;
        if (!entry.isIntersecting) nav.classList.add('sticky');
        else nav.classList.remove('sticky');
    };

    const headerObserver = new IntersectionObserver(stickyNav, {
        root: null,
        threshold: 0,
        rootMargin: `-${navHeight}px`,
    });

    headerObserver.observe(header);

    // Reveal sections
    const revealSection = (entries, observer) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('section--hidden');
        observer.unobserve(entry.target);
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
    });

    allSections.forEach(section => {
        sectionObserver.observe(section);
        section.classList.add('section--hidden');
    });

    // Lazy loading images
    const loadImg = (entries, observer) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        entry.target.src = entry.target.dataset.src;
        entry.target.addEventListener('load', () => entry.target.classList.remove('lazy-img'));
        observer.unobserve(entry.target);
    };

    const imgObserver = new IntersectionObserver(loadImg, {
        root: null,
        threshold: 0,
        rootMargin: '200px',
    });

    imgTargets.forEach(img => imgObserver.observe(img));

        
    //Hamburger view 
    document.addEventListener('DOMContentLoaded', function() {
        const toggleButton = document.querySelector('.nav__toggle');
        const navLinks = document.querySelector('.nav__links');

        toggleButton.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            toggleButton.classList.toggle('active');
        });
    });
    
    // Slider functionality
    const createDots = () => {
        slides.forEach((_, i) => {
            dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
        });
    };

    const activateDot = slide => {
        document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
        document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
    };

    const goToSlide = slide => {
        slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
    };

    const nextSlide = () => {
        curSlide = (curSlide === maxSlide - 1) ? 0 : curSlide + 1;
        goToSlide(curSlide);
        activateDot(curSlide);
    };

    const prevSlide = () => {
        curSlide = (curSlide === 0) ? maxSlide - 1 : curSlide - 1;
        goToSlide(curSlide);
        activateDot(curSlide);
    };

    const initSlider = () => {
        goToSlide(0);
        createDots();
        activateDot(0);
    };

    initSlider();
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    dotContainer.addEventListener('click', e => {
        if (e.target.classList.contains('dots__dot')) {
            const { slide } = e.target.dataset;
            goToSlide(slide);
            activateDot(slide);
        }
    });
});
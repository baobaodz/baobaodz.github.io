function initializeBriefMBTI(config) {
    const createHTML = (personalityType) => {

        const sildeButton = config.interaction.slide ? `
              <div class="mbti-nav-buttons">
                    <button class="mbti-nav-button prev">&lt;</button>
                    <button class="mbti-nav-button next">&gt;</button>
                </div>
            ` : '';
        const styleSwitchButton = config.interaction.switch ? `
            <div class="mbti-style-switch">
                <svg id="styleSwitchBtn" t="1723948319032" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25040" width="32" height="32">
                    <path d="M514 114.3c-219.9 0-398.9 178.9-398.9 398.8 0.1 220 179 398.9 398.9 398.9 219.9 0 398.8-178.9 398.8-398.8S733.9 114.3 514 114.3z m218.3 489v1.7c0 0.5-0.1 1-0.1 1.6 0 0.3 0 0.6-0.1 0.9 0 0.5-0.1 1-0.2 1.5 0 0.3-0.1 0.7-0.1 1-0.1 0.4-0.1 0.8-0.2 1.2-0.1 0.4-0.2 0.9-0.2 1.3-0.1 0.3-0.1 0.6-0.2 0.8-0.1 0.6-0.3 1.2-0.4 1.8 0 0.1-0.1 0.2-0.1 0.3-2.2 8.5-6.6 16.6-13.3 23.3L600.7 755.4c-20 20-52.7 20-72.6 0-20-20-20-52.7 0-72.6l28.9-28.9H347c-28.3 0-51.4-23.1-51.4-51.4 0-28.3 23.1-51.4 51.4-51.4h334c13.2 0 26.4 5 36.4 15s15 23.2 15 36.4c0 0.3-0.1 0.6-0.1 0.8z m0.1-179.5c0 28.3-23.1 51.4-51.4 51.4H347c-13.2 0-26.4-5-36.4-15s-15-23.2-15-36.4v-0.8-1.6c0-0.5 0.1-1.1 0.1-1.6 0-0.3 0-0.6 0.1-0.9 0-0.5 0.1-1 0.2-1.5 0-0.3 0.1-0.7 0.1-1 0.1-0.4 0.1-0.8 0.2-1.2 0.1-0.4 0.2-0.9 0.2-1.3 0.1-0.3 0.1-0.6 0.2-0.8 0.1-0.6 0.3-1.2 0.4-1.8 0-0.1 0.1-0.2 0.1-0.3 2.2-8.5 6.6-16.6 13.3-23.3l116.6-116.6c20-20 52.7-20 72.6 0 20 20 20 52.7 0 72.6L471 372.5h210c28.2 0 51.4 23.1 51.4 51.3z" fill="${personalityType.characterColor}" p-id="25041"></path>
                </svg>
    
            </div>
        ` : '';
        const briefHTML = `
            ${config.interaction.switch ? '<div class="card-flipper">' : ''}  
            <div id="mbti-brief-wrapper" data-style="${config.style}">
                
                <div class="mbti-brief-header">
                    <div class="mbti-brief-personality-name">
                        <span>${personalityType.name}</span> <span lang="en">(${personalityType.type})</span>
                    </div>
                </div>
                <div class="mbti-brief-body">
                    <div class="mbti-brief-image-container slide-transition">
                    </div>
                    <div class="mbti-brief-desc">${personalityType.desc}</div>
                </div>
                <div class="mbti-brief-footer">
                    <span class="mbti-more-button">
                        <a href="${getMoreInfoLink(config.language, personalityType)}" target="_blank">${getLocalizedContent(config.language, 'linkBriefText')}</a>
                    </span>
                    ${styleSwitchButton}
                </div>
                <div class="mbti-brief-card-bg">
                    <svg height="30" viewBox="0 0 399 30" width="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M400 0v16L326.316 5 94.736 20 0 0z" fill="${personalityType.characterColor}" fill-rule="evenodd">
                        </path>
                    </svg>
                </div>
                ${sildeButton}
            </div>
            ${config.interaction.switch ? '</div>' : ''}
        `;
        return briefHTML;
    }

    const getFillColor = (personalityType) => {
        const type = personalityType.type.slice(0, 4);

        const colorMap = {
            "#f9eed7": ["ISTP", "ISFP", "ESTP", "ESFP"],
            "#d9eaf0": ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
            "#d6ece3": ["INFJ", "INFP", "ENFJ", "ENFP"],
            "#e7dfea": ["INTJ", "INTP", "ENTJ", "ENTP"]
        };

        for (const [color, types] of Object.entries(colorMap)) {
            if (types.includes(type)) {
                return color;
            }
        }

        return "#ffffff"; // 默认颜色，以防没有匹配
    }


    const getCurrentPersonalityType = (personalityType) => {
        const characterColor = getFillColor(personalityType);
        container.style.setProperty('--character-color', characterColor);
        const moreSaturatedColor = getMoreSaturatedColor(characterColor);
        container.style.setProperty('--character-active-color', moreSaturatedColor);
        return {
            type: personalityType.type,
            name: getLocalizedContent(config.language, personalityType.name),
            desc: getLocalizedContent(config.language, personalityType.desc),
            characterColor: characterColor,
            imgUrl: getAvatarImgUrl(getCurrentStyle(), personalityType),
        };

    }
    const getCurrentStyle = () => {
        const wrapper = document.getElementById('mbti-brief-wrapper');
        return wrapper.dataset.style;
    }
    const getAvatarImgUrl = (style, personalityType) => {
        const styleConfig = styleConfigs[style];
        return styleConfig ? styleConfig.imageFormat.getUrl(personalityType, config.gender) : null;
    }
    const switchStyle = () => {
        const wrapper = document.getElementById('mbti-brief-wrapper');
        const flipper = document.querySelector('.card-flipper');
        flipper.classList.add('flipping');

        const styles = Object.keys(styleConfigs);
        const currentIndex = styles.indexOf(wrapper.dataset.style);
        const newIndex = (currentIndex + 1) % styles.length;
        const personalityType = personalityTypes.find(p => p.type === currentPersonalityType.type.slice(0, 4));
        wrapper.dataset.style = styles[newIndex];
        currentPersonalityType = {
            ...currentPersonalityType,
            imgUrl: getAvatarImgUrl(wrapper.dataset.style, personalityType),
        };
        setTimeout(() => {
            flipper.classList.remove('flipping');
            const briefImageContainer = document.querySelector('.mbti-brief-image-container');
            loadCardContent(currentPersonalityType, wrapper.dataset.style, briefImageContainer)
                .then(() => {
                    requestAnimationFrame(() => {
                        wrapper.style.maxHeight = 'none';

                    });
                });
        }, 500);
    }


    const containerId = `mbti-${config.cardType}-container`;
    const container = document.getElementById(containerId);
    container.setAttribute('lang', config.language);

    let mbtiDimensions = [];
    let baseMBTIDimensions = [];
    let currentPersonalityType = {};
    let basePersonalityType = {};
    if (config.data && config.data.length) {
        mbtiDimensions = getMBTIDimensions(config);
        baseMBTIDimensions = JSON.parse(JSON.stringify(mbtiDimensions));
        currentPersonalityType = calculatePersonalityType(config, mbtiDimensions);

    } else if (config.type) {
        const personalityType = personalityTypes.find(p => p.type === config.type.slice(0, 4));
        currentPersonalityType = {
            type: config.type,
            name: getLocalizedContent(config.language, personalityType.name),
            desc: getLocalizedContent(config.language, personalityType.desc),
            // avatar: `${imagesHostUrl}/${personalityType.type.toLowerCase()}-${personalityType.name.en.toLowerCase()}-s3-v1-${config.gender}.png?t=${Date.now()}`,
        }
    }
    const personalityType = personalityTypes.find(p => p.type === currentPersonalityType.type.slice(0, 4));
    const characterColor = getFillColor(personalityType);
    container.style.setProperty('--character-color', characterColor);
    const moreSaturatedColor = getMoreSaturatedColor(characterColor);
    container.style.setProperty('--character-active-color', moreSaturatedColor);
    currentPersonalityType = {
        ...currentPersonalityType,
        characterColor: characterColor,
        imgUrl: getAvatarImgUrl(config.style, personalityType),
    }
    basePersonalityType = JSON.parse(JSON.stringify(currentPersonalityType));


    container.innerHTML = createHTML(currentPersonalityType);
    const wrapper = document.getElementById('mbti-brief-wrapper');
    wrapper.dataset.style = config.style;
    wrapper.setAttribute('lang', config.language);
    const briefImageContainer = document.querySelector('.mbti-brief-image-container');

    loadCardContent(currentPersonalityType, wrapper.dataset.style, briefImageContainer)
        .then(() => {
            requestAnimationFrame(() => {
                wrapper.style.maxHeight = 'none';
            });
        });

    if (config.interaction.slide) {
        const elements = {
            wrapper: document.getElementById('mbti-brief-wrapper'),
            backgroundElement: document.querySelector('.mbti-brief-card-bg'),
            styleSwitchBtn: document.querySelector('#styleSwitchBtn'),
            navButtons: document.querySelectorAll('.mbti-nav-button')
        };

        let currentIndex = personalityTypes.findIndex(p => p.type.startsWith(currentPersonalityType.type.slice(0, 4)));

        const updatePersonalityInfo = (newIndex) => {
            currentIndex = (newIndex + personalityTypes.length) % personalityTypes.length;
            currentPersonalityType = getCurrentPersonalityType(personalityTypes[currentIndex]);

            elements.wrapper.querySelector('.mbti-brief-personality-name').innerHTML = `<span>${currentPersonalityType.name}</span> <span lang="en">(${currentPersonalityType.type})</span>`;
            elements.wrapper.querySelector('.mbti-brief-desc').textContent = currentPersonalityType.desc;
            elements.backgroundElement.style.backgroundColor = currentPersonalityType.characterColor;
            elements.backgroundElement.querySelector('svg path').setAttribute('fill', currentPersonalityType.characterColor);
            elements.styleSwitchBtn.querySelector('path').setAttribute('fill', currentPersonalityType.characterColor);

            const moreButton = elements.wrapper.querySelector('.mbti-more-button');
            moreButton.querySelector('a').href = getMoreInfoLink(config.language, currentPersonalityType);
        };

        const animateSlide = (isNext) => {
            const briefImageContainer = document.querySelector('.mbti-brief-image-container');
            briefImageContainer.classList.add(isNext ? 'slide-out-left' : 'slide-out-right');

            setTimeout(() => {
                const newImageContainer = briefImageContainer.cloneNode(true);
                newImageContainer.classList.remove('slide-out-left', 'slide-out-right');
                newImageContainer.classList.add(isNext ? 'slide-in-right' : 'slide-in-left');
                briefImageContainer.parentNode.replaceChild(newImageContainer, briefImageContainer);

                void newImageContainer.offsetWidth;
                newImageContainer.classList.remove('slide-in-right', 'slide-in-left');

                updatePersonalityInfo(currentIndex + (isNext ? 1 : -1));
                // loadCardContent(currentPersonalityType, elements.wrapper.dataset.style, newImageContainer);

                loadCardContent(currentPersonalityType, elements.wrapper.dataset.style, newImageContainer)
                    .then(() => {
                        requestAnimationFrame(() => {
                            wrapper.style.maxHeight = 'none';
                            newImageContainer.classList.remove('slide-in-right', 'slide-in-left');
                        });
                    });
            }, 500);
        };

        const throttledSlide = throttle(animateSlide, 300);
        elements.navButtons.forEach(button => {
            button.onclick = () => throttledSlide(button.classList.contains('next'));
        });
    }
    if (config.interaction.switch) {
        const throttledSwitchStyle = throttle(switchStyle, 300);
        document.getElementById('styleSwitchBtn').addEventListener('click', throttledSwitchStyle);
    }
    if (config.interaction.resize) {
        wrapper.addClass('resizable');
        const throttledResize = throttle(resizeContainer, 300);
        throttledResize('.resizable')
    }
}

class StyleHandler {
    loadContent(personalityType, container, style) {
        throw new Error("Method 'loadImage' must be implemented.");
    }
    loadFont(style) {
        const fontConfig = styleConfigs[style].fontFormat;
        if (fontConfig) {
            loadFontWithCache(fontConfig)
                .then(() => {
                    const wrapper = document.getElementById('mbti-brief-wrapper');
                    wrapper.style.setProperty('--chinese-font', fontConfig.chineseFont);
                    wrapper.style.setProperty('--english-font', fontConfig.englishFont);
                })
                .catch(error => {
                    console.error('Font loading error:', error);
                });
        }
    }
}
class ClassicStyleHandler extends StyleHandler {
    loadContent(personalityType, container, style) {
        this.loadFont(style);
        this.loadLottieAnimation(personalityType, container);
    }
    loadLottieAnimation(personalityType, container) {
        container.innerHTML = '<div class="water-drop-loading"></div>';
        fetchWithCache(personalityType.imgUrl)
            .then(animationData => {
                container.innerHTML = '';
                container.style.minHeight = 'auto';
                const animation = lottie.loadAnimation({
                    container: container,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    animationData: animationData
                });
                container.addEventListener('mouseenter', () => {
                    animation.loop = true;
                    animation.play();
                });

                container.addEventListener('mouseleave', () => {
                    animation.loop = false;
                });
                animation.addEventListener('complete', () => {
                    if (!container.matches(':hover')) {
                        animation.stop();
                    }
                    container.dispatchEvent(new Event('load'));
                });

            });
    }
}

class imgStyleHandler extends StyleHandler {
    loadContent(personalityType, container, style) {
        this.loadFont(style);
        this.loadImage(personalityType, container);
    }

    loadImage(personalityType, container) {
        const prevHeight = container.offsetHeight || 200;
        container.style.minHeight = `${prevHeight}px`;
        container.innerHTML = '<div class="water-drop-loading"></div>';
        fetchWithCache(personalityType.imgUrl, 'blob')
            .then(blob => {

                const img = document.createElement('img');
                img.className = 'mbti-brief-image';
                img.src = URL.createObjectURL(blob);
                img.onload = () => {
                    container.innerHTML = '';
                    container.appendChild(img);
                    container.style.minHeight = 'auto';
                    container.dispatchEvent(new Event('load')); // 触发 load 事件
                };
            })
            .catch(error => {
                console.error('Error loading image:', error);
                container.innerHTML = 'Failed to load image';
            });
    }
}

const styleConfigs = {
    classic: {
        name: 'classic',
        author: 'Sourcegraph',
        imageFormat: {
            type: 'json',
            genderSpecific: false,
            getUrl: (personalityType) => `${imagesHostUrl}/avatars/classic/${personalityType.name.en.toLowerCase()}.json`
        },
        fontFormat: {
            chineseFont: '',
            englishFont: "Red Hat Display",
        },
        handler: ClassicStyleHandler,
    },
    illustration: {
        name: 'illustration',
        author: 'Shadoowww__',
        imageFormat: {
            type: 'jpg',
            genderSpecific: false
        },
        fontFormat: {
            chineseFont: '',
            englishFont: "Rammetto One",
        },
        handler: imgStyleHandler,

    },
    comic: {
        name: 'comic',
        author: 'mbti_as_things',
        imageFormat: {
            type: 'png',
            genderSpecific: true
        },
        fontFormat: {
            chineseFont: 'HanYiFeiLi-Jian',
            englishFont: "Lilita One",
        },
        handler: imgStyleHandler,
    },
    Mexico: {
        name: 'Mexico',
        author: '_.space.cadette._',
        imageFormat: {
            type: 'png',
            genderSpecific: false
        },
        fontFormat: {
            chineseFont: '',
            englishFont: "Sacramento",
        },
        handler: imgStyleHandler,
    },
    Sanrio: {
        name: 'Sanrio',
        author: 'none',
        imageFormat: {
            type: 'png',
            genderSpecific: false
        },
        fontFormat: {
            chineseFont: '',
            englishFont: "Gloria Hallelujah",
        },
        handler: imgStyleHandler,
    },
    simple_line_color: {
        name: 'simple_line_color',
        author: 'none',
        imageFormat: {
            type: 'png',
            genderSpecific: false
        },
        fontFormat: {
            chineseFont: '',
            englishFont: "Single Day",
        },
        handler: imgStyleHandler,
    },
    simple_line_color_2: {
        name: 'simple_line_color_2',
        author: 'VIENNTJ',
        imageFormat: {
            type: 'png',
            genderSpecific: true
        },
        fontFormat: {
            chineseFont: '',
            englishFont: "Yatra One",
        },
        handler: imgStyleHandler,
    },
    fantasy: {
        name: 'fantasy',
        author: 'akklonia',
        imageFormat: {
            type: 'png',
            genderSpecific: false
        },
        fontFormat: {
            chineseFont: '',
            englishFont: "Barlow Condensed",
        },
        handler: imgStyleHandler,
    },
    Korean_comic: {
        name: 'Korean_comic',
        author: 'FJ',
        imageFormat: {
            type: 'png',
            genderSpecific: false
        },
        fontFormat: {
            chineseFont: '',
            englishFont: "Annie Use Your Telescope",
        },
        handler: imgStyleHandler,
    },
    cat: {
        name: 'cat',
        author: 'none',
        imageFormat: {
            type: 'png',
            genderSpecific: false
        },
        fontFormat: {
            chineseFont: '',
            englishFont: "Architects Daughter",
        },
        handler: imgStyleHandler,
    },
    classic_cute: {
        name: 'classic_cute',
        author: 'none',
        imageFormat: {
            type: 'png',
            genderSpecific: false
        },
        fontFormat: {
            chineseFont: '',
            englishFont: "Architects Daughter",
        },
        handler: imgStyleHandler,
    },
    work: {
        name: 'work',
        author: 'mbti.friendly',
        imageFormat: {
            type: 'png',
            genderSpecific: false
        },
        fontFormat: {
            chineseFont: '',
            englishFont: "Archivo Black",
        },
        handler: imgStyleHandler,
    },
    illustration_3: {
        name: 'illustration_3',
        author: 'toptier sensor',
        imageFormat: {
            type: 'png',
            genderSpecific: false
        },
        fontFormat: {
            chineseFont: '',
            englishFont: "Sue Ellen Francisco",
        },
        handler: imgStyleHandler,
    },
    animals: {
        name: 'animals',
        author: 'ProvenPsychology',
        imageFormat: {
            type: 'png',
            genderSpecific: false
        },
        fontFormat: {
            chineseFont: '',
            englishFont: "Pangolin",
        },
        handler: imgStyleHandler,
    },
    Disney_princesses: {
        name: 'Disney_princesses',
        author: 'LittleMsArtsy',
        imageFormat: {
            type: 'png',
            genderSpecific: false
        },
        fontFormat: {
            chineseFont: '',
            englishFont: "Pangolin",
        },
        handler: imgStyleHandler,
    },
};
Object.values(styleConfigs).forEach(config => {
    if (!config.imageFormat.getUrl) {
        config.imageFormat.getUrl = (personalityType, gender) => {
            const baseUrl = `${imagesHostUrl}/avatars/${config.name}/${personalityType.type.slice(0, 4).toLowerCase()}`;
            const genderSuffix = config.imageFormat.genderSpecific ? `-${gender}` : '';
            return `${baseUrl}${genderSuffix}.${config.imageFormat.type}`;
        };
    }
});

const styleHandlerFactory = {
    getHandler(style) {
        const Handler = styleConfigs[style]['handler'] || imgStyleHandler;
        return new Handler();
    },

    registerHandler(style, HandlerClass) {
        this.handlers[style] = HandlerClass;
    }
};

function loadCardContent(personalityType, style, briefImageContainer) {
    return new Promise((resolve) => {
        const handler = styleHandlerFactory.getHandler(style);
        handler.loadContent(personalityType, briefImageContainer, style);
        briefImageContainer.addEventListener('load', resolve, { once: true });
    });
}
function initializeDetailedMBTI(config) {
    console.log('config: ', config)
    const createHeaderHTML = (personalityType) => {
        const resetButton = config.slide ?
            `
            <div id="reset-mbti" class="reset-button">
                <svg t="1722666313154" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="28600" width="32" height="32" style="padding: 6px;">
                    <path d="M307.045 256.85l112.95 30.285-21.51 80.234-160.559-43.02-80.325-21.465L222.176 62l80.28 21.51-23.306 87.075C421.44 57.412 624.506 62.952 760.42 183.715s165.298 321.766 69.649 476.387-288.631 218.062-457.367 150.364-264.36-246.93-226.62-424.781l80.46 21.598a290.925 290.925 0 1 0 80.55-150.385l-0.046-0.045zM137.981 878.883h748.125V962H137.98v-83.117z" fill="#6e6e6e" fill-opacity=".8" p-id="28601"></path>
                </svg>            
            </div>
            ` : '';
        const downloadButton = `
            <div id="download-mbti">
                <svg t="1722664481467" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1500" width="32" height="32">
                    <path d="M276.195556 325.688889v244.195555l149.959111-106.126222a28.444444 28.444444 0 0 1 33.735111 0.625778l77.966222 59.648 164.721778-130.474667V325.688889H276.195556z m0 313.884444v58.737778h280.177777a28.444444 28.444444 0 1 1 0 56.888889H261.973333c-23.665778 0-42.666667-19.000889-42.666666-42.666667v-401.066666c0-23.665778 19.000889-42.666667 42.666666-42.666667H716.8c23.665778 0 42.666667 19.000889 42.666667 42.666667v95.857777a28.444444 28.444444 0 0 1-10.808889 22.300445l-192.853334 152.746667a28.444444 28.444444 0 0 1-34.901333 0.284444l-78.961778-60.387556-165.745777 117.276445z" fill="#6e6e6e" fill-opacity=".8" p-id="1501"></path>
                    <path d="M364.088889 438.328889a35.555556 35.555556 0 1 0 0-71.111111 35.555556 35.555556 0 0 0 0 71.111111z" fill="#6e6e6e" fill-opacity=".8" p-id="1502"></path>
                    <path d="M813.425778 630.698667a28.444444 28.444444 0 0 1 0 40.220444l-75.946667 75.946667a28.444444 28.444444 0 0 1-40.220444 0l-75.662223-75.662222a28.444444 28.444444 0 0 1 40.220445-40.220445l55.552 55.552 55.836444-55.836444a28.444444 28.444444 0 0 1 40.220445 0z" fill="#000000" fill-opacity=".8" p-id="1503"></path><path d="M717.368889 521.102222a28.444444 28.444444 0 0 1 28.444444 28.444445v176.924444a28.444444 28.444444 0 1 1-56.888889 0v-176.924444a28.444444 28.444444 0 0 1 28.444445-28.444445z" fill="#6e6e6e" fill-opacity=".8" p-id="1504"></path>
                </svg>
            </div>
            `

        return `
            <div class="mbti-header">
                <div class="personality-avatar"> 
                    <img src="${personalityType.avatar}" alt="${personalityType.name}">
                </div>
                <div class="personality-info">
                    <div class="personality-name">${personalityType.name} (${personalityType.type})</div>
                    <div class="personality-desc">${personalityType.desc}</div>
                </div>
                <div class="personality-btns">
                    ${resetButton}
                    ${downloadButton}
                </div>
 
            </div>
        `;
    }

    const createBarHTML = (dimension) => {
        return `
            <div class="trait-container">
                <span class="trait-left">${dimension.label[0]}</span>
                <div class="slider-container">
                    <input type="range" min="0" max="100" value="${dimension.value[1]}" class="slider" id="${dimension.id}Slider" disabled>
                    <div id="${dimension.id}SliderTooltip" class="slider-tooltip">
                        <span class="trait-value"></span>
                        <span class="percentage-value">%</span>
                    </div>
                </div>
                <span class="trait-right">${dimension.label[1]}</span>
            </div>
        `;
    }
    const createFooterHTML = (personalityType) => {

        return `
            <div class="mbti-footer">
                <span class="mbti-personality-link ">
                    <a href="${getMoreInfoLink(config.language, personalityType)}" target="_blank">${getLocalizedContent(config.language, 'linkDetailedText')}</a>
                </span>
            </div>
        `;
    }

    const getMBTIBars = (dimensions) => {
        return dimensions.map(createBarHTML).join('');
    }

    const updateSliderDisplay = (value, dimension, slider, sliderTooltip) => {
        const index = getDominantTraitIndex(value);
        const trait = dimension.label[index];
        const percentage = index ? value : 100 - value;
        sliderTooltip.querySelector('.trait-value').textContent = trait;
        sliderTooltip.querySelector('.percentage-value').textContent = `${percentage}%`;
        const position = (value / 100) * slider.offsetWidth;
        sliderTooltip.style.left = `${position}px`;
    }

    const initializeSliders = (dimensions, isSlideEnabled) => {
        dimensions.forEach(dimension => {
            const slider = document.getElementById(`${dimension.id}Slider`);
            const sliderTooltip = document.getElementById(`${dimension.id}SliderTooltip`);

            updateSliderDisplay(slider.value, dimension, slider, sliderTooltip);
            applySliderStyles(slider, sliderTooltip, dimension.color);

            if (isSlideEnabled) {
                enableSliderInteraction(slider, dimension, sliderTooltip);
            }
        });
    }

    const applySliderStyles = (slider, sliderTooltip, color) => {
        slider.style.setProperty('--slider-color', color);
        if (config.tooltip && config.tooltip.showTooltipBackground) {
            sliderTooltip.style.setProperty('--slider-color', color);
        } else {
            sliderTooltip.style.setProperty('--slider-color', 'transparent');
            sliderTooltip.style.top = '-26px';
            sliderTooltip.querySelector('.trait-value').style.color = color;
            sliderTooltip.querySelector('.percentage-value').style.color = '#000';
            sliderTooltip.classList.add('no-after');


        }
    }

    const enableSliderInteraction = (slider, dimension, sliderTooltip) => {
        slider.removeAttribute('disabled');
        let lastType = getDominantTraitIndex(dimension.value[0]);
        const debouncedUpdateSliderDisplay = debounce(updateSliderDisplay, 100);
        slider.addEventListener('input', (e) => {
            debouncedUpdateSliderDisplay(e.target.value, dimension, slider, sliderTooltip);
            const index = mbtiDimensions.findIndex(d => d.id === dimension.id);
            const sliderValue = parseInt(e.target.value);

            mbtiDimensions[index].value[0] = 100 - sliderValue;
            mbtiDimensions[index].value[1] = sliderValue;

            const currentType = getDominantTraitIndex(mbtiDimensions[index].value[0]);
            if (currentType !== lastType) {
                lastType = currentType;
                currentPersonalityType = calculatePersonalityType(config, mbtiDimensions);
                updatePersonalityTypeDisplay(currentPersonalityType);
                updatePersonalityLink(currentPersonalityType);
            }
        });
    }
    const updateAllTooltipPositions = () => {
        mbtiDimensions.forEach(dimension => {
            const slider = document.getElementById(`${dimension.id}Slider`);
            const sliderTooltip = document.getElementById(`${dimension.id}SliderTooltip`);
            updateSliderDisplay(slider.value, dimension, slider, sliderTooltip);
        });
    }
    const updatePersonalityTypeDisplay = (personalityType) => {
        const headerElement = document.querySelector('.mbti-header');
        const personalityInfoElement = headerElement.querySelector('.personality-info');
        const avatarElement = headerElement.querySelector('.personality-avatar img');

        // 更新头像
        avatarElement.src = personalityType.avatar;
        avatarElement.alt = personalityType.name;

        // 更新个性类型信息
        personalityInfoElement.innerHTML = `
            <div class="personality-name">${personalityType.name} (${personalityType.type})</div>
            <div class="personality-desc">${personalityType.desc}</div>
        `;

    }

    function updatePersonalityLink(personalityType) {
        const link = document.querySelector('.mbti-personality-link a');
        link.href = link.href.replace(/\/[a-z]{4}-/, `/${personalityType.type.slice(0,4).toLowerCase()}-`);
    }

    const resetMBTI = () => {
        console.log('Resetting MBTI baseMBTIDimensions: ', baseMBTIDimensions);
        baseMBTIDimensions.forEach((dimension, index) => {
            const slider = document.getElementById(`${dimension.id}Slider`);
            const sliderTooltip = document.getElementById(`${dimension.id}SliderTooltip`);
            const initialValue = dimension.value[1];
            slider.value = initialValue;
            updateSliderDisplay(initialValue, dimension, slider, sliderTooltip);
        });
        updatePersonalityTypeDisplay(basePersonalityType);
    }
    const generatePersonalityImage = () => {
        const filterFn = (node) => {
            if (node.classList) {
                if (node.classList.contains('personality-btns') || node.classList.contains('mbti-footer')) {
                    return false;
                }
            }
            return true;
        }
        const fetchOptions = {
            requestInit: {
                mode: 'cors',
            },
            bypassingCache: true,
        };
        modernScreenshot.domToPng(document.querySelector(`#${containerId}`), {
            fetch: fetchOptions,
            filter: filterFn,
            scale: 2,
            quality: 0.95,
        }).then(dataUrl => {
            const link = document.createElement('a');
            link.download = `${currentPersonalityType.name}(${currentPersonalityType.type})-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        })
    }

    const containerId = `mbti-${config.cardType}-container`;
    let mbtiDimensions = getMBTIDimensions(config);
    const baseMBTIDimensions = JSON.parse(JSON.stringify(mbtiDimensions));
    const container = document.getElementById(containerId);
    container.setAttribute('lang', config.language);
    let currentPersonalityType = calculatePersonalityType(config, mbtiDimensions);
    const basePersonalityType = JSON.parse(JSON.stringify(currentPersonalityType));
    container.innerHTML = createHeaderHTML(currentPersonalityType) +
        getMBTIBars(mbtiDimensions) +
        createFooterHTML(currentPersonalityType);

    initializeSliders(mbtiDimensions, config.slide);
    if (config.slide) {
        document.getElementById('reset-mbti').addEventListener('click', resetMBTI);
    }
    document.getElementById("download-mbti").addEventListener("click", generatePersonalityImage);
    const throttledUpdateAllTooltipPositions = throttle(updateAllTooltipPositions, 100);
    window.addEventListener('resize', throttledUpdateAllTooltipPositions);


}
const languageConfig = {
    en: {
        ei: ['Extraverted', 'Introverted'],
        ns: ['Intuitive', 'Observant'],
        tf: ['Thinking', 'Feeling'],
        jp: ['Judging', 'Prospecting'],
        at: ['Assertive', 'Turbulent'],
        linkPrefix: '',
        linkSuffix: 'personality',
        linkBriefText: 'View More',
        linkDetailedText: 'View Detailed Personality Analysis',

    },
    zh: {
        ei: ['外向', '内向'],
        ns: ['有远见', '现实'],
        tf: ['理性分析', '感受'],
        jp: ['评判', '展望'],
        at: ['坚决', '起伏不定'],
        linkPrefix: 'ch/',
        linkSuffix: '人格',
        linkBriefText: '查看更多',
        linkDetailedText: '查看性格剖析',
    }
};
const baseUrl = 'https://www.16personalities.com';
const imagesHostUrl = 'https://cdn.jsdelivr.net/gh/baobaodz/picx-images-hosting@master/hexo-mbti';

function getLocalizedContent(language, content) {
    const lang = language || 'zh';

    if (typeof content === 'object' && content.hasOwnProperty(lang)) {
        return content[lang];
    } else if (typeof content === 'string') {
        const key = content;
        if (languageConfig[lang] && languageConfig[lang][key] !== undefined) {
            return languageConfig[lang][key];
        }
    }
    return content;
}

function getMBTIDimensions(config) {
    const lang = config.language || 'zh';
    const data = config.data || {};
    return [
        { id: 'ei', label: languageConfig[lang].ei, value: data['E-I'] || data[languageConfig[lang].ei.join('-')], color: config.color[0] },
        { id: 'ns', label: languageConfig[lang].ns, value: data['N-S'] || data[languageConfig[lang].ns.join('-')], color: config.color[1] },
        { id: 'tf', label: languageConfig[lang].tf, value: data['T-F'] || data[languageConfig[lang].tf.join('-')], color: config.color[2] },
        { id: 'jp', label: languageConfig[lang].jp, value: data['J-P'] || data[languageConfig[lang].jp.join('-')], color: config.color[3] },
        { id: 'at', label: languageConfig[lang].at, value: data['A-T'] || data[languageConfig[lang].at.join('-')], color: config.color[4] },
    ];
}

function calculatePersonalityType(config, dimensions) {
    const type = dimensions
        .slice(0, 4)
        .map(d => d.id[getDominantTraitIndex(d.value[1])].toUpperCase())
        .join('');
    const personalityType = personalityTypes.find(p => p.type === type);

    if (!personalityType) {
        return { type, name: '未知类型', desc: '' };
    }

    let result = {
        type,
        name: getLocalizedContent(config.language, personalityType.name),
        desc: getLocalizedContent(config.language, personalityType.desc),
    };
    result = {
        ...result,
        avatar: `${imagesHostUrl}/${result.type.toLowerCase()}-${personalityType.name.en.toLowerCase()}-s3-v1-${config.gender}.png?t=${Date.now()}`,
    }

    if (dimensions.length > 4) {
        const atDimension = dimensions[4].value[0] < 50 ? 'A' : 'T';
        result.type += '-' + atDimension;
    }
    return result;
};

function getDominantTraitIndex(value) {
    return value > 50 ? 1 : 0;
}

function getMoreInfoLink(language, personalityType) {
    return `${baseUrl}/${getLocalizedContent(language, 'linkPrefix')}${personalityType.type.slice(0,4).toLowerCase()}-${getLocalizedContent(language, 'linkSuffix')}`;

}
const cache = new Map();

function fetchWithCache(url, responseType = 'json') {
    if (cache.has(url)) {
        return Promise.resolve(cache.get(url));
    }

    return fetch(url)
        .then(response => {
            if (responseType === 'blob') {
                return response.blob();
            } else {
                return response.json();
            }
        })
        .then(data => {
            cache.set(url, data);
            return data;
        });
}
const fontCache = new Map();

function loadFontWithCache(fontConfig) {
    const cacheKey = `${fontConfig.englishFont || 'default'}-${fontConfig.chineseFont || 'default'}`;

    if (fontCache.has(cacheKey)) {
        return Promise.resolve(fontCache.get(cacheKey));
    }

    const fontPromises = [];

    if (fontConfig.englishFont) {
        fontPromises.push(new Promise((resolve, reject) => {
            WebFont.load({
                google: {
                    families: [fontConfig.englishFont]
                },
                active: resolve,
                inactive: reject
            });
        }));
    }

    if (fontConfig.chineseFont) {
        const fontFamily = fontConfig.chineseFont.replace(/\s/g, '');
        fontPromises.push(new Promise((resolve, reject) => {
            const fontFace = new FontFace(
                fontFamily,
                `url(${imagesHostUrl}/fonts//${fontFamily}/${fontFamily}.woff2) format('woff2'),`, { unicodeRange: 'U+4E00-9FFF, U+3400-4DBF, U+20000-2A6DF, U+2A700-2B73F, U+2B740-2B81F, U+2B820-2CEAF, U+F900-FAFF, U+2F800-2FA1F' }
            );
            fontFace.load().then((loadedFace) => {
                document.fonts.add(loadedFace);
                resolve();
            }).catch(reject);
        }));
    }

    const fontPromise = fontPromises.length > 0 ? Promise.all(fontPromises) : Promise.resolve();
    fontCache.set(cacheKey, fontPromise);
    return fontPromise;
}

function resizeContainer(selector, width, height) {
    interact(selector)
        .resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
                move(event) {
                    var target = event.target
                    var x = (parseFloat(target.getAttribute('data-x')) || 0)
                    var y = (parseFloat(target.getAttribute('data-y')) || 0)

                    // 更新元素的宽度和高度
                    target.style.width = event.rect.width + 'px'
                    target.style.height = event.rect.height + 'px'

                    // 更新元素的位置
                    x += event.deltaRect.left
                    y += event.deltaRect.top

                    target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

                    target.setAttribute('data-x', x)
                    target.setAttribute('data-y', y)
                }
            },
            modifiers: [
                // 保持元素的宽高比
                interact.modifiers.aspectRatio({
                    ratio: 'preserve'
                }),

                // 限制大小
                interact.modifiers.restrictSize({
                    min: { width: 100, height: 100 },
                    max: { width: 900, height: 800 },
                }),
            ],
        })
}

function debounce(func, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function getMoreSaturatedColor(fillColor) {
    // 移除颜色字符串开头的 '#' 符号
    const hex = fillColor.replace('#', '');

    // 将十六进制颜色转换为RGB
    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);

    // 计算当前的饱和度
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    const saturationIncrease = 0.6;

    if (delta !== 0) {
        r = r + (max - r) * (saturationIncrease - 1);
        g = g + (max - g) * (saturationIncrease - 1);
        b = b + (max - b) * (saturationIncrease - 1);
    }

    // 确保RGB值在0-255范围内
    r = Math.min(255, Math.max(0, Math.round(r)));
    g = Math.min(255, Math.max(0, Math.round(g)));
    b = Math.min(255, Math.max(0, Math.round(b)));

    // 将RGB值转回十六进制
    const saturatedHex = '#' +
        ((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1);

    return saturatedHex;
}
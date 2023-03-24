(function() {
    var colorSchemaStorageKey = 'Fluid_Color_Scheme';
    var colorSchemaMediaQueryKey = '--color-mode';
    var bannerIdName = 'banner';
    var baseUrl = 'https://image.baobaodz.top/blog/banner';

    var colorToggleButtonSelector = '#color-toggle-btn';
    var colorToggleIconSelector = '#color-toggle-icon';
    var routes = ['about', 'archives', 'categories', 'tags'];


    function getLS(k) {
        try {
            return localStorage.getItem(k);
        } catch (e) {
            return null;
        }
    }

    function getSchemaFromCSSMediaQuery() {
        var res = getComputedStyle(rootElement).getPropertyValue(
            colorSchemaMediaQueryKey
        );
        if (typeof res === 'string') {
            return res.replace(/["'\s]/g, '');
        }
        return null;
    }

    var validColorSchemaKeys = {
        dark: true,
        light: true
    };

    var invertColorSchemaObj = {
        dark: 'light',
        light: 'dark'
    };

    function toggleCustomColorSchema() {
        var currentSetting = getLS(colorSchemaStorageKey);

        if (validColorSchemaKeys[currentSetting]) {
            // 从 localStorage 中读取模式，并取相反的模式
            currentSetting = invertColorSchemaObj[currentSetting];
        } else if (currentSetting === null) {
            // 当 localStorage 中没有相关值，或者 localStorage 抛了 Error
            // 先按照按钮的状态进行切换
            var iconElement = document.querySelector(colorToggleIconSelector);
            if (iconElement) {
                currentSetting = iconElement.getAttribute('data');
            }
            if (!iconElement || !validColorSchemaKeys[currentSetting]) {
                // 当 localStorage 中没有相关值，或者 localStorage 抛了 Error，则读取默认值并切换到相反的模式
                currentSetting = invertColorSchemaObj[getSchemaFromCSSMediaQuery()];
            }
        } else {
            return;
        }

        return currentSetting;
    }

    function changeBackground(banner) {
        console.log('🚀 -> changeBackground -> location.pathname', location.pathname);
        const currentSetting = toggleCustomColorSchema();
        const images = {
            '/about': {
                dark: `${baseUrl}/32323j448e4%20%284%29.jpg`,
                light: `${baseUrl}/32323j448e4%20%285%29.jpg`,
            },
            '/archives': {
                dark: `${baseUrl}/wallhaven-z86v5w.jpg`,
                light: `${baseUrl}/wallhaven-q2qpl7.jpg`,
            },
            '/categories': {
                dark: `${baseUrl}/wallhaven-6okw6w.jpg`,
                light: `${baseUrl}/wallhaven-6oqzgq.jpg`,
            },
            '/tags': {
                dark: `${baseUrl}/wallhaven-1pqq1w.jpg`,
                light: `${baseUrl}/wallhaven-9doozw.jpg`,
            },
        };

        const path = Object.keys(images).find((key) => location.pathname.includes(key));
        const backgroundImage = path ? images[path][currentSetting] : '';

        banner.style.backgroundImage = `url(${backgroundImage})`;
        banner.style.transition = "background 1.2s linear";
    }

    Fluid.utils.waitElementLoaded(colorToggleIconSelector, function() {

        // 只在关于页和归档页页生效
        const route = location.pathname.substring(location.pathname.indexOf('/') + 1, location.pathname.lastIndexOf('/'));
        if (!routes.includes(route)) {
            return;
        }

        var button = document.querySelector(colorToggleButtonSelector);
        var banner = document.getElementById(bannerIdName);

        if (button && banner) {
            changeBackground(banner);
            button.addEventListener('click', () => {

                changeBackground(banner);

            });
        }

    });

})();
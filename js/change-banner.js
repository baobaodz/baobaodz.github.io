(function() {
    var colorSchemaStorageKey = 'Fluid_Color_Scheme';
    var colorSchemaMediaQueryKey = '--color-mode';
    var bannerIdName = 'banner';
    var baseUrl = 'https://image.baobaodz.top/blog/banner';

    var colorToggleButtonSelector = '#color-toggle-btn';
    var colorToggleIconSelector = '#color-toggle-icon';


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
        var currentSetting = toggleCustomColorSchema();
        if (location.pathname.includes('about')) {
            if (currentSetting === 'dark') { // 此时为日间模式
                banner.style.backgroundImage = `url(${baseUrl}/32323j448e4%20%284%29.jpg)`;
            } else {
                banner.style.backgroundImage = `url(${baseUrl}/32323j448e4%20%285%29.jpg)`;
            }

        } else if (location.pathname.includes('archives')) {
            if (currentSetting === 'dark') { // 此时为日间模式
                banner.style.backgroundImage = `url(${baseUrl}/wallhaven-z86v5w.jpg)`;
            } else {
                banner.style.backgroundImage = `url(${baseUrl}/wallhaven-q2qpl7.jpg)`;
            }
        }

        banner.style.transition = "background 1.2s linear";
    }

    Fluid.utils.waitElementLoaded(colorToggleIconSelector, function() {

        // 只在关于页和归档页页生效
        if (!location.pathname.includes('about') && !location.pathname.includes('archives')) {
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
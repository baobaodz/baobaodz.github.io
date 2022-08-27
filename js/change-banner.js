/* global Fluid */

/**
 * Modify by https://blog.skk.moe/post/hello-darkmode-my-old-friend/
 */

(function() {
    var colorSchemaStorageKey = 'Fluid_Color_Scheme';
    var colorSchemaMediaQueryKey = '--color-mode';
    var colorToggleButtonName = 'color-toggle-btn';
    var colorToggleIconName = 'color-toggle-icon';
    var bannerIdName = 'banner';


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
        console.log('🚀 ~ file: change-banner.js ~ line 34 ~ getSchemaFromCSSMediaQuery ~ res', res);
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
        console.log('🚀 ~ file: change-banner.js ~ line 52 ~ toggleCustomColorSchema ~ currentSetting A', currentSetting);

        if (validColorSchemaKeys[currentSetting]) {
            // 从 localStorage 中读取模式，并取相反的模式
            currentSetting = invertColorSchemaObj[currentSetting];
            console.log('🚀 ~ file: change-banner.js ~ line 57 ~ toggleCustomColorSchema ~ currentSetting B', currentSetting);
        } else if (currentSetting === null) {
            // 当 localStorage 中没有相关值，或者 localStorage 抛了 Error
            // 先按照按钮的状态进行切换
            var iconElement = document.getElementById(colorToggleIconName);
            if (iconElement) {
                currentSetting = iconElement.getAttribute('data');
                console.log('🚀 ~ file: change-banner.js ~ line 64 ~ toggleCustomColorSchema ~ currentSetting C', currentSetting);
            }
            if (!iconElement || !validColorSchemaKeys[currentSetting]) {
                // 当 localStorage 中没有相关值，或者 localStorage 抛了 Error，则读取默认值并切换到相反的模式
                currentSetting = invertColorSchemaObj[getSchemaFromCSSMediaQuery()];
                console.log('🚀 ~ file: change-banner.js ~ line 69 ~ toggleCustomColorSchema ~ currentSetting D', currentSetting);
            }
        } else {
            return;
        }

        return currentSetting;
    }

    function changeBackground(banner, currentSetting) {
        console.log('🚀 ~ file: change-banner.js ~ line 73 ~ changeBackground ~ currentSetting', currentSetting);
        if (currentSetting === 'dark') { // 此时为日间模式
            banner.style.backgroundImage = "url(https://document.baobaodz.top/blog/banner/32323j448e4%20%284%29.jpg)";
        } else {
            banner.style.backgroundImage = "url(https://document.baobaodz.top/blog/banner/32323j448e4%20%285%29.jpg)";
        }
        banner.style.transition = "background 1s linear";
    }

    Fluid.utils.waitElementLoaded(colorToggleButtonName, function() {

        // 当用户点击切换按钮时，获得新的显示模式、写入 localStorage、并在页面上生效
        var button = document.getElementById(colorToggleButtonName);
        var banner = document.getElementById(bannerIdName);
        const currentSetting = toggleCustomColorSchema();
        if (button && banner) {
            changeBackground(banner, currentSetting);
            button.addEventListener('click', () => {

                changeBackground(banner, currentSetting);

            });
        }

    });

})();
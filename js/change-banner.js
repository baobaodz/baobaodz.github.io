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
            var iconElement = document.getElementById(colorToggleIconName);
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
        if (currentSetting === 'dark') { // 此时为日间模式
            banner.style.backgroundImage = "url(https://document.baobaodz.top/blog/banner/32323j448e4%20%284%29.jpg)";
        } else {
            banner.style.backgroundImage = "url(https://document.baobaodz.top/blog/banner/32323j448e4%20%285%29.jpg)";
        }
        banner.style.transition = "background 1.2s linear";
    }

    Fluid.utils.waitElementLoaded(colorToggleButtonName, function() {

        // 当用户点击切换按钮时，获得新的显示模式、写入 localStorage、并在页面上生效
        var button = document.getElementById(colorToggleButtonName);
        var banner = document.getElementById(bannerIdName);

        if (button && banner) {
            changeBackground(banner);
            button.addEventListener('click', () => {

                changeBackground(banner);

            });
        }

    });

})();
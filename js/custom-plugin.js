// eslint-disable-next-line no-undef
Fluid.plugins.myTyping = function(target, type, complete) {

    if (!window.Typed) { return; }

    var typed = new window.Typed('#subtitle', {
        strings: [
            '  ',
            text + '&nbsp;'
        ],
        cursorChar: CONFIG.typing.cursorChar,
        typeSpeed: CONFIG.typing.typeSpeed,
        loop: CONFIG.typing.loop
    });
    typed.stop();
    var subtitle = document.getElementById('subtitle');
    if (subtitle) {
        subtitle.innerText = '';
    }
    $(document).ready(function() {
        $('.typed-cursor').addClass('h2');
        console.log('🚀 ~ file: custom-plugin.js ~ line 21 ~ $ ~ typed', typed);
        typed.start();
    });
};
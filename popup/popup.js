const passdiv = document.getElementById('password');
const gibberish = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];
const slider = document.getElementById("length");
const mLength = document.getElementById('lengthNum');
mLength.value = slider.value;
var upper = true;
var lower = true;
var number = true;
var symbol = true;

/**
 * @typedef { object } AppSettingsCharset
 * @property { boolean } upper
 * @property { boolean } lower
 * @property { boolean } number
 * @property { boolean } symbol
 */

/**
 * @typedef { object } AppSettings
 * @property { number } length Longitud de la contraseña
 * @property { AppSettingsCharset } charset
 */

/**
 * @typedef { object } AppParams
 * @property { Array<string> } passwords
 * @property { AppSettings } settings
 */

function AppSetup()
{
    chrome.storage?.local?.get(['passwords', 'settings'], (res) => {
        /** @type { AppParams } */
        const params = {
            passwords: res.passwords || new Array(),
            settings: res.settings || {}
        };

        const passwordLengthSlider = document.getElementById('length');
        const passwordLengthManual = document.getElementById('lengthNum');
        const upper = document.getElementById('upper');
        const lower = document.getElementById('lower');
        const number = document.getElementById('number');
        const symbol = document.getElementById('symbol');

        passwordLengthSlider.max = params.settings.length;
        passwordLengthManual.max = params.settings.length;
        if (params.settings.charset.upper ?? true) upper.checked;
        if (params.settings.charset.lower ?? false) lower.checked;
        if (params.settings.charset.number ?? true) number.checked;
        if (params.settings.charset.symbol ?? true) symbol.checked;
    });
};

function reloadPassword(len=30)
{
    passdiv.textContent = '';
    passdiv.innerHTML = '';

    if (!upper && !lower && !number && !symbol) return passdiv.textContent = 'Selecciona algo :(';

    for (var i = 0; i < len; i++)
    {
        const char = gibberish.at(Math.floor(Math.random() * gibberish.length));
        if ((char.match(/[A-Z]/) && !upper) || (char.match(/[a-z]/) && !lower) || (char.match(/\d/) && !number) || (char.match(/[$-/:-?{-~!"^_`\[\]@\\#]/) && !symbol))
            i--;
        else
            passdiv.insertAdjacentHTML('beforeend', `<span style="color: #${ char.match(/[a-zA-Z]/) ? '262626ff' : char.match(/\d/) ? '4f6dffff' : 'ff78beff' };">${ char }</span>`);
    };
};

function updateGradient()
{
    reloadPassword(slider.value);
    mLength.value = slider.value;
    const min = slider.min || 5;
    const max = slider.max || 30;
    const val = ((slider.value - min) * 100) / (max - min);
    slider.style.setProperty("--value", val + "%");
};

function updateSlider()
{
    slider.value = mLength.value;
    updateGradient();
};

updateGradient();

window.onload = function() {
    AppSetup()
    reloadPassword(slider.value);

    mLength.addEventListener('change', () => updateSlider());
    document.getElementById('uncap').addEventListener('click', () => {
        if (slider.max === '30')
        {
            slider.setAttribute('max', '9999');
            mLength.setAttribute('max', '9999');
        }
        else
        {
            slider.setAttribute('max', '30');
            mLength.setAttribute('max', '30');
        };

        updateGradient();
    });
    document.getElementById('length').addEventListener('input', () => updateGradient());
    document.getElementById('reload').addEventListener('click', () => reloadPassword(slider.value));
    document.getElementById('copy').addEventListener('click', () => {
        document.getElementById('copy').style.opacity = 0;
        document.getElementById('copied').style.opacity = 1;
        navigator.clipboard.writeText(passdiv.textContent);
        setTimeout(() => {
            document.getElementById('copy').style.opacity = 1;
            document.getElementById('copied').style.opacity = 0;
        }, 300);
    });
    document.getElementById('upper').addEventListener('change', () => { upper = !upper; reloadPassword(slider.value) });
    document.getElementById('lower').addEventListener('change', () => { lower = !lower; reloadPassword(slider.value) });
    document.getElementById('number').addEventListener('change', () => { number = !number; reloadPassword(slider.value) });
    document.getElementById('symbol').addEventListener('change', () => { symbol = !symbol; reloadPassword(slider.value) });
};
function UpdateSlider()
{
    const slider = document.getElementById('length');
    const number = document.getElementById('lengthNum');

    number.value = slider.value;
    const min = slider.min || 5;
    const max = slider.max || 30;
    const val = ((slider.value - min) * 100) / (max - min);

    slider.style.setProperty('--value', val + '%');

    chrome.storage?.local?.get(['settings'], (res) => {
        /** @type { AppParams } */
        const params = {
            settings: res.settings
        };
        
        params.settings.length = slider.value;

        chrome.storage.local.set({ settings: params.settings });

        ReloadPassword();
    });
};

function UpdateSliderFromNumber()
{
    const slider = document.getElementById('length');
    const number = document.getElementById('lengthNum');

    slider.value = number.value;
    UpdateSlider();
};

function ReloadPassword()
{
    const gibberish = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];

    chrome.storage?.local?.get(['passwords', 'settings'], (res) => {
        /** @type { AppParams } */
        const params = {
            passwords: res.passwords || new Array(),
            settings: res.settings
        };

        const passwordBox = document.getElementById('password');
        passwordBox.innerHTML = '';

        if (
            !params.settings.charset.upper &&
            !params.settings.charset.lower &&
            !params.settings.charset.number &&
            !params.settings.charset.symbol
        )
        {
            return passwordBox.textContent = '>:(';

            /*document.getElementById('upper').disabled = true;
            document.getElementById('lower').disabled = true;
            document.getElementById('number').disabled = true;
            document.getElementById('symbol').disabled = true;
            document.getElementById('length').disabled = true;
            document.getElementById('lengthNum').disabled = true;
            document.getElementById('reload').disabled = true;
            document.getElementById('copy').disabled = true;*/
        };

        for (var i = 0; i < params.settings.length; i++)
        {
            const char = gibberish.at(Math.floor(Math.random() * gibberish.length));
            if (
                (char.match(/[A-Z]/) && !params.settings.charset.upper) ||
                (char.match(/[a-z]/) && !params.settings.charset.lower) ||
                (char.match(/\d/) && !params.settings.charset.number) ||
                (char.match(/[$-/:-?{-~!"^_`\[\]@\\#]/) && !params.settings.charset.symbol)
            )
                i--;
            else
                passwordBox.insertAdjacentHTML('beforeend',
                    `<span style="color: #${ char.match(/[a-zA-Z]/) ? '262626ff' : char.match(/\d/) ? '4f6dffff' : 'ff78beff' };">${ char }</span>`
                );
        };

        const password = passwordBox.textContent;
        if (password.length > 64) return;

        params.passwords.unshift(password);
        params.passwords = params.passwords.slice(0, 30);

        chrome.storage.local.set({ passwords: params.passwords });

        return;
    });
};

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
/**
 * 
 */
function AppSetup()
{
    chrome.storage?.local?.get(['passwords', 'settings'], (res) => {
        /** @type { AppParams } */
        const params = {
            passwords: res.passwords || new Array(),
            settings: res.settings || { length: 18, charset: { upper: true, lower: true, number: true, symbol: true } }
        };

        if (
            !params.settings.charset.upper &&
            !params.settings.charset.lower &&
            !params.settings.charset.number &&
            !params.settings.charset.symbol
        ) params.settings.charset.upper = true;

        document.getElementById('length').value = params.settings.length;
        document.getElementById('lengthNum').value = params.settings.length;
        document.getElementById('upper').checked = params.settings.charset.upper;
        document.getElementById('lower').checked = params.settings.charset.lower;
        document.getElementById('number').checked = params.settings.charset.number;
        document.getElementById('symbol').checked = params.settings.charset.symbol;

        chrome.storage.local.set({ settings: params.settings });

        UpdateSlider();
        ReloadPassword();
    });

    document.getElementById('lengthNum').addEventListener('input', () => UpdateSliderFromNumber());
    document.getElementById('length').addEventListener('input', () => UpdateSlider());

    function changeCharset(charset)
    {
        chrome.storage?.local?.get(['settings'], (res) => {
            /** @type { AppParams } */
            const params = {
                settings: res.settings
            };
            
            params.settings.charset[charset] = !params.settings.charset[charset];
            chrome.storage.local.set({ settings: params.settings });

            ReloadPassword();
        });
    };

    document.getElementById('upper').addEventListener('change', () => changeCharset('upper'));
    document.getElementById('lower').addEventListener('change', () => changeCharset('lower'));
    document.getElementById('number').addEventListener('change', () => changeCharset('number'));
    document.getElementById('symbol').addEventListener('change', () => changeCharset('symbol'));

    document.getElementById('history').addEventListener('click', () => {
        const passwordHistory = document.getElementById('passHistory');
        const passwordHistoryContent = document.getElementById('passHistoryContent');

        chrome.storage?.local?.get(['passwords'], (res) => {
            /** @type { AppParams } */
            const params = {
                passwords: res.passwords
            };

            for (const password of params.passwords)
            {
                console.log(password)
                passwordHistoryContent.insertAdjacentHTML('afterbegin', `<div style="padding: 10px 15px; background-color: #54ddff11; border-radius: 10px;"><span>${ password }</span><span label="copy" class="material-symbols-outlined btn">content_copy</span></div>`);
            };

            passwordHistory.style.maxHeight = '250px';
        });
    });

    return;
};

window.onload = function() {
    AppSetup()

    document.getElementById('uncap').addEventListener('click', () => {
        if (document.getElementById('length').max === '30')
        {
            document.getElementById('length').setAttribute('max', '128');
            document.getElementById('lengthNum').setAttribute('max', '128');
            document.getElementById('uncap').textContent = 128;
        }
        else if (document.getElementById('length').max === '128')
        {
            document.getElementById('length').setAttribute('max', '9999');
            document.getElementById('lengthNum').setAttribute('max', '9999');
            document.getElementById('uncap').textContent = 'sí.';
        }
        else
        {
            document.getElementById('length').setAttribute('max', '30');
            document.getElementById('lengthNum').setAttribute('max', '30');
            document.getElementById('uncap').textContent = 30;
        };

        UpdateSlider();
    });
    document.getElementById('reload').addEventListener('click', () => ReloadPassword());
    document.getElementById('copy').addEventListener('click', () => {
        document.getElementById('copy').style.opacity = 0;
        document.getElementById('copied').style.opacity = 1;
        navigator.clipboard.writeText(document.getElementById('password').textContent);
        setTimeout(() => {
            document.getElementById('copy').style.opacity = 1;
            document.getElementById('copied').style.opacity = 0;
        }, 300);
    });
};
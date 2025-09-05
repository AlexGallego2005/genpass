const passdiv = document.getElementById('password');
const gibberish = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','0','1','2','3','4','5','6','7','8','9','!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];
const slider = document.getElementById("length");
const mLength = document.getElementById('lengthNum');
mLength.value = slider.value;
var upper = true;
var lower = true;
var number = true;
var symbol = true;

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
    document.getElementById('copy').addEventListener('click', () => navigator.clipboard.writeText(passdiv.textContent));
    document.getElementById('upper').addEventListener('change', () => { upper = !upper; reloadPassword(slider.value) });
    document.getElementById('lower').addEventListener('change', () => { lower = !lower; reloadPassword(slider.value) });
    document.getElementById('number').addEventListener('change', () => { number = !number; reloadPassword(slider.value) });
    document.getElementById('symbol').addEventListener('change', () => { symbol = !symbol; reloadPassword(slider.value) });
};
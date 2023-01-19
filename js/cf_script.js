// --- Released as KarmaWare by Pete Rai - http://pete.rai.org.uk/

// --- various fiddle bit - have a play

const OVERLAP = document.getElementById("cf").getAttribute("overlap")
const ROTATION = 45; // degrees
const DELAY = 250; // milliseconds - for various animations
const SCALE = 1; // for when card flips to back
const SWIPE = 75; // pixels - min swipe length

// --- globals

var content = [ ...document.querySelectorAll('div.content')];
var index = 0; // Math.floor(content.length / 2);

// --- flips an item over

function action_flip(show) {
    let current = content[index];
    let shown = current.classList.contains('selected');
    let change = false;

    if (show && !shown) {
        change = true;
        current.classList.add('selected');
        current.style.transform = `translateX(10vw) translateY(-40vh) rotateY(180deg) rotateZ(90deg) scale(${ SCALE })`;
    }
    else if (shown && !show)
    {
        change = true;
        current.style.transform = 'translateX(-30vw) rotateY(0deg)';
        setTimeout (() => { current.classList.remove('selected') }, DELAY);
    }

    return change;
}

// --- move to previous item

function action_prev() {
    if (1) {
        index--;
        index = (content.length + index) % content.length;
        action_flow();
    }
}

// --- move to next item

function action_next() {
    if (1) {
        index++;
        index = (content.length + index) % content.length;
        action_flow();
    }
}

// --- jump to specified item

function action_goto(i) {
    if (1) {
        index = (content.length + i) % content.length;
        action_flow();
    }
}

// --- reflow the items

function action_flow() {
    content.forEach((c, i) =>  {
        let transform = '';
        let zindex = '';
        let offset = c.clientWidth * OVERLAP;

        if (i < index) {
            zindex = (content.length + index - i) % content.length;
            transform = `translateX(${ offset * (content.length + i - index) + 10}%) translateX(-30vw) rotateY(-${ ROTATION }deg)`;
        }

        else if (i === index) {
            zindex = content.length;
            transform = 'translateX(-30vw) rotateY(0deg) translateZ(140px)';
        }

        else /* if (i > index) */ {
            zindex = (content.length + index - i) % content.length;
            transform = `translateX(${ offset * (i - index) + 15}%) translateX(-30vw) rotateY(-${ ROTATION }deg)`;
        }

        c.style.transform = transform;
        c.style.zIndex = zindex;
    });

    setTimeout (() => { content[index].classList.add ('current') }, DELAY);
}

// --- state management

function state(event, context) {

    if (event === 'left') {
        action_flip(false) || action_prev();
    }

    else if (event === 'right') {
        action_flip(false) || action_next();
    }

    else if (event === 'select') {
        context === index ?  action_flip(true) : (action_flip(false) || action_goto(context));
    }

    else if (event === 'submit') {
        action_flip(true);
    }

    else if (event === 'dismiss') {
        action_flip(false);
    }

    else {
        // do nothing here
    }
}

// --- event management

function events() {

    document.addEventListener('keydown', event => {
        const EVENTS = {
            ArrowLeft: 'left',
            ArrowRight: 'right',
            Enter: 'submit',
            Backspace: 'dismiss',
            Escape: 'dismiss'
        };

        state(EVENTS[event.key]);
    });

    document.addEventListener('mouseup', event => {
        if (event.target.classList.contains('coverflow')) state('dismiss');
    });

    let touched = 0

    document.addEventListener('touchstart', event => {
        touched = event.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', event => {
        let moved = touched - event.changedTouches[0].screenX;
        if (moved < 0 && Math.abs(moved) > SWIPE) state('left');
        if (moved > 0 && Math.abs(moved) > SWIPE) state('right');
    });
  
    addEventListener('resize', (event) => { action_flow() });
}

// --- initialisation 

function init() {

    content.forEach((c, i) =>  {
        c.onclick = () => { state('select', i) };
        c.style.zIndex = index === i ? 1 : 0;
        c.style.transform = "translateX(-30vw)";
    });

    setTimeout (() => { action_flow() }, DELAY);
    events();
}

init();

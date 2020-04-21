const startButton = $('#startButton');
const stopButton = $('#stopButton');
const activityInput = $('#activityInput');
const activityName = $('#activityName');
const activities = [];
const apiKey = "BLF-DM7KWGlyxWxRriQXQXtxlkVgtNb3h_9J7yMH5yb8_mt2UNYXVPpvSrtcAREMiCvNrSm_1M3Z0BP_Hzs8GFo";
stopButton.hide();

var h = 0;
var m = 0;
var s = 0;
var runningInterval;
var isRunning = false;

startButton.on('click', startClock);

function startClock() {
    if (activityInput.val()) {
        startButton.hide();
        stopButton.show();
        runningInterval = setInterval(clock, 1000);
        isRunning = true;
        activityName.text(activityInput.val());
    }
}

stopButton.on('click', stopClock);

function stopClock() {
    stopButton.hide();
    startButton.show();
    clearInterval(runningInterval);
    isRunning = false;
    addActivity();
    resetClock();
    activityInput.val('');
    activityName.text('Doing nothing...');
    activityInput.prop('disabled',false);
}

function addActivity() {
    let alreadyExist = false;
    for (let i = 0; i < activities.length; i++) {
        if (activityInput.val() == activities[i].name) {
            alreadyExist = true;
            activities[i].h = h;
            activities[i].m = m;
            activities[i].s = s;
            break;
        }
    }

    if (alreadyExist == false) {
        activities.push({'name':activityInput.val(),'h':h,'m':m,'s':s});
    }

    var $li = $(`
    <li class="list-group-item">
        <div class="container">
            <div class="row">
                <div class='col-4 mt-2 name'>
                    ${activityInput.val()}
                </div>
                <div class='col-4 mt-2 duration'>
                    ${display(h)}:${display(m)}:${display(s)}
                </div>
                <div class='col-4 '>
                    <button class='btn btn-primary'>Resume</button>
                </div>
            </div> 
        </div>
    </li>`);
    $li.on('click', 'button', {name: activityInput.val()}, resume);
    $('#activityList').append($li);
}

function updateActivity(i) {
    // activities[i].h = h;
    // activities[i].m = m;
    // activities[i].s = s;

    // var $li = $('li.list-group-item');
    // $li.each(function() {
    //     var $this = $(this);
    //     if ($this.find('div.name').text().trim() == activities[i].name) {
    //         $this.find('div.duration').text(`${display(h)}:${display(m)}:${display(s)}`);
    //     };
    // })
}

function resume(event) {
    if (isRunning) {
        stopClock();
    }
    startButton.hide();
    stopButton.show();
    let selectedActivity = getActivityByName(event.data.name);
    activityName.text(event.data.name);
    activityInput.val(event.data.name);
    activityInput.prop('disabled',true);
    h = selectedActivity.h;
    m = selectedActivity.m;
    s = selectedActivity.s;
    displayClock();
    runningInterval = setInterval(clock, 1000);
    isRunning = true;
    var $li = $('li.list-group-item');
    $li.each(function() {
        var $this = $(this);
        if ($this.find('div.name').text().trim() == event.data.name) {
            $this.remove();
        };
    })
}

function clock() {
    s++;
    if (s == 60) {
        s = 0;
        m++;
        if (m == 60) {
            m = 0;
            h++
        }
    }
    displayClock();
}

function resetClock() {
    s = 0;
    m = 0;
    h = 0;
    displayClock();
}

function displayClock() {
    $('#sec').text(display(s));
    $('#min').text(display(m));
    $('#hour').text(display(h));
}

function display(val) {
    if (val < 10) {
        return '0' + val;
    }
    return val;
}

function getActivityByName(name) {
    for (let i = 0; i < activities.length; i++) {
        if (name == activities[i].name) {
            return activities[i];
        }
    }
    return null;
}

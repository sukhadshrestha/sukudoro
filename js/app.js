let is_running = false;
let timer_minutes = 25;
let timer_seconds = 0;
let focus_minutes = 25;
let focus_seconds = 0;
let break_minutes = 5;
let break_seconds = 0;
let timer;
let is_focus_period = true;

const timer_element = document.getElementById('timer');
const start_btn = document.getElementById('start');
const pause_btn = document.getElementById('pause');
const reset_btn = document.getElementById('reset');
const end_btn = document.getElementById('end');
const task_input = document.getElementById('task_input');
const add_task_btn = document.getElementById('add_task');
const task_list = document.getElementById('task_list');
const task_periods = document.getElementById('no_of_periods');
const focus_period_btn = document.getElementById('focus_period');
const break_period_btn = document.getElementById('break_period');

const audio_focus_over = new Audio('assets/audio/focus_period_over.mp3')
const audio_break_over = new Audio('assets/audio/break_over.mp3')

const custom_focus = document.getElementById('custom_focus');
const custom_break = document.getElementById('custom_break');
const save_customization_btn = document.getElementById('save_customization');

const customize_btn = document.getElementById('customize');
const popup = document.getElementById('popup');
const close_popup_btn = document.getElementById('close_popup_btn');

function updateTimer(){
    timer_element.textContent = `${String(timer_minutes).padStart(2,'0')}:${String(timer_seconds).padStart(2,'0')}`;
}

// popup for customization and done for tasks and store data in session

function customizeTime(){
    let custom_focus_time = custom_focus.value;
    let custom_break_time = custom_break.value;
    focus_minutes = custom_focus_time;
    break_minutes = custom_break_time;
    if(is_focus_period){
        timer_minutes = focus_minutes;
        timer_secondsseconds = focus_seconds;
        updateTimer();
    } 
    else {
        timer_minutes = break_minutes;
        timer_seconds = break_seconds;
        updateTimer();
    }
    popup.style.display = "none";
}

function focusPeriodTimer(){
    if(!is_focus_period){
        clearInterval(timer);
        timer_minutes = focus_minutes;
        timer_secondsseconds = focus_seconds;
        updateTimer();
        is_running = false;
        is_focus_period = true;
    }
}

function breakPeriodTimer(){
    if(is_focus_period){
        clearInterval(timer);
        timer_minutes = break_minutes;
        timer_seconds = break_seconds;
        updateTimer();
        is_running = false;
        is_focus_period = false;
    }
}

function startTimer(){
    if(is_running) return;
    is_running = true;
    timer = setInterval(() => {
        if(timer_seconds === 0){
            if(timer_minutes === 0){
                if(is_focus_period){
                    audio_focus_over.play();
                    alert("Focus Period has Ended");
                    breakPeriodTimer();
                    return;
                }
                else{
                    audio_break_over.play();
                    alert("Break is over");
                    focusPeriodTimer();
                    return;
                }
            }
            timer_minutes--;
            timer_seconds = 59;
        }
        else{
            timer_seconds--;
        }
        updateTimer();
    }, 1000)
}

function pauseTimer(){
    if(is_running == false) return;
    is_running = false;
    clearInterval(timer);
}

function resetTimer(){
    clearInterval(timer);
    is_running = false;
    if(is_focus_period){
        timer_minutes = focus_minutes;
        timer_seconds = focus_seconds;
        updateTimer();
    }
    else{
        timer_minutes = break_minutes;
        timer_seconds = break_seconds;
        updateTimer();    
    }
}

function endTimer(){
    if(is_focus_period){
        breakPeriodTimer();
    }
    else{
        focusPeriodTimer();
    }
}

function addTask(){
    const taskText = task_input.value.trim();
    const no_of_periods = task_periods.value;
    if(!taskText || !no_of_periods) return;

    const deleteTask = document.createElement('button');
    deleteTask.textContent = "Delete";
    deleteTask.addEventListener('click', () => {
        row.remove();
        // resetTimer();
    });

    let row = task_list.insertRow(-1);
    let column1 = row.insertCell(0);
    let column2 = row.insertCell(1);
    let column3 = row.insertCell(2);
    column1.innerHTML = `${taskText}`;
    column2.innerHTML = `${no_of_periods}`;
    column3.appendChild(deleteTask);
    task_input.value = '';
    task_periods.value = null;
}

// Event Listeners
start_btn.addEventListener('click', startTimer);
pause_btn.addEventListener('click', pauseTimer);
reset_btn.addEventListener('click', resetTimer);
end_btn.addEventListener('click', endTimer);
add_task_btn.addEventListener('click', addTask);
focus_period_btn.addEventListener('click', focusPeriodTimer);
break_period_btn.addEventListener('click', breakPeriodTimer);
save_customization_btn.addEventListener('click', customizeTime);

customize_btn.addEventListener('click', () => {
    popup.style.display = "flex";
})

popup.addEventListener('click', (event) =>{
    if(event.target === popup){
        popup.style.display = "none";
    }
})

close_popup_btn.addEventListener('click', () => {
    popup.style.display = "none";
})
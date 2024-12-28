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
const task_input = document.getElementById('task-input');
const add_task_btn = document.getElementById('add-task');
const task_list = document.getElementById('task-list');
const task_periods = document.getElementById('no-of-periods');
const focus_period_btn = document.getElementById('focus-period');
const break_period_btn = document.getElementById('break-period');

const audio_focus_over = new Audio('assets/audio/focus_period_over.mp3')
const audio_break_over = new Audio('assets/audio/break_over.mp3')

const custom_focus = document.getElementById('custom-focus');
const custom_break = document.getElementById('custom-break');
const save_customization_btn = document.getElementById('save-customization');

const customize_btn = document.getElementById('customize');
const popup = document.getElementById('popup');
const close_popup_btn = document.getElementById('close-popup-btn');

//Functions for TIMER start ------------------------------------------------------
function updateTimer(){
    timer_element.textContent = `${String(timer_minutes).padStart(2,'0')}:${String(timer_seconds).padStart(2,'0')}`;
}


function customizeTime(){
    let custom_focus_time = custom_focus.value;
    let custom_break_time = custom_break.value;
    focus_minutes = custom_focus_time;
    break_minutes = custom_break_time;
    
    if(!Number.isInteger(Number(focus_minutes)) || focus_minutes <= 0){
        custom_focus.style.border = '2px solid red';
        alert("Enter a natural number");
        return;
    }
    
    if(!Number.isInteger(Number(break_minutes)) || break_minutes <= 0){
        custom_break.style.border = '2px solid red';
        alert("Enter a natural number");
        return;
    }

    custom_focus.style.border = '1px solid #ccc';
    custom_break.style.border = '1px solid #ccc';

    if(is_focus_period){
        timer_minutes = focus_minutes;
        timer_seconds = focus_seconds;
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
        timer_seconds = focus_seconds;
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
    start_btn.disabled = true;
    pause_btn.disabled = false;
}

pause_btn.disabled = true;

function pauseTimer(){
    if(is_running == false) return;
    is_running = false;
    clearInterval(timer);
    start_btn.disabled = false;
    pause_btn.disabled = true;
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
    start_btn.disabled = false;
    pause_btn.disabled = true;
}

function endTimer(){
    if(is_focus_period){
        breakPeriodTimer();
    }
    else{
        focusPeriodTimer();
    }
    start_btn.disabled = false;
    pause_btn.disabled = true;
}

//Functions for TIMER end------------------------------------------------------

//Functions for TASK start ------------------------------------------------------
function addTask(){
    const task_text = task_input.value.trim();
    const no_of_periods = task_periods.value.trim();

    if(!task_text){
        task_input.style.border = '2px solid red';
        alert("Task is required");
        return;
    }

    if(!no_of_periods){
        task_periods.style.border = '2px solid red';
        alert("No. of periods is required");
        return;
    }

    if(!Number.isInteger(Number(no_of_periods)) || no_of_periods <= 0){
        task_periods.style.border = '2px solid red';
        alert("Enter a natural number");
        return;
    }


    task_periods.style.border = '1px solid #ccc';
    task_input.style.border = '1px solid #ccc';


    const row = document.createElement('tr');
    row.innerHTML = `
        <tr>
            <td class="task-text-cell">${task_text}</td>
            <td class="no-of-periods-cell">${no_of_periods}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        </tr>
    `;

    row.querySelector('.edit-btn').addEventListener('click', () => editRow(row));

    row.querySelector('.delete-btn').addEventListener('click', () => row.remove());

    task_list.appendChild(row);
    task_input.value = '';
    task_periods.value = null;
    saveTableData();
}

function editRow(row){
    const edit_btn = row.querySelector('.edit-btn');
    const task_cell = row.querySelector('.task-text-cell');
    const period_cell = row.querySelector('.no-of-periods-cell');

    const isEditing = edit_btn.getAttribute('data-editing') === 'true';

    if(!isEditing)
    {
        const originalText = task_cell.textContent.trim();
        const originalPeriod = period_cell.textContent.trim();

        task_cell.innerHTML = `<input type="text" id="new-text" value="${originalText}"/>`;
        period_cell.innerHTML = `<input type="number" id="new-period" value="${originalPeriod}"/>`;

        edit_btn.textContent = "Save";
        edit_btn.setAttribute('data-editing', 'true');
    }
    else{
        const new_text = document.getElementById('new-text');
        const new_period = document.getElementById('new-period');

        if(!new_text.value){
            new_text.style.border = '2px solid red';
            alert("Task is required");
            return;
        }
        
        if(!new_period){
            new_period.style.border = '2px solid red';
            alert("No. of periods is required");
            return;
        }
    
        if(!Number.isInteger(Number(new_period.value)) || new_period.value <= 0){
            new_period.style.border = '2px solid red';
            alert("Enter a natural number");
            return;
        }
        task_cell.textContent = new_text.value.trim();
        period_cell.textContent = new_period.value.trim();
        edit_btn.textContent = "Edit";
        edit_btn.setAttribute('data-editing', 'false');

        new_text.style.border = '1px solid #ccc';
        new_period.style.border = '1px solid #ccc';
    }
    saveTableData();
}
//Functions for TASKS end------------------------------------------------------

//Functions for STORAGE start------------------------------------------------------

function initializeTable() {
    const storedData = JSON.parse(localStorage.getItem('task_list')) || [];
    storedData.forEach(rowData => {
        addRowToTable(rowData.task, rowData.period);
    });
}

function addRowToTable(task, period){
    const row = document.createElement('tr');
    row.innerHTML = `
            <td class="task-text-cell">${task}</td>
            <td class="no-of-periods-cell">${period}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
    `;

    row.querySelector('.edit-btn').addEventListener('click', () => editRow(row));

    row.querySelector('.delete-btn').addEventListener('click', () => {
        row.remove();
        saveTableData();
    }
    );
    task_list.appendChild(row);
}

function saveTableData() {
    const table_rows = Array.from(task_list.querySelectorAll('tr')).filter(row => 
        row.querySelector('.task-text-cell') && row.querySelector('.no-of-periods-cell')
    );
    const table_data = table_rows.map(row => {
        const task = row.querySelector('.task-text-cell').textContent.trim();
        const period = row.querySelector('.no-of-periods-cell').textContent.trim();
        return {task, period};
    });
    localStorage.setItem('task_list', JSON.stringify(table_data));
}

initializeTable();
//Functions for STORAGE end------------------------------------------------------


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
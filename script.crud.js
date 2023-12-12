const taskListContainer = document.querySelector('.app__section-task-list');

const formTask = document.querySelector('.app__form-add-task');
const toggleFormTaskBtn = document.querySelector('.app__button--add-task');
const formLabel = document.querySelector('.app__form-label');

const textArea = document.querySelector('.app__form-textarea');

const cancelBtn = document.querySelector('.app__form-footer__button--cancel');

const deleteBtn = document.querySelector('.app__form-footer__button--delete');

const clearConcludedTask = document.querySelector('#btn-remove-completed');

const clearAlltaskList = document.querySelector('#btn-remove-all');

const taskActiveDescription = document.querySelector('.app__section-active-task-description');
const inProgressTask = document.querySelector('.app__section-active-task-label');


let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" />
</svg>
`
let taskSelected = null;
let itemTaskSelected = null;

let editingTask = null;
let editingParagrafh = null;

function clearForm(){
    editingTask = null;
    editingParagrafh = null;
    textArea.value = '';
    formTask.classList.add('hidden');
    taskActiveDescription.textContent = null;
}

const selectTask = (task, element) => {
   document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button){
    button.classList.remove('.app__section-task-list-item-active');
   })

   if(taskSelected === task){
    taskActiveDescription.textContent = null;
    itemTaskSelected = null;
    taskSelected = null;
    return
   }

   taskSelected = task;
   itemTaskSelected = element;
   taskActiveDescription.textContent = task.description;
   element.classList.add('.app__section-task-list-item-active');
}

const selectTaskToEdit = (task,element) => {
    if(editingTask == task){
        clearForm();
        return;
    }

    formLabel.textContent = 'Editing task';
    editingTask = task;
    editingParagrafh = element;
    textArea.value = task.description;
    formTask.classList.remove('hidden');
}


function createTask(task){
    const li = document.createElement('li');
    li.classList.add('app__section-task-list-item');

    const svgIcon = document.createElement('svg');
    svgIcon.innerHTML = taskIconSvg;

    const paragrafh = document.createElement('p');
    paragrafh.classList.add('app__section-task-list-item-description');
    paragrafh.textContent = task.description;

    const buttonSvg = document.createElement('button');
    buttonSvg.classList.add('app_button-edit');
    const editIcon = document.createElement('img');
    editIcon.src = '/imagens/edit.png';

    buttonSvg.append(editIcon);

    
    svgIcon.addEventListener('click', (event) => {

        if(task === taskSelected){
            event.stopPropagation();
            buttonSvg.setAttribute('disabled', true);
            li.classList.add('app__section-task-list-item-complete');
            taskSelected.concluded = true;
            updateLocalStorage();
        }
    })

    if(task.concluded){
        buttonSvg.setAttribute('disabled', true);
        li.classList.add('app__section-task-list-item-complete');
    }

    buttonSvg.onclick = (event) => {
        event.stopPropagation();
        selectTaskToEdit(task, paragrafh);
    }

    li.onclick = () => {
        selectTask(task, li);
    }
    
    li.append(svgIcon);
    li.append(paragrafh);
    li.append(buttonSvg);

    return li;
}

tasks.forEach(tarefa =>{
    const taskItem = createTask(tarefa);
    taskListContainer.append(taskItem);
})


toggleFormTaskBtn.addEventListener('click', () => {
    formLabel.textContent = 'Add task'; 
    formTask.classList.toggle('hidden');
})

cancelBtn.addEventListener('click', clearForm);

deleteBtn.addEventListener('click', () => {
    if(taskSelected){
        const index = tasks.indexOf(taskSelected);

        if(index !== -1){
            tasks.splice(index, 1);
        }

        itemTaskSelected.remove();
        tasks.filter(tarefa=> tarefa!= taskSelected);
        itemTaskSelected = null;
        taskSelected = null;
    }
    updateLocalStorage();
    clearForm();
})

const removeTasks = (justConcluded) => {
    const selector = justConcluded ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(selector).forEach( (element) => {
        element.remove();
    })

    tasks = justConcluded ? tasks.filter(task => !task.concluded) : [];
    taskActiveDescription.textContent = null;
    updateLocalStorage();
}
clearConcludedTask.addEventListener('click', () => removeTasks(true));

clearAlltaskList.addEventListener('click', () => removeTasks(false));


 function updateLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
 }

formTask.addEventListener('submit', (evento) =>{
    evento.preventDefault();
    if(editingTask){
        editingTask.description = textArea.value;
        editingParagrafh.textContent = textArea.value;
    }else{
        const task = {
            description: textArea.value,
            concluded: false
        };
    
    tasks.push(task);
    const taskItem = createTask(task);
    taskListContainer.append(taskItem);
    }
    updateLocalStorage();
    clearForm();
})


document.addEventListener('taskCompleted', function(e){
    if(taskSelected){
        taskSelected.concluded = true;
        itemTaskSelected.classList.add('app__section-task-list-item-complete');
        itemTaskSelected.querySelector('button').setAttribute('disabled', true);
        updateLocalStorage();
    }
})



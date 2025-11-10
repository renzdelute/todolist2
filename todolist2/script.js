const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addButton');
const lists = document.getElementById('list');

const MAX_LENGTH = 11;
const MAX_TASKS = 5;

function loadTasks() {
    const saved = localStorage.getItem('mytodos');
    if (saved) {
        lists.innerHTML = saved;

        lists.querySelectorAll('.task-checkbox').forEach(checkbox => {
            const label = checkbox.nextElementSibling;

            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    label.style.textDecoration = 'line-through';
                    label.style.color = 'red';
                } else {
                    label.style.textDecoration = 'none';
                    label.style.color = 'white';
                }
                saveTasks();     
            });
        });

        lists.querySelectorAll('.edit-btn').forEach(btn => {
            const li = btn.parentElement;
            btn.onclick = null;
            btn.addEventListener('click', () => editTask(li));
        }); 
            attachDeleteButtons();
    }
}

function saveTasks() {
    localStorage.setItem('mytodos', lists.innerHTML);
}

function attachDeleteButtons() {
    const buttons = lists.querySelectorAll('.delete-btn');
    buttons.forEach(btn => {
        btn.onclick = () => {
            btn.parentElement.parentElement.remove();
            saveTasks();
        };
    });
}

function add() {
    const text = taskInput.value.trim();
    const message = document.getElementById('message');

    message.textContent = '';
    message.style.color = 'red';
    setTimeout(() => {
        message.textContent = '';
    }, 5000);

    if (lists.children.length >= MAX_TASKS) {
        message.textContent = `Only ${MAX_TASKS} can be added!`;
        return;
    }

    if (text === '') {
        message.textContent = 'Type input!';
        return;
    }

    if (text.length > MAX_LENGTH) {
        message.textContent = `Too long! Maximum ${MAX_LENGTH} characters allowed!`;
        return;
    }

    if (!/^[a-zA-Z\s]*$/.test(text)) {
        message.textContent = 'Only letters and spaces are allowed!';
        return;
    }

    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';

    const label = document.createElement('label');
    label.textContent = text;
    label.className = 'task-text';

    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'edit-btn';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';

    taskActions.appendChild(editBtn);
    taskActions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(taskActions);
    lists.appendChild(li);

    editBtn.addEventListener('click', () => editTask(li));

    checkbox.addEventListener('change', () => {
        const currentLabel = li.querySelector('.task-text');
        if (checkbox.checked) {
            currentLabel.style.textDecoration = 'line-through';
            currentLabel.style.color = 'red';
        } else {
            currentLabel.style.textDecoration = 'none';
            currentLabel.style.color = 'white';
        }
        saveTasks();
    });
    attachDeleteButtons();
    taskInput.value = '';
    saveTasks();
    message.textContent = 'Task added successfully';
    message.style.color = 'green';

    setTimeout(() => {
        message.textContent = '';
    }, 5000);
}

function editTask(li) {
    const checkbox = li.querySelector('.task-checkbox');
    const label = li.querySelector('.task-text');
    const editBtn = li.querySelector('.edit-btn');

    const input = document.createElement('input');
    input.type = 'text';
    input.value = label.textContent;
    input.className = 'edit-input';
    input.maxLength = MAX_LENGTH;

    li.replaceChild(input, label);
    input.focus();
    input.select();

    const saveEdit = () => {
        const newText = input.value.trim();

        if (newText === '') {
            alert('Type Input!');
            input.focus();
            return;
        }
        if (newText.length > MAX_LENGTH) {
            alert(`Too long! Maximum ${MAX_LENGTH}!`);
            input.focus();
            return;
        }
        if (!/^[a-zA-Z\s]*$/.test(newText)) {
            alert('Only letters and spaces allowed!');
            input.focus();
            return;
        }

        const newLabel = document.createElement('label');
        newLabel.textContent = newText;
        newLabel.className = 'task-text';

        li.replaceChild(newLabel, input);

        if (checkbox.checked) {
            newLabel.style.textDecoration = 'line-through';
            newLabel.style.color = 'red';
        } else {
            newLabel.style.textDecoration = 'none';
            newLabel.style.color = 'white';
        }
        saveTasks();
        editBtn.onclick = null;
        editBtn.addEventListener('click', () => editTask(li));
    };

    input.addEventListener('keypress', e => {
        if (e.key === 'Enter') saveEdit();
    });
    input.addEventListener('blur', saveEdit);
}

addBtn.addEventListener('click', add);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') add();
});
loadTasks();
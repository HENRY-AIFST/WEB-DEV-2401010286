(function() {
  
  emailjs.init("eJZhjEd9BOjS6odD4");
})();


const form = document.getElementById('taskForm');
const list  = document.getElementById('taskList');


let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


function renderTasks() {
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    const dueStr = new Date(task.due).toLocaleString();
    li.innerHTML = `
      <div class="task-title">${task.title}</div>
      <div class="task-desc">${task.desc}</div>
      <div class="task-due">ðŸ“… ${dueStr}</div>
      <button class="delete-btn" onclick="deleteTask(${index})">âœ•</button>
    `;
    list.appendChild(li);
  });
}


form.addEventListener('submit', e => {
  e.preventDefault();
  const title   = document.getElementById('taskTitle').value.trim();
  const desc    = document.getElementById('taskDesc').value.trim();
  const due     = document.getElementById('taskDate').value;
  const email   = document.getElementById('taskEmail').value.trim();

  if (!title || !due || !email) return; 

  const newTask = {
    title,
    desc,
    due,               
    email,
    remindersSent: { '1': false, '2': false, '5': false }
  };

  tasks.push(newTask);
  saveAndRender();
  form.reset();
});

window.deleteTask = idx => {
  tasks.splice(idx, 1);
  saveAndRender();
};

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

const CHECK_INTERVAL = 60 * 1000; 
setInterval(checkUpcoming, CHECK_INTERVAL);

function checkUpcoming() {
  const now = new Date();
  const thresholds = [1, 2, 5]; // minutes before due

  tasks.forEach(task => {
    const dueDate = new Date(task.due);
    const diffMs = dueDate - now;

    if (!task.remindersSent) {
      task.remindersSent = { '1': false, '2': false, '5': false };
    }

    if (diffMs > 0) {
      for (const m of thresholds) {
        const windowMs = m * 60 * 1000;
        if (diffMs <= windowMs && !task.remindersSent[m]) {
          sendReminder(task, m);
          task.remindersSent[m] = true;
          localStorage.setItem('tasks', JSON.stringify(tasks));
          break; // send only one reminder per check
        }
      }
    }
  });
}


function sendReminder(task, minutesLeft) {
 
  const serviceID = 'gmail';               
  const templateID = 'my_template';       

  const templateParams = {
    to_email: task.email,
    title: task.title,
    dueTime: new Date(task.due).toLocaleString(),
    minutes_left: minutesLeft
  };

  emailjs.send(serviceID, templateID, templateParams)
    .then(() => {
      console.log(`âœ… Reminder (${minutesLeft} min) sent to ${task.email} for "${task.title}"`);
      alert(`ðŸ“§ Reminder (${minutesLeft} min) sent to ${task.email}`);
    })
    .catch(err => {
      console.error('âŒ Failed to send eâ€‘mail', err);
      alert('âŒ Could not send reminder â€“ check console for details.');
    });
}


renderTasks();

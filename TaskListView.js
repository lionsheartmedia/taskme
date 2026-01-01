/**
 * TodoFusion - Task List View Component
 * Handles rendering and updating the task list UI
 */

const TaskListView = {
  container: null,
  emptyState: null,
  currentFilter: 'all',
  currentSearch: '',

  /**
   * Initialize the task list view
   * @param {HTMLElement} container - Container element for tasks
   * @param {HTMLElement} emptyState - Empty state element
   */
  init(container, emptyState) {
    this.container = container;
    this.emptyState = emptyState;
  },

  /**
   * Render all tasks based on current filter
   * @param {string} filter - Filter type
   * @param {string} search - Search query
   */
  render(filter = this.currentFilter, search = this.currentSearch) {
    this.currentFilter = filter;
    this.currentSearch = search;

    let tasks = this.getTasksForFilter(filter);

    // Apply search filter
    if (search) {
      tasks = TaskService.searchTasks(search).filter(task => 
        this.shouldShowTask(task, filter)
      );
    }

    // Sort tasks
    tasks = TaskService.sortTasks(tasks, 'createdAt', 'desc');

    // Update UI
    this.container.innerHTML = '';

    if (tasks.length === 0) {
      this.showEmptyState();
    } else {
      this.hideEmptyState();
      tasks.forEach(task => {
        const taskElement = this.createTaskElement(task);
        this.container.appendChild(taskElement);
      });
    }

    // Update counts
    this.updateCounts();
  },

  /**
   * Get tasks for specific filter
   * @param {string} filter - Filter type
   * @returns {Array<Task>}
   */
  getTasksForFilter(filter) {
    switch (filter) {
      case 'today':
        return TaskService.getTodayTasks();
      case 'upcoming':
        return TaskService.getUpcomingTasks();
      case 'completed':
        return TaskService.getCompletedTasks();
      case 'all':
      default:
        return TaskService.getAllTasks().filter(t => !t.completed);
    }
  },

  /**
   * Check if task should be shown for filter
   * @param {Task} task - Task instance
   * @param {string} filter - Filter type
   * @returns {boolean}
   */
  shouldShowTask(task, filter) {
    switch (filter) {
      case 'today':
        return task.isDueToday() && !task.completed;
      case 'upcoming':
        return task.isDueThisWeek() && !task.isDueToday() && !task.completed;
      case 'completed':
        return task.completed;
      case 'all':
      default:
        return !task.completed;
    }
  },

  /**
   * Create HTML element for a task
   * @param {Task} task - Task instance
   * @returns {HTMLElement}
   */
  createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `task-item ${task.completed ? 'completed' : ''}`;
    div.setAttribute('data-task-id', task.id);

    const priorityBadge = `<span class="badge badge--${task.getPriorityColor()}">${task.getPriorityIcon()} ${task.priority}</span>`;
    
    const dueDateBadge = task.dueDate ? 
      `<span class="badge ${task.isOverdue() ? 'badge--error' : 'badge--info'}">
        📅 ${task.getFormattedDueDate()}
      </span>` : '';

    const tagsHTML = task.tags.length > 0 ?
      task.tags.map(tag => `<span class="badge badge--primary">#${tag}</span>`).join('') : '';

    div.innerHTML = `
      <div class="task-item__header">
        <div class="task-item__checkbox">
          <input 
            type="checkbox" 
            ${task.completed ? 'checked' : ''} 
            data-action="toggle-complete"
            aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}"
          >
        </div>
        <div class="task-item__content">
          <div class="task-item__title">${this.escapeHtml(task.title)}</div>
          ${task.description ? `<div class="text-secondary text-sm mb-xs">${this.escapeHtml(task.description)}</div>` : ''}
          <div class="task-item__meta">
            ${priorityBadge}
            ${dueDateBadge}
            ${tagsHTML}
          </div>
        </div>
        <div class="flex gap-sm">
          <button 
            class="btn btn--icon btn--ghost" 
            data-action="edit-task"
            aria-label="Edit task"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg>
          </button>
          <button 
            class="btn btn--icon btn--ghost" 
            data-action="delete-task"
            aria-label="Delete task"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Add event listeners
    this.attachTaskEventListeners(div, task);

    return div;
  },

  /**
   * Attach event listeners to task element
   * @param {HTMLElement} element - Task element
   * @param {Task} task - Task instance
   */
  attachTaskEventListeners(element, task) {
    // Checkbox toggle
    const checkbox = element.querySelector('[data-action="toggle-complete"]');
    if (checkbox) {
      checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        TaskService.toggleTaskComplete(task.id);
        this.render();
      });
    }

    // Edit button
    const editBtn = element.querySelector('[data-action="edit-task"]');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof ModalManager !== 'undefined') {
          ModalManager.openEditModal(task);
        }
      });
    }

    // Delete button
    const deleteBtn = element.querySelector('[data-action="delete-task"]');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this task?')) {
          TaskService.deleteTask(task.id);
          this.render();
        }
      });
    }
  },

  /**
   * Update task counts in sidebar
   */
  updateCounts() {
    const stats = TaskService.getStatistics();
    
    // Update filter counts
    this.updateCount('allTasksCount', stats.active);
    this.updateCount('todayTasksCount', TaskService.getTodayTasks().length);
    this.updateCount('upcomingTasksCount', TaskService.getUpcomingTasks().length);
    this.updateCount('completedTasksCount', stats.completed);

    // Update priority counts
    this.updateCount('highPriorityCount', TaskService.getTasksByPriority('high').length);
    this.updateCount('mediumPriorityCount', TaskService.getTasksByPriority('medium').length);
    this.updateCount('lowPriorityCount', TaskService.getTasksByPriority('low').length);
  },

  /**
   * Update individual count element
   * @param {string} elementId - Element ID
   * @param {number} count - Count value
   */
  updateCount(elementId, count) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = count;
    }
  },

  /**
   * Show empty state
   */
  showEmptyState() {
    if (this.emptyState) {
      this.emptyState.style.display = 'block';
    }
    if (this.container) {
      this.container.style.display = 'none';
    }
  },

  /**
   * Hide empty state
   */
  hideEmptyState() {
    if (this.emptyState) {
      this.emptyState.style.display = 'none';
    }
    if (this.container) {
      this.container.style.display = 'block';
    }
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Make TaskListView available globally
if (typeof window !== 'undefined') {
  window.TaskListView = TaskListView;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TaskListView;
}

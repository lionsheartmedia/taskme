/**
 * TodoFusion - Modal Manager
 * Handles modal dialogs for task creation and editing
 */

const ModalManager = {
  modal: null,
  overlay: null,
  form: null,
  currentTaskId: null,
  isOpen: false,

  /**
   * Initialize the modal manager
   */
  init() {
    this.modal = document.getElementById('taskModal');
    this.form = document.getElementById('taskForm');
    
    if (!this.modal || !this.form) {
      console.error('Modal or form not found');
      return;
    }

    this.overlay = this.modal;
    this.attachEventListeners();
  },

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Close button
    const closeBtn = this.modal.querySelector('.modal__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancelTaskBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.close());
    }

    // Close on backdrop click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // New task button
    const newTaskBtn = document.getElementById('newTaskBtn');
    if (newTaskBtn) {
      newTaskBtn.addEventListener('click', () => this.openCreateModal());
    }
  },

  /**
   * Open modal for creating a new task
   */
  openCreateModal() {
    this.currentTaskId = null;
    this.clearForm();
    this.setModalTitle('New Task');
    this.open();
  },

  /**
   * Open modal for editing an existing task
   * @param {Task} task - Task to edit
   */
  openEditModal(task) {
    this.currentTaskId = task.id;
    this.populateForm(task);
    this.setModalTitle('Edit Task');
    this.open();
  },

  /**
   * Open the modal
   */
  open() {
    this.isOpen = true;
    this.overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    const firstInput = this.form.querySelector('input, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  },

  /**
   * Close the modal
   */
  close() {
    this.isOpen = false;
    this.overlay.classList.remove('is-active');
    document.body.style.overflow = '';
    this.clearForm();
    this.currentTaskId = null;
  },

  /**
   * Set modal title
   * @param {string} title - Modal title
   */
  setModalTitle(title) {
    const titleElement = document.getElementById('taskModalTitle');
    if (titleElement) {
      titleElement.textContent = title;
    }
  },

  /**
   * Handle form submission
   */
  handleSubmit() {
    const formData = this.getFormData();
    
    if (this.currentTaskId) {
      // Update existing task
      TaskService.updateTask(this.currentTaskId, formData);
    } else {
      // Create new task
      TaskService.createTask(formData);
    }

    // Refresh the task list
    if (typeof TaskListView !== 'undefined') {
      TaskListView.render();
    }

    this.close();
  },

  /**
   * Get form data as object
   * @returns {Object} Form data
   */
  getFormData() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const dueDate = document.getElementById('taskDueDate').value || null;
    const priority = document.getElementById('taskPriority').value;
    const tagsInput = document.getElementById('taskTags').value.trim();
    
    const tags = tagsInput
      ? tagsInput.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean)
      : [];

    return {
      title,
      description,
      dueDate,
      priority,
      tags
    };
  },

  /**
   * Populate form with task data
   * @param {Task} task - Task to populate form with
   */
  populateForm(task) {
    document.getElementById('taskTitle').value = task.title || '';
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskDueDate').value = task.dueDate ? task.dueDate.split('T')[0] : '';
    document.getElementById('taskPriority').value = task.priority || 'medium';
    document.getElementById('taskTags').value = task.tags.join(', ');
  },

  /**
   * Clear form data
   */
  clearForm() {
    this.form.reset();
    
    // Clear any validation errors
    const errorMessages = this.form.querySelectorAll('.input-error-message');
    errorMessages.forEach(msg => msg.remove());
    
    const inputs = this.form.querySelectorAll('.input');
    inputs.forEach(input => input.classList.remove('input--error'));
  },

  /**
   * Show validation error
   * @param {string} inputId - Input element ID
   * @param {string} message - Error message
   */
  showError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.classList.add('input--error');
    
    // Remove existing error message if any
    const existingError = input.parentElement.querySelector('.input-error-message');
    if (existingError) {
      existingError.remove();
    }

    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error-message';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    input.parentElement.appendChild(errorDiv);
  },

  /**
   * Clear validation error
   * @param {string} inputId - Input element ID
   */
  clearError(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.classList.remove('input--error');
    
    const errorMessage = input.parentElement.querySelector('.input-error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }
};

// Make ModalManager available globally
if (typeof window !== 'undefined') {
  window.ModalManager = ModalManager;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModalManager;
}

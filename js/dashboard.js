/**
 * TodoFusion - Dashboard Controller
 * Main controller for the dashboard page
 */

const Dashboard = {
  currentFilter: 'all',
  currentSearch: '',

  /**
   * Initialize the dashboard
   */
  init() {
    // Initialize theme
    if (typeof initTheme === 'function') {
      initTheme();
    }

    // Initialize components
    this.initTaskListView();
    this.initModalManager();
    this.initEventListeners();
    this.initSearch();
    
    // Initial render
    this.render();

    // Check for overdue tasks
    this.checkOverdueTasks();

    console.log('TodoFusion Dashboard initialized');
  },

  /**
   * Initialize task list view
   */
  initTaskListView() {
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    
    if (taskList && emptyState) {
      TaskListView.init(taskList, emptyState);
    }
  },

  /**
   * Initialize modal manager
   */
  initModalManager() {
    ModalManager.init();
  },

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Sidebar filter navigation
    const taskListsNav = document.getElementById('taskListsNav');
    if (taskListsNav) {
      taskListsNav.addEventListener('click', (e) => {
        const listItem = e.target.closest('.sidebar-list-item');
        if (listItem) {
          const filter = listItem.getAttribute('data-filter');
          if (filter) {
            this.setFilter(filter);
            this.updateActiveFilter(listItem);
            this.updateViewTitle(filter);
          }
        }
      });
    }

    // Priority filter navigation
    const priorityNav = document.getElementById('priorityNav');
    if (priorityNav) {
      priorityNav.addEventListener('click', (e) => {
        const listItem = e.target.closest('.sidebar-list-item');
        if (listItem) {
          const priority = listItem.getAttribute('data-priority');
          if (priority) {
            this.setFilter('priority-' + priority);
            this.updateActiveFilter(listItem);
            this.updateViewTitle('priority', priority);
          }
        }
      });
    }

    // Mobile sidebar toggle (if needed)
    this.initMobileSidebar();
  },

  /**
   * Initialize search functionality
   */
  initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.currentSearch = e.target.value.trim();
          this.render();
        }, 300);
      });
    }
  },

  /**
   * Initialize mobile sidebar toggle
   */
  initMobileSidebar() {
    // Add hamburger menu for mobile
    const header = document.querySelector('.dashboard-main');
    if (header && window.innerWidth <= 1024) {
      const menuBtn = document.createElement('button');
      menuBtn.className = 'btn btn--icon show-tablet';
      menuBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
      menuBtn.style.position = 'fixed';
      menuBtn.style.top = '16px';
      menuBtn.style.left = '16px';
      menuBtn.style.zIndex = '1001';
      
      menuBtn.addEventListener('click', () => {
        const sidebar = document.querySelector('.dashboard-sidebar');
        if (sidebar) {
          sidebar.classList.toggle('is-open');
        }
      });
      
      document.body.appendChild(menuBtn);
    }
  },

  /**
   * Set current filter
   * @param {string} filter - Filter type
   */
  setFilter(filter) {
    this.currentFilter = filter;
    this.render();
  },

  /**
   * Update active filter in sidebar
   * @param {HTMLElement} activeItem - Active list item
   */
  updateActiveFilter(activeItem) {
    // Remove active class from all items
    document.querySelectorAll('.sidebar-list-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to clicked item
    if (activeItem) {
      activeItem.classList.add('active');
    }
  },

  /**
   * Update view title based on filter
   * @param {string} filter - Filter type
   * @param {string} meta - Additional metadata (e.g., priority level)
   */
  updateViewTitle(filter, meta = null) {
    const titleElement = document.getElementById('currentViewTitle');
    const subtitleElement = document.getElementById('currentViewSubtitle');
    
    if (!titleElement) return;

    let title = 'All Tasks';
    let subtitle = 'Manage and organize your tasks';

    switch (filter) {
      case 'all':
        title = 'All Tasks';
        subtitle = 'Manage and organize your tasks';
        break;
      case 'today':
        title = 'Today';
        subtitle = 'Tasks due today';
        break;
      case 'upcoming':
        title = 'Upcoming';
        subtitle = 'Tasks due this week';
        break;
      case 'completed':
        title = 'Completed';
        subtitle = 'Finished tasks';
        break;
      case 'priority':
        title = `${meta.charAt(0).toUpperCase() + meta.slice(1)} Priority`;
        subtitle = `Tasks with ${meta} priority`;
        break;
    }

    titleElement.textContent = title;
    if (subtitleElement) {
      subtitleElement.textContent = subtitle;
    }
  },

  /**
   * Render the dashboard
   */
  render() {
    let filter = this.currentFilter;

    // Handle priority filters
    if (filter.startsWith('priority-')) {
      const priority = filter.replace('priority-', '');
      const tasks = TaskService.getTasksByPriority(priority);
      
      if (this.currentSearch) {
        const searchedTasks = TaskService.searchTasks(this.currentSearch);
        const filtered = tasks.filter(task => 
          searchedTasks.some(st => st.id === task.id)
        );
        this.renderTasks(filtered);
      } else {
        this.renderTasks(tasks);
      }
    } else {
      TaskListView.render(filter, this.currentSearch);
    }
  },

  /**
   * Render specific tasks
   * @param {Array<Task>} tasks - Tasks to render
   */
  renderTasks(tasks) {
    const container = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    
    if (!container) return;

    container.innerHTML = '';

    if (tasks.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      container.style.display = 'none';
    } else {
      if (emptyState) emptyState.style.display = 'none';
      container.style.display = 'block';
      
      tasks.forEach(task => {
        const taskElement = TaskListView.createTaskElement(task);
        container.appendChild(taskElement);
      });
    }

    TaskListView.updateCounts();
  },

  /**
   * Check for overdue tasks and show alert
   */
  checkOverdueTasks() {
    const overdueTasks = TaskService.getOverdueTasks();
    const alertPanel = document.getElementById('alertPanel');
    const alertTasksList = document.getElementById('alertTasksList');

    if (overdueTasks.length > 0 && alertPanel && alertTasksList) {
      const taskNames = overdueTasks.slice(0, 3).map(t => t.title).join(', ');
      const moreCount = overdueTasks.length > 3 ? ` and ${overdueTasks.length - 3} more` : '';
      
      alertTasksList.textContent = taskNames + moreCount;
      alertPanel.style.display = 'flex';
    }
  },

  /**
   * Refresh the dashboard
   */
  refresh() {
    this.render();
    this.checkOverdueTasks();
  }
};

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Dashboard.init());
} else {
  Dashboard.init();
}

// Make Dashboard available globally
if (typeof window !== 'undefined') {
  window.Dashboard = Dashboard;
}

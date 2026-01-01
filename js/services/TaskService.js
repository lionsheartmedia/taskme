/**
 * TodoFusion - Task Service
 * Business logic layer for task operations
 */

const TaskService = {
  /**
   * Get all tasks
   * @returns {Array<Task>} Array of Task instances
   */
  getAllTasks() {
    const tasksData = DB.getTasks();
    return tasksData.map(data => Task.fromJSON(data));
  },

  /**
   * Get tasks filtered by criteria
   * @param {Object} filters - Filter criteria
   * @returns {Array<Task>}
   */
  getFilteredTasks(filters = {}) {
    let tasks = this.getAllTasks();

    // Filter by completion status
    if (filters.completed !== undefined) {
      tasks = tasks.filter(task => task.completed === filters.completed);
    }

    // Filter by priority
    if (filters.priority) {
      tasks = tasks.filter(task => task.priority === filters.priority);
    }

    // Filter by due date
    if (filters.dueFilter) {
      switch (filters.dueFilter) {
        case 'today':
          tasks = tasks.filter(task => task.isDueToday());
          break;
        case 'upcoming':
          tasks = tasks.filter(task => task.isDueThisWeek() && !task.isDueToday());
          break;
        case 'overdue':
          tasks = tasks.filter(task => task.isOverdue());
          break;
      }
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      tasks = tasks.filter(task => 
        filters.tags.some(tag => task.tags.includes(tag))
      );
    }

    // Search in title and description
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    return tasks;
  },

  /**
   * Get tasks for today
   * @returns {Array<Task>}
   */
  getTodayTasks() {
    return this.getFilteredTasks({ dueFilter: 'today', completed: false });
  },

  /**
   * Get upcoming tasks
   * @returns {Array<Task>}
   */
  getUpcomingTasks() {
    return this.getFilteredTasks({ dueFilter: 'upcoming', completed: false });
  },

  /**
   * Get overdue tasks
   * @returns {Array<Task>}
   */
  getOverdueTasks() {
    return this.getFilteredTasks({ dueFilter: 'overdue', completed: false });
  },

  /**
   * Get completed tasks
   * @returns {Array<Task>}
   */
  getCompletedTasks() {
    return this.getFilteredTasks({ completed: true });
  },

  /**
   * Get tasks by priority
   * @param {string} priority - Priority level
   * @returns {Array<Task>}
   */
  getTasksByPriority(priority) {
    return this.getFilteredTasks({ priority, completed: false });
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Task|null} Created task or null if validation fails
   */
  createTask(taskData) {
    const task = new Task(taskData);
    const validation = task.validate();

    if (!validation.isValid) {
      console.error('Task validation failed:', validation.errors);
      return null;
    }

    const savedTask = DB.addTask(task.toJSON());
    return Task.fromJSON(savedTask);
  },

  /**
   * Update a task
   * @param {string} taskId - Task ID
   * @param {Object} updates - Properties to update
   * @returns {Task|null} Updated task or null
   */
  updateTask(taskId, updates) {
    const updated = DB.updateTask(taskId, updates);
    return updated ? Task.fromJSON(updated) : null;
  },

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   * @returns {boolean} Success status
   */
  deleteTask(taskId) {
    return DB.deleteTask(taskId);
  },

  /**
   * Toggle task completion
   * @param {string} taskId - Task ID
   * @returns {Task|null} Updated task or null
   */
  toggleTaskComplete(taskId) {
    const updated = DB.toggleTaskComplete(taskId);
    return updated ? Task.fromJSON(updated) : null;
  },

  /**
   * Sort tasks
   * @param {Array<Task>} tasks - Tasks to sort
   * @param {string} sortBy - Property to sort by
   * @param {string} order - 'asc' or 'desc'
   * @returns {Array<Task>} Sorted tasks
   */
  sortTasks(tasks, sortBy = 'createdAt', order = 'desc') {
    const sorted = [...tasks].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Handle dates
      if (sortBy.includes('At') || sortBy === 'dueDate') {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      }

      // Handle strings
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  },

  /**
   * Get task statistics
   * @returns {Object} Statistics object
   */
  getStatistics() {
    const tasks = this.getAllTasks();
    const completed = tasks.filter(t => t.completed);
    const active = tasks.filter(t => !t.completed);
    const overdue = tasks.filter(t => t.isOverdue());

    return {
      total: tasks.length,
      completed: completed.length,
      active: active.length,
      overdue: overdue.length,
      completionRate: tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0,
      byPriority: {
        low: tasks.filter(t => t.priority === 'low').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        high: tasks.filter(t => t.priority === 'high').length,
        urgent: tasks.filter(t => t.priority === 'urgent').length
      }
    };
  },

  /**
   * Search tasks
   * @param {string} query - Search query
   * @returns {Array<Task>} Matching tasks
   */
  searchTasks(query) {
    return this.getFilteredTasks({ search: query });
  },

  /**
   * Get all unique tags
   * @returns {Array<string>} Unique tags
   */
  getAllTags() {
    const tasks = this.getAllTasks();
    const allTags = tasks.flatMap(task => task.tags);
    return [...new Set(allTags)].sort();
  },

  /**
   * Bulk update tasks
   * @param {Array<string>} taskIds - Array of task IDs
   * @param {Object} updates - Updates to apply
   * @returns {number} Number of tasks updated
   */
  bulkUpdate(taskIds, updates) {
    let count = 0;
    taskIds.forEach(id => {
      if (this.updateTask(id, updates)) {
        count++;
      }
    });
    return count;
  },

  /**
   * Bulk delete tasks
   * @param {Array<string>} taskIds - Array of task IDs
   * @returns {number} Number of tasks deleted
   */
  bulkDelete(taskIds) {
    let count = 0;
    taskIds.forEach(id => {
      if (this.deleteTask(id)) {
        count++;
      }
    });
    return count;
  }
};

// Make TaskService available globally
if (typeof window !== 'undefined') {
  window.TaskService = TaskService;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TaskService;
}

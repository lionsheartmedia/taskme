/**
 * TodoFusion - Database Manager
 * Handles localStorage operations for task data
 */

const DB = {
  // Storage keys
  STORAGE_KEYS: {
    TASKS: 'todofusion_tasks',
    SETTINGS: 'todofusion_settings',
    THEME: 'todofusion_theme'
  },

  /**
   * Get all tasks from localStorage
   * @returns {Array} Array of task objects
   */
  getTasks() {
    try {
      const tasks = localStorage.getItem(this.STORAGE_KEYS.TASKS);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error reading tasks from localStorage:', error);
      return [];
    }
  },

  /**
   * Save tasks to localStorage
   * @param {Array} tasks - Array of task objects
   * @returns {boolean} Success status
   */
  saveTasks(tasks) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
      return false;
    }
  },

  /**
   * Add a new task
   * @param {Object} taskData - Task data
   * @returns {Object} Saved task with ID
   */
  addTask(taskData) {
    const tasks = this.getTasks();
    const newTask = {
      ...taskData,
      id: taskData.id || this.generateId(),
      createdAt: taskData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  },

  /**
   * Update an existing task
   * @param {string} taskId - Task ID
   * @param {Object} updates - Properties to update
   * @returns {Object|null} Updated task or null if not found
   */
  updateTask(taskId, updates) {
    const tasks = this.getTasks();
    const index = tasks.findIndex(task => task.id === taskId);

    if (index === -1) {
      console.warn(`Task with ID ${taskId} not found`);
      return null;
    }

    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveTasks(tasks);
    return tasks[index];
  },

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   * @returns {boolean} Success status
   */
  deleteTask(taskId) {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);

    if (filteredTasks.length === tasks.length) {
      console.warn(`Task with ID ${taskId} not found`);
      return false;
    }

    this.saveTasks(filteredTasks);
    return true;
  },

  /**
   * Toggle task completion status
   * @param {string} taskId - Task ID
   * @returns {Object|null} Updated task or null if not found
   */
  toggleTaskComplete(taskId) {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      console.warn(`Task with ID ${taskId} not found`);
      return null;
    }

    return this.updateTask(taskId, {
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    });
  },

  /**
   * Get a single task by ID
   * @param {string} taskId - Task ID
   * @returns {Object|null} Task or null if not found
   */
  getTask(taskId) {
    const tasks = this.getTasks();
    return tasks.find(task => task.id === taskId) || null;
  },

  /**
   * Clear all tasks
   * @returns {boolean} Success status
   */
  clearAllTasks() {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.TASKS);
      return true;
    } catch (error) {
      console.error('Error clearing tasks:', error);
      return false;
    }
  },

  /**
   * Export all data as JSON string
   * @returns {string} JSON string of all data
   */
  exportData() {
    const data = {
      tasks: this.getTasks(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  /**
   * Import data from JSON string
   * @param {string} jsonString - JSON data to import
   * @returns {boolean} Success status
   */
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);

      if (data.tasks) {
        this.saveTasks(data.tasks);
      }

      if (data.settings) {
        this.saveSettings(data.settings);
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },

  /**
   * Get settings
   * @returns {Object} Settings object
   */
  getSettings() {
    try {
      const settings = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error('Error reading settings:', error);
      return {};
    }
  },

  /**
   * Save settings
   * @param {Object} settings - Settings object
   * @returns {boolean} Success status
   */
  saveSettings(settings) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  },

  /**
   * Generate a unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Get database statistics
   * @returns {Object} Database stats
   */
  getStats() {
    const tasks = this.getTasks();
    return {
      totalTasks: tasks.length,
      storageUsed: this.getStorageSize(),
      lastModified: this.getLastModified()
    };
  },

  /**
   * Get storage size in bytes
   * @returns {number} Storage size
   */
  getStorageSize() {
    let total = 0;
    for (let key in this.STORAGE_KEYS) {
      const item = localStorage.getItem(this.STORAGE_KEYS[key]);
      if (item) {
        total += item.length;
      }
    }
    return total;
  },

  /**
   * Get last modified timestamp
   * @returns {string|null} ISO timestamp or null
   */
  getLastModified() {
    const tasks = this.getTasks();
    if (tasks.length === 0) return null;

    const sorted = tasks.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt);
      const dateB = new Date(b.updatedAt || b.createdAt);
      return dateB - dateA;
    });

    return sorted[0].updatedAt || sorted[0].createdAt;
  }
};

// Make DB available globally
if (typeof window !== 'undefined') {
  window.DB = DB;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DB;
}

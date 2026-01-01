/**
 * TodoFusion - Task Model
 * Represents a single task with all its properties and methods
 */

class Task {
  /**
   * Create a new Task
   * @param {Object} data - Task data
   */
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.completed = data.completed || false;
    this.priority = data.priority || 'medium'; // low, medium, high, urgent
    this.dueDate = data.dueDate || null;
    this.tags = data.tags || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.completedAt = data.completedAt || null;
    this.estimatedTime = data.estimatedTime || null; // in minutes
    this.actualTime = data.actualTime || null; // in minutes
    this.notes = data.notes || '';
    this.links = data.links || [];
  }

  /**
   * Validate task data
   * @returns {Object} Validation result with isValid and errors
   */
  validate() {
    const errors = [];

    if (!this.title || this.title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (this.title && this.title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }

    if (this.priority && !['low', 'medium', 'high', 'urgent'].includes(this.priority)) {
      errors.push('Invalid priority value');
    }

    if (this.dueDate && isNaN(new Date(this.dueDate).getTime())) {
      errors.push('Invalid due date');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if task is overdue
   * @returns {boolean}
   */
  isOverdue() {
    if (!this.dueDate || this.completed) return false;
    return new Date(this.dueDate) < new Date();
  }

  /**
   * Check if task is due today
   * @returns {boolean}
   */
  isDueToday() {
    if (!this.dueDate) return false;
    const today = new Date();
    const due = new Date(this.dueDate);
    return (
      due.getDate() === today.getDate() &&
      due.getMonth() === today.getMonth() &&
      due.getFullYear() === today.getFullYear()
    );
  }

  /**
   * Check if task is due this week
   * @returns {boolean}
   */
  isDueThisWeek() {
    if (!this.dueDate) return false;
    const today = new Date();
    const due = new Date(this.dueDate);
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return due - today <= oneWeek && due >= today;
  }

  /**
   * Get formatted due date
   * @returns {string} Formatted date string
   */
  getFormattedDueDate() {
    if (!this.dueDate) return '';
    
    const date = new Date(this.dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (this.isDueToday()) return 'Today';
    
    if (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    ) {
      return 'Tomorrow';
    }

    // Format as "Jan 15, 2025"
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Get priority color
   * @returns {string} Color name
   */
  getPriorityColor() {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'error',
      urgent: 'error'
    };
    return colors[this.priority] || 'info';
  }

  /**
   * Get priority icon
   * @returns {string} Emoji icon
   */
  getPriorityIcon() {
    const icons = {
      low: '🟢',
      medium: '🟡',
      high: '🔴',
      urgent: '🔥'
    };
    return icons[this.priority] || '⚪';
  }

  /**
   * Toggle completion status
   */
  toggleComplete() {
    this.completed = !this.completed;
    this.completedAt = this.completed ? new Date().toISOString() : null;
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Add a tag
   * @param {string} tag - Tag to add
   */
  addTag(tag) {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !this.tags.includes(trimmedTag)) {
      this.tags.push(trimmedTag);
      this.updatedAt = new Date().toISOString();
    }
  }

  /**
   * Remove a tag
   * @param {string} tag - Tag to remove
   */
  removeTag(tag) {
    this.tags = this.tags.filter(t => t !== tag);
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Convert to plain object for storage
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      priority: this.priority,
      dueDate: this.dueDate,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      completedAt: this.completedAt,
      estimatedTime: this.estimatedTime,
      actualTime: this.actualTime,
      notes: this.notes,
      links: this.links
    };
  }

  /**
   * Create Task from plain object
   * @param {Object} data - Plain object
   * @returns {Task}
   */
  static fromJSON(data) {
    return new Task(data);
  }

  /**
   * Clone this task
   * @returns {Task} New task instance
   */
  clone() {
    return new Task(this.toJSON());
  }
}

// Make Task available globally
if (typeof window !== 'undefined') {
  window.Task = Task;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Task;
}

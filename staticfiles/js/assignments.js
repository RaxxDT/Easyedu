// Assignments JavaScript

let currentUser = null;
let allAssignments = [];
let filteredAssignments = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeAssignmentsPage();
});

function initializeAssignmentsPage() {
    // Check if user is logged in
    currentUser = EasyEdu.getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize page based on user role
    updatePageForRole();
    loadAssignments();
    setupEventListeners();
}

function updatePageForRole() {
    const createBtn = document.getElementById('createAssignmentBtn');
    const pageSubtitle = document.getElementById('pageSubtitle');
    
    if (currentUser.role === 'instructor') {
        if (createBtn) createBtn.style.display = 'inline-block';
        if (pageSubtitle) pageSubtitle.textContent = 'Create and manage assignments';
    } else {
        if (pageSubtitle) pageSubtitle.textContent = 'View and submit your assignments';
    }
    
    // Populate course filters
    populateCourseFilters();
}

function populateCourseFilters() {
    const courseFilter = document.getElementById('courseFilter');
    const assignmentCourse = document.getElementById('assignmentCourse');
    
    // Mock courses data
    const courses = [
        { id: '1', name: 'Web Development' },
        { id: '2', name: 'Data Structures' },
        { id: '3', name: 'Machine Learning' },
        { id: '4', name: 'Database Systems' }
    ];
    
    const courseOptions = courses.map(course => 
        `<option value="${course.id}">${course.name}</option>`
    ).join('');
    
    if (courseFilter) {
        courseFilter.innerHTML = '<option value="">All Courses</option>' + courseOptions;
    }
    
    if (assignmentCourse) {
        assignmentCourse.innerHTML = '<option value="">Select Course</option>' + courseOptions;
    }
}

function loadAssignments() {
    // Mock assignments data
    const now = new Date();
    
    allAssignments = [
        {
            id: '1',
            title: 'React Components Project',
            course: 'Web Development',
            courseId: '1',
            description: 'Create a complete React application with multiple components',
            dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day
            totalPoints: 100,
            status: currentUser.role === 'instructor' ? 'published' : 'pending',
            submissions: currentUser.role === 'instructor' ? 15 : null,
            grade: null,
            feedback: null
        },
        {
            id: '2',
            title: 'Algorithm Analysis Report',
            course: 'Data Structures',
            courseId: '2',
            description: 'Analyze time and space complexity of various sorting algorithms',
            dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
            totalPoints: 75,
            status: currentUser.role === 'instructor' ? 'published' : 'submitted',
            submissions: currentUser.role === 'instructor' ? 8 : null,
            grade: currentUser.role === 'student' ? 85 : null,
            feedback: currentUser.role === 'student' ? 'Good analysis of complexity' : null
        },
        {
            id: '3',
            title: 'Machine Learning Model',
            course: 'Machine Learning',
            courseId: '3',
            description: 'Build and train a classification model using provided dataset',
            dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
            totalPoints: 150,
            status: currentUser.role === 'instructor' ? 'draft' : 'pending',
            submissions: currentUser.role === 'instructor' ? 0 : null,
            grade: null,
            feedback: null
        },
        {
            id: '4',
            title: 'Database Design Project',
            course: 'Database Systems',
            courseId: '4',
            description: 'Design and implement a normalized database schema',
            dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
            totalPoints: 120,
            status: currentUser.role === 'instructor' ? 'published' : 'overdue',
            submissions: currentUser.role === 'instructor' ? 12 : null,
            grade: null,
            feedback: null
        }
    ];
    
    filteredAssignments = [...allAssignments];
    renderAssignments();
}

function renderAssignments() {
    const container = document.getElementById('assignmentsList');
    if (!container) return;
    
    if (filteredAssignments.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-tasks fa-3x text-muted mb-3"></i>
                <h4>No assignments found</h4>
                <p class="text-muted">Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredAssignments.map(assignment => `
        <div class="assignment-item border rounded p-3 mb-3">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="mb-1">${assignment.title}</h5>
                        ${renderAssignmentStatus(assignment)}
                    </div>
                    <p class="text-muted mb-2">${assignment.description}</p>
                    <div class="row">
                        <div class="col-sm-6">
                            <small class="text-muted">
                                <i class="fas fa-book me-1"></i>${assignment.course}
                            </small>
                        </div>
                        <div class="col-sm-6">
                            <small class="text-muted">
                                <i class="fas fa-calendar me-1"></i>Due: ${EasyEdu.formatDateTime(assignment.dueDate)}
                            </small>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-sm-6">
                            <small class="text-muted">
                                <i class="fas fa-star me-1"></i>Points: ${assignment.totalPoints}
                            </small>
                        </div>
                        ${renderAssignmentDetails(assignment)}
                    </div>
                </div>
                <div class="col-md-4 text-end">
                    ${renderAssignmentActions(assignment)}
                </div>
            </div>
        </div>
    `).join('');
}

function renderAssignmentStatus(assignment) {
    const statusClasses = {
        pending: 'warning',
        submitted: 'info',
        graded: 'success',
        overdue: 'danger',
        published: 'success',
        draft: 'secondary'
    };
    
    const statusText = {
        pending: 'Pending',
        submitted: 'Submitted',
        graded: 'Graded',
        overdue: 'Overdue',
        published: 'Published',
        draft: 'Draft'
    };
    
    return `<span class="badge bg-${statusClasses[assignment.status]}">${statusText[assignment.status]}</span>`;
}

function renderAssignmentDetails(assignment) {
    if (currentUser.role === 'instructor') {
        return `
            <div class="col-sm-6">
                <small class="text-muted">
                    <i class="fas fa-users me-1"></i>Submissions: ${assignment.submissions || 0}
                </small>
            </div>
        `;
    } else {
        if (assignment.grade !== null) {
            return `
                <div class="col-sm-6">
                    <small class="text-success">
                        <i class="fas fa-check me-1"></i>Grade: ${assignment.grade}/${assignment.totalPoints}
                    </small>
                </div>
            `;
        }
        return '<div class="col-sm-6"></div>';
    }
}

function renderAssignmentActions(assignment) {
    if (currentUser.role === 'instructor') {
        return `
            <div class="btn-group-vertical" role="group">
                <button class="btn btn-outline-primary btn-sm mb-1" onclick="editAssignment('${assignment.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-outline-secondary btn-sm mb-1" onclick="viewSubmissions('${assignment.id}')">
                    <i class="fas fa-eye"></i> View Submissions
                </button>
                ${assignment.submissions > 0 ? `
                    <button class="btn btn-outline-warning btn-sm" onclick="gradeAssignments('${assignment.id}')">
                        <i class="fas fa-star"></i> Grade
                    </button>
                ` : ''}
            </div>
        `;
    } else {
        if (assignment.status === 'pending' || assignment.status === 'overdue') {
            return `
                <button class="btn btn-primary" onclick="submitAssignment('${assignment.id}')">
                    <i class="fas fa-upload"></i> Submit
                </button>
            `;
        } else if (assignment.status === 'submitted') {
            return `
                <button class="btn btn-outline-secondary" onclick="viewSubmission('${assignment.id}')" disabled>
                    <i class="fas fa-check"></i> Submitted
                </button>
            `;
        } else if (assignment.status === 'graded') {
            return `
                <div>
                    <button class="btn btn-outline-success btn-sm mb-1" onclick="viewGrade('${assignment.id}')">
                        <i class="fas fa-star"></i> View Grade
                    </button>
                    <br>
                    <small class="text-success">${assignment.grade}/${assignment.totalPoints}</small>
                </div>
            `;
        }
    }
    return '';
}

function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('assignmentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', EasyEdu.debounce(filterAssignments, 300));
    }
    
    // Filters
    const courseFilter = document.getElementById('courseFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (courseFilter) {
        courseFilter.addEventListener('change', filterAssignments);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterAssignments);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', sortAssignments);
    }
    
    // Create assignment
    const createAssignmentBtn = document.getElementById('createAssignmentBtn');
    if (createAssignmentBtn) {
        createAssignmentBtn.addEventListener('click', showCreateAssignmentModal);
    }
    
    // Save assignment
    const saveAssignmentBtn = document.getElementById('saveAssignmentBtn');
    if (saveAssignmentBtn) {
        saveAssignmentBtn.addEventListener('click', handleCreateAssignment);
    }
    
    // Submit assignment
    const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
    if (confirmSubmitBtn) {
        confirmSubmitBtn.addEventListener('click', handleSubmitAssignment);
    }
    
    // Grade assignment
    const saveGradeBtn = document.getElementById('saveGradeBtn');
    if (saveGradeBtn) {
        saveGradeBtn.addEventListener('click', handleGradeAssignment);
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

function filterAssignments() {
    const searchTerm = document.getElementById('assignmentSearch').value.toLowerCase();
    const courseFilter = document.getElementById('courseFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredAssignments = allAssignments.filter(assignment => {
        const matchesSearch = assignment.title.toLowerCase().includes(searchTerm) ||
                            assignment.description.toLowerCase().includes(searchTerm) ||
                            assignment.course.toLowerCase().includes(searchTerm);
        
        const matchesCourse = !courseFilter || assignment.courseId === courseFilter;
        const matchesStatus = !statusFilter || assignment.status === statusFilter;
        
        return matchesSearch && matchesCourse && matchesStatus;
    });
    
    renderAssignments();
}

function sortAssignments() {
    const sortBy = document.getElementById('sortFilter').value;
    
    filteredAssignments.sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'course':
                return a.course.localeCompare(b.course);
            case 'dueDate':
            default:
                return new Date(a.dueDate) - new Date(b.dueDate);
        }
    });
    
    renderAssignments();
}

function showCreateAssignmentModal() {
    const modal = new bootstrap.Modal(document.getElementById('createAssignmentModal'));
    modal.show();
}

function handleCreateAssignment() {
    const form = document.getElementById('createAssignmentForm');
    const formData = new FormData(form);
    
    // Validate form
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    // Get course name
    const courseSelect = document.getElementById('assignmentCourse');
    const courseName = courseSelect.options[courseSelect.selectedIndex].text;
    
    // Create new assignment
    const newAssignment = {
        id: EasyEdu.generateId(),
        title: formData.get('assignmentTitle'),
        course: courseName,
        courseId: formData.get('assignmentCourse'),
        description: formData.get('assignmentDescription'),
        dueDate: new Date(formData.get('assignmentDueDate')),
        totalPoints: parseInt(formData.get('assignmentPoints')),
        status: 'published',
        submissions: 0,
        grade: null,
        feedback: null
    };
    
    // Add to assignments
    allAssignments.unshift(newAssignment);
    filteredAssignments = [...allAssignments];
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('createAssignmentModal'));
    modal.hide();
    form.reset();
    form.classList.remove('was-validated');
    
    // Show success message
    EasyEdu.showToast('Assignment created successfully!', 'success');
    
    // Re-render
    renderAssignments();
}

function submitAssignment(assignmentId) {
    const assignment = allAssignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    // Store assignment ID for submission
    document.getElementById('submitAssignmentId').value = assignmentId;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('submitAssignmentModal'));
    modal.show();
}

function handleSubmitAssignment() {
    const assignmentId = document.getElementById('submitAssignmentId').value;
    const assignment = allAssignments.find(a => a.id === assignmentId);
    
    if (assignment) {
        // Update assignment status
        assignment.status = 'submitted';
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('submitAssignmentModal'));
        modal.hide();
        
        // Reset form
        document.getElementById('submitAssignmentForm').reset();
        
        // Show success message
        EasyEdu.showToast('Assignment submitted successfully!', 'success');
        
        // Re-render
        renderAssignments();
    }
}

function gradeAssignments(assignmentId) {
    const assignment = allAssignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    
    // Set max points in modal
    document.getElementById('maxPoints').textContent = assignment.totalPoints;
    document.getElementById('gradeAssignmentId').value = assignmentId;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('gradeAssignmentModal'));
    modal.show();
}

function handleGradeAssignment() {
    const assignmentId = document.getElementById('gradeAssignmentId').value;
    const grade = document.getElementById('assignmentGrade').value;
    const feedback = document.getElementById('gradeFeedback').value;
    
    // In a real app, this would save the grade to the database
    EasyEdu.showToast('Grade saved successfully!', 'success');
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('gradeAssignmentModal'));
    modal.hide();
    
    // Reset form
    document.getElementById('gradeAssignmentForm').reset();
}

function editAssignment(assignmentId) {
    EasyEdu.showToast('Opening assignment editor...', 'info');
}

function viewSubmissions(assignmentId) {
    EasyEdu.showToast('Opening submissions view...', 'info');
}

function viewSubmission(assignmentId) {
    EasyEdu.showToast('Opening your submission...', 'info');
}

function viewGrade(assignmentId) {
    const assignment = allAssignments.find(a => a.id === assignmentId);
    if (assignment && assignment.feedback) {
        EasyEdu.showToast(`Feedback: ${assignment.feedback}`, 'info');
    }
}
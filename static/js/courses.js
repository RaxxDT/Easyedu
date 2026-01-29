// Courses JavaScript

let currentView = 'list';
let currentUser = null;
let allCourses = [];
let filteredCourses = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeCoursesPage();
});

function initializeCoursesPage() {
    // Check if user is logged in
    currentUser = EasyEdu.getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize page based on user role
    updatePageForRole();
    loadCourses();
    setupEventListeners();
}

function updatePageForRole() {
    const createBtn = document.getElementById('createCourseBtn');
    const pageSubtitle = document.getElementById('pageSubtitle');
    const enrollmentFilter = document.getElementById('enrollmentFilter');
    
    if (currentUser.role === 'instructor') {
        if (createBtn) createBtn.style.display = 'inline-block';
        if (pageSubtitle) pageSubtitle.textContent = 'Create and manage your courses';
        if (enrollmentFilter) {
            enrollmentFilter.innerHTML = `
                <select class="form-select" id="statusFilter">
                    <option value="">All Courses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                </select>
            `;
        }
    } else {
        if (pageSubtitle) pageSubtitle.textContent = 'Explore and enroll in courses';
    }
}

function loadCourses() {
    // Mock course data
    allCourses = [
        {
            id: '1',
            title: 'Introduction to Web Development',
            description: 'Learn the fundamentals of HTML, CSS, and JavaScript',
            instructor: 'Dr. Sarah Johnson',
            category: 'programming',
            duration: 8,
            price: 99.99,
            enrolled: 156,
            rating: 4.8,
            image: 'fa-code',
            status: currentUser.role === 'instructor' ? 'published' : 'enrolled',
            progress: currentUser.role === 'student' ? 75 : null
        },
        {
            id: '2',
            title: 'Advanced Mathematics',
            description: 'Calculus, Linear Algebra, and Differential Equations',
            instructor: 'Prof. Michael Chen',
            category: 'mathematics',
            duration: 12,
            price: 149.99,
            enrolled: 89,
            rating: 4.6,
            image: 'fa-calculator',
            status: currentUser.role === 'instructor' ? 'published' : 'available',
            progress: null
        },
        {
            id: '3',
            title: 'Data Science Fundamentals',
            description: 'Statistics, Python, and Machine Learning basics',
            instructor: 'Dr. Emily Rodriguez',
            category: 'science',
            duration: 10,
            price: 199.99,
            enrolled: 234,
            rating: 4.9,
            image: 'fa-chart-bar',
            status: currentUser.role === 'instructor' ? 'draft' : 'available',
            progress: null
        },
        {
            id: '4',
            title: 'Digital Art & Design',
            description: 'Creative design principles and digital tools',
            instructor: 'Ms. Lisa Park',
            category: 'arts',
            duration: 6,
            price: 79.99,
            enrolled: 67,
            rating: 4.7,
            image: 'fa-palette',
            status: currentUser.role === 'instructor' ? 'published' : 'completed',
            progress: currentUser.role === 'student' ? 100 : null
        },
        {
            id: '5',
            title: 'Spanish for Beginners',
            description: 'Learn Spanish from scratch with interactive lessons',
            instructor: 'Carlos Mendoza',
            category: 'languages',
            duration: 16,
            price: 89.99,
            enrolled: 123,
            rating: 4.5,
            image: 'fa-globe',
            status: currentUser.role === 'instructor' ? 'archived' : 'enrolled',
            progress: currentUser.role === 'student' ? 45 : null
        }
    ];
    
    filteredCourses = [...allCourses];
    renderCourses();
}

function renderCourses() {
    const container = document.getElementById('coursesContent');
    if (!container) return;
    
    if (filteredCourses.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No courses found</h4>
                <p class="text-muted">Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    if (currentView === 'grid') {
        renderGridView(container);
    } else {
        renderListView(container);
    }
}

function renderGridView(container) {
    container.innerHTML = `
        <div class="row">
            ${filteredCourses.map(course => `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card course-card h-100">
                        <div class="course-image">
                            <i class="fas ${course.image}"></i>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="badge bg-primary">${course.category}</span>
                                <div class="text-warning">
                                    <i class="fas fa-star"></i> ${course.rating}
                                </div>
                            </div>
                            <h5 class="card-title">${course.title}</h5>
                            <p class="card-text text-muted small">${course.description}</p>
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <small class="text-muted">By ${course.instructor}</small>
                                    <small class="text-muted">${course.duration} weeks</small>
                                </div>
                                ${renderCourseProgress(course)}
                                ${renderCourseActions(course)}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderListView(container) {
    container.innerHTML = `
        <div class="list-group">
            ${filteredCourses.map(course => `
                <div class="list-group-item list-group-item-action">
                    <div class="row align-items-center">
                        <div class="col-md-1 text-center">
                            <div class="bg-primary bg-opacity-10 p-3 rounded">
                                <i class="fas ${course.image} text-primary fa-2x"></i>
                            </div>
                        </div>
                        <div class="col-md-7">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="mb-1">${course.title}</h5>
                                <div class="text-warning">
                                    <i class="fas fa-star"></i> ${course.rating}
                                </div>
                            </div>
                            <p class="mb-1 text-muted">${course.description}</p>
                            <small class="text-muted">
                                By ${course.instructor} • ${course.duration} weeks • ${course.enrolled} students
                            </small>
                            ${renderCourseProgress(course)}
                        </div>
                        <div class="col-md-4 text-end">
                            <div class="mb-2">
                                <span class="badge bg-primary">${course.category}</span>
                                ${renderStatusBadge(course)}
                            </div>
                            ${renderCourseActions(course)}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderCourseProgress(course) {
    if (course.progress !== null) {
        return `
            <div class="course-progress mb-2">
                <div class="course-progress-bar" style="width: ${course.progress}%"></div>
            </div>
            <small class="text-muted">${course.progress}% complete</small>
        `;
    }
    return '';
}

function renderStatusBadge(course) {
    const statusColors = {
        enrolled: 'success',
        available: 'secondary',
        completed: 'info',
        published: 'success',
        draft: 'warning',
        archived: 'secondary'
    };
    
    return `<span class="badge bg-${statusColors[course.status]} ms-1">${course.status}</span>`;
}

function renderCourseActions(course) {
    if (currentUser.role === 'instructor') {
        return `
            <div class="btn-group w-100" role="group">
                <button class="btn btn-outline-primary btn-sm" onclick="editCourse('${course.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-outline-secondary btn-sm" onclick="viewCourse('${course.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        `;
    } else {
        if (course.status === 'enrolled' || course.status === 'completed') {
            return `
                <button class="btn btn-primary w-100" onclick="continueCourse('${course.id}')">
                    <i class="fas fa-play"></i> Continue
                </button>
            `;
        } else {
            return `
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold text-success">$${course.price}</span>
                    <button class="btn btn-outline-primary" onclick="enrollInCourse('${course.id}')">
                        <i class="fas fa-plus"></i> Enroll
                    </button>
                </div>
            `;
        }
    }
}

function setupEventListeners() {
    // View toggles
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', () => switchView('grid'));
        listViewBtn.addEventListener('click', () => switchView('list'));
    }
    
    // Search
    const searchInput = document.getElementById('courseSearch');
    if (searchInput) {
        searchInput.addEventListener('input', EasyEdu.debounce(filterCourses, 300));
    }
    
    // Filters
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterCourses);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterCourses);
    }
    
    // Create course
    const createCourseBtn = document.getElementById('createCourseBtn');
    if (createCourseBtn) {
        createCourseBtn.addEventListener('click', showCreateCourseModal);
    }
    
    // Save course
    const saveCourseBtn = document.getElementById('saveCourseBtn');
    if (saveCourseBtn) {
        saveCourseBtn.addEventListener('click', handleCreateCourse);
    }
    
    // Confirm enrollment
    const confirmEnrollBtn = document.getElementById('confirmEnrollBtn');
    if (confirmEnrollBtn) {
        confirmEnrollBtn.addEventListener('click', handleEnrollment);
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

function switchView(view) {
    currentView = view;
    
    const gridBtn = document.getElementById('gridViewBtn');
    const listBtn = document.getElementById('listViewBtn');
    
    if (view === 'grid') {
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    } else {
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    }
    
    renderCourses();
}

function filterCourses() {
    const searchTerm = document.getElementById('courseSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    filteredCourses = allCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm) ||
                            course.description.toLowerCase().includes(searchTerm) ||
                            course.instructor.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || course.category === categoryFilter;
        const matchesStatus = !statusFilter || course.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    renderCourses();
}

function showCreateCourseModal() {
    const modal = new bootstrap.Modal(document.getElementById('createCourseModal'));
    modal.show();
}

function handleCreateCourse() {
    const form = document.getElementById('createCourseForm');
    const formData = new FormData(form);
    
    // Validate form
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    // Create new course object
    const newCourse = {
        id: EasyEdu.generateId(),
        title: formData.get('courseTitle'),
        description: formData.get('courseDescription'),
        category: formData.get('courseCategory'),
        duration: parseInt(formData.get('courseDuration')),
        price: parseFloat(formData.get('coursePrice')) || 0,
        instructor: currentUser.name,
        enrolled: 0,
        rating: 0,
        image: 'fa-book',
        status: 'draft',
        progress: null
    };
    
    // Add to courses array
    allCourses.unshift(newCourse);
    filteredCourses = [...allCourses];
    
    // Close modal and refresh view
    const modal = bootstrap.Modal.getInstance(document.getElementById('createCourseModal'));
    modal.hide();
    
    // Reset form
    form.reset();
    form.classList.remove('was-validated');
    
    // Show success message
    EasyEdu.showToast('Course created successfully!', 'success');
    
    // Re-render courses
    renderCourses();
}

function enrollInCourse(courseId) {
    const course = allCourses.find(c => c.id === courseId);
    if (!course) return;
    
    // Set course name in modal
    document.getElementById('enrollCourseName').textContent = course.title;
    
    // Store course ID for confirmation
    document.getElementById('confirmEnrollBtn').setAttribute('data-course-id', courseId);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('enrollModal'));
    modal.show();
}

function handleEnrollment() {
    const courseId = document.getElementById('confirmEnrollBtn').getAttribute('data-course-id');
    const course = allCourses.find(c => c.id === courseId);
    
    if (course) {
        // Update course status
        course.status = 'enrolled';
        course.progress = 0;
        course.enrolled += 1;
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('enrollModal'));
        modal.hide();
        
        // Show success message
        EasyEdu.showToast(`Successfully enrolled in ${course.title}!`, 'success');
        
        // Re-render courses
        renderCourses();
    }
}

function continueCourse(courseId) {
    EasyEdu.showToast('Opening course...', 'info');
    // In a real app, this would navigate to the course content
}

function editCourse(courseId) {
    EasyEdu.showToast('Opening course editor...', 'info');
    // In a real app, this would open the course editor
}

function viewCourse(courseId) {
    EasyEdu.showToast('Opening course details...', 'info');
    // In a real app, this would show course details
}
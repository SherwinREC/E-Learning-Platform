// Simple E-Learn Frontend
// Using localStorage for persistence (not secure, for demo only)

let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let courses = JSON.parse(localStorage.getItem('courses')) || [];
let enrollments = JSON.parse(localStorage.getItem('enrollments')) || [];
let progress = JSON.parse(localStorage.getItem('progress')) || [];

// Navigation
document.getElementById('homeBtn').addEventListener('click', showHome);
document.getElementById('loginBtn').addEventListener('click', showLogin);
document.getElementById('registerBtn').addEventListener('click', showRegister);
document.getElementById('dashboardBtn').addEventListener('click', showDashboard);
document.getElementById('logoutBtn').addEventListener('click', logout);

function showSection(sectionId) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

function showHome() { showSection('home'); }
function showLogin() { showSection('login'); }
function showRegister() { showSection('register'); }
function showDashboard() { 
    if (!currentUser) return;
    showSection('dashboard'); 
    renderDashboard();
}
function logout() {
    currentUser = null;
    document.getElementById('dashboardBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'inline';
    document.getElementById('registerBtn').style.display = 'inline';
    showHome();
}

// Registration
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    
    if (users.find(u => u.email === email)) {
        document.getElementById('registerError').textContent = 'Email already exists';
        return;
    }
    
    const hashedPassword = btoa(password); // Simple encoding, not secure
    users.push({ email, password: hashedPassword, role });
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('registerError').textContent = 'Registration successful!';
    setTimeout(() => showLogin(), 2000);
});

// Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const hashedPassword = btoa(password);
    
    const user = users.find(u => u.email === email && u.password === hashedPassword);
    if (user) {
        currentUser = user;
        document.getElementById('loginError').textContent = '';
        document.getElementById('dashboardBtn').style.display = 'inline';
        document.getElementById('logoutBtn').style.display = 'inline';
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('registerBtn').style.display = 'none';
        showDashboard();
    } else {
        document.getElementById('loginError').textContent = 'Invalid credentials';
    }
});

// Dashboard
function renderDashboard() {
    const content = document.getElementById('dashboardContent');
    
    if (currentUser.role === 'learner') {
        renderLearnerDashboard(content);
    } else if (currentUser.role === 'instructor') {
        renderInstructorDashboard(content);
    } else if (currentUser.role === 'admin') {
        renderAdminDashboard(content);
    }
}

function renderLearnerDashboard(content) {
    const enrolledCourses = enrollments.filter(e => e.user === currentUser.email);
    const totalCourses = enrolledCourses.length;
    const completedCourses = enrolledCourses.filter(e => {
        const prog = progress.find(p => p.user === currentUser.email && p.courseId === e.courseId);
        return prog && prog.completed === prog.total;
    }).length;
    const totalLessons = enrolledCourses.length * 10; // Assuming 10 lessons per course
    const completedLessons = enrolledCourses.reduce((sum, e) => {
        const prog = progress.find(p => p.user === currentUser.email && p.courseId === e.courseId);
        return sum + (prog ? prog.completed : 0);
    }, 0);
    const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    content.innerHTML = `
        <div class="dashboard-header">
            <div class="welcome-section">
                <h2>Welcome back, ${currentUser.email.split('@')[0]}! 👋</h2>
                <p>Continue your learning journey</p>
            </div>
            <div class="quick-stats">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-book-open"></i></div>
                    <div class="stat-info">
                        <span class="stat-number">${totalCourses}</span>
                        <span class="stat-label">Enrolled Courses</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                    <div class="stat-info">
                        <span class="stat-number">${completedCourses}</span>
                        <span class="stat-label">Completed Courses</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-info">
                        <span class="stat-number">${completionRate}%</span>
                        <span class="stat-label">Overall Progress</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="dashboard-actions">
            <button class="action-btn primary" onclick="showCourses()">
                <i class="fas fa-search"></i>
                <span>Browse Courses</span>
            </button>
            <button class="action-btn secondary" onclick="showProgress()">
                <i class="fas fa-chart-bar"></i>
                <span>View Progress</span>
            </button>
            <button class="action-btn secondary" onclick="showMyCourses()">
                <i class="fas fa-graduation-cap"></i>
                <span>My Courses</span>
            </button>
        </div>

        <div class="dashboard-section">
            <div class="section-header">
                <h3><i class="fas fa-play-circle"></i> Continue Learning</h3>
                <span class="section-subtitle">Pick up where you left off</span>
            </div>
            <div class="continue-learning" id="continueLearning">
                <!-- Continue learning courses will be populated here -->
            </div>
        </div>

        <div class="dashboard-section">
            <div class="section-header">
                <h3><i class="fas fa-star"></i> Recommended for You</h3>
                <span class="section-subtitle">Courses you might like</span>
            </div>
            <div class="recommended-courses" id="recommendedCourses">
                <!-- Recommended courses will be populated here -->
            </div>
        </div>

        <div class="dashboard-section">
            <div class="section-header">
                <h3><i class="fas fa-trophy"></i> Achievements</h3>
                <span class="section-subtitle">Your learning milestones</span>
            </div>
            <div class="achievements">
                <div class="achievement-card ${totalCourses >= 1 ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon"><i class="fas fa-rocket"></i></div>
                    <div class="achievement-info">
                        <h4>First Steps</h4>
                        <p>Enroll in your first course</p>
                    </div>
                </div>
                <div class="achievement-card ${completedCourses >= 1 ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon"><i class="fas fa-graduation-cap"></i></div>
                    <div class="achievement-info">
                        <h4>Course Complete</h4>
                        <p>Finish your first course</p>
                    </div>
                </div>
                <div class="achievement-card ${completionRate >= 50 ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon"><i class="fas fa-fire"></i></div>
                    <div class="achievement-info">
                        <h4>Halfway There</h4>
                        <p>Reach 50% overall progress</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    populateContinueLearning();
    populateRecommendedCourses();
}

function renderInstructorDashboard(content) {
    const myCourses = courses.filter(c => c.instructor === currentUser.email);
    const publishedCourses = myCourses.filter(c => c.published);
    const totalStudents = enrollments.filter(e => myCourses.some(c => c.id === e.courseId)).length;
    const avgRating = 4.5; // Mock rating

    content.innerHTML = `
        <div class="dashboard-header">
            <div class="welcome-section">
                <h2>Welcome back, Professor ${currentUser.email.split('@')[0]}! 👨‍🏫</h2>
                <p>Manage your courses and engage with students</p>
            </div>
            <div class="quick-stats">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-book"></i></div>
                    <div class="stat-info">
                        <span class="stat-number">${myCourses.length}</span>
                        <span class="stat-label">My Courses</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-info">
                        <span class="stat-number">${totalStudents}</span>
                        <span class="stat-label">Total Students</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-star"></i></div>
                    <div class="stat-info">
                        <span class="stat-number">${avgRating}</span>
                        <span class="stat-label">Avg Rating</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="dashboard-actions">
            <button class="action-btn primary" onclick="showCreateCourse()">
                <i class="fas fa-plus-circle"></i>
                <span>Create Course</span>
            </button>
            <button class="action-btn secondary" onclick="showMyCourses()">
                <i class="fas fa-cog"></i>
                <span>Manage Courses</span>
            </button>
            <button class="action-btn secondary" onclick="showAnalytics()">
                <i class="fas fa-chart-line"></i>
                <span>Analytics</span>
            </button>
        </div>

        <div class="dashboard-section">
            <div class="section-header">
                <h3><i class="fas fa-book"></i> My Courses</h3>
                <span class="section-subtitle">Published: ${publishedCourses.length} | Drafts: ${myCourses.length - publishedCourses.length}</span>
            </div>
            <div class="instructor-courses" id="instructorCourses">
                <!-- Instructor courses will be populated here -->
            </div>
        </div>

        <div class="dashboard-section">
            <div class="section-header">
                <h3><i class="fas fa-comments"></i> Recent Activity</h3>
                <span class="section-subtitle">Latest updates and interactions</span>
            </div>
            <div class="recent-activity">
                <div class="activity-item">
                    <div class="activity-icon"><i class="fas fa-user-plus"></i></div>
                    <div class="activity-content">
                        <p><strong>5 new enrollments</strong> in your courses this week</p>
                        <span class="activity-time">2 hours ago</span>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon"><i class="fas fa-star"></i></div>
                    <div class="activity-content">
                        <p><strong>Course rated 5 stars</strong> by John Doe</p>
                        <span class="activity-time">1 day ago</span>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon"><i class="fas fa-question-circle"></i></div>
                    <div class="activity-content">
                        <p><strong>Quiz completed</strong> by 3 students</p>
                        <span class="activity-time">3 days ago</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    populateInstructorCourses();
}

function renderAdminDashboard(content) {
    const totalUsers = users.length;
    const totalCourses = courses.filter(c => c.published).length;
    const totalEnrollments = enrollments.length;

    content.innerHTML = `
        <div class="dashboard-header">
            <div class="welcome-section">
                <h2>Welcome back, Admin! 👑</h2>
                <p>Manage the platform and oversee operations</p>
            </div>
            <div class="quick-stats">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-info">
                        <span class="stat-number">${totalUsers}</span>
                        <span class="stat-label">Total Users</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-book"></i></div>
                    <div class="stat-info">
                        <span class="stat-number">${totalCourses}</span>
                        <span class="stat-label">Published Courses</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-graduation-cap"></i></div>
                    <div class="stat-info">
                        <span class="stat-number">${totalEnrollments}</span>
                        <span class="stat-label">Enrollments</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="dashboard-actions">
            <button class="action-btn primary" onclick="showUsers()">
                <i class="fas fa-users-cog"></i>
                <span>Manage Users</span>
            </button>
            <button class="action-btn secondary" onclick="showAllCourses()">
                <i class="fas fa-book"></i>
                <span>All Courses</span>
            </button>
            <button class="action-btn secondary" onclick="showReports()">
                <i class="fas fa-chart-bar"></i>
                <span>Reports</span>
            </button>
        </div>

        <div class="dashboard-section">
            <div class="section-header">
                <h3><i class="fas fa-chart-pie"></i> Platform Overview</h3>
                <span class="section-subtitle">Key metrics and insights</span>
            </div>
            <div class="platform-overview">
                <div class="overview-card">
                    <h4>User Distribution</h4>
                    <div class="chart-placeholder">
                        <div class="chart-bar" style="width: 60%; background: #667eea;">Learners (60%)</div>
                        <div class="chart-bar" style="width: 35%; background: #764ba2;">Instructors (35%)</div>
                        <div class="chart-bar" style="width: 5%; background: #f093fb;">Admins (5%)</div>
                    </div>
                </div>
                <div class="overview-card">
                    <h4>Recent Registrations</h4>
                    <ul class="recent-list">
                        <li><i class="fas fa-user"></i> john.doe@email.com <span class="role-badge learner">Learner</span></li>
                        <li><i class="fas fa-user"></i> jane.smith@email.com <span class="role-badge instructor">Instructor</span></li>
                        <li><i class="fas fa-user"></i> mike.johnson@email.com <span class="role-badge learner">Learner</span></li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function populateContinueLearning() {
    const container = document.getElementById('continueLearning');
    const enrolledCourses = enrollments.filter(e => e.user === currentUser.email);
    
    if (enrolledCourses.length === 0) {
        container.innerHTML = '<p class="empty-state">No enrolled courses yet. <button onclick="showCourses()" class="link-btn">Browse courses</button> to get started!</p>';
        return;
    }

    container.innerHTML = '';
    enrolledCourses.slice(0, 3).forEach(enrollment => {
        const course = courses.find(c => c.id === enrollment.courseId);
        const prog = progress.find(p => p.user === currentUser.email && p.courseId === enrollment.courseId) || { completed: 0, total: 10 };
        const percentage = (prog.completed / prog.total) * 100;

        container.innerHTML += `
            <div class="continue-course-card">
                <div class="course-thumbnail">
                    <i class="fas fa-book-open"></i>
                </div>
                <div class="course-info">
                    <h4>${course.title}</h4>
                    <p>${course.desc.substring(0, 100)}...</p>
                    <div class="progress-mini">
                        <div class="progress-bar-mini">
                            <div class="progress-fill-mini" style="width: ${percentage}%"></div>
                        </div>
                        <span>${prog.completed}/${prog.total} lessons</span>
                    </div>
                </div>
                <div class="course-actions">
                    <button class="btn-sm" onclick="markComplete(${course.id})">
                        <i class="fas fa-play"></i> Continue
                    </button>
                </div>
            </div>
        `;
    });
}

function populateRecommendedCourses() {
    const container = document.getElementById('recommendedCourses');
    const enrolledCourseIds = enrollments.filter(e => e.user === currentUser.email).map(e => e.courseId);
    const recommended = courses.filter(c => c.published && !enrolledCourseIds.includes(c.id)).slice(0, 4);

    if (recommended.length === 0) {
        container.innerHTML = '<p class="empty-state">No recommendations available. Check back later!</p>';
        return;
    }

    container.innerHTML = '';
    recommended.forEach(course => {
        container.innerHTML += `
            <div class="recommended-course-card">
                <div class="course-thumbnail">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <div class="course-info">
                    <h4>${course.title}</h4>
                    <p>by ${course.instructor.split('@')[0]}</p>
                    <div class="course-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <span>4.5</span>
                    </div>
                </div>
                <div class="course-actions">
                    <button class="btn-sm primary" onclick="enroll(${course.id})">
                        <i class="fas fa-plus"></i> Enroll
                    </button>
                </div>
            </div>
        `;
    });
}

function populateInstructorCourses() {
    const container = document.getElementById('instructorCourses');
    const myCourses = courses.filter(c => c.instructor === currentUser.email);

    if (myCourses.length === 0) {
        container.innerHTML = '<p class="empty-state">No courses created yet. <button onclick="showCreateCourse()" class="link-btn">Create your first course</button>!</p>';
        return;
    }

    container.innerHTML = '';
    myCourses.slice(0, 6).forEach(course => {
        const enrolledCount = enrollments.filter(e => e.courseId === course.id).length;
        container.innerHTML += `
            <div class="instructor-course-card">
                <div class="course-status ${course.published ? 'published' : 'draft'}">
                    <i class="fas fa-${course.published ? 'eye' : 'eye-slash'}"></i>
                    ${course.published ? 'Published' : 'Draft'}
                </div>
                <div class="course-info">
                    <h4>${course.title}</h4>
                    <p>${course.desc.substring(0, 80)}...</p>
                    <div class="course-stats">
                        <span><i class="fas fa-users"></i> ${enrolledCount} students</span>
                        <span><i class="fas fa-star"></i> 4.5</span>
                    </div>
                </div>
                <div class="course-actions">
                    <button class="btn-sm" onclick="togglePublish(${course.id})">
                        <i class="fas fa-${course.published ? 'eye-slash' : 'eye'}"></i>
                    </button>
                    <button class="btn-sm" onclick="editCourse(${course.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `;
    });
}

function showAnalytics() {
    alert('Analytics feature coming soon!');
}

function showAllCourses() {
    alert('All courses view coming soon!');
}

function showReports() {
    alert('Reports feature coming soon!');
}

function editCourse(courseId) {
    const course = courses.find(c => c.id === courseId);
    if (course) {
        // Populate form with existing data
        document.getElementById('courseTitle').value = course.title;
        document.getElementById('courseDesc').value = course.desc;
        showCreateCourse();
        // Note: In a real app, you'd want to handle editing vs creating differently
    }
}

// Course Creation
function showCreateCourse() { showSection('courseCreate'); }

document.getElementById('courseForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (currentUser.role !== 'instructor') return;
    
    const title = document.getElementById('courseTitle').value;
    const desc = document.getElementById('courseDesc').value;
    
    courses.push({ id: Date.now(), title, desc, instructor: currentUser.email, published: false });
    localStorage.setItem('courses', JSON.stringify(courses));
    alert('Course created!');
    showDashboard();
});

// Browse Courses
function showCourses() { 
    showSection('courses'); 
    renderCourses();
}

function renderCourses() {
    const list = document.getElementById('coursesList');
    list.innerHTML = '';
    courses.filter(c => c.published).forEach(course => {
        list.innerHTML += `
            <div class="course">
                <h4>${course.title}</h4>
                <p>${course.desc}</p>
                <p><i class="fas fa-user"></i> Instructor: ${course.instructor}</p>
                <button onclick="enroll(${course.id})"><i class="fas fa-plus"></i> Enroll Now</button>
            </div>
        `;
    });
}

function enroll(courseId) {
    if (enrollments.find(e => e.user === currentUser.email && e.courseId === courseId)) {
        alert('Already enrolled in this course!');
        return;
    }
    enrollments.push({ user: currentUser.email, courseId, enrolledDate: new Date().toISOString() });
    localStorage.setItem('enrollments', JSON.stringify(enrollments));
    
    // Show success message
    const course = courses.find(c => c.id === courseId);
    alert(`Successfully enrolled in "${course.title}"! You can now start learning.`);
    
    // Refresh dashboard if on dashboard page
    if (document.getElementById('dashboard').style.display !== 'none') {
        renderDashboard();
    }
}

// My Courses
function showMyCourses() { 
    showSection('myCourses'); 
    renderMyCourses();
}

function renderMyCourses() {
    const list = document.getElementById('myCoursesList');
    list.innerHTML = '';
    
    if (currentUser.role === 'instructor') {
        courses.filter(c => c.instructor === currentUser.email).forEach(course => {
            list.innerHTML += `
                <div class="course">
                    <h4>${course.title}</h4>
                    <p>${course.desc}</p>
                    <p><i class="fas fa-eye"></i> Status: ${course.published ? 'Published' : 'Draft'}</p>
                    <button onclick="togglePublish(${course.id})"><i class="fas fa-${course.published ? 'eye-slash' : 'eye'}"></i> ${course.published ? 'Unpublish' : 'Publish'}</button>
                    <button onclick="deleteCourse(${course.id})" style="background: #e53e3e;"><i class="fas fa-trash"></i> Delete</button>
                </div>
            `;
        });
    } else {
        enrollments.filter(e => e.user === currentUser.email).forEach(enrollment => {
            const course = courses.find(c => c.id === enrollment.courseId);
            if (course) {
                list.innerHTML += `
                    <div class="course">
                        <h4>${course.title}</h4>
                        <p>${course.desc}</p>
                        <p><i class="fas fa-user"></i> Instructor: ${course.instructor}</p>
                        <button onclick="unenroll(${course.id})" style="background: #e53e3e;"><i class="fas fa-minus"></i> Unenroll</button>
                        <button onclick="takeQuiz(${course.id})"><i class="fas fa-question-circle"></i> Take Quiz</button>
                    </div>
                `;
            }
        });
    }
}

function togglePublish(id) {
    const course = courses.find(c => c.id === id);
    course.published = !course.published;
    localStorage.setItem('courses', JSON.stringify(courses));
    renderMyCourses();
}

function deleteCourse(id) {
    courses = courses.filter(c => c.id !== id);
    localStorage.setItem('courses', JSON.stringify(courses));
    renderMyCourses();
}

function unenroll(courseId) {
    if (confirm('Are you sure you want to unenroll from this course? Your progress will be lost.')) {
        enrollments = enrollments.filter(e => !(e.user === currentUser.email && e.courseId === courseId));
        // Also remove progress data
        progress = progress.filter(p => !(p.user === currentUser.email && p.courseId === courseId));
        localStorage.setItem('enrollments', JSON.stringify(enrollments));
        localStorage.setItem('progress', JSON.stringify(progress));
        
        const course = courses.find(c => c.id === courseId);
        alert(`Successfully unenrolled from "${course.title}".`);
        
        // Refresh current view
        if (document.getElementById('myCourses').style.display !== 'none') {
            renderMyCourses();
        } else if (document.getElementById('dashboard').style.display !== 'none') {
            renderDashboard();
        }
    }
}

// Progress
function showProgress() { 
    showSection('progress'); 
    renderProgress();
}

function renderProgress() {
    const content = document.getElementById('progressContent');
    content.innerHTML = '';
    
    enrollments.filter(e => e.user === currentUser.email).forEach(enrollment => {
        const course = courses.find(c => c.id === enrollment.courseId);
        const prog = progress.find(p => p.user === currentUser.email && p.courseId === enrollment.courseId) || { completed: 0, total: 10 };
        const percentage = (prog.completed / prog.total) * 100;
        
        content.innerHTML += `
            <div class="course">
                <h4>${course.title}</h4>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <p><i class="fas fa-check-circle"></i> ${prog.completed}/${prog.total} lessons completed (${Math.round(percentage)}%)</p>
                <button onclick="markComplete(${course.id})"><i class="fas fa-plus"></i> Mark Lesson Complete</button>
            </div>
        `;
    });
}

function markComplete(courseId) {
    let prog = progress.find(p => p.user === currentUser.email && p.courseId === courseId);
    if (!prog) {
        prog = { user: currentUser.email, courseId, completed: 0, total: 10 };
        progress.push(prog);
    }
    if (prog.completed < prog.total) prog.completed++;
    localStorage.setItem('progress', JSON.stringify(progress));
    renderProgress();
}

// Quiz
function takeQuiz(courseId) {
    showSection('quiz');
    const content = document.getElementById('quizContent');
    content.innerHTML = `
        <h3><i class="fas fa-question-circle"></i> Course Quiz</h3>
        <p>Sample Quiz: What is 2+2?</p>
        <form id="quizForm">
            <label><input type="radio" name="q1" value="3"> 3</label><br>
            <label><input type="radio" name="q1" value="4"> 4</label><br>
            <label><input type="radio" name="q1" value="5"> 5</label><br>
            <button type="button" class="btn-primary" onclick="submitQuiz(${courseId})"><i class="fas fa-paper-plane"></i> Submit Quiz</button>
        </form>
    `;
}

function submitQuiz(courseId) {
    const answer = document.querySelector('input[name="q1"]:checked');
    if (answer && answer.value === '4') {
        alert('Correct! Certificate generated.');
        // In real app, generate certificate
    } else {
        alert('Incorrect. Try again.');
    }
}

// Admin
function showUsers() {
    const content = document.getElementById('dashboardContent');
    content.innerHTML = '<h3><i class="fas fa-users"></i> User Management</h3>';
    users.forEach(user => {
        content.innerHTML += `<div class="course">
            <p><i class="fas fa-user"></i> ${user.email} - Role: ${user.role}</p>
            <button onclick="changeRole('${user.email}')" class="btn-primary"><i class="fas fa-edit"></i> Change Role</button>
        </div>`;
    });
}

function changeRole(email) {
    const user = users.find(u => u.email === email);
    user.role = prompt('New role:', user.role);
    localStorage.setItem('users', JSON.stringify(users));
    showUsers();
}

// Initialize sample data if empty
function initializeSampleData() {
    if (courses.length === 0) {
        courses = [
            {
                id: 1,
                title: "Introduction to Web Development",
                desc: "Learn the basics of HTML, CSS, and JavaScript to build modern websites.",
                instructor: "john.doe@example.com",
                published: true
            },
            {
                id: 2,
                title: "Advanced React Development",
                desc: "Master React hooks, context, and advanced patterns for professional development.",
                instructor: "jane.smith@example.com",
                published: true
            },
            {
                id: 3,
                title: "Python for Data Science",
                desc: "Learn Python programming with focus on data analysis and machine learning.",
                instructor: "mike.johnson@example.com",
                published: true
            },
            {
                id: 4,
                title: "UI/UX Design Principles",
                desc: "Master the fundamentals of user interface and user experience design.",
                instructor: "sarah.wilson@example.com",
                published: true
            },
            {
                id: 5,
                title: "Mobile App Development",
                desc: "Build native mobile applications for iOS and Android platforms.",
                instructor: "david.brown@example.com",
                published: false
            }
        ];
        localStorage.setItem('courses', JSON.stringify(courses));
    }

    if (users.length === 0) {
        users = [
            { email: "admin@elearn.com", password: btoa("admin123"), role: "admin" },
            { email: "john.doe@example.com", password: btoa("password"), role: "instructor" },
            { email: "jane.smith@example.com", password: btoa("password"), role: "instructor" },
            { email: "mike.johnson@example.com", password: btoa("password"), role: "instructor" },
            { email: "sarah.wilson@example.com", password: btoa("password"), role: "instructor" },
            { email: "david.brown@example.com", password: btoa("password"), role: "instructor" }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Initialize
initializeSampleData();
showHome();
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
            
            // Load content if needed
            if (targetId === 'vocab') loadVocabulary();
            if (targetId === 'math') loadMathProblems();
            if (targetId === 'verbal') loadVerbalQuestions();
        });
    });
    
    // Payment modal
    const modal = document.getElementById('payment-modal');
    const buyButtons = document.querySelectorAll('.buy-btn');
    const closeBtn = document.querySelector('.close');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            // You would set the selected plan here
            modal.style.display = 'block';
            initializeGooglePay(plan); // Initialize GPay with selected plan
        });
    });
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Load initial content
    loadDashboardStats();
});

function loadDashboardStats() {
    // In a real app, you would load this from localStorage or a server
    document.getElementById('vocab-count').textContent = '125/1000';
    document.getElementById('math-count').textContent = '87/500';
}

function loadVocabulary() {
    fetch('assets/vocab.json')
        .then(response => response.json())
        .then(data => {
            const vocabSection = document.getElementById('vocab');
            vocabSection.innerHTML = '<h2>Vocabulary Builder</h2><div class="vocab-list"></div>';
            
            const vocabList = document.querySelector('#vocab .vocab-list');
            data.forEach(word => {
                const card = document.createElement('div');
                card.className = 'vocab-card';
                card.innerHTML = `
                    <h3>${word.word}</h3>
                    <p class="definition">${word.definition}</p>
                    <p class="example">${word.example}</p>
                `;
                vocabList.appendChild(card);
            });
        })
        .catch(error => console.error('Error loading vocabulary:', error));
}

function loadMathProblems() {
    // Similar implementation for math problems
}

function loadVerbalQuestions() {
    // Similar implementation for verbal questions
}
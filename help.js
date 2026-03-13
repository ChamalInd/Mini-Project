// FAQ accordion toggle
document.addEventListener('DOMContentLoaded', function() {
    const questions = document.querySelectorAll('.faq-question');
    questions.forEach(btn => {
        btn.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isOpen = answer.classList.toggle('open');
            // optionally close others
            if (isOpen) {
                questions.forEach(other => {
                    if (other !== this) {
                        other.nextElementSibling.classList.remove('open');
                    }
                });
            }
        });
    });
});

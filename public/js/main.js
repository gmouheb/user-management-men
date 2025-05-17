// Main JavaScript file for PFE Iness

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('PFE Iness application loaded');
    
    // Add animation to cards
    const cards = document.querySelectorAll('.card');
    if (cards.length > 0) {
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
    }
    
    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    if (alerts.length > 0) {
        setTimeout(function() {
            alerts.forEach(alert => {
                const closeButton = alert.querySelector('.btn-close');
                if (closeButton) {
                    closeButton.click();
                }
            });
        }, 5000);
    }
    
    // Form validation enhancement
    const forms = document.querySelectorAll('form');
    if (forms.length > 0) {
        forms.forEach(form => {
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    // Add custom validation messages
                    const inputs = form.querySelectorAll('input, select, textarea');
                    inputs.forEach(input => {
                        if (!input.validity.valid) {
                            input.classList.add('is-invalid');
                        } else {
                            input.classList.remove('is-invalid');
                            input.classList.add('is-valid');
                        }
                    });
                }
                
                form.classList.add('was-validated');
            }, false);
        });
    }
});
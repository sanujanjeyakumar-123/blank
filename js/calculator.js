// Calculator page functionality

function initializeCalculatorPage() {
    const calculatorForm = document.getElementById('calculator-form');
    const resultsContainer = document.getElementById('results-container');

    if (!calculatorForm) return;

    calculatorForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const age = parseInt(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const height = parseInt(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const activity = parseFloat(document.getElementById('activity').value);

        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // Calculate TDEE
        const tdee = bmr * activity;

        // Calculate macronutrients
        const carbsCalories = tdee * 0.5;
        const proteinCalories = tdee * 0.2;
        const fatsCalories = tdee * 0.3;

        const carbsGrams = carbsCalories / 4;
        const proteinGrams = proteinCalories / 4;
        const fatsGrams = fatsCalories / 9;

        // Display results
        document.getElementById('bmr-result').textContent = Math.round(bmr);
        document.getElementById('tdee-result').textContent = Math.round(tdee);
        document.getElementById('carbs-value').textContent = Math.round(carbsGrams) + 'g';
        document.getElementById('protein-value').textContent = Math.round(proteinGrams) + 'g';
        document.getElementById('fats-value').textContent = Math.round(fatsGrams) + 'g';

        // Animate progress bars
        setTimeout(() => {
            document.getElementById('carbs-progress').style.width = '50%';
            document.getElementById('protein-progress').style.width = '20%';
            document.getElementById('fats-progress').style.width = '30%';
        }, 100);

        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    });
}

// Initialize calculator page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCalculatorPage);
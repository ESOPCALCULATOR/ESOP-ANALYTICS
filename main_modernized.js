// ESOP PROJECTION CALCULATOR - Modernized Version 2025
// Professional, responsive, and user-friendly ESOP projection calculator

'use strict';

// === UTILITY FUNCTIONS ===

function roundToNearest5(num) {
  return Math.round(num / 5) * 5;
}

function formatCurrency(num) {
  return "$" + Math.round(num).toLocaleString("en-US", { minimumFractionDigits: 0 });
}

function formatNumber(num) {
  return Math.round(num).toLocaleString("en-US");
}

// === CONSTANTS ===

const SCENARIO_COLORS = [
  "#e39e2b", "#2f5f98", "#0e4d64", "#071527", "#f4b942", 
  "#c88a24", "#6B7280", "#F8F9FA", "#ffffff", "#16a34a"
];

const MAX_SCENARIOS = 3;

// === STATE MANAGEMENT ===

let scenarios = [
  {
    name: "Scenario 1",
    salary: "",
    salaryIncrease: "",
    accountBalance: "",
    fmvPercent: "",
    growth: "",
    years: ""
  }
];

let isCalculationPressed = false;
let esopChart = null;
let chartData = [];

// === VALIDATION ===

function validateScenario(scenario) {
  const required = ['salary', 'salaryIncrease', 'accountBalance', 'fmvPercent', 'growth', 'years'];
  return required.every(field => scenario[field] && scenario[field].toString().trim() !== '');
}

function getValidationWarning(value, fieldName) {
  if (isCalculationPressed && (!value || value.toString().trim() === "")) {
    return `<div class="warning">Please enter a value for ${fieldName}</div>`;
  }
  return "";
}

// === SCENARIO MANAGEMENT ===

function createScenarioHTML(scenario, index) {
  const isHighlighted = isCalculationPressed && !validateScenario(scenario);
  const canRemove = index > 0;
  
  return `
    <div class="scenario-row" data-index="${index}">
      <div class="scenario-title">
        <input type="text" class="scenario-name" value="${scenario.name}" 
               placeholder="Scenario Name" aria-label="Scenario Name">
        ${canRemove ? '<button type="button" class="remove-btn" aria-label="Remove scenario">×</button>' : ''}
      </div>
      
      <label>
        Annual Salary ($)
        <input type="text" class="salary" value="${scenario.salary}" 
               placeholder="e.g., 75000" ${isHighlighted ? 'class="highlight-input"' : ''}>
        ${getValidationWarning(scenario.salary, 'salary')}
      </label>
      
      <label>
        Annual Salary Increase (%)
        <input type="number" class="salaryIncrease" min="0" step="0.1" 
               value="${scenario.salaryIncrease}" placeholder="e.g., 3.5" 
               ${isHighlighted ? 'class="highlight-input"' : ''}>
        ${getValidationWarning(scenario.salaryIncrease, 'salary increase')}
      </label>
      
      <label>
        Current Account Balance ($)
        <input type="text" class="accountBalance" value="${scenario.accountBalance}" 
               placeholder="e.g., 25000" ${isHighlighted ? 'class="highlight-input"' : ''}>
        ${getValidationWarning(scenario.accountBalance, 'account balance')}
      </label>
      
      <label>
        Benefit Level (% of salary)
        <input type="number" class="fmvPercent" min="0" step="0.1" 
               value="${scenario.fmvPercent}" placeholder="e.g., 6.0" 
               ${isHighlighted ? 'class="highlight-input"' : ''}>
        ${getValidationWarning(scenario.fmvPercent, 'benefit level')}
      </label>
      
      <label>
        Share Value Appreciation (% per year)
        <input type="number" class="growth" min="0" step="0.1" 
               value="${scenario.growth}" placeholder="e.g., 8.0" 
               ${isHighlighted ? 'class="highlight-input"' : ''}>
        ${getValidationWarning(scenario.growth, 'growth rate')}
      </label>
      
      <label>
        Number of Years
        <input type="number" class="years" min="1" max="40" 
               value="${scenario.years}" placeholder="e.g., 15" 
               ${isHighlighted ? 'class="highlight-input"' : ''}>
        ${getValidationWarning(scenario.years, 'years')}
      </label>
    </div>
  `;
}

function renderScenarios() {
  const scenariosArea = document.getElementById('scenariosArea');
  if (!scenariosArea) return;
  
  scenariosArea.innerHTML = scenarios.map((scenario, index) => 
    createScenarioHTML(scenario, index)
  ).join('');
  
  attachScenarioEventListeners();
  updateAddButtonState();
}

function attachScenarioEventListeners() {
  // Remove button handlers
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', handleRemoveScenario);
  });
  
  // Input formatting for currency fields
  document.querySelectorAll('.salary, .accountBalance').forEach(input => {
    input.addEventListener('input', formatCurrencyInput);
    input.addEventListener('blur', updateScenarioData);
  });
  
  // Other input handlers
  document.querySelectorAll('.scenario-row input').forEach(input => {
    input.addEventListener('input', updateScenarioData);
    input.addEventListener('input', clearValidationWarnings);
  });
}

function formatCurrencyInput(event) {
  const input = event.target;
  let value = input.value.replace(/[^\d]/g, '');
  
  if (value) {
    value = parseInt(value).toLocaleString();
  }
  
  input.value = value;
}

function handleRemoveScenario(event) {
  const scenarioRow = event.target.closest('.scenario-row');
  const index = parseInt(scenarioRow.dataset.index);
  
  scenarios.splice(index, 1);
  
  // Renumber remaining scenarios
  scenarios.forEach((scenario, i) => {
    if (scenario.name.startsWith('Scenario ')) {
      scenario.name = `Scenario ${i + 1}`;
    }
  });
  
  renderScenarios();
}

function updateScenarioData() {
  document.querySelectorAll('.scenario-row').forEach((row, index) => {
    if (scenarios[index]) {
      const getData = (selector) => {
        const input = row.querySelector(selector);
        return input ? input.value : '';
      };
      
      scenarios[index].name = getData('.scenario-name');
      scenarios[index].salary = getData('.salary').replace(/[^\d]/g, '');
      scenarios[index].salaryIncrease = getData('.salaryIncrease');
      scenarios[index].accountBalance = getData('.accountBalance').replace(/[^\d]/g, '');
      scenarios[index].fmvPercent = getData('.fmvPercent');
      scenarios[index].growth = getData('.growth');
      scenarios[index].years = getData('.years');
    }
  });
}

function clearValidationWarnings(event) {
  const warnings = event.target.parentElement.querySelectorAll('.warning');
  warnings.forEach(warning => warning.remove());
  
  event.target.classList.remove('highlight-input');
}

function addScenario() {
  if (scenarios.length >= MAX_SCENARIOS) {
    alert(`Maximum of ${MAX_SCENARIOS} scenarios allowed`);
    return;
  }
  
  updateScenarioData();
  
  // Copy data from first scenario as template
  const template = scenarios[0] || {};
  const newScenario = {
    name: `Scenario ${scenarios.length + 1}`,
    salary: template.salary || "",
    salaryIncrease: "",
    accountBalance: template.accountBalance || "",
    fmvPercent: "",
    growth: "",
    years: template.years || ""
  };
  
  scenarios.push(newScenario);
  renderScenarios();
}

function updateAddButtonState() {
  const addBtn = document.getElementById('addScenarioBtn');
  if (addBtn) {
    addBtn.disabled = scenarios.length >= MAX_SCENARIOS;
    addBtn.textContent = scenarios.length >= MAX_SCENARIOS ? 
      'Maximum Scenarios Reached' : 'Add Scenario';
  }
}

// === CALCULATIONS ===

function calculateProjections() {
  isCalculationPressed = true;
  updateScenarioData();
  
  // Validate all scenarios
  const invalidScenarios = scenarios.filter(scenario => !validateScenario(scenario));
  
  if (invalidScenarios.length > 0) {
    renderScenarios(); // Re-render to show validation messages
    alert('Please fill in all required fields before calculating.');
    return;
  }
  
  // Calculate projections for each scenario
  const results = scenarios.map((scenario, index) => {
    const data = {
      salary: parseFloat(scenario.salary),
      salaryIncrease: parseFloat(scenario.salaryIncrease) / 100,
      accountBalance: parseFloat(scenario.accountBalance),
      fmvPercent: parseFloat(scenario.fmvPercent) / 100,
      growth: parseFloat(scenario.growth) / 100,
      years: parseInt(scenario.years)
    };
    
    const projections = [];
    let currentBalance = data.accountBalance;
    let currentSalary = data.salary;
    
    for (let year = 1; year <= data.years; year++) {
      const contribution = currentSalary * data.fmvPercent;
      currentBalance = (currentBalance + contribution) * (1 + data.growth);
      
      projections.push({
        year,
        salary: currentSalary,
        contribution,
        balance: currentBalance
      });
      
      currentSalary *= (1 + data.salaryIncrease);
    }
    
    return {
      name: scenario.name,
      finalBalance: currentBalance,
      projections
    };
  });
  
  chartData = results;
  displayResults(results);
  createChart(results);
  
  // Re-render scenarios to clear validation highlights
  renderScenarios();
}

// === RESULTS DISPLAY ===

function displayResults(results) {
  const detailedDiv = document.getElementById('detailedResults');
  if (!detailedDiv) return;
  
  if (results.length === 0) {
    detailedDiv.innerHTML = '';
    return;
  }

  // Check if mobile
  const isMobile = window.innerWidth <= 768;
  
  let html = '<div class="results-container">';
  
  if (isMobile) {
    // Mobile layout: separate containers for each scenario
    html += '<div class="five-year-breakdown">';
    
    results.forEach(result => {
      html += `
        <div class="mobile-scenario-container">
          <div class="mobile-scenario-title">${result.name}</div>
      `;
      
      // Add year-by-year data for this scenario
      result.projections.forEach(projection => {
        const multiple = projection.salary > 0 ? (projection.balance / projection.salary).toFixed(1) : '0.0';
        html += `
          <div class="mobile-year-row">
            <div class="mobile-year-label">Year ${projection.year}</div>
            <div class="mobile-year-data">
              <div class="salary">${formatCurrency(projection.salary)}</div>
              <div class="balance"><strong>${formatCurrency(projection.balance)}</strong></div>
              <div class="multiple">${multiple}x</div>
            </div>
          </div>
        `;
      });
      
      html += '</div>'; // Close mobile-scenario-container
    });
    
    html += '</div>'; // Close five-year-breakdown
  } else {
    // Desktop layout: side-by-side comparison table
    html += '<div class="five-year-breakdown">';
    html += '<table class="interval-table comparison-table">';
    html += '<thead><tr><th>Year</th>';
    
    // Add header for each scenario
    results.forEach(result => {
      html += `<th>${result.name}<br><small>Salary | Balance | Multiple</small></th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Get the maximum number of projections to ensure we cover all years
    const maxProjections = Math.max(...results.map(r => r.projections.length));
    
    // Show every year
    for (let i = 0; i < maxProjections; i++) {
      const year = results[0].projections[i]?.year || (i + 1);
      html += `<tr><td><strong>Year ${year}</strong></td>`;
      
      results.forEach(result => {
        if (i < result.projections.length) {
          const projection = result.projections[i];
          const multiple = projection.salary > 0 ? (projection.balance / projection.salary).toFixed(1) : '0.0';
          html += `
            <td class="scenario-data">
              <div class="salary">${formatCurrency(projection.salary)}</div>
              <div class="balance"><strong>${formatCurrency(projection.balance)}</strong></div>
              <div class="multiple">${multiple}x</div>
            </td>
          `;
        } else {
          html += '<td class="scenario-data">-</td>';
        }
      });
      html += '</tr>';
    }
    
    html += '</tbody></table></div>';
  }
  
  html += '</div>';
  detailedDiv.innerHTML = html;
  
  // Update print results
  // Update print results
  updatePrintResults(results);
}

function updatePrintResults(results) {
  const printDiv = document.getElementById('detailedPrintResults');
  if (!printDiv) return;
  
  let html = '<div class="print-results-container">';
  
  results.forEach(result => {
    html += `
      <div class="print-scenario-results">
        <h3>${result.name}</h3>
        <div class="print-final-balance">
          <strong>Final Balance: ${formatCurrency(result.finalBalance)}</strong>
        </div>
        <div class="print-breakdown">
          <table class="print-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Salary</th>
                <th>Balance</th>
                <th>Multiple</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    // Show every year
    for (let i = 0; i < result.projections.length; i++) {
      const projection = result.projections[i];
      const multiple = projection.salary > 0 ? (projection.balance / projection.salary).toFixed(1) : '0.0';
      html += `
        <tr>
          <td>${projection.year}</td>
          <td>${formatCurrency(projection.salary)}</td>
          <td><strong>${formatCurrency(projection.balance)}</strong></td>
          <td>${multiple}x</td>
        </tr>
      `;
    }
    
    html += '</tbody></table></div></div>';
  });
  
  html += '</div>';
  printDiv.innerHTML = html;
}

// === CHART MANAGEMENT ===

function createChart(results) {
  const canvas = document.getElementById('esopChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Destroy existing chart
  if (esopChart) {
    esopChart.destroy();
  }
  
  // Prepare datasets
  const datasets = results.map((result, index) => ({
    label: result.name,
    data: result.projections.map(p => ({ x: p.year, y: p.balance })),
    borderColor: SCENARIO_COLORS[index % SCENARIO_COLORS.length],
    backgroundColor: SCENARIO_COLORS[index % SCENARIO_COLORS.length] + '20',
    borderWidth: 3,
    pointRadius: 4,
    pointHoverRadius: 8,
    pointBackgroundColor: SCENARIO_COLORS[index % SCENARIO_COLORS.length],
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    fill: false,
    tension: 0.1
  }));
  
  esopChart = new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        title: {
          display: false
        },
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#071527',
            usePointStyle: true,
            padding: 20,
            font: { size: 12 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(7, 21, 39, 0.95)',
          titleColor: '#fbbf24',
          bodyColor: '#fbbf24',
          borderColor: '#fbbf24',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
            }
          }
        },
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'xy',
          },
          pan: {
            enabled: true,
            mode: 'xy'
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          title: {
            display: true,
            text: 'Years',
            color: '#071527'
          },
          ticks: { 
            color: '#071527',
            stepSize: 1,
            precision: 0,
            callback: function(value) {
              return Number.isInteger(value) && value >= 1 ? value : '';
            }
          },
          grid: { color: 'rgba(7, 21, 39, 0.2)' },
          min: 1,
          afterBuildTicks: function(axis) {
            const maxYear = Math.max(...axis.chart.data.datasets.map(dataset => 
              Math.max(...dataset.data.map(point => point.x))
            ));
            axis.ticks = [];
            for (let i = 1; i <= maxYear; i++) {
              axis.ticks.push({ value: i, label: i.toString() });
            }
          }
        },
        y: {
          title: {
            display: true,
            text: 'Account Balance ($)',
            color: '#071527'
          },
          ticks: {
            color: '#071527',
            callback: function(value) {
              return formatCurrency(value);
            }
          },
          grid: { color: 'rgba(7, 21, 39, 0.2)' }
        }
      }
    }
  });
}

// === RESET FUNCTIONALITY ===

function resetCalculator() {
  isCalculationPressed = false;
  
  scenarios.length = 0;
  scenarios.push({
    name: "Scenario 1",
    salary: "",
    salaryIncrease: "",
    accountBalance: "",
    fmvPercent: "",
    growth: "",
    years: ""
  });
  
  // Clear results
  const detailedDiv = document.getElementById('detailedResults');
  const printDiv = document.getElementById('detailedPrintResults');
  
  if (detailedDiv) detailedDiv.innerHTML = '';
  if (printDiv) printDiv.innerHTML = '';
  
  // Destroy chart
  if (esopChart) {
    esopChart.destroy();
    esopChart = null;
  }
  
  chartData = [];
  renderScenarios();
}

// === PRINT FUNCTIONALITY ===

function printCalculator() {
  window.print();
}

// === INITIALIZATION ===

function initializeCalculator() {
  // Get DOM elements
  const elements = {
    addBtn: document.getElementById('addScenarioBtn'),
    calculateBtn: document.getElementById('calculateBtn'),
    resetBtn: document.getElementById('resetBtn'),
    scenariosArea: document.getElementById('scenariosArea')
  };
  
  // Check if required elements exist
  if (!elements.scenariosArea) {
    console.error('Required DOM elements not found');
    return;
  }
  
  // Attach event listeners
  if (elements.addBtn) {
    elements.addBtn.addEventListener('click', addScenario);
  }
  
  if (elements.calculateBtn) {
    elements.calculateBtn.addEventListener('click', calculateProjections);
  }
  
  if (elements.resetBtn) {
    elements.resetBtn.addEventListener('click', resetCalculator);
  }
  
  // Initial render
  renderScenarios();
  
  // Add window resize listener to handle orientation changes
  window.addEventListener('resize', () => {
    // Re-render results if they exist
    if (chartData && chartData.length > 0) {
      displayResults(chartData);
    }
  });
  
  console.log('ESOP PROJECTION CALCULATOR initialized successfully');
}

// === DOCUMENT READY ===

document.addEventListener('DOMContentLoaded', initializeCalculator);

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatCurrency,
    validateScenario,
    calculateProjections,
    resetCalculator
  };
}

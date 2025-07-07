function roundToNearest5(num) {
  return Math.round(num / 5) * 5;
}
function formatCurrency(num) {
  return "$" + num.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

const scenarioColors = [
  "#e39e2b", "#0e4d64", "#b0b8c1", "#b87333", "#7b3f00",
  "#228B22", "#800080", "#C71585", "#FF4500", "#4682B4",
  "#FFD700", "#20B2AA", "#DC143C", "#8B0000", "#00CED1"
];
const scenarioFills = scenarioColors.map(c => {
  const hex = c.replace('#', '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},0.13)`;
});

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

const helpTexts = {
  salary: "Your starting annual salary before taxes.",
  salaryIncrease: "Expected average annual salary increase (as a percent).",
  accountBalance: "Your ESOP account balance at the start.",
  fmvPercent: "The percentage of your salary contributed to your ESOP account each year.",
  growth: "Expected annual share value appreciation (as a percent).",
  years: "Number of years you want to project."
};

let calculatePressed = false;

const scenarioNameColors = [
  "#e39e2b", // gold for Scenario 1
  "#0e4d64", // blue for Scenario 2
  "#b0b8c1", // gray for Scenario 3
  "#b87333", // bronze for Scenario 4
  "#7b3f00", // brown for Scenario 5
  "#228B22", // green for Scenario 6
  "#800080", // purple for Scenario 7
  "#C71585", // magenta for Scenario 8
  "#FF4500", // orange-red for Scenario 9
  "#4682B4"  // steel blue for Scenario 10
];

function scenarioRow(scenario, idx) {
  const highlight = idx > 0;
  const showHelp = idx === 0;
  const nameColor = scenarioNameColors[idx % scenarioNameColors.length];

  function warnIfEmpty(val, inputClass) {
    if (!calculatePressed) return '';
    if (val && val.trim() !== "") return '';
    return `<span class="input-error" style="display:block;color:#c62828;">Please enter a value above.</span>`;
  }

  return `
  <div class="scenario-row" data-idx="${idx}">
    <div class="scenario-title">
      <input type="text" aria-label="Scenario Name" tabindex="0" value="${scenario.name}" class="scenario-name" style="width: 60%; font-weight:bold; color:${nameColor}; font-size:1.05rem;">
      ${highlight ? `<button type="button" class="remove-btn" title="Remove Scenario" aria-label="Remove this scenario" tabindex="0">&times;</button>` : ""}
    </div>
    <label>Starting Salary ($)
      ${showHelp ? `<span class="help-icon" tabindex="0" aria-label="Help: Starting Salary">?</span>
      <span class="help-tooltip">${helpTexts.salary}</span>` : ""}
      <input type="text" inputmode="numeric" tabindex="0" class="salary salary${idx}" min="0" aria-required="true" value="${scenario.salary !== undefined ? scenario.salary : ""}">
      ${warnIfEmpty(scenario.salary, 'salary')}
    </label>
    <div class="salary-increase-row">
      <label>Annual Salary Increase (%)
        ${showHelp ? `<span class="help-icon" tabindex="0" aria-label="Help: Annual Salary Increase">?</span>
        <span class="help-tooltip">${helpTexts.salaryIncrease}</span>` : ""}
        <input type="number" tabindex="0" class="salaryIncrease salaryIncrease${idx}${(highlight ? ' highlight-input' : '')}" min="0" step="0.1" aria-required="true" value="${scenario.salaryIncrease !== undefined ? scenario.salaryIncrease : ""}">
        ${warnIfEmpty(scenario.salaryIncrease, 'salaryIncrease')}
      </label>
    </div>
    <label>Starting Account Balance ($)
      ${showHelp ? `<span class="help-icon" tabindex="0" aria-label="Help: Starting Account Balance">?</span>
      <span class="help-tooltip">${helpTexts.accountBalance}</span>` : ""}
      <input type="text" inputmode="numeric" tabindex="0" class="accountBalance accountBalance${idx}" min="0" aria-required="true" value="${scenario.accountBalance !== undefined ? scenario.accountBalance : ""}">
      ${warnIfEmpty(scenario.accountBalance, 'accountBalance')}
    </label>
    <label>Fair Market Value Benefit Level (% of salary)
      ${showHelp ? `<span class="help-icon" tabindex="0" aria-label="Help: FMV Benefit Level">?</span>
      <span class="help-tooltip">${helpTexts.fmvPercent}</span>` : ""}
      <input type="number" tabindex="0" class="fmvPercent fmvPercent${idx}${(highlight ? ' highlight-input' : '')}" min="0" step="0.1" aria-required="true" value="${scenario.fmvPercent !== undefined ? scenario.fmvPercent : ""}">
      ${warnIfEmpty(scenario.fmvPercent, 'fmvPercent')}
    </label>
    <label>Share Value Appreciation (% per year)
      ${showHelp ? `<span class="help-icon" tabindex="0" aria-label="Help: Share Value Appreciation">?</span>
      <span class="help-tooltip">${helpTexts.growth}</span>` : ""}
      <input type="number" tabindex="0" class="growth growth${idx}${(highlight ? ' highlight-input' : '')}" min="0" step="0.1" aria-required="true" value="${scenario.growth !== undefined ? scenario.growth : ""}">
      ${warnIfEmpty(scenario.growth, 'growth')}
    </label>
    <label>Number of Years
      ${showHelp ? `<span class="help-icon" tabindex="0" aria-label="Help: Number of Years">?</span>
      <span class="help-tooltip">${helpTexts.years}</span>` : ""}
      <input type="number" tabindex="0" class="years years${idx}" min="1" max="40" aria-required="true" value="${scenario.years !== undefined ? scenario.years : ""}">
      ${warnIfEmpty(scenario.years, 'years')}
    </label>
  </div>
  `;
}

// After rendering, apply red border to empty fields if needed
function applyInputErrorStyles() {
  document.querySelectorAll('.scenario-row').forEach((row, idx) => {
    [
      'salary',
      'salaryIncrease',
      'accountBalance',
      'fmvPercent',
      'growth',
      'years'
    ].forEach(field => {
      const input = row.querySelector(`.${field}`);
      if (input) {
        if (calculatePressed && (!input.value || input.value.trim() === "")) {
          input.classList.add('input-error');
        } else {
          input.classList.remove('input-error');
        }
      }
    });
  });
}

function addNumberInputFormatting() {
  document.querySelectorAll('.salary, .accountBalance').forEach(input => {
    input.addEventListener('input', function (e) {
      let value = input.value.replace(/,/g, '');
      value = value.replace(/\D/g, '');
      if (value === "") {
        input.value = "";
        return;
      }
      let formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      input.value = formatted;
    });
    input.addEventListener('focus', function() {
      setTimeout(() => input.select(), 0);
    });
  });
}

function renderScenarios(highlightIdx = null) {
  const area = document.getElementById('scenariosArea');
  let html = scenarioRow(scenarios[0], 0);
  if (scenarios.length > 1) {
    html += `<div class="additional-scenarios-title">Additional Scenarios</div>`;
    for (let i = 1; i < scenarios.length; i++) {
      html += scenarioRow(scenarios[i], i);
    }
  }
  area.innerHTML = html;
  if (highlightIdx !== null) {
    const row = area.querySelector(`.scenario-row[data-idx="${highlightIdx}"]`);
    if (row) {
      row.classList.add('highlighted');
      setTimeout(() => row.classList.remove('highlighted'), 1200);
    }
  }
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(btn.closest('.scenario-row').dataset.idx);
      scenarios.splice(idx, 1);
      renderScenarios();
    };
  });
  document.querySelectorAll('.scenario-name').forEach((input, idx) => {
    input.oninput = function() {
      scenarios[idx].name = input.value;
    };
  });
  addNumberInputFormatting();

  // Show subtitle only if 2 or more scenarios
  const subtitle = document.getElementById('subtitle');
  if (scenarios.length >= 2) {
    subtitle.style.display = '';
  } else {
    subtitle.style.display = 'none';
  }
}

document.getElementById('addScenarioBtn').onclick = function() {
  // Get values from the first scenario
  const first = scenarios[0];
  scenarios.push({
    name: `Scenario ${scenarios.length + 1}`,
    salary: first.salary,
    salaryIncrease: "",
    accountBalance: first.accountBalance,
    fmvPercent: "",
    growth: "",
    years: first.years
  });
  renderScenarios(scenarios.length - 1); // Optionally highlight the new scenario
};

function updateScenarioDataFromForm() {
  document.querySelectorAll('.scenario-row').forEach((row, idx) => {
    scenarios[idx].name = row.querySelector('.scenario-name').value;
    scenarios[idx].salary = row.querySelector('.salary').value.replace(/,/g, '');
    scenarios[idx].salaryIncrease = row.querySelector('.salaryIncrease').value;
    scenarios[idx].accountBalance = row.querySelector('.accountBalance').value.replace(/,/g, '');
    scenarios[idx].fmvPercent = row.querySelector('.fmvPercent').value;
    scenarios[idx].growth = row.querySelector('.growth').value;
    scenarios[idx].years = row.querySelector('.years').value;
  });
}

let esopChart = null;
let lastBalances = [];

document.getElementById('calculateBtn').onclick = function(e) {
  calculatePressed = true;
  updateScenarioDataFromForm();

  // Check if any required field is empty in any scenario
  let missing = false;
  for (const s of scenarios) {
    if (
      !s.salary || s.salary.trim() === "" ||
      !s.salaryIncrease || s.salaryIncrease.trim() === "" ||
      !s.accountBalance || s.accountBalance.trim() === "" ||
      !s.fmvPercent || s.fmvPercent.trim() === "" ||
      !s.growth || s.growth.trim() === "" ||
      !s.years || s.years.trim() === ""
    ) {
      missing = true;
      break;
    }
  }
  renderScenarios();
  applyInputErrorStyles();

  if (missing) {
    document.getElementById('result').innerHTML = `<span style="color:#c62828;">Please fill all required fields above to calculate.</span>`;
    document.getElementById('downloadBtn').disabled = true;
    if (esopChart) esopChart.destroy();
    return;
  }

  let maxYears = Math.max(...scenarios.map(s => parseInt(s.years) || 0));
  let resultsHtml = "";
  let chartLabels = Array.from({length: maxYears}, (_, i) => `Year ${i+1}`);
  let chartDatasets = [];
  lastBalances = [];

  scenarios.forEach((s, idx) => {
    let currentSalary = parseFloat(s.salary) || 0;
    let accountBalance = parseFloat(s.accountBalance) || 0;
    let balances = [];
    let years = parseInt(s.years) || 1;
    let salaryIncrease = (parseFloat(s.salaryIncrease) || 0) / 100;
    let fmvPercent = (parseFloat(s.fmvPercent) || 0) / 100;
    let growth = (parseFloat(s.growth) || 0) / 100;

    // Calculate projected compensation
    let projectedComp = 0;
    for (let year = 1; year <= years; year++) {
      currentSalary = year === 1 ? currentSalary : currentSalary * (1 + salaryIncrease);
      projectedComp += currentSalary;
      let fmvBenefit = currentSalary * fmvPercent;
      accountBalance = (accountBalance + fmvBenefit) * (1 + growth);
      accountBalance = roundToNearest5(accountBalance);
      balances.push(accountBalance);
    }
    while (balances.length < maxYears) balances.push(null);
    lastBalances.push(balances[years-1]);
    // Remove projected compensation from HTML output
    if (idx === 0) {
      resultsHtml = `<div><strong>${s.name}:</strong> ${formatCurrency(balances[years-1])} after ${years} years</div>` + resultsHtml;
    } else {
      resultsHtml += `<div><strong>${s.name}:</strong> ${formatCurrency(balances[years-1])} after ${years} years</div>`;
    }
    chartDatasets.push({
      label: s.name,
      data: balances,
      borderColor: scenarioColors[idx % scenarioColors.length],
      backgroundColor: scenarioFills[idx % scenarioFills.length],
      fill: true,
      pointBackgroundColor: '#fff',
      pointBorderColor: scenarioColors[idx % scenarioColors.length],
      pointRadius: 4,
      pointHoverRadius: 7,
      borderWidth: 3,
      tension: 0.35,
      hidden: false
    });
  });

  document.getElementById('result').innerHTML =
    `<strong>Projected Account Value after each scenario:</strong><br>${resultsHtml}`;
  document.getElementById('downloadBtn').disabled = false;

  const ctx = document.getElementById('esopChart').getContext('2d');
  if (esopChart) esopChart.destroy();
  esopChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartLabels,
      datasets: chartDatasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          onClick: function(e, legendItem, legend) {
            const index = legendItem.datasetIndex;
            const ci = legend.chart;
            const meta = ci.getDatasetMeta(index);
            meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
            ci.update();
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: '#fff',
          titleColor: '#e39e2b',
          bodyColor: '#222',
          borderColor: '#e39e2b',
          borderWidth: 1.5,
          padding: 14,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              return 'Account Value: ' + formatCurrency(context.parsed.y);
            }
          }
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'xy'
          },
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'xy'
          }
        },
        title: {
          display: false
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      onClick: function (evt, elements) {
        if (elements.length > 0) {
          const datasetIdx = elements[0].datasetIndex;
          const idx = elements[0].index;
          const year = idx + 1;
          const value = chartDatasets[datasetIdx].data[idx];
          if (value !== null)
            alert(`${scenarios[datasetIdx].name} - Year ${year}:\nProjected ESOP Value: ${formatCurrency(value)}`);
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Year',
            color: '#e39e2b',
            font: { size: 16, weight: 'bold' }
          },
          grid: {
            color: '#e39e2b',
            lineWidth: 1.5
          },
          ticks: {
            color: '#e39e2b',
            font: { size: 14 }
          }
        },
        y: {
          title: {
            display: true,
            text: 'Account Value',
            color: '#e39e2b',
            font: { size: 16, weight: 'bold' }
          },
          beginAtZero: true,
          grid: {
            color: '#e39e2b',
            lineWidth: 1.5
          },
          ticks: {
            color: '#e39e2b',
            font: { size: 14 },
            callback: function (value) { return formatCurrency(value); }
          }
        }
      }
    }
  });
};

document.getElementById('downloadBtn').onclick = function() {
  renderScenarios();
  updateScenarioDataFromForm();
  let maxYears = Math.max(...scenarios.map(s => parseInt(s.years) || 0));

  // Build CSV header
  let csvHeader = "Year";
  scenarios.forEach((s, idx) => {
    csvHeader += `,${s.name} Salary,${s.name} Account Value`;
  });
  csvHeader += "\n";

  // Build CSV rows
  let csvRows = "";
  for (let year = 1; year <= maxYears; year++) {
    let row = `${year}`;
    scenarios.forEach(s => {
      let baseSalary = parseFloat((s.salary || "0").replace(/,/g, ""));
      let salaryIncrease = parseFloat(s.salaryIncrease) || 0;
      let fmvPercent = (parseFloat(s.fmvPercent) || 0) / 100;
      let growth = (parseFloat(s.growth) || 0) / 100;
      let years = parseInt(s.years) || 1;
      let accountBalance = parseFloat((s.accountBalance || "0").replace(/,/g, ""));
      let currentSalary = baseSalary;

      // Calculate salary and account value for this year
      for (let y = 1; y <= year; y++) {
        if (y > 1) currentSalary = currentSalary * (1 + salaryIncrease / 100);
        let fmvBenefit = currentSalary * fmvPercent;
        accountBalance = (accountBalance + fmvBenefit) * (1 + growth);
        accountBalance = roundToNearest5(accountBalance);
      }

      // If this year is beyond the scenario's years, leave blank
      if (year > years) {
        row += ",,";
      } else {
        row += `,${Math.round(currentSalary)},${Math.round(accountBalance)}`;
      }
    });
    csvRows += row + "\n";
  }

  let csvContent = csvHeader + csvRows;

  let blob = new Blob([csvContent], { type: "text/csv" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "esop_projection.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

document.getElementById('resetBtn').onclick = function() {
  calculatePressed = false;
  scenarios = [{
    name: "Scenario 1",
    salary: "",
    salaryIncrease: "",
    accountBalance: "",
    fmvPercent: "",
    growth: "",
    years: ""
  }];
  renderScenarios();
  applyInputErrorStyles();
};

document.addEventListener('input', function(e) {
  if (
    e.target.classList.contains('salaryIncrease') ||
    e.target.classList.contains('fmvPercent') ||
    e.target.classList.contains('growth')
  ) {
    e.target.classList.remove('highlight-input');
  }
});

renderScenarios();
window.onload = () => {
  document.getElementById('resetBtn').click();
};

document.getElementById('printBtn').onclick = function() {
  window.print();
};
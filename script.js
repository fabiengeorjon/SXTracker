const feelingSlider = document.getElementById('feelingSlider');
const emojiDisplay = document.getElementById('emojiDisplay');
const feelingValueDisplay = document.getElementById('feelingValue');
const recordButton = document.getElementById('recordButton');
const recommendationList = document.getElementById('recommendationList');
const feelingChartCanvas = document.getElementById('feelingChart');
const feelingChartContext = feelingChartCanvas.getContext('2d');

const registrationSection = document.getElementById('registrationSection');
const feelingTrackerSection = document.getElementById('feelingTrackerSection');
const maleButton = document.getElementById('maleButton');
const femaleButton = document.getElementById('femaleButton');
const clearRegistrationButton = document.getElementById('clearRegistrationButton');
const nameInput = document.getElementById('nameInput');
const trackerGreeting = document.getElementById('trackerGreeting');

const registrationLogList = document.createElement('ul');
registrationLogList.id = 'registrationLog';
document.body.appendChild(registrationLogList);

const emojis = {
    '1': '😈',
    '2': '😔',
    '3': '😕',
    '4': '😶',
    '5': '😌',
    '6': '🥰',
    '7': '😍',
    '8': '🤤',
    '9': '🔥',
    '10': '💖'
};

const recommendations = {
    '1-3': [
        "Uh oh, looks like someone's having a day flatter than a pancake. Time for emergency cuddles! Go initiate a cuddle puddle, stat!",
        "Feeling like a grumpy gremlin? No worries, even gremlins deserve love! How about a gentle massage... maybe with some *extra* lotion? 😉",
        "Mood level: dial-up internet speed. Let's recharge those batteries!  Netflix and chill... but actually chill.  Maybe some whispered sweet nothings?",
        "Partner's feeling lower than a limbo champion. Time to be their personal sunshine.  Offer to run them a bath, maybe with some bubbles... and you? 😉",
        "Dangerously low vibes detected! Operation 'Boost Their Spirits' is a go! Start with their favorite comfort food and end with... well, let's just say *dessert* is on you. 😉"
    ],
    '4-6': [
        "Hmm, hovering in the 'meh' zone, are we? Let's kick this mood up a notch! Time for a playful tickle fight? Loser does the dishes!",
        "Mood's kinda like lukewarm coffee. Needs a shot of espresso... or maybe a shot of *you*? 😉  How about a fun game night to inject some playful energy?",
        "Feeling 'just okay' is NOT okay! Let's turn 'okay' into 'OH-KAY!'  Suggest a spontaneous dance-off in the living room. Winner gets bragging rights... and maybe a little something *extra*? 😉",
        "Partner's vibe is like a cloudy day. Let's bring out the sunshine! Propose a fun outing, even if it's just window shopping and holding hands like teenagers again.",
        "Mood check: 'needs improvement'. Challenge accepted!  Time to unleash your inner flirt!  Send a cheeky text, leave a playful note, and watch that mood meter rise! 😉"
    ],
    '7-10': [
        "Woohoo! Mood's higher than a kite! Time to celebrate this glorious feeling! Spontaneous make-out session?  Because why not! 🎉",
        "Feeling fantastic? Me too! Let's ride this wave of awesome!  How about recreating your first date, but this time... with more *experience*? 😉",
        "Mood's off the charts! Party time!  Let's get playful and explore something new together tonight... wink wink, nudge nudge. 😉",
        "Warning: Extreme happiness levels detected! Side effects may include excessive giggling, uncontrollable smiling, and an overwhelming urge to... well, you know.  Go with it! 😉",
        "Mood: Peak happiness! Let's make some memories to match!  Time for a sensual massage exchange... followed by whatever delightful chaos ensues! 🔥"
    ]
};

let feelingHistory = loadFeelingHistory();
let feelingChart;
let currentPartnerRole = loadPartnerRole().role;
let currentPartnerName = loadPartnerRole().name;
let selectedRoleButton = null;

const partnerColors = {
    'male': '#a78bfa',
    'female': '#66b2ff'
};

const maleSlider = document.getElementById('maleSlider');
const femaleSlider = document.getElementById('femaleSlider');
const maleEmojiDisplay = document.getElementById('maleEmojiDisplay');
const femaleEmojiDisplay = document.getElementById('femaleEmojiDisplay');
const maleValueDisplay = document.getElementById('maleValue');
const femaleValueDisplay = document.getElementById('femaleValue');
const maleRecordButton = document.getElementById('maleRecordButton');
const femaleRecordButton = document.getElementById('femaleRecordButton');
const maleRecommendations = document.getElementById('maleRecommendations');
const femaleRecommendations = document.getElementById('femaleRecommendations');

function saveRegistrationLog(action, name, role) {
    const registrationLog = loadRegistrationLog();
    registrationLog.push({
        timestamp: new Date().toLocaleString(),
        action,
        name,
        role
    });
    localStorage.setItem('registrationLog', JSON.stringify(registrationLog));
    updateRegistrationLog();
}

function loadRegistrationLog() {
    const storedLog = localStorage.getItem('registrationLog');
    return storedLog ? JSON.parse(storedLog) : [];
}

function updateRegistrationLog() {
    const log = loadRegistrationLog();
    registrationLogList.innerHTML = '<h3>Registration History</h3>';
    log.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.timestamp}: ${entry.action} - ${entry.name} (${entry.role === 'male' ? '♂' : '♀'})`;
        registrationLogList.appendChild(li);
    });
}

function updateEmojiAndValue(slider, emojiDisplay, valueDisplay) {
    if (!slider || !emojiDisplay || !valueDisplay) return;
    
    const value = slider.value;
    emojiDisplay.textContent = emojis[value];
    valueDisplay.textContent = value;
}

function getRecommendationsForMood(moodValue) {
    if (moodValue >= 1 && moodValue <= 3) {
        return recommendations['1-3'];
    } else if (moodValue >= 4 && moodValue <= 6) {
        return recommendations['4-6'];
    } else if (moodValue >= 7 && moodValue <= 10) {
        return recommendations['7-10'];
    }
    return [];
}

function displayRecommendations(moodValue, partnerRole, partnerName) {
    const recs = getRecommendationsForMood(moodValue);
    const recommendationContainer = partnerRole === 'male' ? 
        maleRecommendations : 
        femaleRecommendations;
    
    if (!recommendationContainer) return;
    
    recommendationContainer.innerHTML = '';

    if (recs.length > 0) {
        const randomIndex = Math.floor(Math.random() * recs.length);
        let selectedRecommendation = recs[randomIndex];

        selectedRecommendation = `(${partnerRole === 'male' ? '♂' : '♀'} - ${partnerName}) ` + selectedRecommendation;

        let li = document.createElement('li');
        li.textContent = selectedRecommendation;
        recommendationContainer.appendChild(li);
    } else {
        let li = document.createElement('li');
        li.textContent = "No specific recommendations found for this mood, but sending you love! ❤️";
        recommendationContainer.appendChild(li);
    }
}

function recordFeeling(role) {
    const slider = role === 'male' ? maleSlider : femaleSlider;
    const feelingValue = parseInt(slider.value);
    const today = new Date().toLocaleDateString();
    const timestamp = new Date().toISOString();
    const partnerName = role === 'male' ? maleName : femaleName;

    const todayIndex = feelingHistory.findIndex(entry => 
        entry.date === today && 
        entry.partnerRole === role
    );
    
    if (todayIndex > -1) {
        feelingHistory[todayIndex].feeling = feelingValue;
        feelingHistory[todayIndex].timestamp = timestamp;
    } else {
        feelingHistory.push({ 
            date: today, 
            feeling: feelingValue, 
            partnerRole: role,
            name: partnerName,
            timestamp: timestamp
        });
    }

    saveFeelingHistory();
    updateChart();
    displayRecommendations(feelingValue, role, partnerName);
    alert(`Feeling recorded for ${partnerName}!`);
}

function saveFeelingHistory() {
    localStorage.setItem('feelingHistory', JSON.stringify(feelingHistory));
}

function loadFeelingHistory() {
    const storedHistory = localStorage.getItem('feelingHistory');
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    
    // Ensure all entries have the required fields
    return history.map(entry => ({
        date: entry.date,
        feeling: entry.feeling,
        partnerRole: entry.partnerRole,
        name: entry.name || (entry.partnerRole === 'male' ? 'Male Partner' : 'Female Partner'),
        timestamp: entry.timestamp || new Date().toISOString()
    }));
}

function savePartnerRole(role, name) {
    localStorage.setItem('partnerRole', JSON.stringify({ role: role, name: name }));
}

function loadPartnerRole() {
    const storedPartner = localStorage.getItem('partnerRole');
    return storedPartner ? JSON.parse(storedPartner) : {};
}

function clearPartnerRole() {
    localStorage.removeItem('partnerRole');
}

function updateChart() {
    if (feelingChart) {
        feelingChart.destroy();
    }

    // Group data by partner role
    const groupedData = feelingHistory.reduce((groups, entry) => {
        const role = entry.partnerRole;
        if (!groups[role]) {
            groups[role] = [];
        }
        groups[role].push(entry);
        return groups;
    }, {});

    const datasets = [];
    const allDates = new Set();

    for (const role in groupedData) {
        if (groupedData.hasOwnProperty(role)) {
            const partnerData = groupedData[role];

            // Sort by date and time
            partnerData.sort((a, b) => {
                if (a.date === b.date) {
                    return (a.timestamp || 0) - (b.timestamp || 0);
                }
                return new Date(a.date) - new Date(b.date);
            });

            const dates = partnerData.map(entry => entry.date);
            const feelings = partnerData.map(entry => entry.feeling);
            const names = partnerData.map(entry => entry.name || role);

            dates.forEach(date => allDates.add(date));

            datasets.push({
                label: role === 'male' ? 'His Desires (♂)' : 'Her Desires (♀)',
                data: feelings,
                borderColor: partnerColors[role],
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                dates: dates,
                names: names
            });
        }
    }

    const sortedDatesArray = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));

    const dateFeelingMap = {};

    sortedDatesArray.forEach(date => {
        dateFeelingMap[date] = { 'male': null, 'female': null };
    });

    datasets.forEach(dataset => {
        dataset.dates.forEach((date, index) => {
            const role = dataset.label.includes('(♂)') ? 'male' : 'female';
            dateFeelingMap[date][role] = dataset.data[index];
        });
    });

    const chartDataMale = [];
    const chartDataFemale = [];

    sortedDatesArray.forEach(date => {
        chartDataMale.push(dateFeelingMap[date]['male']);
        chartDataFemale.push(dateFeelingMap[date]['female']);
    });

    const finalDatasets = [
        {
            label: 'His Desires (♂)',
            data: chartDataMale,
            borderColor: partnerColors['male'],
            borderWidth: 3,
            fill: false,
            tension: 0.4,
        },
        {
            label: 'Her Desires (♀)',
            data: chartDataFemale,
            borderColor: partnerColors['female'],
            borderWidth: 3,
            fill: false,
            tension: 0.4,
        }
    ];

    feelingChart = new Chart(feelingChartContext, {
        type: 'line',
        data: {
            labels: sortedDatesArray,
            datasets: finalDatasets
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Intensity of Feeling (1-10)'
                    },
                    ticks: {
                        stepSize: 1
                    },
                    grid: {
                        color: '#333'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    },
                    grid: {
                        color: '#333'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            }
        }
    });
}

function handlePartnerRegistration() {
    console.log("Registration function called");
    const maleNameInput = document.getElementById('maleNameInput').value.trim();
    const femaleNameInput = document.getElementById('femaleNameInput').value.trim();

    if (!maleNameInput || !femaleNameInput) {
        alert("Please enter names for both partners!");
        return;
    }

    maleName = maleNameInput;
    femaleName = femaleNameInput;
    
    savePartnerNames(maleName, femaleName);
    saveRegistrationLog('Registered', maleName, femaleName);
    
    if (malePartnerName) {
        malePartnerName.textContent = maleName;
    }
    if (femalePartnerName) {
        femalePartnerName.textContent = femaleName;
    }

    if (registrationSection) registrationSection.style.display = 'none';
    if (feelingTrackerSection) feelingTrackerSection.style.display = 'block';
    
    // Initialize sliders after registration
    if (maleSlider && maleEmojiDisplay && maleValueDisplay) {
        updateEmojiAndValue(maleSlider, maleEmojiDisplay, maleValueDisplay);
    }
    if (femaleSlider && femaleEmojiDisplay && femaleValueDisplay) {
        updateEmojiAndValue(femaleSlider, femaleEmojiDisplay, femaleValueDisplay);
    }
    
    updateChart();
}

function savePartnerNames(maleName, femaleName) {
    localStorage.setItem('partnerNames', JSON.stringify({ 
        maleName: maleName, 
        femaleName: femaleName 
    }));
}

function loadPartnerNames() {
    const storedNames = localStorage.getItem('partnerNames');
    return storedNames ? JSON.parse(storedNames) : {
        maleName: 'Male Partner',
        femaleName: 'Female Partner'
    };
}

maleButton.addEventListener('click', (event) => handlePartnerRegistration('male', event.target));
femaleButton.addEventListener('click', (event) => handlePartnerRegistration('female', event.target));

clearRegistrationButton.addEventListener('click', () => {
    if (currentPartnerName) {
        saveRegistrationLog('Unregistered', currentPartnerName, currentPartnerRole);
    }
    clearPartnerRole();
    currentPartnerRole = null;
    currentPartnerName = null;
    feelingTrackerSection.style.display = 'none';
    registrationSection.style.display = 'block';
    if (feelingChart) {
        feelingChart.destroy();
        feelingChart = null;
    }
    feelingHistory = [];
    saveFeelingHistory();

    if (selectedRoleButton) {
        selectedRoleButton.classList.remove('selected');
        selectedRoleButton = null;
    }
});

// Initialize event listeners for sliders
if (maleSlider) {
    maleSlider.addEventListener('input', function() {
        updateEmojiAndValue(this, maleEmojiDisplay, maleValueDisplay);
        displayRecommendations(parseInt(this.value), 'male', maleName);
    });
}

if (femaleSlider) {
    femaleSlider.addEventListener('input', function() {
        updateEmojiAndValue(this, femaleEmojiDisplay, femaleValueDisplay);
        displayRecommendations(parseInt(this.value), 'female', femaleName);
    });
}

if (maleRecordButton) {
    maleRecordButton.addEventListener('click', function() {
        recordFeeling('male');
    });
}

if (femaleRecordButton) {
    femaleRecordButton.addEventListener('click', function() {
        recordFeeling('female');
    });
}

const storedPartnerData = loadPartnerRole();
currentPartnerRole = storedPartnerData.role;
currentPartnerName = storedPartnerData.name;

if (currentPartnerRole) {
    registrationSection.style.display = 'none';
    feelingTrackerSection.style.display = 'block';
    trackerGreeting.textContent = `Hello, ${currentPartnerName}! How are you feeling today?`;
    updateEmojiAndValue(feelingSlider, emojiDisplay, feelingValueDisplay);
    displayRecommendations(feelingSlider.value, currentPartnerRole, currentPartnerName);
    updateChart();

    if (currentPartnerRole === 'male') {
        maleButton.classList.add('selected');
        selectedRoleButton = maleButton;
        femaleButton.classList.remove('selected');
    } else if (currentPartnerRole === 'female') {
        femaleButton.classList.add('selected');
        selectedRoleButton = femaleButton;
        maleButton.classList.remove('selected');
    }
} else {
    feelingTrackerSection.style.display = 'none';
    registrationSection.style.display = 'block';
}

updateRegistrationLog();

// Initialize both sliders on page load
let maleName = 'Male Partner';
let femaleName = 'Female Partner';

// Load partner names from registration or use defaults
const storedPartnerNames = loadPartnerNames();
if (storedPartnerNames.maleName) {
    maleName = storedPartnerNames.maleName;
}
if (storedPartnerNames.femaleName) {
    femaleName = storedPartnerNames.femaleName;
}

// Update the UI with partner names
document.getElementById('malePartnerName').textContent = maleName;
document.getElementById('femalePartnerName').textContent = femaleName;

// Initialize both sliders
if (maleSlider && maleEmojiDisplay && maleValueDisplay) {
    updateEmojiAndValue(maleSlider, maleEmojiDisplay, maleValueDisplay);
}

if (femaleSlider && femaleEmojiDisplay && femaleValueDisplay) {
    updateEmojiAndValue(femaleSlider, femaleEmojiDisplay, femaleValueDisplay);
}

// Update the chart with all history
updateChart();

// Initialize both sliders on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    
    // Get the register button element
    const registerButton = document.getElementById('registerButton');
    
    // Add a direct click event listener
    if (registerButton) {
        console.log("Register button found, adding event listener");
        
        registerButton.onclick = function() {
            console.log("Register button clicked");
            
            // Get input values directly
            const maleNameValue = document.getElementById('maleNameInput').value.trim();
            const femaleNameValue = document.getElementById('femaleNameInput').value.trim();
            
            console.log("Male name:", maleNameValue);
            console.log("Female name:", femaleNameValue);
            
            if (!maleNameValue || !femaleNameValue) {
                alert("Please enter names for both partners!");
                return;
            }
            
            // Set the names
            window.maleName = maleNameValue;
            window.femaleName = femaleNameValue;
            
            // Save to localStorage
            localStorage.setItem('partnerNames', JSON.stringify({
                maleName: maleNameValue,
                femaleName: femaleNameValue
            }));
            
            // Update UI
            const malePartnerName = document.getElementById('malePartnerName');
            const femalePartnerName = document.getElementById('femalePartnerName');
            
            if (malePartnerName) malePartnerName.textContent = maleNameValue;
            if (femalePartnerName) femalePartnerName.textContent = femaleNameValue;
            
            // Show/hide sections
            const registrationSection = document.getElementById('registrationSection');
            const feelingTrackerSection = document.getElementById('feelingTrackerSection');
            
            if (registrationSection) registrationSection.style.display = 'none';
            if (feelingTrackerSection) feelingTrackerSection.style.display = 'block';
            
            // Initialize sliders
            const maleSlider = document.getElementById('maleSlider');
            const femaleSlider = document.getElementById('femaleSlider');
            const maleEmojiDisplay = document.getElementById('maleEmojiDisplay');
            const femaleEmojiDisplay = document.getElementById('femaleEmojiDisplay');
            const maleValueDisplay = document.getElementById('maleValue');
            const femaleValueDisplay = document.getElementById('femaleValue');
            
            // Update emoji and values
            updateEmojiAndValue(maleSlider, maleEmojiDisplay, maleValueDisplay);
            updateEmojiAndValue(femaleSlider, femaleEmojiDisplay, femaleValueDisplay);
            
            // Update chart
            updateChart();
        };
    } else {
        console.error("Register button not found!");
    }
    
    // Rest of your initialization code...
});
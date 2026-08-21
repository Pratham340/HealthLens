const claimInput = document.getElementById("claimInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const results = document.getElementById("results");
const newClaim = document.getElementById("newClaim");

const claimText = document.getElementById("claimText");
const claimInterpretation = document.getElementById("claimInterpretation");
const strengthText = document.getElementById("strengthText");
const strengthDescription = document.getElementById("strengthDescription");
const evidenceText = document.getElementById("evidenceText");
const uncertaintyText = document.getElementById("uncertaintyText");
const reasoningSteps = document.getElementById("reasoningSteps");
const sources = document.getElementById("sources");
const questions = document.getElementById("questions");
const meterFill = document.getElementById("meterFill");

const examples = {
  turmeric: {
    match: ["turmeric", "curcumin", "inflammation"],

    interpretation:
      "The claim makes a broad causal statement that turmeric can cure or eliminate inflammation.",

    strength: "Limited / Mixed",
    meter: 42,

    strengthDescription:
      "Research exists on turmeric and curcumin, but evidence varies by outcome, formulation, dose, and study design. A broad “cure” claim goes beyond what the evidence can establish.",

    evidence:
      "Some studies have investigated curcumin and inflammatory markers. However, evidence from laboratory and clinical research does not automatically establish that turmeric cures inflammation in people.",

    uncertainty:
      "Studies differ in formulations, doses, populations, outcomes, and duration. “Inflammation” is also a broad term, so evidence for one outcome should not automatically be generalized to another.",

    reasoning: [
      "<b>1. Claim scope:</b> “Cures” implies a reliable treatment effect, which requires substantially stronger evidence than simply observing an association or change in a biomarker.",
      "<b>2. Evidence:</b> Research exists, but findings vary across studies and outcomes.",
      "<b>3. Generalization:</b> Results for a particular formulation or measured marker cannot automatically be applied to every turmeric product or every inflammatory condition.",
      "<b>4. Conclusion:</b> The evidence does not justify treating the broad claim as established fact."
    ],

    sources: [
      {
        title: "National Center for Complementary and Integrative Health",
        type: "Government health information",
        url: "https://www.nccih.nih.gov/health/turmeric"
      },
      {
        title: "PubMed — Curcumin & inflammation research",
        type: "Biomedical research database",
        url: "https://pubmed.ncbi.nlm.nih.gov/?term=curcumin+inflammation"
      }
    ],

    questions: [
      "What specific outcome is the claim referring to?",
      "What formulation and dose were studied?",
      "Were the findings from human studies or laboratory research?",
      "How consistent are the findings across independent studies?"
    ]
  },

  lemon: {
    match: ["lemon", "detox", "detoxes"],

    interpretation:
      "The claim suggests that drinking lemon water removes harmful substances from the body through a special “detox” effect.",

    strength: "Limited evidence",
    meter: 28,

    strengthDescription:
      "There is not a clear scientific basis for treating lemon water as a special detoxification treatment.",

    evidence:
      "Lemon water provides water and can contain vitamin C depending on the amount of lemon used. The body already has biological systems involved in processing and eliminating many substances.",

    uncertainty:
      "The word “detox” can mean different things. Without defining which substance, biological process, or measurable outcome is being discussed, the claim is difficult to test precisely.",

    reasoning: [
      "<b>1. Define the claim:</b> “Detox” is not a specific measurable medical outcome.",
      "<b>2. Separate components:</b> Drinking water contributes to hydration, while lemon adds flavor and some nutrients.",
      "<b>3. Test the special claim:</b> Evidence for ordinary hydration does not establish a unique detoxification effect.",
      "<b>4. Conclusion:</b> The broad detox claim is not well supported by the evidence presented."
    ],

    sources: [
      {
        title: "National Center for Complementary and Integrative Health",
        type: "Government health information",
        url: "https://www.nccih.nih.gov/health"
      },
      {
        title: "Harvard T.H. Chan School of Public Health",
        type: "Public health education",
        url: "https://www.hsph.harvard.edu/nutritionsource/"
      }
    ],

    questions: [
      "What exactly does “detox” mean in this claim?",
      "What measurable outcome would demonstrate the claimed effect?",
      "Is there controlled human research testing that specific outcome?"
    ]
  },

  vitamin: {
    match: ["vitamin c", "common cold", "cold", "prevents"],

    interpretation:
      "The claim says vitamin C can prevent people from developing the common cold.",

    strength: "Mixed / Context-dependent",
    meter: 52,

    strengthDescription:
      "Research has investigated vitamin C and the common cold, but effects depend on the population and outcome being measured.",

    evidence:
      "Research has examined whether vitamin C affects the frequency, duration, or severity of common colds. These are different questions and should not be treated as interchangeable.",

    uncertainty:
      "Results can differ between people with different baseline vitamin C intake and between prevention and treatment outcomes.",

    reasoning: [
      "<b>1. Separate outcomes:</b> Preventing a cold is different from changing its duration or severity.",
      "<b>2. Review evidence:</b> Human research has examined several of these outcomes.",
      "<b>3. Avoid overgeneralization:</b> Findings from one population may not apply equally to everyone.",
      "<b>4. Conclusion:</b> A simple “prevents colds” statement is too broad to represent all of the evidence."
    ],

    sources: [
      {
        title: "Cochrane — Vitamin C for preventing and treating the common cold",
        type: "Systematic review",
        url: "https://www.cochranelibrary.com/"
      },
      {
        title: "National Institutes of Health — Office of Dietary Supplements",
        type: "Government health information",
        url: "https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/"
      }
    ],

    questions: [
      "Is the claim about prevention, duration, or severity?",
      "What population was studied?",
      "What outcome did the study actually measure?"
    ]
  }
};

function findEvidence(claim) {
  const lower = claim.toLowerCase();

  for (const key in examples) {
    if (examples[key].match.some(word => lower.includes(word))) {
      return examples[key];
    }
  }

  return genericAnalysis(claim);
}

function genericAnalysis(claim) {
  return {
    interpretation:
      "The app identified a health-related claim, but this prototype does not have enough verified evidence to make a claim-specific conclusion.",

    strength: "Insufficient evidence",
    meter: 18,

    strengthDescription:
      "A responsible evidence assessment requires identifying the exact claim and checking appropriate sources. This demo intentionally avoids inventing evidence.",

    evidence:
      "No claim-specific evidence has been loaded into this prototype for this example.",

    uncertainty:
      "The claim may contain undefined terms, an overly broad conclusion, or assumptions that need to be separated before evidence can be evaluated.",

    reasoning: [
      "<b>1. Extract:</b> The statement was treated as a claim rather than as an established fact.",
      "<b>2. Verify:</b> Claim-specific evidence should be checked against reliable sources.",
      "<b>3. Avoid fabrication:</b> The prototype does not invent studies or citations when evidence has not been verified.",
      "<b>4. Conclusion:</b> More evidence is needed before making a meaningful assessment."
    ],

    sources: [
      {
        title: "PubMed",
        type: "Biomedical literature database",
        url: "https://pubmed.ncbi.nlm.nih.gov/"
      },
      {
        title: "National Institutes of Health",
        type: "Government health information",
        url: "https://www.nih.gov/"
      }
    ],

    questions: [
      "What exactly is the claim saying?",
      "What outcome would prove or disprove the claim?",
      "What human studies have tested this specific claim?",
      "How consistent are the results across studies?"
    ]
  };
}

function renderSources(sourceList) {
  sources.innerHTML = "";

  sourceList.forEach(source => {
    const div = document.createElement("div");
    div.className = "source";

    div.innerHTML = `
      <div class="source-info">
        <strong>${escapeHTML(source.title)}</strong>
        <span>${escapeHTML(source.type)}</span>
      </div>
      <a href="${source.url}" target="_blank" rel="noopener noreferrer">
        View source ↗
      </a>
    `;

    sources.appendChild(div);
  });
}

function renderQuestions(questionList) {
  questions.innerHTML = "";

  questionList.forEach(question => {
    const li = document.createElement("li");
    li.textContent = question;
    questions.appendChild(li);
  });
}

function renderReasoning(reasoning) {
  reasoningSteps.innerHTML = "";

  reasoning.forEach(step => {
    const div = document.createElement("div");
    div.className = "reason";
    div.innerHTML = step;
    reasoningSteps.appendChild(div);
  });
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function analyze() {
  const claim = claimInput.value.trim();

  if (!claim) {
    claimInput.focus();
    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.querySelector("span:first-child").textContent = "Analyzing...";

  setTimeout(() => {
    const data = findEvidence(claim);

    claimText.textContent = claim;
    claimInterpretation.textContent = data.interpretation;

    strengthText.textContent = data.strength;
    strengthDescription.textContent = data.strengthDescription;

    evidenceText.textContent = data.evidence;
    uncertaintyText.textContent = data.uncertainty;

    meterFill.style.width = `${data.meter}%`;

    renderReasoning(data.reasoning);
    renderSources(data.sources);
    renderQuestions(data.questions);

    results.classList.remove("hidden");

    analyzeBtn.disabled = false;
    analyzeBtn.querySelector("span:first-child").textContent = "Analyze claim";

    setTimeout(() => {
      results.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);

  }, 650);
}

analyzeBtn.addEventListener("click", analyze);

claimInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    analyze();
  }
});

document.querySelectorAll(".examples button").forEach(button => {
  button.addEventListener("click", () => {
    claimInput.value = button.dataset.claim;
    claimInput.focus();
  });
});

newClaim.addEventListener("click", () => {
  results.classList.add("hidden");
  claimInput.value = "";
  claimInput.focus();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

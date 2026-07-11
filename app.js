(function () {
  "use strict";

  const missions = window.DOTNET_QUEST_MISSIONS || [];
  const sources = window.DOTNET_QUEST_SOURCES || [];
  const storeKey = "dotnet10QuestState:v1";

  const rankOrder = ["Cero", "Base", "Intermedio", "Avanzado", "Experto"];
  const rankBadges = {
    Cero: "Aprendiz",
    Base: "Constructor",
    Intermedio: "Backend",
    Avanzado: "Arquitecto",
    Experto: "Principal"
  };

  const els = {
    xpValue: document.getElementById("xpValue"),
    streakValue: document.getElementById("streakValue"),
    missionValue: document.getElementById("missionValue"),
    rankTitle: document.getElementById("rankTitle"),
    progressFill: document.getElementById("progressFill"),
    missionTrack: document.getElementById("missionTrack"),
    missionArea: document.getElementById("missionArea"),
    missionTitle: document.getElementById("missionTitle"),
    missionKind: document.getElementById("missionKind"),
    missionPrompt: document.getElementById("missionPrompt"),
    missionCode: document.getElementById("missionCode"),
    answerZone: document.getElementById("answerZone"),
    orderTray: document.getElementById("orderTray"),
    orderSequence: document.getElementById("orderSequence"),
    clearButton: document.getElementById("clearButton"),
    submitButton: document.getElementById("submitButton"),
    nextButton: document.getElementById("nextButton"),
    feedbackBox: document.getElementById("feedbackBox"),
    resetButton: document.getElementById("resetButton"),
    sourcesList: document.getElementById("sourcesList")
  };

  const transient = {
    selectedChoice: null,
    selectedMulti: new Set(),
    selectedOrder: [],
    lastResult: null
  };

  let state = loadState();

  function loadState() {
    const fallback = {
      current: 0,
      unlocked: 0,
      xp: 0,
      streak: 0,
      completed: {}
    };

    try {
      const saved = JSON.parse(localStorage.getItem(storeKey));
      if (!saved || typeof saved !== "object") {
        return fallback;
      }

      return {
        ...fallback,
        ...saved,
        completed: saved.completed && typeof saved.completed === "object" ? saved.completed : {}
      };
    } catch (error) {
      return fallback;
    }
  }

  function saveState() {
    localStorage.setItem(storeKey, JSON.stringify(state));
  }

  function currentMission() {
    return missions[state.current] || missions[0];
  }

  function completedCount() {
    return Object.keys(state.completed).length;
  }

  function currentRank() {
    const mission = currentMission();
    return mission ? mission.rank : "Cero";
  }

  function rankProgress() {
    if (!missions.length) {
      return 0;
    }

    return Math.round((completedCount() / missions.length) * 100);
  }

  function resetTransient() {
    transient.selectedChoice = null;
    transient.selectedMulti = new Set();
    transient.selectedOrder = [];
    transient.lastResult = null;
  }

  function setCurrent(index) {
    const target = Math.max(0, Math.min(index, missions.length - 1));
    if (target > state.unlocked) {
      return;
    }

    state.current = target;
    saveState();
    resetTransient();
    render();
    showTab("challengePanel");
  }

  function render() {
    renderStats();
    renderTrack();
    renderChallenge();
    renderSources();
  }

  function renderStats() {
    const rank = currentRank();
    els.xpValue.textContent = String(state.xp);
    els.streakValue.textContent = String(state.streak);
    els.missionValue.textContent = `${completedCount()}/${missions.length}`;
    els.rankTitle.textContent = `${rankBadges[rank] || "Jugador"} · ${rank}`;
    els.progressFill.style.width = `${rankProgress()}%`;
  }

  function renderTrack() {
    els.missionTrack.replaceChildren();
    let lastRank = "";

    missions.forEach((mission, index) => {
      if (mission.rank !== lastRank) {
        lastRank = mission.rank;
        const divider = document.createElement("div");
        divider.className = "rank-divider";
        divider.textContent = mission.rank;
        els.missionTrack.appendChild(divider);
      }

      const node = document.createElement("button");
      node.type = "button";
      node.className = "mission-node";
      node.dataset.status = nodeStatus(mission, index);
      node.disabled = index > state.unlocked;
      node.setAttribute("aria-label", `${mission.title}, ${nodeStatusLabel(index, mission.id)}`);
      node.innerHTML = `
        <span class="node-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="node-main">
          <strong>${escapeHtml(mission.title)}</strong>
          <small>${escapeHtml(mission.area)}</small>
        </span>
        <span class="node-xp">${mission.xp} XP</span>
      `;
      node.addEventListener("click", () => setCurrent(index));
      els.missionTrack.appendChild(node);
    });
  }

  function nodeStatus(mission, index) {
    if (state.completed[mission.id]) {
      return "done";
    }
    if (index === state.current) {
      return "current";
    }
    if (index <= state.unlocked) {
      return "open";
    }
    return "locked";
  }

  function nodeStatusLabel(index, id) {
    if (state.completed[id]) {
      return "completada";
    }
    if (index === state.current) {
      return "actual";
    }
    if (index <= state.unlocked) {
      return "desbloqueada";
    }
    return "bloqueada";
  }

  function renderChallenge() {
    const mission = currentMission();
    if (!mission) {
      els.missionTitle.textContent = "Sin misiones";
      return;
    }

    els.missionArea.textContent = `${mission.rank} · ${mission.area}`;
    els.missionTitle.textContent = mission.title;
    els.missionKind.textContent = kindLabel(mission.kind);
    els.missionPrompt.textContent = mission.prompt;

    if (mission.code) {
      els.missionCode.hidden = false;
      els.missionCode.querySelector("code").textContent = mission.code;
    } else {
      els.missionCode.hidden = true;
    }

    renderChallengeActions(mission);
    els.orderTray.hidden = mission.kind !== "order";
    renderAnswers(mission);
    renderFeedback(mission);
  }

  function renderChallengeActions(mission) {
    const answeredCorrectly = Boolean(transient.lastResult?.ok);
    const canMoveForward = state.current < missions.length - 1 && state.current < state.unlocked;

    els.clearButton.hidden = mission.kind === "choice" || answeredCorrectly;
    els.submitButton.hidden = answeredCorrectly;
    els.nextButton.hidden = !answeredCorrectly;
    els.nextButton.textContent = canMoveForward ? "Siguiente" : "Ver ruta";
  }

  function kindLabel(kind) {
    return {
      choice: "Elige",
      multi: "Multi",
      order: "Ordena"
    }[kind] || "Reto";
  }

  function renderAnswers(mission) {
    els.answerZone.replaceChildren();

    mission.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-button";
      button.dataset.index = String(index);
      button.innerHTML = `<span>${escapeHtml(option)}</span>`;
      button.disabled = Boolean(transient.lastResult?.ok);

      if (mission.kind === "choice" && transient.selectedChoice === index) {
        button.classList.add("is-selected");
      }

      if (mission.kind === "multi" && transient.selectedMulti.has(index)) {
        button.classList.add("is-selected");
      }

      if (mission.kind === "order" && transient.selectedOrder.includes(index)) {
        button.classList.add("is-used");
        const order = transient.selectedOrder.indexOf(index) + 1;
        button.innerHTML = `<b>${order}</b><span>${escapeHtml(option)}</span>`;
      }

      button.addEventListener("click", () => selectAnswer(mission, index));
      els.answerZone.appendChild(button);
    });

    renderOrderSequence(mission);
  }

  function renderOrderSequence(mission) {
    els.orderSequence.replaceChildren();
    if (mission.kind !== "order") {
      return;
    }

    if (!transient.selectedOrder.length) {
      const empty = document.createElement("span");
      empty.className = "order-empty";
      empty.textContent = "Pendiente";
      els.orderSequence.appendChild(empty);
      return;
    }

    transient.selectedOrder.forEach((index, position) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "order-chip";
      chip.textContent = `${position + 1}. ${mission.options[index]}`;
      chip.addEventListener("click", () => {
        transient.selectedOrder = transient.selectedOrder.filter((item) => item !== index);
        transient.lastResult = null;
        renderChallenge();
      });
      els.orderSequence.appendChild(chip);
    });
  }

  function selectAnswer(mission, index) {
    transient.lastResult = null;

    if (mission.kind === "choice") {
      transient.selectedChoice = index;
    }

    if (mission.kind === "multi") {
      if (transient.selectedMulti.has(index)) {
        transient.selectedMulti.delete(index);
      } else {
        transient.selectedMulti.add(index);
      }
    }

    if (mission.kind === "order" && !transient.selectedOrder.includes(index)) {
      transient.selectedOrder.push(index);
    }

    renderChallenge();
  }

  function renderFeedback(mission) {
    if (!transient.lastResult) {
      els.feedbackBox.hidden = true;
      els.feedbackBox.textContent = "";
      return;
    }

    els.feedbackBox.hidden = false;
    els.feedbackBox.className = `feedback ${transient.lastResult.ok ? "is-ok" : "is-bad"}`;
    els.feedbackBox.innerHTML = `
      <strong>${transient.lastResult.ok ? "Correcto" : "Todavía no"}</strong>
      <span>${escapeHtml(transient.lastResult.message)}</span>
      <a href="${mission.source}" target="_blank" rel="noreferrer">Fuente oficial</a>
    `;
  }

  function submitAnswer() {
    const mission = currentMission();
    if (!mission) {
      return;
    }

    const ok = isCorrect(mission);
    if (ok) {
      completeMission(mission);
      transient.lastResult = {
        ok: true,
        message: `${mission.explanation} Has ganado ${mission.xp} XP.`
      };
    } else {
      state.streak = 0;
      saveState();
      transient.lastResult = {
        ok: false,
        message: `${selectionHint(mission)} ${mission.explanation}`
      };
    }

    render();
  }

  function isCorrect(mission) {
    if (mission.kind === "choice") {
      return transient.selectedChoice === mission.answer;
    }

    if (mission.kind === "multi") {
      return sameSet([...transient.selectedMulti], mission.answer);
    }

    if (mission.kind === "order") {
      return sameArray(transient.selectedOrder, mission.answer);
    }

    return false;
  }

  function selectionHint(mission) {
    if (mission.kind === "choice" && transient.selectedChoice === null) {
      return "Elige una opción antes de comprobar.";
    }

    if (mission.kind === "multi" && transient.selectedMulti.size === 0) {
      return "Marca todas las respuestas que encajan.";
    }

    if (mission.kind === "order" && transient.selectedOrder.length !== mission.answer.length) {
      return "Completa la secuencia tocando todas las piezas necesarias.";
    }

    return "Revisa la pista y prueba otra vez.";
  }

  function completeMission(mission) {
    const alreadyDone = Boolean(state.completed[mission.id]);
    state.completed[mission.id] = {
      at: new Date().toISOString(),
      xp: mission.xp
    };

    if (!alreadyDone) {
      state.xp += mission.xp;
      state.streak += 1;
      state.unlocked = Math.min(Math.max(state.unlocked, state.current + 1), missions.length - 1);
    }

    saveState();
  }

  function sameSet(left, right) {
    if (left.length !== right.length) {
      return false;
    }

    const normalized = new Set(left);
    return right.every((item) => normalized.has(item));
  }

  function sameArray(left, right) {
    if (left.length !== right.length) {
      return false;
    }

    return left.every((item, index) => item === right[index]);
  }

  function clearAnswer() {
    transient.selectedChoice = null;
    transient.selectedMulti = new Set();
    transient.selectedOrder = [];
    transient.lastResult = null;
    renderChallenge();
  }

  function goNext() {
    if (state.current < missions.length - 1 && state.current < state.unlocked) {
      setCurrent(state.current + 1);
      return;
    }

    resetTransient();
    render();
    showTab("routePanel");
  }

  function resetGame() {
    const confirmed = window.confirm("¿Reiniciar todo el progreso de .NET 10 Quest?");
    if (!confirmed) {
      return;
    }

    state = {
      current: 0,
      unlocked: 0,
      xp: 0,
      streak: 0,
      completed: {}
    };
    resetTransient();
    saveState();
    render();
    showTab("routePanel");
  }

  function renderSources() {
    if (els.sourcesList.childElementCount) {
      return;
    }

    sources.forEach((source) => {
      const item = document.createElement("li");
      item.innerHTML = `<a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.label)}</a>`;
      els.sourcesList.appendChild(item);
    });
  }

  function showTab(targetId) {
    document.querySelectorAll(".game-board, .challenge-panel, .sources-panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === targetId);
    });

    document.querySelectorAll(".nav-button").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === targetId);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function bindEvents() {
    els.submitButton.addEventListener("click", submitAnswer);
    els.nextButton.addEventListener("click", goNext);
    els.clearButton.addEventListener("click", clearAnswer);
    els.resetButton.addEventListener("click", resetGame);

    document.querySelectorAll(".nav-button").forEach((button) => {
      button.addEventListener("click", () => showTab(button.dataset.tab));
    });
  }

  bindEvents();
  render();
  showTab("routePanel");
})();

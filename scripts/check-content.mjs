import fs from "node:fs";
import vm from "node:vm";

const contentSource = fs.readFileSync(new URL("../content.js", import.meta.url), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(contentSource, context);

const missions = context.window.DOTNET_QUEST_MISSIONS;
const sources = context.window.DOTNET_QUEST_SOURCES;
const errors = [];

if (!Array.isArray(missions) || missions.length < 24) {
  errors.push("Expected at least 24 missions.");
}

if (!Array.isArray(sources) || sources.length < 6) {
  errors.push("Expected official source list.");
}

const ids = new Set();
const ranks = new Set();
const allowedKinds = new Set(["choice", "multi", "order"]);

for (const [index, mission] of missions.entries()) {
  if (!mission.id || ids.has(mission.id)) {
    errors.push(`Mission ${index + 1} has missing or duplicate id.`);
  }
  ids.add(mission.id);
  ranks.add(mission.rank);

  for (const field of ["rank", "area", "title", "prompt", "explanation", "source"]) {
    if (!mission[field] || typeof mission[field] !== "string") {
      errors.push(`${mission.id} missing ${field}.`);
    }
  }

  if (!allowedKinds.has(mission.kind)) {
    errors.push(`${mission.id} has invalid kind.`);
  }

  if (!Array.isArray(mission.options) || mission.options.length < 3) {
    errors.push(`${mission.id} needs at least three options.`);
  }

  if (!Number.isInteger(mission.xp) || mission.xp <= 0) {
    errors.push(`${mission.id} has invalid xp.`);
  }

  if (!/^https:\/\/learn\.microsoft\.com\//.test(mission.source)) {
    errors.push(`${mission.id} source must be Microsoft Learn.`);
  }

  if (mission.kind === "choice" && !Number.isInteger(mission.answer)) {
    errors.push(`${mission.id} choice answer must be an index.`);
  }

  if ((mission.kind === "multi" || mission.kind === "order") && !Array.isArray(mission.answer)) {
    errors.push(`${mission.id} ${mission.kind} answer must be an array.`);
  }
}

for (const rank of ["Cero", "Base", "Intermedio", "Avanzado", "Experto"]) {
  if (!ranks.has(rank)) {
    errors.push(`Missing rank ${rank}.`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Content OK: ${missions.length} missions, ${sources.length} sources.`);

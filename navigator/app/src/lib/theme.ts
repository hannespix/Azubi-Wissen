// Erscheinungsbild: hell/dunkel/system + Schriftgröße, lokal gespeichert.
export type Thema = "hell" | "dunkel" | "system";
export type Schriftgrad = "s" | "m" | "l";

const GRADE: Record<Schriftgrad, string> = { s: "15px", m: "16px", l: "18px" };

export function themaLesen(): Thema {
  return (localStorage.getItem("fn.thema") as Thema) || "system";
}
export function schriftgradLesen(): Schriftgrad {
  return (localStorage.getItem("fn.schrift") as Schriftgrad) || "m";
}

export function anwenden(thema = themaLesen(), grad = schriftgradLesen()) {
  const dunkel =
    thema === "dunkel" ||
    (thema === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dunkel);
  document.documentElement.style.setProperty("--schriftgrad", GRADE[grad]);
}

export function themaSetzen(t: Thema) {
  localStorage.setItem("fn.thema", t);
  anwenden();
}
export function schriftgradSetzen(g: Schriftgrad) {
  localStorage.setItem("fn.schrift", g);
  anwenden();
}

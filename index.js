const { fork } = require("child_process");

function waitFor(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

const instances = process.env.INSTANCIAS || 3;

(async function main() {
  fork("./worker.js");
  console.log("Iniciada INSTANCIA(1)");
  for (let i = 0; i < instances - 1; i++) {
    await waitFor(5000);
    fork("./worker.js");
    console.log(`Iniciada INSTANCIA(${i + 2})`);
  }
})();

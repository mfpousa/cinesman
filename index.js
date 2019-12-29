const { fork } = require("child_process");

function waitFor(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

const instances = process.env.INSTANCES || 1;

(async function main() {
  fork("./worker.js");
  for (let i = 0; i < instances - 1; i++) {
    await waitFor(5000);
    fork("./worker.js");
  }
})();

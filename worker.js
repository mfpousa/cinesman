const {
  openBrowser,
  closeBrowser,
  goto,
  click,
  near,
  below,
  $,
  waitFor,
  closeTab,
  setConfig,
  text,
  setViewPort
} = require("taiko");

const seatsToReserve = process.env.ASIENTOS || 9;
const movieTitle = process.env.PELICULA || "Star Wars: Episodio IX - El Ascenso de Skywalker";
const roomType = process.env.TIPO_DE_SALA || "VOSE";
const reservationDate = process.env.FECHA || "30/12";
const reservationTime = process.env.HORA || "21:20";

async function hack() {
  while (true) {
    await goto("https://www.cinesa.es/cines/as-cancelas");
    await click($('//article[@class="seleccionardia"]/div/div'));
    await click(reservationDate);
    await click(reservationTime, below(movieTitle), near(roomType));
    await click("Continuar y crear cuenta después");

    await waitFor(1000);
    await click($('//*[@id="accordion"]/div[1]/div/div[1]'), { clickCount: seatsToReserve });
    await click("Elegir butacas");

    const roomFull = await text("Lo sentimos, ya no quedan butacas").exists();
    if (roomFull) {
      console.log("The room is full");
    } else {
      const emptySeats = (await $(".butaca_2.disponible").elements()).length;
      const occupiedSeats = (await $(".butaca_5").elements()).length;
      console.log(
        `[${emptySeats}] out of [${emptySeats + seatsToReserve + occupiedSeats}] seats left`
      );
      if (emptySeats === 0) {
        await click("Atrás");
      }
    }
    await closeTab();
  }
}

async function recursiveStart() {
  try {
    await openBrowser({ headless: true });
    await setViewPort({ height: 10000, width: 0 });
    await hack();
  } catch (e) {
    await closeBrowser();
    return await recursiveStart();
  }
}

(async function main() {
  setConfig({ observeTime: 0 });
  await recursiveStart();
})();

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

const seatsToReserve = Number.parseInt(process.env.ASIENTOS) || 9;
const movieTitle = process.env.PELICULA || "Star Wars: Episodio IX - El Ascenso de Skywalker";
const roomType = process.env.TIPO_DE_SALA || "VOSE";
const reservationDate = process.env.FECHA || "30/12";
const reservationTime = process.env.HORA || "21:20";

async function hack() {
  while (true) {
    await goto("https://www.cinesa.es/cines/as-cancelas");
    await setReservationDate();
    await click(reservationTime, below(movieTitle), near(roomType));
    await click("Continuar y crear cuenta después");

    await waitFor(1000);
    await setSeatsNumber(seatsToReserve);
    await click("Elegir butacas");

    const roomFull = await text("Lo sentimos, ya no quedan butacas").exists();
    if (roomFull) {
      console.log("La sala está llena. Esperando a que caduquen las butacas bloqueadas");
    } else {
      let emptySeats = await getEmptySeats();
      await click("Atrás");
      if (emptySeats > 0) {
        await setSeatsNumber(Math.min(emptySeats, 8));
        await click("Elegir butacas");
      }
      await logEmptySeats(seatsToReserve);
    }
    await closeTab();
  }
}

async function logEmptySeats() {
  const occupiedSeats = await getOccupiedSeats();
  const emptySeats = await getEmptySeats();
  const selectedSeats = await getSelectedSeats();
  console.log(`[${emptySeats}] butacas libres de [${emptySeats + selectedSeats + occupiedSeats}]`);
}

async function setReservationDate() {
  await click($('//article[@class="seleccionardia"]/div/div'));
  await click(reservationDate);
}

async function setSeatsNumber(number) {
  await click($('//*[@id="accordion"]/div[1]/div/div[1]'), { clickCount: number });
}

async function getEmptySeats() {
  return (await $(".butaca_2.disponible").elements()).length;
}

async function getOccupiedSeats() {
  return (await $(".butaca_5").elements()).length;
}

async function getSelectedSeats() {
  return (await $(".butaca_1.disponible").elements()).length;
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

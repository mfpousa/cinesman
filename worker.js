const puppeteer = require("puppeteer");
const moment = require("moment");

const movieTitle = process.env.PELICULA || "Star Wars: Episodio IX - El Ascenso de Skywalker";
const roomType = process.env.TIPO_DE_SALA || "VOSE";
const reservationDate = process.env.FECHA || "30/12";
const reservationTime = process.env.HORA || "21:20";

let browser, page;

async function hack() {
  while (true) {
    await switchPage(0, { wait: false });
    await page.goto("https://www.cinesa.es/cines/as-cancelas");
    await setReservationDate();
    await setReservationTime();

    await switchPage(1);
    await clickText("Continuar y crear cuenta después");

    await waitFor(1000);
    await increaseSeatsNumber(9);
    await clickText("Elegir butacas");

    await logEmptySeats();
    await waitFor(1000);
    await page.close();
  }
}

async function switchPage(index, options = {}) {
  const { wait = true } = options;
  await waitFor(2000);
  const pages = await browser.pages();
  if (pages[index] == null) {
    throw "No page at index " + index;
  }
  page = pages[index];
  if (wait) {
    await Promise.race([new Promise(resolve => page.on("load", resolve)), waitFor(5000)]);
  }
}

function waitFor(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

async function clickXPath(xPath, options = {}) {
  const { clickCount = 1 } = options;
  const elements = await page.$x(xPath);
  if (elements.length > 0) {
    let success = false;
    for (let index = 0; index < elements.length; index++) {
      try {
        for (let i = clickCount; i > 0; i--) {
          await elements[index].click();
        }
        success = true;
        break;
      } catch (e) {
        continue;
      }
    }
    if (!success) {
      throw "Could not click on element with xpath " + xPath;
    }
  } else {
    throw new Error("Element not found for " + xPath);
  }
}

async function clickText(text, options) {
  await clickXPath(`//*[contains(text(), '${text}') or contains(@value, '${text}')]`, options);
}

async function logEmptySeats() {
  await Promise.race([
    page.waitForSelector(".butaca_5"),
    page.waitForSelector(".butaca_2"),
    page.waitForSelector(".butaca_1")
  ]);
  const occupiedSeats = await getOccupiedSeats();
  const emptySeats = await getEmptySeats();
  const selectedSeats = await getSelectedSeats();
  console.log(
    `[${emptySeats + selectedSeats}] butacas libres de [${emptySeats +
      selectedSeats +
      occupiedSeats}]`
  );
}

async function setReservationDate() {
  await clickXPath('//article[@class="seleccionardia"]/div/div');
  await clickText(reservationDate, { last: true });
}

async function setReservationTime() {
  const [day, month] = reservationDate.split("/");
  const date = moment()
    .month(Number.parseInt(month) - 1)
    .date(day)
    .format("YYYY-MM-DD");
  await clickXPath(
    `//*[@data-dia="${date}"][.//*[contains(text(), "${movieTitle}")]]//*[@class="lista_horarios"][.//*[contains(text(), "${roomType}")]]//*[text()="${reservationTime}"]`
  );
}

async function increaseSeatsNumber(number) {
  await clickXPath('//*[@id="accordion"]/div[1]/div/div[1]', { clickCount: number });
}

async function getEmptySeats() {
  return (await page.$$(".butaca_2.disponible")).length;
}

async function getOccupiedSeats() {
  return (await page.$$(".butaca_5")).length;
}

async function getSelectedSeats() {
  return (await page.$$(".butaca_1.disponible")).length;
}

async function recursiveStart() {
  try {
    browser = await puppeteer.launch({ headless: true });
    await hack();
  } catch (e) {
    // console.error(e);
    await browser.close();
    return await recursiveStart();
  }
}

(async function main() {
  await recursiveStart();
})();

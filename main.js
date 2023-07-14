function findHouse(
  // https://trouverunlogement.lescrous.fr/tools/31/search
  place = "nantes",
  placeOption = "École Polytechnique de l'Université de Nantes, Nantes"
) {
  const SEARCH_INTERVAL = 10 * 60 * 1000;
  var testNumber = 1;

  var searchElement = document.querySelectorAll("input")[1];

  if (!searchElement) {
    console.log("Undefined search element");
    return;
  }

  const search = () => {
    console.group(`Test No: ${testNumber}`);
    // console.log(`Test No: ${testNumber}`);
    testNumber++;

    // search place
    searchElement.focus();
    searchElement.value = place;

    // activate handle
    searchElement.dispatchEvent(new Event("input", { bubbles: true }));

    // request permission for notification
    if (Notification.permission == "default") {
      Notification.requestPermission();
    }

    // wait 30 seconds for the list of place options appear
    setTimeout(() => {
      // search place option and click on it to run search command
      var listItems = document.querySelectorAll("li");

      for (var i = 0; i < listItems.length; i++) {
        if (listItems[i].textContent === placeOption) {
          listItems[i].click();
          console.log(placeOption + " clicked");
          break;
        }
      }

      // wait 60 seconds for the list of result appears
      setTimeout(() => {
        var ulElement = document.querySelector("ul.fr-grid-row--gutters");
        if (!ulElement) {
          console.log("Undefined uiElement for result");
          return;
        }

        var listItems = ulElement.querySelectorAll(
          "li.fr-col-12.fr-col-sm-6.fr-col-md-4.fr-col-lg-4"
        );
        var listItemsNumber = listItems.length;
        console.log("Found: " + listItemsNumber + " element(s)");
        save({ houseNumber: listItemsNumber, testNumber: testNumber - 1 });

        // show notification if there is elements
        if (listItemsNumber > 0) {
          if (Notification.permission == "denied") {
            console.log("Notification denied");
            return;
          }

          var notification = new Notification("Good News to you !", {
            body: `${listItemsNumber} house(s) found in ${placeOption}.`,
          });

          notification.onclick = function () {
            window.focus();
          };
        }
      }, 30 * 1000);
    }, 10 * 1000);

    console.groupEnd();
  };

  const save = ({
    keyName = "searchResult",
    date = new Date(),
    houseNumber = 0,
    testNumber = 0,
  }) => {
    const existingData = localStorage.getItem(keyName) || '[]';
    const parsedData = JSON.parse(existingData);
    const newData = [
      ...parsedData,
      {
        date: date.toUTCString(),
        status: `${houseNumber > 0 ? "✅" : "🔴"}`,
        houseNumber,
        testNumber,
      },
    ];
    const newDataString = JSON.stringify(newData);
    localStorage.setItem(keyName, newDataString);
  };

  // launch the first time
  search();

  // find a house every SEARCH_INTERVAL milliseconds
  setInterval(search, SEARCH_INTERVAL);
}

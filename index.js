// 각각의 식물에 클릭 이벤트 등록
(async function () {
  function addEventToPlants(plantId, plantName) {
    const plants = document.getElementById(plantId);

    if (!plants) return;

    Array.from(plants.children).forEach((plant) => {
      plant.style.fill = "transparent";

      plant.addEventListener("click", (event) => {
        event.stopPropagation();

        const details = document.getElementById("details");
        const closeButton = details.getElementsByTagName("svg")[0];

        closeButton.addEventListener("click", closeDetailPopup);

        function closeDetailPopup() {
          details.classList.remove("on");
          details.classList.add("off");
        }

        closeDetailPopup();

        setTimeout(function () {
          details.style.top = `${event.offsetY}px`;
          details.style.left = `${event.offsetX}px`;

          const { koreanName, scientificName, description } = plantTextData[
            plantId
          ];
          details.children[0].innerHTML = `
            <div>${koreanName}</div>
            <div>${scientificName}</div>
            <img src="/public/images/flowers/${scientificName}.png"></img>
            <div>${description}</div>
          `;

          details.classList.remove("off");
          details.classList.add("on");
        }, 100);
      });
    });
  }

  async function getPlantTextData() {
    const response = await fetch("/public/data/flower-info.json");

    const result = await response.json();

    const flowerList = {};

    result.forEach((item) => {
      let { scientificName, className, ...rest } = item;

      const replaceChars = {
        "+": "x002B",
        " ": "_",
      };

      className = className.replace(/\+|\s/g, (m) => replaceChars[m]);

      const replaceChars2 = {
        "'": "_",
        " ": "-",
      };

      scientificName = scientificName.replace(/'|\s/g, (m) => replaceChars2[m]);

      flowerList[className] = {
        scientificName,
        ...rest,
      };
    });

    return flowerList;
  }

  const plantTextData = await getPlantTextData();

  console.log(plantTextData);

  const plantBundles = Array.from(document.getElementsByTagName("g"));

  plantBundles.forEach((bundle, index) => {
    addEventToPlants(bundle.id, index);
  });
})();

// 마우스로 전체 문서 드래그 드롭 가능
(function () {
  const container = document.getElementsByClassName("container")[0];

  document.addEventListener("mousedown", (e) => {
    const originalMouseX = e.clientX;
    const originalMouseY = e.clientY;

    const originalTopPosition = Number(container.style.top.split("px")[0]);
    const originalLeftPosition = Number(container.style.left.split("px")[0]);

    const mouseMoveEvent = _.throttle((e) => {
      e.preventDefault();

      container.style.cursor = "move";

      const movedMouseX = originalMouseX - e.clientX;
      let movedMouseY = originalMouseY - e.clientY;

      container.style.top = `${-movedMouseY + originalTopPosition}px`;
      container.style.left = `${-movedMouseX + originalLeftPosition}px`;
    }, 10);

    document.addEventListener("mousemove", mouseMoveEvent);

    document.addEventListener("mouseup", (e) => {
      const container = document.getElementsByClassName("container")[0];

      container.style.cursor = "default";
      document.removeEventListener("mousemove", mouseMoveEvent);
    });
  });
})();

// 확대 - 축소, comeback to original position
(function () {
  let currentScale = 1;

  const zoomInButton = document.getElementById("zoom-in");
  const zoomOutButton = document.getElementById("zoom-out");
  const comebackButton = document.getElementById("original-position");

  zoomInButton.addEventListener("click", (e) => {
    e.stopPropagation();
    const container = document.getElementsByClassName("container")[0];

    const currentLeft = Number(container.style.left.split("px")[0]);
    const currentTop = Number(container.style.top.split("px")[0]);

    currentScale += 0.5;

    container.style.left = `${currentLeft}px`;
    container.style.top = `${currentTop}px`;
    container.style.transform = `scale(${currentScale})`;
  });

  zoomOutButton.addEventListener("click", (e) => {
    e.stopPropagation();

    const container = document.getElementsByClassName("container")[0];

    const currentTop = Number(container.style.top.split("px")[0]);
    const currentLeft = Number(container.style.left.split("px")[0]);

    currentScale -= 0.5;

    container.style.left = `${currentLeft}px`;
    container.style.top = `${currentTop}px`;
    container.style.transform = `scale(${
      currentScale <= 1 ? (currentScale = 1) : currentScale
    })`;
  });

  comebackButton.addEventListener("click", (e) => {
    e.stopPropagation();
    const container = document.getElementsByClassName("container")[0];

    container.style.transform = `scale(${(currentScale = 1)})`;
    container.style.top = "0px";
    container.style.left = "0px";
  });
})();

let isDetailOpened = false;
let isMoved = false;

// Popup and close details when a plant is clicked
(async function () {
  function addEventToPlants(plantId) {
    const plants = document.getElementById(plantId);

    if (!plants) return;

    Array.from(plants.children).forEach((plant) => {
      plant.style.fill = "transparent"; // CSS에서 하면 안되나?

      plant.addEventListener("mousedown", (event) => {
        event.stopPropagation();

        const details = document.getElementById("details");
        const closeButton = details.getElementsByTagName("svg")[0];

        if (isDetailOpened) {
          closeDetailPopup();
          return;
        }

        details.addEventListener("mousedown", (e) => {
          e.stopPropagation();
        });

        closeButton.addEventListener("click", closeDetailPopup);

        function closeDetailPopup() {
          details.classList.remove("on");
          details.classList.add("off");
          isDetailOpened = false;
        }

        setTimeout(() => {
          const { koreanName, scientificName, description } = plantTextData[
            plantId
          ];

          details.children[0].innerHTML = `
            <img src="/public/images/flowers/${scientificName}.png"></img>
            <div class="header">
              ${koreanName}
              <br/>
              ${scientificName}
            </div>
            <hr>
            <div class="desc">
              ${description}
            </div>
          `;

          details.style.visibility = "hidden";
          details.classList.remove("off");
          details.classList.add("on");
          isDetailOpened = true;

          setTimeout(() => {
            details.style.top = `${event.clientY}px`;
            details.style.left = `${event.clientX}px`;

            // 마우스가 클릭된 곳을 기준으로 팝업의 position 설정
            // 1) 팝업이 뷰포트를 넘어갔는지 아닌지 계산해서 알아낸다
            const isPopupCrossedBottomEnd =
              details.offsetTop + details.offsetHeight > window.innerHeight;
            const isPopupCrossedRightEnd =
              details.offsetLeft + details.offsetWidth > window.innerWidth;

            // 2) 넘어갔다면 넘어가지 않도록 position을 변경시킨다 (넘어간 선이 상하좌우 어디에 걸치는지에 따라 기준점을 기준으로 위치 변경)
            if (isPopupCrossedBottomEnd) {
              details.style.top = `${
                details.offsetTop -
                (details.offsetTop + details.offsetHeight - window.innerHeight)
              }px`;
            }

            if (isPopupCrossedRightEnd) {
              details.style.left = `${
                details.offsetLeft -
                (details.offsetLeft + details.offsetWidth - window.innerWidth)
              }px`;
            }

            details.style.visibility = "visible";
          }, 10);
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

// 드래그 - 드롭
(function () {
  const container = document.getElementsByClassName("container")[0];

  document.addEventListener("mousedown", (e) => {
    if (isDetailOpened) {
      closeDetailPopup();
      // return;
    }

    const originalMouseX = e.clientX;
    const originalMouseY = e.clientY;

    const originalTopPosition = Number(container.style.top.split("px")[0]);
    const originalLeftPosition = Number(container.style.left.split("px")[0]);

    const mouseMoveEvent = (e) => {
      e.preventDefault();

      container.style.cursor = "move";
      isMoved = true;

      const movedMouseX = originalMouseX - e.clientX;
      let movedMouseY = originalMouseY - e.clientY;

      container.style.top = `${-movedMouseY + originalTopPosition}px`;
      container.style.left = `${-movedMouseX + originalLeftPosition}px`;
    };

    document.addEventListener("mousemove", mouseMoveEvent);

    document.addEventListener("mouseup", (e) => {
      const container = document.getElementsByClassName("container")[0];

      if (isMoved) {
        window.addEventListener("click", captureClick, true);
      }

      container.style.cursor = "default";
      isMoved = false;

      function captureClick(e) {
        e.stopPropagation();

        window.removeEventListener("click", captureClick, true);
      }

      document.removeEventListener("mousemove", mouseMoveEvent);
    });
  });
})();

function closeDetailPopup() {
  const details = document.getElementById("details");

  details.classList.remove("on");
  details.classList.add("off");
  isDetailOpened = false;
}

// 확대 - 축소, comeback to original position
(function () {
  let currentScale = 1;
  let currentScaleOfPopup = 1;

  const zoomInButton = document.getElementById("zoom-in");
  const zoomOutButton = document.getElementById("zoom-out");
  const comebackButton = document.getElementById("original-position");

  zoomInButton.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });

  zoomOutButton.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });

  comebackButton.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });

  zoomInButton.addEventListener("click", (e) => {
    e.stopPropagation();

    if (currentScale >= 4) {
      return;
    }

    const container = document.getElementsByClassName("container")[0];

    const currentLeft = Number(container.style.left.split("px")[0]);
    const currentTop = Number(container.style.top.split("px")[0]);

    currentScale += 0.75;

    container.style.left = `${currentLeft}px`;
    container.style.top = `${currentTop}px`;
    container.style.transform = `scale(${currentScale})`;
  });

  zoomOutButton.addEventListener("click", (e) => {
    e.stopPropagation();

    const container = document.getElementsByClassName("container")[0];

    const currentTop = Number(container.style.top.split("px")[0]);
    const currentLeft = Number(container.style.left.split("px")[0]);

    currentScale -= 0.75;

    container.style.left = `${currentLeft}px`;
    container.style.top = `${currentTop}px`;
    container.style.transform = `scale(${
      currentScale <= 1 ? (currentScale = 1) : currentScale
    })`;
  });

  comebackButton.addEventListener("click", (e) => {
    e.stopPropagation();

    if (isDetailOpened) {
      closeDetailPopup();
    }

    const container = document.getElementsByClassName("container")[0];

    container.style.transform = `scale(${(currentScale = 1)})`;
    container.style.top = "0px";
    container.style.left = "0px";
  });
})();

let isDetailOpened = false;
let isMoved = false;
let currentScale = 1;
let currentScaleOfPopup = 1;
let zoomCounter = 0;

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

        setTimeout(() => {
          let { koreanName, scientificName, description } = plantTextData[
            plantId
          ];

          details.children[0].innerHTML = `
            <img src="/public/images/flowers/${scientificName}.png"></img>
            <div class="header">
              ${koreanName}
              <br/>
              ${scientificName.replaceAll("-", " ").replaceAll("_", "'")}
            </div>
            <hr>
            <div class="desc">
              ${description}
            </div>
          `;

          details.style.visibility = "hidden";
          details.style.transform = `scale(${currentScaleOfPopup})`;
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

      // container.style.cursor = "move";
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

      // container.style.cursor = "default";
      isMoved = false;

      function captureClick(e) {
        e.stopPropagation();

        window.removeEventListener("click", captureClick, true);
      }

      document.removeEventListener("mousemove", mouseMoveEvent);
    });
  });
})();

// 확대 - 축소, comeback to original position
(function () {
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
    if (zoomCounter >= 4) return;

    zoomCounter += 1;

    const container = document.getElementsByClassName("container")[0];
    const details = document.getElementById("details");

    const currentLeft = Number(container.style.left.split("px")[0]);
    const currentTop = Number(container.style.top.split("px")[0]);

    currentScale += 0.75;
    container.style.left = `${currentLeft}px`;
    container.style.top = `${currentTop}px`;
    container.style.transform = `scale(${currentScale})`;

    if (zoomCounter % 2 === 0) currentScaleOfPopup += 0.75;
    if (isDetailOpened) {
      details.style.transform = `scale(${currentScaleOfPopup})`;
    }
  });

  zoomOutButton.addEventListener("click", (e) => {
    e.stopPropagation();
    if (zoomCounter === 0) return;

    zoomCounter -= 1;

    const container = document.getElementsByClassName("container")[0];
    const details = document.getElementById("details");

    const currentTop = Number(container.style.top.split("px")[0]);
    const currentLeft = Number(container.style.left.split("px")[0]);

    currentScale -= 0.75;
    container.style.left = `${currentLeft}px`;
    container.style.top = `${currentTop}px`;
    container.style.transform = `scale(${
      currentScale <= 1 ? (currentScale = 1) : currentScale
    })`;

    if (zoomCounter % 2 === 0) currentScaleOfPopup -= 0.75;
    if (isDetailOpened) {
      details.style.transform = `scale(${
        currentScaleOfPopup <= 1
          ? (currentScaleOfPopup = 1)
          : currentScaleOfPopup
      })`;
    }
  });

  comebackButton.addEventListener("click", (e) => {
    e.stopPropagation();

    zoomCounter = 0;
    currentScaleOfPopup = 1;

    closeDetailPopup();

    const container = document.getElementsByClassName("container")[0];
    // const details = document.getElementById("details");

    container.style.transform = `scale(${(currentScale = 1)})`;
    // 무조건 디테일이 꺼져있는 경우잖아?
    // details.style.transform = `scale(${(currentScaleOfPopup = 1)})`;
    container.style.top = "0px";
    container.style.left = "0px";
  });
})();

function closeDetailPopup() {
  const details = document.getElementById("details");

  details.style.transform = `scale(${0})`;
  isDetailOpened = false;
}

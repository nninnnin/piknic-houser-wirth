let isDetailOpened = false;
let isMoved = false;
let currentScale = 1;
let currentScaleOfPopup = 1;
let zoomCounter = 0;

document.onreadystatechange = function (e) {
  console.log(e);
  console.log(document.readyState);

  let text = '문서를 로드 중입니다..';

  switch (document.readyState) {
    case 'interactive':
      text = '이미지를 로드 중입니다..';
      break;
    case 'complete':
      text = '로딩 완료';
      break;
    default:
      break;
  }

  console.log(text);
};

window.onload = () => {
  const loadingLayer = document.getElementById('loading');

  loadingLayer.style.opacity = '0';

  loadingLayer.addEventListener('webkitTransitionEnd', function () {
    loadingLayer.style.display = 'none';
  });
};

// Preload all the plant detail images
(function () {
  const flowers = [
    'Achillea-_Feuerland_.png',
    'Achillea-_Hella-Glashoff_.png',
    'Agastache-foeniculum.png',
    'Allium-_Summer-Beauty_.png',
    'Amorpha-canescens.png',
    'Amsonia-hubrichtii.png',
    'Anemone-_Wild-Swan_.png',
    'Anemone-×-hybrida-_Honorine-Jobert_.png',
    'Anemone-×-hybrida-_Pamina_.png',
    'Asclepias-incarnata.png',
    'Aster-_Little-Carlow_.png',
    'Aster-amellus-_Sonora_.png',
    'Aster-lateriflorus-_Horizontalis_.png',
    'Aster-macrophyllus-_Twilight_.png',
    'Aster-tataricus-_Jindai_.png',
    'Astilboides-tabularis.png',
    'Astrantia-major-_Roma_.png',
    'Bouteloua-curtipendula.png',
    'Briza-media-_Limouzi_.png',
    'Calamintha-nepeta-ssp.-nepeta.png',
    'Camassia-leichtlinii.png',
    'Chaerophyllum-hirsutum-_Roseum_.png',
    'Cimicifuga-simplex-_James-Compton_.png',
    'Clematis-heracleifolia-_China-Purple_.png',
    'Crambe-cordifolia.png',
    'Darmera-peltata.png',
    'Dianthus-carthusianorum.png',
    'Dorycnium-hirsutum.png',
    'Echinacea-pallida-_Hula-Dancer_.png',
    'Echinacea-pallida.png',
    'Echinacea-purpurea-_Fatal-Attraction_.png',
    'Echinops-bannaticus.png',
    'Eryngium-alpinum.png',
    'Eryngium-yuccifolium.png',
    'Festuca-mairei.png',
    'Gentiana-asclepiadea.png',
    'Geranium-_Patricia_.png',
    'Geranium-_Rozanne_.png',
    'Gillenia-trifoliata.png',
    'Helenium-_Moerheim-Beauty_.png',
    'IMperata-cylindrica.png',
    'Imperata-cylindrica-_Red-Baron_.png',
    'Iris-chrysographes-_Black-Form_.png',
    'Knautia-macedonica.png',
    'Liatris-spicata.png',
    'Limonium-latifolium.png',
    'Lobelia-tupa.png',
    'Lobelia-vedrariensis.png',
    'Lychnis-chalcedonica.png',
    'Lysimachia-ephemerum.png',
    'Molinia-caerulea-_Moorhexe_.png',
    'Monarda-bradburiana.png',
    'Myrica-gale.png',
    'Nepeta-govaniana.png',
    'Nepeta-subsessilis.png',
    'Panicum-_Shenandoah_.png',
    'Papaver-orientale-_Karine_.png',
    'Pennisetum-viridescens.png',
    'Penstemon-_Husker-Red_.png',
    'Perovskia.png',
    'Persicaria-amplexicaulis-_Alba_.png',
    'Phlomis-russeliana.png',
    'Pimpinella-major-_Rosea_.png',
    'Pycnanthemum-muticum.png',
    'Ruellia-humilis.png',
    'Salvia-_Dear-Anja_.png',
    'Salvia-verticillata-_Purple-Rain_.png',
    'Scabiosa-columbaria.png',
    'Scutellaria-incana.png',
    'Sedum-_Matrona_.png',
    'Selinum-wallichianum.png',
    'Serratula-seoanei.png',
    'Sesleria-autumnalis.png',
    'Sporobolus-heterolepsis.png',
    'Stachys-_Hummelo_.png',
    'Stachys-officinalis-_Rosea_.png',
    'Stipa-tenuissima.png',
    'Succisa-pratensis.png',
    'Thalictrum-delavayi.png',
    'Tricyrtis-formosana.png'
  ];

  flowers.forEach(flower => preloadImages(`/public/images/flowers/${flower}`));

  function preloadImages (url) {
    const img = new Image();
    img.src = url;
  }
})();

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
          console.log(plantTextData, plantId)
          let { koreanName, scientificName, description, mixed  } = plantTextData[plantId];

          const triviaCount = mixed ? 2 : 1;
          let trivia = '';

          for (let i = 1; i <= triviaCount; i++) {
            if (i === 1) {
              var { icon1: icon, height1: height, flowering1: flowering } = plantTextData[plantId];
            } else {
              var { icon2: icon, height2: height, flowering2: flowering } = plantTextData[plantId];
            }

            const ellipses = {
              ellipse1: `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="24.5" fill="white" stroke="black"/>
              </svg>
              `,
              ellipse2: `<svg width="25" height="50" viewBox="0 0 25 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25.0002 25C25.0002 38.8071 13.8073 50 0.000169687 50C0 25 0.000140243 38.8071 0.000140243 25C0.000140243 11.1929 0.000140123 11.5 0.000169687 0C13.8073 0 25.0002 11.1929 25.0002 25Z" fill="black"/>
              </svg>
              `,
              ellipse3: `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="25" fill="black"/>
              </svg>`,
            };

            const icons = icon.split(",").reduce((acc, iconKey) => {
              const ellipse = ellipses[`ellipse${iconKey.trim()}`];
              return acc += ellipse ? ellipse : "-";
            }, "");

            trivia += `
              ${
                mixed ? (
                `
                <div class="header" ${i >= triviaCount ? `style="margin-top:0;"` : ""}>
                  ${koreanName.split("+")[i - 1]}
                  <br />
                  <span class="italic">
                  ${
                    scientificName
                      .split("+")[i - 1]
                      .replaceAll("-", " ")
                      .replaceAll("_", "'")
                      .replace(
                        /'(.*?[^\\])'/,
                        `
                        <span class="normal">$&</span>
                        `
                      )
                  }
                  </span>
                </div>
                `
                ) : ""
              }
              <div class="trivia">
                <div class="icon icon${i}">${icons}</div>
                <div class="height${i}">${height}cm</div>
                <div class="flowering${i}">${flowering}월</div>
              </div>
              ${!mixed || i < triviaCount ? "<hr />" : ""}
            `;
          }

          details.children[0].innerHTML = `
            <img src="/public/images/flowers/${scientificName.replaceAll(' ', '-').replaceAll("'", "_").replaceAll("%", "")}.png"></img>
            ${
              mixed ? "" :
              `
              <div class="header">
                ${koreanName}
                <br/>
                <span class="italic">
                ${scientificName.replaceAll("-", " ").replaceAll("_", "'").replace(
                  /'(.*?[^\\])'/,
                  `
                  <span class="normal">$&</span>
                  `
                )}
                </span>
              </div>
              `
            }
            ${trivia}
            ${
              mixed ? "" :
              (
                `<div class="desc">
                  ${description}
                </div>`
              )
            }
          `;

          details.style.visibility = "hidden";
          details.style.top = `${event.clientY}px`;
          details.style.left = `${event.clientX}px`;
          details.style.transform = `scale(${currentScaleOfPopup})`;
          isDetailOpened = true;

          const imageOnload = () => {
            // 마우스가 클릭된 곳을 기준으로 팝업의 position 설정
            // 1) 팝업이 뷰포트를 넘어갔는지 아닌지 계산해서 알아낸다
            const isPopupCrossedBottomEnd =
              details.offsetTop + details.offsetHeight * currentScaleOfPopup >
              window.innerHeight;
            const isPopupCrossedRightEnd =
              details.offsetLeft + details.offsetWidth * currentScaleOfPopup >
              window.innerWidth;

            // console.log('아래 넘었니', isPopupCrossedBottomEnd)
            // console.log('오른쪽 넘었니', isPopupCrossedRightEnd)

            // 세가지가 있다
            // 오른쪽만 넘은 경우
            // 아랫쪽만 넘은 경우
            // 둘다 넘은 경우

            // 이 세가지 경우에 따라 창 띄우는(transform-origin) 기준점을 다 바꿔버리기

            // 2) 넘어갔다면 넘어가지 않도록 position을 변경시킨다 (넘어간 선이 상하좌우 어디에 걸치는지에 따라 기준점을 기준으로 위치 변경)
            if (isPopupCrossedBottomEnd) {
              details.style.top = `${
                details.offsetTop -
                (details.offsetTop +
                  details.offsetHeight * currentScaleOfPopup -
                  window.innerHeight)
              }px`;
            }

            if (isPopupCrossedRightEnd) {
              details.style.left = `${
                details.offsetLeft -
                (details.offsetLeft +
                  details.offsetWidth * currentScaleOfPopup -
                  window.innerWidth)
              }px`;
            }

            details.style.visibility = "visible";
          };

          details.getElementsByTagName('img')[0].onload = imageOnload;
        }, 100);
      });
    });
  }

  async function getPlantTextData() {
    const response = await fetch("/public/data/flower-info-0418.json");

    const result = await response.json();

    const flowerList = {};

    result.forEach((item) => {
      let { scientificName, className, ...rest } = item;

      const replaceChars = {
        "+": "_x2B_",
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

    if (zoomCounter === 2) currentScaleOfPopup += 0.5;
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

    if (zoomCounter === 2) currentScaleOfPopup -= 0.5;
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

// info button
const infoButton = document.getElementById('info');

infoButton.addEventListener('mousedown', (e) => {
  e.stopPropagation();
})

infoButton.addEventListener('click', (e) => {
  alert('get your credit sir')
})

// 각각의 식물에 클릭 이벤트 등록
(function (){
  function addEventToPlants (plantId, plantName) {
    const plants = document.getElementById(plantId);

    if (!plants) return;

    Array.from(plants.children).forEach((plant) => {
      plant.style.fill = 'transparent';

      plant.addEventListener('click', (event) => {
        event.stopPropagation();

        const details = document.getElementById('details');
        const closeButton = details.getElementsByTagName('svg')[0];

        closeButton.addEventListener('click', closeDetailPopup);

        function closeDetailPopup () {
          details.classList.remove('on');
          details.classList.add('off');
        }

        // 이전에 있던건 끄고..
        closeDetailPopup();

        setTimeout(function () {
          // 위치와 컨텐츠 재 설정 한 후에..
          details.style.top = `${event.offsetY}px`;
          details.style.left = `${event.offsetX}px`;
          details.children[0].textContent = plantName;

          // 새롭게 보여줘야..
          details.classList.remove('off');
          details.classList.add('on');
        }, 100);
      });
    });
  }

  const plantBundles = Array.from(document.getElementsByTagName('g'));

  plantBundles.forEach((bundle, index) => {
    console.log(bundle.id);
    addEventToPlants(bundle.id, index);
  });
})();

// 마우스로 전체 문서 드래그 드롭 가능
(function () {
  const container = document.getElementsByClassName('container')[0];

  document.addEventListener('mousedown', (e) => {
    const originalMouseX = e.clientX;
    const originalMouseY = e.clientY;

    const originalTopPosition = Number(container.style.top.split('px')[0]);
    const originalLeftPosition = Number(container.style.left.split('px')[0]);

    const mouseMoveEvent = _.throttle((e) => {
      e.preventDefault();

      container.style.cursor = "move";

      const movedMouseX = originalMouseX - e.clientX;
      let movedMouseY = originalMouseY - e.clientY;

      container.style.top = `${-movedMouseY + originalTopPosition}px`;
      container.style.left = `${-movedMouseX + originalLeftPosition}px`;
    }, 10);

    document.addEventListener('mousemove', mouseMoveEvent);

    document.addEventListener('mouseup', () => {
      const container = document.getElementsByClassName('container')[0];
      container.style.cursor = "default";
      document.removeEventListener('mousemove', mouseMoveEvent);
    });
  });
})();

// 확대 - 축소, comeback to original position
(function () {
  let currentScale = 1;

  const zoomInButton = document.getElementById('zoom-in');
  const zoomOutButton = document.getElementById('zoom-out');
  const comebackButton = document.getElementById('original-position');

  zoomInButton.addEventListener('click', e => {
    e.stopPropagation();
    const container = document.getElementsByClassName('container')[0];

    container.style.transform = `scale(${currentScale += 0.5})`;
  });

  zoomOutButton.addEventListener('click', e => {
    e.stopPropagation();

    const container = document.getElementsByClassName('container')[0];

    container.style.transform = `scale(${currentScale - 0.5 <= 1 ? currentScale = 1 : currentScale -= 0.5})`;
  });

  comebackButton.addEventListener('click', e => {
    e.stopPropagation();
    const container = document.getElementsByClassName('container')[0];

    container.style.transform = `scale(${currentScale = 1})`;
    container.style.top = '0px';
    container.style.left = '0px';
  })
})();

// 이름 데이터 가져오기..
(async function () {
  const result = await fetch('/public/data/flower-info.json');

  const flowerList = await result.json();

  flowerList.forEach(item => {
    console.log(item);

    // const keys = Object.keys(item);

    // keys.forEach(key => {
    //   if (key.includes('FIELD')) {
    //     delete item[key];
    //   }
    // });

    // return item;
  });
})();

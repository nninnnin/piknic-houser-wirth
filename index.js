// document에 글로벌 클릭 이벤트 리스너 등록 (디테일 off)
// TODO: 다른 식물의 디테일이 열릴때에만 디테일 off되도록 변경!
document.addEventListener('click', (event) => {
  const details = document.getElementById('details');

  details.classList.remove('on');
  details.classList.add('off');
});

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

// 각각의 식물에 클릭 이벤트 등록
(function (){
  function addEventToPlants (plantId, plantName) {
    const plants = document.getElementById(plantId);

    if (!plants) return;

    Array.from(plants.children).forEach((plant) => {
      plant.style.fill = 'transparent';

      plant.addEventListener('click', (event) => {
        event.stopPropagation();

        console.log(`이것은...${plantName} 라는 식물입니다.`);
        console.log(`Mouse position => X: ${event.offsetX} Y: ${event.offsetY}`);

        const details = document.getElementById('details');
        details.style.top = `${event.offsetY}px`;
        details.style.left = `${event.offsetX}px`;

        details.textContent = plantName;

        details.classList.remove('off');
        details.classList.add('on');
      });
    });
  }

  const plantBundles = Array.from(document.getElementsByTagName('g'));

  plantBundles.forEach((bundle, index) => {
    console.log(bundle.id);
    addEventToPlants(bundle.id, index);
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

    container.style.transform = `scale(${currentScale += 0.1})`;
  });

  zoomOutButton.addEventListener('click', e => {
    e.stopPropagation();
    const container = document.getElementsByClassName('container')[0];

    container.style.transform = `scale(${currentScale -= 0.1})`;
  });

  comebackButton.addEventListener('click', e => {
    e.stopPropagation();
    const container = document.getElementsByClassName('container')[0];

    container.style.transform = `scale(${currentScale = 1})`;
    container.style.top = '0px';
    container.style.left = '0px';
  })
})();

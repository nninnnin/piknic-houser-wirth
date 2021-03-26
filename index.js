// document에 글로벌 클릭 이벤트 리스너 등록 (디테일 off)
document.addEventListener('click', (event) => {
  console.log('클릭되었습니다!!');

  const details = document.getElementById('details');

  details.classList.remove('on');
  details.classList.add('off');
});

// document에 mousedown 이벤트리스너 등록 (드래그로 화면 이동)
document.addEventListener('mousedown', (e) => {
  const originalPositionX = e.offsetX;
  const originalPositionY = e.offsetY;

  console.log('마우스 다운되었습니다!!', `다운 시 마우스 포지션 X: ${originalPositionX} Y: ${originalPositionY}`);

  const mouseMoveEvent = _.throttle((e) => {
    e.preventDefault();

    const movedX = originalPositionX - e.offsetX;
    const movedY = originalPositionY - e.offsetY;

    console.log('downed position...', originalPositionX, originalPositionY);
    console.log('이동 포지션...', e.offsetX, e.offsetY);

    console.log('다운된채로 이동중..', movedX, movedY);

    const container = document.getElementsByClassName('container')[0];

    container.style.left = `${-movedX}px`;
    container.style.top = `${-movedY}px`;
  }, 10);

  document.addEventListener('mousemove', mouseMoveEvent);

  document.addEventListener('mouseup', () => {
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


// 확대 - 축소
(function () {
  let currentScale = 1;

  const zoomInButton = document.getElementById('zoom-in');
  const zoomOutButton = document.getElementById('zoom-out');

  zoomInButton.addEventListener('click', e => {
    const container = document.getElementsByClassName('container')[0];

    container.style.transform = `scale(${currentScale += 0.1})`;
  });

  zoomOutButton.addEventListener('click', e => {
    const container = document.getElementsByClassName('container')[0];

    container.style.transform = `scale(${currentScale -= 0.1})`;
  });
})();

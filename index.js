document.addEventListener('click', (event) => {
  const details = document.getElementById('details');
    details.classList.remove('on');
    details.classList.add('off');
});

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

// 각각의 식물에 클릭 이벤트 등록
const plantBundles = Array.from(document.getElementsByTagName('g'));

plantBundles.forEach((bundle, index) => {
  console.log(bundle.id);
  addEventToPlants(bundle.id, index);
});

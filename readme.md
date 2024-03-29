# Plants of the Oudolf Gardens

![piet-oudolf](/public/preview.gif)

전시공간 Piknic의 의뢰로 개발되었으며, Piet Oudolf의 정원 조감도를 이용하여 식물들을 소개하는 한장의 웹페이지 입니다.

### Features

조감도를 확대 및 축소하고 상하좌우로 이동할 수 있으며, 원점으로 되돌릴 수 있습니다.

식물구역에 마우스를 대었을 시 검정 반투명의 호버 이펙트가 일어납니다.

클릭 시, 식물들의 상세 정보를 확인할 수 있습니다.

### How to use

index.html을 크롬 등 브라우저를 이용해 실행합니다.

사용중의 이미지 로딩을 없애기 위해 초기 이미지 캐싱에 필요한 로딩 시간이 필요할 수 있습니다.

### Backlogs

- [X] 확대시 디테일 팝업 크기 제한
- [X] 무브 시 플랜트 클릭 무시
  - https://stackoverflow.com/questions/8643739/cancel-click-event-in-the-mouseup-event-handler
- [X] 화면 안쪽에서만 디테일 팝업이 열리도록
  - element.offsetWidth, offsetHeight, offsetLeft, offsetTop
  - window.innerWidth, innerHeight
- [X] 2,4번째 줌 인/아웃에서는 디테일 팝업도 함께 줌 인/아웃되도록
- [ ] 플랜트 클릭 시 동일한 플랜트 모두 Active 상태로 표시
- [ ] 디테일 열릴때 마우스 클릭 위치에서 애니메이션 시작되도록
- [ ] 확대 시 현재 포커스 중심으로 확대되도록

---

디자인과 정원 관련 정보는 Piknic에서 제공받았음을 알립니다.

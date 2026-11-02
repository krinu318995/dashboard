📌 개인화 생산성 대시보드 (Personal Dashboard)

노션(Notion) 스타일의 위젯 기반 레이아웃을 통해 메모, 할 일(Todo), 일정(캘린더), 날씨 및 시계 기능을 한 화면에서 통합 관리할 수 있는 맞춤형 대시보드 웹 애플리케이션입니다.

🔗 프로젝트 링크

배포 URL: https://<본인-Vercel-배포-주소>.vercel.app

저장소: https://github.com/krinu318995/dashboard

🛠 기술 스택

Frontend: React 18, TypeScript, Vite

Styling: CSS (Modular / Component-scoped Styling)

Data Persistence: Browser LocalStorage

Deployment: Vercel

🖥 주요 기능

기능

설명

Grid Dashboard

메모, 투두, 시계/날씨 위젯을 한눈에 볼 수 있는 메인 대시보드 그리드 뷰

Todo & Calendar

날짜별 할 일 목록 관리, 모달 인터페이스를 통한 세부 일정 추가 및 완료 상태 관리

Memo Management

독립적인 메모 작성/편집 인터페이스 및 페이지네이션 유틸리티를 적용한 목록 탐색

Live Clock & Weather

실시간 시간 표시 및 날씨 상태 위젯 연동

🔍 문제 해결 및 트러블슈팅 (Troubleshooting)

1. 로컬 스토리지 기반 데이터 입출력 시 덮어쓰기 및 동기화 이슈

문제 상황:

별도의 서버 DB 없이 브라우저 로컬 스토리지만으로 데이터를 동기화하는 구조에서, 메모 및 투두 항목을 수정/등록할 때 기존 데이터가 덮어씌워지거나 갱신된 내용이 정상 반영되지 않는 현상이 발생함.

원인 분석:

복수의 위젯 컴포넌트가 동일한 스토리지 키에 접근하는 과정에서 직렬화(JSON.stringify) 및 역직렬화(JSON.parse) 타이밍 불일치 추정.

고유 식별자(ID) 검증 누락으로 인해 갱신 대상 항목 대신 전체 배열이 비정상 병합되는 문제 분석.

해결 방안:

데이터 모델(TaskItem, MemoItem 등)에 고유 ID와 생성/수정 타임스탬프 필드를 명확히 정의(dashboard.ts).

스토리지 접근 로직을 모듈화하여, 저장 전 최신 배열 데이터를 검증하고 특정 ID 기준으로 매핑(Update) 처리 후 반영하도록 개선.

2. Linux 기반 배포 환경(Vercel)에서의 대소문자 경로 인식 실패

문제 상황:

로컬 환경(Windows)에서는 정상 구동되던 코드가 Vercel 빌드 과정에서 Could not resolve '../../assets/styles/gridboard.css' 에러를 출력하며 중단됨.

원인 분석:

Windows 파일 시스템은 대소문자를 구분하지 않지만, 배포 서버 환경인 Linux는 대소문자를 엄격히 구분함. 실제 파일명 GridBoard.css와 import 구문 소문자 gridboard.css 불일치 확인.

해결 방안:

파일 시스템과 일치하도록 컴포넌트 내 import 구문의 대소문자를 교정하고, Git 트래킹 대소문자 캐시를 검증하여 배포 성공.

💡 개발 방식 및 회고 (AI 어시스턴트 활용 관점)

초기 컴포넌트 구조 스캐폴딩과 UI 마크업 단계에서 AI 코드 생성을 적극 활용하여 프로토타이핑 소요 시간을 단축함.

AI가 생성한 코드에서 발생한 로컬 스토리지 동기화 오류, 미사용 변수/타입 선언 불일치(TS6133, TS2339), OS 환경별 파일 경로 에러 등을 직접 로그를 분석하며 디버깅함.

향후 과제: 클라이언트 로컬 스토리지를 넘어선 백엔드 REST API 및 RDB 연동을 통한 완전한 영속성 계층 구축 계획.

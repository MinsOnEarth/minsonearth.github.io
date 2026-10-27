# Minseo Kim Academic Website — v4 (2026-10-27)

## 변경 내용

기존의 **5페이지 구조**와 학술용 디자인은 유지하면서 콘텐츠 관리 기능을 확장했습니다.

- **1페이지 About:** 연구실(`Research lab`)과 지도교수(`Advisor`)를 상단 프로필 카드에서 제외하고, 해당 대학원 학력 항목의 **Education 아래**에 별도 필드로 표시합니다. `admin.html → About me → Education`에서 직접 수정합니다.
- **3페이지 Experience:** 고정된 Awards / Experience / Other 대신 카테고리 자체를 자유롭게 **추가, 이름 수정, 순서 변경, 숨김, 삭제**할 수 있습니다. 카테고리 안의 이력도 개별적으로 **추가, 수정, 순서 변경, 삭제**할 수 있습니다.
- **모든 페이지:** `Additional sections` 또는 `Manage CV categories & entries`에서 새 섹션과 세부 항목을 생성하고 지울 수 있습니다. 모든 항목에 기간, 제목, 소속, 설명, 외부 링크, PDF, 이미지를 넣을 수 있습니다.
- 논문, 학회, 연구 프로젝트, 취미의 기존 개별 추가/수정/삭제 기능도 유지됩니다.

### 처음부터 들어 있는 CV 카테고리 (원하는 대로 변경 가능)

1. Selected Awards
2. Research & Industry Experience
3. Teaching Experience
4. Scholarships
5. Volunteer Experience
6. Licenses & Certificates
7. Technical Skills
8. Leadership Activities
9. Selected Honors

**비어 있는 카테고리는 일반 방문자 사이트에서 숨겨지고, 관리자에게는 계속 보입니다.** 항목을 추가하면 공개 페이지에 표시됩니다.

## 이미 공개 중인 사이트 업데이트하기 (중요: 기존 내용 보존)

현재 사이트: https://minsonearth.github.io/

**가장 안전한 방법: `Minseo_Kim_Website_v4_UPDATE_KEEP_CONTENT.zip`을 사용하세요.** 이 압축파일에는 `content.json`이 **포함되어 있지 않아 기존 게시 내용을 덮어쓰지 않습니다.**

1. 기존 관리자 `https://minsonearth.github.io/admin.html`에서 중요한 편집 내용은 **Export backup**으로 백업합니다.
2. `Minseo_Kim_Website_v4_UPDATE_KEEP_CONTENT.zip` 압축을 해제합니다.
3. GitHub `https://github.com/MinsOnEarth/minsonearth.github.io` → **Add file → Upload files**를 엽니다.
4. **압축을 푼 폴더 안에 들어 있는 파일들을** 저장소 최상위(기존 `index.html` 옆)에 업로드합니다. 폴더 자체를 올리면 안 됩니다.
5. **Commit changes**를 클릭합니다. 기존 Pages 설정(`main` / `/root`)은 변경하지 않습니다.
6. 배포가 끝나면 사이트를 새로고침합니다. `Ctrl+Shift+R`도 시도할 수 있습니다.
7. `https://minsonearth.github.io/admin.html` → Github 연결 → **Experience / CV sections**에서 카테고리를 관리합니다.
8. **Publish changes**를 누르면 기존 v3 `content.json`을 새 v4 형식으로 자동 변환하여 저장합니다. 변환 과정에서 기존 논문/경력 항목은 유지됩니다.

**기존 내용이 아닌 새 샘플 콘텐츠로 완전히 교체하고 싶을 때만** 전체 ZIP(`Minseo_Kim_Website_v4_FULL.zip`)을 사용하세요. 전체 ZIP에는 `content.json`이 들어 있으며 덮어쓰면 이전 변경 내용이 사라질 수 있습니다.

## 관리자에서 카테고리 편집하기

1. 페이지 왼쪽 메뉴 **03 CV & awards** 선택.
2. **Manage CV categories & entries**까지 스크롤.
3. 카테고리의 ▶(삼각형)를 누르면 펼쳐집니다.
4. `Category / section name`으로 제목을 수정합니다. 카테고리 오른쪽의 **↑/↓**로 순서 변경, **×**로 삭제합니다.
5. 카테고리 맨 아래 **+ Add an entry to ...** 버튼으로 새 항목을 추가합니다. 항목 안의 **↑/↓/×**로 개별 항목 관리가 가능합니다.
6. 맨 아래 **+ Add a new CV category**로 새로운 카테고리를 만듭니다.
7. 수정한 내용은 **Publish changes**를 눌러야 실제 사이트에 반영됩니다.

1, 2, 4, 5페이지에서는 하단의 **Additional sections**에서 같은 방식으로 섹션을 추가할 수 있습니다.

## 토큰, 공개 범위, 백업

- 편집기에서 사진/PDF 업로드 및 게시 기능을 사용하려면 GitHub fine-grained 토큰이 필요합니다. `MinsOnEarth/minsonearth.github.io` 하나에만 **Contents: Read and write** 권한을 부여하세요.
- 토큰은 다른 사람에게 보내거나 공개 저장소에 저장하지 마세요. GitHub에서 생성 시에만 문자열을 보여줍니다.
- 공개 홈페이지에 업로드된 PDF, 사진 및 `content.json`은 방문자에게 공개됩니다. 미공개 논문이나 개인정보 파일을 업로드하지 마세요.
- 관리자에서 편집하는 변경사항은 게시하기 전까지 브라우저의 로컬 임시 초안입니다. **Export backup** 버튼으로 JSON을 백업할 수 있습니다.
- 사이트 관리자 주소는 누구나 접근할 수 있지만, GitHub 토큰이나 저장소 쓰기 권한 없이는 홈페이지에 변경 사항을 게시할 수 없습니다.

## 주요 파일

- `index.html`, `styles.css`, `site.js`: 5페이지 방문자 홈페이지
- `admin.html`, `admin.css`, `admin.js`: 직접 수정하는 관리자 페이지
- `upgrade.js`: 이전 v3의 자료를 보존하면서 새 섹션 구조로 변환
- `data.js`: 오프라인 기본 예시 자료
- `content.json`: 실제 사이트 콘텐츠(**기존 사이트 업데이트 시 덮어쓰지 마세요**)
- `.nojekyll`: GitHub Pages의 정적 사이트 설정

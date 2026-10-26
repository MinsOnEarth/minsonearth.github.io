# Minseo Kim — Academic Website v3

## 새 디자인
CV처럼 보이는, 내용 중심의 5페이지 연구자 개인 사이트입니다.

1. **About** — 학교, 연구실, 모토, 교육, 프로필 사진, CV 다운로드
2. **Publications** — 논문/저널/프리프린트 및 학회 발표, PDF·포스터·사진 링크
3. **Experience** — 수상, 연구/인턴/TA, 리더십/봉사
4. **Research** — 수행 연구 프로젝트와 앞으로 하고 싶은 연구 질문
5. **Beyond Research** — 삼성 라이온즈, 오케스트라 플루트, 알토 색소폰 등

내용은 `content.json`에 있고, 웹 브라우저에서 `admin.html`을 열면 코딩 없이 수정할 수 있습니다.

## 지금 운영하는 GitHub Pages에 업데이트하기

기존 사이트 `https://minsonearth.github.io/` 가 이미 배포되어 있으므로 새 저장소를 만들지 마세요.

1. 현재 쓰는 관리자에서 이미 수정한 내용이 있으면 반드시 **백업**합니다. 이전 버전과 v3의 구조가 달라, `content.json`을 단순히 덮어쓰면 기존 수정 사항이 사라질 수 있습니다.
2. GitHub의 `MinsOnEarth/minsonearth.github.io` 저장소 **Code → Add file → Upload files**로 이동.
3. 이 ZIP 파일을 압축 해제한 다음, **폴더가 아니라 안의 파일**을 저장소 최상위(`README.md`와 같은 위치)에 업로드합니다.
4. 기존 `index.html` 등 파일 덮어쓰기에 동의하고 **Commit changes**합니다.
5. GitHub Pages는 기존에 `main`/`/(root)`로 설정했다면 변경하지 않아도 됩니다.
6. 공개 사이트: `https://minsonearth.github.io/`
7. 관리자 사이트: `https://minsonearth.github.io/admin.html`

**중요:** `data.js`는 처음 열 때 또는 `file://`로 로컬 미리보기를 할 때 쓰는 초기 내용입니다. 실제 게시된 내용은 `content.json`이 우선합니다. 앞으로 관리자에서 편집하고 'Publish changes'를 누르면 `content.json`이 갱신됩니다.

## 관리자 사용법

- `admin.html`에서 왼쪽의 다섯 페이지를 선택하면 모든 글을 필드별로 수정할 수 있습니다.
- **＋ Add**로 논문·학회·수상·인턴·연구·취미 항목을 추가합니다.
- 항목 위 `↑ / ↓`로 순서를 조절하고 `×`로 삭제합니다.
- 오른쪽 미리보기에서 텍스트를 클릭하면 왼쪽에 해당 편집 입력창으로 이동합니다.
- 사진 / PDF: 항목의 **Upload**를 누릅니다. 업로드에는 GitHub 연결이 필요합니다.
- 수정은 자동으로 브라우저에 임시 저장되지만, 공개되지는 않습니다. **Publish changes**가 필수입니다.
- **Export backup**으로 현재 내용을 JSON 파일로 백업할 수 있습니다.

## GitHub 토큰 연결

사이트 편집기는 무료 GitHub Pages 위에서 실행합니다. GitHub 토큰은 관리자가 공개된 데이터 파일(`content.json`)과 업로드한 사진/PDF(`assets/`)를 GitHub 저장소에 기록하기 위한 것입니다.

1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.
2. Resource owner = `MinsOnEarth`.
3. Repository access = **Only select repositories** → `minsonearth.github.io`.
4. Repository permissions → Contents = **Read and write**.
5. 관리자 페이지 **Connect**에서 토큰을 입력합니다. **토큰은 절대 ChatGPT, 공개 저장소나 제삼자에게 보내지 마세요.** 브라우저 메모리에만 보관되며 새로고침 시 재입력이 필요합니다.
6. 토큰을 발급한 후 **토큰 문자열은 GitHub에서 다시 표시되지 않습니다.** 안전한 비밀번호 관리자에 직접 보관하거나 필요하면 재발급해야 합니다.

연결되지 않은 상태에서도 글 수정·미리보기·JSON 백업은 가능합니다. 단, GitHub 배포/파일 업로드는 할 수 없습니다.

## 데이터 신뢰성 및 공개 전 확인

- 공개 정보로 확인되는 ACM CUI 2026 논문 한 편(제목, 저자, DOI)을 초기값으로 넣었습니다.
- 그 외 학회명·경력·수상 정보는 이전에 사용자가 제공했던 CV 정보를 바탕으로 작성했습니다. 일부 일정·세부 설명은 편집 전 확인하세요.
- 학회 참가/발표 실적의 날짜가 불분명한 항목은 **연도를 비워 두었습니다.** 날짜를 확인해 직접 넣으세요.
- 다른 논문, Google Scholar/ORCID/LinkedIn 링크, 이메일, 실제 사진 및 CV PDF는 사용자가 추가하도록 비워 두었습니다. 실제 CV PDF를 올리면 About 페이지의 다운로드 버튼이 활성화됩니다.
- 공개 사이트에 업로드한 사진과 PDF는 **누구나 볼 수 있습니다.** 개인정보/미공개 연구 데이터를 올리지 마세요.

## 파일 구성

- `index.html`, `site.js`, `styles.css` — 방문자에게 보이는 사이트
- `admin.html`, `admin.js`, `admin.css` — 관리자 편집 화면
- `content.json` — 실제 공개 콘텐츠 (관리자가 업데이트)
- `data.js` — 기본 / 오프라인 미리보기 콘텐츠
- `.nojekyll` — GitHub Pages에서 파일 그대로 게시하도록 설정
- `assets/` — 관리자가 사진·PDF를 업로드할 폴더

모든 핵심 기능에 별도 서버·구독·외부 CSS 프레임워크가 필요하지 않습니다. 파일 크기 12MB 이하의 JPG/PNG/WEBP/GIF 및 PDF 업로드를 지원합니다.

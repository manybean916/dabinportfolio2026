# 윤다빈 디자이너 포트폴리오

**Product Designer Dabin Yoon**의 개인 포트폴리오 랜딩페이지입니다.  
Figma 디자인을 기반으로 React + Vite로 구현되었으며, 한국어/영어 전환 및 Firebase 기반 관리자 기능을 포함합니다.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 18, TypeScript |
| 빌드 도구 | Vite 6 |
| 스타일링 | Tailwind CSS 4 |
| UI 컴포넌트 | Radix UI (shadcn/ui), MUI |
| 애니메이션 | Motion (Framer Motion) |
| 백엔드 | Firebase Realtime Database, Firebase Auth |
| 패키지 매니저 | pnpm |

---

## 주요 기능

- **다국어 지원** — 한국어 / 영어 실시간 전환 (Navbar KR|EN 버튼)
- **포트폴리오 그리드** — Firebase Realtime Database에서 프로젝트 목록 동적 로드 (Masonry 레이아웃)
- **관리자 모드** — Firebase 인증 후 프로젝트 추가 · 수정 · 삭제 가능
- **부드러운 스크롤 네비게이션** — 앵커 링크 클릭 시 smooth scroll
- **반응형 디자인** — 모바일 / 태블릿 / 데스크탑 대응
- **토스트 알림** — Sonner를 통한 실시간 피드백

---

## 페이지 구성

| 섹션 | 설명 |
|------|------|
| **Hero** (`#home`) | 디자이너 이름, 슬로건, 대표 이미지 |
| **Intro** (`#about`) | 프로필 소개, 위치, 연락처, 전문 분야 |
| **Portfolio** (`#portfolio`) | 프로젝트 카드 그리드 (UX Research, Product Design 등) |
| **Services** | UX 디자인 / UI 디자인 서비스 소개 |
| **Footer** (`#contact`) | 연락처 및 소셜 링크 |

---

## 로컬 실행

```bash
# 의존성 설치
npm i

# 개발 서버 시작 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build
```

> pnpm을 사용하는 경우 `npm` 대신 `pnpm` 명령어를 사용하세요.

---

## 관리자 기능

Firebase Authentication으로 로그인한 관리자 계정은 포트폴리오 프로젝트를 추가 · 수정 · 삭제할 수 있습니다.

- 관리자 이메일: `yoondabin916@gmail.com`, `ekqlsdl0916@naver.com`
- Navbar 우측 **로그인** 버튼 클릭 → Google 로그인
- 로그인 후 포트폴리오 섹션에 **+** 버튼 및 편집/삭제 버튼 표시

---

## 프로젝트 구조

```
dabinportfolio/
├── src/
│   ├── app/
│   │   ├── App.tsx                  # 앱 루트, Firebase 데이터 연동
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # 고정 상단 네비게이션 바
│   │   │   ├── Hero.tsx             # 히어로 섹션
│   │   │   ├── Intro.tsx            # 자기소개 섹션
│   │   │   ├── PortfolioGrid.tsx    # 프로젝트 그리드
│   │   │   ├── ServicesSection.tsx  # 서비스 소개
│   │   │   ├── Footer.tsx           # 푸터
│   │   │   ├── AddProjectModal.tsx  # 프로젝트 추가/수정 모달
│   │   │   ├── LoginModal.tsx       # 로그인 모달
│   │   │   └── ui/                  # shadcn/ui 컴포넌트 모음
│   │   └── context/
│   │       └── AuthContext.tsx      # Firebase Auth 컨텍스트
│   ├── lib/
│   │   └── firebase.ts              # Firebase 초기화 설정
│   ├── imports/                     # 프로젝트 이미지 assets
│   └── styles/                      # 전역 CSS, Tailwind, 폰트 설정
├── index.html
├── vite.config.ts
└── package.json
```

---

## Firebase 설정

이 프로젝트는 Firebase Realtime Database와 Firebase Authentication을 사용합니다.  
`src/lib/firebase.ts`에 설정 값이 포함되어 있습니다.

- **프로젝트 ID**: `bean-59d45`
- **Database URL**: `https://bean-59d45-default-rtdb.firebaseio.com`

---

## 원본 디자인

Figma 원본: [디자이너 포트폴리오 랜딩페이지](https://www.figma.com/design/URKLsbuLSsEUttbyujBziW/%EB%94%94%EC%9E%90%EC%9D%B4%EB%84%88-%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4-%EB%9E%9C%EB%94%A9%ED%8E%98%EC%9D%B4%EC%A7%80)

# ComfyUI Comma Weight

[English](README.md) | [中文](README.zh-CN.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

프롬프트 입력창에서 `Ctrl+↑/↓`(macOS는 `Command+↑/↓`)를 누르면 쉼표로 구분된 태그 전체의 가중치를 조절합니다. 태그 한가운데 커서를 두거나 여러 태그의 일부만 대충 선택해도 쉼표 경계까지 확장합니다.

캔버스에 노드가 추가되지 않는 ComfyUI 프론트엔드 확장입니다.

## 동작 방식

`black hair, long hair, smile`에서 `hair, lo` 부분만 선택하고 ComfyUI의 증가폭을 `0.2`로 설정한 상태에서 `Ctrl+↑`를 한 번 누르면:

```text
black h[air, lo]ng hair, smile
             ↓
(black hair, long hair:1.2), smile
```

단일 태그의 일부와 두 태그에 걸친 일부를 선택했을 때의 비교입니다.

| 선택 범위 | ComfyUI 기본 동작 | Comma Weight |
| --- | --- | --- |
| 단일 태그의 일부 | ![태그 일부만 가중치 조절](image/single-default.png) | ![태그 전체 가중치 조절](image/single-comma-weight.png) |
| 두 태그에 걸친 일부 | ![선택한 글자 조각만 가중치 조절](image/group-default.png) | ![두 태그 전체를 한 묶음으로 조절](image/group-comma-weight.png) |

- `looking at viewer` 중간에 커서를 두어도 태그 전체가 `(looking at viewer:1.2)`로 바뀝니다.
- 여러 태그의 일부를 선택하면 양쪽 쉼표 경계까지 확장해 하나의 묶음으로 조절합니다.
- 이미 가중치가 붙은 묶음은 다시 누를 때 기존 값을 변경합니다. 값이 `1`로 돌아오면 괄호를 벗깁니다.
- 균형 잡힌 `()`, `[]`, `{}` 안의 쉼표는 태그 경계로 취급하지 않습니다. 줄바꿈은 태그를 분리합니다.
- 증가폭은 ComfyUI의 **Settings → Comfy → Edit Token Weight → Ctrl+up/down precision** 설정을 따릅니다.

## 설정

**Settings → Comma-Weight → General**에서 켜고 끌 수 있습니다. 변경 사항은 즉시 적용됩니다. 비활성화 시 ComfyUI의 기본 `Ctrl+↑/↓` 동작으로 작동합니다.

![Comma-Weight 설정 탭](image/settings-sidebar.png)

![Comma-Weight 활성화 설정](image/settings-toggle.png)

## 설치

### ComfyUI Manager

ComfyUI Manager에서 **Comma Weight**를 검색해 설치한 뒤 ComfyUI를 재시작하고 브라우저를 새로고침해 주세요.

### 수동 설치

ComfyUI의 `custom_nodes` 폴더에서 입력해 주세요.

```sh
git clone https://github.com/cozdx1/ComfyUI-Comma-Weight.git
```

ComfyUI를 재시작하고 브라우저를 새로고침해 주세요. 수동 설치를 업데이트할 때는 복제한 폴더에서 `git pull`을 실행한 뒤 재시작하고 새로고침하면 됩니다.

## 호환성

ComfyUI 프론트엔드 `1.51.9`에서 실험되었습니다. 단축키는 ComfyUI 페이지의 편집 가능한 텍스트 영역에 적용됩니다. 다른 프론트엔드 버전이나 같은 단축키를 사용하는 확장이 존재할 경우, 의도대로 동작하지 않을 수 있습니다.

## 개발

JavaScript 동작 테스트: `node --test tests/weight-range.test.mjs`

## 라이선스

[MIT](LICENSE)

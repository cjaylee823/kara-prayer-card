/****************************************************************
 *  KARA:Arts 기도카드 — 응원댓글 백엔드 (Google Apps Script)
 *  --------------------------------------------------------------
 *  무료 · 회원가입 불필요(구글 계정만 있으면 됨)
 *  댓글은 Google Sheets에 저장됩니다.
 *
 *  [설치 방법]
 *  1) sheets.google.com 에서 새 스프레드시트를 하나 만듭니다.
 *  2) 메뉴: 확장 프로그램 → Apps Script
 *  3) 기본 코드를 모두 지우고, 이 파일 내용을 전부 붙여넣습니다.
 *  4) 저장(💾) 후, 상단 [배포] → [새 배포] 클릭
 *     - 유형 선택(⚙️) → '웹 앱'
 *     - 실행 계정: 나
 *     - 액세스 권한: '모든 사용자'  (★ 꼭 이걸로!)
 *  5) [배포] → 권한 승인 → 끝에 나오는 '웹 앱 URL'(.../exec) 복사
 *  6) index.html 의 BACKEND_URL = "" 안에 그 URL을 붙여넣습니다.
 ****************************************************************/

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('cheers');
  if (!sh) {
    sh = ss.insertSheet('cheers');
    sh.appendRow(['ts', 'who', 'text']);
  }
  return sh;
}

// 댓글 목록 읽기 (GET)
function doGet() {
  var sh = getSheet_();
  var rows = sh.getDataRange().getValues();
  var items = [];
  for (var i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    items.push({ ts: rows[i][0], who: rows[i][1], text: rows[i][2] });
  }
  return ContentService
    .createTextOutput(JSON.stringify({ items: items }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 댓글 저장 (POST)
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var who = String(data.who || '').slice(0, 20);
    var text = String(data.text || '').slice(0, 500);
    var ts = Number(data.ts) || new Date().getTime();
    if (who && text) {
      getSheet_().appendRow([ts, who, text]);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

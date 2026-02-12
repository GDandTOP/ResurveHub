import { Sparkles } from 'lucide-react'

export default function PrivacyPage () {
  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 섹션 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/85 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:30px_30px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 backdrop-blur-md rounded-full text-lg font-semibold mb-4 shadow-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Sparkles className="h-5 w-5" strokeWidth={2.5} />
              <span className="tracking-wide">개인정보처리방침</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight [letter-spacing:-0.03em]">
              개인정보처리방침
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light max-w-2xl mx-auto [letter-spacing:-0.01em]">
              Young King Space 개인정보처리방침
            </p>
          </div>
        </div>
      </div>

      {/* 개인정보처리방침 내용 섹션 */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            <div className="space-y-12">
              {/* 서문 */}
              <section className="space-y-4">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Young King Space(이하 "회사")는 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법 등 관련 법령상의 개인정보보호 규정을 준수하며, 이용자의 개인정보 보호에 최선을 다하고 있습니다.
                </p>
              </section>

              {/* 제1조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제1조 (개인정보의 수집 및 이용 목적)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>회사는 다음의 목적을 위하여 개인정보를 수집 및 이용합니다:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>회원 가입 및 관리: 회원 가입의사 확인, 회원자격 유지·관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지</li>
                    <li>서비스 제공: 공간 예약 서비스 제공, 예약 확인 및 결제, 고객 상담 및 불만 처리</li>
                    <li>마케팅 및 광고: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공</li>
                  </ul>
                </div>
              </section>

              {/* 제2조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제2조 (수집하는 개인정보의 항목)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 회사는 회원가입, 서비스 제공을 위해 다음과 같은 개인정보를 수집하고 있습니다:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>필수항목: 이름, 이메일 주소, 비밀번호, 휴대전화번호</li>
                    <li>선택항목: 생년월일, 성별</li>
                    <li>결제 시: 카드번호, 카드사명, 카드 유효기간, 계좌번호, 은행명</li>
                  </ul>
                  <p>② 서비스 이용 과정에서 다음과 같은 정보가 자동으로 생성되어 수집될 수 있습니다:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>IP주소, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록</li>
                  </ul>
                </div>
              </section>

              {/* 제3조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제3조 (개인정보의 보유 및 이용 기간)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                  <p>② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>회원 가입 및 관리: 회원 탈퇴 시까지. 다만, 다음의 사유에 해당하는 경우에는 해당 사유 종료 시까지
                      <ul className="list-circle pl-8 mt-2 space-y-1">
                        <li>관계 법령 위반에 따른 수사·조사 등이 진행중인 경우: 해당 수사·조사 종료 시까지</li>
                        <li>서비스 이용에 따른 채권·채무관계 잔존 시: 해당 채권·채무관계 정산 시까지</li>
                      </ul>
                    </li>
                    <li>전자상거래에서의 계약·청약철회 등에 관한 기록: 5년</li>
                    <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                    <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                  </ul>
                </div>
              </section>

              {/* 제4조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제4조 (개인정보의 제3자 제공)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 회사는 이용자의 개인정보를 제1조(개인정보의 수집 및 이용 목적)에서 명시한 범위 내에서만 처리하며, 이용자의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
                  <p>② 회사는 다음과 같이 개인정보를 제3자에게 제공하고 있습니다:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>제공받는 자: 공간 제공자</li>
                    <li>제공 목적: 예약 확인 및 공간 이용 지원</li>
                    <li>제공 항목: 이름, 휴대전화번호, 예약 정보</li>
                    <li>보유 및 이용 기간: 예약 서비스 종료 시까지</li>
                  </ul>
                </div>
              </section>

              {/* 제5조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제5조 (개인정보 처리의 위탁)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>결제 처리 업체: 결제 대행 및 결제 정보 관리</li>
                    <li>SMS/이메일 발송 업체: 예약 확인, 이벤트 정보 발송</li>
                  </ul>
                  <p>② 회사는 위탁계약 체결 시 개인정보보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</p>
                </div>
              </section>

              {/* 제6조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 이용자는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>개인정보 열람 요구</li>
                    <li>오류 등이 있을 경우 정정 요구</li>
                    <li>삭제 요구</li>
                    <li>처리정지 요구</li>
                  </ul>
                  <p>② 제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체없이 조치하겠습니다.</p>
                  <p>③ 이용자가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.</p>
                </div>
              </section>

              {/* 제7조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제7조 (개인정보의 파기)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
                  <p>② 개인정보 파기의 절차 및 방법은 다음과 같습니다:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>파기절차: 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.</li>
                    <li>파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
                  </ul>
                </div>
              </section>

              {/* 제8조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제8조 (개인정보의 안전성 확보 조치)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
                    <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
                    <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
                  </ul>
                </div>
              </section>

              {/* 제9조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제9조 (개인정보 보호책임자)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:</p>
                  <div className="bg-accent/30 p-6 rounded-lg space-y-2">
                    <p><strong>개인정보 보호책임자</strong></p>
                    <p>성명: 홍길동</p>
                    <p>직책: 개인정보보호팀장</p>
                    <p>연락처: privacy@yourspace.com</p>
                    <p>전화번호: 1588-0000</p>
                  </div>
                  <p>② 이용자는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.</p>
                </div>
              </section>

              {/* 제10조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제10조 (개인정보 처리방침 변경)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
                </div>
              </section>

              {/* 부칙 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">부칙</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  본 방침은 2026년 1월 1일부터 시행합니다.
                </p>
              </section>
            </div>

            {/* 문의 안내 */}
            <div className="mt-16 p-8 bg-accent/30 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">개인정보 관련 문의</h3>
              <p className="text-lg text-muted-foreground mb-4">
                개인정보처리방침과 관련하여 궁금한 사항이 있으시면 고객센터 또는 개인정보 보호책임자에게 문의해주세요.
              </p>
              <a
                href="/support"
                className="inline-block px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                고객센터 바로가기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

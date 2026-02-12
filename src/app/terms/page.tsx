import { Sparkles } from 'lucide-react'

export default function TermsPage () {
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
              <span className="tracking-wide">서비스 이용약관</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight [letter-spacing:-0.03em]">
              이용약관
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light max-w-2xl mx-auto [letter-spacing:-0.01em]">
              Your Space 서비스 이용약관
            </p>
          </div>
        </div>
      </div>

      {/* 약관 내용 섹션 */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            <div className="space-y-12">
              {/* 제1조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제1조 (목적)</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  본 약관은 Your Space(이하 "회사")가 제공하는 공간 예약 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              {/* 제2조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제2조 (정의)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① "서비스"란 회사가 제공하는 공간 예약 및 관련 부가서비스를 의미합니다.</p>
                  <p>② "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</p>
                  <p>③ "회원"이란 회사와 서비스 이용계약을 체결하고 회원 아이디를 부여받은 자를 말합니다.</p>
                  <p>④ "예약"이란 이용자가 회사가 제공하는 플랫폼을 통해 공간의 사용을 신청하고 회사가 이를 승인한 것을 말합니다.</p>
                </div>
              </section>

              {/* 제3조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제3조 (약관의 효력 및 변경)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 본 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력이 발생합니다.</p>
                  <p>② 회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있습니다.</p>
                  <p>③ 회사가 약관을 변경할 경우 적용일자 및 변경사유를 명시하여 현행 약관과 함께 서비스 초기화면에 그 적용일자 7일 전부터 적용일자 전일까지 공지합니다.</p>
                  <p>④ 이용자가 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고 회원 탈퇴를 할 수 있습니다.</p>
                </div>
              </section>

              {/* 제4조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제4조 (회원가입)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</p>
                  <p>② 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                    <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                    <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                  </ul>
                  <p>③ 회원가입계약의 성립시기는 회사의 승낙이 회원에게 도달한 시점으로 합니다.</p>
                </div>
              </section>

              {/* 제5조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제5조 (예약 및 이용)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 이용자는 회사가 제공하는 플랫폼을 통해 공간을 검색하고 예약할 수 있습니다.</p>
                  <p>② 예약은 결제가 완료된 시점에 확정됩니다.</p>
                  <p>③ 이용자는 예약한 시간에 맞춰 공간을 이용해야 하며, 예약 시간을 초과하여 이용할 수 없습니다.</p>
                  <p>④ 이용자는 공간 이용 시 다음 사항을 준수해야 합니다:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>공간의 시설물을 훼손하지 않을 것</li>
                    <li>다른 이용자에게 피해를 주는 행위를 하지 않을 것</li>
                    <li>공간 제공자가 정한 이용 규칙을 준수할 것</li>
                  </ul>
                </div>
              </section>

              {/* 제6조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제6조 (결제)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 이용자는 서비스 이용에 대한 대금을 회사가 정한 결제 수단을 통해 지불해야 합니다.</p>
                  <p>② 회사는 이용자가 선택한 결제 수단에 대해 정당한 사용권한을 가지고 있는지 확인할 수 있으며, 필요한 경우 거래를 중단하거나 해당 거래를 취소할 수 있습니다.</p>
                  <p>③ 결제 과정에서 발생한 오류에 대해서는 회사에 통보하여야 하며, 회사는 확인 후 적절한 조치를 취합니다.</p>
                </div>
              </section>

              {/* 제7조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제7조 (취소 및 환불)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 이용자는 예약 시간 24시간 전까지 예약을 취소할 수 있으며, 이 경우 전액 환불됩니다.</p>
                  <p>② 예약 시간 24시간 이내 취소 시에는 예약 금액의 50%가 취소 수수료로 부과됩니다.</p>
                  <p>③ 예약 시간 이후에는 환불이 불가능합니다.</p>
                  <p>④ 환불은 결제한 방법과 동일한 방법으로 진행되며, 영업일 기준 3-5일이 소요될 수 있습니다.</p>
                </div>
              </section>

              {/* 제8조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제8조 (회원 탈퇴 및 자격 상실)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 회원은 언제든지 서비스 이용을 원하지 않는 경우 회원 탈퇴를 요청할 수 있습니다.</p>
                  <p>② 회사는 회원이 다음 각 호의 사유에 해당하는 경우, 회원자격을 제한 또는 정지시킬 수 있습니다:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>가입 신청 시 허위 내용을 등록한 경우</li>
                    <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
                    <li>서비스를 이용하여 법령 또는 본 약관이 금지하는 행위를 하는 경우</li>
                  </ul>
                </div>
              </section>

              {/* 제9조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제9조 (책임 제한)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
                  <p>② 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</p>
                  <p>③ 회사는 이용자가 서비스를 이용하여 기대하는 수익을 얻지 못한 것에 대하여 책임을 지지 않으며, 서비스를 통하여 얻은 자료로 인한 손해에 대하여도 책임을 지지 않습니다.</p>
                </div>
              </section>

              {/* 제10조 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">제10조 (분쟁 해결)</h2>
                <div className="space-y-3 text-lg text-muted-foreground leading-relaxed">
                  <p>① 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.</p>
                  <p>② 본 약관과 관련하여 회사와 이용자 간에 발생한 분쟁에 대해서는 대한민국 법을 적용하며, 소송이 필요한 경우 회사의 본사 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.</p>
                </div>
              </section>

              {/* 부칙 */}
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">부칙</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  본 약관은 2026년 1월 1일부터 시행합니다.
                </p>
              </section>
            </div>

            {/* 문의 안내 */}
            <div className="mt-16 p-8 bg-accent/30 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">이용약관 관련 문의</h3>
              <p className="text-lg text-muted-foreground mb-4">
                이용약관과 관련하여 궁금한 사항이 있으시면 고객센터로 문의해주세요.
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

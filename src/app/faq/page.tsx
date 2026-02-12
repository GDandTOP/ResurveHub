'use client'

import { useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    category: '예약 관련',
    items: [
      {
        question: '예약은 어떻게 하나요?',
        answer: '공간 목록에서 원하는 공간을 선택하고, 날짜와 시간을 선택한 후 결제를 진행하시면 예약이 완료됩니다. 자세한 내용은 "예약 방법" 페이지를 참고해주세요.'
      },
      {
        question: '최소 예약 시간은 얼마인가요?',
        answer: '최소 1시간 단위로 예약 가능합니다. 시간 단위로 추가 예약이 가능하며, 필요한 시간만큼 자유롭게 선택하실 수 있습니다.'
      },
      {
        question: '당일 예약도 가능한가요?',
        answer: '네, 당일 예약도 가능합니다. 실시간으로 예약 가능 여부를 확인하고 즉시 예약하실 수 있습니다.'
      },
      {
        question: '예약 확인은 어떻게 하나요?',
        answer: '예약 완료 후 이메일로 예약 확인서가 발송됩니다. 또한 마이페이지에서 언제든지 예약 내역을 확인하실 수 있습니다.'
      }
    ]
  },
  {
    category: '결제 관련',
    items: [
      {
        question: '어떤 결제 방법을 사용할 수 있나요?',
        answer: '신용카드, 체크카드, 계좌이체 등 다양한 결제 방법을 지원합니다. 안전한 결제 시스템으로 안심하고 이용하실 수 있습니다.'
      },
      {
        question: '결제 영수증을 받을 수 있나요?',
        answer: '네, 결제 완료 후 이메일로 영수증이 자동 발송됩니다. 마이페이지에서도 영수증을 다운로드하실 수 있습니다.'
      },
      {
        question: '법인 결제도 가능한가요?',
        answer: '네, 법인카드 결제 및 세금계산서 발행이 가능합니다. 고객센터로 문의해주시면 안내해드리겠습니다.'
      }
    ]
  },
  {
    category: '취소 및 환불',
    items: [
      {
        question: '예약 취소는 어떻게 하나요?',
        answer: '마이페이지에서 예약 내역을 확인하고 취소 버튼을 클릭하시면 됩니다. 취소 정책에 따라 환불이 진행됩니다.'
      },
      {
        question: '취소 수수료는 얼마인가요?',
        answer: '예약일 24시간 전까지는 무료 취소가 가능합니다. 24시간 이내 취소 시 예약 금액의 50%가 취소 수수료로 부과되며, 예약 시간 이후에는 환불이 불가능합니다.'
      },
      {
        question: '환불은 언제 되나요?',
        answer: '취소 신청 후 영업일 기준 3-5일 이내에 결제하신 방법으로 환불됩니다. 카드 결제의 경우 카드사 정책에 따라 처리 기간이 다를 수 있습니다.'
      },
      {
        question: '예약 시간을 변경할 수 있나요?',
        answer: '예약 변경은 기존 예약을 취소하고 새로 예약하셔야 합니다. 취소 정책이 적용되므로 가급적 예약 전에 시간을 신중히 선택해주세요.'
      }
    ]
  },
  {
    category: '이용 관련',
    items: [
      {
        question: '체크인은 어떻게 하나요?',
        answer: '예약 시간에 맞춰 공간에 방문하시면 됩니다. 예약 확인서를 지참하시거나 마이페이지에서 예약 정보를 보여주시면 됩니다.'
      },
      {
        question: '늦게 도착하면 어떻게 되나요?',
        answer: '예약 시간 15분 전까지 도착하시는 것을 권장합니다. 늦게 도착하시더라도 예약 시간은 변경되지 않으며, 종료 시간은 예약한 시간 그대로 적용됩니다.'
      },
      {
        question: '공간에서 음식물 섭취가 가능한가요?',
        answer: '간단한 간식과 음료는 가능하지만, 강한 냄새가 나는 음식은 제한될 수 있습니다. 각 공간의 상세 규정을 확인해주세요.'
      },
      {
        question: '주차는 가능한가요?',
        answer: '대부분의 공간에서 주차 공간을 제공합니다. 주차 가능 여부와 비용은 각 공간의 상세 페이지에서 확인하실 수 있습니다.'
      }
    ]
  },
  {
    category: '회원 관련',
    items: [
      {
        question: '회원가입이 필수인가요?',
        answer: '예약을 위해서는 회원가입이 필요합니다. 간편하게 가입하시고 다양한 혜택을 받으실 수 있습니다.'
      },
      {
        question: '회원 혜택은 무엇인가요?',
        answer: '예약 시 적립금 적립, 할인 쿠폰 제공, 우선 예약 등 다양한 혜택을 받으실 수 있습니다.'
      },
      {
        question: '개인정보는 안전하게 관리되나요?',
        answer: '네, 개인정보보호법에 따라 안전하게 관리되며, 서비스 이용 목적 외에는 사용되지 않습니다. 자세한 내용은 개인정보처리방침을 참고해주세요.'
      }
    ]
  }
]

function FAQItem ({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between bg-background hover:bg-accent/50 transition-colors text-left"
      >
        <span className="font-semibold text-lg pr-4">{question}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="px-6 py-5 bg-accent/30 text-muted-foreground leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  )
}

export default function FAQPage () {
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
              <span className="tracking-wide">자주 묻는 질문</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tight [letter-spacing:-0.03em]">
              FAQ
            </h1>
            <p className="text-xl md:text-2xl opacity-90 font-light max-w-2xl mx-auto [letter-spacing:-0.01em]">
              궁금하신 내용을 찾아보세요
              <br />
              빠르게 해결해드리겠습니다
            </p>
          </div>
        </div>
      </div>

      {/* FAQ 섹션 */}
      <div className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqs.map((category) => (
              <div key={category.category}>
                <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-primary/20">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.items.map((item, index) => (
                    <FAQItem
                      key={index}
                      question={item.question}
                      answer={item.answer}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 추가 문의 섹션 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-primary/90 py-24 text-primary-foreground">
        <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:30px_30px]" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-5xl font-black [letter-spacing:-0.03em]">
              더 궁금한 사항이 있으신가요?
            </h2>
            <p className="text-2xl opacity-90 font-light [letter-spacing:-0.01em]">
              고객센터를 통해 문의해주시면 친절하게 답변해드리겠습니다
            </p>
            <div className="pt-4">
              <a
                href="/support"
                className="inline-flex items-center justify-center px-12 h-16 text-2xl font-bold bg-white text-primary rounded-lg shadow-2xl hover:shadow-3xl transition-all hover:scale-105 [letter-spacing:-0.01em]"
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

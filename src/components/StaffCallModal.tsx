import React, { useEffect } from 'react';
import { Bell, Phone, CheckCircle, X, ShieldAlert, HeartHandshake } from 'lucide-react';
import { speakText } from '../lib/tts';

interface StaffCallModalProps {
  onClose: () => void;
}

export const StaffCallModal: React.FC<StaffCallModalProps> = ({ onClose }) => {
  useEffect(() => {
    const text =
      '환자분, 안내 직원을 호출하였습니다. 로비 전담 직원이 곧 현재 계신 자리로 오니 잠시만 편안히 기다려 주세요.';
    speakText(text);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-white border-4 border-rose-500 text-slate-900 rounded-3xl max-w-xl w-full p-8 shadow-2xl space-y-6 text-center animate-bounce-short">
        <div className="w-24 h-24 rounded-full bg-rose-100 border-4 border-rose-400 text-rose-600 flex items-center justify-center mx-auto animate-pulse">
          <Bell className="w-14 h-14" />
        </div>

        <div>
          <span className="bg-rose-100 text-rose-800 border border-rose-300 text-base font-black px-4 py-1 rounded-full inline-block mb-3">
            직원 호출 접수 완료
          </span>
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
            로비 전담 직원을 호출했습니다
          </h3>
          <p className="text-slate-700 text-xl sm:text-2xl leading-relaxed mt-2 font-medium">
            전담 안내 직원이 <strong className="text-rose-600 font-black">1번 단말기</strong> 자리로 즉시 이동하고 있습니다. 다른 곳으로 이동하지 마시고 잠시만 기다려 주세요.
          </p>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 text-amber-900 text-lg font-bold flex items-center justify-center gap-2">
          <HeartHandshake className="w-6 h-6 text-amber-700 flex-shrink-0" />
          <span>거동이 불편하시거나 휠체어가 필요하시면 직원에게 말씀해 주세요.</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-[64px] bg-rose-600 hover:bg-rose-500 text-white font-black text-2xl rounded-2xl border-2 border-rose-400 active:scale-95 transition-all shadow-lg"
        >
          확인 (호출 창 닫기)
        </button>
      </div>
    </div>
  );
};

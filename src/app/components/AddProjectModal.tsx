import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Plus, Edit2, Calendar, Wrench, FileText, Languages, PlayCircle, Github, User, Users } from 'lucide-react';
import type { Project } from '../context/ProjectsContext';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: Project) => void;
  initialData?: Project | null;
  mode?: 'add' | 'edit';
  lang?: 'ko' | 'en';
}

const t = (lang: 'ko' | 'en') => ({
  editTitle: lang === 'ko' ? '프로젝트 수정' : 'Edit Project',
  addTitle: lang === 'ko' ? '새 프로젝트 추가' : 'Add New Project',
  title: lang === 'ko' ? '프로젝트 제목' : 'Project Title',
  titlePh: lang === 'ko' ? '프로젝트 제목을 입력하세요' : 'Enter project title',
  titleEn: lang === 'ko' ? '영어 제목 (EN 모드에 표시)' : 'English Title (shown in EN mode)',
  titleEnPh: 'English title',
  translateBtn: lang === 'ko' ? '자동 번역' : 'Auto Translate',
  translating: lang === 'ko' ? '번역 중…' : 'Translating…',
  translateFail: lang === 'ko' ? '번역 실패, 직접 입력해 주세요.' : 'Translation failed, please enter manually.',
  category: lang === 'ko' ? '카테고리' : 'Category',
  categoryPh: lang === 'ko' ? '예: UX Research, UI Design' : 'e.g., UX Research, UI Design',
  image: lang === 'ko' ? '썸네일 이미지 URL' : 'Thumbnail Image URL',
  imageHint: lang === 'ko' ? '비워두면 제목을 바탕으로 자동 생성됩니다' : 'Left empty, a thumbnail is generated from the title',
  prototypeLink: lang === 'ko' ? '프로토타입 링크' : 'Prototype Link',
  githubLink: lang === 'ko' ? 'GitHub 링크' : 'GitHub Link',
  linkHint: lang === 'ko' ? '입력하면 카드와 상세 페이지에 칩으로 표시됩니다' : 'Shown as a chip on the card and detail page',
  date: lang === 'ko' ? '날짜 (비어있으면 오늘 날짜)' : 'Date (auto-fills today if empty)',
  tools: lang === 'ko' ? '사용 툴' : 'Tools Used',
  toolsPh: lang === 'ko' ? '예: Figma, Notion' : 'e.g., Figma, Notion',
  teamType: lang === 'ko' ? '작업 형태' : 'Work Type',
  solo: lang === 'ko' ? '개인 작업' : 'Solo',
  team: lang === 'ko' ? '팀 작업' : 'Team',
  description: lang === 'ko' ? '프로젝트 설명' : 'Project Description',
  descriptionHint: lang === 'ko' ? '상세 페이지의 제목 아래에 표시됩니다' : 'Shown under the title on the detail page',
  cancel: lang === 'ko' ? '취소' : 'Cancel',
  save: lang === 'ko' ? '수정 완료' : 'Save Changes',
  add: lang === 'ko' ? '프로젝트 등록' : 'Add Project',
});

const emptyForm = {
  title: '',
  titleEn: '',
  category: '',
  imageUrl: '',
  prototypeLink: '',
  githubLink: '',
  date: '',
  tools: '',
  teamType: 'solo' as 'solo' | 'team',
  description: '',
};

export const AddProjectModal = ({ isOpen, onClose, onAdd, initialData, mode = 'add', lang = 'ko' }: AddProjectModalProps) => {
  const L = t(lang);
  const [formData, setFormData] = useState(emptyForm);
  const [isTranslating, setIsTranslating] = useState(false);

  const translateTitle = async () => {
    const text = formData.title.trim();
    if (!text) return;
    setIsTranslating(true);
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ko|en`
      );
      const data = await res.json();
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        setFormData(prev => ({ ...prev, titleEn: data.responseData.translatedText }));
      } else {
        alert(L.translateFail);
      }
    } catch {
      alert(L.translateFail);
    } finally {
      setIsTranslating(false);
    }
  };

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        titleEn: initialData.titleEn || '',
        category: initialData.category || '',
        imageUrl: initialData.imageUrl || '',
        prototypeLink: initialData.prototypeLink || '',
        githubLink: initialData.githubLink || '',
        date: initialData.date || '',
        tools: initialData.tools || '',
        teamType: initialData.teamType || 'solo',
        description: initialData.description || '',
      });
    } else {
      setFormData(emptyForm);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    // Firebase는 undefined를 저장하지 못하므로 빈 값은 빈 문자열로 넘긴다
    onAdd({ ...formData, date: formData.date || today });
    onClose();
  };

  const inputCls = "w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#810000] transition-all text-gray-900";
  const labelCls = "text-sm font-bold text-gray-900 ml-1 flex items-center gap-2";
  const hintCls = "text-xs text-gray-400 ml-1";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 pb-5 border-b border-gray-100 bg-white z-10 flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {mode === 'edit' ? L.editTitle : L.addTitle}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="size-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-6 custom-scrollbar">
              <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className={labelCls}>{L.title}</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={L.titlePh}
                    className={inputCls}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelCls}><Languages className="size-4" />{L.titleEn}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder={L.titleEnPh}
                      className={`${inputCls} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={translateTitle}
                      disabled={isTranslating || !formData.title.trim()}
                      className="px-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                    >
                      {isTranslating ? L.translating : L.translateBtn}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelCls}>{L.category}</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder={L.categoryPh}
                    className={inputCls}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelCls}>{L.image}</label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className={`${inputCls} pr-12`}
                    />
                    <Upload className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
                  </div>
                  <p className={hintCls}>{L.imageHint}</p>
                  {formData.imageUrl && (
                    <div className="mt-3 aspect-video w-full rounded-2xl overflow-hidden bg-gray-100">
                      <img src={formData.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className={labelCls}><PlayCircle className="size-4" />{L.prototypeLink}</label>
                  <input
                    type="url"
                    value={formData.prototypeLink}
                    onChange={(e) => setFormData({ ...formData, prototypeLink: e.target.value })}
                    placeholder="https://figma.com/proto/..."
                    className={inputCls}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelCls}><Github className="size-4" />{L.githubLink}</label>
                  <input
                    type="url"
                    value={formData.githubLink}
                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                    placeholder="https://github.com/..."
                    className={inputCls}
                  />
                  <p className={hintCls}>{L.linkHint}</p>
                </div>

                <div className="space-y-2">
                  <label className={labelCls}><Calendar className="size-4" />{L.date}</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelCls}><Wrench className="size-4" />{L.tools}</label>
                  <input
                    type="text"
                    value={formData.tools}
                    onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                    placeholder={L.toolsPh}
                    className={inputCls}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelCls}>{L.teamType}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { value: 'solo' as const, label: L.solo, Icon: User },
                      { value: 'team' as const, label: L.team, Icon: Users },
                    ]).map(({ value, label, Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData({ ...formData, teamType: value })}
                        className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                          formData.teamType === value
                            ? 'bg-[#810000] text-white'
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="size-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelCls}><FileText className="size-4" />{L.description}</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`${inputCls} h-32 resize-none`}
                  />
                  <p className={hintCls}>{L.descriptionHint}</p>
                </div>
              </form>
            </div>

            <div className="p-6 bg-gray-50/50 flex gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
              >
                {L.cancel}
              </button>
              <button
                form="project-form"
                type="submit"
                className="flex-[2] px-6 py-3.5 bg-[#810000] text-white font-bold rounded-2xl hover:bg-[#1A1512] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {mode === 'edit' ? <Edit2 className="size-4" /> : <Plus className="size-4" />}
                {mode === 'edit' ? L.save : L.add}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

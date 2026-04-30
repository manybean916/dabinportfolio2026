import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Plus, Edit2, Link as LinkIcon, Calendar, Users, Tag, BookOpen, FileText, Languages } from 'lucide-react';

interface ProjectData {
  id?: string;
  title: string;
  titleEn?: string;
  category: string;
  imageUrl: string;
  description: string;
  link?: string;
  date?: string;
  collaborators?: string;
  keywords?: string[];
  subject?: string;
  workNotes?: string;
}

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: ProjectData) => void;
  initialData?: ProjectData | null;
  mode?: 'add' | 'edit';
  lang?: 'ko' | 'en';
}

const t = (lang: 'ko' | 'en') => ({
  editTitle: lang === 'ko' ? '프로젝트 수정' : 'Edit Project',
  addTitle: lang === 'ko' ? '새 프로젝트 추가' : 'Add New Project',
  title: lang === 'ko' ? '프로젝트 제목 (한국어)' : 'Project Title (Korean)',
  titlePh: lang === 'ko' ? '프로젝트 제목을 입력하세요' : 'Enter project title',
  titleEn: lang === 'ko' ? '영어 제목 (EN 모드에 표시)' : 'English Title (shown in EN mode)',
  titleEnPh: 'English title',
  translateBtn: lang === 'ko' ? '자동 번역' : 'Auto Translate',
  translating: lang === 'ko' ? '번역 중…' : 'Translating…',
  translateFail: lang === 'ko' ? '번역 실패, 직접 입력해 주세요.' : 'Translation failed, please enter manually.',
  category: lang === 'ko' ? '카테고리' : 'Category',
  categoryPh: lang === 'ko' ? '예: UX Research, UI Design' : 'e.g., UX Research, UI Design',
  image: lang === 'ko' ? '썸네일 이미지 URL' : 'Thumbnail Image URL',
  imagePh: lang === 'ko' ? 'https://images.unsplash.com/...' : 'https://images.unsplash.com/...',
  link: lang === 'ko' ? '연결할 링크 (URL)' : 'Project Link (URL)',
  linkPh: lang === 'ko' ? 'https://behance.net/...' : 'https://behance.net/...',
  date: lang === 'ko' ? '날짜 (비어있으면 오늘 날짜로 자동 입력)' : 'Date (auto-fills today if empty)',
  collaborators: lang === 'ko' ? '공동작업자 (비어있으면 개인 작업)' : 'Collaborators (leave empty for solo)',
  collaboratorsPh: lang === 'ko' ? '예: 홍길동, 김철수' : 'e.g., John Doe, Jane Smith',
  keywords: lang === 'ko' ? '키워드 (Enter로 추가)' : 'Keywords (Press Enter to add)',
  keywordsPh: lang === 'ko' ? '키워드 입력 후 Enter' : 'Type keyword and press Enter',
  subject: lang === 'ko' ? '과목 / 수업명' : 'Subject / Course',
  subjectPh: lang === 'ko' ? '예: UX 디자인 스튜디오' : 'e.g., UX Design Studio',
  workNotes: lang === 'ko' ? '작업 메모' : 'Work Notes',
  workNotesPh: lang === 'ko' ? '간단한 메모나 작업 노트' : 'Short memo or work description',
  description: lang === 'ko' ? '설명' : 'Description',
  descriptionPh: lang === 'ko' ? '프로젝트에 대한 간단한 설명' : 'Brief project description',
  cancel: lang === 'ko' ? '취소' : 'Cancel',
  save: lang === 'ko' ? '수정 완료' : 'Save Changes',
  add: lang === 'ko' ? '프로젝트 등록' : 'Add Project',
});

const emptyForm = {
  id: '',
  title: '',
  titleEn: '',
  category: '',
  imageUrl: '',
  description: '',
  link: '',
  date: '',
  collaborators: '',
  keywords: [] as string[],
  subject: '',
  workNotes: '',
};

export const AddProjectModal = ({ isOpen, onClose, onAdd, initialData, mode = 'add', lang = 'ko' }: AddProjectModalProps) => {
  const L = t(lang);
  const [formData, setFormData] = useState(emptyForm);
  const [keywordInput, setKeywordInput] = useState('');
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
        id: initialData.id || '',
        title: initialData.title || '',
        titleEn: initialData.titleEn || '',
        category: initialData.category || '',
        imageUrl: initialData.imageUrl || '',
        description: initialData.description || '',
        link: initialData.link || '',
        date: initialData.date || '',
        collaborators: initialData.collaborators || '',
        keywords: Array.isArray(initialData.keywords) ? initialData.keywords : [],
        subject: initialData.subject || '',
        workNotes: initialData.workNotes || '',
      });
    } else {
      setFormData(emptyForm);
    }
    setKeywordInput('');
  }, [initialData, isOpen]);

  const addKeyword = () => {
    const k = keywordInput.trim();
    if (!k) return;
    if (formData.keywords.includes(k)) {
      setKeywordInput('');
      return;
    }
    setFormData({ ...formData, keywords: [...formData.keywords, k] });
    setKeywordInput('');
  };

  const removeKeyword = (k: string) => {
    setFormData({ ...formData, keywords: formData.keywords.filter(x => x !== k) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) return;
    const today = new Date().toISOString().slice(0, 10);
    const payload: ProjectData = {
      ...formData,
      date: formData.date || today,
    };
    onAdd(payload);
    onClose();
  };

  const inputCls = "w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-stone-500 transition-all text-gray-900";

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 md:p-10 pb-4 border-b border-gray-50 bg-white z-10 flex justify-between items-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-pretendard)' }}>
                {mode === 'edit' ? L.editTitle : L.addTitle}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="size-6 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-10 pt-4 custom-scrollbar">
              <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">{L.title}</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={L.titlePh}
                    className={inputCls}
                    style={{ fontFamily: 'var(--font-pretendard)' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1 flex items-center gap-2">
                    <Languages className="size-4" />{L.titleEn}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder={L.titleEnPh}
                      className={`${inputCls} flex-1`}
                      style={{ fontFamily: 'var(--font-pretendard)' }}
                    />
                    <button
                      type="button"
                      onClick={translateTitle}
                      disabled={isTranslating || !formData.title.trim()}
                      className="px-4 py-3 bg-stone-100 text-stone-700 font-bold rounded-2xl hover:bg-stone-200 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-sm whitespace-nowrap flex items-center gap-1.5"
                      style={{ fontFamily: 'var(--font-pretendard)' }}
                    >
                      {isTranslating ? (
                        <span className="animate-pulse">{L.translating}</span>
                      ) : (
                        <><Languages className="size-4" />{L.translateBtn}</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">{L.category}</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder={L.categoryPh}
                    className={inputCls}
                    style={{ fontFamily: 'var(--font-pretendard)' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">{L.image}</label>
                  <div className="relative">
                    <input
                      required
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder={L.imagePh}
                      className={`${inputCls} pr-12`}
                      style={{ fontFamily: 'var(--font-pretendard)' }}
                    />
                    <Upload className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
                  </div>
                  {formData.imageUrl && (
                    <div className="mt-3 relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 ring-1 ring-black/5">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=Invalid+Image+URL';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">{L.link}</label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder={L.linkPh}
                      className={`${inputCls} pr-12`}
                      style={{ fontFamily: 'var(--font-pretendard)' }}
                    />
                    <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1 flex items-center gap-2"><Calendar className="size-4" />{L.date}</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={inputCls}
                    style={{ fontFamily: 'var(--font-pretendard)' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1 flex items-center gap-2"><Users className="size-4" />{L.collaborators}</label>
                  <input
                    type="text"
                    value={formData.collaborators}
                    onChange={(e) => setFormData({ ...formData, collaborators: e.target.value })}
                    placeholder={L.collaboratorsPh}
                    className={inputCls}
                    style={{ fontFamily: 'var(--font-pretendard)' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1 flex items-center gap-2"><Tag className="size-4" />{L.keywords}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addKeyword();
                        }
                      }}
                      placeholder={L.keywordsPh}
                      className={`${inputCls} flex-1`}
                      style={{ fontFamily: 'var(--font-pretendard)' }}
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="px-5 bg-stone-900 text-white font-bold rounded-2xl hover:bg-black transition-all active:scale-95"
                    >
                      <Plus className="size-5" />
                    </button>
                  </div>
                  {formData.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.keywords.map((k) => (
                        <span
                          key={k}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 text-stone-700 rounded-full text-sm font-medium"
                        >
                          {k}
                          <button
                            type="button"
                            onClick={() => removeKeyword(k)}
                            className="hover:text-stone-900"
                          >
                            <X className="size-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1 flex items-center gap-2"><BookOpen className="size-4" />{L.subject}</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={L.subjectPh}
                    className={inputCls}
                    style={{ fontFamily: 'var(--font-pretendard)' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1 flex items-center gap-2"><FileText className="size-4" />{L.workNotes}</label>
                  <textarea
                    value={formData.workNotes}
                    onChange={(e) => setFormData({ ...formData, workNotes: e.target.value })}
                    placeholder={L.workNotesPh}
                    className={`${inputCls} h-24 resize-none`}
                    style={{ fontFamily: 'var(--font-pretendard)' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 ml-1">{L.description}</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={L.descriptionPh}
                    className={`${inputCls} h-32 resize-none`}
                    style={{ fontFamily: 'var(--font-pretendard)' }}
                  />
                </div>
              </form>
            </div>

            <div className="p-8 bg-gray-50/50 flex gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
                style={{ fontFamily: 'var(--font-pretendard)' }}
              >
                {L.cancel}
              </button>
              <button
                form="project-form"
                type="submit"
                className="flex-[2] px-6 py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-black shadow-lg shadow-stone-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{ fontFamily: 'var(--font-pretendard)' }}
              >
                {mode === 'edit' ? <Edit2 className="size-5" /> : <Plus className="size-5" />}
                {mode === 'edit' ? L.save : L.add}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

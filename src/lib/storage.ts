import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB — storage.rules의 제한과 맞춘다

export class UploadError extends Error {}

/**
 * 프로젝트 갤러리 이미지 여러 장을 Firebase Storage에 올리고 다운로드 URL 배열을 반환한다.
 * projectKey는 새 프로젝트도 저장 전에 경로를 가질 수 있도록 클라이언트에서 미리 생성한 임시 id를 받는다.
 */
export async function uploadProjectImages(
  files: File[],
  projectKey: string,
  onProgress?: (done: number, total: number) => void
): Promise<string[]> {
  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.type.startsWith('image/')) {
      throw new UploadError(`${file.name}은(는) 이미지 파일이 아닙니다.`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new UploadError(`${file.name}이(가) 10MB를 넘습니다.`);
    }

    const safeName = file.name.replace(/[^\w.\-]/g, '_');
    const path = `projects/${projectKey}/${Date.now()}-${i}-${safeName}`;
    const fileRef = ref(storage, path);

    await uploadBytes(fileRef, file);
    urls.push(await getDownloadURL(fileRef));
    onProgress?.(i + 1, files.length);
  }

  return urls;
}

/** 갤러리에서 이미지를 뺄 때 Storage에서도 실제 파일을 지운다. 실패해도 목록 편집은 막지 않는다. */
export async function deleteProjectImage(url: string): Promise<void> {
  try {
    await deleteObject(ref(storage, url));
  } catch (e) {
    console.warn('Storage 파일 삭제 실패 (URL이 Storage 소속이 아니거나 이미 삭제됨):', e);
  }
}

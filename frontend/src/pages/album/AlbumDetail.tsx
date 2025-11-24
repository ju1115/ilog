// src/pages/album/AlbumDetail.tsx
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockUser, mockPhotosByMonth, Photo } from '../../mocks/mockData';

const AlbumDetail = () => {
  const { year, month } = useParams<{ year: string; month: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 해당 월의 사진들 가져오기
  const monthKey = `${year}-${month?.padStart(2, '0')}`;
  
  // localStorage에서 저장된 사진 가져오기 또는 mock 데이터 사용
  const getInitialPhotos = (): Photo[] => {
    const savedPhotos = localStorage.getItem(`album-${monthKey}`);
    if (savedPhotos) {
      return JSON.parse(savedPhotos);
    }
    return mockPhotosByMonth[monthKey] || [];
  };
  
  const [photos, setPhotos] = useState<Photo[]>(getInitialPhotos());
  const [isEditMode, setIsEditMode] = useState(false);
  
  // photos가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(`album-${monthKey}`, JSON.stringify(photos));
  }, [photos, monthKey]);
  
  // 사진 삭제 핸들러
  const handleDeletePhoto = (photoId: string | number) => {
    setPhotos(photos.filter(photo => photo.id !== photoId));
  };

  // 사진 추가 핸들러
  const handleAddPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto: Photo = {
            id: Date.now() + Math.random(),  // number 타입
            url: e.target?.result as string,
            date: new Date().toISOString().split('T')[0],
          };
          setPhotos(prev => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      });
    }
    // 파일 입력 초기화 (같은 파일 다시 선택 가능하게)
    event.target.value = '';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between mb-10">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => navigate('/album')}
            className="bg-amber-800 text-white px-6 py-2 rounded-full
                     hover:bg-amber-900 transition-colors shadow-md
                     flex items-center gap-2"
          >
            <span>←</span>
            <span>목록으로</span>
          </button>

          {/* 제목 */}
          <h1 className="text-2xl font-bold bg-amber-800 text-white 
                       rounded-full px-10 py-3 shadow-md">
            {month}월의 {mockUser.childName}이
          </h1>

          {/* 수정하기 버튼 */}
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-6 py-2 rounded-full transition-colors shadow-md
                     ${isEditMode 
                       ? 'bg-green-600 hover:bg-green-700 text-white' 
                       : 'bg-amber-800 hover:bg-amber-900 text-white'}`}
          >
            {isEditMode ? '완료' : '수정하기'}
          </button>
        </div>

        {/* 사진이 없을 때 */}
        {photos.length === 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-amber-100 rounded-3xl p-12 border-4 border-amber-700">
              <div className="border-4 border-dashed border-amber-700 rounded-2xl 
                            bg-amber-50 p-16 text-center cursor-pointer
                            hover:bg-amber-100 transition-colors"
                   onClick={() => isEditMode && fileInputRef.current?.click()}>
                <p className="text-xl text-amber-900 font-semibold mb-2">
                  이 달의 사진이 없습니다.
                </p>
                <p className="text-lg text-amber-700">
                  {isEditMode ? '클릭하여 사진을 추가하세요!' : '일기를 작성하면 사진이 자동으로 등록됩니다.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 사진 갤러리 */}
        {photos.length > 0 && (
          <div className="bg-amber-100 rounded-3xl p-8 border-4 border-amber-700">
            <div className="grid grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square bg-white rounded-xl overflow-hidden
                           shadow-md hover:shadow-xl hover:scale-105
                           transition-all duration-300 cursor-pointer relative"
                >
                  <img
                    src={photo.url}
                    alt={`${photo.date} 사진`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* 수정 모드일 때 삭제 버튼 표시 */}
                  {isEditMode && (
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white
                               w-8 h-8 rounded-full hover:bg-red-600
                               flex items-center justify-center font-bold
                               shadow-lg z-10"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              
              {/* 수정 모드일 때 사진 추가 버튼 */}
              {isEditMode && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square bg-white rounded-xl
                           border-4 border-dashed border-amber-700
                           hover:border-amber-900 hover:bg-amber-50
                           transition-all duration-300 cursor-pointer
                           flex flex-col items-center justify-center gap-2"
                >
                  <div className="text-5xl text-amber-700">📷</div>
                  <p className="text-amber-900 font-semibold">
                    클릭하여<br />사진을 추가하세요
                  </p>
                </button>
              )}
            </div>

            {/* 숨겨진 파일 입력 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleAddPhoto}
              className="hidden"
            />

            {/* 사진 개수 표시 */}
            <div className="text-center mt-6">
              <p className="text-amber-900 font-semibold">
                총 {photos.length}장의 사진
              </p>
            </div>
          </div>
        )}

        {/* 위로가기 버튼 */}
        <button
          className="fixed bottom-8 right-8 bg-amber-800 text-white 
                   w-14 h-14 rounded-full shadow-lg
                   hover:bg-amber-900 transition-colors
                   flex items-center justify-center text-xl"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default AlbumDetail;
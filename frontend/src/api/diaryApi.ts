import { DiaryData } from "@/types/diary";
import axiosInstance, { ApiResponse } from "./axiosInstance";

const API_BASE_URL = "/diaries";

export const createDiary = async (formData: FormData) => {
  try {
    await axiosInstance.post(API_BASE_URL, formData, {
      headers: {
        // 브라우저가 자동으로 boundary를 설정하므로 Content-Type을 직접 적지 않아도 됩니다.
        // 명시해야 한다면 "Content-Type": "multipart/form-data"
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Error creating diary:", error);
    throw error;
  }
};

/**
 * 일기 목록 조회 API
 * @param groupId - 조회할 그룹의 ID
 * @returns 일기 데이터 배열 (DiaryData[])
 */
export const getDiaries = async (groupId: number): Promise<DiaryData[]> => {
  try {
    // GET /diaries?groupId=1 형식으로 요청
    const response = await axiosInstance.get<ApiResponse<DiaryData[]>>(
      API_BASE_URL,
      {
        params: { groupId },
      }
    );
    return response.data.body;
  } catch (error) {
    console.error("Error fetching diaries:", error);
    throw error;
  }
};

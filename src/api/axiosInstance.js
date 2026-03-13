// src/api/axiosInstance.js
import axios from "axios";
// local;
// const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001";

// 배포
// const baseURL =
//   process.env.REACT_APP_API_URL || "https://savee-be.azurewebsites.net";

// 배포 슬롯
// const baseURL =
//   process.env.REACT_APP_API_URL || "https://savee-be-staging.azurewebsites.net";

// 포트폴리오 배포
const baseURL =
  process.env.REACT_APP_API_URL || "https://savee-be-portfolio.onrender.com";

// Axios 인스턴스 생성
const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 인터셉터 추가: 요청 전마다 실행됨
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // 또는 쿠키에서 꺼내기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 항상 최신 토큰 적용
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 에러 처리나 공통 응답 처리
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("토큰 만료 또는 인증 오류");
      const currentPath = window.location.pathname + window.location.search;
      // 메인화면에서는 로그인 이동 처리 막기
      if (currentPath === "/") {
        return Promise.resolve({ data: {} });
      } else {
        window.location.href = `/login?redirect=${encodeURIComponent(
          currentPath,
        )}`;
      }
    }
    return Promise.reject(error);
  },
);

export default instance;

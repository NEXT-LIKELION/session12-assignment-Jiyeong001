import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [selectedGu, setSelectedGu] = useState("전체");

  const API_KEY = "45764d637079656f39376577585278";
  const fetchEvents = async () => {
    try {
      const url = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo/1/1000/`;
      console.log("요청 URL:", url);

      const response = await fetch(url);
      console.log("HTTP 상태 코드:", response.status, response.statusText);

      if (!response.ok) {
        console.error("HTTP 요청에 실패했습니다:", response.statusText);
        return;
      }

      const text = await response.text();
      console.log("원시 응답 텍스트:", text);

      const data = JSON.parse(text);
      if (data.RESULT && data.RESULT.CODE !== "INFO-200") {
        console.error("API 메시지:", data.RESULT);
        return;
      }

      const rows = data.culturalEventInfo?.row;
      if (rows && rows.length > 0) {
        setEvents(rows);
      } else {
        console.error("조회된 데이터가 없습니다.");
        setEvents([]);
      }
    } catch (error) {
      console.error("fetch 중 에러 발생:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleGuChange = (e) => {
    setSelectedGu(e.target.value);
  };

  const filteredEvents =
    selectedGu === "전체"
      ? events
      : events.filter((evt) => evt.GUNAME === selectedGu);

  const guList = [...new Set(events.map((evt) => evt.GUNAME))];

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎉 서울시 문화행사 정보</h1>

      <select
        onChange={handleGuChange}
        value={selectedGu}
        style={{ marginBottom: "20px" }}
      >
        <option value="전체">전체</option>
        {guList.map((gu, i) => (
          <option key={i} value={gu}>
            {gu}
          </option>
        ))}
      </select>

      {filteredEvents.length > 0 ? (
        <ul>
          {filteredEvents.map((evt, i) => (
            <li key={i} style={{ marginBottom: "15px" }}>
              <h2>{evt.TITLE}</h2>
              <p>
                📍 {evt.GUNAME} | {evt.PLACE}
              </p>
              <p>
                🗓️ {evt.STRTDATE} ~ {evt.END_DATE}
              </p>
              {evt.ORG_LINK && (
                <p>
                  🔗{" "}
                  <a
                    href={evt.ORG_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    상세보기
                  </a>
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>조회된 문화행사가 없습니다.</p>
      )}
    </div>
  );
}

export default App;

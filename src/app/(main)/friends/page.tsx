"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getFriends, type Friend } from "@/lib/api";

export default function FriendsPage() {
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchFriends = useCallback(
    async (currentOffset: number) => {
      if (isLoading) return;

      setIsLoading(true);
      try {
        const response = await getFriends(currentOffset, 6);

        if (response.success) {
          setFriends((prev) => [...prev, ...response.data.friends]);
          setOffset(response.data.nextOffset);
          setHasMore(response.data.nextOffset < response.data.total);
        }
      } catch (error) {
        console.error("친구 목록 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  useEffect(() => {
    fetchFriends(0);
  }, []);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchFriends(offset);
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [offset, hasMore, isLoading, fetchFriends]);

  const handleFriendClick = (userId: number, online: boolean) => {
    if (!online) return;

    if (selectedFriend === userId) {
      router.push("/call");
    } else {
      setSelectedFriend(userId);
    }
  };

  const getBirthYear = (age: number) => {
    const currentYear = new Date().getFullYear();
    return `${currentYear - age}년생`;
  };

  return (
    <div
      className="pb-[72px]"
      style={{ background: "#FFFFFF", minHeight: "100vh" }}
    >
      {/* Header */}
      <div className="pt-[72px] px-4">
        <h1
          style={{
            fontFamily: "Pretendard",
            fontWeight: 600,
            fontSize: "28px",
            lineHeight: "130%",
            letterSpacing: "-0.03em",
            color: "#111111",
          }}
        >
          친구들
        </h1>
      </div>

      {/* Friends Grid */}
      <div className="px-4 pt-16">
        <div className="flex flex-col gap-12">
          {Array.from({ length: Math.ceil(friends.length / 2) }).map(
            (_, rowIndex) => (
              <div
                key={rowIndex}
                className="flex flex-row justify-between gap-[14px]"
              >
                {friends.slice(rowIndex * 2, rowIndex * 2 + 2).map((friend) => (
                  <FriendCard
                    key={friend.userId}
                    friend={friend}
                    isSelected={selectedFriend === friend.userId}
                    onClick={() =>
                      handleFriendClick(friend.userId, friend.online)
                    }
                    getBirthYear={getBirthYear}
                  />
                ))}
                {/* 빈 공간 채우기 (홀수 개일 때) */}
                {friends.length % 2 !== 0 &&
                  rowIndex === Math.ceil(friends.length / 2) - 1 && (
                    <div style={{ width: "157px" }} />
                  )}
              </div>
            ),
          )}
        </div>

        {/* Infinite Scroll Trigger */}
        {hasMore && <div ref={loadMoreRef} className="h-4" />}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="text-gray-500">로딩 중...</div>
          </div>
        )}
      </div>
    </div>
  );
}

function FriendCard({
  friend,
  isSelected,
  onClick,
  getBirthYear,
}: {
  friend: Friend;
  isSelected: boolean;
  onClick: () => void;
  getBirthYear: (age: number) => string;
}) {
  return (
    <div
      className="flex flex-col gap-3"
      style={{ width: "157px", height: "222px" }}
    >
      {/* Profile Image */}
      <div
        className="relative cursor-pointer"
        style={{
          width: "157px",
          height: "157px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
        onClick={onClick}
      >
        <Image
          src={friend.profileImageUrl}
          alt={friend.name}
          fill
          className="object-cover"
          style={{
            filter: isSelected ? "brightness(0.4)" : "none",
          }}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            width: "157px",
            height: "35px",
            top: 0,
            left: 0,
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%)",
          }}
        />

        {/* Status Badge */}
        {!isSelected && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px 12px",
              gap: "6px",
              background: "rgba(0, 0, 0, 0.5)",
              borderRadius: "0px 0px 10px 0px",
            }}
          >
            <div
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: friend.online ? "#00FA81" : "#C0BBB6",
              }}
            />
            <span
              style={{
                fontFamily: "Pretendard",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "140%",
                letterSpacing: "-0.03em",
                color: friend.online ? "#FFFFFF" : "#C0BBB6",
              }}
            >
              {friend.online ? "들어와 있어요" : "쉬는 중"}
            </span>
          </div>
        )}

        {/* Call Button (when selected) */}
        {isSelected && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "91px",
              height: "91px",
              borderRadius: "50%",
              background: "#00DD72",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="45" height="40" viewBox="0 0 45 40" fill="none">
              <path
                d="M36.31 37.58C35.36 36.98 28 32 20 20C12 8 10 5 9 4L36.31 37.58Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Friend Info */}
      <div className="flex flex-col gap-1">
        {/* Tags */}
        <div className="flex flex-row gap-1">
          {friend.isWelfareWorker && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px 8px",
                background: "rgba(50, 170, 255, 0.15)",
                borderRadius: "4px",
              }}
            >
              <span
                style={{
                  fontFamily: "Pretendard",
                  fontWeight: 600,
                  fontSize: "12px",
                  lineHeight: "140%",
                  letterSpacing: "-0.03em",
                  color: "#0074C7",
                }}
              >
                복지사
              </span>
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 8px",
              background: "#F3F3F3",
              borderRadius: "4px",
            }}
          >
            <span
              style={{
                fontFamily: "Pretendard",
                fontWeight: 600,
                fontSize: "12px",
                lineHeight: "140%",
                letterSpacing: "-0.03em",
                color: "#7B7874",
              }}
            >
              {friend.region}
            </span>
          </div>
        </div>

        {/* Name and Details */}
        <div className="flex flex-row items-center gap-2">
          <span
            style={{
              fontFamily: "Pretendard",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "135%",
              letterSpacing: "-0.03em",
              color: "#000000",
            }}
          >
            {friend.name}
          </span>
          <div className="flex flex-row items-center gap-1">
            <span
              style={{
                fontFamily: "Pretendard",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: "135%",
                letterSpacing: "-0.03em",
                color: "#7B7874",
              }}
            >
              {getBirthYear(friend.age)}
            </span>
            <div
              style={{
                width: "2px",
                height: "2px",
                borderRadius: "50%",
                background: "#7B7874",
              }}
            />
            <span
              style={{
                fontFamily: "Pretendard",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: "135%",
                letterSpacing: "-0.03em",
                color: "#7B7874",
              }}
            >
              남성
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

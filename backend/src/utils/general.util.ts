export const formatDurationFromSecondsToMinutes = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const paddedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${minutes}:${paddedSeconds}`;
};

export const generateRandomAvatarColor = () => {
  // Pure random HSL
  const hue = Math.floor(Math.random() * 360);
  const saturation = 65 + Math.floor(Math.random() * 20); // 65-85%
  const lightness = 45 + Math.floor(Math.random() * 15); // 45-60%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// export const generateAvatarData = (name: string) => {
//   // Same logic as before, but generated once
//   if (!name) return { initials: "?", bgColor: "#6b7280" }; // gray fallback

//   // Get initials (first letter of first two words)
//   const initials = name
//     .split(" ")
//     .slice(0, 2)
//     .map((word) => word[0]?.toUpperCase() || "")
//     .join("");

//   return {
//     initials: initials || name[0]?.toUpperCase() || "?",
//     textColor: generateRandomAvatarColor(),
//   };
// };

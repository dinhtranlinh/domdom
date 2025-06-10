FBInstant.initializeAsync().then(() => {
  FBInstant.startGameAsync().then(() => {
    // Gọi khởi tạo game sau khi đã khởi động SDK
    startGame();
  });
});

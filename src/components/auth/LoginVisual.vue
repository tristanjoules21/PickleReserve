<template>
  <section class="login-visual">
    <div class="visual-content">
      <h2>Your next game starts here.</h2>
      <p>
        Join a community of players booking courts the smarter way.
        Fast, secure, and always available.
      </p>
    </div>
  </section>
</template>

<style scoped>
.login-visual {
  width: 50%;
  background-image:
    linear-gradient(rgba(23, 141, 90, 0.58), rgba(5, 88, 64, 0.64)),
    url("/login-background.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #035b48;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.visual-content {
  max-width: 500px;
}

.visual-content h2 {
  margin: 0 0 20px;
  font-size: clamp(2rem, 3.8vw, 3rem);
  line-height: 1.05;
}

.visual-content p {
  max-width: 420px;
  margin: 0;
  font-size: 1.18rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85);
}

@media (max-width: 800px) {
  .login-visual {
    width: 100%;
    min-height: 260px;
  }
}
</style>
